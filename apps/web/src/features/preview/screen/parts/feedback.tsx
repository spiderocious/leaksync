import { AppBanner, AppToast } from '@leaksync/ui';

import { PageHead, RefBlock, RefRow } from './preview-canvas';

// Spec: design-system/projects/leaksync/preview/40-modals.html (toasts/banners)
export function FeedbackPart() {
  return (
    <div>
      <PageHead index="Overlays" title="Toast &amp; banner" subtitle="@leaksync/ui · AppToast / AppBanner" />

      <p className="mb-6 max-w-[64ch] text-[13px] leading-[1.65] text-ink-3">
        The quietest layer. A toast is one line on a paper chip with the single moss/idle/warn dot,
        gone in seconds. A banner is a persistent strip — almost always &ldquo;couldn&rsquo;t reach
        your Mac&rdquo; (muted ochre, never red). Four tones, no danger/red — by design.
      </p>

      <RefBlock title="Toasts">
        <RefRow label="copied">
          <AppToast message="Copied to clipboard" tone="success" when="now" />
        </RefRow>
        <RefRow label="unpaired">
          <AppToast message="Unpaired from Sade’s MacBook" tone="info" action={{ label: 'Undo', onClick: () => {} }} />
        </RefRow>
        <RefRow label="re-paired">
          <AppToast message="Paired again — you’re all set" tone="default" when="now" />
        </RefRow>
      </RefBlock>

      <div className="mt-6">
        <RefBlock title="Banners">
          <RefRow label="warn">
            <div className="w-[360px]">
              <AppBanner title="Couldn’t reach your Mac" tone="warn" cta={{ label: 'Retry', onClick: () => {} }} />
            </div>
          </RefRow>
          <RefRow label="offline">
            <div className="w-[360px]">
              <AppBanner title="Your Mac is offline — items will wait" tone="info" cta={{ label: 'OK', onClick: () => {} }} />
            </div>
          </RefRow>
        </RefBlock>
      </div>
    </div>
  );
}
