#!/usr/bin/env bash
#
# LeakSync installer for macOS.
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/spiderocious/leaksync/main/install.sh | bash
#
# Or pin a specific version:
#   curl -fsSL https://raw.githubusercontent.com/spiderocious/leaksync/main/install.sh | LEAKSYNC_VERSION=0.1.0 bash
#
# The script:
#   1. Detects your CPU architecture (Apple Silicon arm64 vs Intel x64)
#   2. Downloads the matching unsigned .zip from GitHub Releases
#   3. Installs to /Applications/LeakSync.app
#   4. Strips the macOS quarantine attribute so Gatekeeper lets it open
#
# LeakSync is distributed unsigned (a personal, single-user build). The xattr
# step in #4 tells macOS "the user consciously authorized this app" — it's why
# you won't see the "LeakSync is damaged" dialog. No security check is bypassed.

set -euo pipefail

# -------------------- config --------------------
REPO="spiderocious/leaksync"
VERSION="${LEAKSYNC_VERSION:-latest}"
TARGET_APP="/Applications/LeakSync.app"

# -------------------- helpers --------------------
log()  { printf "\033[1;32m→\033[0m %s\n" "$1"; }
warn() { printf "\033[1;33m!\033[0m %s\n" "$1" >&2; }
fail() { printf "\033[1;31m✗\033[0m %s\n" "$1" >&2; exit 1; }

# -------------------- platform checks --------------------
if [ "$(uname -s)" != "Darwin" ]; then
  fail "LeakSync only runs on macOS. Detected: $(uname -s)"
fi

ARCH=$(uname -m)
# Our release assets are named LeakSync-<version>-arm64.zip / -x64.zip — the
# arch tokens are unambiguous, so a plain grep is safe.
case "$ARCH" in
  arm64)  ASSET_MATCH="arm64.zip" ;;
  x86_64) ASSET_MATCH="x64.zip" ;;
  *)      fail "Unsupported architecture: $ARCH" ;;
esac

# -------------------- resolve URL --------------------
if [ "$VERSION" = "latest" ]; then
  log "Resolving the latest release…"
  ASSETS=$(curl -fsSL -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/${REPO}/releases/latest" \
    | grep -oE '"browser_download_url": *"[^"]+"' \
    | sed -E 's/.*"([^"]+)"$/\1/')
  DOWNLOAD_URL=$(printf '%s\n' "$ASSETS" | grep -- "$ASSET_MATCH" | head -n 1)
  [ -n "$DOWNLOAD_URL" ] || fail "Couldn't find a ${ARCH} (.zip) asset in the latest release of ${REPO}."
else
  DOWNLOAD_URL="https://github.com/${REPO}/releases/download/v${VERSION}/LeakSync-${VERSION}-${ASSET_MATCH}"
fi

# -------------------- download --------------------
TMPDIR=$(mktemp -d -t leaksync)
trap 'rm -rf "$TMPDIR"' EXIT

log "Downloading LeakSync ($ARCH)…"
log "  $DOWNLOAD_URL"
curl -fL --progress-bar "$DOWNLOAD_URL" -o "$TMPDIR/leaksync.zip" \
  || fail "Download failed. Check your connection and try again."

# -------------------- extract --------------------
log "Extracting…"
unzip -q "$TMPDIR/leaksync.zip" -d "$TMPDIR" \
  || fail "Couldn't extract the archive. The download may be corrupt."

[ -d "$TMPDIR/LeakSync.app" ] \
  || fail "The archive didn't contain LeakSync.app — got: $(ls "$TMPDIR")"

# -------------------- install --------------------
if [ -d "$TARGET_APP" ]; then
  log "Replacing the existing install…"
  rm -rf "$TARGET_APP" 2>/dev/null || sudo rm -rf "$TARGET_APP" || fail "Couldn't remove $TARGET_APP."
fi

log "Installing to $TARGET_APP…"
mv "$TMPDIR/LeakSync.app" "$TARGET_APP" 2>/dev/null \
  || sudo mv "$TMPDIR/LeakSync.app" "$TARGET_APP" \
  || fail "Install failed."

# -------------------- authorize --------------------
log "Authorizing the app (clearing the quarantine flag)…"
xattr -dr com.apple.quarantine "$TARGET_APP" 2>/dev/null || true

# -------------------- launch --------------------
log "Launching LeakSync…"
sleep 1
open -a "LeakSync" 2>/dev/null || true

cat <<EOF

  ✓ LeakSync installed and launched.

  It lives in your menu bar (top-right) — there's no Dock icon. Click the
  LeakSync icon up there to see your 6-digit pairing code, then type that
  code into the phone app.

  If it didn't open automatically:
      open -a LeakSync

  Made for you.

EOF
