'use client';

import { type DragEvent, type ReactNode } from 'react';

import { AppRecentList } from '../../data/app-recent-list/index.ts';
import { AppEmptyState } from '../../data/app-empty-state/index.ts';
import { AppStatusDot, type AppStatusKind } from '../../primitives/app-status-dot/index.ts';
import { AppText } from '../../primitives/app-text/index.ts';
import { type AppItem } from '../../primitives/app-item-row/index.ts';
import { cn } from '../../utils/cn.ts';

// MenuBarPopup — the whole product on the Mac, in one ~360px window. The
// monochrome tray icon warms when something arrives; click it and the last five
// items are here. Composes AppRecentList + status + footer.
// Spec: design-system/projects/leaksync/preview/30-menu-bar.html
export interface MenuBarPopupProps {
  items: AppItem[];
  status?: AppStatusKind;
  statusLabel?: string;
  onCopy?: (item: AppItem) => void;
  onDragStart?: (item: AppItem, e: DragEvent<HTMLDivElement>) => void;
  onSettings?: () => void;
  /** Empty-state slot override; defaults to the standard "nothing yet". */
  emptyTitle?: string;
  emptyDescription?: string;
  footerSlot?: ReactNode;
  /** Icons rendered in the header, between the wordmark and the status dot. */
  headerActions?: ReactNode;
  /** When true, fill the container edge-to-edge (no rounded corners/shadow) —
   *  for when the popup IS the whole window (Electron menu-bar). */
  flush?: boolean;
  className?: string;
}

export function MenuBarPopup({
  items,
  status = 'live',
  statusLabel = status === 'live' ? 'Connected' : status === 'idle' ? 'Offline' : 'Reconnecting',
  onCopy,
  onDragStart,
  onSettings,
  emptyTitle = 'Nothing here yet',
  emptyDescription = 'Share something to LeakSync from your phone and it will land here.',
  footerSlot,
  headerActions,
  flush = false,
  className,
}: MenuBarPopupProps) {
  const empty = items.length === 0;
  return (
    <div
      className={cn(
        'overflow-hidden bg-paper-sheet',
        flush
          ? 'flex h-full w-full flex-col border-0'
          : 'w-[360px] rounded-card border border-hair shadow-[var(--pop-shadow)]',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-hair px-[18px] py-[12px]">
        <AppText variant="wordmark">LeakSync</AppText>
        <span className="inline-flex items-center gap-[10px]">
          <span className="inline-flex items-center gap-[7px]">
            <AppStatusDot status={status} />
            <AppText variant="meta" className="uppercase">
              {statusLabel}
            </AppText>
          </span>
          {headerActions}
        </span>
      </div>

      <div className={cn(flush && 'flex-1 overflow-y-auto')}>
        {empty ? (
          <AppEmptyState title={emptyTitle} description={emptyDescription} />
        ) : (
          <AppRecentList
            items={items}
            footnote=""
            {...(onCopy ? { onCopy } : {})}
            {...(onDragStart ? { onDragStart } : {})}
          />
        )}
      </div>

      <div className="flex items-center justify-between border-t border-hair px-[18px] py-[11px]">
        {footerSlot ?? (
          <>
            <button
              onClick={onSettings}
              className="border-b border-transparent font-sans text-[12px] text-ink-3 hover:border-ink hover:text-ink"
            >
              Settings
            </button>
          </>
        )}
      </div>
    </div>
  );
}
