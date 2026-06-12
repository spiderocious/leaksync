'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * B1 — "Sky". Clay family, periwinkle-to-cream sky gradient.
 * GSAP: hero scene entrance (devices slide in, flight path draws,
 * chips pop with back.out then float forever), scroll-staggered steps,
 * count-up stats.
 */
export function B1View() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hero scene entrance
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.from('[data-hero-copy] > *', { y: 28, opacity: 0, duration: 0.55, stagger: 0.09 })
        .from('[data-phone]', { x: -70, rotate: -16, opacity: 0, duration: 0.7 }, 0.2)
        .from('[data-mac]', { x: 70, opacity: 0, duration: 0.7 }, 0.3);

      // flight path draw
      const path = rootRef.current?.querySelector<SVGPathElement>('[data-flight-path]');
      if (path) {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(path, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' }, 0.7);
      }

      // chips pop, then live
      tl.from(
        '[data-chip]',
        { scale: 0, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'back.out(2.2)' },
        1.1,
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

      // steps stagger in on scroll
      gsap.from('[data-step]', {
        y: 64,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'back.out(1.6)',
        scrollTrigger: { trigger: '[data-steps]', start: 'top 72%' },
      });

      // count-up stats
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
        ease: 'power2.out',
        scrollTrigger: { trigger: '[data-close]', start: 'top 80%' },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="min-h-screen bg-[linear-gradient(170deg,#ccdafb_0%,#e3e6f5_45%,#f7efde_100%)] text-[#1c2a52]"
    >
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 pt-7">
        <span className="text-[17px] font-extrabold tracking-tight">LeakSync</span>
        <Link
          href="#get"
          className="rounded-full bg-[#2b50c8] px-5 py-2 text-[13px] font-semibold text-white shadow-[0_6px_18px_rgba(43,80,200,0.35)] transition-transform hover:-translate-y-0.5"
        >
          Get started
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-10 pt-16 text-center">
        <div data-hero-copy>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-1.5 text-[12px] font-semibold text-[#2b50c8]">
            Pair once &middot; Share forever
          </div>
          <h1 className="mx-auto mt-6 max-w-3xl text-[clamp(40px,6vw,66px)] font-extrabold leading-[1.02] tracking-[-0.025em]">
            From your hand to your Mac in{' '}
            <span className="text-[#2b50c8]">one second</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-[17px] leading-relaxed text-[#1c2a52]/70">
            LeakSync lives in your Android share sheet. Tap it and the tweet, photo or
            link flies straight into your Mac menu bar.
          </p>
          <div className="mt-9 flex justify-center gap-4">
            <Link
              href="#get"
              className="rounded-full bg-[#2b50c8] px-8 py-4 text-[15px] font-bold text-white shadow-[0_10px_28px_rgba(43,80,200,0.4)] transition-transform hover:-translate-y-1"
            >
              Start pairing
            </Link>
            <a
              href="#steps"
              className="rounded-full border-2 border-[#1c2a52]/15 px-8 py-4 text-[15px] font-semibold transition-colors hover:border-[#2b50c8] hover:text-[#2b50c8]"
            >
              How it works
            </a>
          </div>
        </div>

        {/* Flight scene */}
        <div className="relative mx-auto mt-16 h-[300px] max-w-3xl" aria-hidden>
          <svg
            className="absolute inset-x-0 top-10 mx-auto h-40 w-full max-w-2xl"
            viewBox="0 0 600 160"
            fill="none"
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
          {/* phone */}
          <div
            data-phone
            className="absolute bottom-0 left-4 h-44 w-24 rotate-[-7deg] rounded-[20px] bg-gradient-to-b from-white to-[#dfe5f6] p-1.5 shadow-[0_20px_44px_rgba(28,42,82,0.22)] sm:left-16"
          >
            <div className="h-full w-full rounded-[15px] bg-[#1c2a52] p-2">
              <div className="rounded bg-white/15 px-1.5 py-1 text-left text-[7px] font-medium text-white">
                Share via&hellip;
              </div>
              <div className="mt-1 rounded bg-[#2b50c8] px-1.5 py-1 text-left text-[7px] font-bold text-white">
                LeakSync &#10003;
              </div>
            </div>
          </div>
          {/* mac */}
          <div data-mac className="absolute bottom-0 right-4 w-56 sm:right-12">
            <div className="h-32 rounded-t-[12px] bg-gradient-to-b from-white to-[#e4e8f5] p-2 shadow-[0_20px_44px_rgba(28,42,82,0.22)]">
              <div className="relative h-full w-full overflow-hidden rounded-[7px] bg-[#bfd0f2]">
                <div className="absolute right-2 top-2 rounded-md bg-white px-2 py-1.5 text-left text-[8px] font-semibold shadow">
                  New from your phone
                  <span className="block font-normal text-[#1c2a52]/50">Click to copy</span>
                </div>
              </div>
            </div>
            <div className="h-2.5 rounded-b-[9px] bg-[#cdd3e6]" />
          </div>
          {/* traveling chips */}
          <div
            data-chip
            className="absolute left-[30%] top-2 rounded-full bg-[#2b50c8] px-4 py-2 text-[12px] font-bold text-white shadow-[0_12px_28px_rgba(43,80,200,0.35)]"
          >
            a tweet
          </div>
          <div
            data-chip
            className="absolute left-[48%] top-[-14px] rounded-full bg-[#ff6b4a] px-4 py-2 text-[12px] font-bold text-white shadow-[0_12px_28px_rgba(255,107,74,0.35)]"
          >
            a photo
          </div>
          <div
            data-chip
            className="absolute left-[63%] top-6 rounded-full bg-[#ffc636] px-4 py-2 text-[12px] font-bold text-[#1c2a52] shadow-[0_12px_28px_rgba(255,198,54,0.4)]"
          >
            a link
          </div>
        </div>
      </section>

      {/* Steps */}
      <section id="steps" data-steps className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-[clamp(26px,3.6vw,40px)] font-extrabold tracking-[-0.02em]">
          Two minutes of setup. A second every time after.
        </h2>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              data-step
              className="rounded-3xl bg-white/80 p-6 shadow-[0_10px_30px_rgba(28,42,82,0.1)] backdrop-blur transition-transform hover:-translate-y-1.5"
            >
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[14px] font-extrabold text-white"
                style={{ backgroundColor: step.color }}
              >
                {i + 1}
              </span>
              <h3 className="mt-4 text-[18px] font-extrabold">{step.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[#1c2a52]/65">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats + close */}
      <section id="get" className="pb-24">
        <div className="mx-auto grid max-w-4xl gap-8 px-6 py-10 text-center sm:grid-cols-3">
          <Stat count={1} suffix="s" label="phone to Mac, tops" prefix="<" />
          <Stat count={6} suffix="" label="digits to pair, once" />
          <Stat count={24} suffix="h" label="then it deletes itself" />
        </div>
        <div data-close className="mx-auto mt-10 max-w-3xl px-6 text-center">
          <h2 className="text-[clamp(26px,3.6vw,40px)] font-extrabold tracking-[-0.02em]">
            Stop emailing yourself.
          </h2>
          <Link
            href="#"
            className="mt-8 inline-block rounded-full bg-[#2b50c8] px-10 py-4 text-[15px] font-bold text-white shadow-[0_10px_28px_rgba(43,80,200,0.4)] transition-transform hover:-translate-y-1"
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
      <span className="text-[44px] font-extrabold text-[#2b50c8]">
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
