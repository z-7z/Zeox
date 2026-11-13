import { type LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  delta: string;
  deltaDirection?: 'up' | 'down';
  description: string;
  /** Legacy prop, ignored. */
  accent?: string;
}

/** Dashboard statistic card with delta chip, reference style. */
export function StatCard({
  icon: Icon,
  title,
  value,
  delta,
  deltaDirection = 'up',
  description,
}: StatCardProps) {
  const up = deltaDirection !== 'down';
  const DeltaIcon = up ? TrendingUp : TrendingDown;
  return (
    <GlassCard hover className="h-full">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-medium text-txt-secondary">{title}</p>
          <span
            className={
              'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ' +
              (up ? 'bg-accent-cyan/10 text-accent-cyan' : 'bg-accent-pink/10 text-accent-pink')
            }
          >
            <span className="status-dot bg-current" />
            {delta}
          </span>
        </div>
        <p className="mt-2.5 text-3xl font-semibold tracking-tight text-white">{value}</p>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-txt-muted">
          <DeltaIcon size={12} className={up ? 'text-accent-cyan' : 'text-accent-pink'} />
          {description}
        </p>
        <Icon size={0} className="hidden" aria-hidden />
      </div>
    </GlassCard>
  );
}
