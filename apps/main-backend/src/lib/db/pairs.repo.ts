import type { DevicePlatform } from '@leaksync/core';

import { pairsCollection } from './mongo.js';

// A device within a pair. We store the JWT subject (deviceId) so unpair can
// remove exactly one device; tokens themselves are stateless (not stored).
export interface PairDeviceDoc {
  deviceId: string;
  platform: DevicePlatform;
  deviceName: string;
  pairedAt: Date;
}

// The pairs collection document. `_id` is the pairId (a string).
export interface PairDoc {
  _id: string;
  macName: string;
  userName: string;
  devices: PairDeviceDoc[];
  seqCounter: number; // monotonic, bumped per item POST
  pairingCode?: string; // 6 digits, present until redeemed (then unset)
  codeExpiresAt?: Date; // TTL — unset on redeem
  createdAt: Date;
}

export const pairsRepo = {
  async insert(doc: PairDoc): Promise<void> {
    await pairsCollection().insertOne(doc);
  },

  async findById(pairId: string): Promise<PairDoc | null> {
    return pairsCollection().findOne({ _id: pairId });
  },

  async findByActiveCode(code: string): Promise<PairDoc | null> {
    return pairsCollection().findOne({
      pairingCode: code,
      codeExpiresAt: { $gt: new Date() },
    });
  },

  // Add a device and clear the pairing code (single-use) atomically.
  async addDeviceAndConsumeCode(pairId: string, device: PairDeviceDoc): Promise<void> {
    await pairsCollection().updateOne(
      { _id: pairId },
      {
        $push: { devices: device },
        $unset: { pairingCode: '', codeExpiresAt: '' },
      },
    );
  },

  // Atomically bump and return the next per-pair sequence id.
  async nextSeq(pairId: string): Promise<number | null> {
    const res = await pairsCollection().findOneAndUpdate(
      { _id: pairId },
      { $inc: { seqCounter: 1 } },
      { returnDocument: 'after' },
    );
    return res ? res.seqCounter : null;
  },

  async removeDevice(pairId: string, deviceId: string): Promise<void> {
    await pairsCollection().updateOne(
      { _id: pairId },
      { $pull: { devices: { deviceId } } },
    );
  },

  async deletePair(pairId: string): Promise<void> {
    await pairsCollection().deleteOne({ _id: pairId });
  },
};
