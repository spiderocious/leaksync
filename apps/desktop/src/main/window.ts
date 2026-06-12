import { BrowserWindow, screen, type Tray } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// The frameless menu-bar popup (360×480). Hidden until the tray icon is clicked,
// hides again on blur — the menu-bar-agent feel.
let win: BrowserWindow | null = null;

export const createPopup = (): BrowserWindow => {
  win = new BrowserWindow({
    width: 360,
    height: 480,
    show: false,
    frame: false,
    resizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    movable: false,
    // Opaque paper background so the flush popup fills the window edge-to-edge
    // (no transparent gap around a floating card). macOS rounds the corners.
    transparent: false,
    backgroundColor: '#edebe6', // --sheet
    roundedCorners: true,
    hasShadow: true,
    webPreferences: {
      preload: path.join(dirname, '../preload/index.cjs'),
      sandbox: false,
      contextIsolation: true,
    },
  });

  // Hide instead of close; hide on blur (click-away dismiss).
  win.on('close', (e) => {
    e.preventDefault();
    win?.hide();
  });
  win.on('blur', () => {
    if (!win?.webContents.isDevToolsOpened()) win?.hide();
  });

  // electron-vite injects the dev server URL; in prod load the built file.
  const devUrl = process.env['ELECTRON_RENDERER_URL'];
  if (devUrl) {
    void win.loadURL(devUrl);
  } else {
    void win.loadFile(path.join(dirname, '../renderer/index.html'));
  }

  return win;
};

export const getPopup = (): BrowserWindow | null => win;

// Position the popup just under the tray icon and show it.
export const showPopupAtTray = (tray: Tray): void => {
  if (!win) return;
  const trayBounds = tray.getBounds();
  const { width } = win.getBounds();
  const display = screen.getDisplayNearestPoint({ x: trayBounds.x, y: trayBounds.y });

  let x = Math.round(trayBounds.x + trayBounds.width / 2 - width / 2);
  // keep on-screen
  const maxX = display.workArea.x + display.workArea.width - width - 8;
  x = Math.min(Math.max(display.workArea.x + 8, x), maxX);
  const y = Math.round(trayBounds.y + trayBounds.height + 6);

  win.setPosition(x, y, false);
  win.show();
  win.focus();
};

export const togglePopup = (tray: Tray): void => {
  if (win?.isVisible()) {
    win.hide();
  } else {
    showPopupAtTray(tray);
  }
};
