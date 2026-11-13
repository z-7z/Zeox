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

const levelStyles: Record<StatusLevel, { dot: string; text: string; chip: string }> = {
  operational: { dot: 'bg-accent-green animate-pulse-dot', text: 'text-accent-green', chip: 'bg-accent-green/10' },
  warning: { dot: 'bg-warn animate-pulse-dot', text: 'text-warn', chip: 'bg-warn/10' },
  error: { dot: 'bg-accent-red animate-pulse-dot', text: 'text-accent-red', chip: 'bg-accent-red/10' },
  prototype: { dot: 'bg-txt-muted', text: 'text-txt-secondary', chip: 'bg-line-soft' },
};

/** Compact flat status container with colored icon chip. */
export function StatusCard({ icon: Icon, title, state, level, metadata, compact = false }: StatusCardProps) {
  const s = levelStyles[level];
  return (
    <GlassCard hover className="h-full">
      <div className={'flex items-start gap-3 ' + (compact ? 'p-4' : 'p-5')}>
        <span className={'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ' + s.chip}>
          <Icon size={15} strokeWidth={1.75} className={s.text} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={'status-dot ' + s.dot} />
            <p className="truncate text-[13px] font-medium text-txt-primary">{title}</p>
          </div>
          <p className={'mt-1 text-xs font-semibold ' + s.text}>{state}</p>
          <p className="mt-1 truncate font-mono text-[11px] text-txt-muted">{metadata}</p>
        </div>
      </div>
    </GlassCard>
  );
}
