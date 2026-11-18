import { useState } from 'react';
import { Activity, ArrowDownLeft, ArrowDownToLine, ArrowUpRight, Braces, Clock3, Layers, ListFilter, LockKeyhole, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeading } from '../components/workspace/PageHeading';
import { MotionGrid } from '../components/workspace/motion';
import { useWorkspacePage } from '../components/workspace/WorkspaceLayout';
import { operationLabels, useUsage, type Operation } from '../components/workspace/UsageSession';
import { formatSize } from '../lib/vault/container';
import { downloadText } from '../components/dashboard/downloads';

export function Usages() {
  const usage = useUsage(), { motion } = useWorkspacePage();
  const [filter, setFilter] = useState<'all' | 'compact' | 'vault'>('all'), [confirm, setConfirm] = useState(false);
  const rows = usage.recent.filter(r => filter === 'all' || (filter === 'compact' ? r.operation === 'compact' : r.operation !== 'compact'));
  function exportRows() {
    downloadText('zeox-session-usage.csv', 'text/csv;charset=utf-8', ['Time (UTC),Operation,Input bytes,Output bytes', ...rows.map(r => `${new Date(r.time).toISOString()},${operationLabels[r.operation]},${r.input},${r.output}`)].join('\r\n') + '\r\n');
  }
  const stats = [ { name: 'Completed runs', value: String(usage.count), icon: Activity, note: 'Successful tool operations' },
    { name: 'Data processed', value: formatSize(usage.input), icon: ArrowDownLeft, note: 'Total input across tools' },
    { name: 'Data generated', value: formatSize(usage.output), icon: ArrowUpRight, note: 'Total output across tools' } ];
  return <><PageHeading title="Usages" eyebrow="Local activity" badge="This session" actions={<>
    <button className="ws-button" onClick={() => setConfirm(true)} disabled={!usage.count}><RotateCcw size={13} />Reset</button>
    <button className="ws-button" onClick={exportRows} disabled={!rows.length}><ArrowDownToLine size={14} />Export log</button></>} />
    {confirm && <div className="ws-reset-confirm" role="group" aria-label="Confirm usage reset"><p>Clear this session’s counters and usage log? Your files are unaffected.</p><button className="ws-button" onClick={() => setConfirm(false)}>Cancel</button><button className="ws-button ws-primary" onClick={() => { usage.clear(); setConfirm(false); setFilter('all'); }}>Clear usage</button></div>}
    <MotionGrid enabled={motion} className="ws-usage-stats">{stats.map(({ name, value, icon: Icon, note }) => <section key={name} className="db-card ws-usage-stat" aria-label={name}>
      <h2><Icon size={15} />{name}</h2><strong>{value}</strong><p>{note}</p></section>)}</MotionGrid>
    <div className="ws-usage-detail"><section className="db-card ws-breakdown"><h2><Layers size={16} />By operation</h2><p>Share of completed runs</p>
      <ul>{(Object.keys(operationLabels) as Operation[]).map((op, i) => <li key={op}><div><span><i style={{ opacity: 1 - i * .25 }} />{operationLabels[op]}</span><b>{usage.byTool[op]}</b></div>
        <span className="ws-meter"><i style={{ width: `${usage.count ? usage.byTool[op] / usage.count * 100 : 0}%`, opacity: 1 - i * .25 }} /></span></li>)}</ul></section>
      <section className="db-card ws-ledger"><header><h2><Clock3 size={16} />Activity ledger</h2><label><ListFilter size={13} /><select aria-label="Filter usage log" value={filter} onChange={e => setFilter(e.target.value as typeof filter)}><option value="all">All tools</option><option value="compact">Obfuscate</option><option value="vault">Vault</option></select></label></header>
      {rows.length ? <div className="ws-table-wrap"><table><thead><tr><th>Operation</th><th>Input</th><th>Output</th><th>Local time</th></tr></thead><tbody>{rows.map(r => <tr key={r.id}><th scope="row">{operationLabels[r.operation]}</th><td>{formatSize(r.input)}</td><td>{formatSize(r.output)}</td><td><time dateTime={new Date(r.time).toISOString()}>{new Date(r.time).toLocaleTimeString('en-GB')}</time></td></tr>)}</tbody></table></div>
        : <div className="ws-ledger-empty"><span className="ws-empty-mark"><Activity size={22} /></span><strong>{usage.count ? 'No matching operations' : 'No usage yet'}</strong><p>{usage.count ? 'Choose another tool filter to see its runs.' : 'Build source or process a file to start your session ledger.'}</p>
          {!usage.count && <div><Link className="ws-button" to="/obfuscate"><Braces size={13} />Obfuscate</Link><Link className="ws-button" to="/vault"><LockKeyhole size={13} />Vault</Link></div>}</div>}
      <footer>Last 50 runs · No filenames or contents are recorded</footer></section></div>
    <p className="ws-build-status">Totals cover this browser session, not account quotas. Refreshing the page resets them.</p>
  </>;
}
