import { AppButton, DrawerService } from '@leaksync/ui';

import { PageHead, RefBlock, RefRow } from './preview-canvas';

// Spec: design-system/projects/leaksync/preview/40-modals.html
export function ModalsPart() {
  return (
    <div>
      <PageHead index="Overlays" title="Modals" subtitle="@leaksync/ui · AppModal / CriticalModal" />

      <p className="mb-6 max-w-[64ch] text-[13px] leading-[1.65] text-ink-3">
        A raised paper sheet — the one shadow-caster besides the popup. <strong>No red, no
        theatrics.</strong> This product&rsquo;s gravity is near-zero, so even the destructive variant
        is firm-but-calm; the safe choice (&ldquo;Keep paired&rdquo;) leads. The CriticalModal
        (type-to-confirm) exists for genuinely irreversible actions, but LeakSync&rsquo;s unpair does
        not use it. Trigger via <code>DrawerService</code>:
      </p>

      <RefBlock title="The unpair moment — the critical surface, kept calm">
        <RefRow label="confirm">
          <AppButton
            variant="box"
            onClick={() =>
              DrawerService.confirm('Unpair from your Mac?', {
                description:
                  'New things you share won’t arrive until you pair again. Your last five items stay on your Mac. Pairing back takes about ten seconds.',
                confirmLabel: 'Unpair',
                cancelLabel: 'Keep paired',
                destructive: true,
                onConfirm: () => DrawerService.toast('Unpaired from Sade’s MacBook', { tone: 'info' }),
              })
            }
          >
            Unpair…
          </AppButton>
        </RefRow>
        <RefRow label="standard">
          <AppButton
            variant="box"
            onClick={() =>
              DrawerService.confirm('Clear all items?', {
                description: 'Removes the five items shown on your Mac. They’ll re-appear as you share new things.',
                confirmLabel: 'Clear',
                onConfirm: () => DrawerService.toast('Cleared', { tone: 'success' }),
              })
            }
          >
            Standard confirm…
          </AppButton>
        </RefRow>
        <RefRow label="critical · type-to-confirm">
          <AppButton
            variant="box"
            onClick={() =>
              DrawerService.critical('Reset LeakSync?', {
                description: 'This wipes the pairing and all local history. It cannot be undone.',
                confirmPhrase: 'RESET',
                confirmPrompt: <>Type <strong>RESET</strong> to confirm</>,
                confirmLabel: 'Reset everything',
                onConfirm: () => DrawerService.toast('Reset complete', { tone: 'info' }),
              })
            }
          >
            Critical…
          </AppButton>
        </RefRow>
        <RefRow label="custom body">
          <AppButton
            variant="box"
            onClick={() =>
              DrawerService.openModal(
                <div className="text-center">
                  <h3 className="m-0 font-serif text-[18px] text-ink">A custom sheet</h3>
                  <p className="mt-2 font-serif text-[13px] italic text-ink-3">
                    Any body you like — the service supplies the scrim + close button.
                  </p>
                </div>,
              )
            }
          >
            Custom…
          </AppButton>
        </RefRow>
      </RefBlock>
    </div>
  );
}
