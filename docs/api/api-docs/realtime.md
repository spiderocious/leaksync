# Realtime — the Mac WebSocket

The Mac receives new items over a WebSocket. The socket is intentionally
short-lived; HTTP polling is the steady-state fallback. The Android device never
opens a socket — it only `POST`s.

## Connect

```
ws://localhost:9090/api/v1/ws?token=<deviceToken>
```

- **Auth:** the device JWT goes in the `token` query param (browsers/clients
  can't set headers on a WebSocket handshake). Only a **`mac`** token is
  accepted; anything else is rejected at the HTTP upgrade with `401`.
- The Mac opens this on launch.

## Messages (server → client)

All frames are JSON. The shape is `WsServerMessage` in `@leaksync/core`:

```jsonc
// sent immediately on connect
{ "type": "hello", "pairId": "8f07aecf..." }

// pushed when the Android device POSTs an item
{ "type": "item", "item": { /* Item — same shape as the REST Item */ } }

// sent just before the server closes the socket at its lifetime cap
{ "type": "closing", "reason": "ttl" }
```

The client sends nothing meaningful; this channel is push-only.

## Lifetime + fallback (the cycle)

1. **Connect** on launch → receive `hello`, then `item` frames in real time.
2. After **5 minutes** (`TRANSPORT.WS_LIFETIME_MS`) the server sends `closing`
   and closes the socket. This is a **hard cap** regardless of activity.
3. The Mac switches to **polling** `GET /items?since=<lastSeq>`, backing off:
   **1 → 2 → 4 → 8 → 16 → 20 min** (doubling, capped — `TRANSPORT.POLL_MIN_MS`
   → `POLL_MAX_MS`).
4. Any poll that returns a **new item resets** the Mac to step 1 (reopen the
   socket, restart the cycle).
5. A manual **Refresh** polls immediately at any time.

All timings are in `@leaksync/core`:

```ts
import { TRANSPORT, pollSchedule, nextPollInterval } from '@leaksync/core';
// TRANSPORT.WS_LIFETIME_MS, POLL_MIN_MS, POLL_MAX_MS, POLL_BACKOFF_FACTOR
// pollSchedule() -> [60000, 120000, 240000, 480000, 960000, 1200000]
```

## Why this design

At one-user scale there's no need to hold a socket open indefinitely or run a
queue. The 5-minute socket covers active bursts (you share several things in a
row); polling with backoff covers the long quiet stretches cheaply; and the
reset-on-receive rule means the moment activity resumes, latency drops back to
"instant". The server relays a POSTed item to an open socket synchronously, so
the happy path is sub-second.
