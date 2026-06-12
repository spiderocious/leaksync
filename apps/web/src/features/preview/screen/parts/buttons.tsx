import { Repeat } from 'meemaw';

import { AppButton, type AppButtonVariant } from '@leaksync/ui';

import { PageHead, RefBlock, RefRow } from './preview-canvas';

// Spec: design-system/projects/leaksync/preview/10-buttons.html
const VARIANTS: { variant: AppButtonVariant; label: string }[] = [
  { variant: 'text', label: 'About' },
  { variant: 'quiet', label: 'Settings' },
  { variant: 'box', label: 'Pair this device' },
  { variant: 'danger', label: 'Unpair' },
];

export function ButtonsPart() {
  return (
    <div>
      <PageHead index="Primitives" title="Button" subtitle="@leaksync/ui · AppButton" />

      <p className="mb-6 max-w-[64ch] text-[13px] leading-[1.65] text-ink-3">
        An e-ink product barely has buttons — almost every action is &ldquo;tap the item.&rdquo;
        What&rsquo;s left is quiet text actions and exactly one bordered button, for the single
        deliberate moment: pairing. No fills, no colour, no shadow. Even <code>danger</code> (Unpair)
        is quiet text, never red — this product has no red.
      </p>

      <RefBlock title="Variants">
        <Repeat each={VARIANTS}>
          {({ variant, label }) => (
            <RefRow label={variant}>
              <AppButton variant={variant}>{label}</AppButton>
              <AppButton variant={variant} disabled>
                Disabled
              </AppButton>
            </RefRow>
          )}
        </Repeat>
      </RefBlock>

      <div className="mt-6">
        <RefBlock title="The footer, in context">
          <RefRow label="popup foot">
            <div className="flex w-[300px] items-center justify-between border-t border-hair px-[18px] py-[11px]">
              <AppButton variant="quiet">About</AppButton>
              <AppButton variant="danger">Unpair</AppButton>
            </div>
          </RefRow>
        </RefBlock>
      </div>
    </div>
  );
}
