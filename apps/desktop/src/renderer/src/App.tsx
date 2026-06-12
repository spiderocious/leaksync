import { useEffect, useMemo, useRef, useState } from "react";

import { formatRelative, type Item } from "@leaksync/core";
import {
  AboutScene,
  type AppItem,
  type AppStatusKind,
  MenuBarPopup,
  PairingDisplayScene,
  SettingsScene,
} from "@leaksync/ui";

import type { AppState } from "../../shared/ipc.js";
import { playChime } from "./chime.js";

type View = "main" | "settings" | "about";

const CONN_TO_STATUS: Record<AppState["conn"], AppStatusKind> = {
  live: "live",
  polling: "reconnecting",
  idle: "idle",
};
const CONN_LABEL: Record<AppState["conn"], string> = {
  live: "Connected",
  polling: "Syncing",
  idle: "Offline",
};

export function App() {
  const [state, setState] = useState<AppState | null>(null);
  const [view, setView] = useState<View>("main");
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [bridgeMissing, setBridgeMissing] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const codeRequested = useRef(false);

  // When unpaired with no code yet, request one — exactly once.
  useEffect(() => {
    if (
      state &&
      !state.paired &&
      !state.pairingCode &&
      !codeRequested.current
    ) {
      codeRequested.current = true;
      void window.leaksync.createPairCode();
    }
    if (state?.paired) codeRequested.current = false;
  }, [state]);

  // Subscribe to main-process state + the highlight (notification click) signal.
  useEffect(() => {
    // The bridge only exists inside Electron (injected by the preload). If this
    // is opened in a plain browser (the Vite dev URL), there's no bridge — show
    // a hint instead of crashing.
    if (!window.leaksync) {
      setBridgeMissing(true);
      return;
    }
    void window.leaksync.getState().then(setState);
    const offState = window.leaksync.onStateChanged(setState);
    const offHi = window.leaksync.onHighlightItem((id) => {
      setHighlightId(id);
      setView("main");
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
  }, [newestId]);

  // Resolve image thumbnail URLs lazily for any image items we haven't yet.
  useEffect(() => {
    const images = (state?.items ?? []).filter(
      (i) => i.kind === "image" && i.fileKey,
    );
    images.forEach((i) => {
      if (i.fileKey && !thumbs[i.fileKey]) {
        void window.leaksync.imageUrl(i.fileKey).then((url) => {
          if (url) setThumbs((t) => ({ ...t, [i.fileKey!]: url }));
        });
      }
    });
  }, [state?.items]);

  const appItems = useMemo<AppItem[]>(
    () => (state?.items ?? []).map((it) => toAppItem(it, thumbs, highlightId)),
    [state?.items, thumbs, highlightId],
  );

  if (bridgeMissing) {
    return (
      <Centered>
        <div className="max-w-[300px] rounded-card border border-hair bg-paper-sheet p-5 text-center">
          <div className="font-serif text-[15px] text-ink">
            Open me from the app, not the browser
          </div>
          <div className="mt-2 font-sans text-[12px] leading-[1.5] text-ink-3">
            This is the LeakSync menu-bar window. Run{" "}
            <code>pnpm -F @leaksync/desktop dev</code> and click the tray icon —
            the Vite URL in a browser has no app bridge.
          </div>
        </div>
      </Centered>
    );
  }

  if (!state) return null;

  // ----- Not paired yet → show the pairing code (requested in the effect above) -----
  if (!state.paired) {
    if (!state.pairingCode) {
      return <Centered>Generating pairing code…</Centered>;
    }
    return (
      <Centered>
        <div className="flex flex-col items-center">
          <PairingDisplayScene code={state.pairingCode} />
          <button
            type="button"
            onClick={() => void window.leaksync.regenerateCode()}
            className="mt-3 inline-flex items-center gap-[6px] font-sans text-[11px] font-medium text-ink-3 hover:text-ink"
          >
            <RefreshIcon />
            New code
          </button>
        </div>
      </Centered>
    );
  }

  if (view === "settings") {
    return (
      <Centered>
        <SettingsScene
          rows={[
            { key: "Paired with", value: state.macName },
            { key: "Connection", value: CONN_LABEL[state.conn] },
            { key: "Version", value: "0.1.0" },
          ]}
          onBack={() => setView("main")}
          onUnpair={() => void window.leaksync.unpair()}
        />
      </Centered>
    );
  }

  if (view === "about") {
    return (
      <Centered>
        <AboutScene
          note={`${state.userName ? `${state.userName}, ` : ""}share anything from your phone and it lands right here. Pair once, share forever.`}
          version="LEAKSYNC · 0.1.0"
          onBack={() => setView("settings")}
        />
      </Centered>
    );
  }

  return (
    <div className="h-full w-full">
      <MenuBarPopup
        flush
        items={appItems}
        status={CONN_TO_STATUS[state.conn]}
        statusLabel={CONN_LABEL[state.conn]}
        onCopy={(item) => void window.leaksync.copyItem(item.id)}
        onDragStart={(item, e) => {
          e.preventDefault();
          window.leaksync.startDrag(item.id);
        }}
        onSettings={() => setView("settings")}
        headerActions={
          <span className="inline-flex items-center gap-[8px]">
            <IconButton
              title="Refresh"
              onClick={() => void window.leaksync.refresh()}
            >
              <RefreshIcon />
            </IconButton>
            <IconButton
              title="End session"
              onClick={() => setView("settings")}  // () => setConfirmLogout(true)}
            >
              <SettingsCogIcon />
            </IconButton>
          </span>
        }
      />
      {confirmLogout ? (
        <LogoutConfirm
          code={state.sessionCode}
          onCancel={() => setConfirmLogout(false)}
          onConfirm={() => {
            setConfirmLogout(false);
            void window.leaksync.unpair();
          }}
        />
      ) : null}
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full items-start justify-center p-2">
      {children}
    </div>
  );
}

// A quiet square header icon button.
function IconButton({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className="flex h-[22px] w-[22px] items-center justify-center rounded-sharp text-ink-3 transition-colors hover:bg-paper-2 hover:text-ink"
    >
      {children}
    </button>
  );
}

function RefreshIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  );
}

// "Switch / end session" — a log-out glyph.
// function SwitchIcon() {
//   return (
//     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
//       <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
//       <path d="M16 17l5-5-5-5" />
//       <path d="M21 12H9" />
//     </svg>
//   );
// }

function SettingsCogIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l0 0a1.65 1.65 0 0 1-2.33 2.33l0 0a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-.95 1.51V21a1.65 1.65 0 0 1-3.3 0v0a1.65 1.65 0 0 0-.95-1.51 1.65 1.65 0 0 0-1.82.33l0 0a1.65 1.65 0 0 1-2.33-2.33l0 0a1.65 1.65 0 0 0 .33-1.82A1.65 1.65 0 0 0 .51 13H0a1.65 1.65 0 0 1 0-3h0a1.65 1.65 0 0 0 .51-1.51A1.65 1.65 0 0 0 .18 7l0 0a1.65 1.65 0 0 1 2.33-2.33l0 0a1.65 1.65 0 0 0 1.82.33h0A1.65 1.65 0 0 0 7.5 4.51V5a1.65 1.65 0 0 1 3.3 0v0a1.65 1.65 0 0 0 .95 1.51h0a1.65 1.65 0 0 0 1.82-.33l0 0a1.65 1.65 0 0 1 2.33 2.33l0 0a1.65 1.65 0 0 0-.33 1.82z" />
    </svg>
  );
}

// The confirm modal shown before ending the session. Surfaces the code that
// started it — the user needs it (or a fresh one) to pair again.
function LogoutConfirm({
  code,
  onCancel,
  onConfirm,
}: {
  code: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(35,33,28,0.18)] p-4"
      onClick={onCancel}
    >
      <div
        className="w-[300px] rounded-card border border-hair bg-paper-sheet p-5 shadow-[var(--pop-shadow)]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="m-0 font-serif text-[15px] leading-snug text-ink">
          End this session?
        </p>
        <p className="m-0 mt-2 font-sans text-[12px] leading-[1.5] text-ink-2">
          Your phone will be unpaired. This session started with the code below
          — ending it generates a fresh code to pair again.
        </p>
        {code ? (
          <div className="mt-3 rounded-sharp border border-hair bg-paper py-3 text-center font-mono text-[22px] tracking-[0.3em] text-ink">
            {code}
          </div>
        ) : null}
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="font-sans text-[12px] font-medium text-ink-3 hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-card border border-ink px-[14px] py-[7px] font-sans text-[12px] font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            End session
          </button>
        </div>
      </div>
    </div>
  );
}

function toAppItem(
  it: Item,
  thumbs: Record<string, string>,
  highlightId: string | null,
): AppItem {
  const kind =
    it.kind === "url" ? "link" : it.kind === "image" ? "image" : "text";
  const content =
    it.kind === "image" ? (it.filename ?? "Image") : (it.text ?? "");
  return {
    id: it.id,
    kind,
    content,
    thumbSrc:
      it.kind === "image" && it.fileKey ? thumbs[it.fileKey] : undefined,
    when: formatRelative(it.createdAt),
    fresh: it.id === highlightId,
  };
}
