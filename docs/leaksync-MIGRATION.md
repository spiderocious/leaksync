# LeakSync design system → `@leaksync/ui` · shipped 2026-06-12

The Studio e-ink-quietude system (`design-system/projects/leaksync/` in the
dockito playground) translated into the real `@leaksync/ui` component library
and previewed in `apps/web` at `/preview`.

**Visual spec (canonical reference):**
`/Users/feranmi/codebases/2026/dockito/design-system/projects/leaksync/` —
`preview/*.html` + `_foundation.css`. Never edit those; they are the source of
truth your components implement.

---

## What this repo was, and the re-theme

The repo was a **generic monorepo scaffold**: the folder said `leaksync`, but
`packages/ui/src/theme/index.ts`, `styles.css`, and every app's
`tailwind.config.ts` carried a **placeholder blue (`#1e3a8a`) + orange
(`#ea580c`) template palette** — not the LeakSync e-ink stance. Per the standing
"repo name can carry the wrong design identity" lesson, the ship's first job was
a **re-theme to the spec**:

- `packages/ui/src/styles.css` — replaced template vars with the e-ink token set
  (`--paper`, `--ink`, `--moss`, `--hair`, `--warn`, fonts, `.ls-fiber`,
  `.ls-blink` / `.ls-blink-loop`, scrollbars).
- `packages/ui/src/theme/index.ts` — e-ink `COLORS` / `FONTS`.
- `apps/{web,admin-web,website}/tailwind.config.ts` — extended (not replaced)
  with the e-ink palette + `serif`/`sans`/`mono` families + `borderRadius`.
- App `styles.css` + the `web` preview chrome + `web`/`admin-web`/`website`
  home pages rethemed off the old `brand-*`/`surface-*` classes.

## Conventions detected & followed

- **Naming/layout:** `App*` prefix, folder-per-group `app-<kebab>/<kebab>.tsx +
  index.ts`, under `src/primitives/`, `src/data/`, `src/brand/`, `src/overlays/`,
  `src/surfaces/`.
- **Exports:** named only. `forwardRef` where a DOM node is forwarded (button);
  plain function elsewhere. `interface` props, not `readonly` (in the ui package).
- **Imports:** `.ts`/`.tsx` relative extensions ALWAYS (never `.js`). This
  required `allowImportingTsExtensions: true` in `packages/ui/tsconfig.json` +
  `emitDeclarationOnly: true` in `tsconfig.build.json` (the package is consumed
  as **source** via each app's `@leaksync/ui` → `src/index.ts` alias, so the
  build only needs `.d.ts`; verified: 43 `.d.ts`, 0 `.js` after a clean build).
  `apps/website/tsconfig.json` also needed `allowImportingTsExtensions` since it
  resolves the package source through the Next path-map.
- **Class composition:** `cn = twMerge(clsx())` from `../../utils/cn.ts`.
- **Control-flow / utils:** `meemaw` (`Repeat`, `Show`, `Switch`/`Case`/`Default`,
  `Clamp`, `CopyToClipboard`) — added to `packages/ui` deps. Used instead of
  `.map()`, ternaries, hand-rolled clipboard and truncation.
- **Tokens:** components consume Tailwind classes bound to the e-ink palette
  (`bg-paper`, `text-ink`, `border-hair`, `bg-moss`, `text-moss-deep`,
  `bg-warn-faint`) + arbitrary values for bespoke px (`text-[13.5px]`). CSS vars
  (`var(--pop-shadow)`, `var(--idle)`, `var(--moss)`) where Tailwind can't reach.
- **Icons:** `lucide-react` via `@icons` (unchanged); brand glyph hand-drawn SVG.
- **No tests** (none in the repo).
- **Fonts:** `@fontsource/literata` + `inter` + `jetbrains-mono`, imported in
  `apps/{web,admin-web}/src/main.tsx`.

---

## Components generated (14 components, 17 preview parts)

All live under `packages/ui/src/`, all previewed at `apps/web` → `/preview`
(registry: `apps/web/src/features/preview/shared/registry.ts`). Every component
was added to the preview the moment it was built.

**Foundation (preview only):** Type (AppText), Brand mark (AppLogo/AppIcon/AppTrayIcon)

**Primitives**
- `AppText` — e-ink type scale (wordmark / display / read / body / meta / overline / mono)
- `AppButton` — text / quiet / box / danger (no fills, no red)
- `AppStatusDot` — live (moss) / idle (hollow) / reconnecting (blink)
- `AppPairingCodeDisplay` + `AppPairingCodeEntry` — the Mac display + a **real,
  typeable 6-cell input** (controlled/uncontrolled, `onChange`/`onComplete`,
  numeric keypad on mobile)
- `AppItemRow` — text/link/image × states; `CopyToClipboard` + `Clamp` + `Switch`; draggable

**Data / display**
- `AppRecentList` — the 5-item hero list + footer (`Repeat`)
- `AppEmptyState` — nothing-yet / offline-waiting
- `AppSkeletonRow` + `AppSkeletonList` — still grey blocks, no shimmer

**Brand**
- `AppLogo`, `AppIcon` (Android app icon), `AppTrayIcon` (Mac tray, moss pip)

**Overlays**
- `AppModal` (standard/danger), `CriticalModal` (type-to-confirm), `CustomModal` — `createPortal`, e-ink, **no red**
- `AppToast`, `AppBanner` — tones default/info/warn/success (no danger tone by design)
- **`DrawerService`** — imperative singleton (`.toast` / `.banner` / `.confirm` /
  `.critical` / `.openModal`) + `drawerStore` (framework-free pub-sub) +
  `ToastHost` (6 zones, swipeable) / `BannerHost` / `ModalHost`
  (`useSyncExternalStore` + `createPortal`). Hosts mounted in `apps/web/src/app.tsx`.
  Modelled on `/Users/feranmi/codebases/2026/gbedity/packages/ui/src/drawer`.

**Surfaces (scenes — shipped as components by request)**
- `MenuBarPopup` — the whole Mac product in one window
- `PairingDisplayScene` / `PairingEntryScene` / `PairedScene`
- `ArrivalNotification` — the native-style banner
- `AndroidShareConfirm` + `AndroidHome`
- `SettingsScene` + `AboutScene` (the About frame reserves a slot for the gift note)

---

## Manual work remaining

- **The real apps are Flutter** (Android + Mac desktop, per the PRD). This
  `@leaksync/ui` React library is the **web preview + visual spec**; the Android
  scenes here are demonstrative. Port the token values + component anatomy into
  the Flutter widgets.
- **The gift layer** (recipient name on first launch, the personal note text, the
  custom chime audio) is deliberately NOT in the system — `AboutScene` takes the
  note as a prop. Wire the real note + first-run reveal in app code.
- Wire `MenuBarPopup`'s `onCopy` / `onDragStart` / `onSettings` to real clipboard
  + drag + navigation in the desktop shell.

## Checks

`pnpm nx run-many -t typecheck` ✓ (7 projects) · `… -t lint` ✓ · `… -t build` ✓.
`packages/ui` build emits `.d.ts` only (verified clean).
