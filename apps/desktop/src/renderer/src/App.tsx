import { useEffect, useMemo, useState } from 'react';

import { formatRelative, type Item } from '@leaksync/core';
import {
  AboutScene,
  type AppItem,
  type AppStatusKind,
  MenuBarPopup,
  PairingDisplayScene,
  SettingsScene,
} from '@leaksync/ui';

import type { AppState } from '../../shared/ipc.js';
import { playChime } from './chime.js';

type View = 'main' | 'settings' | 'about';

const CONN_TO_STATUS: Record<AppState['conn'], AppStatusKind> = {
  live: 'live',
  polling: 'reconnecting',
  idle: 'idle',
};
const CONN_LABEL: Record<AppState['conn'], string> = {
  live: 'Connected',
  polling: 'Syncing',
  idle: 'Offline',
};

export function App() {
  const [state, setState] = useState<AppState | null>(null);
  const [view, setView] = useState<View>('main');
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const [highlightId, setHighlightId] = useState<string | null>(null);

  // Subscribe to main-process state + the highlight (notification click) signal.
  useEffect(() => {
    void window.leaksync.getState().then(setState);
    const offState = window.leaksync.onStateChanged(setState);
    const offHi = window.leaksync.onHighlightItem((id) => {
      setHighlightId(id);
      setView('main');
    });
    return () => {
      offState();
      offHi();
    };
  }, []);

  // Play the warm chime whenever the newest item id changes to something new.
  const newestId = state?.items[0]?.id;
  useEffect(() => {
    if (newestId) playChime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newestId]);

  // Resolve image thumbnail URLs lazily for any image items we haven't yet.
  useEffect(() => {
    const images = (state?.items ?? []).filter((i) => i.kind === 'image' && i.fileKey);
    images.forEach((i) => {
      if (i.fileKey && !thumbs[i.fileKey]) {
        void window.leaksync.imageUrl(i.fileKey).then((url) => {
          if (url) setThumbs((t) => ({ ...t, [i.fileKey!]: url }));
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.items]);

  const appItems = useMemo<AppItem[]>(
    () => (state?.items ?? []).map((it) => toAppItem(it, thumbs, highlightId)),
    [state?.items, thumbs, highlightId],
  );

  if (!state) return null;

  // ----- Not paired yet → show the pairing code (create one if needed) -----
  if (!state.paired) {
    if (!state.pairingCode) {
      void window.leaksync.createPairCode();
      return <Centered>Generating pairing code…</Centered>;
    }
    return (
      <Centered>
        <PairingDisplayScene code={state.pairingCode} />
      </Centered>
    );
  }

  if (view === 'settings') {
    return (
      <Centered>
        <SettingsScene
          rows={[
            { key: 'Paired with', value: state.macName },
            { key: 'Connection', value: CONN_LABEL[state.conn] },
            { key: 'Version', value: '0.1.0' },
          ]}
          onBack={() => setView('main')}
          onUnpair={() => void window.leaksync.unpair()}
        />
      </Centered>
    );
  }

  if (view === 'about') {
    return (
      <Centered>
        <AboutScene
          note={`${state.userName ? `${state.userName}, ` : ''}share anything from your phone and it lands right here. Pair once, share forever.`}
          version="LEAKSYNC · 0.1.0"
          onBack={() => setView('settings')}
        />
      </Centered>
    );
  }

  return (
    <Centered>
      <MenuBarPopup
        items={appItems}
        status={CONN_TO_STATUS[state.conn]}
        statusLabel={CONN_LABEL[state.conn]}
        onCopy={(item) => void window.leaksync.copyItem(item.id)}
        onDragStart={(item, e) => {
          e.preventDefault();
          window.leaksync.startDrag(item.id);
        }}
        onSettings={() => setView('settings')}
        footerSlot={
          <button
            type="button"
            onClick={() => void window.leaksync.refresh()}
            className="font-sans text-[11px] font-medium text-ink-3 hover:text-ink"
          >
            ↻ Refresh
          </button>
        }
      />
    </Centered>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="flex h-full w-full items-start justify-center p-2">{children}</div>;
}

function toAppItem(it: Item, thumbs: Record<string, string>, highlightId: string | null): AppItem {
  const kind = it.kind === 'url' ? 'link' : it.kind === 'image' ? 'image' : 'text';
  const content =
    it.kind === 'image' ? (it.filename ?? 'Image') : (it.text ?? '');
  return {
    id: it.id,
    kind,
    content,
    thumbSrc: it.kind === 'image' && it.fileKey ? thumbs[it.fileKey] : undefined,
    when: formatRelative(it.createdAt),
    fresh: it.id === highlightId,
  };
}
