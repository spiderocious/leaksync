import { EventEmitter } from 'node:events';

import WebSocket from 'ws';

import type { Item, WsServerMessage } from '@leaksync/core';
import { TRANSPORT, nextPollInterval } from '@leaksync/core';

import { api } from './api.js';
import { store } from './store.js';

// The Mac connection lifecycle (the spec, config-driven via @leaksync/core):
//   • On start, open a WebSocket. New items arrive instantly.
//   • The server hard-closes it after WS_LIFETIME_MS (or it drops) → poll.
//   • Polling backs off 1→2→4→8→16→20 min. Any poll returning a NEW item
//     resets us back to the WebSocket and restarts the cycle.
//   • refresh() polls immediately at any time.
//
// Emits: 'items' (Item[] newest-first), 'conn' ('live'|'polling'|'idle').

export type ConnState = 'live' | 'polling' | 'idle';

export class Transport extends EventEmitter {
  private ws: WebSocket | null = null;
  private pollTimer: NodeJS.Timeout | null = null;
  private pollInterval = TRANSPORT.POLL_MIN_MS;
  private running = false;

  start(): void {
    if (this.running) return;
    this.running = true;
    this.openSocket();
  }

  stop(): void {
    this.running = false;
    this.clearPoll();
    this.ws?.close();
    this.ws = null;
    this.emit('conn', 'idle' satisfies ConnState);
  }

  // Manual Refresh — poll now, regardless of mode.
  async refresh(): Promise<void> {
    await this.pollOnce(/* fromManual */ true);
  }

  private wsUrl(): string {
    const token = store.read().deviceToken ?? '';
    const httpBase = api.base.replace(/\/api\/v1$/, '');
    const wsBase = httpBase.replace(/^http/, 'ws');
    return `${wsBase}/api/v1/ws?token=${encodeURIComponent(token)}`;
  }

  private openSocket(): void {
    if (!this.running || !store.read().deviceToken) return;
    this.clearPoll();

    const ws = new WebSocket(this.wsUrl());
    this.ws = ws;

    ws.on('open', () => this.emit('conn', 'live' satisfies ConnState));

    ws.on('message', (raw) => {
      let msg: WsServerMessage;
      try {
        msg = JSON.parse(raw.toString()) as WsServerMessage;
      } catch {
        return;
      }
      if (msg.type === 'item') {
        this.ingest([msg.item]);
      } else if (msg.type === 'closing') {
        // server is enforcing the 5-min cap — fall to polling
        ws.close();
      }
    });

    const toPolling = (): void => {
      if (this.ws === ws) this.ws = null;
      if (this.running) this.startPolling();
    };
    ws.on('close', toPolling);
    ws.on('error', () => {
      try {
        ws.close();
      } catch {
        /* already closing */
      }
      toPolling();
    });
  }

  private startPolling(): void {
    this.emit('conn', 'polling' satisfies ConnState);
    this.pollInterval = TRANSPORT.POLL_MIN_MS;
    this.scheduleNextPoll();
  }

  private scheduleNextPoll(): void {
    this.clearPoll();
    this.pollTimer = setTimeout(() => {
      void this.pollOnce();
    }, this.pollInterval);
  }

  private async pollOnce(fromManual = false): Promise<void> {
    if (!this.running || !store.read().deviceToken) return;
    let gotNew = false;
    try {
      const since = store.read().lastSeq ?? 0;
      const { items, latestSeq } = await api.poll(since, 5);
      if (items.length > 0) {
        gotNew = true;
        store.write({ lastSeq: latestSeq });
        this.ingest(items);
      }
    } catch {
      // network blip — keep backing off
    }

    if (gotNew) {
      // reset-on-receive → back to the WebSocket, restart the cycle
      this.openSocket();
      return;
    }
    if (fromManual) {
      // a manual refresh that found nothing shouldn't disturb the backoff state
      if (!this.ws) this.scheduleNextPoll();
      return;
    }
    this.pollInterval = nextPollInterval(this.pollInterval);
    this.scheduleNextPoll();
  }

  // Update the stored cursor from any item batch + emit for the UI/notifications.
  private ingest(items: Item[]): void {
    const maxSeq = Math.max(store.read().lastSeq ?? 0, ...items.map((i) => i.seqId));
    store.write({ lastSeq: maxSeq });
    this.emit('items', items);
  }

  private clearPoll(): void {
    if (this.pollTimer) {
      clearTimeout(this.pollTimer);
      this.pollTimer = null;
    }
  }
}

export const transport = new Transport();
