'use client';

import { Clamp, Switch, Case, Default } from 'meemaw';

import { AppTrayIcon } from '../../brand/app-logo/index.ts';
import { type AppItemKind } from '../../primitives/app-item-row/index.ts';
import { cn } from '../../utils/cn.ts';

// ArrivalNotification — the one moment the product reaches out. A native-style
// banner whose CONTENT is set in the book-serif, so even the alert reads like
// the gift. Spec: design-system/projects/leaksync/preview/32-notification.html
export interface ArrivalNotificationProps {
  kind: AppItemKind;
  /** text body, URL, or "Image received". */
  content: string;
  thumbSrc?: string;
  when?: string;
  onClick?: () => void;
  className?: string;
}

export function ArrivalNotification({
  kind,
  content,
  thumbSrc,
  when = 'now',
  onClick,
  className,
}: ArrivalNotificationProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-[300px] gap-[11px] rounded-[8px] border border-hair bg-paper-sheet px-[14px] py-[13px] text-left shadow-[var(--pop-shadow)]',
        className,
      )}
    >
      <span className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[7px] border border-hair bg-paper-2 text-ink-2">
        <AppTrayIcon size={17} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-sans text-[12.5px] font-semibold text-ink">New from your phone</span>
          <span className="ml-auto font-sans text-[10px] text-ink-3">{when}</span>
        </div>
        <div className="mt-[3px]">
          <Switch>
            <Case when={kind === 'link'}>
              <span className="font-mono text-[11.5px] text-ink-2">
                <Clamp maxLines={2}>{content}</Clamp>
              </span>
            </Case>
            <Case when={kind === 'image'}>
              <div className="flex items-center gap-2">
                <span className="font-serif text-[13px] text-ink-2">Image received</span>
                <span
                  className="ml-auto h-[34px] w-[34px] flex-none rounded-[5px] bg-paper-3 shadow-[inset_0_0_0_1px_var(--hair)]"
                  style={thumbSrc ? { backgroundImage: `url(${thumbSrc})`, backgroundSize: 'cover' } : undefined}
                />
              </div>
            </Case>
            <Default>
              <span className="font-serif text-[13px] leading-[1.4] text-ink-2">
                <Clamp maxLines={2}>{content}</Clamp>
              </span>
            </Default>
          </Switch>
        </div>
      </div>
    </button>
  );
}
