# @leaksync/mobile — Android app (Expo)

The LeakSync Android app: a registered **share target** (tap "LeakSync" in any
app's share sheet → it's sent), plus in-app **text compose** and **photo/video
pick**. UI only for now — **no API integration yet**; sends are recorded
locally and the home list is seeded.

Built with **Expo SDK 55** (dev build, not Expo Go — share-intent needs native
config). The e-ink design system from `packages/ui` (which is web/DOM) is
**ported to native** under `src/ui` + `src/theme` — same tokens, type scale, and
component anatomy, re-expressed with `View`/`Text`/`StyleSheet`.

## What's here

| Screen | File | Purpose |
|--------|------|---------|
| Home | `app/index.tsx` | paired status + last 5 sent + the two compose actions |
| Share confirm | `app/share.tsx` | the 95% case — handles an inbound share, "Sent to your Mac ✓", dismisses |
| Compose | `app/compose.tsx` | type text / paste a link **or** pick a photo/video |
| Pairing | `app/pair.tsx` | enter the 6-digit code (the one deliberate moment) |
| Settings | `app/settings.tsx` | the one setting (unpair) + About link |
| About | `app/about.tsx` | the gift love-note card |

Share-intent is wired via `expo-share-intent` (`app.json` registers Android
`ACTION_SEND` intent filters for `text/*`, `image/*`, `video/*`). Photos/videos
use `expo-image-picker`.

## Requirements

- **Node ≥ 20** (repo floor); the workspace install already pulled the deps.
- **Android device or emulator.** A physical phone over USB is ideal for testing
  the share sheet on real One UI.
- **Android SDK + platform tools** (`adb`). Install **Android Studio**, then via
  its SDK Manager install an SDK platform + build-tools. Set:
  ```bash
  export ANDROID_HOME="$HOME/Library/Android/sdk"
  export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator"
  ```
  (This machine currently has **no `adb` / ANDROID_HOME set** — do this first.)
- **JDK 17+** (Java 21 is installed and fine).

> Expo Go will **not** work — the share-target needs native code. Use a dev
> build (`expo run:android`), which compiles and installs a real APK.

## Run it on a device

From the repo root or `apps/mobile`:

```bash
# 1. Plug in the phone (USB debugging on) or boot an emulator. Confirm it's seen:
adb devices

# 2. First run — generates the native android/ project and builds+installs the
#    dev build APK (compiles the share-target intent filters). Takes a few min.
pnpm --filter @leaksync/mobile android
#    (equivalently: cd apps/mobile && pnpm android)

# 3. After the first build, for day-to-day JS work just start the bundler:
pnpm --filter @leaksync/mobile start
#    then press 'a' to open on Android, or relaunch the installed app.
```

## Test the share target (the make-or-break flow)

Once the dev build is installed:

1. Open **Chrome / Photos / X / any app** on the phone.
2. Tap **Share** → pick **LeakSync** from the sheet.
3. LeakSync opens to the confirm screen ("Sent to your Mac ✓") and dismisses.
4. Reopen LeakSync → the item is at the top of **Recently sent**.

Try it with **text**, a **URL**, and an **image** — each maps to the right item
kind. (No backend yet, so nothing leaves the phone; this validates the intent
plumbing + UI, which is the point of this phase.)

## In-app sending (no share sheet)

- **Write text:** Home → "Write text" → type → "Send to Mac". URLs are
  auto-detected.
- **Photo/video:** Home → "Send a photo" (or the photo button in compose) →
  grants media permission → pick → preview → "Send to Mac".

## Fonts

The design system uses Literata / Inter / JetBrains Mono. `@fontsource` ships
only `.woff` (RN can't load those), so the app falls back to platform serif /
sans / mono and runs fine. To get pixel-faithful type, drop the TTFs into
`assets/fonts/` and flip `FONTS_BUNDLED` — see `assets/fonts/README.md`.

## Checks (no device needed)

```bash
pnpm --filter @leaksync/mobile typecheck
pnpm --filter @leaksync/mobile lint
cd apps/mobile && npx expo export --platform android   # bundles the JS; proves it compiles
```
