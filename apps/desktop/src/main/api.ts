import type { Item, Pair, PairCodeResult } from '@leaksync/core';

import { store } from './store.js';

// Backend HTTP client for the main process. Uses Node's global fetch. The Mac is
// always the `mac` device; its token comes from /pair/code and is persisted.

const BASE = process.env['LEAKSYNC_API_BASE'] ?? 'http://localhost:9090/api/v1';
const FILE_SERVICE =
  process.env['LEAKSYNC_FILE_SERVICE'] ?? 'https://go-file-service-production.up.railway.app';

interface Envelope<T> {
  data?: T;
  error?: { code: string; message: string };
}

const authHeaders = (): Record<string, string> => {
  const token = store.read().deviceToken;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const call = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(`${BASE}/${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...(init?.headers ?? {}) },
  });
  const body = (await res.json().catch(() => ({}))) as Envelope<T>;
  if (!res.ok || body.error) {
    throw new Error(body.error?.message ?? `Request failed (${res.status})`);
  }
  return body.data as T;
};

export const api = {
  base: BASE,

  // Mac creates a pair + code. Persists the Mac's token + identity.
  async createPairCode(macName: string, userName: string): Promise<PairCodeResult> {
    const result = await call<PairCodeResult>('pair/code', {
      method: 'POST',
      body: JSON.stringify({ macName, userName }),
    });
    store.write({
      deviceToken: result.deviceToken,
      pairId: result.pairId,
      macName,
      userName,
      lastSeq: 0,
    });
    return result;
  },

  getPair(): Promise<Pair> {
    return call<Pair>('pair');
  },

  // Poll items past the stored cursor.
  async poll(since: number, limit = 5): Promise<{ items: Item[]; latestSeq: number }> {
    return call<{ items: Item[]; latestSeq: number }>(`items?since=${since}&limit=${limit}`);
  },

  recent(limit = 5): Promise<{ items: Item[] }> {
    return call<{ items: Item[] }>(`items/recent?limit=${limit}`);
  },

  async unpair(): Promise<void> {
    await call<unknown>('unpair', { method: 'POST' });
  },

  // file-service: a signed view URL for an image key (valid ~1h).
  async fileUrl(key: string): Promise<string | null> {
    try {
      const res = await fetch(`${FILE_SERVICE}/get-file-uri?key=${encodeURIComponent(key)}`);
      if (!res.ok) return null;
      const body = (await res.json()) as { uri?: string };
      return body.uri ?? null;
    } catch {
      return null;
    }
  },
};
