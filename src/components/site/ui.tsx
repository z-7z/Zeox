import type { ReactNode } from 'react';

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-300">
      <span className="h-1.5 w-1.5 rounded-full bg-white" />
      {children}
    </span>
  );
}

export function SectionHeading({ badge, title, subtitle }: { badge: string; title: ReactNode; subtitle?: string }) {
  return (
    <div className="mx-auto mb-14 max-w-3xl text-center">
      <Badge>{badge}</Badge>
      <h2 className="mt-6 text-4xl font-semibold tracking-tight text-white md:text-5xl">{title}</h2>
      {subtitle ? <p className="mt-4 text-sm leading-relaxed text-neutral-400">{subtitle}</p> : null}
    </div>
  );
}

export function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div className={'rounded-2xl border border-white/10 bg-neutral-950 p-6 transition-colors duration-200 hover:border-white/25 ' + className}>
      {children}
    </div>
  );
}
