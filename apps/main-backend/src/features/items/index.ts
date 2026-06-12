import type { Express } from 'express';

import itemsRoutes from './items.routes.js';

export const register = (app: Express): void => {
  app.use('/api/v1/items', itemsRoutes);
};
