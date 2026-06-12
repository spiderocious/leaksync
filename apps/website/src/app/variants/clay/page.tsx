import type { Metadata } from 'next';
import Link from 'next/link';

import { Reveal } from '../../../components/reveal';

export const metadata: Metadata = {
  title: 'LeakSync — Variant B · Clay',
};

/**
 * Variant B — Soft-3D Friendly Clay-Render (archetype 03).
 * Warm cream ground, bold grotesk navy headline, cobalt CTA,
 * soft phone-to-Mac scene with floating item chips (CSS placeholder
 * for the eventual clay render), numbered steps.
 */
export default function ClayVariant() {
  return (
    <main className="min-h-screen bg-[#eee5d8] text-[#202a42]">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 pt-7">
        <span className="text-[17px] font-bold tracking-tight">LeakSync</span>
        <nav className="flex items-center gap-7 text-[13px] font-medium text-[#202a42]/60">
          <a href="#steps" className="transition-colors hover:text-[#202a42]">
            How it works
          </a>
          <Link
            href="#get"
            className="rounded-full bg-[#2b50c8] px-5 py-2 text-white transition-transform hover:-translate-y-0.5"
          >
            Get started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 pb-24 pt-20 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#202a42]/15 bg-white/50 px-4 py-1.5 text-[12px] font-medium">
            <span aria-hidden className="text-[#d9a13b]">
              &#9733;&#9733;&#9733;&#9733;&#9733;
            </span>
            Loved by its one very specific household
          </div>
          <h1 className="mt-6 text-[clamp(38px,5.6vw,60px)] font-extrabold leading-[1.04] tracking-[-0.02em]">
            Get it off your phone and onto your <span className="text-[#2b50c8]">Mac</span>.
          </h1>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-[#202a42]/70">
            Tap share in any Android app, pick LeakSync, and it lands on your Mac with a
            soft ding. No accounts, no cables, no emailing yourself.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="#get"
              className="rounded-full bg-[#2b50c8] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(43,80,200,0.35)] transition-transform hover:-translate-y-0.5"
            >
              Start pairing
            </Link>
            <a
              href="#steps"
              className="text-[14px] font-medium text-[#202a42]/60 transition-colors hover:text-[#202a42]"
            >
              See the four steps &darr;
            </a>
          </div>
        </div>

        {/* Soft scene: phone → floating items → Mac (clay-render placeholder) */}
        <div className="relative mx-auto h-[380px] w-full max-w-[460px]" aria-hidden>
          {/* ground shadow */}
          <div className="absolute bottom-6 left-1/2 h-8 w-72 -translate-x-1/2 rounded-[50%] bg-[#202a42]/10 blur-md" />
          {/* phone */}
          <div className="absolute bottom-12 left-2 h-52 w-28 rotate-[-8deg] rounded-[22px] bg-gradient-to-b from-[#fdf9f2] to-[#e7dccb] p-2 shadow-[0_18px_40px_rgba(32,42,66,0.18)]">
            <div className="h-full w-full rounded-[16px] bg-[#202a42]/90 p-2.5">
              <div className="rounded-md bg-white/15 px-2 py-1.5 text-[8px] font-medium text-white">
                Share via&hellip;
              </div>
              <div className="mt-1.5 rounded-md bg-[#2b50c8] px-2 py-1.5 text-[8px] font-semibold text-white">
                LeakSync &middot; Sent &#10003;
              </div>
            </div>
          </div>
          {/* mac */}
          <div className="absolute bottom-12 right-0 w-60">
            <div className="h-36 rounded-t-[14px] bg-gradient-to-b from-[#fdf9f2] to-[#ece1cf] p-2 shadow-[0_18px_40px_rgba(32,42,66,0.18)]">
              <div className="relative h-full w-full overflow-hidden rounded-[8px] bg-[#cfd9ea]">
                <div className="absolute right-2 top-2 rounded-md bg-white px-2 py-1.5 text-[8px] font-medium text-[#202a42] shadow">
                  <span className="font-semibold">New from your phone</span>
                  <span className="block text-[#202a42]/50">Click to copy</span>
                </div>
              </div>
            </div>
            <div className="h-3 rounded-b-[10px] bg-[#d9cdb8]" />
          </div>
          {/* floating item chips */}
          <div
            className="float-anim absolute left-32 top-24 rounded-full bg-white px-3.5 py-2 text-[11px] font-semibold text-[#202a42] shadow-[0_10px_24px_rgba(32,42,66,0.14)]"
            style={{ '--float-duration': '2.2s' } as React.CSSProperties}
          >
            a tweet
          </div>
          <div
            className="float-anim absolute left-48 top-10 rounded-full bg-[#9db77f] px-3.5 py-2 text-[11px] font-semibold text-white shadow-[0_10px_24px_rgba(32,42,66,0.14)]"
            style={{ '--float-duration': '2.7s' } as React.CSSProperties}
          >
            a photo
          </div>
          <div
            className="float-anim absolute left-44 top-40 rounded-full bg-[#2b50c8] px-3.5 py-2 text-[11px] font-semibold text-white shadow-[0_10px_24px_rgba(32,42,66,0.14)]"
            style={{ '--float-duration': '3.1s' } as React.CSSProperties}
          >
            a link
          </div>
        </div>
      </section>

      {/* Numbered steps */}
      <section id="steps" className="bg-[#faf4ea]">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <Reveal>
            <h2 className="text-center text-[clamp(26px,3.6vw,38px)] font-extrabold tracking-[-0.02em]">
              Two minutes of setup. Then it just works.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 100}>
                <div className="h-full rounded-2xl bg-white p-6 shadow-[0_6px_20px_rgba(32,42,66,0.07)] transition-transform hover:-translate-y-1">
                  <span className="text-[13px] font-bold text-[#2b50c8]">0{i + 1}</span>
                  <h3 className="mt-3 text-[17px] font-bold">{step.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#202a42]/65">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA close */}
      <section id="get" className="bg-[#eee5d8]">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <Reveal>
            <h2 className="text-[clamp(26px,3.6vw,38px)] font-extrabold tracking-[-0.02em]">
              Ready to retire the email-to-yourself habit?
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <Link
              href="#"
              className="mt-9 inline-block rounded-full bg-[#2b50c8] px-9 py-4 text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(43,80,200,0.35)] transition-transform hover:-translate-y-0.5"
            >
              Start pairing
            </Link>
          </Reveal>
          <p className="mt-6 text-[13px] text-[#202a42]/50">
            One phone, one Mac, one 6-digit code.
          </p>
        </div>
        <footer className="border-t border-[#202a42]/10">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7 text-[12px] text-[#202a42]/50">
            <span className="font-bold text-[#202a42]/70">LeakSync</span>
            <span>Everything deletes itself after 24 hours.</span>
          </div>
        </footer>
      </section>
    </main>
  );
}

const STEPS = [
  {
    title: 'Pair',
    body: 'The Mac shows a 6-digit code. Type it into the phone once. Paired for good.',
  },
  {
    title: 'Share',
    body: 'From any app on the phone: tap share, tap LeakSync. You never leave the app.',
  },
  {
    title: 'Ding',
    body: 'Your Mac chimes within a second. The item waits in the menu bar, newest on top.',
  },
  {
    title: 'Paste',
    body: 'Click to copy, or drag the item straight into Slack, Notes, or an email draft.',
  },
];
