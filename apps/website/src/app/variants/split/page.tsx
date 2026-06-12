import type { Metadata } from 'next';
import Link from 'next/link';

import { Reveal } from '../../../components/reveal';

export const metadata: Metadata = {
  title: 'LeakSync — Variant C · Split Hero',
};

/**
 * Variant C — Split-Hero Product-Mockup SaaS (archetype 07).
 * Left value-prop copy with one italic moss accent, right side the
 * real product: the Mac menu-bar popup rendered in code, with the
 * Android "Sent to Mac" card floating beside it.
 */
export default function SplitVariant() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      {/* Sticky nav */}
      <header className="sticky top-0 z-10 border-b border-hair bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-[15px] font-semibold tracking-tight">LeakSync</span>
          <nav className="flex items-center gap-6 text-[13px] text-ink-3">
            <a href="#works" className="transition-colors hover:text-ink">
              What it does
            </a>
            <Link
              href="#get"
              className="rounded-card border border-ink px-4 py-2 font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Get the apps
            </Link>
          </nav>
        </div>
      </header>

      {/* Split hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-16 px-6 pb-24 pt-20 lg:grid-cols-[1fr_0.95fr]">
        <div>
          <h1 className="text-[clamp(36px,5vw,54px)] font-semibold leading-[1.07] tracking-[-0.02em]">
            Your phone&rsquo;s share sheet, wired{' '}
            <em className="font-serif font-medium italic text-moss-deep">straight</em> to
            your Mac.
          </h1>
          <p className="mt-6 max-w-md text-[16px] leading-relaxed text-ink-2">
            Tap share in any Android app and pick LeakSync. The tweet, photo or link is in
            your Mac menu bar within a second, ready to copy or drag anywhere.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="#get"
              className="rounded-card bg-ink px-6 py-3 text-[14px] font-medium text-paper transition-opacity hover:opacity-85"
            >
              Get the apps
            </Link>
            <a
              href="#works"
              className="text-[14px] text-ink-3 underline decoration-hair underline-offset-4 transition-colors hover:text-ink"
            >
              See it in action
            </a>
          </div>
          <p className="mt-7 text-[13px] text-ink-4">
            Lands in under a second &middot; No account needed &middot; Gone from the
            server in 24 hours
          </p>
        </div>

        {/* The product, rendered */}
        <div className="relative mx-auto w-full max-w-[400px]" aria-hidden>
          {/* menu-bar popup */}
          <div className="rounded-[6px] border border-hair bg-paper-sheet shadow-[0_24px_60px_rgba(35,33,28,0.18)]">
            <div className="flex items-center justify-between border-b border-hair px-4 py-3">
              <span className="font-serif text-[15px]">LeakSync</span>
              <span className="flex items-center gap-1.5 text-[11px] text-ink-3">
                <span className="pulse-dot h-2 w-2 rounded-full bg-moss" />
                connected
              </span>
            </div>
            <ul className="divide-y divide-hair-soft">
              {ITEMS.map((item) => (
                <li
                  key={item.meta}
                  className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-paper-2"
                >
                  {item.kind === 'image' ? (
                    <span className="mt-0.5 h-9 w-9 shrink-0 rounded-sharp bg-gradient-to-br from-moss-faint to-moss/60" />
                  ) : (
                    <span className="mt-1 w-9 shrink-0 text-center text-[13px] text-ink-4">
                      {item.kind === 'url' ? '\u{1F517}' : '\u{201C}'}
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] leading-snug text-ink">
                      {item.text}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-ink-4">{item.meta}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between border-t border-hair px-4 py-2.5 text-[11px] text-ink-4">
              <span>Click to copy &middot; drag to drop</span>
              <span>&#9881;</span>
            </div>
          </div>
          {/* floating Android confirm card */}
          <div
            className="float-anim absolute -left-8 -top-7 rounded-[10px] border border-hair bg-paper px-4 py-3 text-[12px] shadow-[0_14px_34px_rgba(35,33,28,0.16)]"
            style={{ '--float-duration': '3s' } as React.CSSProperties}
          >
            <span className="font-medium">Sent to Mac</span>{' '}
            <span className="text-moss-deep">&#10003;</span>
            <span className="mt-0.5 block text-[10px] text-ink-4">from the share sheet</span>
          </div>
        </div>
      </section>

      {/* Works with every app + benefits */}
      <section id="works" className="border-t border-hair bg-paper-sheet">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <p className="text-center text-[12px] uppercase tracking-[0.2em] text-ink-4">
              In the share sheet of every app you already use
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {APPS.map((app) => (
                <span
                  key={app}
                  className="rounded-full border border-hair px-4 py-1.5 text-[13px] text-ink-3"
                >
                  {app}
                </span>
              ))}
            </div>
          </Reveal>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {BENEFITS.map((benefit, i) => (
              <Reveal key={benefit.title} delay={i * 110}>
                <div className="h-full rounded-card border border-hair bg-paper p-6">
                  <h3 className="text-[16px] font-semibold">{benefit.title}</h3>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-ink-2">
                    {benefit.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats + CTA close */}
      <section id="get" className="border-t border-hair">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-10 text-center sm:grid-cols-4">
            {STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 90}>
                <div>
                  <span className="font-serif text-[38px] font-light">{stat.value}</span>
                  <span className="mt-1 block text-[12px] uppercase tracking-[0.16em] text-ink-4">
                    {stat.label}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <div className="mt-16 text-center">
              <Link
                href="#"
                className="inline-block rounded-card bg-ink px-8 py-3.5 text-[14px] font-medium text-paper transition-opacity hover:opacity-85"
              >
                Get the apps
              </Link>
            </div>
          </Reveal>
        </div>
        <footer className="border-t border-hair">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7 text-[12px] text-ink-4">
            <span className="font-medium text-ink-3">LeakSync</span>
            <span>One phone. One Mac. Nothing else.</span>
          </div>
        </footer>
      </section>
    </main>
  );
}

const ITEMS = [
  {
    kind: 'text',
    text: 'The best interfaces disappear. You stop noticing the tool and just…',
    meta: 'Text · just now',
  },
  {
    kind: 'url',
    text: 'theverge.com/2026/06/the-quiet-rise-of-personal-software',
    meta: 'Link · 2m ago',
  },
  { kind: 'image', text: 'IMG_4471.jpg', meta: 'Image · 5m ago' },
  {
    kind: 'text',
    text: 'Address for Saturday: 14 Wren Lane, side entrance',
    meta: 'Text · 18m ago',
  },
  {
    kind: 'url',
    text: 'maps.app.goo.gl/xK2v',
    meta: 'Link · 41m ago',
  },
] as const;

const APPS = ['Twitter', 'Chrome', 'Photos', 'WhatsApp', 'Notes', 'Reddit', 'Gmail'];

const BENEFITS = [
  {
    title: 'Copy in one click',
    body: 'Every item in the menu bar copies to the clipboard with a single click and a quiet green flash.',
  },
  {
    title: 'Drag it anywhere',
    body: 'Pull a row straight out of the menu bar and drop it into Slack, Notes, Figma, or an email draft.',
  },
  {
    title: 'Gone in 24 hours',
    body: 'Items delete themselves from the server after a day. The last five live on your Mac; nothing piles up.',
  },
];

const STATS = [
  { value: '<1s', label: 'phone to Mac' },
  { value: '6', label: 'digits to pair' },
  { value: '24h', label: 'then it is gone' },
  { value: '0', label: 'accounts' },
];
