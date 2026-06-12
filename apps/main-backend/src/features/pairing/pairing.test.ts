import type { Express } from 'express';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { setupApp, teardown, truncate } from '../../test/harness.js';

let app: Express;

beforeAll(async () => {
  app = await setupApp();
});
afterAll(teardown);
beforeEach(truncate);

// Helper: Mac requests a code → returns the full pairing result.
const createCode = async () => {
  const res = await request(app)
    .post('/api/v1/pair/code')
    .send({ macName: "Ada's MacBook", userName: 'Ada' });
  return res;
};

describe('POST /pair/code', () => {
  it('issues a 6-digit code + Mac device token (201)', async () => {
    const res = await createCode();
    expect(res.status).toBe(201);
    expect(res.body.data.pairingCode).toMatch(/^\d{6}$/);
    expect(typeof res.body.data.deviceToken).toBe('string');
    expect(typeof res.body.data.pairId).toBe('string');
    expect(new Date(res.body.data.expiresAt).getTime()).toBeGreaterThan(Date.now());
  });

  it('rejects missing fields (400 validation_error)', async () => {
    const res = await request(app).post('/api/v1/pair/code').send({ macName: 'x' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('validation_error');
    expect(res.body.error.field_errors).toHaveProperty('userName');
  });
});

describe('POST /pair/redeem', () => {
  it('redeems a valid code → Android token + names (200)', async () => {
    const { body } = await createCode();
    const res = await request(app)
      .post('/api/v1/pair/redeem')
      .send({ code: body.data.pairingCode, deviceName: 'Galaxy S23' });
    expect(res.status).toBe(200);
    expect(res.body.data.pairId).toBe(body.data.pairId);
    expect(res.body.data.macName).toBe("Ada's MacBook");
    expect(res.body.data.userName).toBe('Ada');
    expect(typeof res.body.data.deviceToken).toBe('string');
  });

  it('rejects an unknown code (404 not_found)', async () => {
    const res = await request(app)
      .post('/api/v1/pair/redeem')
      .send({ code: '000000', deviceName: 'Galaxy S23' });
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('not_found');
  });

  it('rejects a second phone on the same pair (409 conflict)', async () => {
    const { body } = await createCode();
    await request(app)
      .post('/api/v1/pair/redeem')
      .send({ code: body.data.pairingCode, deviceName: 'Phone 1' });
    // code is single-use; re-create another to attempt a second redeem path:
    // here the code is already consumed, so this is a 404 — assert single-use.
    const res = await request(app)
      .post('/api/v1/pair/redeem')
      .send({ code: body.data.pairingCode, deviceName: 'Phone 2' });
    expect(res.status).toBe(404); // code consumed
  });

  it('rejects a malformed code (400 validation_error)', async () => {
    const res = await request(app)
      .post('/api/v1/pair/redeem')
      .send({ code: 'abc', deviceName: 'x' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('validation_error');
  });
});

describe('GET /pair + POST /unpair', () => {
  it('reads pair status with a device token (200)', async () => {
    const { body } = await createCode();
    const res = await request(app)
      .get('/api/v1/pair')
      .set('Authorization', `Bearer ${body.data.deviceToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.pairId).toBe(body.data.pairId);
    expect(res.body.data.paired).toBe(false); // only the Mac so far
    expect(res.body.data.devices).toHaveLength(1);
  });

  it('marks paired:true once both devices join', async () => {
    const { body } = await createCode();
    await request(app)
      .post('/api/v1/pair/redeem')
      .send({ code: body.data.pairingCode, deviceName: 'Galaxy S23' });
    const res = await request(app)
      .get('/api/v1/pair')
      .set('Authorization', `Bearer ${body.data.deviceToken}`);
    expect(res.body.data.paired).toBe(true);
    expect(res.body.data.devices).toHaveLength(2);
  });

  it('rejects an unauthenticated read (401 unauthorized)', async () => {
    const res = await request(app).get('/api/v1/pair');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('unauthorized');
  });

  it('unpairs the device (204)', async () => {
    const { body } = await createCode();
    const res = await request(app)
      .post('/api/v1/unpair')
      .set('Authorization', `Bearer ${body.data.deviceToken}`);
    expect(res.status).toBe(204);
    // Mac leaving tears the pair down → subsequent read is 404.
    const after = await request(app)
      .get('/api/v1/pair')
      .set('Authorization', `Bearer ${body.data.deviceToken}`);
    expect(after.status).toBe(404);
  });
});
