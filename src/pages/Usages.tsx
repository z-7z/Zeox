import { useState } from 'react';
import { ArrowDownToLine, ArrowUpRight, ChartNoAxesColumnIncreasing, ListOrdered, ListFilter, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PanelHeader } from '../components/workspace/PanelHeader';
import { operationLabels, useUsage, type Operation } from '../components/workspace/UsageSession';
import { formatSize } from '../lib/vault/container';
import { downloadText } from '../lib/download';
import '../components/usage/report.css';

export function Usages() {
  const usage = useUsage();
  const [filter, setFilter] = useState<'all' | 'compact' | 'vault'>('all'), [confirm, setConfirm] = useState(false);
  const rows = usage.recent.filter(r => filter === 'all' || (filter === 'compact' ? r.operation === 'compact' : r.operation !== 'compact'));
  function exportRows() {
    downloadText('zeox-session-usage.csv', 'text/csv;charset=utf-8', ['Time (UTC),Operation,Input bytes,Output bytes', ...rows.map(r => `${new Date(r.time).toISOString()},${operationLabels[r.operation]},${r.input},${r.output}`)].join('\r\n') + '\r\n');
  }
  const stats = [['Completed runs', String(usage.count)], ['Data processed', formatSize(usage.input)], ['Data generated', formatSize(usage.output)]];
  return <div className="ws-pair-grid">
    <section className="glass-card usage-totals" aria-labelledby="totals-title">
      <PanelHeader id="totals-title" title="Session totals" icon={ChartNoAxesColumnIncreasing} meta="This tab" bar>
        <button className="ws-button" onClick={() => setConfirm(true)} disabled={!usage.count || confirm}><RotateCcw size={13} />Reset</button>
      </PanelHeader>
      <div className="usage-metrics">{stats.map(([name, value]) => <section key={name} aria-label={name}><strong>{value}</strong><h3>{name}</h3></section>)}</div>
      {confirm ? <div className="usage-confirm" role="group" aria-label="Confirm usage reset"><p>Clear counters and the log? Your files are unaffected.</p>
        <button className="ws-button" onClick={() => setConfirm(false)}>Cancel</button><button className="ws-button ws-primary" onClick={() => { usage.clear(); setConfirm(false); setFilter('all'); }}>Clear usage</button></div>
        : <p className="usage-note">Successful operations since the last reset. Totals clear on refresh.</p>}
    </section>
    <section className="glass-card panel-inset usage-mix" aria-labelledby="mix-title">
      <PanelHeader id="mix-title" title="By operation" icon={ListFilter} meta="Completed runs" />
      <ul>{(Object.keys(operationLabels) as Operation[]).map((op, i) => <li key={op}><div>{operationLabels[op]}<b>{usage.byTool[op]}</b></div>
        <span className="segment-track" aria-hidden="true"><span style={{ width: `${usage.count ? usage.byTool[op] / usage.count * 100 : 0}%`, opacity: 1 - i * .22 }} /></span></li>)}</ul>
    </section>
    <section className="glass-card ws-full-row usage-ledger" aria-labelledby="ledger-title">
      <PanelHeader id="ledger-title" title="Activity ledger" icon={ListOrdered} bar>
        <select className="ws-button usage-filter" aria-label="Filter usage log" value={filter} onChange={e => setFilter(e.target.value as typeof filter)}>
          <option value="all">All tools</option><option value="compact">Obfuscate</option><option value="vault">Vault</option></select>
        <button className="ws-button" onClick={exportRows} disabled={!rows.length}><ArrowDownToLine size={13} />Export log</button>
      </PanelHeader>
      {rows.length > 0 && <div className="usage-table-wrap"><table><thead><tr><th scope="col">Operation</th><th scope="col">Input</th><th scope="col">Output</th><th scope="col">Local time</th></tr></thead>
        <tbody>{rows.map(r => <tr key={r.id}><th scope="row">{operationLabels[r.operation]}</th><td>{formatSize(r.input)}</td><td>{formatSize(r.output)}</td><td><time dateTime={new Date(r.time).toISOString()}>{new Date(r.time).toLocaleTimeString('en-GB')}</time></td></tr>)}</tbody></table></div>}
      {!rows.length && <div className="usage-empty"><strong>{usage.count ? 'No matching operations' : 'No usage yet'}</strong>
        <p>{usage.count ? 'Select another tool to see its runs.' : 'Completed builds and file operations appear here.'}</p>
        {!usage.count && <div><Link className="ws-button" to="/obfuscate">Obfuscate file <ArrowUpRight size={12} /></Link><Link className="ws-button" to="/vault">Open Vault <ArrowUpRight size={12} /></Link></div>}</div>}
      <footer>Last 50 runs · No filenames or contents recorded</footer>
    </section>
  </div>;
}
