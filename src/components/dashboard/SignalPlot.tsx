import { useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { ArrowUpRight, List, Radio } from 'lucide-react';
import { dateRange, dayLabel, type SamplePeriod } from './period';
import { change, number, type Report } from './sample';
import type { Inspect } from './ChartDetail';

function TimeRail({ rows, selected }: { rows: Report['rows']; selected: number }) {
  const ref = useRef<HTMLDivElement>(null),
    [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current!,
      observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    setWidth(el.clientWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const last = rows.length - 1,
    label = 46,
    count = Math.max(2, Math.min(rows.length, 6, 1 + Math.floor(width / 90)));
  const pos = (i: number) => Math.max(0, Math.min(width - label, (i / last) * width - label / 2));
  return (
    <div ref={ref} className="time-rail" aria-hidden="true">
      <div className="rail-bands">
        {[0, 1, 2, 3, 4].map((i) => (
          <i key={i} />
        ))}
      </div>
      <i className="rail-marker" style={{ left: `${(selected / last) * 100}%` }} />
      {Array.from({ length: count }, (_, i) => Math.round((i / (count - 1)) * last))
        .filter((i) => Math.abs(pos(i) - pos(selected)) >= label + 2)
        .map((i) => (
          <span key={i} style={{ left: pos(i), width: label }}>
            {dayLabel(rows[i].time)}
          </span>
        ))}
      <b style={{ left: pos(selected), width: label }}>{dayLabel(rows[selected].time)}</b>
    </div>
  );
}
export function SignalPlot({
  report,
  setPeriod,
  inspect,
}: {
  report: Report;
  setPeriod: (p: SamplePeriod) => void;
  inspect: Inspect;
}) {
  const { rows, current, previous, period } = report,
    last = rows.length - 1;
  const [picked, setIndex] = useState<number | null>(null),
    [reading, setReading] = useState(false);
  const index = Math.min(picked ?? Math.round(last * 0.18), last);
  const values = rows.flatMap((r, i) => {
    if (!i) return [r.mb];
    const prev = rows[i - 1].windows,
      [a, b] = r.windows;
    return [prev[1] + prev[2] + a, prev[2] + a + b, r.mb];
  });
  const active = rows[index],
    lo = Math.floor((Math.min(...values) - 4) / 10) * 10,
    hi = Math.ceil((Math.max(...values) + 4) / 10) * 10;
  const x = (index / last) * 100,
    y = ((hi - active.mb) / (hi - lo)) * 100,
    delta = change(current.mb, previous.mb);
  const path = values
    .map((v, i) => `${i ? 'L' : 'M'}${(i / (values.length - 1)) * 1000},${((hi - v) / (hi - lo)) * 200}`)
    .join(' ');
  function pick(e: PointerEvent<HTMLDivElement>) {
    const b = e.currentTarget.getBoundingClientRect();
    setIndex(Math.max(0, Math.min(last, Math.round(((e.clientX - b.left) / b.width) * last))));
    setReading(true);
  }
  function key(e: KeyboardEvent<HTMLDivElement>) {
    const steps: Record<string, number> = {
      Home: 0,
      End: last,
      ArrowLeft: index - 1,
      ArrowDown: index - 1,
      ArrowRight: index + 1,
      ArrowUp: index + 1,
    };
    if (e.key in steps) {
      e.preventDefault();
      setIndex(Math.max(0, Math.min(last, steps[e.key])));
      setReading(true);
    }
  }
  return (
    <section className="ws-panel signal-main" aria-label="Daily processed volume">
      <header className="card-heading">
        <div>
          <h2>Throughput</h2>
          <p>Total input volume</p>
        </div>
        <span className="serial">
          <i /> SAMPLE / {period}D
        </span>
      </header>
      <div className="signal-summary">
        <div className="volume-value">
          {number(current.mb)}
          <small> MB</small>
        </div>
        <span className={`metric-badge ${delta < 0 ? 'negative' : ''}`}>
          <ArrowUpRight size={12} />
          {delta > 0 ? '+' : ''}
          {delta.toFixed(1)}%
        </span>
        <span
          className={`metric-badge delta-size ${delta < 0 ? 'negative' : ''}`}
          title="Change from the previous sample window"
        >
          {delta > 0 ? '+' : ''}
          {number(current.mb - previous.mb)} MB
        </span>
        <div className="plot-controls">
          <button
            className="tiny-button"
            aria-label="View daily volume table"
            title="Daily volume table"
            onClick={() => inspect('volume', index)}
          >
            <List size={16} />
          </button>
          <select
            aria-label="Sample period"
            value={period}
            onChange={(e) => {
              setIndex(null);
              setReading(false);
              setPeriod(e.target.value === '7' ? 7 : 30);
            }}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
          </select>
        </div>
      </div>
      <div className="signal-chart">
        <div className="signal-graph">
          <div
            className="signal-plot"
            role="slider"
            tabIndex={0}
            aria-label="Inspect daily processed volume"
            aria-valuemin={1}
            aria-valuemax={rows.length}
            aria-valuenow={index + 1}
            aria-valuetext={`${dayLabel(active.time)}, ${active.mb} MB`}
            onPointerDown={pick}
            onPointerMove={(e) => {
              if (e.pointerType === 'mouse' || e.buttons) pick(e);
            }}
            onPointerLeave={() => setReading(false)}
            onKeyDown={key}
            onBlur={() => setReading(false)}
          >
            <svg viewBox="0 0 1000 200" preserveAspectRatio="none" aria-hidden="true">
              {[150, 350, 550, 750, 950].map((n) => (
                <path key={n} className="signal-guide" d={`M${n} 0V200`} />
              ))}
              <path className="signal-line" d={path} />
            </svg>
            <i
              className="signal-point"
              style={{ left: '100%', top: `${((hi - rows[last].mb) / (hi - lo)) * 100}%` }}
            />
            {reading && <i className="signal-point is-reading" style={{ left: `${x}%`, top: `${y}%` }} />}
            {reading && (
              <span
                className="signal-readout"
                aria-hidden="true"
                style={{
                  left: `clamp(0px,calc(${x}% - 42px),calc(100% - 84px))`,
                  top: `clamp(0px,calc(${y}% - 42px),calc(100% - 38px))`,
                }}
              >
                {dayLabel(active.time)}
                <b>{active.mb} MB</b>
              </span>
            )}
          </div>
          <TimeRail rows={rows} selected={index} />
        </div>
        <div className="signal-scale" aria-hidden="true">
          <span>{hi}</span>
          <span>{(hi + lo) / 2}</span>
          <span>{lo}</span>
        </div>
      </div>
      <footer className="signal-foot">
        <span>
          <Radio size={12} /> ROLLING 24H
        </span>
        <time>{dateRange(period)}</time>
      </footer>
    </section>
  );
}
