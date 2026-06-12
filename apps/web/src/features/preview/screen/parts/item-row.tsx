import { Repeat } from 'meemaw';

import { AppItemRow, type AppItem } from '@leaksync/ui';

import { PageHead, RefBlock, RefRow } from './preview-canvas';

// Spec: design-system/projects/leaksync/preview/13-item-row.html
const SAMPLES: AppItem[] = [
  {
    id: '1',
    kind: 'text',
    content:
      'the part where she plants the whole garden in one afternoon — that’s the bit i keep thinking about',
    when: 'just now',
  },
  { id: '2', kind: 'link', content: 'cooking.nytimes.com/recipes/1018-banana-bread', when: '2m ago' },
  { id: '3', kind: 'image', content: 'IMG_4471.jpg', when: '5m ago' },
];

export function ItemRowPart() {
  return (
    <div>
      <PageHead index="Primitives" title="The item row" subtitle="@leaksync/ui · AppItemRow" />

      <p className="mb-6 max-w-[64ch] text-[13px] leading-[1.65] text-ink-3">
        The one component the whole product is built from. Every shared thing is a row: serif text,
        a mono URL, or a thumbnail. <strong>Tap to copy</strong> (it underlines in moss for a beat),{' '}
        <strong>drag to drop</strong>. Built on meemaw&rsquo;s <code>CopyToClipboard</code>,{' '}
        <code>Clamp</code>, and <code>Switch</code>.
      </p>

      <RefBlock title="Three content types — tap any row to copy">
        <div className="w-[360px] overflow-hidden rounded-card border border-hair bg-paper-sheet">
          <Repeat each={SAMPLES}>{(item) => <AppItemRow key={item.id} item={item} />}</Repeat>
        </div>
      </RefBlock>

      <div className="mt-6">
        <RefBlock title="States">
          <RefRow label="fresh (newest)">
            <div className="w-[300px] overflow-hidden rounded-card border border-hair bg-paper-sheet">
              <AppItemRow item={{ id: 'f', kind: 'link', content: 'open.spotify.com/track/2Fxmh', when: 'just now', fresh: true }} />
            </div>
          </RefRow>
          <RefRow label="long text · clamps to 2 lines">
            <div className="w-[300px] overflow-hidden rounded-card border border-hair bg-paper-sheet">
              <AppItemRow
                item={{
                  id: 'l',
                  kind: 'text',
                  content:
                    'a much longer note that runs well past two lines so you can see exactly how the clamp behaves when someone shares a whole paragraph of something they were reading and wanted to keep for later',
                  when: 'just now',
                }}
              />
            </div>
          </RefRow>
        </RefBlock>
      </div>
    </div>
  );
}
