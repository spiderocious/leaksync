'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * B2 — "Pop". Clay family at maximum volume. Candy accent chips in the
 * headline, double item marquee, a "ding" notification moment that pops
 * in with back.out, springy scroll reveals everywhere.
 */
export function B2View() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // headline word-chips bounce in (fast, never blocks the read)
      gsap.from('[data-word-chip]', {
        scale: 0,
        rotate: 12,
        duration: 0.5,
        stagger: 0.08,
        delay: 0.15,
        ease: 'back.out(2.4)',
      });
      gsap.from('[data-hero-rest] > *', {
        y: 24,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
      });

      // the ding moment: bell rings, notification slams in
      const dingTl = gsap.timeline({
        scrollTrigger: { trigger: '[data-ding]', start: 'top 65%' },
      });
      dingTl
        .from('[data-ding-bell]', { scale: 0, duration: 0.5, ease: 'back.out(3)' })
        .from(
          '[data-ding-card]',
          { y: -90, opacity: 0, duration: 0.65, ease: 'back.out(1.8)' },
          0.25,
        )
        .from(
          '[data-ding-copy] > *',
          { y: 26, opacity: 0, duration: 0.5, stagger: 0.09 },
          0.4,
        );

      // feature cards spring up
      gsap.from('[data-pop-card]', {
        y: 70,
        opacity: 0,
        rotate: (i) => (i % 2 === 0 ? -3 : 3),
        duration: 0.65,
        stagger: 0.11,
        ease: 'back.out(1.7)',
        scrollTrigger: { trigger: '[data-pop-cards]', start: 'top 75%' },
      });

      gsap.from('[data-close] > *', {
        y: 30,
        opacity: 0,
        duration: 0.55,
        stagger: 0.1,
        scrollTrigger: { trigger: '[data-close]', start: 'top 80%' },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen overflow-x-hidden bg-[#fff6e9] text-[#221d3a]">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 pt-7">
        <span className="text-[18px] font-extrabold tracking-tight">
          Leak<span className="text-[#2b50c8]">Sync</span>
        </span>
        <Link
          href="#get"
          className="rounded-full bg-[#221d3a] px-5 py-2.5 text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5 hover:rotate-1"
        >
          Get started
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-16 text-center">
        <h1 className="text-[clamp(38px,6.2vw,72px)] font-extrabold leading-[1.06] tracking-[-0.025em]">
          Send{' '}
          <span
            data-word-chip
            className="inline-block -rotate-2 rounded-2xl bg-[#2b50c8] px-4 py-0.5 text-white shadow-[0_8px_0_#1b3aa0]"
          >
            a tweet
          </span>{' '}
          <span
            data-word-chip
            className="inline-block rotate-1 rounded-2xl bg-[#ff6b4a] px-4 py-0.5 text-white shadow-[0_8px_0_#cc4426]"
          >
            a photo
          </span>{' '}
          or{' '}
          <span
            data-word-chip
            className="inline-block -rotate-1 rounded-2xl bg-[#ffc636] px-4 py-0.5 text-[#221d3a] shadow-[0_8px_0_#d99e0b]"
          >
            a link
          </span>{' '}
          to your Mac. In one tap.
        </h1>
        <div data-hero-rest>
          <p className="mx-auto mt-7 max-w-lg text-[17px] leading-relaxed text-[#221d3a]/70">
            LeakSync sits in your Android share sheet. Tap it, hear the ding on your Mac,
            paste. No accounts, no cables, no emailing yourself.
          </p>
          <div className="mt-9 flex justify-center gap-4">
            <Link
              href="#get"
              className="rounded-full bg-[#2b50c8] px-9 py-4 text-[15px] font-extrabold text-white shadow-[0_8px_0_#1b3aa0] transition-transform hover:-translate-y-1 active:translate-y-0 active:shadow-[0_4px_0_#1b3aa0]"
            >
              Start pairing
            </Link>
          </div>
          <p className="mt-5 text-[13px] font-semibold text-[#221d3a]/45">
            Pairs with a 6-digit code in 2 minutes
          </p>
        </div>
      </section>

      {/* Double marquee of things that travel */}
      <section className="space-y-3 py-6" aria-hidden>
        <MarqueeRow items={MARQUEE_A} />
        <MarqueeRow items={MARQUEE_B} reverse />
      </section>

      {/* The ding moment */}
      <section data-ding className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 lg:grid-cols-2">
        <div className="relative mx-auto w-full max-w-md" aria-hidden>
          <div
            data-ding-bell
            className="absolute -top-8 left-6 z-10 text-[44px]"
          >
            <span className="bell-swing inline-block">&#128276;</span>
          </div>
          <div className="rounded-3xl bg-[#221d3a] p-5 shadow-[0_24px_60px_rgba(34,29,58,0.3)]">
            <div className="h-44 rounded-2xl bg-gradient-to-br from-[#3a3360] to-[#221d3a] p-4">
              <div
                data-ding-card
                className="ml-auto w-64 rounded-xl bg-white p-3.5 shadow-[0_14px_34px_rgba(0,0,0,0.35)]"
              >
                <p className="text-[12px] font-extrabold">New from your phone</p>
                <p className="mt-1 truncate text-[12px] text-[#221d3a]/60">
                  &ldquo;Address for Saturday: 14 Wren Lane&hellip;&rdquo;
                </p>
                <p className="mt-2 text-[10px] font-bold text-[#2b50c8]">Click to copy</p>
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] font-semibold text-white/40">
              your Mac, one second after you tapped share
            </p>
          </div>
        </div>
        <div data-ding-copy>
          <h2 className="text-[clamp(28px,4vw,44px)] font-extrabold leading-tight tracking-[-0.02em]">
            The <span className="text-[#ff6b4a]">ding</span> is the whole product.
          </h2>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-[#221d3a]/70">
            You tap share on the phone and your Mac chimes before you put the phone down.
            Click the menu bar to copy it, or drag it straight into Slack, Notes, or an
            email draft.
          </p>
          <p className="mt-4 max-w-md text-[16px] leading-relaxed text-[#221d3a]/70">
            Everything deletes itself from the server after 24 hours. Nothing piles up,
            nothing to manage.
          </p>
        </div>
      </section>

      {/* Feature cards */}
      <section data-pop-cards className="bg-[#2b50c8] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-[clamp(26px,3.8vw,42px)] font-extrabold tracking-[-0.02em] text-white">
            Four steps. Then it disappears into your day.
          </h2>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                data-pop-card
                className="rounded-3xl p-6 transition-transform hover:-translate-y-1.5 hover:rotate-1"
                style={{ backgroundColor: step.bg, color: step.fg }}
              >
                <span className="text-[28px] font-extrabold opacity-50">0{i + 1}</span>
                <h3 className="mt-2 text-[19px] font-extrabold">{step.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed opacity-80">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA close */}
      <section id="get" data-close className="mx-auto max-w-4xl px-6 py-28 text-center">
        <h2 className="text-[clamp(30px,4.6vw,52px)] font-extrabold leading-tight tracking-[-0.025em]">
          Your phone and your Mac,
          <br />
          finally on speaking terms.
        </h2>
        <Link
          href="#"
          className="mt-10 inline-block rounded-full bg-[#2b50c8] px-10 py-5 text-[16px] font-extrabold text-white shadow-[0_8px_0_#1b3aa0] transition-transform hover:-translate-y-1"
        >
          Start pairing
        </Link>
        <p className="mt-6 text-[13px] font-semibold text-[#221d3a]/45">
          One phone &middot; One Mac &middot; Zero accounts
        </p>
      </section>
    </div>
  );
}

function MarqueeRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <div
        className={`marquee-track flex w-max gap-3 ${reverse ? 'marquee-reverse' : ''}`}
        style={{ '--marquee-duration': reverse ? '34s' : '26s' } as React.CSSProperties}
      >
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="whitespace-nowrap rounded-full border-2 border-[#221d3a]/10 bg-white px-5 py-2.5 text-[14px] font-bold text-[#221d3a]/75"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

const MARQUEE_A = [
  '🐦 that thread you need for the deck',
  '📸 the whiteboard photo',
  '🔗 the Airbnb link',
  '📝 the address she texted',
  '🎟️ the booking reference',
];

const MARQUEE_B = [
  '🗺️ the pinned location',
  '💬 the quote for the essay',
  '🧾 the receipt screenshot',
  '🎵 the song link',
  '✈️ the flight confirmation',
];

const STEPS = [
  {
    title: 'Pair',
    body: 'The Mac shows a 6-digit code. Type it on the phone once. Done forever.',
    bg: '#ffc636',
    fg: '#221d3a',
  },
  {
    title: 'Share',
    body: 'Tap share in any app, pick LeakSync. You never leave the app.',
    bg: '#ff6b4a',
    fg: '#ffffff',
  },
  {
    title: 'Ding',
    body: 'Your Mac chimes within a second. The item waits in the menu bar.',
    bg: '#fff6e9',
    fg: '#221d3a',
  },
  {
    title: 'Paste',
    body: 'Click to copy, or drag the row into any app that will take it.',
    bg: '#221d3a',
    fg: '#ffffff',
  },
];
