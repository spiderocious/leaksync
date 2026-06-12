import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'LeakSync — Landing variants',
};

const VARIANTS = [
  {
    href: '/variants/editorial',
    name: 'A · Luxe Serif Minimal Editorial',
    angle:
      'The e-ink brand taken to quiet luxury. Literata, hairline dividers, one italic moss accent, contemplative pacing.',
  },
  {
    href: '/variants/clay',
    name: 'B · Soft-3D Friendly Clay',
    angle:
      'Warm, playful gift energy. Cream ground, bold grotesk headline, cobalt CTA, floating phone-to-Mac scene, four numbered steps.',
  },
  {
    href: '/variants/split',
    name: 'C · Split-Hero Product-Mockup',
    angle:
      'Prove the product at a glance. Copy left, the real menu-bar popup rendered in code on the right, stats and benefits below.',
  },
];

export default function VariantsIndex() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-[12px] uppercase tracking-[0.2em] text-ink-4">Act III</p>
      <h1 className="mt-3 font-serif text-[34px] font-light">Three directions. Lock one.</h1>
      <ul className="mt-10 space-y-4">
        {VARIANTS.map((variant) => (
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
    </main>
  );
}
