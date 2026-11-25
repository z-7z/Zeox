import { ChevronDown, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export function Disclosure({
  title,
  icon: Icon,
  detail,
  inset,
  children,
}: {
  title: string;
  icon: LucideIcon;
  detail?: ReactNode;
  inset?: boolean;
  children: ReactNode;
}) {
  return (
    <details className={inset ? 'disclosure inset' : 'card disclosure'}>
      <summary>
        <Icon aria-hidden="true" />
        <span>{title}</span>
        {detail != null && <small>{detail}</small>}
        <ChevronDown className="chevron" aria-hidden="true" />
      </summary>
      <div className="disclosure-body">{children}</div>
    </details>
  );
}
