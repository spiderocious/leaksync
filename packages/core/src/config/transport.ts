// Transport timings — the tunable knobs for the Mac's connection lifecycle.
// Shared so the server (which enforces the WS lifetime) and the Mac client
// (which runs the polling/backoff loop) agree on one source of truth.
//
// The model: the Mac opens a WebSocket on launch. The socket has a HARD
// lifetime — the server closes it after WS_LIFETIME_MS regardless of activity.
// The Mac then falls back to HTTP polling, starting at POLL_MIN_MS and doubling
// up to POLL_MAX_MS. Any poll that returns a new item resets the Mac back to
// opening a fresh WebSocket, restarting the cycle. A manual Refresh always polls
// immediately. Android never holds a socket — it only POSTs.

export const TRANSPORT = {
  /** Hard WebSocket lifetime before the server closes it. Default 5 min. */
  WS_LIFETIME_MS: 5 * 60 * 1000,

  /** First polling interval after the socket closes. Default 1 min. */
  POLL_MIN_MS: 60 * 1000,

  /** Backoff cap. Schedule: 1 → 2 → 4 → 8 → 16 → 20 (doubling, capped). */
  POLL_MAX_MS: 20 * 60 * 1000,

  /** Backoff multiplier between polls. */
  POLL_BACKOFF_FACTOR: 2,
} as const;

/** The polling backoff schedule derived from TRANSPORT — e.g. [60000, 120000, …]. */
export const pollSchedule = (): number[] => {
  const out: number[] = [];
  let ms = TRANSPORT.POLL_MIN_MS;
  while (ms < TRANSPORT.POLL_MAX_MS) {
    out.push(ms);
    ms *= TRANSPORT.POLL_BACKOFF_FACTOR;
  }
  out.push(TRANSPORT.POLL_MAX_MS);
  return out;
};

/** The next poll interval given the current one (doubles, capped at POLL_MAX_MS). */
export const nextPollInterval = (current: number): number =>
  Math.min(current * TRANSPORT.POLL_BACKOFF_FACTOR, TRANSPORT.POLL_MAX_MS);

// Pairing-code lifetime (the Mac shows it; the Android device redeems it).
export const PAIRING = {
  CODE_TTL_MS: 10 * 60 * 1000, // 10 minutes
  CODE_LENGTH: 6,
} as const;

// Items auto-expire from the server this long after creation (PRD: 24h).
export const ITEM_TTL_SECONDS = 24 * 60 * 60;

// Device JWTs are effectively permanent ("pair once, share forever").
export const DEVICE_TOKEN_TTL = '3650d'; // ~10 years
