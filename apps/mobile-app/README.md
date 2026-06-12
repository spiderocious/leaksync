# leaksync — Android app (Flutter)

The LeakSync Android app, in **Flutter**: a registered **share target** (tap
"LeakSync" in any app's share sheet → it's sent), plus in-app **text compose**
and **photo/video pick**. UI only for now — **no API integration yet**; sends are
recorded locally and the home list is seeded.

This is a Flutter port of the same product as `apps/mobile` (React Native). The
e-ink design system from `packages/ui` (web/DOM) is **ported to Dart** under
`lib/theme` + `lib/ui` — same tokens, type scale, and component anatomy,
re-expressed with Flutter widgets. We use Flutter because its bundled toolchain
(its own Gradle + JDK) avoids the RN/Android build friction.

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
