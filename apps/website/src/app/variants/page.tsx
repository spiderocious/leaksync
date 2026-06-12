import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'LeakSync — Landing variants',
};

const ROUND_2 = [
  {
    href: '/variants/b1',
    name: 'B1 · Sky',
    angle:
      'Periwinkle-to-cream sky. A dotted flight path draws from phone to Mac, item chips pop in and float, steps spring up on scroll, stats count up.',
  },
  {
    href: '/variants/b2',
    name: 'B2 · Pop',
    angle:
      'The loudest. Candy word-chips bounce into the headline, double marquee of things that travel, the "ding" notification slams in, cobalt step cards.',
  },
  {
    href: '/variants/b3',
    name: 'B3 · Deep Cobalt',
    angle:
      'Full-bleed cobalt world with golden glow. Journey cards parallax-scrub as you scroll, colorful what-it-carries tiles, immersive CTA close.',
  },
];

const ROUND_1 = [
  { href: '/variants/editorial', name: 'A · Editorial (rejected)' },
  { href: '/variants/clay', name: 'B · Clay (locked, evolved into B1–B3)' },
  { href: '/variants/split', name: 'C · Split-hero (rejected)' },
];

export default function VariantsIndex() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-[12px] uppercase tracking-[0.2em] text-ink-4">Act III · Round 2</p>
      <h1 className="mt-3 font-serif text-[34px] font-light">
        Three takes on B. Louder, bluer, animated.
      </h1>
      <ul className="mt-10 space-y-4">
        {ROUND_2.map((variant) => (
          <li key={variant.href}>
            <Link
              href={variant.href}
              className="block rounded-card border border-hair bg-paper-sheet p-6 transition-colors hover:border-ink"
            >
              <span className="text-[16px] font-semibold">{variant.name}</span>
              <span className="mt-1.5 block text-[14px] leading-relaxed text-ink-2">
                {variant.angle}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-12 text-[12px] uppercase tracking-[0.2em] text-ink-4">Round 1 archive</p>
      <ul className="mt-4 flex flex-wrap gap-3">
        {ROUND_1.map((variant) => (
          <li key={variant.href}>
            <Link
              href={variant.href}
              className="text-[13px] text-ink-3 underline decoration-hair underline-offset-4 hover:text-ink"
            >
              {variant.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
