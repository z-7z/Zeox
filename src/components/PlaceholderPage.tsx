import { type LucideIcon } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface PlaceholderPageProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** Shared visual placeholder for sections planned in a later phase. */
export function PlaceholderPage({ icon: Icon, title, description }: PlaceholderPageProps) {
  return (
    <div className="flex items-center justify-center px-5 py-24">
      <GlassCard className="max-w-md text-center">
        <div className="p-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-purple/25 bg-gradient-to-br from-brand-purple/[0.14] to-transparent">
            <Icon size={24} strokeWidth={1.5} className="text-brand-lavender" />
          </span>
          <h2 className="mt-6 text-lg font-semibold tracking-tight text-white">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-txt-secondary">{description}</p>
          <p className="mt-6 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-txt-muted">
            Coming in a future phase
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
