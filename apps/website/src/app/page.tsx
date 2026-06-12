import Link from 'next/link';

import { AppText } from '@leaksync/ui';

export default function HomePage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:5173';

  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <AppText variant="overline">leaksync</AppText>
      <AppText variant="display" as="h1" className="mt-2 !text-[44px] !tracking-[-0.02em]">
        Your phone to your Mac, instantly.
      </AppText>
      <AppText variant="read" className="mt-6 max-w-2xl text-ink-2">
        Share a tweet, an image, a link or a note from any app on your phone and it
        lands on your Mac within a second. Pair once, share forever.
      </AppText>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href={appUrl}
          className="inline-flex items-center justify-center rounded-card border border-ink px-5 py-2.5 text-sm font-medium text-ink hover:bg-ink hover:text-paper"
        >
          Open the app
        </Link>
        <Link
          href="/pricing"
          className="inline-flex items-center justify-center rounded-card border border-hair px-5 py-2.5 text-sm font-medium text-ink-2 hover:border-ink hover:text-ink"
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
    <div className="rounded-card border border-hair bg-paper-sheet p-5">
      <AppText variant="read" className="!font-medium !text-[16px]">
        {title}
      </AppText>
      <AppText variant="body" className="mt-2 text-ink-3">
        {body}
      </AppText>
    </div>
  );
}
