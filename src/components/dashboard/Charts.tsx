import { useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { ArrowDown, ArrowRight, ArrowUp, ChartNoAxesCombined, Files, List } from 'lucide-react';
import { dayLabel } from './period';
import { change, number, type Report } from './sample';
import type { Inspect } from './ChartDetail';

function Delta({ amount, points = false }: { amount: number; points?: boolean }) {
  const positive = amount >= 0, Icon = positive ? ArrowUp : ArrowDown;
  return <span className={`ov-delta ${positive ? 'is-up' : 'is-down'}`}><Icon size={11} aria-hidden="true" />{positive ? '+' : '−'}{Math.abs(amount).toFixed(1)}{points ? ' pp' : '%'}</span>;
}
export function Metrics({ report: { current: c, previous: p, period } }: { report: Report }) {
  const rate = c.saved / c.files * 100, average = c.mb / c.files;
  const items = [
    { label: 'Export rate', value: `${rate.toFixed(1)}%`, delta: rate - p.saved / p.files * 100, points: true },
    { label: 'Files processed', value: number(c.files), delta: change(c.files, p.files) },
    { label: 'Avg. input size', value: `${average.toFixed(2)} MB`, delta: change(average, p.mb / p.files) },
  ];
  return <section className="ws-panel ov-kpis" aria-label="Period summary"><dl>{items.map(item => <div key={item.label}>
    <dt>{item.label}</dt><dd><strong>{item.value}</strong><span className="ov-comparison"><Delta amount={item.delta} points={item.points} /><small className="kpi-period">vs prior {period} days</small></span></dd>
  </div>)}</dl></section>;
}

// Use the plot width (not the viewport): hiding the rail also frees space for dates.
function DateAxis({ rows, selected }: { rows: Report['rows']; selected: number }) {
  const ref = useRef<HTMLDivElement>(null), [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current!;
    setWidth(el.clientWidth);
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const last = rows.length - 1, labelWidth = 54;
  const count = Math.max(2, Math.min(rows.length, 9, Math.floor(width / 120) + 1));
  const left = (i: number) => Math.max(0, Math.min(width - labelWidth, i / last * width - labelWidth / 2));
  const activeLeft = left(selected);
  return <div ref={ref} className="trend-x" aria-hidden="true">{Array.from({ length: count }, (_, i) => {
    const day = Math.round(i * last / (count - 1)), x = left(day);
    // Leave room for the selected-date pill, including when clamped to either end.
    return Math.abs(x - activeLeft) < labelWidth + 4 ? null :
      <span key={day} className="x-tick" style={{ left: x, width: labelWidth }}>{dayLabel(rows[day].time)}</span>;
  })}<b style={{ left: activeLeft, width: labelWidth }}>{dayLabel(rows[selected].time)}</b></div>;
}

export function VolumeTrend({ report, inspect }: { report: Report; inspect: Inspect }) {
  const { rows } = report, last = rows.length - 1, latest = rows[last];
  const [index, setIndex] = useState(last);
  const active = rows[index], x = index / last * 100, ceiling = Math.ceil(Math.max(...rows.map(d => d.mb)) / 20) * 20;
  const y = (1 - active.mb / ceiling) * 100;
  const pts = rows.map((r, i) => ({ x: i / last * 1000, y: (1 - r.mb / ceiling) * 200 }));
  const line = pts.reduce((path, p, i) => {
    if (!i) return `M0 ${p.y}`;
    const prev = pts[i - 1], mid = (prev.x + p.x) / 2;
    return `${path} C${mid} ${prev.y} ${mid} ${p.y} ${p.x} ${p.y}`;
  }, '');
  function pick(e: PointerEvent<HTMLDivElement>) {
    const box = e.currentTarget.getBoundingClientRect(); setIndex(Math.max(0, Math.min(last, Math.round((e.clientX - box.left) / box.width * last))));
  }
  function key(e: KeyboardEvent<HTMLDivElement>) {
    const next: Record<string, number> = { ArrowLeft: index - 1, ArrowDown: index - 1, ArrowRight: index + 1, ArrowUp: index + 1, Home: 0, End: last };
    if (e.key in next) { e.preventDefault(); setIndex(Math.max(0, Math.min(last, next[e.key]))); }
  }
  return <section className="ws-panel ov-trend" aria-labelledby="volume-title">
    <header className="trend-head"><div><strong>{latest.mb} <span>MB</span></strong><h2 id="volume-title">Daily processed volume</h2></div>
      <div className="trend-tools"><span className="ov-comparison"><Delta amount={change(latest.mb, rows[0].mb)} /><small>over {report.period} days</small></span>
        <button type="button" className="ws-icon-button" aria-label="View daily volume table" title="View daily volume table" onClick={() => inspect('volume', index)}><List size={16} /></button></div>
    </header>
    <div className="trend-axes"><div className="trend-y" aria-hidden="true">{[5,4,3,2,1,0].map(n => <span key={n}>{n * ceiling / 5}</span>)}</div>
      <div className="trend-graph"><div className="trend-plot" role="slider" tabIndex={0} aria-label="Inspect daily processed volume" aria-valuemin={1} aria-valuemax={rows.length} aria-valuenow={index + 1} aria-valuetext={`${dayLabel(active.time)}, ${active.mb} MB`}
        onPointerDown={pick} onPointerMove={e => { if (e.pointerType === 'mouse' || e.buttons) pick(e); }} onKeyDown={key}>
        <svg viewBox="0 0 1000 200" preserveAspectRatio="none" aria-hidden="true"><path d={`${line} V200 H0Z`} fill="#171719" />
          {[0,40,80,120,160,200].map(h => <path key={h} d={`M0 ${h}H1000`} className="trend-rule" />)}<path d={line} className="trend-line" /></svg>
        <i className="trend-cursor" style={{ left: `${x}%` }} /><i className="trend-point" style={{ left: `${x}%`, top: `${y}%` }} />
        <span className="trend-tip" aria-hidden="true" style={{ left: `clamp(0px, calc(${x}% ${x >= 50 ? '- var(--tip-width) -' : '+'} 10px), calc(100% - var(--tip-width)))`, top: `clamp(0px, calc(${y}% - 22px), calc(100% - 51px))` }}>
          <span>{dayLabel(active.time)}</span><small><i />Input <b>{active.mb} MB</b></small></span>
      </div><DateAxis rows={rows} selected={index} /></div>
    </div>
  </section>;
}

export function FileGauge({ report, inspect }: { report: Report; inspect: Inspect }) {
  const scripts = report.formats[0].value + report.formats[1].value, count = report.current.files, ticks = 56;
  return <section className="ws-panel ov-gauge" aria-label="File distribution"><header className="ov-heading"><h2><Files size={15} />File distribution</h2><small>Sample</small></header>
    <div className="gauge-face"><svg viewBox="0 0 240 204" role="img" aria-label={`${number(scripts)} script files and ${number(count - scripts)} other files`}>
      {Array.from({ length: ticks }, (_, i) => <line key={i} x1="120" y1="12" x2="120" y2="34" transform={`rotate(${-132 + i * 264 / (ticks - 1)} 120 116)`} stroke={i < Math.round(scripts / count * ticks) ? '#bcbcbf' : '#39393b'} strokeWidth="3.6" />)}
    </svg><div className="gauge-copy"><span><Files size={16} /></span><small>Total files</small><strong>{number(count)}</strong></div></div>
    <div className="ov-key"><span><i />Scripts</span><span><i />Other formats</span></div>
    <button type="button" className="ws-button gauge-detail" onClick={() => inspect('formats')}>View breakdown <ArrowRight size={13} /></button>
  </section>;
}
export function ExportsMeter({ report: { current } }: { report: Report }) {
  const pct = current.saved / current.files * 100;
  return <section className="ws-panel ov-exports" aria-label="Saved outputs"><h2>Saved outputs</h2><div className="exports-count"><strong>{number(current.saved)}</strong><small>{pct.toFixed(1)}% of files</small></div>
    <div className="exports-track" aria-hidden="true">{Array.from({ length: 80 }, (_, i) => <i key={i} className={i < Math.round(pct * .8) ? 'filled' : undefined} />)}</div>
    <div className="ov-key"><span><i />Saved</span><span><i />Not saved</span></div>
  </section>;
}

export function OperationMix({ report, inspect }: { report: Report; inspect: Inspect }) {
  return <section className="ws-panel ov-mix" aria-label="Operation mix"><header className="ov-heading"><h2><ChartNoAxesCombined size={15} />Operation mix</h2><button className="ws-quiet" onClick={() => inspect('operations')}>Details <ArrowRight size={12} /></button></header>
    <strong className="ov-stat">{number(report.current.files)} <small>operations</small></strong>
    <div className="mix-bands">{report.operations.map(({ label, value }) => <div key={label} style={{ flexGrow: value }}><span>{(value / report.current.files * 100).toFixed(1)}%</span><i /></div>)}</div>
    <div className="ov-key">{report.operations.map(op => <span key={op.label}><i />{op.label}</span>)}</div>
  </section>;
}
