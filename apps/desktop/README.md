# @leaksync/desktop — Mac menu-bar app (Electron)

The receiving end of LeakSync. Lives in the **menu bar** (no dock icon); click the
tray icon for the last-5 items. New items arrive over a WebSocket (with polling
fallback), fire a native notification + a warm chime, and can be **clicked to
copy** or **dragged out** into any app.

Built with **electron-vite** (Electron 42). The renderer reuses the e-ink design
system directly — `MenuBarPopup`, `PairingDisplayScene`, `SettingsScene`,
`AboutScene` from `@leaksync/ui` — so the Mac UI is the same system as the web
preview and the phone app.

## Architecture

```
src/
  main/        Node side — owns everything privileged:
    index.ts       app lifecycle, dock-hide, launch-on-login, IPC handlers, drag-out
    store.ts       device token + pair identity, persisted to userData (survives restarts)
    api.ts         backend HTTP client (pair/items) + file-service signed URLs
    transport.ts   the WS + polling lifecycle (5-min WS → 1→2→4→8→16→20 backoff, reset-on-receive)
    app-state.ts   single source of truth for the renderer; notifications + chime triggers
    window.ts      frameless 360×480 popup, positioned under the tray
    tray.ts        menu-bar icon (+ new-item highlight)
    notify.ts      native notification → click focuses + highlights the item
  preload/       contextBridge → window.leaksync (typed IPC, no Node in the renderer)
  renderer/      React UI (pure presentation) consuming @leaksync/ui over IPC
  shared/ipc.ts  the IPC contract (AppState + channels) shared by all three
```

**The network layer lives entirely in the main process** — the device token, the
WS/poll loop, all backend calls. The renderer is pure UI and talks only through
the typed IPC bridge. This is what lets the Mac keep receiving while the popup is
hidden (a menu-bar agent must work without a visible window).

## Requirements

- The **backend** running (`apps/main-backend`) + MongoDB. Default API base is
  `http://localhost:9090/api/v1`; override with `LEAKSYNC_API_BASE`.
- Node ≥ 20.

## Run it

```bash
# 1. Start the backend (separate terminal)
pnpm -F @leaksync/main-backend dev        # :9090, needs Mongo

# 2. Start the Mac app (dev — hot reload)
pnpm -F @leaksync/desktop dev
```

> **Note on `ELECTRON_RUN_AS_NODE`:** VS Code (and Claude Code) is itself an
> Electron app and exports `ELECTRON_RUN_AS_NODE=1` into every integrated-terminal
> child process. That var makes Electron boot as **plain Node** — no `app`, no
> `BrowserWindow`, no tray, and the renderer's `window.leaksync` bridge never
> loads (you'd see `Cannot read properties of undefined (reading 'getState')` if
> you then opened the Vite URL in a browser). The `dev`/`start` scripts now strip
> it automatically (`env -u ELECTRON_RUN_AS_NODE …`), so it works from any
> terminal. **Don't open the Vite dev URL in a browser** — the app is the tray
> window, not a web page.

On first launch the app is unpaired: it shows a **6-digit pairing code**. Enter
that code in the phone app to pair. After that, anything the phone shares lands
in the menu-bar popup.

Point a frontend/phone at this Mac's backend and:
- **Click** an item → copies to clipboard (image → image data; text/url → text).
- **Drag** an item out → drops a file (image) or a `.txt` (text/url) into any app.
- **↻ Refresh** in the footer polls immediately.
- **Settings → Unpair** clears the device and returns to pairing.

## Build / package

```bash
pnpm -F @leaksync/desktop build           # compiles main + preload + renderer → out/
pnpm -F @leaksync/desktop package         # electron-builder → a .app (unsigned, --dir)
```

Launch-on-login is registered automatically when the app is **packaged**
(`app.setLoginItemSettings`), not in dev.

## Config

| Env | Default | Purpose |
|-----|---------|---------|
| `LEAKSYNC_API_BASE` | `http://localhost:9090/api/v1` | Backend base URL |
| `LEAKSYNC_FILE_SERVICE` | `https://go-file-service-production.up.railway.app` | Image signed-URL service |

Transport timings (5-min WS lifetime, poll backoff) come from
`@leaksync/core` (`TRANSPORT`) — shared with the backend, tune in one place.

## Verified end-to-end

Built + launched against the live backend: the app generated a pairing code,
a phone redeemed it and POSTed an item, and the item **relayed to the app over
the WebSocket** (the persisted `lastSeq` advanced) — the PRD's sub-second
phone→Mac path. typecheck · lint · build all green.
