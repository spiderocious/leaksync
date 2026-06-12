import { Repeat } from 'meemaw';

import { AppButton, DrawerService, type ToastPosition } from '@leaksync/ui';

import { PageHead, RefBlock, RefRow } from './preview-canvas';

// Spec: the imperative overlay layer (DrawerService). Mirrors the gbedity
// drawer reference. Hosts (ToastHost/BannerHost/ModalHost) are mounted in app.tsx.
const ZONES: ToastPosition[] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
];

export function DrawerServicePart() {
  return (
    <div>
      <PageHead index="Overlays" title="DrawerService" subtitle="@leaksync/ui · imperative toasts + banners + modals" />

      <p className="mb-6 max-w-[64ch] text-[13px] leading-[1.65] text-ink-3">
        The imperative singleton — call from anywhere, no props or context. The hosts live once at
        the app root. Toasts get six zones and can be swiped to dismiss; banners persist; modals are
        the calm e-ink sheets. This is the full API surface.
      </p>

      <RefBlock title="Toasts · tones">
        <RefRow label="tones">
          <AppButton variant="box" onClick={() => DrawerService.toast('Copied to clipboard', { tone: 'success' })}>
            success
          </AppButton>
          <AppButton variant="box" onClick={() => DrawerService.toast('Mac is offline', { tone: 'info' })}>
            info
          </AppButton>
          <AppButton variant="box" onClick={() => DrawerService.toast('Couldn’t send', { tone: 'warn' })}>
            warn
          </AppButton>
          <AppButton
            variant="box"
            onClick={() => DrawerService.toast('Stays until dismissed', { sticky: true, action: { label: 'Dismiss', onClick: () => {} } })}
          >
            sticky + action
          </AppButton>
        </RefRow>
      </RefBlock>

      <div className="mt-6">
        <RefBlock title="Toasts · six zones (swipe to dismiss)">
          <RefRow label="zones">
            <Repeat each={ZONES}>
              {(zone: ToastPosition) => (
                <AppButton variant="box" onClick={() => DrawerService.toast(zone, { position: zone })}>
                  {zone}
                </AppButton>
              )}
            </Repeat>
          </RefRow>
        </RefBlock>
      </div>

      <div className="mt-6">
        <RefBlock title="Banners">
          <RefRow label="warn + cta">
            <AppButton
              variant="box"
              onClick={() =>
                DrawerService.banner('Couldn’t reach your Mac', {
                  tone: 'warn',
                  cta: { label: 'Retry', onClick: () => DrawerService.toast('Retrying…', { tone: 'info' }) },
                })
              }
            >
              banner
            </AppButton>
          </RefRow>
        </RefBlock>
      </div>

      <div className="mt-6">
        <RefBlock title="Modals">
          <RefRow label="confirm / critical / custom">
            <AppButton
              variant="box"
              onClick={() =>
                DrawerService.confirm('Unpair from your Mac?', {
                  description: 'Pairing back takes about ten seconds.',
                  confirmLabel: 'Unpair',
                  cancelLabel: 'Keep paired',
                  destructive: true,
                  onConfirm: () => DrawerService.toast('Unpaired', { tone: 'info' }),
                })
              }
            >
              confirm
            </AppButton>
            <AppButton
              variant="box"
              onClick={() =>
                DrawerService.critical('Reset LeakSync?', {
                  confirmPhrase: 'RESET',
                  confirmPrompt: <>Type <strong>RESET</strong></>,
                  confirmLabel: 'Reset',
                  onConfirm: () => DrawerService.toast('Reset', { tone: 'info' }),
                })
              }
            >
              critical
            </AppButton>
            <AppButton
              variant="box"
              onClick={() =>
                DrawerService.openModal(
                  <div className="text-center">
                    <h3 className="m-0 font-serif text-[18px] text-ink">Custom sheet</h3>
                  </div>,
                )
              }
            >
              custom
            </AppButton>
          </RefRow>
        </RefBlock>
      </div>
    </div>
  );
}
