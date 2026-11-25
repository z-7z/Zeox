import { useState } from 'react';
import { operationLabels, useUsage, type Operation } from '../components/workspace/UsageSession';
import { downloadText } from '../lib/download';
import { formatSize } from '../lib/vault/container';

export function Usages() {
  const usage = useUsage();
  const [filter, setFilter] = useState('all'), [confirm, setConfirm] = useState(false);
  const rows = usage.recent.filter(r => filter === 'all' || (filter === 'compact' ? r.operation === 'compact' : r.operation !== 'compact'));
  function exportRows() {
    const lines = ['Time (UTC),Operation,Input bytes,Output bytes', ...rows.map(r =>
      `${new Date(r.time).toISOString()},${operationLabels[r.operation]},${r.input},${r.output}`)];
    downloadText('zeox-session-usage.csv', 'text/csv;charset=utf-8', lines.join('\r\n') + '\r\n');
  }
  return <>
    <h1>Usages</h1>
    <section aria-label="Completed runs"><p>Completed runs: <strong>{usage.count}</strong>. Input: {formatSize(usage.input)}. Output: {formatSize(usage.output)}.</p></section>
    <ul>{(Object.keys(operationLabels) as Operation[]).map(op => <li key={op}>{operationLabels[op]}: {usage.byTool[op]}</li>)}</ul>
    <label>Filter usage log <select value={filter} onChange={e => setFilter(e.target.value)}>
      <option value="all">All tools</option><option value="compact">Obfuscator</option><option value="vault">Vault</option>
    </select></label>{' '}
    <button type="button" disabled={!rows.length} onClick={exportRows}>Export log</button>{' '}
    <button type="button" disabled={!usage.count || confirm} onClick={() => setConfirm(true)}>Reset</button>
    {confirm && <p>Clear the counters and log? This does not remove any files.{' '}
      <button type="button" onClick={() => setConfirm(false)}>Cancel</button>{' '}
      <button type="button" onClick={() => { usage.clear(); setFilter('all'); setConfirm(false); }}>Clear usage</button></p>}
    {rows.length ? <table><caption>Recent runs</caption>
      <thead><tr>{['Operation', 'Input', 'Output', 'Local time'].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead>
      <tbody>{rows.map(r => <tr key={r.id}><th scope="row">{operationLabels[r.operation]}</th>
        <td>{formatSize(r.input)}</td><td>{formatSize(r.output)}</td>
        <td><time dateTime={new Date(r.time).toISOString()}>{new Date(r.time).toLocaleTimeString('en-GB')}</time></td></tr>)}</tbody>
    </table> : <p>{usage.count ? 'No matching operations' : 'No usage yet'}</p>}
    <p>The log keeps the last 50 completed runs in this tab, without filenames or contents.</p>
  </>;
}
