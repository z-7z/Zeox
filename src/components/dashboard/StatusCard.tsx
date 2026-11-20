import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import type { ReactNode } from 'react';

interface StatusCardProps { label: string; value: string; description: ReactNode; change: number; period: number; children: ReactNode }

export function StatusCard({ label, value, description, change, period, children }: StatusCardProps) {
  const Trend = change > 0 ? ArrowUpRight : change < 0 ? ArrowDownRight : Minus;
  const direction = change > 0 ? 'up' : change < 0 ? 'down' : 'flat';
  return <section className="db-card glass-card status-card" aria-label={label}>
    <header className="status-heading">
      <div className="status-lead">
        <div className="status-line"><h2>{value}</h2><span className="metric-name">{label}</span></div>
        <p>{description}</p>
      </div>
      <div className="status-comparison"><span className={`delta delta-${direction}`}><Trend size={12} aria-hidden="true" /><span className="db-sr">{direction} </span>{Math.abs(change).toFixed(1)}%</span><small>vs prior {period} days</small></div>
    </header>
    {children}
  </section>;
}
