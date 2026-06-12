# LeakSync — Build Phases

The ordered plan. Each phase has a goal, scope, the surfaces it touches, and a
done-when checklist. Phases are sequential unless marked parallel-safe. We pause
for review after each phase before starting the next.

See the locked spec in conversation for the full architecture. Quick recap:

- **Monorepo:** this TS pnpm/Nx template. Backend = Express `main-backend`.
- **Mac:** Electron + React, reuses `@leaksync/ui` / `core` / `api`. Menu-bar Tray.
- **Android:** React Native, registered share target. Shares types from `@leaksync/core`.
- **Storage:** MongoDB for item metadata; images via the external file-service
  (`go-file-service-production.up.railway.app`) → R2. Backend stores only the file `key`.
- **Transport:** Mac opens a WebSocket on launch (hard 5-min lifetime, config-driven),
  then falls back to HTTP polling (1→2→4→8→16→20 min, doubling, cap 20); any poll that
  returns a new item resets back to WebSocket. Manual Refresh always available. Android
  never holds a socket — it only POSTs. Launch-on-login on Mac.
- **Auth:** no accounts. 6-digit pairing code → long-lived per-device bearer tokens.

---

## Phase 1 — Rebrand the repo

**Goal:** turn the untouched template into the LeakSync project so every later
phase builds on the right names.

**Scope:**
- Rename package scope `@repo/*` → `@leaksync/*` across all `package.json`,
  workspace deps, `tsconfig.base.json` paths, Vite aliases (incl. regex forms),
  and source imports.
- Set root `package.json` `name` to `leaksync`.
- Update `README.md`, `docs/rules.md`, `docs/run.md` references.
- Delete placeholders: `example` feature (backend + web), `User` / `ExampleItem`
  stub types, `ROUTES.EXAMPLE*`, `EP.EXAMPLE*`, placeholder home/website copy.
- `pnpm install` to refresh the lockfile.

**Surfaces:** monorepo wiring only.

**Done when:**
- [ ] `@repo` appears nowhere (`grep -r '@repo' --include='*.{ts,tsx,json,mjs}'` is clean).
- [ ] No `example` / `ExampleItem` references remain.
- [ ] `pnpm exec nx run-many -t typecheck` passes.
- [ ] `pnpm exec nx run-many -t build` passes.

---

## Phase 2 — Design-system preview page (scaffold only)

**Goal:** stand up the preview gallery harness — the registry-driven sidebar +
lazy-loaded "part" canvas — mirroring
`gbedity/apps/game/src/features/preview`, so the design-system agent in Phase 3
has a place to render every component. **We build the harness, not the
components.** A handful of placeholder parts prove the wiring.

**Scope:**
- New `preview` feature in `apps/web` (or a dedicated `apps/design` app — decide
  in review): `screen/preview-screen.tsx`, `screen/parts/preview-sidebar.tsx`,
  `shared/registry.ts`.
- `registry.ts` as the single source of truth: `PARTS` list with `id`, `label`,
  `group`, and a `lazy()` loader per part; sidebar nav + canvas router both derive
  from it. Groups: `Foundation`, `Primitives`, `Display`, `Feedback` (tunable).
- 2–3 placeholder parts wrapping the existing `@leaksync/ui` primitives
  (`AppButton`, `AppText`) so the gallery renders end-to-end.
- A route (`ROUTES.PREVIEW`) and a dev-only entry to reach it.

**Surfaces:** web only.

**Done when:**
- [ ] Preview screen loads, sidebar lists groups, selecting a part renders it in
      the canvas with Suspense fallback.
- [ ] Adding a component = one new part file + one `PARTS` entry, nothing else.
- [ ] Typecheck + build pass.

---

## Phase 3 — Design system (separate agent)

**Goal:** build the real LeakSync design system into `@leaksync/ui` — tokens
(Fraunces display type, color/spacing), primitives, and the composed components
each surface needs (item row, pairing-code display, connection dot, empty/loading
states, About/love-note layout). Each component registered as a preview part.

**Owner:** a dedicated design-system agent. **This phase is handled separately**
— we hand off the preview harness from Phase 2 and the visual direction.

**Scope (informational, for the handoff):**
- Theme tokens in `packages/ui/src/theme`, mirrored into each `tailwind.config.ts`
  and `packages/ui/src/styles.css`.
- Components keyed to the PRD surfaces: Mac popup rows (text / url / image),
  6-digit code display, status dot, toast/notification visuals, settings/About.
- Every new component added to the preview registry.

**Done when (verified by us on return):**
- [ ] All PRD-referenced components exist in `@leaksync/ui` and render in preview.
- [ ] Tokens consistent across web + Electron consumers.
- [ ] Typecheck + build pass.

---

## Phase 4 — React Native app + on-device share-target test (GO/NO-GO)

**Goal:** the make-or-break milestone (PRD build note #1). Build a minimal RN
Android app, register it as a share target, and **test the intent on the actual
phone** (same Samsung model as hers) before investing further. This validates the
riskiest assumption in the whole product.

**Scope:**
- `apps/mobile` RN app in the monorepo, consuming `@leaksync/core` types.
- Native `ACTION_SEND` / `ACTION_SEND_MULTIPLE` intent-filter for `text/plain` and
  `image/*` + `receive-sharing-intent` / `react-native-share-menu` wiring.
- Minimal receive screen that logs/echoes the received text, URL, and image so we
  can confirm One UI delivers each intent type.
- Throwaway path: POST the received payload to a local/dev endpoint (or just
  display it) — no real backend dependency yet.

**Surfaces:** Android only (+ a stub receiver).

**Done when:**
- [ ] App appears in the Samsung share sheet from Chrome, Photos, Twitter, etc.
- [ ] Sharing **text**, a **URL**, and an **image** each delivers the payload to
      the app and is correctly read.
- [ ] **You confirm on your device.** ← explicit human checkpoint; we stop here.

> If the share target misbehaves on One UI, we course-correct (config or native
> Kotlin shim) before any further client work. Finding this on day 7 is too late.

---

## Phase 5 — Backend: pairing, items, transport

**Goal:** the real backend, fleshing out the Express template.

**Scope:**
- MongoDB models: `pairs`, `items` (TTL index → 24h auto-delete; per-pair `seqId`).
- Endpoints (all `asyncHandler` + `ResponseUtil` + zod + `ServiceResult<T>`):
  `POST /pair/code`, `POST /pair/redeem`, `POST /items`, `GET /items?since=`,
  `GET /items/recent`, `POST /unpair`.
- WebSocket `/ws` (Mac only): server pushes new item when Android POSTs and the
  Mac socket is open.
- 6-digit code → long-lived per-device bearer tokens; auth middleware.
- Shared contract + config (WS lifetime, poll schedule) in `@leaksync/core`.
- Contract tests at the seam (Zod ↔ shared TS types).

**Surfaces:** backend + `@leaksync/core`.

**Done when:**
- [ ] Pairing issues tokens; items POST/list/poll work; WS pushes on POST.
- [ ] TTL deletes items after 24h (verified with a short TTL in test).
- [ ] Contract tests green; typecheck + lint + tests pass.

---

## Phase 6 — Mac (Electron) vertical slice

**Goal:** the satisfying end-to-end demo — share from phone, see it on the Mac.

**Scope:**
- `apps/desktop` Electron app, React UI from `@leaksync/ui`.
- Menu-bar Tray (idle monochrome icon + new-item highlight), 360×480 popup.
- WS/polling lifecycle from the spec (config-driven), manual Refresh.
- Item list (last 5), click→copy + green flash, **drag-out** (text/url plain text,
  image as file/image data), connection dot.
- Native notification + custom chime; click notification → focus + highlight item.
- Image thumbnails via file-service `/get-file-uri?key=`.
- Launch-on-login registration.

**Surfaces:** Electron desktop.

**Done when:**
- [ ] Phone POST → Mac shows it < 1s while WS open; falls back to polling and
      recovers per the cycle.
- [ ] Copy, drag-out, notification + chime all work.
- [ ] App relaunches on login.

---

## Phase 7 — Android: real send flow + pairing + recent

**Goal:** finish the Android app against the real backend.

**Scope:**
- 95% path: receive intent → upload image to file-service if needed → POST to
  backend → "Sent to Mac ✓" toast → dismiss without opening the full app.
- Pairing screen (enter 6-digit code → redeem → token stored).
- 5% path: home (paired status + last 5 sent), settings (unpair, about).

**Surfaces:** Android + backend.

**Done when:**
- [ ] One-tap share lands on the Mac for text, url, and image.
- [ ] Pairing works end-to-end from a fresh install.
- [ ] Recent list and unpair work.

---

## Phase 8 — Personalisation (gift layer)

**Goal:** the things that make it a gift, not a tool.

**Scope:**
- `userName` + `macName` flow through pairing; one-time welcome screen on both.
- Custom app icon, menu-bar icon, share-sheet icon.
- About / love-note page on both devices.
- Custom warm arrival chime.
- All driven by config/assets so they're easy to set for her.

**Done when:**
- [ ] Welcome shows once per device with her name + note.
- [ ] Custom icons + chime in place on both apps.

---

## Phase 9 — Packaging & delivery

**Goal:** get it onto her two real devices and keep it running.

**Scope:**
- Mac: signing/notarisation (or the documented right-click→open dance), build a
  distributable, verify launch-on-login on a clean account.
- Android: signed release APK, sideload instructions.
- Backend: deploy (Railway, alongside the file-service — confirm in review),
  env/secrets, health check, confirm TTL cleanup runs in prod.
- Final on-device acceptance against the PRD success criteria.

**Done when:**
- [ ] Both apps installed on her devices; backend live.
- [ ] Full PRD daily-use flow works on real hardware.

---

## Open decisions to confirm before/within each phase

- **Hosting:** Railway (default, co-located with file-service) vs Fly.io. _[Phase 9, decide earlier]_
- **Rebrand scope:** `@repo` → `@leaksync` and delete placeholders. _[Phase 1 — needs your OK]_
- **Preview home:** add `preview` feature inside `apps/web` vs a dedicated app. _[Phase 2]_
- **Phase 3 ↔ 4/5 parallelism:** the design-system agent (Phase 3) can run in
  parallel with backend (Phase 5) since they don't overlap. _[review]_
