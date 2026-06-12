import { AppPairingCodeDisplay, AppPairingCodeEntry } from '../../primitives/app-pairing-code/index.ts';
import { AppStatusDot } from '../../primitives/app-status-dot/index.ts';
import { AppText } from '../../primitives/app-text/index.ts';
import { cn } from '../../utils/cn.ts';

// PairingScene — the one time the product asks for anything. Two halves:
// the Mac shows the code; the phone enters it. Plus the "paired" confirmation.
// Spec: design-system/projects/leaksync/preview/31-pairing.html

// ---------- Mac: shows the code ----------
export interface PairingDisplaySceneProps {
  code: string;
  className?: string;
}

export function PairingDisplayScene({ code, className }: PairingDisplaySceneProps) {
  return (
    <div className={cn('w-[320px] overflow-hidden rounded-card border border-hair bg-paper-sheet shadow-[var(--pop-shadow)]', className)}>
      <div className="flex items-center justify-between border-b border-hair px-[18px] py-[12px]">
        <AppText variant="wordmark">LeakSync</AppText>
        <span className="inline-flex items-center gap-[7px]">
          <AppStatusDot status="idle" />
          <AppText variant="meta" className="uppercase">
            Not paired
          </AppText>
        </span>
      </div>
      <div className="px-[22px] py-[24px] text-center">
        <AppText variant="overline" as="div" className="mb-[14px]">
          On your Mac
        </AppText>
        <AppText variant="read" as="h3" className="!font-medium !text-[18px]">
          Your pairing code
        </AppText>
        <div className="mt-[18px]">
          <AppPairingCodeDisplay code={code} />
        </div>
        <p className="mt-[22px] font-serif text-[13px] italic text-ink-3">
          Open LeakSync on your phone and type this in.
        </p>
      </div>
    </div>
  );
}

// ---------- Phone: enters the code ----------
export interface PairingEntrySceneProps {
  value: string;
  onChange?: (v: string) => void;
  onComplete?: (v: string) => void;
  shake?: boolean;
  className?: string;
}

export function PairingEntryScene({ value, onChange, onComplete, shake, className }: PairingEntrySceneProps) {
  return (
    <div className={cn('w-[230px] overflow-hidden rounded-[22px] border border-hair bg-paper-sheet shadow-[var(--pop-shadow)]', className)}>
      <div className="flex h-[26px] items-center justify-center">
        <div className="h-1 w-[54px] rounded-full bg-hair" />
      </div>
      <div className="px-[22px] pb-[28px] pt-2 text-center">
        <AppText variant="overline" as="div" className="mb-[14px]">
          On your phone
        </AppText>
        <AppText variant="read" as="h3" className="!font-medium !text-[18px]">
          Enter the code
        </AppText>
        <p className="mb-5 mt-[6px] font-serif text-[12px] italic text-ink-3">from your Mac’s LeakSync window</p>
        <AppPairingCodeEntry
          value={value}
          {...(onChange ? { onChange } : {})}
          {...(onComplete ? { onComplete } : {})}
          {...(shake ? { shake } : {})}
        />
      </div>
    </div>
  );
}

// ---------- Both: paired ----------
export interface PairedSceneProps {
  macName: string;
  className?: string;
}

export function PairedScene({ macName, className }: PairedSceneProps) {
  return (
    <div className={cn('w-[230px] overflow-hidden rounded-[22px] border border-hair bg-paper-sheet shadow-[var(--pop-shadow)]', className)}>
      <div className="flex h-[26px] items-center justify-center">
        <div className="h-1 w-[54px] rounded-full bg-hair" />
      </div>
      <div className="px-[22px] pb-[56px] pt-[48px] text-center">
        <span className="mb-4 inline-block">
          <AppStatusDot status="live" size={12} />
        </span>
        <AppText variant="read" as="h3" className="!font-medium !text-[18px]">
          Paired
        </AppText>
        <p className="mt-1 font-serif text-[12px] italic text-ink-3">LeakSync is connected to {macName}.</p>
      </div>
    </div>
  );
}
