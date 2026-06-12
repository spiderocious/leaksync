import jwt from "jsonwebtoken";

import type { DevicePlatform } from "@leaksync/core";
import { DEVICE_TOKEN_TTL } from "@leaksync/core";

import { env } from "../env.js";

// Long-lived device JWTs — "pair once, share forever". Stateless: we sign with
// DEVICE_JWT_SECRET and verify the signature on each request. Nothing is stored
// server-side, so there's no token table and no hashing.

export interface DeviceClaims {
  pairId: string;
  deviceId: string;
  platform: DevicePlatform;
}

export const signDeviceToken = (claims: DeviceClaims): string =>
  jwt.sign(claims, env.DEVICE_JWT_SECRET, { expiresIn: DEVICE_TOKEN_TTL });

// Returns the claims if valid, or null on any verification failure.
export const verifyDeviceToken = (token: string): DeviceClaims | null => {
  try {
    const decoded = jwt.verify(token, env.DEVICE_JWT_SECRET);
    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      typeof decoded.pairId === 'string' &&
      typeof decoded.deviceId === 'string' &&
      (decoded.platform === 'mac' || decoded.platform === 'android')
    ) {
      return {
        pairId: decoded.pairId,
        deviceId: decoded.deviceId,
        platform: decoded.platform,
      };
    }
    return null;
  } catch {
    return null;
  }
};
