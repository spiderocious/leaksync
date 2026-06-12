import { Repeat } from 'meemaw';

import { AppText, type AppTextVariant } from '@leaksync/ui';

import { PageHead, RefBlock, RefRow } from './preview-canvas';

const VARIANTS: AppTextVariant[] = [
  'display-1',
  'display-2',
  'heading-1',
  'heading-2',
  'heading-3',
  'body',
  'body-sm',
  'caption',
];

export function TypographyPart() {
  return (
    <div>
      <PageHead index="00 / FOUNDATION" title="Typography" subtitle="@leaksync/ui · AppText" />

      <p className="mb-6 max-w-[64ch] text-[13px] leading-[1.65] text-slate-500">
        The type scale exposed by <code>AppText</code>. Display + heading variants use the serif
        display face; body + caption use the sans body face. Phase 3 replaces these placeholder
        tokens with the real LeakSync scale (Fraunces display type).
      </p>

      <RefBlock title="Variants">
        <Repeat each={VARIANTS}>
          {(variant) => (
            <RefRow label={variant}>
              <AppText variant={variant}>The quick brown fox</AppText>
            </RefRow>
          )}
        </Repeat>
      </RefBlock>
    </div>
  );
}
