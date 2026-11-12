import { type LucideIcon } from 'lucide-react';

export type ActivityStatus = 'success' | 'pending' | 'failed';

interface ActivityItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  timestamp: string;
  status: ActivityStatus;
}

const statusStyles: Record<ActivityStatus, { dot: string; label: string; text: string }> = {
  success: { dot: 'bg-accent-green', label: 'Completed', text: 'text-accent-green' },
  pending: { dot: 'bg-warn', label: 'Pending', text: 'text-warn' },
  failed: { dot: 'bg-accent-red', label: 'Failed', text: 'text-accent-red' },
};

/** Single row in the Recent Activity list. */
export function ActivityItem({ icon: Icon, title, description, timestamp, status }: ActivityItemProps) {
  const s = statusStyles[status];
  return (
    <div className="flex items-center gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-card-hover">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-panel">
        <Icon size={15} strokeWidth={1.75} className="text-txt-secondary" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-txt-primary">{title}</p>
        <p className="mt-0.5 truncate text-xs text-txt-muted">{description}</p>
      </div>
      <div className="hidden shrink-0 text-right sm:block">
        <p className={'text-xs font-medium ' + s.text}>{s.label}</p>
        <p className="mt-0.5 text-[11px] text-txt-muted">{timestamp}</p>
      </div>
      <span className={'status-dot shrink-0 sm:hidden ' + s.dot} />
    </div>
  );
}
