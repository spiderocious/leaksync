import { Repeat } from 'meemaw';

import { cn } from '../../utils/cn.ts';

// AppSkeletonRow — the open-flash placeholder. STILL grey blocks, never a
// shimmer: a shimmer is an animation, and e-ink doesn't animate to fill time.
// A placeholder shaped like the truth, gone in a blink.
// Spec: design-system/projects/leaksync/preview/21-empty-skeleton.html
export interface AppSkeletonRowProps {
  /** Render as the image variant (thumb + two lines). */
  image?: boolean;
  className?: string;
}

export function AppSkeletonRow({ image = false, className }: AppSkeletonRowProps) {
  if (image) {
    return (
      <div className={cn('flex items-center gap-3 border-b border-hair px-[18px] py-[14px]', className)}>
        <div className="h-10 w-10 flex-none rounded-sharp bg-paper-3" />
        <div className="flex-1">
          <div className="h-[11px] w-1/2 rounded-sharp bg-paper-3" />
          <div className="mt-[9px] h-2 w-[30%] rounded-sharp bg-paper-3" />
        </div>
      </div>
    );
  }
  return (
    <div className={cn('border-b border-hair px-[18px] py-[14px]', className)}>
      <div className="h-[11px] w-[88%] rounded-sharp bg-paper-3" />
      <div className="mt-[7px] h-[11px] w-[60%] rounded-sharp bg-paper-3" />
      <div className="mt-[10px] h-2 w-[34%] rounded-sharp bg-paper-3" />
    </div>
  );
}

// Convenience: a stack of skeleton rows for the whole popup body.
export interface AppSkeletonListProps {
  count?: number;
  className?: string;
}

export function AppSkeletonList({ count = 3, className }: AppSkeletonListProps) {
  const rows = Array.from({ length: count }, (_, i) => i);
  return (
    <div className={className}>
      <Repeat each={rows}>{(i: number) => <AppSkeletonRow key={i} image={i === count - 1} />}</Repeat>
    </div>
  );
}
