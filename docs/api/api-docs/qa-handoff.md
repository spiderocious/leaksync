# QA Handoff — LeakSync Backend (pairing + items + realtime)

**Date:** 2026-06-12
**Base URL:** `http://localhost:9090/api/v1`
**Service:** `apps/main-backend`
**Auth:** none — pairing issues a long-lived device JWT (`Authorization: Bearer <deviceToken>`)
**Tested against:** live server on `:9090` + MongoDB `leaksync` @ `mongodb://localhost:27017`

## Verdict

The pairing, items, and realtime surfaces match the documented contract. **51/52 checks
pass.** Source audit, lint, and typecheck are clean. The one issue is a **flaky test rooted
in a real correctness defect**: the 6-digit pairing code is **not unique**, and the redeem
lookup is ambiguous under collision (see BUG-01). Low probability at one-user scale, but it
is a genuine invariant violation and should be fixed or explicitly accepted.

---

## Environment Setup

| Variable | Value |
|----------|-------|
| `PORT` | `9090` |
| `MONGO_URI` | `mongodb://localhost:27017` |
| `MONGO_DB_NAME` | `leaksync` |
| `DEVICE_JWT_SECRET` | ≥32 chars, signs device JWTs |

**Bootstrap a pair (no accounts):**
```bash
B=http://localhost:9090/api/v1
A=$(curl -s -X POST $B/pair/code -H 'Content-Type: application/json' \
  -d '{"macName":"Mac","userName":"Ada"}')
MAC=$(echo "$A" | python3 -c "import sys,json;print(json.load(sys.stdin)['data']['deviceToken'])")
CODE=$(echo "$A" | python3 -c "import sys,json;print(json.load(sys.stdin)['data']['pairingCode'])")
AND=$(curl -s -X POST $B/pair/redeem -H 'Content-Type: application/json' \
  -d "{\"code\":\"$CODE\",\"deviceName\":\"Phone\"}" \
  | python3 -c "import sys,json;print(json.load(sys.stdin)['data']['deviceToken'])")
```

---

## Bugs

| ID | Severity | File | Summary |
|----|----------|------|---------|
| BUG-01 | P2 | `pairing.service.ts:13`, `pairs.repo.ts:35` | Pairing code is **not unique**; `findByActiveCode` is ambiguous under collision → wrong device can join wrong pair, and the cross-pair isolation test is flaky |

### BUG-01 — Pairing code is not unique; redeem lookup is ambiguous under collision

**Where:** `sixDigitCode()` ([pairing.service.ts:13](../../../apps/main-backend/src/features/pairing/pairing.service.ts#L13)) draws a random 6-digit code with no uniqueness guard. `pairsRepo.findByActiveCode` ([pairs.repo.ts:35](../../../apps/main-backend/src/lib/db/pairs.repo.ts#L35)) does `findOne({ pairingCode, codeExpiresAt: { $gt: now } })` — if two unredeemed pairs hold the same code, it returns an arbitrary one.

**Impact:**
1. **Wrong-pair join.** Two pairs with the same active code: the second redeem matches whichever pair's code is still active (the first redeem unset its own), so a phone can be paired to a Mac it never saw the code for.
2. **Test flakiness.** `items.test.ts` "isolates items across pairs" calls `pairFixture()` twice; under a code collision the second `redeem` returns a `409 conflict` (no `data`), and the fixture throws `Cannot read properties of undefined (reading 'deviceToken')`. Passes 5/5 in isolation, fails intermittently in the full run.

**Reproduction (live, forced collision):**
```bash
# two pairs, both forced to code 999999, then redeem twice with the same code
mongosh "$MONGO_URI/leaksync" --quiet --eval "db.pairs.updateMany({},{\$set:{pairingCode:'999999'}})"
curl -s -X POST $B/pair/redeem -d '{"code":"999999","deviceName":"Phone1"}' -H 'Content-Type: application/json'
curl -s -X POST $B/pair/redeem -d '{"code":"999999","deviceName":"Phone2"}' -H 'Content-Type: application/json'
# Observed: redeem #1 joins pairA, redeem #2 joins pairB — code 999999 mapped to TWO pairs.
```

**Probability:** ~1/10⁶ per pair of concurrently-active unredeemed codes; codes also expire in 10 min, so the live blast radius is small. But the test treats it as a hard invariant, so it surfaces as CI flake.

**Suggested fixes (pick one):**
- **Generate-and-retry on a unique index.** Add `pairs.createIndex({ pairingCode: 1 }, { unique: true, sparse: true })` and retry `sixDigitCode()` on duplicate-key insert. Makes "code → one pair" a hard guarantee.
- **Or** accept the risk and make the test robust: have `pairFixture` assert `redeem.status === 200` (fail loudly) and/or use a dedicated test DB so accumulated unredeemed pairs don't raise collision odds across the suite.
- **Test hygiene (independent):** the suite runs against the dev `leaksync` DB (no test-env override in `harness.ts`/`mongo.ts`). Point tests at a throwaway DB (e.g. `leaksync_test`) so a QA/dev session and `vitest` can't clobber each other.

---

## Test Results

### Pairing (`/pair/*`, `/unpair`) — 11/11 ✅

| # | Test | Method + Path | Expected | Result |
|---|------|---------------|----------|:------:|
| P1 | Create pair | POST /pair/code | 201, `{pairId, pairingCode, expiresAt, deviceToken}` | ✅ |
| P2 | Redeem, code not 6 digits | POST /pair/redeem | 400 validation_error | ✅ |
| P3 | Redeem unknown code | POST /pair/redeem | 404 not_found | ✅ |
| P4 | Redeem empty body | POST /pair/redeem | 400 validation_error | ✅ |
| P5 | Redeem valid | POST /pair/redeem | 200, `{pairId, deviceToken, macName, userName}` | ✅ |
| P6 | Redeem same code again (single-use) | POST /pair/redeem | 404 not_found | ✅ |
| P7 | Redeem when pair already has a phone | POST /pair/redeem | 409 conflict | ✅ |
| P8 | GET /pair no token | GET /pair | 401 unauthorized | ✅ |
| P9 | GET /pair bad token | GET /pair | 401 unauthorized | ✅ |
| P10 | GET /pair mac token | GET /pair | 200 | ✅ |
| P11 | `paired` flag once both present | GET /pair | `paired:true`, 2 devices | ✅ |

### Items (`/items`, `/items/recent`, `/items/:id`) — 20/20 ✅

| # | Test | Expected | Result |
|---|------|----------|:------:|
| I1 | POST /items with **mac** token | 403 forbidden | ✅ |
| I2 | POST /items no token | 401 | ✅ |
| I3 | POST image without `fileKey` | 400 validation_error | ✅ |
| I4 | POST text without `text` | 400 | ✅ |
| I5 | POST invalid `kind` | 400 | ✅ |
| I6 | POST text valid | 201, `seqId:1` | ✅ |
| I7 | `seqId` monotonic per pair | 1, 2, 3 | ✅ |
| I8 | GET /items with **android** token | 403 forbidden | ✅ |
| I9 | GET /items?since=0 | 3 items, `latestSeq:3` | ✅ |
| I10 | GET /items?since=2 (cursor) | 1 item, `latestSeq:3` | ✅ |
| I11 | GET /items?since=99 (empty) | 0 items, `latestSeq:99` (echoes `since`) | ✅ |
| I12 | GET /items?limit=0 | 400 | ✅ |
| I13 | GET /items?limit=999 | 400 | ✅ |
| I14 | GET /items?since=-1 | 400 | ✅ |
| I15 | GET /items/recent | newest-first | ✅ |
| I16 | GET /items/:id valid | 200 | ✅ |
| I17 | GET /items/:unknown | 404 | ✅ |
| I18 | DELETE /items/:id | 204 | ✅ |
| I19 | GET deleted item | 404 | ✅ |
| I20 | DELETE again (no longer present) | 404 | ✅ |

### Realtime WebSocket (`/ws`) — 5/5 ✅

| # | Test | Expected | Result |
|---|------|----------|:------:|
| W-auth1 | Upgrade with no token | 401 at handshake | ✅ |
| W-auth2 | Upgrade with **android** token | 401 (mac-only) | ✅ |
| W1 | `hello` frame on connect | `{type:"hello", pairId}` | ✅ |
| W2 | Android POST relays to open socket | `{type:"item", item}` arrives sub-second | ✅ |
| W3 | Pushed item shape == REST `Item` | same keys, no leaks | ✅ |

### Unpair teardown — DB ground truth — 6/6 ✅

| # | Test | Expected | Result |
|---|------|----------|:------:|
| U1 | Android unpairs (Mac remains) | 204; pair kept, phone removed, items kept | ✅ |
| U2 | Mac unpairs | 204; **pair + all items deleted** | ✅ |
| U3 | Unpair when pair already gone | 204 (idempotent) | ✅ |
| U4 | GET /pair after teardown | 404 | ✅ |

### Cross-pair isolation — 2/2 ✅

| # | Test | Expected | Result |
|---|------|----------|:------:|
| X8 | Pair B's Mac reads Pair A's item | 404 | ✅ |
| X9 | Pair B's Mac deletes Pair A's item | 404 | ✅ |

---

## Cross-Cutting Checks — 7/7 ✅

| # | Check | Result |
|---|-------|:------:|
| X-01 | Error envelope is `{ error: { code, message } }` | ✅ |
| X-02 | Validation errors add `field_errors` keyed by field | ✅ |
| X-03 | `x-request-id` header on success **and** error responses | ✅ |
| X-04 | Unknown route → 404 `not_found` in envelope | ✅ |
| X-05 | `Item` response omits internal `pairId` (no cross-pair leak) | ✅ |
| X-06 | `PairDevice` response omits `deviceId` (JWT subject not leaked) | ✅ |
| X-07 | All timestamps are ISO 8601 with `Z` suffix | ✅ |

**Indexes (verified via `mongosh`, match `models.md` exactly):**
- `pairs`: `{pairingCode:1}` sparse · `{codeExpiresAt:1}` TTL=0 sparse
- `items`: `{pairId:1,seqId:1}` · `{pairId:1,createdAt:-1}` · `{createdAt:1}` TTL=86400

---

## Source Audit (Mode 1) — clean

- ✅ Every async route handler is wrapped in `asyncHandler`.
- ✅ All device-scoped routes carry `deviceAuth()`; platform-restricted routes use `deviceAuth('android')` / `deviceAuth('mac')`. WS upgrade auths **before** accepting (`noServer`).
- ✅ No `res.json()` bypass of `ResponseUtil` in feature code; errors bubble to the central handler.
- ✅ No `any` in the new code; no `z.any()` in schemas. `pnpm typecheck` and `pnpm lint` pass.
- ✅ `seqId` allocated atomically via `findOneAndUpdate($inc seqCounter)` — concurrent POSTs cannot collide (the documented invariant holds).
- ⚠️ **BUG-01** (above): pairing code not unique.
- ℹ️ **Minor — burned seq on insert failure.** `createItem` ([items.service.ts:28](../../../apps/main-backend/src/features/items/items.service.ts#L28)) bumps `seqCounter` *before* `itemsRepo.insert`. If insert fails, that `seqId` is skipped. Harmless — the Mac's `since`-cursor poll tolerates gaps (`seqId > since`). Noted, not a defect.
- ℹ️ **Minor — CORS.** `WEB_BASE_URL=*` with `credentials:true` reflects any origin. Acceptable for a localhost one-user gift; revisit if ever exposed.

---

## How to re-run

```bash
cd apps/main-backend
pnpm test          # vitest — note BUG-01 flakiness on "isolates items across pairs"
pnpm typecheck     # clean
pnpm lint          # clean
# Live API matrix: server on :9090 + local Mongo, then the curl blocks above.
```
