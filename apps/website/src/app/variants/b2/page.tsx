import type { Metadata } from 'next';

import { B2View } from './view';

export const metadata: Metadata = {
  title: 'LeakSync — B2 · Pop',
};

export default function B2Page() {
  return <B2View />;
}
