import type { DeviceClaims } from '../lib/device-token.js';

// Augment Express's Request with the verified device claims set by
// deviceAuth middleware. Declared on the `express` module (v5 re-exports the
// Request interface from here).
declare global {
  namespace Express {
    interface Request {
      device?: DeviceClaims;
    }
  }
}

export {};
