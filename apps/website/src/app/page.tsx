import type { Metadata } from 'next';

import { SITE } from '../lib/site';
import { HomeView } from './view';

export const metadata: Metadata = {
  // `absolute` bypasses the layout's "%s · LeakSync" template — SITE.title
  // already includes the brand.
  title: { absolute: SITE.title },
  alternates: { canonical: '/' },
  openGraph: { url: SITE.url, title: SITE.title, description: SITE.description },
};

export default function HomePage() {
  return <HomeView />;
}
