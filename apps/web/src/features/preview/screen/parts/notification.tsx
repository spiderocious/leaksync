import { ArrivalNotification } from '@leaksync/ui';

import { PageHead, RefBlock, RefRow } from './preview-canvas';

// Spec: design-system/projects/leaksync/preview/32-notification.html
export function NotificationPart() {
  return (
    <div>
      <PageHead index="Surfaces" title="Notification &amp; arrival" subtitle="@leaksync/ui · ArrivalNotification" />

      <p className="mb-6 max-w-[64ch] text-[13px] leading-[1.65] text-ink-3">
        The one moment the product reaches out. A native-style banner whose content is set in the
        book-serif, so even the alert reads like the gift. Click it to open the popup with that item
        at the top.
      </p>

      <RefBlock title="By type">
        <RefRow label="text">
          <ArrivalNotification kind="text" content="“the part where she plants the whole garden in one afternoon — that’s the bit”" />
        </RefRow>
        <RefRow label="link">
          <ArrivalNotification kind="link" content="cooking.nytimes.com/recipes/1018-banana-bread" />
        </RefRow>
        <RefRow label="image">
          <ArrivalNotification kind="image" content="IMG_4471.jpg" />
        </RefRow>
      </RefBlock>
    </div>
  );
}
