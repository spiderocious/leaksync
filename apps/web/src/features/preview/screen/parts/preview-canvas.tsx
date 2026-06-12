import type { ReactNode } from 'react';

// Shared layout helpers for preview parts. A part renders a PageHead, then one or
// more RefBlocks; each RefBlock holds labelled RefRows of live components.

interface PageHeadProps {
  readonly index: string;
  readonly title: string;
  readonly subtitle: string;
}

export function PageHead({ index, title, subtitle }: PageHeadProps) {
  return (
    <div className="mb-8">
      <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
        {index}
      </span>
      <h2 className="mt-2 font-serif text-[34px] font-bold leading-none tracking-[-0.02em] text-brand-900">
        {title}
      </h2>
      <p className="mt-2 text-[12px] font-semibold text-slate-400">{subtitle}</p>
    </div>
  );
}

interface RefBlockProps {
  readonly title: string;
  readonly children: ReactNode;
}

export function RefBlock({ title, children }: RefBlockProps) {
  return (
    <section className="rounded-[12px] border border-slate-200 bg-white p-[22px]">
      <h3 className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
        {title}
      </h3>
      {children}
    </section>
  );
}

interface RefRowProps {
  readonly label: string;
  readonly children: ReactNode;
}

export function RefRow({ label, children }: RefRowProps) {
  return (
    <div className="flex items-center gap-6 border-t border-slate-100 py-3 first:border-t-0 first:pt-0">
      <span className="w-32 flex-shrink-0 text-[12px] font-semibold text-slate-400">{label}</span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}
