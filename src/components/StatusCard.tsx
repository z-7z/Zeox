import { type LucideIcon } from 'lucide-react';

export type StatusLevel = 'operational' | 'warning' | 'error' | 'prototype';

interface StatusCardProps {
  icon: LucideIcon;
  title: string;
  state: string;
  level: StatusLevel;
  metadata: string;
  compact?: boolean;
}

const levelStyles: Record<StatusLevel, { dot: string; text: string; edge: string }> = {
  operational: { dot: 'bg-ok animate-pulse-dot', text: 'text-ok', edge: 'border-l-ok/60' },
  warning: { dot: 'bg-warn animate-pulse-dot', text: 'text-warn', edge: 'border-l-warn/60' },
  error: { dot: 'bg-err animate-pulse-dot', text: 'text-err', edge: 'border-l-err/60' },
  prototype: { dot: 'bg-brand-violet animate-pulse-dot', text: 'text-brand-lavender', edge: 'border-l-brand-violet/60' },
};

/**
 * Status container with its own identity: a colored left edge marks the state
 * at a glance, before any text is read. Deliberately distinct from stat cards.
 */
export function StatusCard({ icon: Icon, title, state, level, metadata, compact = false }: StatusCardProps) {
  const s = levelStyles[level];
  return (
    <div
      className={`card card-hover overflow-hidden border-l-2 ${s.edge} ${compact ? 'rounded-xl' : ''}`}
    >
      <div className={`flex items-start gap-3 ${compact ? 'p-4' : 'p-5'}`}>
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-card-border bg-ink-elevated">
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
    </div>
  );
}
