# LeakSync API

The backend for LeakSync — share anything from your Android phone to your Mac.
One Express service, MongoDB for `pairs` + `items`, a WebSocket for realtime push
to the Mac. No accounts: a 6-digit pairing code grants each device a long-lived
JWT.

- **Base URL (dev):** `http://localhost:9090/api/v1`
- **Service:** `apps/main-backend`
- **Storage:** MongoDB (`pairs`, `items`). Images are NOT stored here — clients
  upload to the external file-service and send only the file `key`.

## Docs

| Doc | What's in it |
|-----|--------------|
| [conventions.md](conventions.md) | Response envelope, errors, auth, the transport model |
| [pairing.md](pairing.md) | `POST /pair/code`, `POST /pair/redeem`, `GET /pair`, `POST /unpair` |
| [items.md](items.md) | `POST /items`, `GET /items` (poll), `/items/recent`, `/items/:id` |
| [realtime.md](realtime.md) | The Mac WebSocket (`/ws`) + the polling/backoff fallback |
| [models.md](models.md) | The `pairs` and `items` Mongo shapes + indexes |

## Endpoint summary

| Method | Path | Auth | Who | Purpose |
|--------|------|------|-----|---------|
| `GET` | `/health` | — | — | Liveness |
| `POST` | `/pair/code` | — | Mac | Create a pair, get a 6-digit code + Mac token |
| `POST` | `/pair/redeem` | — | Android | Enter the code, join the pair, get a token |
| `GET` | `/pair` | ✅ | both | Read pair status |
| `POST` | `/unpair` | ✅ | both | Remove the calling device |
| `POST` | `/items` | ✅ | Android | Send a text / url / image item |
| `GET` | `/items?since=&limit=` | ✅ | Mac | Poll for items past a cursor |
| `GET` | `/items/recent?limit=` | ✅ | both | Last N items, newest first |
| `GET` | `/items/:id` | ✅ | both | One item (notification deep-link) |
| `DELETE` | `/items/:id` | ✅ | both | Dismiss an item before its 24h TTL |
| `WS` | `/ws?token=` | ✅ | Mac | Realtime push when Android sends |

## Auth in one line

`Authorization: Bearer <deviceToken>` — the JWT returned by `/pair/code` (Mac) or
`/pair/redeem` (Android). Tokens are stateless, carry `{ pairId, deviceId,
platform }`, and last ~10 years ("pair once, share forever").
