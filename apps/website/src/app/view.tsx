'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * LeakSync landing page — locked direction B5 "Pop XL"
 * (Soft-3D Friendly Clay archetype, candy sub-variant).
 *
 * Motion system: GSAP entrance chips (fast, never blocks the headline
 * read), ScrollTrigger one-shot section reveals, CSS marquee + bell
 * swing. All animation honors prefers-reduced-motion.
 */
export function HomeView() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
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
        .from('[data-ding-copy] > *', { y: 26, opacity: 0, duration: 0.5, stagger: 0.09 }, 0.4);

      gsap.from('[data-ritual-line]', {
        x: -30,
        opacity: 0,
        duration: 0.45,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: '[data-ritual]', start: 'top 75%' },
      });

      gsap.from('[data-pop-card]', {
        y: 70,
        opacity: 0,
        rotate: (i) => (i % 2 === 0 ? -3 : 3),
        duration: 0.65,
        stagger: 0.11,
        ease: 'back.out(1.7)',
        scrollTrigger: { trigger: '[data-pop-cards]', start: 'top 75%' },
      });

      gsap.from('[data-travel-tile]', {
        y: 60,
        opacity: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: 'back.out(1.6)',
        scrollTrigger: { trigger: '[data-travels]', start: 'top 75%' },
      });

      gsap.from('[data-faq-item]', {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: { trigger: '[data-faq]', start: 'top 78%' },
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
      {/* ===== Full-viewport hero ===== */}
      <section className="flex min-h-[100svh] flex-col">
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 pt-6 sm:px-8">
          <span className="text-[18px] font-extrabold tracking-tight">
            Leak<span className="text-[#2b50c8]">Sync</span>
          </span>
          <Link
            href="/download"
            className="rounded-full bg-[#221d3a] px-5 py-2.5 text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5 hover:rotate-1"
          >
            Get started
          </Link>
        </header>

        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-5 py-12 text-center sm:px-8">
          <h1 className="max-w-5xl text-[clamp(36px,6.6vw,86px)] font-extrabold leading-[1.08] tracking-[-0.028em]">
            Send{' '}
            <span
              data-word-chip
              className="inline-block -rotate-2 rounded-2xl bg-[#2b50c8] px-3 py-0.5 text-white shadow-[0_7px_0_#1b3aa0] sm:px-4"
            >
              a tweet
            </span>{' '}
            <span
              data-word-chip
              className="inline-block rotate-1 rounded-2xl bg-[#ff6b4a] px-3 py-0.5 text-white shadow-[0_7px_0_#cc4426] sm:px-4"
            >
              a photo
            </span>{' '}
            or{' '}
            <span
              data-word-chip
              className="inline-block -rotate-1 rounded-2xl bg-[#ffc636] px-3 py-0.5 text-[#221d3a] shadow-[0_7px_0_#d99e0b] sm:px-4"
            >
              a link
            </span>{' '}
            to your Mac. In one tap.
          </h1>
          <div data-hero-rest className="flex w-full flex-col items-center">
            <p className="mt-7 max-w-xl text-[16px] leading-relaxed text-[#221d3a]/70 sm:text-[18px]">
              LeakSync sits in your Android share sheet. Tap it, hear the ding on your Mac,
              paste. No accounts, no cables, no emailing yourself.
            </p>
            <Link
              href="/download"
              className="mt-9 w-full max-w-xs rounded-full bg-[#2b50c8] px-9 py-4 text-center text-[15px] font-extrabold text-white shadow-[0_8px_0_#1b3aa0] transition-transform hover:-translate-y-1 active:translate-y-0 active:shadow-[0_4px_0_#1b3aa0] sm:w-auto"
            >
              Start pairing
            </Link>
            <p className="mt-10 text-[13px] font-semibold text-[#221d3a]/45">
              Pairs with a 6-digit code in 2 minutes
            </p>
          </div>
        </div>

        <div className="space-y-3 pb-8" aria-hidden>
          <MarqueeRow items={MARQUEE_A} />
          <MarqueeRow items={MARQUEE_B} reverse />
        </div>
      </section>

      {/* ===== The ding moment ===== */}
      <section
        data-ding
        className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 py-24 sm:px-8 lg:grid-cols-2"
      >
        <div className="relative mx-auto w-full max-w-md" aria-hidden>
          <div data-ding-bell className="absolute -top-8 left-6 z-10 text-[44px]">
            <span className="bell-swing inline-block">&#128276;</span>
          </div>
          {/* ASSETS.md slot 2: swap inner card for a real macOS notification screenshot */}
          <div className="rounded-3xl bg-[#221d3a] p-4 shadow-[0_24px_60px_rgba(34,29,58,0.3)] sm:p-5">
            <div className="h-44 rounded-2xl bg-gradient-to-br from-[#3a3360] to-[#221d3a] p-4">
              <div
                data-ding-card
                className="ml-auto w-full max-w-[260px] rounded-xl bg-white p-3.5 shadow-[0_14px_34px_rgba(0,0,0,0.35)]"
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
          <h2 className="text-[clamp(30px,4.4vw,50px)] font-extrabold leading-tight tracking-[-0.02em]">
            The <span className="text-[#ff6b4a]">ding</span> is the whole product.
          </h2>
          <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-[#221d3a]/70 sm:text-[17px]">
            You tap share on the phone and your Mac chimes before you put the phone down.
            Click the menu bar to copy it, or drag it straight into Slack, Notes, or an
            email draft.
          </p>
          <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-[#221d3a]/70 sm:text-[17px]">
            Everything deletes itself from the server after 24 hours. Nothing piles up,
            nothing to manage.
          </p>
        </div>
      </section>

      {/* ===== The old ritual, retired ===== */}
      <section data-ritual className="border-y-2 border-[#221d3a]/8 bg-[#fffbf3]">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2">
          <div>
            <h2 className="text-[clamp(26px,3.6vw,40px)] font-extrabold tracking-[-0.02em]">
              You know the ritual.
            </h2>
            <p className="mt-4 max-w-md text-[16px] leading-relaxed text-[#221d3a]/70">
              Apple keeps Continuity for Apple phones. So everything you spot on your
              Android takes the long way to your Mac. Many times a day.
            </p>
          </div>
          <ul className="space-y-2.5">
            {RITUAL.map((line, i) => (
              <li
                key={line}
                data-ritual-line
                className={`flex items-center gap-3 text-[15px] font-bold sm:text-[17px] ${
                  i < RITUAL.length - 1 ? 'text-[#221d3a]/40 line-through' : 'text-[#2b50c8]'
                }`}
              >
                <span
                  className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold ${
                    i < RITUAL.length - 1
                      ? 'bg-[#221d3a]/10 text-[#221d3a]/40'
                      : 'bg-[#2b50c8] text-white'
                  }`}
                >
                  {i < RITUAL.length - 1 ? '×' : '✓'}
                </span>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== Four steps ===== */}
      <section data-pop-cards className="bg-[#2b50c8] py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <h2 className="text-center text-[clamp(28px,4vw,46px)] font-extrabold tracking-[-0.02em] text-white">
            Four steps. Then it disappears into your day.
          </h2>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                data-pop-card
                className="rounded-3xl p-7 transition-transform hover:-translate-y-1.5 hover:rotate-1"
                style={{ backgroundColor: step.bg, color: step.fg }}
              >
                <span className="text-[30px] font-extrabold opacity-50">0{i + 1}</span>
                <h3 className="mt-2 text-[20px] font-extrabold">{step.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed opacity-80">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== What it carries ===== */}
      <section data-travels className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8">
        <h2 className="text-center text-[clamp(28px,4vw,46px)] font-extrabold tracking-[-0.02em]">
          Whatever you can share, it carries.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-center text-[15px] text-[#221d3a]/60">
          From Twitter, Chrome, Photos, WhatsApp, Notes, anywhere with a share button.
        </p>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {TRAVELS.map((tile) => (
            <div
              key={tile.title}
              data-travel-tile
              className="rounded-3xl p-8 transition-transform hover:-translate-y-1.5"
              style={{ backgroundColor: tile.bg, color: tile.fg }}
            >
              <span className="text-[32px]">{tile.emoji}</span>
              <h3 className="mt-3 text-[21px] font-extrabold">{tile.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed opacity-80">{tile.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section data-faq className="bg-[#fffbf3]">
        <div className="mx-auto w-full max-w-4xl px-5 py-24 sm:px-8">
          <h2 className="text-center text-[clamp(26px,3.6vw,40px)] font-extrabold tracking-[-0.02em]">
            Fair questions.
          </h2>
          <div className="mt-12 space-y-3">
            {FAQ.map((item) => (
              <details
                key={item.q}
                data-faq-item
                className="group rounded-2xl border-2 border-[#221d3a]/8 bg-white px-6 py-4 open:border-[#2b50c8]/30"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-[15.5px] font-extrabold [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span
                    aria-hidden
                    className="ml-4 text-[20px] font-bold text-[#2b50c8] transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[14.5px] leading-relaxed text-[#221d3a]/70">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA close ===== */}
      <section id="get" data-close className="mx-auto w-full max-w-5xl px-5 py-28 text-center sm:px-8">
        <h2 className="text-[clamp(32px,5vw,58px)] font-extrabold leading-tight tracking-[-0.025em]">
          Your phone and your Mac,
          <br />
          finally on speaking terms.
        </h2>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/download"
            className="w-full max-w-xs rounded-full bg-[#2b50c8] px-9 py-5 text-[16px] font-extrabold text-white shadow-[0_8px_0_#1b3aa0] transition-transform hover:-translate-y-1 sm:w-auto"
          >
            Download for Mac
          </Link>
          <Link
            href="/download"
            className="w-full max-w-xs rounded-full border-[3px] border-[#221d3a] px-9 py-5 text-[16px] font-extrabold transition-transform hover:-translate-y-1 sm:w-auto"
          >
            Get it on Android
          </Link>
        </div>
        <p className="mt-6 text-[13px] font-semibold text-[#221d3a]/45">
          One phone &middot; One Mac &middot; Zero accounts
        </p>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t-2 border-[#221d3a]/8">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-5 py-8 text-[13px] font-semibold text-[#221d3a]/50 sm:flex-row sm:px-8">
          <span className="text-[15px] font-extrabold text-[#221d3a]">
            Leak<span className="text-[#2b50c8]">Sync</span>
          </span>
        </div>
      </footer>
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

const RITUAL = [
  'Copy it on the phone',
  'Open Mail, email yourself',
  'Walk to the Mac, open Mail',
  'Copy it again, paste it',
  'Tap share. Paste on the Mac. Done.',
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

const TRAVELS = [
  {
    emoji: '💬',
    title: 'Text',
    body: 'A quote, an address, a paragraph from Notes. Lands ready to paste.',
    bg: '#2b50c8',
    fg: '#fff6e9',
  },
  {
    emoji: '🔗',
    title: 'Links',
    body: 'URLs arrive as URLs, never screenshots. Click and you are exactly where you were on the phone.',
    bg: '#ffc636',
    fg: '#221d3a',
  },
  {
    emoji: '🖼️',
    title: 'Images',
    body: 'Photos and screenshots arrive full quality. Drag them straight from the menu bar into any app.',
    bg: '#221d3a',
    fg: '#fff6e9',
  },
];

const FAQ = [
  {
    q: 'Is anyone else seeing my stuff?',
    a: 'No accounts exist to leak. Your pair is just your two devices, items travel encrypted in transit, and everything deletes itself from the server after 24 hours.',
  },
  {
    q: 'Do the phone and Mac need to be on the same Wi-Fi?',
    a: 'No. Items go through a small relay, so sharing works from anywhere with internet. Spot something on the bus, find it waiting on your Mac at home.',
  },
  {
    q: 'What if my Mac is asleep when I share?',
    a: 'The item waits. The moment your Mac wakes and checks in, it lands with the usual ding.',
  },
  {
    q: 'Can I send from the Mac back to the phone?',
    a: 'Today it is one-way, phone to Mac, because that is where the friction was. The other direction is on the list.',
  },
  {
    q: 'Which devices does it support?',
    a: 'Any Android phone with a share sheet, and any Mac that can run a menu bar app. Built and tested on a Samsung Galaxy and a MacBook.',
  },
];
