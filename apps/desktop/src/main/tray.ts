import { Tray, Menu, nativeImage, type NativeImage } from 'electron';

import { togglePopup } from './window.js';

// The menu-bar tray icon — the "stack" glyph as a monochrome template image
// (macOS tints it for light/dark menu bars). It briefly highlights when a new
// item arrives. Drawn from a tiny PNG data URL so there's no asset to ship.

let tray: Tray | null = null;
let highlightTimer: NodeJS.Timeout | null = null;

// A 16×16 "stack of three bars" glyph, black on transparent — the template icon.
// (Pre-rendered 1x PNG; macOS scales/tints template images.)
const ICON_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAUklEQVR4nO3SsQ2AMAxE0R8oKZmA' +
  'ETICI2QENmAERmADRmAERmADRmCEpKChQEKQ0vBd5+rsK2xJkmRJkmRJkiTpkwM4A2egB3pgBdbA' +
  'A7gCDXA2xgsd2QYV0wAAAABJRU5ErkJggg==';

const baseIcon = (): NativeImage => {
  const img = nativeImage.createFromBuffer(Buffer.from(ICON_PNG_BASE64, 'base64'));
  img.setTemplateImage(true); // tint to match the menu bar
  return img;
};

export const createTray = (): Tray => {
  tray = new Tray(baseIcon());
  tray.setToolTip('LeakSync');

  tray.on('click', () => {
    if (tray) togglePopup(tray);
  });
  tray.on('right-click', () => {
    tray?.popUpContextMenu(
      Menu.buildFromTemplate([
        { label: 'Open LeakSync', click: () => tray && togglePopup(tray) },
        { type: 'separator' },
        { label: 'Quit', role: 'quit' },
      ]),
    );
  });

  return tray;
};

export const getTray = (): Tray | null => tray;

// Briefly mark the icon "active" (a non-template tinted variant) so the user
// notices something landed, then revert.
export const flashTray = (): void => {
  if (!tray) return;
  const active = nativeImage.createFromBuffer(Buffer.from(ICON_PNG_BASE64, 'base64'));
  // non-template so it shows the accent (slightly emphasized) regardless of theme
  tray.setImage(active);
  if (highlightTimer) clearTimeout(highlightTimer);
  highlightTimer = setTimeout(() => tray?.setImage(baseIcon()), 1600);
};
