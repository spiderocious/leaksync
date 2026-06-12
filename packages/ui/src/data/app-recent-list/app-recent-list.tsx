'use client';

import { Repeat, Show } from 'meemaw';
import { type DragEvent } from 'react';

import { AppItemRow, type AppItem } from '../../primitives/app-item-row/index.ts';
import { cn } from '../../utils/cn.ts';

// AppRecentList — the hero. Five items, newest at top. Not a feed, not a
// paginated history — a finite working set. The footer states the contract:
// last five, expire in 24h. Honesty is the trust model.
// Spec: design-system/projects/leaksync/preview/20-recent-list.html
export interface AppRecentListProps {
  items: AppItem[];
  onCopy?: (item: AppItem) => void;
  onDragStart?: (item: AppItem, e: DragEvent<HTMLDivElement>) => void;
  /** Footer note. Default reflects the 5-item / 24h contract. */
  footnote?: string;
  className?: string;
}

export function AppRecentList({
  items,
  onCopy,
  onDragStart,
  footnote = 'last 5 · expire in 24h',
  className,
}: AppRecentListProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <div>
        <Repeat each={items.slice(0, 5)}>
          {(item: AppItem) => (
            <AppItemRow
              key={item.id}
              item={item}
              {...(onCopy ? { onCopy } : {})}
              {...(onDragStart ? { onDragStart } : {})}
            />
          )}
        </Repeat>
      </div>
      <Show when={footnote.length > 0}>
        <div className="flex items-center justify-between border-t border-hair px-[18px] py-[11px]">
          <span className="font-mono text-[10px] tracking-[0.06em] text-ink-3">{footnote}</span>
        </div>
      </Show>
    </div>
  );
}
