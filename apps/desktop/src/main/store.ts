import { app } from 'electron';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Tiny on-disk store for the device token + pair identity. Lives in Electron's
// userData dir so it survives restarts. JSON file — no DB needed for one record.

export interface PersistedState {
  deviceToken?: string;
  pairId?: string;
  macName?: string;
  userName?: string;
  lastSeq?: number; // poll cursor
}

const file = (): string => join(app.getPath('userData'), 'leaksync.json');

let cache: PersistedState | null = null;

export const store = {
  read(): PersistedState {
    if (cache) return cache;
    try {
      cache = existsSync(file()) ? (JSON.parse(readFileSync(file(), 'utf8')) as PersistedState) : {};
    } catch {
      cache = {};
    }
    return cache;
  },

  write(patch: Partial<PersistedState>): PersistedState {
    const next = { ...this.read(), ...patch };
    cache = next;
    try {
      writeFileSync(file(), JSON.stringify(next, null, 2), 'utf8');
    } catch {
      // best-effort; a failed write just means we re-pair next launch
    }
    return next;
  },

  clear(): void {
    cache = {};
    try {
      writeFileSync(file(), JSON.stringify({}, null, 2), 'utf8');
    } catch {
      // ignore
    }
  },
};
