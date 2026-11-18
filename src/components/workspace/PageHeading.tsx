import type { ReactNode } from 'react';

interface Props { title: string; eyebrow: string; badge?: string; description?: string; actions?: ReactNode }
export function PageHeading({ title, eyebrow, badge, description, actions }: Props) {
  return <header className="ws-heading"><div className="ws-page-label"><div className="ws-eyebrow"><i />{eyebrow}</div>
    <div className="ws-title-line"><h1>{title}</h1>{badge && <span className="ws-tag">{badge}</span>}</div>
    {description && <p className="ws-description">{description}</p>}</div>
    {actions && <div className="ws-page-actions">{actions}</div>}
  </header>;
}
