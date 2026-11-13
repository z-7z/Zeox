import { type LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard } from './GlassCard';

interface ServiceCardProps {
  icon: LucideIcon;
  name: string;
  description: string;
  status: string;
  onExplore?: () => void;
}

const statusColor: Record<string, string> = {
  Available: '#8DCFE6',
  Prototype: '#F2A56F',
};

/** Landing page service card using Zeox's restrained accent palette. */
export function ServiceCard({ icon: Icon, name, description, status, onExplore }: ServiceCardProps) {
  const color = statusColor[status] ?? '#71717A';
  return (
    <GlassCard hover className="group h-full">
      <div className="flex h-full flex-col p-6">
        <div className="flex items-center justify-between">
          <span className="icon-chip h-11 w-11 rounded-xl" style={{ ['--c' as any]: color }}>
            <Icon size={19} strokeWidth={1.75} />
          </span>
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium"
            style={{
              borderColor: color + '55',
              color,
              background: color + '12',
            }}
          >
            <span className="status-dot" style={{ background: color }} />
            {status}
          </span>
        </div>
        <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">{name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-txt-secondary">{description}</p>
        {onExplore ? (
          <button onClick={onExplore} className="mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-medium transition-colors" style={{ color }}>
            Explore
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        ) : (
          <Link to="/dashboard" className="mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-medium transition-colors" style={{ color }}>
            Explore
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </GlassCard>
  );
}
