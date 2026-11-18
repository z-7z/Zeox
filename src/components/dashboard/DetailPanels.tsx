import { useRef } from 'react';
import { ArrowDownToLine, FileCode2, FileSpreadsheet } from 'lucide-react';
import { DashboardSkeleton } from './Skeleton';
import { downloadSkeleton } from './downloads';
import { compact, days, hour, money, number, salesSummary, sum, type Overview } from './model';

export type Insight = 'funnel' | 'channels' | 'traffic' | 'sales';
export function InsightPanel({ id, data, selected }: { id: Insight; data: Overview; selected?: number }) {
  let labels: string[], rows: string[][], detail: string, value: string, period: string;
  switch (id) {
    case 'funnel': {
      const views = data.stages[0].value;
      const last = data.stages[data.stages.length - 1].value;
      value = `${(last / views * 100).toFixed(1)}%`; period = `Last ${data.periodDays} days`;
      detail = `${number(last)} purchases from ${number(views)} product views.`;
      labels = ['Stage', 'Volume', 'Share of views'];
      rows = data.stages.map(s => [s.name, number(s.value), `${(s.value / views * 100).toFixed(1)}%`]); break;
    }
    case 'channels': {
      const total = sum(data.channels.map(s => s.orders));
      value = number(total); period = `Last ${data.periodDays} days`; detail = 'Total orders, grouped by acquisition channel.';
      labels = ['Channel', 'Orders', 'Share']; rows = data.channels.map(s => [s.name, number(s.orders), `${(s.orders / total * 100).toFixed(1)}%`]); break;
    }
    case 'traffic': {
      const total = sum(data.traffic.map(s => s.visits));
      value = number(total); period = 'Last 12 months'; detail = 'Visits across the five tracked traffic sources.';
      labels = ['Source', 'Visits', 'Share']; rows = data.traffic.map(s => [s.name, number(s.visits), `${(s.visits / total * 100).toFixed(1)}%`]); break;
    }
    case 'sales': {
      const { peak, day, hourIndex } = salesSummary(data.hourlySales);
      value = '$' + compact(peak); period = 'Last 7 days'; detail = `Peak hourly sales on ${day}, ${hour(hourIndex)}–${hour(hourIndex + 1)}. All figures in USD.`;
      labels = ['Day', 'Daily sales', 'Peak hour']; rows = data.hourlySales.map((row, d) => [days[d], money(sum(row)), hour(row.indexOf(Math.max(...row)))]); break;
    }
  }
  return <><div className="insight-summary"><strong>{value}</strong><span className="small-tag">{period}</span></div>
    <p className="panel-intro">{detail}</p><table className="insight-table"><thead><tr>{labels.map(s => <th key={s} scope="col">{s}</th>)}</tr></thead>
      <tbody>{rows.map((values, i) => <tr key={values[0]} className={i === selected ? 'selected-row' : ''}>
        <th scope="row">{values[0]}</th>{values.slice(1).map((v, j) => <td key={j}>{v}</td>)}
      </tr>)}</tbody></table><p className="local-note">Source: local demonstration snapshot.</p></>;
}

export function DownloadsPanel({ exportSales, available, notify }: { exportSales: () => void; available: boolean; notify: (msg: string) => void }) {
  const skeleton = useRef<HTMLDivElement>(null);
  return <><p className="panel-intro">Take the layout or the numbers with you.</p>
    <div className="blueprint-preview" aria-hidden="true"><div className="blueprint-inner" ref={skeleton}><DashboardSkeleton /></div></div>
    <button className="download-row" onClick={() => { if (skeleton.current) { downloadSkeleton(skeleton.current.innerHTML); notify('Skeleton HTML downloaded.'); } }}>
      <FileCode2 size={19} /><span><strong>Download skeleton</strong><small>Standalone HTML · CSS shimmer · Offline</small></span><ArrowDownToLine size={16} /></button>
    <button className="download-row" disabled={!available} onClick={exportSales}><FileSpreadsheet size={19} /><span><strong>Export hourly sales</strong><small>CSV · 7 days × 24 hours · USD</small></span><ArrowDownToLine size={16} /></button>
  </>;
}
