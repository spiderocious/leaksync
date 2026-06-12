import { AndroidHome, AndroidShareConfirm, type AndroidRecentSent } from '@leaksync/ui';

import { PageHead, RefBlock, RefRow } from './preview-canvas';

// Spec: design-system/projects/leaksync/preview/33-android.html
const RECENT: AndroidRecentSent[] = [
  { id: '1', label: 'the part where she plants the whole garden…', meta: 'Text · just now' },
  { id: '2', label: 'cooking.nytimes.com/recipes/…', meta: 'Link · 2m ago', mono: true },
  { id: '3', label: 'IMG_4471.jpg', meta: 'Image · 5m ago' },
];

export function AndroidPart() {
  return (
    <div>
      <PageHead index="Surfaces" title="The Android side" subtitle="@leaksync/ui · AndroidShareConfirm / AndroidHome" />

      <p className="mb-6 max-w-[64ch] text-[13px] leading-[1.65] text-ink-3">
        Almost invisible by design. The 95% case is a share-sheet confirmation that dismisses itself;
        the 5% case is a quiet home screen that only exists to reassure. (The real Android app is
        Flutter — these are the visual spec.)
      </p>

      <RefBlock title="95% · share-sheet confirmation">
        <RefRow label="sent">
          <div className="w-[260px] overflow-hidden rounded-[24px] border border-hair bg-paper-2">
            <AndroidShareConfirm />
          </div>
        </RefRow>
      </RefBlock>

      <div className="mt-6">
        <RefBlock title="5% · the home screen">
          <RefRow label="paired">
            <AndroidHome macName="Sade’s MacBook" recent={RECENT} />
          </RefRow>
        </RefBlock>
      </div>
    </div>
  );
}
