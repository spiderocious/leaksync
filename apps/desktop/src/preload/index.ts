import { contextBridge, ipcRenderer } from 'electron';

import { IPC, type AppState, type LeakSyncBridge } from '../shared/ipc.js';

// The only surface the renderer can touch. Everything routes through typed IPC;
// the renderer never imports Node or talks to the backend directly.
const bridge: LeakSyncBridge = {
  getState: () => ipcRenderer.invoke(IPC.GET_STATE),
  createPairCode: () => ipcRenderer.invoke(IPC.CREATE_CODE),
  regenerateCode: () => ipcRenderer.invoke(IPC.REGEN_CODE),
  refresh: () => ipcRenderer.invoke(IPC.REFRESH),
  unpair: () => ipcRenderer.invoke(IPC.UNPAIR),
  copyItem: (itemId) => ipcRenderer.invoke(IPC.COPY_ITEM, itemId),
  imagePathForDrag: (itemId) => ipcRenderer.invoke(IPC.IMAGE_PATH_FOR_DRAG, itemId),
  imageUrl: (fileKey) => ipcRenderer.invoke(IPC.IMAGE_URL, fileKey),

  startDrag: (itemId) => ipcRenderer.send(IPC.START_DRAG, itemId),

  onStateChanged: (cb: (s: AppState) => void) => {
    const handler = (_e: unknown, s: AppState): void => cb(s);
    ipcRenderer.on(IPC.STATE_CHANGED, handler);
    return () => ipcRenderer.removeListener(IPC.STATE_CHANGED, handler);
  },
  onHighlightItem: (cb: (itemId: string) => void) => {
    const handler = (_e: unknown, id: string): void => cb(id);
    ipcRenderer.on(IPC.HIGHLIGHT_ITEM, handler);
    return () => ipcRenderer.removeListener(IPC.HIGHLIGHT_ITEM, handler);
  },
};

contextBridge.exposeInMainWorld('leaksync', bridge);
