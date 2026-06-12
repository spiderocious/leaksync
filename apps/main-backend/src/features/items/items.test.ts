import type { Express } from 'express';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { setupApp, teardown, truncate } from '../../test/harness.js';

let app: Express;

// A paired fixture: returns both device tokens + the pairId.
const pairFixture = async () => {
  const code = await request(app)
    .post('/api/v1/pair/code')
    .send({ macName: 'Mac', userName: 'Ada' });
  const macToken = code.body.data.deviceToken as string;
  const pairId = code.body.data.pairId as string;
  const redeem = await request(app)
    .post('/api/v1/pair/redeem')
    .send({ code: code.body.data.pairingCode, deviceName: 'Phone' });
  const androidToken = redeem.body.data.deviceToken as string;
  return { macToken, androidToken, pairId };
};

beforeAll(async () => {
  app = await setupApp();
});
afterAll(teardown);
beforeEach(truncate);

describe('POST /items (android sends)', () => {
  it('stores a text item and returns it with a seqId (201)', async () => {
    const { androidToken } = await pairFixture();
    const res = await request(app)
      .post('/api/v1/items')
      .set('Authorization', `Bearer ${androidToken}`)
      .send({ kind: 'text', text: 'hello mac' });
    expect(res.status).toBe(201);
    expect(res.body.data.item.kind).toBe('text');
    expect(res.body.data.item.text).toBe('hello mac');
    expect(res.body.data.item.seqId).toBe(1);
    expect(typeof res.body.data.item.id).toBe('string');
    expect(typeof res.body.data.item.createdAt).toBe('string');
  });

  it('stores an image item by fileKey (201)', async () => {
    const { androidToken } = await pairFixture();
    const res = await request(app)
      .post('/api/v1/items')
      .set('Authorization', `Bearer ${androidToken}`)
      .send({ kind: 'image', fileKey: 'abc-123.jpg', mime: 'image/jpeg', filename: 'photo.jpg' });
    expect(res.status).toBe(201);
    expect(res.body.data.item.fileKey).toBe('abc-123.jpg');
  });

  it('rejects an image without fileKey (400 validation_error)', async () => {
    const { androidToken } = await pairFixture();
    const res = await request(app)
      .post('/api/v1/items')
      .set('Authorization', `Bearer ${androidToken}`)
      .send({ kind: 'image' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('validation_error');
  });

  it('forbids the Mac from posting (403 forbidden)', async () => {
    const { macToken } = await pairFixture();
    const res = await request(app)
      .post('/api/v1/items')
      .set('Authorization', `Bearer ${macToken}`)
      .send({ kind: 'text', text: 'nope' });
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('forbidden');
  });

  it('rejects no token (401 unauthorized)', async () => {
    const res = await request(app).post('/api/v1/items').send({ kind: 'text', text: 'x' });
    expect(res.status).toBe(401);
  });

  it('increments seqId monotonically per pair', async () => {
    const { androidToken } = await pairFixture();
    const send = (text: string) =>
      request(app).post('/api/v1/items').set('Authorization', `Bearer ${androidToken}`).send({ kind: 'text', text });
    const a = await send('one');
    const b = await send('two');
    expect(a.body.data.item.seqId).toBe(1);
    expect(b.body.data.item.seqId).toBe(2);
  });
});

describe('GET /items?since= (mac polls)', () => {
  it('returns items past the cursor with latestSeq (200)', async () => {
    const { macToken, androidToken } = await pairFixture();
    for (const t of ['a', 'b', 'c']) {
      await request(app).post('/api/v1/items').set('Authorization', `Bearer ${androidToken}`).send({ kind: 'text', text: t });
    }
    const res = await request(app)
      .get('/api/v1/items?since=0&limit=5')
      .set('Authorization', `Bearer ${macToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.items).toHaveLength(3);
    expect(res.body.data.latestSeq).toBe(3);

    // Next poll from latestSeq returns nothing new.
    const empty = await request(app)
      .get('/api/v1/items?since=3')
      .set('Authorization', `Bearer ${macToken}`);
    expect(empty.body.data.items).toHaveLength(0);
    expect(empty.body.data.latestSeq).toBe(3);
  });

  it('forbids the Android device from polling (403 forbidden)', async () => {
    const { androidToken } = await pairFixture();
    const res = await request(app)
      .get('/api/v1/items?since=0')
      .set('Authorization', `Bearer ${androidToken}`);
    expect(res.status).toBe(403);
  });
});

describe('GET /items/recent', () => {
  it('returns newest-first, capped (200)', async () => {
    const { macToken, androidToken } = await pairFixture();
    for (const t of ['old', 'mid', 'new']) {
      await request(app).post('/api/v1/items').set('Authorization', `Bearer ${androidToken}`).send({ kind: 'text', text: t });
    }
    const res = await request(app)
      .get('/api/v1/items/recent?limit=2')
      .set('Authorization', `Bearer ${macToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.items).toHaveLength(2);
    expect(res.body.data.items[0].text).toBe('new');
  });
});

describe('GET + DELETE /items/:id', () => {
  it('fetches a single item, then deletes it (200 → 204 → 404)', async () => {
    const { macToken, androidToken } = await pairFixture();
    const created = await request(app)
      .post('/api/v1/items')
      .set('Authorization', `Bearer ${androidToken}`)
      .send({ kind: 'url', text: 'https://example.com' });
    const id = created.body.data.item.id as string;

    const got = await request(app).get(`/api/v1/items/${id}`).set('Authorization', `Bearer ${macToken}`);
    expect(got.status).toBe(200);
    expect(got.body.data.item.id).toBe(id);

    const del = await request(app).delete(`/api/v1/items/${id}`).set('Authorization', `Bearer ${macToken}`);
    expect(del.status).toBe(204);

    const after = await request(app).get(`/api/v1/items/${id}`).set('Authorization', `Bearer ${macToken}`);
    expect(after.status).toBe(404);
  });

  it("isolates items across pairs (one pair can't read another's item)", async () => {
    const pairA = await pairFixture();
    const pairB = await pairFixture();
    const created = await request(app)
      .post('/api/v1/items')
      .set('Authorization', `Bearer ${pairA.androidToken}`)
      .send({ kind: 'text', text: 'secret' });
    const id = created.body.data.item.id as string;

    const res = await request(app).get(`/api/v1/items/${id}`).set('Authorization', `Bearer ${pairB.macToken}`);
    expect(res.status).toBe(404);
  });
});
