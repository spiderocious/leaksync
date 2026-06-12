import { useState } from 'react';

import { AppPairingCodeDisplay, AppPairingCodeEntry, AppText } from '@leaksync/ui';

import { PageHead, RefBlock, RefRow } from './preview-canvas';

// Spec: design-system/projects/leaksync/preview/11-pairing-code.html
export function PairingCodePart() {
  const [value, setValue] = useState('');
  const [done, setDone] = useState(false);

  return (
    <div>
      <PageHead index="Primitives" title="The pairing code" subtitle="@leaksync/ui · AppPairingCode" />

      <p className="mb-6 max-w-[64ch] text-[13px] leading-[1.65] text-ink-3">
        The one number the product hinges on. The Mac <strong>displays</strong> it large; the phone{' '}
        <strong>enters</strong> it once. The entry is a real, typeable input — click it and type
        (numeric keypad on a phone). The active cell carries the single moss underline.
      </p>

      <RefBlock title="Display · on the Mac">
        <RefRow label="492 713">
          <AppPairingCodeDisplay code="492713" />
        </RefRow>
      </RefBlock>

      <div className="mt-6">
        <RefBlock title="Entry · type into it">
          <RefRow label="live">
            <div className="flex flex-col gap-3">
              <AppPairingCodeEntry
                value={value}
                onChange={(v) => {
                  setValue(v);
                  setDone(false);
                }}
                onComplete={() => setDone(true)}
                autoFocus
              />
              <AppText variant="meta" className="uppercase">
                {done ? 'complete — would pair now' : `${value.length} of 6 entered`}
              </AppText>
            </div>
          </RefRow>
        </RefBlock>
      </div>

      <div className="mt-6">
        <RefBlock title="States (static)">
          <RefRow label="partial">
            <AppPairingCodeEntry value="492" disabled />
          </RefRow>
          <RefRow label="complete">
            <AppPairingCodeEntry value="492713" disabled />
          </RefRow>
          <RefRow label="didn't match">
            <AppPairingCodeEntry value="" disabled shake />
          </RefRow>
        </RefBlock>
      </div>
    </div>
  );
}
