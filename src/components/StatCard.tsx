import { type LucideIcon } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
  accent?: 'purple' | 'orange' | 'none';
}

/** Dashboard statistic card with clear visual hierarchy. */
export function StatCard({ icon: Icon, title, value, description, accent = 'purple' }: StatCardProps) {
  const iconTint =
    accent === 'orange'
      ? 'text-brand-orangeLight border-brand-orange/25 bg-brand-orange/[0.08]'
      : 'text-brand-lavender border-brand-purple/25 bg-brand-purple/[0.09]';
  return (
    <GlassCard hover accent={accent} shine>
      <div className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-medium text-txt-secondary">{title}</p>
          <span className={`flex h-9 w-9 items-center justify-center rounded-lg border ${iconTint}`}>
            <Icon size={16} strokeWidth={1.75} />
          </span>
        </div>
        <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
        <p className="mt-1.5 text-xs text-txt-muted">{description}</p>
      </div>
    </GlassCard>
  );
}
