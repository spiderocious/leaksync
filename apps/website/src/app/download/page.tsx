import type { Metadata } from 'next';

import { SITE } from '../../lib/site';
import { DownloadView } from './view';

const title = 'Download for Mac and Android';
const description =
  'Get LeakSync for your Mac (Apple Silicon or Intel) and the Android app. Install both, pair with a 6-digit code, share forever. No accounts.';

export const metadata: Metadata = {
  // Renders as "Download for Mac and Android · LeakSync" via the layout template.
  title,
  description,
  alternates: { canonical: '/download' },
  openGraph: {
    url: `${SITE.url}/download`,
    title: `${title} · LeakSync`,
    description,
  },
  twitter: { title: `${title} · LeakSync`, description },
};

export default function DownloadPage() {
  return <DownloadView />;
}
