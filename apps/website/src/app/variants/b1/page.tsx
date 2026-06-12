import type { Metadata } from 'next';

import { B1View } from './view';

export const metadata: Metadata = {
  title: 'LeakSync — B1 · Sky',
};

export default function B1Page() {
  return <B1View />;
}
