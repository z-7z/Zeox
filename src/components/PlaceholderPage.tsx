import { type LucideIcon } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface PlaceholderPageProps { icon: LucideIcon; title: string; description: string }

export function PlaceholderPage({ icon: Icon, title, description }: PlaceholderPageProps) {
  return (
    <div className="flex items-start justify-center px-5 py-14 sm:py-20">
      <GlassCard className="w-full max-w-lg">
        <div className="p-6 sm:p-8">
          <p className="section-kicker">WORKSPACE / IN DEVELOPMENT</p>
          <div className="mt-5 flex items-start gap-4 border-t border-line-soft pt-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-line-soft bg-panel text-accent-cyan"><Icon size={17} strokeWidth={1.5} /></span>
            <div><h2 className="text-lg font-semibold tracking-tight text-txt-primary">{title}</h2><p className="mt-2 text-sm leading-relaxed text-txt-secondary">{description}</p><p className="mt-4 font-mono text-[9px] uppercase tracking-wider text-txt-muted">Planned for a future phase</p></div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
