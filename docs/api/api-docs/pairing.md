# Pairing

No accounts. The Mac creates a pair and shows a 6-digit code; the Android device
enters it. Both walk away with a long-lived device JWT. Pair once, share forever.

---

## `POST /pair/code`

The **Mac** creates a new pair and gets a 6-digit code to display, plus its own
device token. **No auth.**

**Request**

```jsonc
{
  "macName": "Ada’s MacBook",   // 1–80 chars
  "userName": "Ada"             // 1–80 chars (the gift personalisation)
}
```

**Response `201`**

```jsonc
{
  "data": {
    "pairId": "8f07aecf6f0d6d4e9b2525c2",
    "pairingCode": "868813",                 // 6 digits — show this on the Mac
    "expiresAt": "2026-06-12T15:12:49.261Z",  // code valid ~10 minutes
    "deviceToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."  // the Mac's JWT
  }
}
```

**Errors** — `400 validation_error` (missing/invalid `macName`/`userName`).

The Mac should store `deviceToken` immediately and open the WebSocket; the pair
exists from this moment (with just the Mac as a device).

---

## `POST /pair/redeem`

The **Android** device enters the code, joins the pair, and gets its token. **No
auth.**

**Request**

```jsonc
{
  "code": "868813",           // exactly 6 digits
  "deviceName": "Galaxy S23"  // 1–80 chars
}
```

**Response `200`**

```jsonc
{
  "data": {
    "pairId": "8f07aecf6f0d6d4e9b2525c2",
    "deviceToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // the Android JWT
    "macName": "Ada’s MacBook",
    "userName": "Ada"
  }
}
```

**Errors**

| Status | Code | When |
|--------|------|------|
| `400` | `validation_error` | `code` isn't 6 digits, or `deviceName` missing |
| `404` | `not_found` | Code unknown, **expired**, or already **consumed** (single-use) |
| `409` | `conflict` | This pair already has a phone — unpair it first |

The code is **single-use**: redeeming it clears it from the pair. A repeat redeem
of the same code returns `404`.

---

## `GET /pair`

Read the current pair status. **Auth required** (either device).

**Response `200`**

```jsonc
{
  "data": {
    "pairId": "8f07aecf6f0d6d4e9b2525c2",
    "macName": "Ada’s MacBook",
    "userName": "Ada",
    "paired": true,            // true once BOTH a mac and an android are present
    "devices": [
      { "platform": "mac",     "deviceName": "Ada’s MacBook", "pairedAt": "2026-06-12T15:02:49.246Z" },
      { "platform": "android", "deviceName": "Galaxy S23",    "pairedAt": "2026-06-12T15:03:10.001Z" }
    ]
  }
}
```

**Errors** — `401 unauthorized` (no/invalid token), `404 not_found` (pair gone).

---

## `POST /unpair`

Remove the calling device from the pair. **Auth required.**

- If the **Mac** unpairs (or the last device leaves), the **whole pair and all
  its items are deleted**.
- If the **Android** device unpairs and the Mac remains, only the phone is
  removed.

**Response `204`** — empty body. Idempotent: unpairing an already-gone pair still
returns `204`.

**Errors** — `401 unauthorized`.
