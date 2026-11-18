import type { CSSProperties } from 'react';
import { Activity, ArrowDownToLine, ArrowRight, ArrowUpRight, ChartNoAxesColumn, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import brackets from '../assets/source/glass-code.webp';
import stack from '../assets/vault/vault-core.webp';
import { downloadSkeleton } from '../components/dashboard/Skeleton';
import { PageHeading } from '../components/workspace/PageHeading';
import { MotionGrid } from '../components/workspace/motion';
import { operationLabels, useUsage, type Operation } from '../components/workspace/UsageSession';
import { useWorkspacePage } from '../components/workspace/WorkspaceLayout';
import { formatSize } from '../lib/vault/container';
import '../components/dashboard/overview.css';

const tools = [
  { path: '/obfuscate', name: 'Obfuscate', label: 'Source studio', types: 'Lua · Luau', text: 'Build a separate copy of your script.', action: 'Open editor', image: brackets },
  { path: '/vault', name: 'Vault', label: 'File vault', types: 'File encryption', text: 'Encrypt a file or restore an archive.', action: 'Open vault', image: stack },
];
const mix: { op: Operation; label: string; ink: string }[] = [
  { op: 'compact', label: 'Source builds', ink: '#f2f2f2' }, { op: 'encrypt', label: 'Files sealed', ink: '#b2b2b2' }, { op: 'decrypt', label: 'Files restored', ink: '#777' },
];
const clock = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' });

function SessionSummary() {
  const { count, input, byTool } = useUsage();
  let offset = 0;
  return <section className="glass-card overview-module dash-summary" aria-labelledby="summary-title">
    <header className="module-head"><h2 id="summary-title"><ChartNoAxesColumn size={16} />Session summary</h2><small>{formatSize(input)} processed</small></header>
    <div className="summary-body"><div className="summary-ring"><svg aria-hidden="true" viewBox="0 0 104 104"><circle cx="52" cy="52" r="47" className="ring-ticks" />
      <g transform="rotate(-90 52 52)" fill="none" strokeWidth="6"><circle cx="52" cy="52" r="40" stroke="#ffffff19" />{mix.map(({ op, ink }) => {
        if (!byTool[op]) return null;
        const length = byTool[op] / count * 100, start = offset; offset += length;
        return <circle key={op} cx="52" cy="52" r="40" pathLength="100" stroke={ink} strokeDasharray={`${length} ${100-length}`} strokeDashoffset={-start} />;
      })}</g></svg><span><b>{count.toLocaleString('en', { notation: 'compact' })}</b><small>runs</small></span></div>
      <dl>{mix.map(({ op, ink, label }) => <div key={op}><dt><i style={{ background: ink }} />{label}</dt><dd>{byTool[op].toLocaleString('en')}</dd></div>)}</dl>
    </div></section>;
}
function RecentRuns() {
  const { recent } = useUsage();
  return <section className="glass-card overview-module dash-recent" aria-labelledby="recent-title"><header className="module-head"><h2 id="recent-title"><History size={16} />Recent runs</h2>
    <Link to="/usages" className="report-link">View report <ArrowUpRight size={13} /></Link></header>
    {recent.length ? <ol>{recent.slice(0, 3).map(row => <li key={row.id}><span>{operationLabels[row.operation]}</span><small>{formatSize(row.input)}</small><time dateTime={new Date(row.time).toISOString()}>{clock.format(row.time)}</time></li>)}</ol>
      : <div className="recent-empty"><span><Activity size={19} /></span><div><strong>No runs yet</strong><p>Completed builds and file operations appear here.</p></div></div>}
  </section>;
}
export function Dashboard() {
  const { motion, notify } = useWorkspacePage();
  return <div className="overview"><PageHeading title="Overview" eyebrow="Local workspace" description="Build a script or protect a file, right on your device." />
    <MotionGrid enabled={motion} className="overview-grid">{tools.map((tool, i) => <Link key={tool.path} to={tool.path} aria-label={tool.action} className={`glass-card overview-portal tool-portal portal-${i}`}>
      <span className="portal-label"><b>0{i+1}</b><i />{tool.label}</span>
      <div className="portal-stage" aria-hidden="true"><i className="stage-orbit" /><div className="portal-object" style={{ '--object': `url("${tool.image}")` } as CSSProperties}>
        <img src={tool.image} alt="" width={i ? 480 : 600} height={i ? 432 : 600} /><i className="object-shine" /></div></div>
      <div className="portal-copy"><h2>{tool.name}</h2><p>{tool.text}</p><small>{tool.types}</small></div>
      <span className="portal-action">{tool.action}<ArrowRight size={14} /></span>
    </Link>)}<SessionSummary /><RecentRuns /></MotionGrid>
    <footer className="overview-foot"><button onClick={() => { downloadSkeleton(); notify('Skeleton HTML downloaded.'); }}><ArrowDownToLine size={13} />Download skeleton</button></footer>
  </div>;
}
