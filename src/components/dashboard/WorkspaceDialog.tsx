import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowDownToLine, ArrowUpRight, Check, ChevronRight, CornerDownLeft, Layers, RefreshCw, Search, Settings, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { navGroups, panelIcons, utilities } from './navigation';
import { CampaignPanel, OrdersPanel, SettingsPanel, TeamPanel } from './WorkspaceForms';
import { DownloadsPanel, InsightPanel } from './DetailPanels';
import type { OpenPanel, Overview, PanelId, WorkspaceState } from './model';
import profile from '../../assets/avatars/profile.svg';
import './dialog.css';

const titles: Record<PanelId, string> = {
  search: 'Search workspace', profile: 'Workspace profile', activity: 'Activity log', help: 'Help & shortcuts', settings: 'Workspace settings',
  funnel: 'Purchase funnel', channels: 'Order distribution', traffic: 'Traffic sources', team: 'Invite members', sales: 'Sales by hour',
  orders: 'Review unfulfilled', campaigns: 'Campaign studio', downloads: 'Downloads',
};
interface DialogProps extends WorkspaceState {
  id: PanelId; row?: number; data: Overview | null; open: OpenPanel; close: () => void; notify: (message: string) => void;
  exportSales: () => void; refresh: () => void; notice: string;
}

function CommandMenu({ open, close, refresh, exportSales, available }: Pick<DialogProps, 'open' | 'close' | 'refresh' | 'exportSales'> & { available: boolean }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const list = useRef<HTMLDivElement>(null);
  const commands = [
    ...[...navGroups.flat(), ...utilities].filter(item => item.id !== 'search').map(item => ({ ...item, run: () => item.id === 'overview' ? close() : open(item.id) })),
    { label: 'Download skeleton', id: 'skeleton', icon: Layers, hint: 'Get the standalone HTML loading layout', run: () => open('downloads') },
    ...(available ? [{ label: 'Export sales', id: 'export', icon: ArrowDownToLine, hint: 'Download the hourly sales CSV', run: () => { close(); exportSales(); } }] : []),
    { label: 'Refresh overview', id: 'refresh', icon: RefreshCw, hint: 'Reload the local data snapshot', run: () => { close(); refresh(); } },
  ].filter(c => `${c.label} ${c.hint}`.toLowerCase().includes(query.trim().toLowerCase()));
  function move(amount: number) {
    if (!commands.length) return;
    const next = (active + amount + commands.length) % commands.length;
    setActive(next); list.current?.children[next]?.scrollIntoView({ block: 'nearest' });
  }
  return <><div className="command-field"><Search size={17} /><input data-initial type="search" placeholder="Search pages, actions, or downloads…"
    aria-label="Search commands" role="combobox" aria-controls="command-results" aria-expanded="true" aria-activedescendant={commands[active] ? `cmd-${commands[active].id}` : undefined}
    value={query} onChange={e => { setQuery(e.target.value); setActive(0); }} onKeyDown={e => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); move(e.key === 'ArrowDown' ? 1 : -1); }
      else if (e.key === 'Enter') { e.preventDefault(); commands[active]?.run(); }
    }} /></div>
    <p className="eyebrow command-caption">{query ? 'Matching commands' : 'Workspace commands'}</p>
    <div className="command-results" ref={list} id="command-results" role="listbox" aria-label="Workspace commands">
      {commands.map((cmd, i) => <button key={cmd.id} id={`cmd-${cmd.id}`} role="option" aria-selected={i === active} tabIndex={-1}
        className={`command-result${active === i ? ' is-active' : ''}`} onMouseEnter={() => setActive(i)} onClick={cmd.run}>
        <cmd.icon size={16} /><span>{cmd.label}</span><ChevronRight size={14} /></button>)}
    </div>
    {!commands.length && <p className="panel-intro empty-results">No matching commands. Try “sales” or “team”.</p>}
    <div className="command-foot"><span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span><span><CornerDownLeft size={12} /> Open</span><span><kbd>esc</kbd> Close</span></div>
  </>;
}

export function WorkspaceDialog(props: DialogProps) {
  const { id, row, open, close, data, workspace, exportSales, refresh, notify, notice } = props;
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = dialog.current;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    el?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      el?.close();
      document.body.style.overflow = overflow;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => { (dialog.current?.querySelector<HTMLElement>('[data-initial]') ?? dialog.current?.querySelector<HTMLElement>('.dialog-close'))?.focus(); }, [id]);
  const Icon = panelIcons[id];
  let content: ReactNode;
  switch (id) {
    case 'search': content = <CommandMenu {...{ open, close, refresh, exportSales }} available={!!data} />; break;
    case 'channels': case 'funnel': case 'traffic': case 'sales': content = data ? <InsightPanel id={id} selected={row} data={data} /> : <p className="panel-intro">The overview snapshot is not available yet.</p>; break;
    case 'team': content = <TeamPanel {...props} />; break;
    case 'campaigns': content = <CampaignPanel {...props} />; break;
    case 'settings': content = <SettingsPanel {...props} />; break;
    case 'orders': content = <OrdersPanel {...props} />; break;
    case 'downloads': content = <DownloadsPanel exportSales={exportSales} notify={notify} available={!!data} />; break;
    case 'activity': content = <><p className="panel-intro">Latest changes in this workspace, newest first.</p><ol className="activity-feed">
      {workspace.activity.map((event, i) => <li key={`${event}-${i}`}><i /><span>{event}</span>{i === 0 && <small>Latest</small>}</li>)}
    </ol></>; break;
    case 'profile': content = <><div className="profile-summary"><img src={profile} width="46" height="46" alt="" /><div><strong>{workspace.name}</strong><p>Workspace owner · Local demo</p></div></div>
      <button className="panel-link" onClick={() => open('settings')}><Settings size={16} /><span>Workspace settings</span><ChevronRight size={14} /></button>
      <button className="panel-link" onClick={() => open('downloads')}><Layers size={16} /><span>Downloads & skeleton</span><ChevronRight size={14} /></button>
      <button className="panel-link" onClick={() => { close(); refresh(); }}><RefreshCw size={16} /><span>Refresh overview</span><ChevronRight size={14} /></button>
      <Link className="panel-link" to="/"><ArrowUpRight size={16} /><span>Visit Zeox home</span></Link></>; break;
    case 'help': content = <><p className="panel-intro">Explore the charts to inspect their numbers. Use the command menu to find any card or workspace action.</p>
      <div className="shortcut-line"><span>Open search</span><kbd>/</kbd></div><div className="shortcut-line"><span>Command menu</span><kbd>Ctrl / ⌘ + K</kbd></div><div className="shortcut-line"><span>Close a dialog</span><kbd>Esc</kbd></div>
      <p className="local-note">Zeox overview uses a local demo snapshot. No account or network service is required.</p></>; break;
  }
  return <dialog ref={dialog} className="workspace-dialog" aria-labelledby="dialog-title"
    onCancel={e => { e.preventDefault(); close(); }} onClick={e => { if (e.target === e.currentTarget) close(); }}>
    <div className="dialog-inner"><header className="dialog-head"><div><span className="eyebrow">Zeox / Workspace</span><h2 id="dialog-title"><Icon size={19} />{titles[id]}</h2></div>
      <button className="dialog-close" onClick={close} aria-label="Close dialog"><X size={17} /></button></header>
      <div className="dialog-content" key={id}>{content}</div>
      {notice && <div className="dialog-notice" role="status"><Check size={14} />{notice}</div>}
    </div>
  </dialog>;
}
