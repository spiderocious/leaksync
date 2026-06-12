'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface DownloadTarget {
  key: string;
  emoji: string;
  name: string;
  accent: string;
  accentShadow: string;
  accentText: string;
  description: string;
  hint: string;
  fileLabel: string;
  url: string;
}

// Download URLs come straight from env (inlined at build time).
const TARGETS: DownloadTarget[] = [
  {
    key: 'mac-silicon',
    emoji: '🍎',
    name: 'Mac · Apple Silicon',
    accent: '#2b50c8',
    accentShadow: '#1b3aa0',
    accentText: '#ffffff',
    description: 'For Macs with Apple chips: any MacBook, iMac or Mac mini with an M1, M2, M3 or M4.',
    hint: 'Most Macs from 2021 onwards.',
    fileLabel: '.dmg',
    url: process.env.NEXT_PUBLIC_DOWNLOAD_MAC_SILICON_URL ?? '',
  },
  {
    key: 'mac-intel',
    emoji: '💻',
    name: 'Mac · Intel',
    accent: '#ff6b4a',
    accentShadow: '#cc4426',
    accentText: '#ffffff',
    description: 'For older Macs running on Intel processors, roughly 2020 and earlier.',
    hint: 'Check yours:  menu → About This Mac. "Chip Apple M…" means Apple Silicon; "Processor Intel…" means this one.',
    fileLabel: '.dmg',
    url: process.env.NEXT_PUBLIC_DOWNLOAD_MAC_INTEL_URL ?? '',
  },
  {
    key: 'android',
    emoji: '🤖',
    name: 'Android',
    accent: '#ffc636',
    accentShadow: '#d99e0b',
    accentText: '#221d3a',
    description: 'The phone side. Installs as a share target, so LeakSync shows up in every app’s share sheet.',
    hint: 'You may need to allow installs from your browser the first time.',
    fileLabel: '.apk',
    url: process.env.NEXT_PUBLIC_DOWNLOAD_ANDROID_URL ?? '',
  },
];

export function DownloadView() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [startedKey, setStartedKey] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-dl-head] > *', {
        y: 24,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
      });
      gsap.from('[data-dl-card]', {
        y: 60,
        opacity: 0,
        rotate: (i) => (i % 2 === 0 ? -2 : 2),
        duration: 0.6,
        stagger: 0.1,
        delay: 0.15,
        ease: 'back.out(1.7)',
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const startDownload = (target: DownloadTarget) => {
    if (!target.url) return;
    setStartedKey(target.key);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      // kick off the file download without navigating away
      const anchor = document.createElement('a');
      anchor.href = target.url;
      anchor.rel = 'noopener';
      anchor.click();
    }, 1200);
  };

  const started = TARGETS.find((target) => target.key === startedKey);

  return (
    <div ref={rootRef} className="flex min-h-screen flex-col bg-[#fff6e9] text-[#221d3a]">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 pt-6 sm:px-8">
        <Link href="/" className="text-[18px] font-extrabold tracking-tight">
          Leak<span className="text-[#2b50c8]">Sync</span>
        </Link>
        <Link
          href="/"
          className="rounded-full border-2 border-[#221d3a]/15 px-5 py-2.5 text-[13px] font-bold transition-colors hover:border-[#2b50c8] hover:text-[#2b50c8]"
        >
          &larr; Back home
        </Link>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 pb-24 pt-16 sm:px-8">
        <div data-dl-head className="text-center">
          <h1 className="text-[clamp(34px,5.4vw,64px)] font-extrabold leading-[1.05] tracking-[-0.028em]">
            Grab both apps.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-[#221d3a]/70 sm:text-[17px]">
            One for the Mac, one for the phone. Install the Mac one first; it shows the
            6-digit code you type into the phone.
          </p>
        </div>

        {/* download-starting banner */}
        <div aria-live="polite">
          {started ? (
            <div className="mx-auto mt-10 flex w-full max-w-2xl items-center gap-4 rounded-2xl border-2 border-[#2b50c8]/30 bg-white px-6 py-4 shadow-[0_10px_30px_rgba(34,29,58,0.08)]">
              <span className="text-[26px]">{started.emoji}</span>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-[15px] font-extrabold">
                  Your {started.name} download will start in a moment&hellip;
                </p>
                <p className="mt-0.5 text-[13px] text-[#221d3a]/60">
                  Nothing happening?{' '}
                  <a
                    href={started.url}
                    rel="noopener"
                    className="font-bold text-[#2b50c8] underline underline-offset-2"
                  >
                    Download it directly
                  </a>
                  .
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TARGETS.map((target) => (
            <div
              key={target.key}
              data-dl-card
              className="flex flex-col rounded-3xl border-2 border-[#221d3a]/8 bg-white p-7 shadow-[0_10px_30px_rgba(34,29,58,0.06)] transition-transform hover:-translate-y-1.5"
            >
              <span className="text-[34px]">{target.emoji}</span>
              <h2 className="mt-3 text-[19px] font-extrabold">{target.name}</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-[#221d3a]/70">
                {target.description}
              </p>
              <p className="mt-3 text-[12px] leading-relaxed text-[#221d3a]/45">{target.hint}</p>
              <div className="flex-1" />
              {target.url ? (
                <button
                  type="button"
                  onClick={() => startDownload(target)}
                  className="mt-6 w-full rounded-full px-6 py-3.5 text-[14px] font-extrabold transition-transform hover:-translate-y-0.5 active:translate-y-0"
                  style={{
                    backgroundColor: target.accent,
                    color: target.accentText,
                    boxShadow: `0 6px 0 ${target.accentShadow}`,
                  }}
                >
                  Download {target.fileLabel}
                </button>
              ) : (
                <span className="mt-6 w-full cursor-not-allowed rounded-full bg-[#221d3a]/8 px-6 py-3.5 text-center text-[14px] font-extrabold text-[#221d3a]/40">
                  Coming soon
                </span>
              )}
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-[13px] font-semibold text-[#221d3a]/45">
          After installing both: the Mac shows a 6-digit code, type it on the phone, done.
        </p>
      </main>

      <footer className="border-t-2 border-[#221d3a]/8">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-5 py-8 text-[13px] font-semibold text-[#221d3a]/50 sm:flex-row sm:px-8">
          <span className="text-[15px] font-extrabold text-[#221d3a]">
            Leak<span className="text-[#2b50c8]">Sync</span>
          </span>
          <span>One phone &middot; One Mac &middot; Zero accounts</span>
        </div>
      </footer>
    </div>
  );
}
