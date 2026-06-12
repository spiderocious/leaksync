'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * B3 — "Deep Cobalt". Clay family, blue-gradient immersive sub-variant
 * (the KINSPACE blue exemplar). Full-bleed cobalt world, cream type,
 * golden window-light glow, journey cards that parallax on scroll scrub.
 */
export function B3View() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // hero entrance
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.from('[data-hero] > *', { y: 30, opacity: 0, duration: 0.6, stagger: 0.09 }).from(
        '[data-journey-card]',
        { y: 80, opacity: 0, scale: 0.85, duration: 0.7, stagger: 0.1, ease: 'back.out(1.9)' },
        0.45,
      );

      // journey cards drift at different speeds while the hero scrolls (scrub)
      gsap.utils.toArray<HTMLElement>('[data-journey-card]').forEach((card, i) => {
        gsap.to(card, {
          yPercent: -30 - i * 18,
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-hero-section]',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
          },
        });
        // ambient float layered on top
        gsap.to(card, {
          y: '-=10',
          duration: 2.2 + i * 0.35,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      });

      // what-travels tiles
      gsap.from('[data-travel-tile]', {
        y: 60,
        opacity: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: 'back.out(1.6)',
        scrollTrigger: { trigger: '[data-travels]', start: 'top 72%' },
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
    <div ref={rootRef} className="min-h-screen bg-[#f5efe2] text-[#1b2c66]">
      {/* Hero world */}
      <section
        data-hero-section
        className="relative overflow-hidden bg-[radial-gradient(120%_120%_at_50%_-10%,#3d63e8_0%,#2b50c8_45%,#16308f_100%)] pb-40 text-[#f5efe2]"
      >
        {/* golden window lights */}
        <div
          className="glow-pulse pointer-events-none absolute -right-20 top-24 h-52 w-52 rounded-full bg-[#ffc636]/25 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-24 bottom-10 h-64 w-64 rounded-full bg-[#3d63e8]/40 blur-3xl"
          aria-hidden
        />

        <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 pt-7">
          <span className="text-[17px] font-extrabold tracking-tight">LeakSync</span>
          <Link
            href="#get"
            className="rounded-full bg-[#ffc636] px-5 py-2.5 text-[13px] font-extrabold text-[#1b2c66] transition-transform hover:-translate-y-0.5"
          >
            Get started
          </Link>
        </header>

        <div data-hero className="relative mx-auto max-w-4xl px-6 pt-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[12px] font-bold backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[#7ee29a]" />
            Phone paired &middot; Mac listening
          </div>
          <h1 className="mt-7 text-[clamp(40px,6.4vw,72px)] font-extrabold leading-[1.02] tracking-[-0.025em]">
            One tap on the phone.
            <br />A <span className="text-[#ffc636]">ding</span> on the Mac.
          </h1>
          <p className="mx-auto mt-7 max-w-lg text-[17px] leading-relaxed text-[#f5efe2]/75">
            LeakSync sits in your Android share sheet and lands everything in your Mac
            menu bar within a second. Pair once with a 6-digit code, share forever.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="#get"
              className="rounded-full bg-[#ffc636] px-9 py-4 text-[15px] font-extrabold text-[#1b2c66] shadow-[0_12px_32px_rgba(255,198,54,0.35)] transition-transform hover:-translate-y-1"
            >
              Start pairing
            </Link>
            <a
              href="#travels"
              className="rounded-full border-2 border-white/30 px-9 py-4 text-[15px] font-bold transition-colors hover:border-[#ffc636] hover:text-[#ffc636]"
            >
              What it carries
            </a>
          </div>
        </div>

        {/* journey cards, drifting */}
        <div className="relative mx-auto mt-20 h-44 max-w-5xl px-6" aria-hidden>
          {JOURNEY.map((card, i) => (
            <div
              key={card.title}
              data-journey-card
              className="absolute w-44 rounded-2xl bg-white p-4 text-left text-[#1b2c66] shadow-[0_18px_44px_rgba(10,20,60,0.35)]"
              style={{ left: `${6 + i * 24}%`, top: `${(i % 2) * 42}px` }}
            >
              <span className="text-[20px]">{card.emoji}</span>
              <p className="mt-1.5 text-[14px] font-extrabold">{card.title}</p>
              <p className="text-[11px] leading-snug text-[#1b2c66]/60">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What travels */}
      <section id="travels" data-travels className="mx-auto max-w-6xl px-6 py-28">
        <h2 className="text-center text-[clamp(26px,3.8vw,42px)] font-extrabold tracking-[-0.02em]">
          Whatever you can share, it carries.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-center text-[15px] text-[#1b2c66]/60">
          From Twitter, Chrome, Photos, WhatsApp, Notes, anywhere with a share button.
        </p>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TRAVELS.map((tile) => (
            <div
              key={tile.title}
              data-travel-tile
              className="rounded-3xl p-7 transition-transform hover:-translate-y-1.5"
              style={{ backgroundColor: tile.bg, color: tile.fg }}
            >
              <span className="text-[30px]">{tile.emoji}</span>
              <h3 className="mt-3 text-[20px] font-extrabold">{tile.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed opacity-80">{tile.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA close */}
      <section
        id="get"
        className="bg-[radial-gradient(120%_140%_at_50%_110%,#3d63e8_0%,#2b50c8_50%,#16308f_100%)] text-[#f5efe2]"
      >
        <div data-close className="mx-auto max-w-3xl px-6 py-28 text-center">
          <h2 className="text-[clamp(30px,4.6vw,52px)] font-extrabold leading-tight tracking-[-0.025em]">
            Two minutes to pair.
            <br />A second every time after.
          </h2>
          <Link
            href="#"
            className="mt-10 inline-block rounded-full bg-[#ffc636] px-10 py-5 text-[16px] font-extrabold text-[#1b2c66] shadow-[0_12px_32px_rgba(255,198,54,0.35)] transition-transform hover:-translate-y-1"
          >
            Start pairing
          </Link>
          <p className="mt-6 text-[13px] font-semibold text-[#f5efe2]/55">
            No accounts &middot; Items self-delete after 24 hours
          </p>
        </div>
      </section>
    </div>
  );
}

const JOURNEY = [
  { emoji: '🔢', title: 'Pair', body: 'Type the 6-digit code once.' },
  { emoji: '📤', title: 'Share', body: 'Tap LeakSync in any share sheet.' },
  { emoji: '🔔', title: 'Ding', body: 'The Mac chimes within a second.' },
  { emoji: '📋', title: 'Paste', body: 'Click to copy or drag it out.' },
];

const TRAVELS = [
  {
    emoji: '💬',
    title: 'Text',
    body: 'A quote, an address, a paragraph from Notes. Lands ready to paste, formatting and all.',
    bg: '#2b50c8',
    fg: '#f5efe2',
  },
  {
    emoji: '🔗',
    title: 'Links',
    body: 'URLs arrive as URLs, never screenshots. Click on the Mac and you are exactly where you were on the phone.',
    bg: '#ffc636',
    fg: '#1b2c66',
  },
  {
    emoji: '🖼️',
    title: 'Images',
    body: 'Photos and screenshots arrive full quality. Drag them straight from the menu bar into any app.',
    bg: '#1b2c66',
    fg: '#f5efe2',
  },
];
