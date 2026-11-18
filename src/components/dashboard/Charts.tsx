import { useId, useState } from 'react';
import { compact, formats, number, period, stages, total, type Inspect } from './sample';
import { StatusCard } from './StatusCard';
import { FunnelRibbon } from './FunnelRibbon';

export function FunnelCard({ inspect }: { inspect: Inspect }) {
  const shares = stages.map(s => s.value / stages[0].value);
  return <StatusCard label="Export rate" value={`${(shares[3] * 100).toFixed(1)}%`} change={0.4} period={period}
    description={<>{compact(stages[3].value)} saves from {compact(stages[0].value)} opens<span className="flow-period"><span className="copy-dot">·</span>{period} days</span></>}>
    <div className="funnel-plot" role="group" aria-label="Sample export funnel">
      <FunnelRibbon shares={shares} />
      <div className="funnel-stages">{stages.map((stage, i) => <button type="button" key={stage.name} className="funnel-stage"
        onClick={() => inspect('flow', i)} aria-label={`${stage.name}: ${number(stage.value)}, ${Math.round(shares[i] * 100)}% of opens. Inspect stage.`}>
        <span className="stage-total">{compact(stage.value)}</span>
        <span className="stage-rate">{Math.round(shares[i] * 100)}%</span>
        <span className="stage-name">{stage.name}</span>
      </button>)}</div>
    </div>
  </StatusCard>;
}

const swatches = ['#dedede', '#aaaaaa', '#838383', '#606060', '#454545'];
const inks = ['#a0a0a0', '#8a8a8a', '#737373', '#626262', '#515151'];
const angles = [42, 90, 0, -42, 0];
const rad = (deg: number) => deg * Math.PI / 180;
function point(angle: number) { return `${132 + 124 * Math.cos(rad(angle))},${132 + 124 * Math.sin(rad(angle))}`; }

export function FormatsCard({ inspect }: { inspect: Inspect }) {
  const prefix = useId();
  const [active, setActive] = useState<number | null>(null);
  const files = total(formats.map(s => s.value));
  let start = -180;
  return <StatusCard label="Total files" value={number(files)} change={0.5} period={period}
    description={`File distribution in the last ${period} days`}>
    <div className="mix-body" onMouseLeave={() => setActive(null)}>
      <svg className="hatched-pie" viewBox="0 0 264 264" aria-hidden="true">
        <defs>{inks.map((ink, i) => <pattern key={i} id={`${prefix}-h${i}`} width={i === 0 ? 4 : 4.8} height={i === 0 ? 4 : 4.8} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angles[i]})`}>
          <rect width="5" height="5" fill="#171717" />
          {i < 4 ? <path d="M.8 0v5" stroke={ink} strokeWidth={i === 0 ? 1.35 : 1.5} /> : <circle cx="2" cy="2" r="1" fill={ink} />}
        </pattern>)}</defs>
        <g className="pie-drift"><g className="pie-plate">{formats.map(({ name, value }, i) => {
          const end = start + value / files * 360;
          const mid = rad((start + end) / 2);
          const d = `M132,132 L${point(start)} A124,124 0 ${end - start > 180 ? 1 : 0} 1 ${point(end)} Z`;
          start = end;
          const offset = active === i ? 4 : 1.3;
          return <path key={name} d={d} fill={`url(#${prefix}-h${i})`} stroke="var(--db-card)" strokeWidth="2.3" strokeLinejoin="round"
            className={active !== null && active !== i ? 'pie-wedge is-muted' : 'pie-wedge'}
            style={{ transform: `translate(${Math.cos(mid) * offset}px, ${Math.sin(mid) * offset}px)` }}
            onMouseEnter={() => setActive(i)} onClick={() => inspect('formats', i)} />;
        })}</g></g>
        <g className="pie-orbit" fill="none" aria-hidden="true" pointerEvents="none"><circle cx="132" cy="132" r="130" stroke="#7c7c7c" strokeWidth=".8" strokeDasharray="62 755" />
          <circle cx="132" cy="132" r="130" stroke="#555" strokeWidth=".8" strokeDasharray="24 793" strokeDashoffset="-340" /></g>
      </svg>
      <ul className="mix-legend">{formats.map((s, i) => <li key={s.name}>
        <button type="button" className={`legend-entry${active === i ? ' is-highlighted' : ''}`} onMouseEnter={() => setActive(i)}
          onFocus={() => setActive(i)} onBlur={() => setActive(null)} onClick={() => inspect('formats', i)}>
          <i style={{ backgroundColor: swatches[i] }} /><span>{s.name}</span>
          <span className="legend-percent">{(s.value / files * 100).toFixed(1)}%</span><span className="legend-count">{number(s.value)}</span>
        </button>
      </li>)}</ul>
    </div>
  </StatusCard>;
}
