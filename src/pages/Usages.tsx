import { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowDownToLine,
  ArrowUpRight,
  Braces,
  Database,
  ListOrdered,
  LockKeyhole,
  RotateCcw,
  UnlockKeyhole,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PanelHeader } from '../components/workspace/PanelHeader';
import { operationLabels, useUsage, type Operation, type UsageRow } from '../components/workspace/UsageSession';
import { formatSize } from '../lib/vault/container';
import { downloadText } from '../lib/download';
import '../components/usage/report.css';

function RunChart({ recent }: { recent: UsageRow[] }) {
  const runs = recent.slice(0, 16).reverse(),
    peak = Math.max(1, ...runs.flatMap((r) => [r.input, r.output]));
  return (
    <div
      className="run-chart"
      role="img"
      aria-label={
        runs.length
          ? `Input and output sizes for the last ${runs.length} runs; largest ${formatSize(peak)}`
          : 'No completed operations in this tab'
      }
    >
      <svg viewBox="0 0 640 120" preserveAspectRatio="none" aria-hidden="true">
        {[0, 80, 160, 240, 320, 400, 480, 560, 640].map((x) => (
          <path key={x} d={`M${x} 0v120`} stroke="#303032" vectorEffect="non-scaling-stroke" />
        ))}
        {runs.map((r, i) => (
          <g key={r.id}>
            <rect
              x={i * 40 + 5}
              y={120 - (r.input / peak) * 110}
              width="11"
              height={(r.input / peak) * 110}
              fill="#dededb"
            />
            <rect
              x={i * 40 + 18}
              y={120 - (r.output / peak) * 110}
              width="11"
              height={(r.output / peak) * 110}
              fill="#eb893f"
            />
          </g>
        ))}
        <path d="M0 119h640" stroke="#5b5551" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
      </svg>
      {!runs.length && <span>Waiting for the first run</span>}
    </div>
  );
}
const icons = { compact: Braces, encrypt: LockKeyhole, decrypt: UnlockKeyhole };
export function Usages() {
  const usage = useUsage(),
    [filter, setFilter] = useState<'all' | 'compact' | 'vault'>('all'),
    [confirm, setConfirm] = useState(false);
  const rows = usage.recent.filter(
    (r) => filter === 'all' || (filter === 'compact' ? r.operation === 'compact' : r.operation !== 'compact'),
  );
  function exportRows() {
    downloadText(
      'zeox-session-usage.csv',
      'text/csv;charset=utf-8',
      [
        'Time (UTC),Operation,Input bytes,Output bytes',
        ...rows.map(
          (r) => `${new Date(r.time).toISOString()},${operationLabels[r.operation]},${r.input},${r.output}`,
        ),
      ].join('\r\n') + '\r\n',
    );
  }
  return (
    <div className="ledger-board">
      <section className="ws-panel usage-totals">
        <header className="station-head">
          <div>
            <small className="eyebrow">TELEMETRY / THIS TAB</small>
            <h2>Session activity</h2>
          </div>
          <button
            className="tiny-button"
            disabled={!usage.count || confirm}
            onClick={() => setConfirm(true)}
            title="Reset usage"
            aria-label="Reset"
          >
            <RotateCcw size={15} />
          </button>
        </header>
        <div className="run-count" role="region" aria-label="Completed runs">
          <strong>{usage.count}</strong>
          <span>completed runs</span>
        </div>
        <RunChart recent={usage.recent} />
        <div className="run-key">
          <span>Input</span>
          <span>Output</span>
          <small>Last 16 runs</small>
        </div>
        {confirm && (
          <div className="usage-confirm" role="group" aria-label="Confirm usage reset">
            <p>Clear counters and the log? Your files are unaffected.</p>
            <button className="ws-quiet" onClick={() => setConfirm(false)}>
              Cancel
            </button>
            <button
              className="ws-button"
              onClick={() => {
                usage.clear();
                setConfirm(false);
                setFilter('all');
              }}
            >
              Clear usage
            </button>
          </div>
        )}
      </section>
      <section className="ws-panel usage-mix">
        <small className="eyebrow">OPERATION FLOW</small>
        <h2>By operation</h2>
        <ul>
          {(Object.keys(operationLabels) as Operation[]).map((op, i) => {
            const Icon = icons[op],
              count = usage.byTool[op];
            return (
              <li key={op}>
                <i className={`operation-icon op-${i}`}>
                  <Icon size={17} />
                </i>
                <span>
                  {operationLabels[op]}
                  <b>
                    <i style={{ width: `${usage.count ? (count / usage.count) * 100 : 0}%` }} />
                  </b>
                </span>
                <strong>{count}</strong>
              </li>
            );
          })}
        </ul>
      </section>
      <section className="ws-panel usage-in mint-card" aria-label="Data processed">
        <ArrowUpRight className="card-watermark" />
        <h2>Data processed</h2>
        <strong>{formatSize(usage.input)}</strong>
        <small>Input / this tab</small>
      </section>
      <section className="ws-panel usage-out" aria-label="Data generated">
        <ArrowDownLeft size={16} />
        <h2>Data generated</h2>
        <strong>{formatSize(usage.output)}</strong>
      </section>
      <section className="ws-panel usage-ledger" aria-labelledby="ledger-title">
        <PanelHeader id="ledger-title" title="Activity ledger" icon={ListOrdered}>
          <select
            className="ws-button"
            aria-label="Filter usage log"
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
          >
            <option value="all">All tools</option>
            <option value="compact">Obfuscate</option>
            <option value="vault">Vault</option>
          </select>
          <button className="ws-button" disabled={!rows.length} onClick={exportRows}>
            <ArrowDownToLine size={13} />
            Export log
          </button>
        </PanelHeader>
        {rows.length ? (
          <div className="usage-table-wrap" tabIndex={0} role="region" aria-label="Log entries">
            <table>
              <thead>
                <tr>
                  {['Operation', 'Input', 'Output', 'Local time'].map((s) => (
                    <th key={s} scope="col">
                      {s}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <th scope="row">{operationLabels[r.operation]}</th>
                    <td>{formatSize(r.input)}</td>
                    <td>{formatSize(r.output)}</td>
                    <td>
                      <time dateTime={new Date(r.time).toISOString()}>
                        {new Date(r.time).toLocaleTimeString('en-GB')}
                      </time>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="usage-empty">
            <Database size={22} />
            <strong>{usage.count ? 'No matching operations' : 'No usage yet'}</strong>
            <p>
              {usage.count
                ? 'Select another tool to see its runs.'
                : 'Build a script or process a file to start the ledger.'}
            </p>
            {!usage.count && (
              <div>
                <Link className="ws-button" to="/obfuscate">
                  Obfuscate file <ArrowUpRight size={12} />
                </Link>
                <Link className="ws-button" to="/vault">
                  Open Vault <ArrowUpRight size={12} />
                </Link>
              </div>
            )}
          </div>
        )}
        <footer>Last 50 runs · No filenames or contents recorded</footer>
      </section>
    </div>
  );
}
