import { MongoClient, type Db } from 'mongodb';

import { logger } from '@lib/logger.js';

import { env } from '../../env.js';
import type { PairDoc } from './pairs.repo.js';
import type { ItemDoc } from './items.repo.js';

// One MongoClient for the process. `connectMongo()` is called once at boot
// (server.ts) and again lazily by tests; both resolve to the same connection.

let client: MongoClient | undefined;
let db: Db | undefined;

export const connectMongo = async (uri = env.MONGO_URI, dbName = env.MONGO_DB_NAME): Promise<Db> => {
  if (db) return db;
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  await ensureIndexes(db);
  logger.info({ dbName }, 'mongo connected');
  return db;
};

export const getDb = (): Db => {
  if (!db) throw new Error('Mongo not connected — call connectMongo() first');
  return db;
};

export const closeMongo = async (): Promise<void> => {
  await client?.close();
  client = undefined;
  db = undefined;
};

export const pairsCollection = () => getDb().collection<PairDoc>('pairs');
export const itemsCollection = () => getDb().collection<ItemDoc>('items');

// Indexes — created once on connect. Idempotent (createIndex is a no-op if it
// already exists with the same spec).
const ensureIndexes = async (database: Db): Promise<void> => {
  const pairs = database.collection<PairDoc>('pairs');
  const items = database.collection<ItemDoc>('items');

  // Pairing-code lookup during redeem; sparse since the code is cleared after use.
  await pairs.createIndex({ pairingCode: 1 }, { sparse: true });
  // TTL on the pairing code: an unredeemed code's pair is cleaned up when it
  // expires. Only docs that still carry codeExpiresAt are affected.
  await pairs.createIndex({ codeExpiresAt: 1 }, { expireAfterSeconds: 0, sparse: true });

  // Items: poll by (pairId, seqId), list recent by (pairId, createdAt).
  await items.createIndex({ pairId: 1, seqId: 1 });
  await items.createIndex({ pairId: 1, createdAt: -1 });
  // 24h auto-delete (PRD §3). createdAt + expireAfterSeconds.
  await items.createIndex({ createdAt: 1 }, { expireAfterSeconds: 24 * 60 * 60 });
};
