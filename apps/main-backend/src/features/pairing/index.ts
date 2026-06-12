import type { Express } from 'express';

import pairingRoutes from './pairing.routes.js';

export const register = (app: Express): void => {
  app.use('/api/v1', pairingRoutes);
};
