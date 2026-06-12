import {
  MongoClient,
  type Collection,
  type CreateIndexesOptions,
  type Db,
  type Document,
  type IndexSpecification,
} from 'mongodb';

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

// createIndex is NOT idempotent when an index of the same *name* already exists
// with different *options* (e.g. flipping sparse → unique). MongoDB raises
// IndexOptionsConflict (85) / IndexKeySpecsConflict (86). This helper makes
// index setup self-healing: on a conflict, drop the stale index and recreate it
// with the desired spec. So changing an index definition in code "just works"
// on an existing database, without a manual migration.

const INDEX_CONFLICT_CODES = new Set([85, 86]);

const ensureIndex = async (
  collection: Collection<Document>,
  spec: IndexSpecification,
  options: CreateIndexesOptions = {},
): Promise<void> => {
  try {
    await collection.createIndex(spec, options);
  } catch (err) {
    const code = (err as { code?: number }).code;
    if (code !== undefined && INDEX_CONFLICT_CODES.has(code)) {
      // A same-named index with different options exists — replace it.
      const name = await deriveIndexName(collection, spec);
      if (name) {
        await collection.dropIndex(name).catch(() => undefined);
        await collection.createIndex(spec, options);
        logger.warn({ name }, 'reconciled conflicting index (dropped + recreated)');
        return;
      }
    }
    throw err;
  }
};

// Find the existing index name whose key matches the requested spec.
const deriveIndexName = async (
  collection: Collection<Document>,
  spec: IndexSpecification,
): Promise<string | undefined> => {
  const wantKey = JSON.stringify(spec);
  const existing = await collection.indexes();
  return existing.find((ix) => JSON.stringify(ix.key) === wantKey)?.name;
};

const ensureIndexes = async (database: Db): Promise<void> => {
  const pairs = database.collection<PairDoc>('pairs') as unknown as Collection<Document>;
  const items = database.collection<ItemDoc>('items') as unknown as Collection<Document>;

  // Pairing-code lookup during redeem. UNIQUE + sparse so an active 6-digit code
  // maps to exactly one pair (sparse → docs without a code are exempt, i.e. all
  // already-redeemed pairs). createPairCode retries on duplicate-key.
  await ensureIndex(pairs, { pairingCode: 1 }, { unique: true, sparse: true });
  // TTL on the pairing code: an unredeemed code's pair is cleaned up when it
  // expires. Only docs that still carry codeExpiresAt are affected.
  await ensureIndex(pairs, { codeExpiresAt: 1 }, { expireAfterSeconds: 0, sparse: true });

  // Items: poll by (pairId, seqId), list recent by (pairId, createdAt).
  await ensureIndex(items, { pairId: 1, seqId: 1 });
  await ensureIndex(items, { pairId: 1, createdAt: -1 });
  // 24h auto-delete (PRD §3). createdAt + expireAfterSeconds.
  await ensureIndex(items, { createdAt: 1 }, { expireAfterSeconds: 24 * 60 * 60 });
};
