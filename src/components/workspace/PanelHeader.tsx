import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface Props { title: string; icon: LucideIcon; id?: string; meta?: string; bar?: boolean; children?: ReactNode }

/** The Dashboard widget heading, with an optional divided toolbar for tool controls and tables. */
export function PanelHeader({ title, icon: Icon, id, meta, bar, children }: Props) {
  return <header className={`panel-head${bar ? ' panel-bar' : ''}`}>
    <h2 id={id}><Icon size={14} aria-hidden="true" />{title}</h2>
    {meta && <span className="panel-meta">{meta}</span>}
    {children && <div className="panel-actions">{children}</div>}
  </header>;
}
