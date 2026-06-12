import { AppRecentList, AppStatusDot, AppText, type AppItem } from '@leaksync/ui';

import { PageHead, RefBlock } from './preview-canvas';

// Spec: design-system/projects/leaksync/preview/20-recent-list.html
const ITEMS: AppItem[] = [
  {
    id: '1',
    kind: 'text',
    content: '“the part where she plants the whole garden in one afternoon — that’s the bit”',
    when: 'just now',
    fresh: true,
  },
  { id: '2', kind: 'link', content: 'cooking.nytimes.com/recipes/1018-banana-bread', when: '2m ago' },
  { id: '3', kind: 'image', content: 'IMG_4471.jpg', when: '5m ago' },
  { id: '4', kind: 'text', content: '14 Bourdillon Road, Ikoyi — the black gate after the bend', when: '18m ago' },
  { id: '5', kind: 'link', content: 'open.spotify.com/track/2Fxmh', when: '1h ago' },
];

export function RecentListPart() {
  return (
    <div>
      <PageHead index="Display" title="The recent list" subtitle="@leaksync/ui · AppRecentList" />

      <p className="mb-6 max-w-[64ch] text-[13px] leading-[1.65] text-ink-3">
        The hero. Five items, newest at top — this single list <em>is</em> the product on the Mac.
        Not a feed, a finite working set. The footer states the contract: last five, expire in 24h.
        Tap any row to copy.
      </p>

      <RefBlock title="The full window">
        <div className="w-[360px] overflow-hidden rounded-card border border-hair bg-paper-sheet shadow-[var(--pop-shadow)]">
          <div className="flex items-center justify-between border-b border-hair px-[18px] py-[12px]">
            <AppText variant="wordmark">LeakSync</AppText>
            <span className="inline-flex items-center gap-[7px]">
              <AppStatusDot status="live" />
              <AppText variant="meta" className="uppercase">
                Connected
              </AppText>
            </span>
          </div>
          <AppRecentList items={ITEMS} />
        </div>
      </RefBlock>
    </div>
  );
}
