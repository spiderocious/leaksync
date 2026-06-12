import type { LeakSyncBridge } from '../../shared/ipc.js';

declare global {
  interface Window {
    leaksync: LeakSyncBridge;
  }
}

export {};
