import { useId, useState } from 'react';
import { compact, number, sum, type OpenPanel, type Overview } from './model';
import { StatusCard } from './StatusCard';
import { FunnelRibbon } from './FunnelRibbon';

export function FunnelCard({ data, open }: { data: Overview; open: OpenPanel }) {
  const { stages, periodDays } = data;
  const shares = stages.map(s => s.value / stages[0].value);
  return <StatusCard label="Purchase rate" value={`${(shares[3] * 100).toFixed(1)}%`} change={data.purchaseChange} period={periodDays}
    description={<>{compact(stages[3].value)} orders from {compact(stages[0].value)} views<span className="copy-dot">·</span>Last {periodDays} days</>}>
    <div className="funnel-plot" aria-label="Purchase conversion funnel">
      <FunnelRibbon shares={shares} />
      <div className="funnel-stages">{stages.map((stage, i) => <button type="button" key={stage.name} className="funnel-stage"
        onClick={() => open('funnel', i)} aria-label={`${stage.name}: ${number(stage.value)}, ${Math.round(shares[i] * 100)}% of views. Inspect stage.`}>
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

export function OrdersCard({ data, open }: { data: Overview; open: OpenPanel }) {
  const prefix = useId();
  const [active, setActive] = useState<number | null>(null);
  const total = sum(data.channels.map(s => s.orders));
  let start = -180;
  return <StatusCard label="Total orders" value={number(total)} change={data.ordersChange} period={data.periodDays}
    description={`Order distribution in the last ${data.periodDays} days`}>
    <div className="orders-body" onMouseLeave={() => setActive(null)}>
      <svg className="hatched-pie" viewBox="0 0 264 264" aria-hidden="true">
        <defs>{inks.map((ink, i) => <pattern key={i} id={`${prefix}-h${i}`} width={i === 0 ? 4 : 4.8} height={i === 0 ? 4 : 4.8} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angles[i]})`}>
          <rect width="5" height="5" fill="#171717" />
          {i < 4 ? <path d="M.8 0v5" stroke={ink} strokeWidth={i === 0 ? 1.35 : 1.5} /> : <circle cx="2" cy="2" r="1" fill={ink} />}
        </pattern>)}</defs>
        <g className="pie-drift"><g className="pie-plate">{data.channels.map(({ name, orders }, i) => {
          const end = start + orders / total * 360;
          const mid = rad((start + end) / 2);
          const d = `M132,132 L${point(start)} A124,124 0 ${end - start > 180 ? 1 : 0} 1 ${point(end)} Z`;
          start = end;
          const offset = active === i ? 4 : 1.3;
          return <path key={name} d={d} fill={`url(#${prefix}-h${i})`} stroke="var(--db-card)" strokeWidth="2.3" strokeLinejoin="round"
            className={active !== null && active !== i ? 'pie-wedge is-muted' : 'pie-wedge'}
            style={{ transform: `translate(${Math.cos(mid) * offset}px, ${Math.sin(mid) * offset}px)` }}
            onMouseEnter={() => setActive(i)} onClick={() => open('channels', i)} />;
        })}</g></g>
        <g className="pie-orbit" fill="none" aria-hidden="true" pointerEvents="none"><circle cx="132" cy="132" r="130" stroke="#7c7c7c" strokeWidth=".8" strokeDasharray="62 755" />
          <circle cx="132" cy="132" r="130" stroke="#555" strokeWidth=".8" strokeDasharray="24 793" strokeDashoffset="-340" /></g>
      </svg>
      <ul className="order-legend">{data.channels.map((s, i) => <li key={s.name}>
        <button type="button" className={`legend-entry${active === i ? ' is-highlighted' : ''}`} onMouseEnter={() => setActive(i)}
          onFocus={() => setActive(i)} onBlur={() => setActive(null)} onClick={() => open('channels', i)}>
          <i style={{ backgroundColor: swatches[i] }} /><span>{s.name}</span>
          <span className="legend-percent">{(s.orders / total * 100).toFixed(1)}%</span><span className="legend-count">{s.orders}</span>
        </button>
      </li>)}</ul>
    </div>
  </StatusCard>;
}
