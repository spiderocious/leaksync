import { type HTMLAttributes } from 'react';

import { cn } from '../../utils/cn.ts';

// AppStatusDot — one dot tells the whole truth: is the Mac reachable now?
// `live` is the system's single use of moss. `idle` is a hollow grey ring (no
// colour — nothing's wrong, it's just resting). `reconnecting` does the slow
// page-refresh blink (no spinner — spinners imply a screen; this is paper).
// Spec: design-system/projects/leaksync/preview/12-status.html
export type AppStatusKind = 'live' | 'idle' | 'reconnecting';

export interface AppStatusDotProps extends HTMLAttributes<HTMLSpanElement> {
  status?: AppStatusKind;
  /** Diameter in px. Default 7. */
  size?: number;
}

const KIND_CLASSES: Record<AppStatusKind, string> = {
  live: 'bg-moss',
  idle: 'bg-transparent shadow-[inset_0_0_0_1px_var(--idle)]',
  reconnecting: 'bg-idle ls-blink-loop',
};

export function AppStatusDot({ status = 'live', size = 7, className, style, ...rest }: AppStatusDotProps) {
  return (
    <span
      aria-hidden
      className={cn('inline-block flex-none rounded-full', KIND_CLASSES[status], className)}
      style={{ width: size, height: size, ...style }}
      {...rest}
    />
  );
}
