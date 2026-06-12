import type { Item } from '@leaksync/core';

// The IPC contract between the Node main process (owns the token, the WS/poll
// client, all networking) and the renderer (pure UI). The renderer never talks
// to the backend directly — it renders `AppState` and sends intents.

export type ConnState = 'live' | 'polling' | 'idle';

// The full UI state the main process pushes to the renderer.
export interface AppState {
  paired: boolean;
  macName: string;
  userName: string;
  conn: ConnState; // live = WS open, polling = backoff, idle = not connected
  items: Item[]; // last 5, newest first
  pairingCode: string | null; // shown until an Android device redeems it
}

// Renderer → main intents (invoke, returns a value).
export interface IpcApi {
  getState: () => Promise<AppState>;
  createPairCode: () => Promise<{ pairingCode: string }>;
  refresh: () => Promise<void>;
  unpair: () => Promise<void>;
  copyItem: (itemId: string) => Promise<void>;
  // Returns a short-lived local file path for an image item, for drag-out.
  imagePathForDrag: (itemId: string) => Promise<string | null>;
  // Returns a signed view URL for an image item (thumbnail rendering).
  imageUrl: (fileKey: string) => Promise<string | null>;
}

// Channel names — one place so main/preload/renderer agree.
export const IPC = {
  // invoke (renderer → main → value)
  GET_STATE: 'state:get',
  CREATE_CODE: 'pair:create-code',
  REFRESH: 'items:refresh',
  UNPAIR: 'pair:unpair',
  COPY_ITEM: 'item:copy',
  IMAGE_PATH_FOR_DRAG: 'item:image-path',
  IMAGE_URL: 'item:image-url',
  START_DRAG: 'item:start-drag',
  // events (main → renderer, on)
  STATE_CHANGED: 'state:changed',
  HIGHLIGHT_ITEM: 'item:highlight',
} as const;

// The shape exposed on window.leaksync by the preload bridge.
export interface LeakSyncBridge extends IpcApi {
  onStateChanged: (cb: (state: AppState) => void) => () => void;
  onHighlightItem: (cb: (itemId: string) => void) => () => void;
  startDrag: (itemId: string) => void;
}
