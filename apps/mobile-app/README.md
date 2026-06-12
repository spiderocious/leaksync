# leaksync — phone app (Flutter)

The LeakSync phone app, in **Flutter** (Android + web). A registered **share
target** (tap "LeakSync" in any app's share sheet → it sends to the backend),
plus in-app **text compose** and **photo/video upload**. **Wired to the real
backend** — pairing redeems a 6-digit code for a device JWT, sends POST to
`/items`, images upload through the file-service first, and the device stays
paired across launches.

The e-ink design system from `packages/ui` (web/DOM) is **ported to Dart** under
`lib/theme` + `lib/ui` — same tokens, type scale, and component anatomy. Flutter's
bundled toolchain avoids the RN/Android build friction.

## Backend integration (Phase 7)

```
lib/data/
  config.dart       API base + file-service URLs (configurable — see below)
  api_client.dart   redeem · send item · recent · unpair (the { data }/{ error } envelope)
  file_service.dart image upload: get-upload-uri → PUT bytes → fileKey
lib/state/app_state.dart   async pair/send/recent/unpair; token persisted via shared_preferences
```

- **Pairing:** the 6-digit code is redeemed against `POST /pair/redeem`; the
  returned device JWT is stored (shared_preferences) so the phone stays paired.
- **Sending:** text/url → `POST /items {kind,text}`. Images → upload bytes to the
  file-service, then `POST /items {kind:'image', fileKey, mime, filename}`.
- **Share sheet:** an inbound share POSTs for real and shows Sending → Sent ✓ (or
  a failure). Must be paired first, or it bounces to the pairing screen.
- **Recent:** the home list loads from `GET /items/recent` (pull-to-refresh).

### Pointing at the backend (important for a physical phone)

A physical phone **can't reach your Mac's `localhost`**. The API base is
configurable, resolved as: **Settings override → `--dart-define` → localhost default.**

```bash
# Web (Chrome) — localhost works here
flutter run -d chrome --dart-define=LEAKSYNC_API_BASE=http://localhost:9090/api/v1

# Android emulator — host is 10.0.2.2, not localhost
flutter run --dart-define=LEAKSYNC_API_BASE=http://10.0.2.2:9090/api/v1

# Physical phone — use your Mac's LAN IP or a tunnel (ngrok/cloudflared)
flutter run --dart-define=LEAKSYNC_API_BASE=https://<your-tunnel-or-LAN>/api/v1
```

Or set it at runtime: **Settings → Server** (tap to paste a URL). The backend's
CORS already allows web origins (`WEB_BASE_URL=*`), so the Chrome build works.

> This is a Flutter port of the same product the React Native attempt targeted.

## What's here

```
lib/
  theme/tokens.dart        e-ink palette + Literata/Inter/JetBrains Mono (google_fonts)
  ui/                      design-system widgets: AppText, AppButton, AppItemRow,
                           AppStatusDot, AppPairingCodeEntry, AppLogo, AppHeader, ScreenScaffold
  models/item.dart         Item / ItemKind (mirrors @leaksync/core)
  state/                   in-memory AppState (ChangeNotifier) + AppScope
  screens/                 home, pair, compose, share (confirm), settings, about
  main.dart                router (go_router) + share-intent wiring
```

| Screen | Purpose |
|--------|---------|
| Home | paired status + last 5 sent + the two compose actions |
| Share confirm | the 95% case — handles an inbound share, "Sent to your Mac ✓", dismisses |
| Compose | type text / paste a link **or** pick a photo/video |
| Pairing | enter the 6-digit code (the one deliberate moment) |
| Settings + About | unpair + the gift love-note card |

Share-intent uses **`receive_sharing_intent`** (Android `ACTION_SEND` /
`SEND_MULTIPLE` filters for `text/*`, `image/*`, `video/*` in
`AndroidManifest.xml`). Photos/videos use **`image_picker`**. Routing is
**`go_router`**; fonts via **`google_fonts`**.

## Requirements

- **Flutter** (Dart 3.11+). The SDK on this machine is at `~/flutter`.
- **JDK 17** (`brew install --cask temurin@17`) — Flutter's Gradle uses it.
- **Android device or emulator** + `adb` on PATH:
  ```bash
  export ANDROID_HOME="$HOME/Library/Android/sdk"
  export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$HOME/flutter/bin"
  ```

## Run it

```bash
cd apps/mobile-app

# Plug in the phone (USB debugging on) or boot an emulator, then:
flutter devices            # confirm it's seen
flutter run                # builds, installs, launches, hot-reload (no Metro/USB babysitting)
```

Or just build the APK and install it (Flutter debug APKs are self-contained — no
dev server needed):

```bash
flutter build apk --debug
adb install -r build/app/outputs/flutter-apk/app-debug.apk
```

## Test the share target (the make-or-break flow)

1. Open Chrome / Photos / X / any app on the phone.
2. Tap **Share** → pick **LeakSync** from the sheet.
3. LeakSync opens to the confirm screen ("Sent to your Mac ✓") and dismisses.
4. Reopen LeakSync → the item is at the top of **Recently sent**.

Try **text**, a **URL**, and an **image** — each maps to the right item kind.
(No backend yet, so nothing leaves the phone; this validates the intent plumbing
+ UI.)

## In-app sending (no share sheet)

- **Write text:** Home → "Write text" → type → "Send to Mac" (URLs auto-detected).
- **Photo/video:** Home → "Send a photo" → grant media permission → pick →
  preview → "Send to Mac".

## Checks

```bash
flutter analyze
flutter build apk --debug
```

## Note: one Gradle tweak

`android/build.gradle.kts` pins all plugin modules to **JVM target 17** — the
`receive_sharing_intent` plugin otherwise compiles Java at 1.8 while Kotlin uses
17, which Gradle rejects as inconsistent. The override aligns them.
