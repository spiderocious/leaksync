import { Notification } from 'electron';

import type { Item } from '@leaksync/core';

import { getPopup, showPopupAtTray } from './window.js';
import { getTray } from './tray.js';

// Native notification on arrival. Title is fixed; body previews the item. The
// custom chime is played in the renderer (web audio) via the 'highlight' path —
// here we keep `silent: true` so the system default doesn't double up.

const preview = (item: Item): string => {
  switch (item.kind) {
    case 'image':
      return 'Image received';
    case 'url':
      return item.text ?? 'Link received';
    default: {
      const t = item.text ?? '';
      return t.length > 80 ? `${t.slice(0, 79)}…` : t;
    }
  }
};

export const notifyArrival = (items: Item[]): void => {
  if (items.length === 0) return;
  const newest = items[0]!;
  const n = new Notification({
    title: 'New from your phone',
    body: items.length > 1 ? `${items.length} new items` : preview(newest),
    silent: true, // the renderer plays the warm chime instead of the system blip
  });
  n.on('click', () => {
    const tray = getTray();
    if (tray) showPopupAtTray(tray);
    getPopup()?.webContents.send('item:highlight', newest.id);
  });
  n.show();
};
