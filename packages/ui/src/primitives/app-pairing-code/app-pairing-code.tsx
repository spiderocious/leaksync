import { Repeat } from 'meemaw';
import { useId, useRef, useState, type ChangeEvent, type HTMLAttributes } from 'react';

import { cn } from '../../utils/cn.ts';

// AppPairingCode — the one number the product hinges on. The Mac DISPLAYS it
// large; the phone ENTERS it once. Two variants of one primitive.
// Spec: design-system/projects/leaksync/preview/11-pairing-code.html

// ---------- Display (on the Mac) ----------

export interface AppPairingCodeDisplayProps extends HTMLAttributes<HTMLDivElement> {
  /** The 6-digit code as a string, e.g. "492713". Rendered as two groups of three. */
  code: string;
}

export function AppPairingCodeDisplay({ code, className, ...rest }: AppPairingCodeDisplayProps) {
  const digits = code.padEnd(6, ' ').slice(0, 6).split('');
  const left = digits.slice(0, 3);
  const right = digits.slice(3, 6);
  return (
    <div className={cn('flex items-center justify-center gap-[14px]', className)} {...rest}>
      <DigitGroup digits={left} />
      <span className="w-[14px]" aria-hidden />
      <DigitGroup digits={right} />
    </div>
  );
}

function DigitGroup({ digits }: { digits: string[] }) {
  return (
    <div className="flex gap-[9px]">
      <Repeat each={digits}>
        {(d: string, i: number) => (
          <span
            key={i}
            className="font-serif text-[44px] font-medium leading-none text-ink [font-variant-numeric:tabular-nums]"
          >
            {d}
          </span>
        )}
      </Repeat>
    </div>
  );
}

// ---------- Entry (on the phone) — a REAL input ----------
//
// A single visually-hidden text input captures keystrokes (numeric, max
// `length`); the cells below are the rendered presentation of its value. The
// whole control is clickable/focusable — tapping anywhere focuses the input and
// brings up the numeric keypad on a phone. This is genuinely typeable, not a
// static display.

export interface AppPairingCodeEntryProps {
  /** Controlled value (digits entered so far). Omit for uncontrolled. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Called with the new digits string whenever it changes. */
  onChange?: (value: string) => void;
  /** Called once the final digit completes the code. */
  onComplete?: (value: string) => void;
  /** Total cells. Default 6. */
  length?: number;
  /** When true, the cells clear-flash (wrong code). Visual only. */
  shake?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
}

export function AppPairingCodeEntry({
  value: controlled,
  defaultValue = '',
  onChange,
  onComplete,
  length = 6,
  shake = false,
  autoFocus = false,
  disabled = false,
}: AppPairingCodeEntryProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [internal, setInternal] = useState(defaultValue);
  const value = controlled ?? internal;
  const [focused, setFocused] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const next = e.target.value.replace(/\D/g, '').slice(0, length);
    if (controlled === undefined) setInternal(next);
    onChange?.(next);
    if (next.length === length) onComplete?.(next);
  }

  const cells = Array.from({ length }, (_, i) => value[i] ?? null);
  const activeIndex = Math.min(value.length, length - 1);

  return (
    <div
      className={cn('relative inline-flex cursor-text justify-center gap-[10px]', shake && 'ls-blink')}
      onClick={() => inputRef.current?.focus()}
    >
      {/* The real input — visually hidden but focusable and typeable. */}
      <input
        ref={inputRef}
        id={inputId}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]*"
        maxLength={length}
        value={value}
        disabled={disabled}
        autoFocus={autoFocus}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-label="Pairing code"
        className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0"
      />
      <Repeat each={cells}>
        {(digit: string | null, i: number) => {
          const isActive = focused && i === activeIndex && value.length < length;
          const isFilled = digit !== null;
          return (
            <span
              key={i}
              className={cn(
                'flex h-[58px] w-[44px] items-center justify-center rounded-card border border-hair font-serif text-[30px] font-medium text-ink [font-variant-numeric:tabular-nums]',
                isFilled ? 'border-b-[1.5px] border-b-ink' : 'border-b-[1.5px] border-b-ink-3',
                isActive && 'border-b-2 border-b-moss',
              )}
            >
              {isFilled ? digit : <span className="text-ink-4">—</span>}
            </span>
          );
        }}
      </Repeat>
    </div>
  );
}
