import { type HTMLAttributes, type ElementType, type ReactNode } from 'react';

import { cn } from '../../utils/cn.ts';

// AppText — the e-ink type scale.
// Spec: design-system/projects/leaksync/preview/02-type.html
// Three families, three jobs: Literata serif for the things you READ (item
// bodies, the wordmark, the pairing code), Inter for CHROME (labels, meta,
// buttons), JetBrains Mono for the RECORD (URLs, codes, timestamps). The serif
// carries the warmth so the copy never has to.
export type AppTextVariant =
  | 'wordmark' // LeakSync, serif 15px — the product name
  | 'display' // large serif — the pairing code / hero moments
  | 'read' // item body — serif, the content she reads
  | 'body' // sans body — chrome prose
  | 'meta' // tiny sans — "Text · just now"
  | 'overline' // uppercase tracked label — "Pairing code"
  | 'mono'; // record — URLs, IDs, timestamps

export interface AppTextProps extends HTMLAttributes<HTMLElement> {
  variant?: AppTextVariant;
  as?: ElementType;
  children?: ReactNode;
}

const VARIANT_CLASSES: Record<AppTextVariant, string> = {
  wordmark: 'font-serif text-[15px] font-medium tracking-[-0.01em] text-ink',
  display:
    'font-serif text-[34px] font-medium leading-none tracking-[0.14em] text-ink [font-variant-numeric:tabular-nums]',
  read: 'font-serif text-[13.5px] font-normal leading-[1.55] text-ink',
  body: 'font-sans text-[13px] leading-[1.5] text-ink-2',
  meta: 'font-sans text-[10px] leading-none tracking-[0.05em] text-ink-3',
  overline: 'font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-3',
  mono: 'font-mono text-[11.5px] leading-[1.5] text-ink-2 [font-variant-numeric:tabular-nums]',
};

const DEFAULT_ELEMENT: Record<AppTextVariant, ElementType> = {
  wordmark: 'span',
  display: 'div',
  read: 'p',
  body: 'p',
  meta: 'span',
  overline: 'span',
  mono: 'span',
};

export function AppText({ variant = 'body', as, className, children, ...rest }: AppTextProps) {
  const Component = as ?? DEFAULT_ELEMENT[variant];
  return (
    <Component className={cn(VARIANT_CLASSES[variant], className)} {...rest}>
      {children}
    </Component>
  );
}
