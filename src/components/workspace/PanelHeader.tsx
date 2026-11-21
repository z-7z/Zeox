import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface Props { title: string; icon: LucideIcon; id?: string; children?: ReactNode }

export function PanelHeader({ title, icon: Icon, id, children }: Props) {
  return <header className="panel-head">
    <h2 id={id}><Icon size={14} aria-hidden="true" />{title}</h2>
    {children && <div className="panel-actions">{children}</div>}
  </header>;
}
