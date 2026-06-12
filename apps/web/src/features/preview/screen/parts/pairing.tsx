import { useState } from 'react';

import { PairedScene, PairingDisplayScene, PairingEntryScene } from '@leaksync/ui';

import { PageHead, RefBlock, RefRow } from './preview-canvas';

// Spec: design-system/projects/leaksync/preview/31-pairing.html
export function PairingPart() {
  const [value, setValue] = useState('492');

  return (
    <div>
      <PageHead index="Surfaces" title="First-run pairing" subtitle="@leaksync/ui · PairingScene" />

      <p className="mb-6 max-w-[64ch] text-[13px] leading-[1.65] text-ink-3">
        The one time the product asks for anything. The Mac shows the code; the phone enters it
        (typeable); both confirm with a single moss dot. The gift reveal that wraps this lives
        elsewhere — here is the tool doing its quiet job.
      </p>

      <RefBlock title="The handshake">
        <RefRow label="1 · Mac">
          <PairingDisplayScene code="492713" />
        </RefRow>
        <RefRow label="2 · phone">
          <PairingEntryScene value={value} onChange={setValue} />
        </RefRow>
        <RefRow label="3 · paired">
          <PairedScene macName="Sade’s MacBook" />
        </RefRow>
      </RefBlock>
    </div>
  );
}
