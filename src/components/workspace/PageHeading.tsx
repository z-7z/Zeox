import type { ReactNode } from 'react';

export function PageHeading({ title, eyebrow, badge, actions }: { title: string; eyebrow: string; badge?: string; actions?: ReactNode }) {
  return <header className="ws-heading"><div className="ws-page-label"><div className="ws-eyebrow"><i />{eyebrow}</div>
    <div className="ws-title-line"><h1>{title}</h1>{badge && <span className="ws-tag">{badge}</span>}</div></div>
    {actions && <div className="ws-page-actions">{actions}</div>}
  </header>;
}
