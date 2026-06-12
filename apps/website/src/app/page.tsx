import Link from 'next/link';

import { AppText } from '@leaksync/ui';

export default function HomePage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:5173';

  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <AppText variant="caption">leaksync</AppText>
      <AppText variant="display-1" className="mt-2 text-brand-900">
        Your phone to your Mac, instantly.
      </AppText>
      <AppText variant="body" className="mt-6 max-w-2xl text-ink-700">
        Share a tweet, an image, a link or a note from any app on your phone and it
        lands on your Mac within a second. Pair once, share forever.
      </AppText>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href={appUrl}
          className="inline-flex items-center justify-center rounded-md bg-brand-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          Open the app
        </Link>
        <Link
          href="/pricing"
          className="inline-flex items-center justify-center rounded-md border border-brand-900/20 px-5 py-2.5 text-sm font-medium text-brand-900 hover:bg-brand-900/5"
        >
          Pricing
        </Link>
      </div>

      <section className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card title="Feature one" body="Describe your first feature here." />
        <Card title="Feature two" body="Describe your second feature here." />
        <Card title="Feature three" body="Describe your third feature here." />
        <Card title="Feature four" body="Describe your fourth feature here." />
      </section>
    </main>
  );
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-brand-900/10 bg-white p-5 shadow-sm">
      <AppText variant="heading-3" className="text-brand-900">
        {title}
      </AppText>
      <AppText variant="body-sm" className="mt-2 text-ink-700">
        {body}
      </AppText>
    </div>
  );
}
