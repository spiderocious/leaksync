import type { Express } from 'express';

import { buildApp } from '../app.js';
import { closeMongo, connectMongo, getDb } from '../lib/db/mongo.js';

// Shared test harness: one app + one Mongo connection per file, with a
// truncate() to wipe collections between tests (faster + safer than
// drop/recreate). Mirrors the testing doctrine in the personas.

export const setupApp = async (): Promise<Express> => {
  await connectMongo();
  return buildApp();
};

export const truncate = async (): Promise<void> => {
  const db = getDb();
  await Promise.all([
    db.collection('pairs').deleteMany({}),
    db.collection('items').deleteMany({}),
  ]);
};

export const teardown = async (): Promise<void> => {
  await closeMongo();
};
