import type { ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';

export function StudioHeader({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <header className="studio-header">
      <div>
        <p className="studio-kicker">
          <span aria-hidden="true" /> File tools <i>/</i> Local studio
        </p>
        <h1>{title}</h1>
        <p className="studio-description">{description}</p>
      </div>
      {children && <div className="studio-actions">{children}</div>}
    </header>
  );
}

export function SectionHead({ index, title, children }: { index: string; title: string; children?: ReactNode }) {
  return (
    <div className="studio-section-head">
      <span className="section-index" aria-hidden="true">
        {index}
      </span>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export function LocalNote() {
  return (
    <span className="local-note">
      <ShieldCheck aria-hidden="true" /> Processed on this device
    </span>
  );
}
