import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import type { ItemKind } from '@leaksync/core';

// In-memory app state. NO API yet — this models what the share/compose flows
// will eventually POST to the backend, so the UI is real and the wiring is a
// drop-in later. `sent` is the local record of things this phone has sent
// (the home "Recently sent" list); `paired`/`macName` model the pairing state.

export interface SentItem {
  id: string;
  kind: ItemKind; // 'text' | 'url' | 'image'
  /** text body, the URL, or the image filename. */
  content: string;
  /** local uri for an image preview (kind === 'image'). */
  uri?: string;
  /** ISO timestamp the item was sent. */
  sentAt: string;
}

interface AppState {
  paired: boolean;
  macName: string;
  userName: string;
  sent: SentItem[];
  pair: (code: string, macName?: string) => void;
  unpair: () => void;
  addSent: (item: Omit<SentItem, 'id' | 'sentAt'>) => SentItem;
}

const AppStateContext = createContext<AppState | null>(null);

let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `local-${idCounter}`;
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // Seeded as already-paired with a couple of recent sends so every screen has
  // real content to render with no backend. Flip `paired` to false to see the
  // first-run pairing flow.
  const [paired, setPaired] = useState(true);
  const [macName, setMacName] = useState("Ada’s MacBook");
  const [userName] = useState('Ada');
  const [sent, setSent] = useState<SentItem[]>(() => seedSent());

  const pair = useCallbackSafe((code: string, mac?: string) => {
    setPaired(true);
    if (mac) setMacName(mac);
  });

  const unpair = useCallbackSafe(() => {
    setPaired(false);
    setSent([]);
  });

  const addSent = useCallbackSafe((item: Omit<SentItem, 'id' | 'sentAt'>) => {
    const full: SentItem = { ...item, id: nextId(), sentAt: new Date().toISOString() };
    setSent((prev) => [full, ...prev].slice(0, 5));
    return full;
  });

  const value = useMemo<AppState>(
    () => ({ paired, macName, userName, sent, pair, unpair, addSent }),
    [paired, macName, userName, sent, pair, unpair, addSent],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}

// React 19 exposes useCallback; alias to keep imports tidy and avoid the named
// import clashing in some RN type setups.
function useCallbackSafe<T extends (...args: never[]) => unknown>(fn: T): T {
  return useCallback(fn, []) as T;
}

function seedSent(): SentItem[] {
  const now = Date.now();
  const min = 60_000;
  return [
    {
      id: nextId(),
      kind: 'url',
      content: 'https://www.nytimes.com/2026/the-quiet-web',
      sentAt: new Date(now - 2 * min).toISOString(),
    },
    {
      id: nextId(),
      kind: 'text',
      content: '“The best interface is the one that gets out of the way.”',
      sentAt: new Date(now - 18 * min).toISOString(),
    },
  ];
}
