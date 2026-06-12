import { Repeat } from 'meemaw';

import { AppText, type AppTextVariant } from '@leaksync/ui';

import { PageHead, RefBlock, RefRow } from './preview-canvas';

// Spec: design-system/projects/leaksync/preview/02-type.html
const VARIANTS: { variant: AppTextVariant; sample: string }[] = [
  { variant: 'wordmark', sample: 'LeakSync' },
  { variant: 'display', sample: '492 713' },
  { variant: 'read', sample: 'the part where she plants the whole garden in one afternoon' },
  { variant: 'body', sample: 'Share anything to your Mac, instantly.' },
  { variant: 'meta', sample: 'Text · just now' },
  { variant: 'overline', sample: 'Pairing code' },
  { variant: 'mono', sample: 'cooking.nytimes.com/recipes/1018' },
];

export function TypographyPart() {
  return (
    <div>
      <PageHead index="Foundation" title="Type" subtitle="@leaksync/ui · AppText" />

      <p className="mb-6 max-w-[64ch] text-[13px] leading-[1.65] text-ink-3">
        Three families, three jobs. <strong>Literata</strong> serif for the things she reads (item
        bodies, the wordmark, the pairing code); <strong>Inter</strong> for chrome that recedes;{' '}
        <strong>JetBrains Mono</strong> for the record. The serif is the warmth — no sentiment in the
        copy required.
      </p>

      <RefBlock title="Variants">
        <Repeat each={VARIANTS}>
          {({ variant, sample }) => (
            <RefRow label={variant}>
              <AppText variant={variant}>{sample}</AppText>
            </RefRow>
          )}
        </Repeat>
      </RefBlock>
    </div>
  );
}
