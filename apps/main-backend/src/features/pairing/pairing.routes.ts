import { Router, type IRouter } from 'express';

import { asyncHandler } from '@lib/http/asyncHandler.js';
import { UnauthorizedError } from '@lib/errors.js';
import { ResponseUtil } from '@lib/response.js';
import { deviceAuth } from '@middlewares/deviceAuth.middleware.js';

import { PairCodeBody, PairRedeemBody } from './pairing.schema.js';
import { createPairCode, getPair, redeemPairCode, unpairDevice } from './pairing.service.js';

// Mounted at /api/v1 — paths here are /pair/code, /pair/redeem, /pair, /unpair.
const router: IRouter = Router();

// POST /pair/code — Mac requests a fresh 6-digit code + its own device token.
router.post(
  '/pair/code',
  asyncHandler(async (req, res) => {
    const body = PairCodeBody.parse(req.body);
    const result = await createPairCode(body.macName, body.userName);
    return ResponseUtil.created(res, result);
  }),
);

// POST /pair/redeem — Android enters the code, joins the pair, gets a token.
router.post(
  '/pair/redeem',
  asyncHandler(async (req, res) => {
    const body = PairRedeemBody.parse(req.body);
    const result = await redeemPairCode(body.code, body.deviceName);
    return ResponseUtil.ok(res, result);
  }),
);

// GET /pair — read pair status (either device).
router.get(
  '/pair',
  deviceAuth(),
  asyncHandler(async (req, res) => {
    if (!req.device) throw new UnauthorizedError();
    const pair = await getPair(req.device.pairId);
    return ResponseUtil.ok(res, pair);
  }),
);

// POST /unpair — remove the calling device (Mac leaving tears the pair down).
router.post(
  '/unpair',
  deviceAuth(),
  asyncHandler(async (req, res) => {
    if (!req.device) throw new UnauthorizedError();
    await unpairDevice(req.device);
    return ResponseUtil.noContent(res);
  }),
);

export default router;
