import { AppIcon, AppLogo, AppTrayIcon } from '@leaksync/ui';

import { PageHead, RefBlock, RefRow } from './preview-canvas';

// Spec: design-system/projects/leaksync/preview/41-icons.html
export function BrandPart() {
  return (
    <div>
      <PageHead index="Foundation" title="Brand mark" subtitle="@leaksync/ui · AppLogo / AppIcon / AppTrayIcon" />

      <p className="mb-6 max-w-[64ch] text-[13px] leading-[1.65] text-ink-3">
        One mark, drawn once: a stack glyph in single strokes. It carries the brand everywhere — the
        Android app icon (ink on paper, ringed in moss), the Mac tray icon (monochrome, a moss pip
        when something lands), and the bare wordmark companion.
      </p>

      <RefBlock title="The mark">
        <RefRow label="logo">
          <AppLogo size={24} />
          <AppLogo size={32} />
        </RefRow>
        <RefRow label="app icon">
          <AppIcon />
        </RefRow>
        <RefRow label="tray · idle">
          <AppTrayIcon />
        </RefRow>
        <RefRow label="tray · new item">
          <AppTrayIcon hasNew />
        </RefRow>
      </RefBlock>
    </div>
  );
}
