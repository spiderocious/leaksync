import { Case, Clamp, CopyToClipboard, Default, Show, Switch } from 'meemaw';
import { type DragEvent } from 'react';

import { cn } from '../../utils/cn.ts';

// AppItemRow — the one component the whole product is built from. Every shared
// thing is a row: a line of serif text, a mono URL, or a thumbnail. Tap to
// copy (CopyToClipboard gives us the `copied` flag), drag to drop. Three
// content types, four states, one anatomy.
// Spec: design-system/projects/leaksync/preview/13-item-row.html

export type AppItemKind = 'text' | 'link' | 'image';

export interface AppItem {
  id: string;
  kind: AppItemKind;
  /** text body, the URL, or the image filename. */
  content: string;
  /** image thumbnail src (kind === 'image'). */
  thumbSrc?: string;
  /** relative time, e.g. "just now", "5m ago". */
  when: string;
  /** when true, the row wears the single moss tick (newest, unseen). */
  fresh?: boolean;
}

export interface AppItemRowProps {
  item: AppItem;
  /** Called when the row is tapped (after the clipboard write). */
  onCopy?: (item: AppItem) => void;
  /** Called when a drag-out begins; set the dataTransfer payload here. */
  onDragStart?: (item: AppItem, e: DragEvent<HTMLDivElement>) => void;
}

const KIND_LABEL: Record<AppItemKind, string> = { text: 'Text', link: 'Link', image: 'Image' };

function LinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
    </svg>
  );
}

export function AppItemRow({ item, onCopy, onDragStart }: AppItemRowProps) {
  const copyText = item.content;

  function handleDragStart(e: DragEvent<HTMLDivElement>) {
    if (onDragStart) {
      onDragStart(item, e);
    } else {
      e.dataTransfer.setData('text/plain', item.content);
    }
  }

  return (
    <CopyToClipboard text={copyText} onSuccess={() => onCopy?.(item)}>
      {(copy: () => void, copied: boolean) => (
        <div
          role="button"
          tabIndex={0}
          draggable
          onClick={copy}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              copy();
            }
          }}
          onDragStart={handleDragStart}
          className={cn(
            'group cursor-pointer border-b border-hair px-[18px] py-[14px] last:border-b-0',
            'hover:bg-paper-2 active:bg-paper-3',
            copied && 'bg-paper-2',
            item.fresh && 'border-l-[3px] border-l-moss pl-[15px]',
          )}
        >
          <Switch>
            <Case when={item.kind === 'image'}>
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 flex-none rounded-sharp bg-paper-3 shadow-[inset_0_0_0_1px_var(--hair)]"
                  style={item.thumbSrc ? { backgroundImage: `url(${item.thumbSrc})`, backgroundSize: 'cover' } : undefined}
                />
                <div>
                  <p
                    className={cn(
                      'font-serif text-[12.5px] leading-[1.4] text-ink',
                      copied && 'underline decoration-moss decoration-2 underline-offset-[3px]',
                    )}
                  >
                    {item.content}
                  </p>
                  <Meta kind={item.kind} when={item.when} copied={copied} />
                </div>
              </div>
            </Case>
            <Case when={item.kind === 'link'}>
              <div
                className={cn(
                  'flex items-center gap-[7px] font-mono text-[11.5px] text-ink-2',
                  copied && 'underline decoration-moss decoration-2 underline-offset-[3px]',
                )}
              >
                <LinkIcon />
                <Clamp maxLines={1}>{item.content}</Clamp>
              </div>
              <Meta kind={item.kind} when={item.when} copied={copied} />
            </Case>
            <Default>
              <div
                className={cn(
                  'font-serif text-[13.5px] leading-[1.55] text-ink',
                  copied && 'underline decoration-moss decoration-2 underline-offset-[3px]',
                )}
              >
                <Clamp maxLines={2}>{item.content}</Clamp>
              </div>
              <Meta kind={item.kind} when={item.when} copied={copied} />
            </Default>
          </Switch>
        </div>
      )}
    </CopyToClipboard>
  );
}

function Meta({ kind, when, copied }: { kind: AppItemKind; when: string; copied: boolean }) {
  return (
    <div className="mt-[6px] font-sans text-[10px] leading-none tracking-[0.05em] text-ink-3">
      {KIND_LABEL[kind]} ·{' '}
      <Show when={copied} fallback={<span>{when}</span>}>
        <b className="font-semibold text-moss-deep">copied</b>
      </Show>
    </div>
  );
}
