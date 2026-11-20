import { Activity, ArrowDownToLine, ArrowUpRight, ChartNoAxesColumn, ChevronRight, FileUp, FolderLock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { operationLabels, useUsage } from '../workspace/UsageSession';
import { formatSize } from '../../lib/vault/container';

export function SessionCard() {
  const { count, recent } = useUsage();
  return <section className="ws-panel ov-session" aria-label="Session summary"><header className="ov-heading"><h2><Activity size={15} />This session</h2><small className="live-label">Live</small></header>
    <h3>{count ? `${count.toLocaleString('en-US')} completed ${count === 1 ? 'run' : 'runs'}` : 'No runs yet'}</h3>
    {count ? <ol className="session-recent" aria-label="Recent runs">{recent.slice(0, 3).map(r => <li key={r.id}><span>{operationLabels[r.operation]}</span><small>{formatSize(r.input)}</small></li>)}</ol>
      : <p>Build a script or process a file to start your local session.</p>}
    <Link className="ov-text-link" to="/usages">View report <ArrowUpRight size={13} /></Link>
  </section>;
}
const actions = [
  { to: '/obfuscate', name: 'Obfuscate file', icon: FileUp },
  { to: '/vault', name: 'Open Vault', icon: FolderLock },
  { to: '/usages', name: 'View usages', icon: ChartNoAxesColumn },
];
export function ActionsCard({ download }: { download: () => void }) {
  return <section className="ws-panel ov-actions" aria-label="Quick actions"><header className="ov-heading"><h2><Zap size={15} />Quick actions</h2></header>
    <div className="action-list">{actions.map(a => <Link key={a.to} to={a.to}><a.icon size={15} />{a.name}<ChevronRight size={13} /></Link>)}
      <button type="button" onClick={download}><ArrowDownToLine size={15} />Download skeleton<ChevronRight size={13} /></button></div>
  </section>;
}
