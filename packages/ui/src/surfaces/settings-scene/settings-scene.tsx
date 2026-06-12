'use client';

import { Repeat } from 'meemaw';
import { type ReactNode } from 'react';

import { AppButton } from '../../primitives/app-button/index.ts';
import { AppText } from '../../primitives/app-text/index.ts';
import { cn } from '../../utils/cn.ts';

// SettingsScene + AboutScene — there is exactly one setting (unpair) and one
// page that holds the personal note. The settings screen's job is to be honest
// about how little there is.
// Spec: design-system/projects/leaksync/preview/34-settings.html

export interface SettingsRow {
  key: string;
  value: ReactNode;
}

export interface SettingsSceneProps {
  rows: SettingsRow[];
  onBack?: () => void;
  onUnpair?: () => void;
  className?: string;
}

export function SettingsScene({ rows, onBack, onUnpair, className }: SettingsSceneProps) {
  return (
    <div className={cn('w-[340px] overflow-hidden rounded-card border border-hair bg-paper-sheet shadow-[var(--pop-shadow)]', className)}>
      <div className="flex items-center justify-between border-b border-hair px-[18px] py-[12px]">
        <button onClick={onBack} className="font-sans text-[11px] text-ink-3 hover:text-ink">
          ‹ back
        </button>
        <AppText variant="overline">Settings</AppText>
      </div>
      <div className="px-[18px] py-5">
        <Repeat each={rows}>
          {(row: SettingsRow) => (
            <div key={row.key} className="flex items-center justify-between border-b border-hair py-[14px] last:border-b-0">
              <AppText variant="read" className="!text-[13.5px]">
                {row.key}
              </AppText>
              <span className="font-mono text-[11px] tracking-[0.04em] text-ink-3">{row.value}</span>
            </div>
          )}
        </Repeat>
        <div className="mt-[22px] flex justify-center border-t border-hair pt-[18px]">
          <AppButton variant="danger" onClick={onUnpair}>
            Unpair this device
          </AppButton>
        </div>
      </div>
    </div>
  );
}

// ---------- About — the one place the gift speaks ----------
export interface AboutSceneProps {
  /** The personal note (gift layer — passed in, not baked into the system). */
  note: ReactNode;
  signature?: string;
  version?: string;
  onBack?: () => void;
  className?: string;
}

export function AboutScene({ note, signature = '— made for you', version, onBack, className }: AboutSceneProps) {
  return (
    <div className={cn('w-[340px] overflow-hidden rounded-card border border-hair bg-paper-sheet shadow-[var(--pop-shadow)]', className)}>
      <div className="flex items-center justify-between border-b border-hair px-[18px] py-[12px]">
        <button onClick={onBack} className="font-sans text-[11px] text-ink-3 hover:text-ink">
          ‹ settings
        </button>
        <AppText variant="overline">About</AppText>
      </div>
      <div className="px-[22px] py-[26px]">
        <div className="ls-fiber rounded-card border border-hair bg-paper px-5 py-[22px]">
          <p className="m-0 font-serif text-[13.5px] leading-[1.7] text-ink">{note}</p>
          <p className="m-0 mt-4 text-right font-serif text-[13px] italic text-ink-3">{signature}</p>
        </div>
        {version ? (
          <p className="mt-[18px] text-center font-mono text-[10px] uppercase tracking-[0.1em] text-ink-4">
            {version}
          </p>
        ) : null}
      </div>
    </div>
  );
}
