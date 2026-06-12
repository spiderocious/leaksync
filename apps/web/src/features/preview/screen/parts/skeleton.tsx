import { AppSkeletonList, AppSkeletonRow, AppText } from '@leaksync/ui';

import { PageHead, RefBlock, RefRow } from './preview-canvas';

// Spec: design-system/projects/leaksync/preview/21-empty-skeleton.html
export function SkeletonPart() {
  return (
    <div>
      <PageHead index="Display" title="Skeleton" subtitle="@leaksync/ui · AppSkeletonRow" />

      <p className="mb-6 max-w-[64ch] text-[13px] leading-[1.65] text-ink-3">
        The open-flash placeholder. <strong>Still grey blocks</strong>, never a shimmer — a shimmer
        is an animation, and e-ink doesn&rsquo;t animate to fill time. A placeholder shaped like the
        truth, gone in a blink.
      </p>

      <RefBlock title="The popup, before paint">
        <div className="w-[330px] overflow-hidden rounded-card border border-hair bg-paper-sheet">
          <div className="flex items-center justify-between border-b border-hair px-[18px] py-[12px]">
            <AppText variant="wordmark">LeakSync</AppText>
            <span className="text-ink-4">…</span>
          </div>
          <AppSkeletonList count={3} />
        </div>
      </RefBlock>

      <div className="mt-6">
        <RefBlock title="Single rows">
          <RefRow label="text">
            <div className="w-[300px] overflow-hidden rounded-card border border-hair bg-paper-sheet">
              <AppSkeletonRow />
            </div>
          </RefRow>
          <RefRow label="image">
            <div className="w-[300px] overflow-hidden rounded-card border border-hair bg-paper-sheet">
              <AppSkeletonRow image />
            </div>
          </RefRow>
        </RefBlock>
      </div>
    </div>
  );
}
