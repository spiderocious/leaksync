import { Show } from 'meemaw';
import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '../../utils/cn.ts';

// Modal layer — e-ink quiet. A raised paper sheet, the one shadow-caster besides
// the popup. NO red, no theatrics: this product's gravity is near-zero, so even
// the destructive variant is firm-but-calm. The CriticalModal (type-to-confirm)
// exists for genuinely irreversible actions, but LeakSync's unpair does NOT use
// it — re-pairing takes ten seconds. Spec: 40-modals.html.

export type ModalPosition = 'center' | 'top' | 'bottom' | 'left' | 'right';

interface SharedModalProps {
  open: boolean;
  onClose: () => void;
  position?: ModalPosition;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  /** Only confirm/cancel dismisses — no scrim click, no Escape. */
  sticky?: boolean;
  children?: ReactNode;
}

const POSITION_WRAP: Record<ModalPosition, string> = {
  center: 'items-center justify-center',
  top: 'items-start justify-center pt-10',
  bottom: 'items-end justify-center pb-10',
  left: 'items-stretch justify-start',
  right: 'items-stretch justify-end',
};

function ModalScrim({
  open,
  onClose,
  position = 'center',
  closeOnOutsideClick = true,
  closeOnEscape = true,
  sticky = false,
  children,
}: SharedModalProps) {
  useEffect(() => {
    if (!open || sticky || !closeOnEscape) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, sticky, closeOnEscape, onClose]);

  if (!open) return null;

  const canScrimClose = !sticky && closeOnOutsideClick;

  return createPortal(
    <div
      className={cn('fixed inset-0 z-[1000] flex bg-paper-2/70 p-6', POSITION_WRAP[position])}
      onClick={canScrimClose ? onClose : undefined}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="ls-fiber relative w-[320px] max-w-full rounded-card border border-hair bg-paper-sheet p-[22px] shadow-[0_22px_60px_-16px_rgba(35,33,28,0.42)]"
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

// ---------- Standard / danger confirm ----------

export interface AppModalProps extends SharedModalProps {
  title: ReactNode;
  description?: ReactNode;
  /** 'standard' (default) or 'danger'. Neither uses red — danger just leads with the calm choice. */
  intent?: 'standard' | 'danger';
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
}

export function AppModal({
  title,
  description,
  intent = 'standard',
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  onConfirm,
  children,
  ...scrim
}: AppModalProps) {
  return (
    <ModalScrim {...scrim}>
      <h3 className="m-0 text-center font-serif text-[19px] font-medium tracking-[-0.01em] text-ink">
        {title}
      </h3>
      <Show when={description !== undefined && description !== null}>
        <p className="m-0 mt-[10px] text-center font-serif text-[13px] leading-[1.6] text-ink-3">
          {description}
        </p>
      </Show>
      {children}
      <div className="mt-[22px] flex gap-[10px]">
        <button
          onClick={scrim.onClose}
          className="flex-1 rounded-card border border-hair px-3 py-[10px] font-sans text-[12px] font-medium text-ink hover:border-ink-3 hover:bg-paper-2"
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          className={cn(
            'flex-1 rounded-card border px-3 py-[10px] font-sans text-[12px] font-medium',
            // Even 'danger' is calm — border + ink-fill on hover, never red.
            intent === 'danger'
              ? 'border-ink-3 text-ink hover:border-ink hover:bg-ink hover:text-paper'
              : 'border-ink-3 text-ink hover:border-ink hover:bg-ink hover:text-paper',
          )}
        >
          {confirmLabel}
        </button>
      </div>
    </ModalScrim>
  );
}

// ---------- Critical (type-to-confirm) ----------

export interface CriticalModalProps extends SharedModalProps {
  title: ReactNode;
  description?: ReactNode;
  /** The word the user must type. Case-sensitive. */
  confirmPhrase: string;
  confirmPrompt: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
}

export function CriticalModal({
  title,
  description,
  confirmPhrase,
  confirmPrompt,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  children,
  ...scrim
}: CriticalModalProps) {
  const [typed, setTyped] = useState('');
  const matches = typed === confirmPhrase;

  return (
    <ModalScrim {...scrim}>
      <h3 className="m-0 text-center font-serif text-[19px] font-medium tracking-[-0.01em] text-ink">
        {title}
      </h3>
      <Show when={description !== undefined && description !== null}>
        <p className="m-0 mt-[10px] text-center font-serif text-[13px] leading-[1.6] text-ink-3">
          {description}
        </p>
      </Show>
      {children}
      <label className="mt-4 block text-center font-sans text-[11px] text-ink-3">{confirmPrompt}</label>
      <input
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        className="mt-2 w-full rounded-card border border-hair bg-paper px-3 py-2 text-center font-mono text-[14px] text-ink focus:border-ink focus:outline-none"
        autoFocus
      />
      <div className="mt-[18px] flex gap-[10px]">
        <button
          onClick={scrim.onClose}
          className="flex-1 rounded-card border border-hair px-3 py-[10px] font-sans text-[12px] font-medium text-ink hover:border-ink-3 hover:bg-paper-2"
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          disabled={!matches}
          className="flex-1 rounded-card border border-ink-3 px-3 py-[10px] font-sans text-[12px] font-medium text-ink hover:border-ink hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
        >
          {confirmLabel}
        </button>
      </div>
    </ModalScrim>
  );
}

// ---------- Custom (arbitrary body) ----------

export interface CustomModalProps extends SharedModalProps {
  hideCloseButton?: boolean;
}

export function CustomModal({ hideCloseButton = false, children, ...scrim }: CustomModalProps) {
  return (
    <ModalScrim {...scrim}>
      <Show when={!hideCloseButton}>
        <button
          onClick={scrim.onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center text-ink-3 hover:text-ink"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </Show>
      {children}
    </ModalScrim>
  );
}
