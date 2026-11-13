import { type LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard } from './GlassCard';

interface ServiceCardProps { icon: LucideIcon; name: string; description: string; status: string; onExplore?: () => void }

const statusColor: Record<string, string> = { Available: '#5CD4E6', Prototype: '#FF9150' };

export function ServiceCard({ icon: Icon, name, description, status, onExplore }: ServiceCardProps) {
  const color = statusColor[status] ?? '#606C70';
  return (
    <GlassCard hover className="group h-full">
      <div className="flex h-full flex-col p-4">
        <div className="flex items-center justify-between">
          <span className="icon-chip h-9 w-9 rounded-md" style={{ ['--c' as any]: color }}><Icon size={16} strokeWidth={1.75} /></span>
          <span className="inline-flex items-center gap-1.5 border border-line-soft px-2 py-1 font-mono text-[9px] uppercase text-txt-muted"><span className="status-dot" style={{ background: color }} />{status}</span>
        </div>
        <h3 className="mt-4 text-sm font-medium tracking-tight text-txt-primary">{name}</h3>
        <p className="mt-1.5 flex-1 text-xs leading-5 text-txt-secondary">{description}</p>
        {onExplore ? <button onClick={onExplore} className="mt-4 inline-flex w-fit items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider" style={{ color }}>Open service <ArrowRight size={13} /></button> : <Link to="/dashboard" className="mt-4 inline-flex w-fit items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider" style={{ color }}>Open service <ArrowRight size={13} /></Link>}
      </div>
    </GlassCard>
  );
}
