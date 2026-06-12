# Conventions

## Response envelope

Every response is a JSON envelope. Success carries `data`; failure carries
`error`. Some list responses add `meta`.

```jsonc
// success
{ "data": { /* ... */ } }

// error
{ "error": { "code": "not_found", "message": "Item not found" } }

// validation error — adds field_errors
{
  "error": {
    "code": "validation_error",
    "message": "Validation failed",
    "field_errors": { "userName": ["Required"] }
  }
}
```

A `204 No Content` response has an empty body (unpair, delete).

## Error codes

`error.code` is stable — branch on it, never on `error.message` (the message can
change).

| Code | HTTP | Meaning |
|------|------|---------|
| `validation_error` | 400 | Body/query failed schema validation (see `field_errors`) |
| `unauthorized` | 401 | Missing or invalid device token |
| `forbidden` | 403 | Wrong device platform for this endpoint (e.g. Mac POSTing an item) |
| `not_found` | 404 | Pair, item, or pairing code doesn't exist (or code expired/consumed) |
| `conflict` | 409 | E.g. a pair already has a phone |
| `rate_limited` | 429 | Reserved |
| `internal` | 500 | Unexpected error |

Every response also carries an `x-request-id` header for correlation.

## Authentication

No accounts. Pairing issues a **device JWT**; send it on every device-scoped
route:

```
Authorization: Bearer <deviceToken>
```

- The JWT payload is `{ pairId, deviceId, platform: "mac" | "android" }`.
- It's **stateless** — the server verifies the signature, nothing is stored or
  looked up. There is no refresh; the token lasts ~10 years.
- Some routes are **platform-restricted**: only `android` may `POST /items`; only
  `mac` may `GET /items` (poll) and open the WebSocket. A mismatch is `403
  forbidden`.

## The transport model (how the Mac stays current)

This shapes how a client should consume the API — it is not a single endpoint.

1. On launch, the **Mac** opens the WebSocket (`/ws?token=`). While open, new
   items arrive instantly as `{ type: "item", item }`.
2. The socket has a **hard 5-minute lifetime**. The server sends
   `{ type: "closing", reason: "ttl" }` and closes it.
3. The Mac then **polls** `GET /items?since=<lastSeq>` on a backoff:
   **1 → 2 → 4 → 8 → 16 → 20 minutes** (doubling, capped at 20).
4. Any poll that returns a **new item resets** the Mac back to step 1 (reopen the
   socket, restart the cycle).
5. A manual **Refresh** always polls immediately.

The **Android** device never holds a socket — it only `POST`s. When it posts, the
server relays to the Mac's socket if open; otherwise the Mac catches it on its
next poll.

These timings live in `@leaksync/core` (`TRANSPORT`) so both sides share one
source of truth.

## Pagination / cursor

Items use a per-pair monotonic `seqId` (not offset pagination). Poll with
`?since=<seqId>`; the response includes `latestSeq` to use as the next cursor.

## Money / dates

No money in this product. All timestamps are **ISO 8601 strings** (`createdAt`,
`expiresAt`, `pairedAt`).
