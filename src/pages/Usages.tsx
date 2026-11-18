import { useState } from 'react';
import { ArrowDownToLine, ArrowUpRight, ChartNoAxesColumnIncreasing, ListFilter, ListOrdered, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeading } from '../components/workspace/PageHeading';
import { operationLabels, useUsage, type Operation } from '../components/workspace/UsageSession';
import { formatSize } from '../lib/vault/container';
import { downloadText } from '../components/dashboard/downloads';
import '../components/usage/report.css';

export function Usages() {
  const usage = useUsage();
  const [filter, setFilter] = useState<'all' | 'compact' | 'vault'>('all'), [confirm, setConfirm] = useState(false);
  const rows = usage.recent.filter(r => filter === 'all' || (filter === 'compact' ? r.operation === 'compact' : r.operation !== 'compact'));
  function exportRows() {
    downloadText('zeox-session-usage.csv', 'text/csv;charset=utf-8', ['Time (UTC),Operation,Input bytes,Output bytes', ...rows.map(r => `${new Date(r.time).toISOString()},${operationLabels[r.operation]},${r.input},${r.output}`)].join('\r\n') + '\r\n');
  }
  const stats = [['Completed runs', String(usage.count)], ['Data processed', formatSize(usage.input)], ['Data generated', formatSize(usage.output)]];
  return <div className="usage-report">
    <PageHeading title="Usages" eyebrow="Session report" description="A record of the work completed in this browser session." actions={<button className="ws-button" onClick={() => setConfirm(true)} disabled={!usage.count}><RotateCcw size={13} />Reset</button>} />
    {confirm && <div className="usage-confirm" role="group" aria-label="Confirm usage reset"><p>Clear these counters and the usage log? Your files are unaffected.</p>
      <button className="ws-button" onClick={() => setConfirm(false)}>Cancel</button><button className="ws-button ws-primary" onClick={() => { usage.clear(); setConfirm(false); setFilter('all'); }}>Clear usage</button></div>}
    <div className="usage-totals"><div className="usage-totals-head"><span><ChartNoAxesColumnIncreasing size={13} />Session totals</span><small>Since last reset</small></div>
      <div className="usage-metrics">{stats.map(([name, value]) => <section key={name} aria-label={name}><h2>{name}</h2><strong>{value}</strong></section>)}</div></div>
    <div className="usage-columns">
      <section className="db-card usage-ledger" aria-labelledby="ledger-title"><header><h2 id="ledger-title"><ListOrdered size={16} />Activity ledger</h2>
        <div className="usage-controls"><label><ListFilter size={13} /><select aria-label="Filter usage log" value={filter} onChange={e => setFilter(e.target.value as typeof filter)}>
          <option value="all">All tools</option><option value="compact">Obfuscate</option><option value="vault">Vault</option></select></label>
          <button className="ws-button" onClick={exportRows} disabled={!rows.length}><ArrowDownToLine size={13} />Export log</button></div></header>
        <div className="usage-table-wrap"><table><thead><tr><th scope="col">Operation</th><th scope="col">Input</th><th scope="col">Output</th><th scope="col">Local time</th></tr></thead>
          <tbody>{rows.map(r => <tr key={r.id}><th scope="row">{operationLabels[r.operation]}</th><td>{formatSize(r.input)}</td><td>{formatSize(r.output)}</td><td><time dateTime={new Date(r.time).toISOString()}>{new Date(r.time).toLocaleTimeString('en-GB')}</time></td></tr>)}</tbody></table></div>
        {!rows.length && <div className="usage-empty"><strong>{usage.count ? 'No matching operations' : 'No usage yet'}</strong>
          <p>{usage.count ? 'Select another tool to see its runs.' : 'Completed builds and file operations appear here.'}</p>
          {!usage.count && <div><Link to="/obfuscate">Build source <ArrowUpRight size={12} /></Link><Link to="/vault">Open Vault <ArrowUpRight size={12} /></Link></div>}</div>}
        <footer>Last 50 runs · No filenames or contents recorded</footer>
      </section>
      <section className="db-card usage-mix" aria-labelledby="mix-title"><h2 id="mix-title">By operation</h2><p>Share of completed runs</p>
        <ul>{(Object.keys(operationLabels) as Operation[]).map((op, i) => <li key={op}><div><span>{operationLabels[op]}</span><b>{usage.byTool[op]}</b></div>
          <span className="usage-meter" aria-hidden="true"><i style={{ width: `${usage.count ? usage.byTool[op] / usage.count * 100 : 0}%`, opacity: 1 - i * .22 }} /></span></li>)}</ul>
      </section>
    </div><p className="usage-note">These are session totals, not account quotas. Refreshing the page resets them.</p>
  </div>;
}
