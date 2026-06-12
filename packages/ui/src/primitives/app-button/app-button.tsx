import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn.ts';

// AppButton — e-ink has almost no buttons. Almost every action is "tap the
// item"; what's left is quiet text actions and exactly ONE bordered button for
// the single deliberate moment (pairing). No fills, no colour, no shadow.
// Spec: design-system/projects/leaksync/preview/10-buttons.html
export type AppButtonVariant =
  | 'text' // the default — quiet, underline on hover
  | 'quiet' // even quieter (ink-3) — footer secondary
  | 'box' // the ONE bordered button — pairing; fills with ink on hover
  | 'danger'; // Unpair — quiet text, NOT red (this product has no red)

export interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AppButtonVariant;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

const BASE =
  'inline-flex items-center justify-center gap-2 font-sans transition-colors disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none';

const VARIANT_CLASSES: Record<AppButtonVariant, string> = {
  text: 'border-b border-transparent px-0.5 py-1.5 text-[12px] font-medium text-ink-2 hover:border-ink hover:text-ink',
  quiet:
    'border-b border-transparent px-0.5 py-1.5 text-[12px] font-medium text-ink-3 hover:border-ink hover:text-ink',
  box: 'rounded-card border border-ink px-[18px] py-[9px] text-[12px] font-medium text-ink hover:bg-ink hover:text-paper',
  danger:
    'border-b border-transparent px-0.5 py-1.5 text-[12px] font-medium text-ink-2 hover:border-ink hover:text-ink',
};

export const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(function AppButton(
  { variant = 'text', className, leadingIcon, trailingIcon, children, ...rest },
  ref,
) {
  return (
    <button ref={ref} className={cn(BASE, VARIANT_CLASSES[variant], className)} {...rest}>
      {leadingIcon ? <span className="-ml-0.5 flex">{leadingIcon}</span> : null}
      <span>{children}</span>
      {trailingIcon ? <span className="-mr-0.5 flex">{trailingIcon}</span> : null}
    </button>
  );
});
