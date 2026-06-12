import type { Metadata } from 'next';
import Link from 'next/link';

import { Reveal } from '../../../components/reveal';

export const metadata: Metadata = {
  title: 'LeakSync — Variant A · Editorial',
};

/**
 * Variant A — Luxe Serif Minimal Editorial (archetype 02).
 * Cream paper base, Literata display with one italic moss accent,
 * horizontal divider rhythm, contemplative pacing.
 */
export default function EditorialVariant() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      {/* Nav */}
      <header className="mx-auto flex max-w-5xl items-baseline justify-between px-6 pt-10">
        <span className="font-serif text-[19px] tracking-tight">LeakSync</span>
        <nav className="flex gap-8 text-[13px] text-ink-3">
          <a href="#how" className="transition-colors hover:text-ink">
            How it works
          </a>
          <a href="#get" className="transition-colors hover:text-ink">
            Get the apps
          </a>
        </nav>
      </header>

      {/* Hero — headline readable instantly, no entrance gating */}
      <section className="mx-auto max-w-5xl px-6 pb-28 pt-32">
        <p className="text-[12px] uppercase tracking-[0.22em] text-ink-4">
          Android &middot; to &middot; Mac
        </p>
        <h1 className="mt-7 max-w-3xl font-serif text-[clamp(40px,6.5vw,68px)] font-light leading-[1.08] tracking-[-0.015em]">
          Share it on your phone. It is on your Mac{' '}
          <em className="font-normal italic text-moss-deep">before you look up</em>.
        </h1>
        <p className="mt-8 max-w-xl text-[17px] leading-relaxed text-ink-2">
          LeakSync sits in your Android share sheet. Tap it from any app and the tweet,
          photo or link lands in your Mac menu bar within a second.
        </p>
        <div className="mt-12 flex flex-wrap items-center gap-5">
          <Link
            href="#get"
            className="group inline-flex items-center gap-2 border border-ink px-7 py-3 text-[14px] font-medium transition-colors hover:bg-ink hover:text-paper"
          >
            Get LeakSync
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
          <a
            href="#how"
            className="text-[14px] text-ink-3 underline decoration-hair underline-offset-4 transition-colors hover:text-ink"
          >
            See how it works
          </a>
        </div>
      </section>

      <hr className="mx-auto max-w-5xl border-hair" />

      {/* Problem reframe */}
      <section className="mx-auto max-w-5xl px-6 py-28">
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <p className="text-[12px] uppercase tracking-[0.22em] text-ink-4">The old ritual</p>
          </Reveal>
          <div>
            <Reveal>
              <h2 className="font-serif text-[clamp(26px,3.6vw,38px)] font-light leading-snug">
                Copy. Open Mail. Email yourself. Walk to the Mac. Open Mail again. Copy
                again. Paste.
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-7 max-w-lg text-[16px] leading-relaxed text-ink-2">
                That ritual ends here. Apple keeps Continuity to itself, and nothing in
                between works cleanly for an Android phone and a Mac. LeakSync is the
                missing wire: one tap on the phone, one paste on the Mac.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <hr className="mx-auto max-w-5xl border-hair" />

      {/* How it works — editorial numbered rhythm */}
      <section id="how" className="mx-auto max-w-5xl px-6 py-28">
        <Reveal>
          <p className="text-[12px] uppercase tracking-[0.22em] text-ink-4">How it works</p>
        </Reveal>
        <div className="mt-14 space-y-0">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 110}>
              <div className="grid items-baseline gap-4 border-t border-hair py-9 md:grid-cols-[80px_280px_1fr]">
                <span className="font-serif text-[15px] italic text-ink-4">0{i + 1}</span>
                <h3 className="font-serif text-[22px] font-normal">{step.title}</h3>
                <p className="max-w-md text-[15px] leading-relaxed text-ink-2">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA close + footer */}
      <section id="get" className="border-t border-hair bg-paper-2">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">
          <Reveal>
            <h2 className="font-serif text-[clamp(28px,4vw,42px)] font-light">
              Pair once. Share <em className="italic text-moss-deep">forever</em>.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <Link
              href="#"
              className="mt-10 inline-flex items-center gap-2 border border-ink px-8 py-3.5 text-[14px] font-medium transition-colors hover:bg-ink hover:text-paper"
            >
              Get LeakSync
            </Link>
          </Reveal>
        </div>
        <footer className="border-t border-hair">
          <div className="mx-auto flex max-w-5xl items-baseline justify-between px-6 py-8 text-[12px] text-ink-4">
            <span className="font-serif text-[14px] text-ink-3">LeakSync</span>
            <span>Items leave the server after 24 hours.</span>
          </div>
        </footer>
      </section>
    </main>
  );
}

const STEPS = [
  {
    title: 'Pair once',
    body: 'The Mac app shows a 6-digit code. Type it into the phone. That is the whole setup, and you never do it again.',
  },
  {
    title: 'Share from anywhere',
    body: 'Twitter, Chrome, Photos, WhatsApp, Notes. Tap share, tap LeakSync, done. You never leave the app you were in.',
  },
  {
    title: 'It lands',
    body: 'A quiet chime on the Mac. Click the menu bar item to copy it, or drag it straight into Slack, Notes, or wherever it was headed.',
  },
];
