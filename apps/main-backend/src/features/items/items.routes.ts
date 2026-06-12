import { Router, type IRouter } from 'express';

import { asyncHandler } from '@lib/http/asyncHandler.js';
import { UnauthorizedError } from '@lib/errors.js';
import { ResponseUtil } from '@lib/response.js';
import { deviceAuth } from '@middlewares/deviceAuth.middleware.js';

import { CreateItemBody, PollQuery, RecentQuery } from './items.schema.js';
import { createItem, deleteItem, getItem, pollItems, recentItems } from './items.service.js';

// Mounted at /api/v1/items. Route order: specific (/recent) before /:id.
const router: IRouter = Router();

// POST /items — Android sends a new item.
router.post(
  '/',
  deviceAuth('android'),
  asyncHandler(async (req, res) => {
    if (!req.device) throw new UnauthorizedError();
    const body = CreateItemBody.parse(req.body);
    const item = await createItem(req.device.pairId, body);
    return ResponseUtil.created(res, { item });
  }),
);

// GET /items?since=&limit= — Mac polls for items past its cursor.
router.get(
  '/',
  deviceAuth('mac'),
  asyncHandler(async (req, res) => {
    if (!req.device) throw new UnauthorizedError();
    const { since, limit } = PollQuery.parse(req.query);
    const result = await pollItems(req.device.pairId, since, limit);
    return ResponseUtil.ok(res, result);
  }),
);

// GET /items/recent — last N (either device).
router.get(
  '/recent',
  deviceAuth(),
  asyncHandler(async (req, res) => {
    if (!req.device) throw new UnauthorizedError();
    const { limit } = RecentQuery.parse(req.query);
    const items = await recentItems(req.device.pairId, limit);
    return ResponseUtil.ok(res, { items });
  }),
);

// GET /items/:id — single item (notification deep-link).
router.get(
  '/:id',
  deviceAuth(),
  asyncHandler(async (req, res) => {
    if (!req.device) throw new UnauthorizedError();
    const id = String(req.params['id'] ?? '');
    const item = await getItem(req.device.pairId, id);
    return ResponseUtil.ok(res, { item });
  }),
);

// DELETE /items/:id — dismiss early (before the 24h TTL).
router.delete(
  '/:id',
  deviceAuth(),
  asyncHandler(async (req, res) => {
    if (!req.device) throw new UnauthorizedError();
    const id = String(req.params['id'] ?? '');
    await deleteItem(req.device.pairId, id);
    return ResponseUtil.noContent(res);
  }),
);

export default router;
