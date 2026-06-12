import { randomBytes } from 'node:crypto';

import type { Item } from '@leaksync/core';

import { type ItemDoc, itemsRepo } from '@lib/db/items.repo.js';
import { pairsRepo } from '@lib/db/pairs.repo.js';
import { NotFoundError } from '@lib/errors.js';
import { hub } from '@lib/ws/hub.js';

import type { CreateItemBody } from './items.schema.js';

const newId = (): string => randomBytes(12).toString('hex');

// Map a Mongo doc to the wire shape (shared @leaksync/core Item).
const toItem = (doc: ItemDoc): Item => ({
  id: doc._id,
  kind: doc.kind,
  ...(doc.text !== undefined ? { text: doc.text } : {}),
  ...(doc.fileKey !== undefined ? { fileKey: doc.fileKey } : {}),
  ...(doc.mime !== undefined ? { mime: doc.mime } : {}),
  ...(doc.filename !== undefined ? { filename: doc.filename } : {}),
  createdAt: doc.createdAt.toISOString(),
  seqId: doc.seqId,
});

// ---------- POST /items (android) — store + relay to Mac WS ----------
export const createItem = async (pairId: string, body: CreateItemBody): Promise<Item> => {
  const seqId = await pairsRepo.nextSeq(pairId);
  if (seqId === null) throw new NotFoundError('Pair');

  const doc: ItemDoc = {
    _id: newId(),
    pairId,
    kind: body.kind,
    ...(body.text !== undefined ? { text: body.text } : {}),
    ...(body.fileKey !== undefined ? { fileKey: body.fileKey } : {}),
    ...(body.mime !== undefined ? { mime: body.mime } : {}),
    ...(body.filename !== undefined ? { filename: body.filename } : {}),
    seqId,
    createdAt: new Date(),
  };
  await itemsRepo.insert(doc);

  const item = toItem(doc);
  // Relay down the Mac's socket if it's open; otherwise the Mac picks it up on
  // its next poll (which flips it back to WS mode).
  hub.pushItem(pairId, item);
  return item;
};

// ---------- GET /items?since= (mac) — cursor poll ----------
export const pollItems = async (
  pairId: string,
  since: number,
  limit: number,
): Promise<{ items: Item[]; latestSeq: number }> => {
  const docs = await itemsRepo.listSince(pairId, since, limit);
  const items = docs.map(toItem);
  const latestSeq = items.length > 0 ? items[items.length - 1]!.seqId : since;
  return { items, latestSeq };
};

// ---------- GET /items/recent ----------
export const recentItems = async (pairId: string, limit: number): Promise<Item[]> => {
  const docs = await itemsRepo.listRecent(pairId, limit);
  return docs.map(toItem);
};

// ---------- GET /items/:id ----------
export const getItem = async (pairId: string, id: string): Promise<Item> => {
  const doc = await itemsRepo.findById(pairId, id);
  if (!doc) throw new NotFoundError('Item');
  return toItem(doc);
};

// ---------- DELETE /items/:id ----------
export const deleteItem = async (pairId: string, id: string): Promise<void> => {
  const ok = await itemsRepo.deleteById(pairId, id);
  if (!ok) throw new NotFoundError('Item');
};
