import { Repeat } from 'meemaw';

import { AppIcon } from '../../brand/app-logo/index.ts';
import { AppButton } from '../../primitives/app-button/index.ts';
import { AppStatusDot } from '../../primitives/app-status-dot/index.ts';
import { AppText } from '../../primitives/app-text/index.ts';
import { cn } from '../../utils/cn.ts';

// AndroidScene — the phone side. Almost invisible by design. The 95% case is a
// share-sheet confirmation that dismisses itself; the 5% case is a quiet home
// screen that only exists to reassure.
// Spec: design-system/projects/leaksync/preview/33-android.html

// ---------- 95%: "Sent to your Mac" confirmation ----------
export interface AndroidShareConfirmProps {
  className?: string;
}

export function AndroidShareConfirm({ className }: AndroidShareConfirmProps) {
  return (
    <div className={cn('px-[22px] pb-[34px] pt-[30px] text-center', className)}>
      <span className="mb-[14px] inline-block">
        <AppStatusDot status="live" size={11} />
      </span>
      <AppText variant="read" as="h3" className="!font-medium !text-[18px]">
        Sent to your Mac
      </AppText>
      <p className="m-0 font-serif text-[12px] italic text-ink-3">it’s already there</p>
    </div>
  );
}

// ---------- 5%: the home screen ----------
export interface AndroidRecentSent {
  id: string;
  label: string;
  meta: string;
  mono?: boolean;
}

export interface AndroidHomeProps {
  macName: string;
  status?: 'live' | 'idle';
  recent: AndroidRecentSent[];
  onAbout?: () => void;
  onUnpair?: () => void;
  className?: string;
}

export function AndroidHome({
  macName,
  status = 'live',
  recent,
  onAbout,
  onUnpair,
  className,
}: AndroidHomeProps) {
  return (
    <div className={cn('w-[260px] overflow-hidden rounded-[24px] border border-hair bg-paper-sheet shadow-[var(--pop-shadow)]', className)}>
      <div className="flex h-[24px] items-center justify-between px-4 font-sans text-[10px] text-ink-3">
        <span>9:41</span>
        <span>100%</span>
      </div>
      <div className="px-[18px] pb-[26px] pt-5">
        <div className="mb-[6px] flex items-center justify-between">
          <span className="inline-flex items-center gap-2">
            <AppIcon size={26} />
            <AppText variant="wordmark">LeakSync</AppText>
          </span>
          <span className="inline-flex items-center gap-[6px]">
            <AppStatusDot status={status} />
            <AppText variant="meta" className="uppercase">
              {status === 'live' ? 'Live' : 'Offline'}
            </AppText>
          </span>
        </div>
        <p className="m-0 mb-5 font-serif text-[12.5px] italic text-ink-3">Paired with {macName}</p>

        <AppText variant="overline" as="div" className="mb-2">
          Recently sent
        </AppText>
        <div>
          <Repeat each={recent}>
            {(r: AndroidRecentSent) => (
              <div key={r.id} className="border-b border-hair py-[11px] last:border-b-0">
                <div className={cn('text-ink', r.mono ? 'font-mono text-[11px]' : 'font-serif text-[12.5px]')}>
                  {r.label}
                </div>
                <div className="mt-1 font-sans text-[9.5px] text-ink-3">
                  <span className="text-moss-deep">sent ✓</span> · {r.meta}
                </div>
              </div>
            )}
          </Repeat>
        </div>

        <div className="mt-5 flex justify-between border-t border-hair pt-[14px]">
          <AppButton variant="quiet" onClick={onAbout}>
            About
          </AppButton>
          <AppButton variant="danger" onClick={onUnpair}>
            Unpair
          </AppButton>
        </div>
      </div>
    </div>
  );
}
