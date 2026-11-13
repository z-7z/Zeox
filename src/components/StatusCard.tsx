import { type LucideIcon } from 'lucide-react';
import { GlassCard } from './GlassCard';

export type StatusLevel = 'operational' | 'warning' | 'error' | 'prototype';
interface StatusCardProps { icon: LucideIcon; title: string; state: string; level: StatusLevel; metadata: string; compact?: boolean }

const levelStyles: Record<StatusLevel, { color: string; text: string }> = {
  operational: { color: '#5CD4E6', text: 'text-accent-cyan' },
  warning: { color: '#FF9150', text: 'text-accent-orange' },
  error: { color: '#F2A6C7', text: 'text-accent-pink' },
  prototype: { color: '#606C70', text: 'text-txt-secondary' },
};

export function StatusCard({ icon: Icon, title, state, level, metadata, compact = false }: StatusCardProps) {
  const style = levelStyles[level];
  return (
    <GlassCard hover className="h-full">
      <div className={'flex items-start gap-3 ' + (compact ? 'p-3.5' : 'p-4')}>
        <span className="icon-chip h-8 w-8 rounded-md" style={{ ['--c' as any]: style.color }}><Icon size={14} strokeWidth={1.75} /></span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2"><span className="status-dot" style={{ background: style.color }} /><p className="truncate text-xs font-medium text-txt-primary">{title}</p></div>
          <p className={'mt-1 text-[11px] font-medium ' + style.text}>{state}</p>
          <p className="mt-1 truncate font-mono text-[9px] text-txt-muted">{metadata}</p>
        </div>
      </div>
    </GlassCard>
  );
}
