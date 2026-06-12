import { MenuBarPopup, type AppItem } from '@leaksync/ui';

import { PageHead, RefBlock, RefRow } from './preview-canvas';

// Spec: design-system/projects/leaksync/preview/30-menu-bar.html
const ITEMS: AppItem[] = [
  {
    id: '1',
    kind: 'text',
    content: '“the part where she plants the whole garden in one afternoon — that’s the bit”',
    when: 'just now',
    fresh: true,
  },
  { id: '2', kind: 'link', content: 'cooking.nytimes.com/recipes/1018', when: '2m ago' },
  { id: '3', kind: 'image', content: 'IMG_4471.jpg', when: '5m ago' },
  { id: '4', kind: 'text', content: '14 Bourdillon Road, Ikoyi — the black gate after the bend', when: '18m ago' },
];

export function MenuBarPart() {
  return (
    <div>
      <PageHead index="Surfaces" title="Menu-bar popup" subtitle="@leaksync/ui · MenuBarPopup" />

      <p className="mb-6 max-w-[64ch] text-[13px] leading-[1.65] text-ink-3">
        The whole product on the Mac, in one ~360px window. Composes the recent list, status, and
        footer. Tap a row to copy; drag to drop.
      </p>

      <RefBlock title="Live">
        <RefRow label="with items">
          <MenuBarPopup items={ITEMS} />
        </RefRow>
        <RefRow label="empty">
          <MenuBarPopup items={[]} />
        </RefRow>
        <RefRow label="offline">
          <MenuBarPopup items={ITEMS.slice(0, 2)} status="idle" />
        </RefRow>
      </RefBlock>
    </div>
  );
}
