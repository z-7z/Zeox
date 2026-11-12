import { type LucideIcon } from 'lucide-react';
import { CreditCard, Zap } from 'lucide-react';
import { GlassCard } from './GlassCard';

export interface AccountCardProps {
  plan: string;
  planDescription: string;
  renewal: string;
  credits: { used: number; total: number };
  onViewPlan?: () => void;
  icon?: LucideIcon;
}

/** Account card: subscription and usage with a clean hierarchy. */
export function AccountCard({
  plan,
  planDescription,
  renewal,
  credits,
  onViewPlan,
  icon: Icon = CreditCard,
}: AccountCardProps) {
  const pct = Math.min(100, Math.round((credits.used / credits.total) * 100));
  return (
    <GlassCard hover accent="purple" shine className="h-full">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-purple/25 bg-gradient-to-br from-brand-purple/[0.14] to-transparent">
              <Icon size={17} strokeWidth={1.75} className="text-brand-lavender" />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">{plan}</p>
              <p className="text-xs text-txt-muted">{planDescription}</p>
            </div>
          </div>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-txt-secondary">
            Active
          </span>
        </div>

        <div className="mt-6 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-txt-secondary">Renewal date</span>
            <span className="font-mono text-xs text-txt-primary">{renewal}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-txt-secondary">Credits used</span>
            <span className="font-mono text-xs text-txt-primary">
              {credits.used.toLocaleString()} / {credits.total.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <Zap size={12} className="text-brand-orangeLight" />
            <span className="font-mono text-[10px] text-txt-muted">{pct}%</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-orangeDeep via-brand-orange to-brand-orangeLight"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {onViewPlan && (
          <button onClick={onViewPlan} className="btn-ghost mt-6 w-full !py-2 text-xs">
            Manage plan
          </button>
        )}
      </div>
    </GlassCard>
  );
}
