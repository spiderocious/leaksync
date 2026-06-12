import { createServer, type Server } from 'node:http';

import { closeMongo, connectMongo } from '@lib/db/mongo.js';
import { logger } from '@lib/logger.js';
import { attachWebSocket } from '@lib/ws/server.js';

import { buildApp } from './app.js';
import { env } from './env.js';

const startHttpApp = async (): Promise<Server> => {
  await connectMongo();
  const app = buildApp();
  const server = createServer(app);
  attachWebSocket(server); // Mac realtime push at /api/v1/ws
  server.listen(env.PORT, () => {
    logger.info({ port: env.PORT, env: env.NODE_ENV }, 'main-backend listening');
  });
  return server;
};

const server = await startHttpApp();

const shutdown = async (signal: string): Promise<void> => {
  logger.info({ signal }, 'shutting down gracefully');
  await new Promise<void>((resolve) => server.close(() => resolve()));
  await closeMongo();
  process.exit(0);
};

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});
process.on('SIGINT', () => {
  void shutdown('SIGINT');
});
