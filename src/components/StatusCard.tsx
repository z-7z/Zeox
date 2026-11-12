import { type LucideIcon } from 'lucide-react';
import { GlassCard } from './GlassCard';

export type StatusLevel = 'operational' | 'warning' | 'error' | 'prototype';

interface StatusCardProps {
  icon: LucideIcon;
  title: string;
  state: string;
  level: StatusLevel;
  metadata: string;
  compact?: boolean;
}

const levelStyles: Record<StatusLevel, { dot: string; text: string }> = {
  operational: { dot: 'bg-ok animate-pulse-dot', text: 'text-ok' },
  warning: { dot: 'bg-warn animate-pulse-dot', text: 'text-warn' },
  error: { dot: 'bg-err animate-pulse-dot', text: 'text-err' },
  prototype: { dot: 'bg-brand-violet animate-pulse-dot', text: 'text-brand-lavender' },
};

/** Distinctive compact status container — deliberately different from stat cards. */
export function StatusCard({ icon: Icon, title, state, level, metadata, compact = false }: StatusCardProps) {
  const s = levelStyles[level];
  return (
    <GlassCard compact hover shine className="overflow-hidden">
      <div className={`flex items-start gap-3 ${compact ? 'p-4' : 'p-5'}`}>
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05]">
          <Icon size={15} strokeWidth={1.75} className="text-txt-secondary" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`status-dot ${s.dot}`} />
            <p className="truncate text-[13px] font-medium text-txt-primary">{title}</p>
          </div>
          <p className={`mt-1 text-xs font-semibold ${s.text}`}>{state}</p>
          <p className="mt-1 truncate font-mono text-[11px] text-txt-muted">{metadata}</p>
        </div>
      </div>
    </GlassCard>
  );
}
