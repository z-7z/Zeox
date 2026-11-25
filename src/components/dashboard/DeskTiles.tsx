import { useId } from 'react';
import {
  Activity,
  ArrowDownToLine,
  ArrowUpRight,
  Box,
  Boxes,
  Braces,
  ChartColumn,
  FileBox,
  FolderLock,
  Layers3,
  ListFilter,
  Orbit,
  PackageOpen,
  SlidersHorizontal,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { operationLabels, useUsage } from '../workspace/UsageSession';
import { formatSize } from '../../lib/vault/container';
import { dayLabel } from './period';
import { number, type Report } from './sample';
import type { Inspect } from './ChartDetail';

// The fill is part of the data series, not a glass overlay or background animation.
function Area({ values, tone }: { values: number[]; tone: 'green' | 'red' }) {
  const id = useId().replace(/:/g, ''),
    min = Math.min(...values),
    span = Math.max(...values) - min || 1;
  const points = values.map((v, i) => [(i / (values.length - 1)) * 300, 70 - ((v - min) / span) * 39]);
  const line = points.reduce((d, [x, y], i) => {
    if (!i) return `M${x} ${y}`;
    const [px, py] = points[i - 1],
      mid = (px + x) / 2;
    return `${d} C${mid} ${py} ${mid} ${y} ${x} ${y}`;
  }, '');
  return (
    <svg className={`area-ink ink-${tone}`} viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop stopColor={tone === 'green' ? '#29ed65' : '#c52725'} stopOpacity={tone === 'green' ? 0 : 1} />
          <stop offset="1" stopColor={tone === 'green' ? '#22d651' : '#281315'} />
        </linearGradient>
      </defs>
      <path d={`${line} V${tone === 'green' ? 0 : 100}H0Z`} fill={`url(#${id})`} />
      <path
        d={line}
        fill="none"
        stroke={tone === 'green' ? '#64f66a' : '#fe5954'}
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
const batchIcons = [Layers3, Boxes, Box, FileBox];
export function BatchTape({ report, inspect }: { report: Report; inspect: Inspect }) {
  return (
    <section className="ws-panel batch-tape" aria-label="Recent sample batches">
      <header className="card-heading">
        <h2>
          Recent
          <br />
          batches
        </h2>
        <button
          className="tiny-button"
          onClick={() => inspect('volume', report.rows.length - 1)}
          aria-label="View batch history"
          title="View batch history"
        >
          <ListFilter size={16} />
        </button>
      </header>
      <strong className="tape-total">
        {number(report.current.files)}
        <small> files</small>
      </strong>
      <p className="subcopy">{(report.current.files / report.period).toFixed(1)} files / day</p>
      <ol className="batch-list">
        {report.rows
          .slice(-4)
          .reverse()
          .map((r, i) => {
            const Icon = batchIcons[i],
              row = report.rows.length - 1 - i;
            return (
              <li key={r.time}>
                <button onClick={() => inspect('volume', row)}>
                  <span className="db-sr">Inspect</span>
                  <i className={`asset-mark asset-${i}`}>
                    <Icon size={18} />
                  </i>
                  <span>
                    {dayLabel(r.time)}
                    <small>Batch {String(row + 1).padStart(2, '0')}</small>
                  </span>
                  <i aria-hidden="true" className="batch-wire" />
                  <b>
                    {r.mb} MB<small>{r.files} files</small>
                  </b>
                </button>
              </li>
            );
          })}
      </ol>
    </section>
  );
}
export function Launcher({ download }: { download: () => void }) {
  return (
    <section className="ws-panel desk-launch" aria-label="Quick actions">
      <div className="launch-buttons">
        <Link to="/obfuscate" aria-label="Build — obfuscate file">
          <Braces />
          Build
        </Link>
        <Link to="/vault" aria-label="Open Vault">
          <FolderLock />
          Vault
        </Link>
        <Link to="/usages" aria-label="View usages">
          <ChartColumn />
          Usages
        </Link>
        <button onClick={download} aria-label="Download skeleton">
          <ArrowDownToLine />
          Skeleton
        </button>
      </div>
      <div className="dock-id">
        <span>DESK / 01</span>
        <i />
      </div>
    </section>
  );
}
export function YieldCard({ report }: { report: Report }) {
  const rate = (report.current.saved / report.current.files) * 100;
  return (
    <section className="ws-panel yield-card mint-card" aria-label="Saved outputs">
      <ArrowUpRight className="card-watermark" aria-hidden="true" />
      <div className="yield-copy">
        <h2>Saved outputs</h2>
        <strong>
          {number(report.current.saved)}
          <small> files</small>
        </strong>
        <p>{rate.toFixed(1)}% export rate</p>
      </div>
      <Area tone="green" values={report.rows.map((r) => r.saved / r.files)} />
      <div className="spark-dates">
        <span>{dayLabel(report.rows[0].time)}</span>
        <span>{dayLabel(report.rows[report.period - 1].time)}</span>
      </div>
    </section>
  );
}
export function LossCard({ report }: { report: Report }) {
  const missing = report.current.files - report.current.saved;
  return (
    <section className="ws-panel loss-card" aria-label="Unsaved outputs">
      <div className="loss-ticket">
        <span>
          <PackageOpen size={14} /> OUTPUT / LOG
        </span>
        <div>
          <h2>Not exported</h2>
          <strong>
            {number(missing)}
            <small> files</small>
          </strong>
        </div>
      </div>
      <div className="loss-chart">
        <span className="red-tag">{((missing / report.current.files) * 100).toFixed(1)}%</span>
        <Area tone="red" values={report.rows.map((r) => r.files - r.saved)} />
      </div>
    </section>
  );
}
export function MixIndex({ report, inspect }: { report: Report; inspect: Inspect }) {
  const share = report.operations[0].value / report.current.files;
  return (
    <section className="ws-panel mix-index" aria-label="Operation mix">
      <header className="mini-head">
        <h2>Build index</h2>
        <button aria-label="Details" title="Operation mix details" onClick={() => inspect('operations')}>
          <SlidersHorizontal size={14} />
        </button>
      </header>
      <small>Share of operations</small>
      <svg className="dot-index" aria-hidden="true">
        {[0.44, 0.72, 1].map((scale, ring) =>
          Array.from({ length: 5 + ring * 2 }, (_, i) => {
            const angle = Math.PI * (1 - i / (4 + ring * 2)),
              active = ring === 2 && i === Math.round(share * 8);
            return (
              <circle
                key={`${ring}-${i}`}
                cx={`${50 + Math.cos(angle) * 43 * scale}%`}
                cy={`${87 - Math.sin(angle) * 73 * scale}%`}
                r={active ? 6 : ring === 2 ? 4.5 : 2.5}
                fill={active ? '#ff802d' : (i + ring) % 3 ? '#464648' : '#2b2b2d'}
              />
            );
          }),
        )}
      </svg>
      <footer className="index-key">
        <span>LOW</span>
        <b>{(share * 100).toFixed(1)}%</b>
        <span>HIGH</span>
      </footer>
    </section>
  );
}
export function SessionTile() {
  const { count, recent } = useUsage();
  return (
    <section className="ws-panel live-tile" aria-label="Session summary">
      <header className="mini-head">
        <h2>
          <Orbit size={14} /> This session
        </h2>
        <Link to="/usages" title="View report" aria-label="View report">
          <ArrowUpRight size={14} />
        </Link>
      </header>
      <small>Local ledger</small>
      <strong>
        {number(count)} <small>{count === 1 ? 'run' : 'runs'}</small>
      </strong>
      {count ? (
        <ol className="local-runs" aria-label="Recent runs">
          {recent.slice(0, 3).map((r) => (
            <li key={r.id}>
              <span>{operationLabels[r.operation]}</span>
              <small>{formatSize(r.input)}</small>
            </li>
          ))}
        </ol>
      ) : (
        <span className="session-wait">No runs yet</span>
      )}
      <div className="session-meter" title={`${recent.length} of 50 ledger slots used`} aria-hidden="true">
        <i style={{ left: `${(recent.length / 50) * 100}%` }} />
      </div>
    </section>
  );
}
export function FormatBars({ report, inspect }: { report: Report; inspect: Inspect }) {
  const peak = Math.max(...report.formats.map((f) => f.value));
  return (
    <section className="ws-panel format-bars" aria-label="File distribution">
      <header className="format-head">
        <button
          className="asset-mark"
          title="View breakdown"
          aria-label="View breakdown"
          onClick={() => inspect('formats')}
        >
          <Activity size={18} />
        </button>
        <div>
          <h2>File distribution</h2>
          <small>Files by format</small>
        </div>
        <div className="format-stat">
          <strong>{(report.current.mb / report.current.files).toFixed(2)} MB</strong>
          <span>avg. input</span>
        </div>
      </header>
      <div className="bar-columns">
        {[1, 4, 0, 2, 3].map((i) => {
          const f = report.formats[i];
          return (
            <button
              key={f.label}
              onClick={() => inspect('formats', i)}
            >
              <span className="db-sr">Inspect </span>
              <span className="bar-field">
                <i style={{ height: `${(f.value / peak) * 78}%` }}>
                  <small>{f.label}</small>
                </i>
              </span>
              {' '}<b>{number(f.value)}<span className="db-sr"> files</span></b>
            </button>
          );
        })}
      </div>
    </section>
  );
}
