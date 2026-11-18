import type { ReactNode } from 'react';
import { AudioLines, Bell, Menu, Monitor, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import profile from '../../assets/avatars/profile.svg';
import { chartCommands, navGroups, utilities, type Destination } from './navigation';
import type { OpenPanel } from './model';
import { ZeoxMark } from '../ZeoxMark';
import { sections, type Section } from '../workspace/sections';
import type { MotionState } from '../workspace/motion';

interface ShellProps { active: Section; motion: MotionState; open: OpenPanel; children: ReactNode; unread: boolean; workspaceName: string }
function RailButton({ item, open }: { item: Destination; open: OpenPanel }) {
  const { id, icon: Icon, label } = item;
  return <button type="button" className="rail-button" aria-label={label} onClick={() => open(id)}>
    <Icon size={16} /><span className="rail-tip" aria-hidden="true">{label}</span>
  </button>;
}
export function Shell({ active, motion, open, children, unread, workspaceName }: ShellProps) {
  return <div className="db-scene" data-motion={motion.enabled ? 'on' : 'off'}>
    <a className="db-skip" href="#workspace-main">Skip to content</a>
    <div className="db-window">
      {active.id === 'dashboard' && <aside className="db-rail" aria-label="Workspace sidebar">
        <Link className="rail-brand" to="/dashboard" aria-label="Zeox home"><ZeoxMark /></Link>
        <nav className="rail-navigation" aria-label="Dashboard shortcuts">{[chartCommands, ...navGroups].map(group => <div className="rail-group" key={group[0].id}>
          {group.map(item => <RailButton key={item.id} item={item} open={open} />)}</div>)}</nav>
        <div className="rail-utilities">{utilities.map(item => <RailButton key={item.id} item={item} open={open} />)}</div>
      </aside>}
      <div className="db-workspace">
        <header className="db-topbar">
          <div className="db-crumb"><button className="mobile-menu" onClick={() => open('search')} aria-label="Open workspace navigation"><Menu size={18} /></button>
            <Link to="/dashboard" className="ws-wordmark">{active.id !== 'dashboard' && <ZeoxMark />}Zeox</Link><span className="ws-divider-slash">/</span><span className="ws-name" title={workspaceName}>{workspaceName === 'Zeox workspace' ? 'Workspace' : workspaceName}</span></div>
          <nav className="ws-tabs" aria-label="Workspace sections">{sections.map(({ id, path, label, icon: Icon }) => <Link key={id} to={path} aria-current={active.id === id ? 'page' : undefined}>
            <Icon size={14} /><span>{label}</span></Link>)}</nav>
          <div className="top-tools"><button type="button" className="search-trigger" onClick={() => open('search')} aria-label="Search workspace"><Search size={14} /><span>Search</span><kbd>/</kbd></button>
            <button type="button" className="bell-trigger" onClick={() => open('activity')} aria-label={unread ? 'Notifications, new activity' : 'Notifications'}><Bell size={16} />{unread && <i aria-hidden="true" />}</button>
            <span className="top-divider" /><button type="button" className="profile-trigger" onClick={() => open('profile')} aria-label={`Open profile for ${workspaceName}`}><img src={profile} alt="" width="29" height="29" /></button></div>
        </header>
        <main className="db-main" id="workspace-main" tabIndex={-1}>{children}</main>
        <footer className="ws-footer"><span><Monitor size={12} />Local workspace <i /> Browser session</span>
          <button onClick={motion.toggle} aria-label={motion.systemReduced ? 'Motion reduced by system preference' : 'Enable animation'} aria-pressed={motion.enabled} disabled={motion.systemReduced}>
            <AudioLines size={13} />{motion.systemReduced ? 'Reduced motion' : motion.enabled ? 'Motion on' : 'Motion off'}</button></footer>
      </div>
    </div>
  </div>;
}
