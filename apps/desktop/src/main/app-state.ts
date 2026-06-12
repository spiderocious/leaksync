import { EventEmitter } from 'node:events';
import { hostname, userInfo } from 'node:os';

import type { Item } from '@leaksync/core';

import type { AppState, ConnState } from '../shared/ipc.js';
import { api } from './api.js';
import { store } from './store.js';
import { transport } from './transport.js';

// The single source of truth for the renderer's view. Subscribes to the
// transport, keeps the last-5 list, and emits 'changed' (full AppState) +
// 'arrived' (new items, for the notification + chime).

const MAX_ITEMS = 5;

class AppStateManager extends EventEmitter {
  private conn: ConnState = 'idle';
  private items: Item[] = [];
  private pairingCode: string | null = null;

  init(): void {
    transport.on('conn', (c: ConnState) => {
      this.conn = c;
      this.emitChanged();
    });
    transport.on('items', (incoming: Item[]) => {
      this.mergeItems(incoming);
      this.emit('arrived', incoming);
      this.emitChanged();
    });

    // If we already have a token, hydrate the recent list and start the loop.
    if (store.read().deviceToken) {
      void this.hydrate();
      transport.start();
    }
  }

  snapshot(): AppState {
    const s = store.read();
    return {
      paired: Boolean(s.deviceToken) && this.pairingCode === null,
      macName: s.macName ?? 'this Mac',
      userName: s.userName ?? '',
      conn: this.conn,
      items: this.items,
      pairingCode: this.pairingCode,
      sessionCode: s.sessionCode ?? null, // the code that started this session
    };
  }

  // ----- intents from IPC -----

  async createPairCode(): Promise<{ pairingCode: string }> {
    const macName = store.read().macName ?? hostName();
    // userName is the gift personalisation (Phase 8). Until then, default to the
    // macOS account name so the backend's non-empty requirement is satisfied.
    const userName = store.read().userName || defaultUserName();
    const result = await api.createPairCode(macName, userName);
    this.pairingCode = result.pairingCode;
    store.write({ sessionCode: result.pairingCode }); // remember it for the logout modal
    this.items = [];
    this.emitChanged();
    transport.start();
    // Poll for the pairing to complete: once an Android device joins, clear the
    // code so the UI flips to the item list.
    void this.watchForPairing();
    return { pairingCode: result.pairingCode };
  }

  /// Mint a fresh code, abandoning any stale/consumed/orphaned pair. Used by the
  /// "New code" button and when a stale code is detected.
  async regenerateCode(): Promise<{ pairingCode: string }> {
    transport.stop();
    store.clear(); // drop the dead token/pairId so createPairCode starts clean
    this.pairingCode = null;
    return this.createPairCode();
  }

  async refresh(): Promise<void> {
    await transport.refresh();
  }

  async unpair(): Promise<void> {
    try {
      await api.unpair();
    } catch {
      // even if the server call fails, drop local state
    }
    transport.stop();
    store.clear();
    this.items = [];
    this.pairingCode = null;
    this.conn = 'idle';
    this.emitChanged();
  }

  getItem(id: string): Item | undefined {
    return this.items.find((i) => i.id === id);
  }

  // ----- internals -----

  private async hydrate(): Promise<void> {
    try {
      const { items } = await api.recent(MAX_ITEMS);
      this.items = items;
      this.emitChanged();
    } catch {
      /* offline — the poll loop will fill it in */
    }
  }

  private async watchForPairing(): Promise<void> {
    for (let i = 0; i < 120 && this.pairingCode !== null; i += 1) {
      await delay(1500);
      try {
        const pair = await api.getPair();
        if (pair.paired) {
          this.pairingCode = null;
          this.emitChanged();
          return;
        }
      } catch {
        /* keep waiting */
      }
    }
  }

  private mergeItems(incoming: Item[]): void {
    const byId = new Map(this.items.map((i) => [i.id, i]));
    for (const it of incoming) byId.set(it.id, it);
    this.items = [...byId.values()]
      .sort((a, b) => b.seqId - a.seqId)
      .slice(0, MAX_ITEMS);
  }

  private emitChanged(): void {
    this.emit('changed', this.snapshot());
  }
}

const delay = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));
const hostName = (): string => {
  try {
    return hostname();
  } catch {
    return 'this Mac';
  }
};
const defaultUserName = (): string => {
  try {
    return userInfo().username || 'you';
  } catch {
    return 'you';
  }
};

export const appState = new AppStateManager();
