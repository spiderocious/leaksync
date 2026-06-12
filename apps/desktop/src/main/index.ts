import { app, clipboard, ipcMain, nativeImage } from 'electron';
import { tmpdir } from 'node:os';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { IPC } from '../shared/ipc.js';
import { api } from './api.js';
import { appState } from './app-state.js';
import { createPopup, getPopup } from './window.js';
import { createTray, flashTray, getTray } from './tray.js';
import { notifyArrival } from './notify.js';

// Single-instance lock — a menu-bar app must not spawn duplicates.
if (!app.requestSingleInstanceLock()) {
  app.quit();
}

// Menu-bar agent: no dock icon.
app.dock?.hide();

// Launch-on-login (no-op in dev; registers the packaged app in prod).
const setLoginItem = (): void => {
  if (app.isPackaged) {
    app.setLoginItemSettings({ openAtLogin: true, openAsHidden: true });
  }
};

const pushState = (): void => {
  getPopup()?.webContents.send(IPC.STATE_CHANGED, appState.snapshot());
};

app.whenReady().then(() => {
  setLoginItem();
  const popup = createPopup();
  // eslint-disable-next-line no-console
  console.log('[leaksync] popup window created');

  let tray;
  try {
    tray = createTray();
    // eslint-disable-next-line no-console
    console.log('[leaksync] tray icon created — look in the menu bar (top-right)');
  } catch (err) {
    console.error('[leaksync] TRAY FAILED:', err);
  }

  appState.init();
  appState.on('changed', pushState);
  appState.on('arrived', (items) => {
    flashTray();
    notifyArrival(items);
    getPopup()?.webContents.send(IPC.HIGHLIGHT_ITEM, items[0]?.id ?? '');
  });

  registerIpc();

  // Show the popup once on first launch (centered) so it's obviously running —
  // afterwards it behaves as a tray popup (click the tray icon to toggle).
  popup.once('ready-to-show', () => {
    popup.center();
    popup.show();
    popup.focus();
    // eslint-disable-next-line no-console
    console.log('[leaksync] popup shown (centered). Backend:', api.base);
  });
  void tray;
});

app.on('window-all-closed', () => {
  // Keep running as a menu-bar agent even with no visible window. (Do NOT quit.)
});

const registerIpc = (): void => {
  ipcMain.handle(IPC.GET_STATE, () => appState.snapshot());
  ipcMain.handle(IPC.CREATE_CODE, () => appState.createPairCode());
  ipcMain.handle(IPC.REFRESH, () => appState.refresh());
  ipcMain.handle(IPC.UNPAIR, () => appState.unpair());

  ipcMain.handle(IPC.COPY_ITEM, async (_e, itemId: string) => {
    const item = appState.getItem(itemId);
    if (!item) return;
    if (item.kind === 'image' && item.fileKey) {
      const url = await api.fileUrl(item.fileKey);
      if (url) {
        const img = await fetchImage(url);
        if (img) clipboard.writeImage(img);
        return;
      }
    }
    clipboard.writeText(item.text ?? '');
  });

  ipcMain.handle(IPC.IMAGE_URL, async (_e, fileKey: string) => api.fileUrl(fileKey));

  ipcMain.handle(IPC.IMAGE_PATH_FOR_DRAG, async (_e, itemId: string) => {
    const item = appState.getItem(itemId);
    if (!item || item.kind !== 'image' || !item.fileKey) return null;
    const url = await api.fileUrl(item.fileKey);
    if (!url) return null;
    return downloadToTemp(url, item.filename ?? 'leaksync-image');
  });

  // Native drag-out. Images drag as a file; text/url drag as a temp .txt file
  // (Electron drag payloads are file-based).
  ipcMain.on(IPC.START_DRAG, async (e, itemId: string) => {
    const item = appState.getItem(itemId);
    if (!item) return;
    let filePath: string | null = null;
    let icon: Electron.NativeImage;

    if (item.kind === 'image' && item.fileKey) {
      const url = await api.fileUrl(item.fileKey);
      filePath = url ? await downloadToTemp(url, item.filename ?? 'image') : null;
      icon = filePath ? nativeImage.createFromPath(filePath) : nativeImage.createEmpty();
    } else {
      filePath = writeTemp(`${item.id}.txt`, item.text ?? '');
      icon = nativeImage.createEmpty();
    }
    if (filePath) {
      e.sender.startDrag({ file: filePath, icon });
    }
  });
};

// ----- helpers -----

const fetchImage = async (url: string): Promise<Electron.NativeImage | null> => {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return nativeImage.createFromBuffer(buf);
  } catch {
    return null;
  }
};

const downloadToTemp = async (url: string, name: string): Promise<string | null> => {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const safe = name.replace(/[^\w.\-]/g, '_');
    const p = join(tmpdir(), `leaksync-${Date.now()}-${safe}`);
    writeFileSync(p, buf);
    return p;
  } catch {
    return null;
  }
};

const writeTemp = (name: string, content: string): string => {
  const p = join(tmpdir(), `leaksync-${Date.now()}-${name}`);
  writeFileSync(p, content, 'utf8');
  return p;
};

// Keep a reference so flashTray import isn't tree-shaken in some builds.
void getTray;
