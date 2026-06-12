import { Repeat } from 'meemaw';

import { AppButton, type AppButtonVariant } from '@leaksync/ui';

import { PageHead, RefBlock, RefRow } from './preview-canvas';

const VARIANTS: AppButtonVariant[] = ['primary', 'secondary', 'ghost', 'danger'];

export function ButtonsPart() {
  return (
    <div>
      <PageHead index="01 / PRIMITIVES" title="Button" subtitle="@leaksync/ui · AppButton" />

      <p className="mb-6 max-w-[64ch] text-[13px] leading-[1.65] text-slate-500">
        Four intents. Primary is the forward action; secondary is the calm alternative; ghost
        recedes; danger is for destructive actions. Phase 3 expands these into the real component
        set the product surfaces need.
      </p>

      <RefBlock title="Variants">
        <Repeat each={VARIANTS}>
          {(variant) => (
            <RefRow label={variant}>
              <AppButton variant={variant}>Send to Mac</AppButton>
              <AppButton variant={variant} disabled>
                Disabled
              </AppButton>
            </RefRow>
          )}
        </Repeat>
      </RefBlock>
    </div>
  );
}
