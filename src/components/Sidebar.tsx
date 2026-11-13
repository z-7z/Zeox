import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { type LucideIcon } from 'lucide-react';
import { ZeoxLockup } from './ZeoxLogo';

export interface NavItem { label: string; to: string; icon: LucideIcon; ready?: boolean }
interface SidebarProps { items: NavItem[]; open: boolean; onClose: () => void }

function NavRow({ item, active, onClose }: { item: NavItem; active: boolean; onClose: () => void }) {
  const Icon = item.icon;
  return (
    <Link to={item.to} onClick={onClose} aria-current={active ? 'page' : undefined} className={'nav-pill ' + (active ? 'nav-pill-active' : '')}>
      <Icon size={15} strokeWidth={1.8} className={active ? 'text-accent-cyan' : 'text-txt-muted'} />
      <span className="flex-1">{item.label}</span>
      {!item.ready && <span className="border border-line-soft px-1 py-px font-mono text-[8px] uppercase tracking-wider text-txt-muted">soon</span>}
    </Link>
  );
}

function SectionLabel({ children }: { children: string }) {
  return <p className="px-3 pb-2 pt-5 font-mono text-[9px] uppercase tracking-[0.15em] text-txt-muted">{children}</p>;
}

export function Sidebar({ items, open, onClose }: SidebarProps) {
  const location = useLocation();
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const normalizedQuery = query.trim().toLowerCase();
  const matches = (item: NavItem) => !normalizedQuery || item.label.toLowerCase().includes(normalizedQuery);
  const mainItems = items.slice(0, 5).filter(matches);
  const secondaryItems = items.slice(5).filter(matches);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const content = (
    <div className="flex h-full flex-col bg-panel">
      <div className="flex h-14 items-center justify-between border-b border-line-soft px-4">
        <Link to="/" aria-label="Zeox home"><ZeoxLockup size={20} /></Link>
        <button className="flex h-8 w-8 items-center justify-center text-txt-muted hover:text-txt-primary lg:hidden" onClick={onClose} aria-label="Close menu"><X size={15} /></button>
      </div>
      <div className="px-3 pt-4">
        <div className="flex items-center gap-2 border border-line-soft bg-page px-3 py-2">
          <Search size={13} className="text-txt-muted" />
          <input ref={searchInputRef} placeholder="Find a page..." value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent font-mono text-[10px] text-txt-primary placeholder:text-txt-muted focus:outline-none" aria-label="Find a dashboard page" />
          <span className="hidden rounded-sm border border-line-soft px-1 font-mono text-[8px] text-txt-muted sm:inline">⌘K</span>
        </div>
      </div>
      <nav className="mt-2 flex-1 overflow-y-auto px-2 pb-4" aria-label="Dashboard navigation">
        <SectionLabel>Control deck</SectionLabel>
        <div className="space-y-0.5">{mainItems.map((item) => <NavRow key={item.label} item={item} active={location.pathname === item.to} onClose={onClose} />)}</div>
        {secondaryItems.length > 0 && <><SectionLabel>Workspace</SectionLabel><div className="space-y-0.5">{secondaryItems.map((item) => <NavRow key={item.label} item={item} active={location.pathname === item.to} onClose={onClose} />)}</div></>}
        {mainItems.length === 0 && secondaryItems.length === 0 && <p className="px-3 py-4 text-xs text-txt-muted">No pages found.</p>}
      </nav>
      <div className="border-t border-line-soft px-4 py-3">
        <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-txt-muted"><span className="status-dot bg-accent-orange" />Prototype workspace</p>
        <p className="mt-1 font-mono text-[9px] text-txt-muted">No live backend connected</p>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-line-soft lg:block xl:w-64">{content}</aside>
      {open && <div className="fixed inset-0 z-50 lg:hidden"><button className="absolute inset-0 bg-black/80" onClick={onClose} aria-label="Close navigation" /><aside className="page-enter absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-line-soft">{content}</aside></div>}
    </>
  );
}
