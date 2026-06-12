import type { NextFunction, Request, Response } from 'express';

import type { DevicePlatform } from '@leaksync/core';

import { verifyDeviceToken } from '@lib/device-token.js';
import { ForbiddenError, UnauthorizedError } from '@lib/errors.js';
import { requestContext } from '@lib/http/requestContext.js';

// The `Request.device` field is declared in src/types/express.d.ts.

const extractBearer = (req: Request): string | null => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  const token = header.slice('Bearer '.length).trim();
  return token.length > 0 ? token : null;
};

// Requires a valid device JWT. Optionally restrict to one platform
// (e.g. only `android` may POST items, only `mac` may poll/connect WS).
export const deviceAuth =
  (platform?: DevicePlatform) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const token = extractBearer(req);
    if (!token) {
      next(new UnauthorizedError('Missing device token'));
      return;
    }
    const claims = verifyDeviceToken(token);
    if (!claims) {
      next(new UnauthorizedError('Invalid or expired device token'));
      return;
    }
    if (platform && claims.platform !== platform) {
      next(new ForbiddenError(`This endpoint requires a ${platform} device`));
      return;
    }
    req.device = claims;
    requestContext.set('userId', claims.deviceId);
    requestContext.set('role', claims.platform);
    next();
  };
