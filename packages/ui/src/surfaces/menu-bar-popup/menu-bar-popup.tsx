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
  className,
}: MenuBarPopupProps) {
  const empty = items.length === 0;
  return (
    <div
      className={cn(
        'w-[360px] overflow-hidden rounded-card border border-hair bg-paper-sheet shadow-[var(--pop-shadow)]',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-hair px-[18px] py-[12px]">
        <AppText variant="wordmark">LeakSync</AppText>
        <span className="inline-flex items-center gap-[7px]">
          <AppStatusDot status={status} />
          <AppText variant="meta" className="uppercase">
            {statusLabel}
          </AppText>
        </span>
      </div>

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

      <div className="flex items-center justify-between border-t border-hair px-[18px] py-[11px]">
        {footerSlot ?? (
          <>
            <span className="font-mono text-[10px] tracking-[0.06em] text-ink-3">last 5 · expire in 24h</span>
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
