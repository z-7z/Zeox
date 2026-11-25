import type { CSSProperties, ReactNode } from 'react';
import { ArrowUpRight, Check, CircleDot, Layers, LockKeyhole } from 'lucide-react';

export function SplitFace({ children }: { children: ReactNode }) {
  return (
    <>
      <span>{children}</span>
      <i aria-hidden="true">
        <ArrowUpRight aria-hidden="true" />
      </i>
    </>
  );
}
export function PageTitle({
  title,
  badge = 'Private workspace',
  kicker = 'ZeoxFucator workspace',
  children,
}: {
  title: string;
  badge?: string;
  kicker?: string;
  children?: ReactNode;
}) {
  return (
    <header className="page-title">
      <div>
        <p className="greeting">
          {kicker} <i aria-hidden="true" />
        </p>
        <div className="title-line">
          <h1>{title}</h1>
          <span className="private-tag">
            <LockKeyhole aria-hidden="true" />
            {badge}
          </span>
        </div>
      </div>
      {children && <div className="page-actions">{children}</div>}
    </header>
  );
}
export function CardTitle({ title, context, children }: { title: string; context?: string; children?: ReactNode }) {
  return (
    <header className="card-head">
      <div className="card-heading">
        <h2 className={context ? undefined : 'underlined'}>{title}</h2>
        {context && <p className="plot-context">{context}</p>}
      </div>
      {children && <div className="card-actions">{children}</div>}
    </header>
  );
}
type Step = { label: string; caption: string };
export function Ribbon({
  title,
  metrics,
  steps,
  current,
  marker,
  weights,
}: {
  title: string;
  metrics: [string | number, string][];
  steps: [Step, Step, Step];
  current: number;
  marker: string;
  weights?: number[];
}) {
  const Icons = [CircleDot, Layers, Check];
  return (
    <section className="card ribbon-card">
      <CardTitle title={title}>
        <div className="inline-metrics">
          {metrics.map(([value, label]) => (
            <span key={label}>
              <b>{value}</b> {label}
            </span>
          ))}
        </div>
      </CardTitle>
      <div className="ribbon-space">
        <ol
          className="ribbon"
          aria-label={title}
          style={
            weights
              ? ({
                  '--one': `${weights[0]}fr`,
                  '--two': `${weights[1]}fr`,
                  '--three': `${weights[2]}fr`,
                } as CSSProperties)
              : undefined
          }
        >
          {steps.map(({ label, caption }, i) => {
            const Icon = Icons[i];
            return (
              <li key={i} aria-current={current === i ? 'step' : undefined}>
                <span className="band">
                  <i>
                    <Icon aria-hidden="true" />
                  </i>
                  <b>{label}</b>
                </span>
                <small>{caption}</small>
                {current === i && (
                  <span className="bead" aria-hidden="true">
                    <em>{marker}</em>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
export function SideNote({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="side-note">
      <i aria-hidden="true" />
      <p>{title}</p>
      {children}
    </div>
  );
}
