import type { Metadata } from 'next';

import { DownloadView } from './view';

export const metadata: Metadata = {
  title: 'Download LeakSync — Mac and Android',
  description:
    'Get LeakSync for your Mac (Apple Silicon or Intel) and the Android APK. Install both, pair with a 6-digit code, share forever.',
};

export default function DownloadPage() {
  return <DownloadView />;
}
