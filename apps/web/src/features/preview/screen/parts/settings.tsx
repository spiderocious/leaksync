import { AboutScene, AppStatusDot, SettingsScene, type SettingsRow } from '@leaksync/ui';

import { PageHead, RefBlock, RefRow } from './preview-canvas';

// Spec: design-system/projects/leaksync/preview/34-settings.html
const ROWS: SettingsRow[] = [
  { key: 'Paired with', value: 'Sade’s MacBook' },
  {
    key: 'Status',
    value: (
      <span className="inline-flex items-center gap-[6px]">
        <AppStatusDot status="live" size={6} />
        Connected
      </span>
    ),
  },
  { key: 'Items expire', value: 'after 24h' },
];

export function SettingsPart() {
  return (
    <div>
      <PageHead index="Surfaces" title="Settings &amp; About" subtitle="@leaksync/ui · SettingsScene / AboutScene" />

      <p className="mb-6 max-w-[64ch] text-[13px] leading-[1.65] text-ink-3">
        Exactly one setting (unpair) and one page that holds the personal note. The About frame is
        reserved for the gift layer — the note text is passed in, never baked into the system.
      </p>

      <RefBlock title="Settings">
        <RefRow label="the whole of it">
          <SettingsScene rows={ROWS} />
        </RefRow>
      </RefBlock>

      <div className="mt-6">
        <RefBlock title="About · the gift frame">
          <RefRow label="the note">
            <AboutScene
              note="For Sade — so the little things you find all day land where you need them, without the long way round. No more mailing yourself."
              version="LeakSync · v1.0 · paired 12 Jun"
            />
          </RefRow>
        </RefBlock>
      </div>
    </div>
  );
}
