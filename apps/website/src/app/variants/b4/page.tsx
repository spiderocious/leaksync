import type { Metadata } from 'next';

import { B4View } from './view';

export const metadata: Metadata = {
  title: 'LeakSync — B4 · Sky XL',
};

export default function B4Page() {
  return <B4View />;
}
