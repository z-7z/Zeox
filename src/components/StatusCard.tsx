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

const levelStyles: Record<StatusLevel, { color: string; text: string }> = {
  operational: { color: '#8DCFE6', text: 'text-accent-green' },
  warning: { color: '#F2A56F', text: 'text-accent-orange' },
  error: { color: '#E8A7C8', text: 'text-accent-red' },
  prototype: { color: '#71717A', text: 'text-txt-secondary' },
};

/** Compact status container with a restrained status marker. */
export function StatusCard({ icon: Icon, title, state, level, metadata, compact = false }: StatusCardProps) {
  const s = levelStyles[level];
  return (
    <GlassCard hover className="h-full">
      <div className={'flex items-start gap-3 ' + (compact ? 'p-4' : 'p-5')}>
        <span className="icon-chip h-9 w-9 rounded-xl" style={{ ['--c' as any]: s.color }}>
          <Icon size={15} strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={'status-dot ' + (level === 'prototype' ? '' : 'animate-glow-pulse')}
              style={{ background: s.color }}
            />
            <p className="truncate text-[13px] font-medium text-txt-primary">{title}</p>
          </div>
          <p className={'mt-1 text-xs font-semibold ' + s.text}>{state}</p>
          <p className="mt-1 truncate font-mono text-[11px] text-txt-muted">{metadata}</p>
        </div>
      </div>
    </GlassCard>
  );
}
