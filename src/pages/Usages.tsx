import { useState } from 'react';
import { Activity, ArrowUpRight, ListFilter, RotateCcw } from 'lucide-react';
import { operationLabels, useUsage } from '../components/workspace/UsageSession';
import { BarPanel, type BarDatum } from '../components/orbit/BarPanel';
import { Dialog } from '../components/orbit/Dialog';
import { CardTitle, PageTitle, Ribbon, SplitFace } from '../components/orbit/Panels';
import { downloadText } from '../lib/download';
import { formatSize } from '../lib/vault/container';

import { Choice } from '../components/ui/Choice';

const runFilters = [
  { value: 'all', label: 'All runs' },
  { value: 'compact', label: 'Script builds' },
  { value: 'vault', label: 'Archive runs' },
] as const;
const localTime = (time: number) => new Date(time).toLocaleTimeString('en-GB');
export function Usages() {
  const usage = useUsage();
  const [filter, setFilter] = useState('all'),
    [confirm, setConfirm] = useState(false);
  const rows = usage.recent.filter(
    (r) => filter === 'all' || (filter === 'compact' ? r.operation === 'compact' : r.operation !== 'compact'),
  );
  const bars: BarDatum[] = rows
    .slice(0, 9)
    .reverse()
    .map((r) => ({
      key: String(r.id),
      tick: String(r.id),
      name: `Run ${r.id} · ${localTime(r.time)}`,
      value: r.output,
      facts: [
        ['Operation', operationLabels[r.operation]],
        ['Input', formatSize(r.input)],
        ['Output', formatSize(r.output)],
      ],
    }));
  function exportRows() {
    const lines = [
      'Time (UTC),Operation,Input bytes,Output bytes',
      ...rows.map((r) => `${new Date(r.time).toISOString()},${operationLabels[r.operation]},${r.input},${r.output}`),
    ];
    downloadText('zeoxfucator-session-usage.csv', 'text/csv;charset=utf-8', lines.join('\r\n') + '\r\n');
  }
  return (
    <>
      <PageTitle title="Usages" kicker="Session overview">
        <button
          className="round"
          type="button"
          aria-label="Reset"
          title="Reset usage"
          disabled={!usage.count}
          onClick={() => setConfirm(true)}
        >
          <RotateCcw aria-hidden="true" />
        </button>
        <button type="button" className="split-action" disabled={!rows.length} onClick={exportRows}>
          <SplitFace>Export log</SplitFace>
        </button>
      </PageTitle>
      <div className="desk-grid">
        <section className="card metric-card" aria-label="Completed runs">
          <CardTitle title="Completed runs">
            <span className="paper tag">Live</span>
          </CardTitle>
          <div className="file-value">
            <strong className="metric-value">{usage.count}</strong>
            <span className="gain">
              <ArrowUpRight aria-hidden="true" />
              This tab
            </span>
          </div>
          <p className="file-foot">Successful operations since opening</p>
        </section>
        <Ribbon
          title="Session breakdown"
          metrics={[
            [formatSize(usage.input), 'in'],
            [formatSize(usage.output), 'out'],
          ]}
          steps={[
            { label: 'Source build', caption: `${usage.byTool.compact} built` },
            { label: 'Encryption', caption: `${usage.byTool.encrypt} sealed` },
            { label: 'Decryption', caption: `${usage.byTool.decrypt} restored` },
          ]}
          current={usage.recent[0] ? ['compact', 'encrypt', 'decrypt'].indexOf(usage.recent[0].operation) : -1}
          marker="Latest"
        />
        <BarPanel
          title="Output size breakdown"
          context="Latest nine matching runs · Output bytes"
          rows={bars}
          detail="Run reading"
          empty={usage.count ? 'No operations match this filter.' : 'Obfuscate a script to see its output size here.'}
        />
        <section className="card ledger-card" aria-label="Usage ledger">
          <CardTitle title="Activity ledger">
            <Choice label="Filter usage log" value={filter} options={runFilters} change={setFilter} icon={ListFilter} />
          </CardTitle>
          {rows.length ? (
            <div className="log-scroll" role="region" aria-label="Recent runs" tabIndex={0}>
              <table>
                <caption className="sr-only">Recent runs</caption>
                <thead>
                  <tr>
                    {['Operation', 'Input', 'Output', 'Local time'].map((label) => (
                      <th scope="col" key={label}>
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <th scope="row">{operationLabels[r.operation]}</th>
                      <td>{formatSize(r.input)}</td>
                      <td className="tint">{formatSize(r.output)}</td>
                      <td>
                        <time dateTime={new Date(r.time).toISOString()}>{localTime(r.time)}</time>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <Activity aria-hidden="true" />
              <h3>{usage.count ? 'No matching operations' : 'No usage yet'}</h3>
              <p>This ledger records successful runs only.</p>
            </div>
          )}
          <p className="table-foot">Last 50 runs · No filenames or contents</p>
        </section>
      </div>
      {confirm && (
        <Dialog title="Clear usage?" close={() => setConfirm(false)}>
          <p>Clear the counters and log for this tab? This does not remove files or downloads.</p>
          <div className="button-row">
            <button type="button" className="pill" data-first onClick={() => setConfirm(false)}>
              Cancel
            </button>
            <button
              type="button"
              className="pill paper"
              onClick={() => {
                usage.clear();
                setFilter('all');
                setConfirm(false);
              }}
            >
              Clear usage
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
}
