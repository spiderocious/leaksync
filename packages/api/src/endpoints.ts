// Single source of truth for backend URL paths. Apps reach the server through
// the named constants here so a rename touches one line, not dozens.
export const EP = {
  HEALTH: 'api/v1/health',

  AUTH_LOGIN: 'api/v1/auth/login',
  AUTH_REGISTER: 'api/v1/auth/register',
  AUTH_REFRESH: 'api/v1/auth/refresh',
  AUTH_LOGOUT: 'api/v1/auth/logout',
  AUTH_ME: 'api/v1/me',

  // Pairing — no accounts, 6-digit code → long-lived device JWT.
  PAIR_CODE: 'api/v1/pair/code', // POST — Mac requests a code
  PAIR_REDEEM: 'api/v1/pair/redeem', // POST — Android enters the code
  PAIR_GET: 'api/v1/pair', // GET — read pair status (auth)
  UNPAIR: 'api/v1/unpair', // POST — remove calling device (auth)

  // Items — the actual product (auth).
  ITEMS: 'api/v1/items', // POST send (android) · GET poll (mac) ?since=&limit=
  ITEMS_RECENT: 'api/v1/items/recent', // GET last N
  ITEM: (id: string) => `api/v1/items/${id}`, // GET single · DELETE dismiss

  // Realtime push — Mac connects on launch; token in query.
  WS: 'api/v1/ws', // ws://…/api/v1/ws?token=<deviceToken>
} as const;
