import { Repeat } from 'meemaw';

import { AppStatusDot, AppText, type AppStatusKind } from '@leaksync/ui';

import { PageHead, RefBlock, RefRow } from './preview-canvas';

// Spec: design-system/projects/leaksync/preview/12-status.html
const STATES: { status: AppStatusKind; label: string; note: string }[] = [
  { status: 'live', label: 'Connected', note: 'the one moss dot — items arrive instantly' },
  { status: 'idle', label: 'Offline', note: 'hollow grey ring — Mac asleep, items queue' },
  { status: 'reconnecting', label: 'Reconnecting', note: 'slow page-refresh blink, no spinner' },
];

export function StatusPart() {
  return (
    <div>
      <PageHead index="Primitives" title="Status &amp; connection" subtitle="@leaksync/ui · AppStatusDot" />

      <p className="mb-6 max-w-[64ch] text-[13px] leading-[1.65] text-ink-3">
        One dot tells the whole truth: is the Mac reachable now? <strong>Live</strong> is the
        system&rsquo;s single use of moss. Offline is a hollow ring (nothing&rsquo;s wrong, it&rsquo;s
        resting). Reconnecting blinks slowly. No red anywhere.
      </p>

      <RefBlock title="States">
        <Repeat each={STATES}>
          {({ status, label, note }) => (
            <RefRow label={status}>
              <span className="inline-flex items-center gap-2">
                <AppStatusDot status={status} />
                <AppText variant="meta" className="uppercase">
                  {label}
                </AppText>
              </span>
              <span className="text-[12px] text-ink-3">{note}</span>
            </RefRow>
          )}
        </Repeat>
      </RefBlock>

      <div className="mt-6">
        <RefBlock title="In the header">
          <RefRow label="connected">
            <div className="flex w-[260px] items-center justify-between border border-hair bg-paper-sheet px-[18px] py-[12px]">
              <AppText variant="wordmark">LeakSync</AppText>
              <span className="inline-flex items-center gap-[7px]">
                <AppStatusDot status="live" />
                <AppText variant="meta" className="uppercase">
                  Connected
                </AppText>
              </span>
            </div>
          </RefRow>
          <RefRow label="offline">
            <div className="flex w-[260px] items-center justify-between border border-hair bg-paper-sheet px-[18px] py-[12px]">
              <AppText variant="wordmark">LeakSync</AppText>
              <span className="inline-flex items-center gap-[7px]">
                <AppStatusDot status="idle" />
                <AppText variant="meta" className="uppercase">
                  Mac offline
                </AppText>
              </span>
            </div>
          </RefRow>
        </RefBlock>
      </div>
    </div>
  );
}
