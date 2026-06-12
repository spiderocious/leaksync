import { randomBytes, randomInt } from 'node:crypto';

import type { DeviceClaims } from '@lib/device-token.js';
import { signDeviceToken } from '@lib/device-token.js';
import { ConflictError, NotFoundError } from '@lib/errors.js';
import { type PairDoc, pairsRepo } from '@lib/db/pairs.repo.js';
import { itemsRepo } from '@lib/db/items.repo.js';
import { PAIRING } from '@leaksync/core';
import type { Pair, PairCodeResult, PairRedeemResult } from '@leaksync/core';

const newId = (): string => randomBytes(12).toString('hex');

const sixDigitCode = (): string =>
  randomInt(0, 1_000_000).toString().padStart(PAIRING.CODE_LENGTH, '0');

// Mongo duplicate-key error code (unique index violation).
const isDuplicateKey = (err: unknown): boolean =>
  typeof err === 'object' && err !== null && (err as { code?: number }).code === 11000;

// ---------- Mac creates a pair + gets a code ----------
export const createPairCode = async (macName: string, userName: string): Promise<PairCodeResult> => {
  const pairId = newId();
  const macDeviceId = newId();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + PAIRING.CODE_TTL_MS);

  // The pairingCode has a UNIQUE index, so "code → one pair" is a hard DB
  // guarantee. On the rare collision (another unredeemed code is identical),
  // regenerate and retry. With at most one active phone-pairing at a time, a
  // collision is astronomically unlikely; the retry makes it impossible.
  let pairingCode = '';
  let inserted = false;
  for (let attempt = 0; attempt < 8 && !inserted; attempt += 1) {
    pairingCode = sixDigitCode();
    const doc: PairDoc = {
      _id: pairId,
      macName,
      userName,
      devices: [{ deviceId: macDeviceId, platform: 'mac', deviceName: macName, pairedAt: now }],
      seqCounter: 0,
      pairingCode,
      codeExpiresAt: expiresAt,
      createdAt: now,
    };
    try {
      await pairsRepo.insert(doc);
      inserted = true;
    } catch (err) {
      if (!isDuplicateKey(err)) throw err;
      // collided on pairingCode — loop and try a fresh code with the same pairId
    }
  }
  if (!inserted) {
    throw new ConflictError('Could not allocate a unique pairing code, please retry');
  }

  const deviceToken = signDeviceToken({ pairId, deviceId: macDeviceId, platform: 'mac' });
  return { pairId, pairingCode, expiresAt: expiresAt.toISOString(), deviceToken };
};

// ---------- Android redeems the code ----------
export const redeemPairCode = async (
  code: string,
  deviceName: string,
): Promise<PairRedeemResult> => {
  const pair = await pairsRepo.findByActiveCode(code);
  if (!pair) throw new NotFoundError('Pairing code');

  if (pair.devices.some((d) => d.platform === 'android')) {
    throw new ConflictError('This pair already has a phone — unpair it first');
  }

  const androidDeviceId = newId();
  await pairsRepo.addDeviceAndConsumeCode(pair._id, {
    deviceId: androidDeviceId,
    platform: 'android',
    deviceName,
    pairedAt: new Date(),
  });

  const deviceToken = signDeviceToken({
    pairId: pair._id,
    deviceId: androidDeviceId,
    platform: 'android',
  });
  return { pairId: pair._id, deviceToken, macName: pair.macName, userName: pair.userName };
};

// ---------- Read pair status ----------
export const getPair = async (pairId: string): Promise<Pair> => {
  const pair = await pairsRepo.findById(pairId);
  if (!pair) throw new NotFoundError('Pair');
  return toPair(pair);
};

// ---------- Unpair (remove the calling device; delete pair if empty) ----------
export const unpairDevice = async (claims: DeviceClaims): Promise<void> => {
  const pair = await pairsRepo.findById(claims.pairId);
  if (!pair) return; // already gone — idempotent

  await pairsRepo.removeDevice(claims.pairId, claims.deviceId);

  const remaining = pair.devices.filter((d) => d.deviceId !== claims.deviceId);
  // If the Mac leaves, or no devices remain, tear the whole pair + items down.
  if (claims.platform === 'mac' || remaining.length === 0) {
    await pairsRepo.deletePair(claims.pairId);
    await itemsRepo.deleteByPair(claims.pairId);
  }
};

const toPair = (doc: PairDoc): Pair => ({
  pairId: doc._id,
  macName: doc.macName,
  userName: doc.userName,
  devices: doc.devices.map((d) => ({
    platform: d.platform,
    deviceName: d.deviceName,
    pairedAt: d.pairedAt.toISOString(),
  })),
  paired: doc.devices.some((d) => d.platform === 'mac') && doc.devices.some((d) => d.platform === 'android'),
});
