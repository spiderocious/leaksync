import { type ReactNode } from 'react';

import { cn } from '../../utils/cn.ts';

// AppEmptyState — the quiet edge before anything arrives. No spinner, no
// "get started" marketing. One line in the product's bookish voice, then it
// waits. Spec: design-system/projects/leaksync/preview/21-empty-skeleton.html
export interface AppEmptyStateProps {
  title: string;
  description?: string;
  /** A small line-icon, drawn in ink-3. */
  icon?: ReactNode;
  className?: string;
}

export function AppEmptyState({ title, description, icon, className }: AppEmptyStateProps) {
  return (
    <div className={cn('px-7 py-[54px] text-center', className)}>
      {icon ? (
        <div className="mx-auto mb-[18px] flex h-[34px] w-[34px] items-center justify-center rounded-card border-[1.5px] border-ink-4 text-ink-3">
          {icon}
        </div>
      ) : null}
      <h3 className="m-0 font-serif text-[17px] font-medium text-ink">{title}</h3>
      {description ? (
        <p className="mx-auto mt-2 max-w-[30ch] font-serif text-[13px] italic leading-[1.55] text-ink-3">
          {description}
        </p>
      ) : null}
    </div>
  );
}
