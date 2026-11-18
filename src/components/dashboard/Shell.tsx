import type { ReactNode } from 'react';
import { Bell, LayoutGrid, Menu, Search } from 'lucide-react';
import profile from '../../assets/avatars/profile.svg';
import { navGroups, utilities, type Destination } from './navigation';
import type { OpenPanel } from './model';

export function ZeoxMark() {
  return <svg width="23" height="23" viewBox="0 0 28 28" fill="currentColor" aria-hidden="true">
    <path d="M2 5h8.2l4.1 4.6-4.2 4.2L2 5Zm12.7 0H26l-4.6 5H10.1l4.6-5ZM2 23l9.1-9.5h8.1L10.1 23H2Zm14.1-4.8h5.3l4.6 4.8H11.4l4.7-4.8Z" />
  </svg>;
}

interface ShellProps {
  open: OpenPanel;
  children: ReactNode;
  unread: boolean;
  workspaceName: string;
}

function RailButton({ item, open }: { item: Destination; open: OpenPanel }) {
  const { id, icon: Icon, label } = item;
  return <button type="button" className={`rail-button${id === 'overview' ? ' is-current' : ''}`}
    aria-label={label} aria-current={id === 'overview' ? 'page' : undefined}
    onClick={() => id === 'overview' ? document.getElementById('overview-main')?.focus() : open(id)}>
    <Icon size={16} /><span className="rail-tip" aria-hidden="true">{label}</span>
  </button>;
}

export function Shell({ open, children, unread, workspaceName }: ShellProps) {
  return <div className="db-scene">
    <a className="db-skip" href="#overview-main">Skip to overview</a>
    <div className="db-window">
      <aside className="db-rail" aria-label="Workspace sidebar">
        <button className="rail-brand" type="button" onClick={() => open('profile')} aria-label="Zeox workspace"><ZeoxMark /></button>
        <nav className="rail-navigation" aria-label="Dashboard navigation">
          {navGroups.map(group => <div className="rail-group" key={group[0].id}>
            {group.map(item => <RailButton key={item.id} item={item} open={open} />)}
          </div>)}
        </nav>
        <div className="rail-utilities">{utilities.map(item => <RailButton key={item.id} item={item} open={open} />)}</div>
      </aside>
      <div className="db-workspace">
        <header className="db-topbar">
          <div className="db-crumb">
            <button className="mobile-menu" onClick={() => open('search')} aria-label="Open workspace navigation"><Menu size={18} /></button>
            <LayoutGrid size={15} className="crumb-icon" aria-hidden="true" />
            <h1>Overview</h1>
          </div>
          <div className="top-tools">
            <button type="button" className="search-trigger" onClick={() => open('search')} aria-label="Search workspace">
              <Search size={15} /><span>Search</span><kbd>/</kbd>
            </button>
            <button type="button" className="bell-trigger" onClick={() => open('activity')} aria-label={unread ? 'Notifications, new activity' : 'Notifications'}>
              <Bell size={16} />{unread && <i aria-hidden="true" />}
            </button>
            <span className="top-divider" />
            <button type="button" className="profile-trigger" onClick={() => open('profile')} aria-label={`Open profile for ${workspaceName}`}>
              <img src={profile} alt="" width="29" height="29" />
            </button>
          </div>
        </header>
        <main className="db-main" id="overview-main" tabIndex={-1}>{children}</main>
      </div>
    </div>
  </div>;
}
