import type { ItemKind } from '@leaksync/core';

import { itemsCollection } from './mongo.js';

// The items collection document. `_id` is the item id (a string).
export interface ItemDoc {
  _id: string;
  pairId: string;
  kind: ItemKind;
  text?: string;
  fileKey?: string;
  mime?: string;
  filename?: string;
  seqId: number; // per-pair cursor (from pairs.seqCounter)
  createdAt: Date; // TTL anchor — 24h
}

export const itemsRepo = {
  async insert(doc: ItemDoc): Promise<void> {
    await itemsCollection().insertOne(doc);
  },

  async findById(pairId: string, id: string): Promise<ItemDoc | null> {
    return itemsCollection().findOne({ _id: id, pairId });
  },

  // Poll: items with seqId > since, oldest-first, capped.
  async listSince(pairId: string, since: number, limit: number): Promise<ItemDoc[]> {
    return itemsCollection()
      .find({ pairId, seqId: { $gt: since } })
      .sort({ seqId: 1 })
      .limit(limit)
      .toArray();
  },

  // Recent: newest-first, capped.
  async listRecent(pairId: string, limit: number): Promise<ItemDoc[]> {
    return itemsCollection()
      .find({ pairId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  },

  async deleteById(pairId: string, id: string): Promise<boolean> {
    const res = await itemsCollection().deleteOne({ _id: id, pairId });
    return res.deletedCount === 1;
  },

  async deleteByPair(pairId: string): Promise<void> {
    await itemsCollection().deleteMany({ pairId });
  },
};
