import { Tray, Menu, nativeImage, type NativeImage } from 'electron';

import { togglePopup } from './window.js';

// The menu-bar tray icon — the "stack" glyph as a monochrome template image
// (macOS tints it for light/dark menu bars). It briefly highlights when a new
// item arrives. Embedded as base64 (verified to have visible pixels) so there's
// no asset path to resolve across dev/prod.

let tray: Tray | null = null;
let highlightTimer: NodeJS.Timeout | null = null;

// Three solid black bars on transparent — 16×16 (@1x) and 32×32 (@2x). Generated
// + pixel-verified (90/256 opaque). macOS tints template images to the menu bar.
const ICON_16 =
  'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHklEQVR4nGNgGAXo4D+ReNQAWhpAMRh4Lwx8GJAMAKhQWacBJN6RAAAAAElFTkSuQmCC';
const ICON_32 =
  'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAMUlEQVR4nO3SwQkAQAgDQftvWms4OIyPGfC/EKuAw/rzCRDAs/gEAgQQF/8BAQJgxQCm0irk8DhmfwAAAABJRU5ErkJggg==';

const baseIcon = (): NativeImage => {
  // Build a multi-rep image so the icon is crisp on Retina menu bars.
  const img = nativeImage.createFromBuffer(Buffer.from(ICON_16, 'base64'));
  img.addRepresentation({
    scaleFactor: 2,
    buffer: Buffer.from(ICON_32, 'base64'),
  });
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

// Briefly mark the icon "active" (non-template = full black, not menu-bar-tinted)
// so the user notices something landed, then revert.
export const flashTray = (): void => {
  if (!tray) return;
  const active = nativeImage.createFromBuffer(Buffer.from(ICON_16, 'base64'));
  active.addRepresentation({ scaleFactor: 2, buffer: Buffer.from(ICON_32, 'base64') });
  // non-template so it shows solid (emphasized) regardless of theme
  tray.setImage(active);
  if (highlightTimer) clearTimeout(highlightTimer);
  highlightTimer = setTimeout(() => tray?.setImage(baseIcon()), 1600);
};
