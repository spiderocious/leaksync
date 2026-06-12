'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * B4 — "Sky XL". Round-3 evolution of B1.
 * Full-viewport hero (100svh) with the flight scene anchored at the
 * bottom, max-w-7xl containers, mobile-first scene that scales instead
 * of overflowing.
 */
export function B4View() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.from('[data-hero-copy] > *', { y: 26, opacity: 0, duration: 0.5, stagger: 0.08 })
        .from('[data-phone]', { x: -60, rotate: -14, opacity: 0, duration: 0.65 }, 0.15)
        .from('[data-mac]', { x: 60, opacity: 0, duration: 0.65 }, 0.25);

      const path = rootRef.current?.querySelector<SVGPathElement>('[data-flight-path]');
      if (path) {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(path, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' }, 0.6);
      }

      tl.from(
        '[data-chip]',
        { scale: 0, opacity: 0, duration: 0.55, stagger: 0.1, ease: 'back.out(2.2)' },
        0.95,
      ).add(() => {
        gsap.utils.toArray<HTMLElement>('[data-chip]').forEach((chip, i) => {
          gsap.to(chip, {
            y: -12,
            duration: 2 + i * 0.4,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        });
      });

      gsap.from('[data-step]', {
        y: 64,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'back.out(1.6)',
        scrollTrigger: { trigger: '[data-steps]', start: 'top 72%' },
      });

      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const target = Number(el.dataset.count);
        const suffix = el.dataset.suffix ?? '';
        const proxy = { value: 0 };
        gsap.to(proxy, {
          value: target,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
          onUpdate: () => {
            el.textContent = `${Math.round(proxy.value)}${suffix}`;
          },
        });
      });

      gsap.from('[data-close] > *', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: { trigger: '[data-close]', start: 'top 80%' },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="min-h-screen overflow-x-hidden bg-[linear-gradient(170deg,#c7d6fb_0%,#e0e4f6_45%,#f8efdd_100%)] text-[#1c2a52]"
    >
      {/* Full-viewport hero */}
      <section className="flex min-h-[100svh] flex-col">
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 pt-6 sm:px-8">
          <span className="text-[17px] font-extrabold tracking-tight">LeakSync</span>
          <Link
            href="#get"
            className="rounded-full bg-[#2b50c8] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_6px_18px_rgba(43,80,200,0.35)] transition-transform hover:-translate-y-0.5"
          >
            Get started
          </Link>
        </header>

        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 pt-10 text-center sm:px-8">
          <div data-hero-copy>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-1.5 text-[12px] font-semibold text-[#2b50c8]">
              Pair once &middot; Share forever
            </div>
            <h1 className="mx-auto mt-5 max-w-4xl text-[clamp(40px,7vw,84px)] font-extrabold leading-[1.0] tracking-[-0.028em]">
              From your hand to your Mac in <span className="text-[#2b50c8]">one second</span>.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-[#1c2a52]/70 sm:text-[18px]">
              LeakSync lives in your Android share sheet. Tap it and the tweet, photo or
              link flies straight into your Mac menu bar.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="#get"
                className="w-full max-w-xs rounded-full bg-[#2b50c8] px-8 py-4 text-[15px] font-bold text-white shadow-[0_10px_28px_rgba(43,80,200,0.4)] transition-transform hover:-translate-y-1 sm:w-auto"
              >
                Start pairing
              </Link>
              <a
                href="#steps"
                className="w-full max-w-xs rounded-full border-2 border-[#1c2a52]/15 px-8 py-4 text-[15px] font-semibold transition-colors hover:border-[#2b50c8] hover:text-[#2b50c8] sm:w-auto"
              >
                How it works
              </a>
            </div>
          </div>
        </div>

        {/* Flight scene anchored at hero bottom */}
        <div className="relative mx-auto h-[220px] w-full max-w-5xl px-5 sm:h-[280px] sm:px-8" aria-hidden>
          <svg
            className="absolute inset-x-6 top-6 mx-auto h-32 w-[88%] sm:top-8 sm:h-40"
            viewBox="0 0 600 160"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              data-flight-path
              d="M40 130 C 180 -20, 420 -20, 560 110"
              stroke="#2b50c8"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="1 14"
            />
          </svg>
          <div
            data-phone
            className="absolute bottom-0 left-2 h-32 w-[68px] rotate-[-7deg] rounded-[16px] bg-gradient-to-b from-white to-[#dfe5f6] p-1.5 shadow-[0_20px_44px_rgba(28,42,82,0.22)] sm:left-10 sm:h-44 sm:w-24 sm:rounded-[20px]"
          >
            <div className="h-full w-full rounded-[12px] bg-[#1c2a52] p-1.5 sm:rounded-[15px] sm:p-2">
              <div className="rounded bg-white/15 px-1.5 py-1 text-left text-[7px] font-medium text-white">
                Share via&hellip;
              </div>
              <div className="mt-1 rounded bg-[#2b50c8] px-1.5 py-1 text-left text-[7px] font-bold text-white">
                LeakSync &#10003;
              </div>
            </div>
          </div>
          <div data-mac className="absolute bottom-0 right-2 w-40 sm:right-10 sm:w-60">
            <div className="h-24 rounded-t-[10px] bg-gradient-to-b from-white to-[#e4e8f5] p-1.5 shadow-[0_20px_44px_rgba(28,42,82,0.22)] sm:h-32 sm:rounded-t-[12px] sm:p-2">
              <div className="relative h-full w-full overflow-hidden rounded-[6px] bg-[#bfd0f2]">
                <div className="absolute right-1.5 top-1.5 rounded-md bg-white px-2 py-1.5 text-left text-[8px] font-semibold shadow">
                  New from your phone
                  <span className="block font-normal text-[#1c2a52]/50">Click to copy</span>
                </div>
              </div>
            </div>
            <div className="h-2 rounded-b-[8px] bg-[#cdd3e6] sm:h-2.5" />
          </div>
          <div
            data-chip
            className="absolute left-[24%] top-0 rounded-full bg-[#2b50c8] px-3 py-1.5 text-[11px] font-bold text-white shadow-[0_12px_28px_rgba(43,80,200,0.35)] sm:px-4 sm:py-2 sm:text-[12px]"
          >
            a tweet
          </div>
          <div
            data-chip
            className="absolute left-[45%] top-[-12px] rounded-full bg-[#ff6b4a] px-3 py-1.5 text-[11px] font-bold text-white shadow-[0_12px_28px_rgba(255,107,74,0.35)] sm:px-4 sm:py-2 sm:text-[12px]"
          >
            a photo
          </div>
          <div
            data-chip
            className="absolute left-[64%] top-4 rounded-full bg-[#ffc636] px-3 py-1.5 text-[11px] font-bold text-[#1c2a52] shadow-[0_12px_28px_rgba(255,198,54,0.4)] sm:px-4 sm:py-2 sm:text-[12px]"
          >
            a link
          </div>
        </div>
      </section>

      {/* Steps */}
      <section id="steps" data-steps className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8">
        <h2 className="text-center text-[clamp(28px,4vw,46px)] font-extrabold tracking-[-0.02em]">
          Two minutes of setup. A second every time after.
        </h2>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              data-step
              className="rounded-3xl bg-white/80 p-7 shadow-[0_10px_30px_rgba(28,42,82,0.1)] backdrop-blur transition-transform hover:-translate-y-1.5"
            >
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[15px] font-extrabold text-white"
                style={{ backgroundColor: step.color }}
              >
                {i + 1}
              </span>
              <h3 className="mt-4 text-[19px] font-extrabold">{step.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-[#1c2a52]/65">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats + close */}
      <section id="get" className="pb-28">
        <div className="mx-auto grid w-full max-w-5xl gap-8 px-5 py-10 text-center sm:grid-cols-3 sm:px-8">
          <Stat count={1} suffix="s" label="phone to Mac, tops" prefix="<" />
          <Stat count={6} suffix="" label="digits to pair, once" />
          <Stat count={24} suffix="h" label="then it deletes itself" />
        </div>
        <div data-close className="mx-auto mt-10 w-full max-w-4xl px-5 text-center sm:px-8">
          <h2 className="text-[clamp(30px,4.6vw,52px)] font-extrabold tracking-[-0.025em]">
            Stop emailing yourself.
          </h2>
          <Link
            href="#"
            className="mt-9 inline-block w-full max-w-xs rounded-full bg-[#2b50c8] px-10 py-4 text-[15px] font-bold text-white shadow-[0_10px_28px_rgba(43,80,200,0.4)] transition-transform hover:-translate-y-1 sm:w-auto"
          >
            Start pairing
          </Link>
          <p className="mt-5 text-[13px] text-[#1c2a52]/50">One phone. One Mac. No accounts.</p>
        </div>
      </section>
    </div>
  );
}

function Stat({
  count,
  suffix,
  label,
  prefix,
}: {
  count: number;
  suffix: string;
  label: string;
  prefix?: string;
}) {
  return (
    <div>
      <span className="text-[48px] font-extrabold text-[#2b50c8]">
        {prefix}
        <span data-count={count} data-suffix={suffix}>
          0{suffix}
        </span>
      </span>
      <span className="block text-[13px] font-medium text-[#1c2a52]/60">{label}</span>
    </div>
  );
}

const STEPS = [
  {
    title: 'Pair',
    body: 'The Mac shows a 6-digit code. Type it into the phone once. Paired for good.',
    color: '#2b50c8',
  },
  {
    title: 'Share',
    body: 'From any app: tap share, tap LeakSync. You never leave what you were doing.',
    color: '#ff6b4a',
  },
  {
    title: 'Ding',
    body: 'Your Mac chimes within a second. The item waits in the menu bar.',
    color: '#e8a210',
  },
  {
    title: 'Paste',
    body: 'Click to copy, or drag it straight into Slack, Notes, or an email.',
    color: '#5a8a4f',
  },
];
