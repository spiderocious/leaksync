import type { WebSocket } from 'ws';

import type { Item, WsServerMessage } from '@leaksync/core';

// The realtime hub. Mac clients connect (one socket per pair in practice) and
// register here; when Android POSTs an item, items.service calls pushItem() and
// the relevant Mac socket receives it. Pure in-memory — at one-user scale there
// is no need for a cross-instance broker.

const sockets = new Map<string, Set<WebSocket>>();

export const hub = {
  add(pairId: string, ws: WebSocket): void {
    const set = sockets.get(pairId) ?? new Set<WebSocket>();
    set.add(ws);
    sockets.set(pairId, set);
  },

  remove(pairId: string, ws: WebSocket): void {
    const set = sockets.get(pairId);
    if (!set) return;
    set.delete(ws);
    if (set.size === 0) sockets.delete(pairId);
  },

  // Is a Mac currently connected for this pair? (Informational.)
  isConnected(pairId: string): boolean {
    return (sockets.get(pairId)?.size ?? 0) > 0;
  },

  // Relay a freshly-stored item to the pair's Mac socket(s), if any are open.
  pushItem(pairId: string, item: Item): void {
    this.send(pairId, { type: 'item', item });
  },

  send(pairId: string, message: WsServerMessage): void {
    const set = sockets.get(pairId);
    if (!set) return;
    const payload = JSON.stringify(message);
    for (const ws of set) {
      if (ws.readyState === ws.OPEN) ws.send(payload);
    }
  },
};
