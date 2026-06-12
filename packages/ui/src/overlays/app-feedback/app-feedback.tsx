'use client';

import { Show } from 'meemaw';
import { type ReactNode } from 'react';

import { AppStatusDot } from '../../primitives/app-status-dot/index.ts';
import { cn } from '../../utils/cn.ts';

// Feedback — toasts and banners. The quietest layer. A toast is one line on a
// paper chip with the single moss/idle/warn dot, gone in seconds. A banner is
// a persistent strip — almost always "couldn't reach your Mac" (muted ochre,
// never red). Spec: design-system/projects/leaksync/preview/40-modals.html

// Four tones map to the e-ink status idiom: default (live moss), info (idle
// grey), warn (ochre), success (moss). There is no danger/red tone — by design.
export type FeedbackTone = 'default' | 'info' | 'warn' | 'success';

function ToneDot({ tone }: { tone: FeedbackTone }) {
  if (tone === 'warn') return <span className="h-[7px] w-[7px] flex-none rounded-full bg-warn" />;
  if (tone === 'info') return <AppStatusDot status="idle" />;
  return <AppStatusDot status="live" />;
}

// ---------- Toast ----------

export interface AppToastProps {
  message: ReactNode;
  tone?: FeedbackTone;
  when?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function AppToast({ message, tone = 'default', when, action, className }: AppToastProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-[10px] rounded-card border border-hair bg-paper-sheet px-[15px] py-[11px] font-serif text-[13px] text-ink shadow-[var(--pop-shadow)]',
        className,
      )}
    >
      <ToneDot tone={tone} />
      <span>{message}</span>
      <Show when={when !== undefined}>
        <span className="ml-[6px] font-sans text-[10px] text-ink-3">{when}</span>
      </Show>
      <Show when={action !== undefined}>
        <button
          onClick={action?.onClick}
          className="ml-2 border-b border-transparent font-sans text-[11px] text-ink-2 hover:border-ink hover:text-ink"
        >
          {action?.label}
        </button>
      </Show>
    </div>
  );
}

// ---------- Banner ----------

export interface AppBannerProps {
  title: ReactNode;
  description?: ReactNode;
  tone?: FeedbackTone;
  icon?: ReactNode;
  cta?: { label: string; onClick: () => void };
  className?: string;
}

export function AppBanner({ title, description, tone = 'info', icon, cta, className }: AppBannerProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-[11px] rounded-card border px-[15px] py-[12px]',
        tone === 'warn' ? 'border-[#d8cba6] bg-warn-faint' : 'border-hair bg-paper-sheet',
        className,
      )}
    >
      {icon ? <span className="flex text-ink-2">{icon}</span> : <ToneDot tone={tone} />}
      <div className="flex-1">
        <span className="font-serif text-[13px] text-ink">{title}</span>
        <Show when={description !== undefined}>
          <span className="ml-2 font-sans text-[12px] text-ink-3">{description}</span>
        </Show>
      </div>
      <Show when={cta !== undefined}>
        <button
          onClick={cta?.onClick}
          className="font-sans text-[11px] text-ink-3 hover:text-ink"
        >
          {cta?.label}
        </button>
      </Show>
    </div>
  );
}
