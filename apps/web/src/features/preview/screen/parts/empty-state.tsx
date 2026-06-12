import { AppEmptyState, AppStatusDot, AppText } from '@leaksync/ui';

import { PageHead, RefBlock, RefRow } from './preview-canvas';

// Spec: design-system/projects/leaksync/preview/21-empty-skeleton.html
function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h10" />
    </svg>
  );
}

export function EmptyStatePart() {
  return (
    <div>
      <PageHead index="Display" title="Empty states" subtitle="@leaksync/ui · AppEmptyState" />

      <p className="mb-6 max-w-[64ch] text-[13px] leading-[1.65] text-ink-3">
        The quiet edge before anything arrives. No spinner, no onboarding. One line in the
        product&rsquo;s bookish voice, then it waits.
      </p>

      <RefBlock title="Freshly paired, nothing sent yet">
        <RefRow label="nothing yet">
          <div className="w-[330px] overflow-hidden rounded-card border border-hair bg-paper-sheet">
            <div className="flex items-center justify-between border-b border-hair px-[18px] py-[12px]">
              <AppText variant="wordmark">LeakSync</AppText>
              <span className="inline-flex items-center gap-[7px]">
                <AppStatusDot status="live" />
                <AppText variant="meta" className="uppercase">
                  Connected
                </AppText>
              </span>
            </div>
            <AppEmptyState
              icon={<ListIcon />}
              title="Nothing here yet"
              description="Share something to LeakSync from your phone and it will land here."
            />
          </div>
        </RefRow>
        <RefRow label="offline, waiting">
          <div className="w-[300px] overflow-hidden rounded-card border border-hair bg-paper-sheet">
            <div className="flex items-center justify-between border-b border-hair px-[18px] py-[12px]">
              <AppText variant="wordmark">LeakSync</AppText>
              <span className="inline-flex items-center gap-[7px]">
                <AppStatusDot status="idle" />
                <AppText variant="meta" className="uppercase">
                  Offline
                </AppText>
              </span>
            </div>
            <AppEmptyState
              title="Waiting for your Mac"
              description="Anything you send now will arrive the moment it wakes up."
            />
          </div>
        </RefRow>
      </RefBlock>
    </div>
  );
}
