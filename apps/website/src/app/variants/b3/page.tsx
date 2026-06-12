import type { Metadata } from 'next';

import { B3View } from './view';

export const metadata: Metadata = {
  title: 'LeakSync — B3 · Deep Cobalt',
};

export default function B3Page() {
  return <B3View />;
}
