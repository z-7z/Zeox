import { type LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface ServiceCardProps {
  icon: LucideIcon;
  name: string;
  description: string;
  status: string;
  onExplore?: () => void;
}

/** Landing page service card. */
export function ServiceCard({ icon: Icon, name, description, status, onExplore }: ServiceCardProps) {
  return (
    <GlassCard hover className="group h-full">
      <div className="flex h-full flex-col p-6">
        <div className="flex items-center justify-between">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-panel">
            <Icon size={19} strokeWidth={1.75} className="text-txt-primary" />
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel px-2.5 py-1 text-[11px] font-medium text-txt-secondary">
            <span className="status-dot bg-accent-green" />
            {status}
          </span>
        </div>
        <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">{name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-txt-secondary">{description}</p>
        <button
          onClick={onExplore}
          className="mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-txt-primary transition-colors hover:text-txt-secondary"
        >
          Explore
          <ArrowUpRight
            size={15}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </button>
      </div>
    </GlassCard>
  );
}
