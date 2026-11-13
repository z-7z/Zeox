import { type LucideIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { X, Search, PanelLeft, LifeBuoy, BookOpen, Settings } from 'lucide-react';
import { ZeoxLogo } from './ZeoxLogo';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  ready?: boolean;
}

interface SidebarProps {
  items: NavItem[];
  open: boolean;
  onClose: () => void;
}

function NavRow({ item, active, onClose }: { item: NavItem; active: boolean; onClose: () => void }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      onClick={onClose}
      className={'nav-pill ' + (active ? 'nav-pill-active' : '')}
    >
      <Icon size={15} strokeWidth={2} className={active ? 'text-black' : 'text-txt-muted'} />
      <span className="flex-1">{item.label}</span>
      {!item.ready && (
        <span className="rounded-full border border-line px-1.5 py-px font-mono text-[9px] uppercase text-txt-muted">
          soon
        </span>
      )}
    </Link>
  );
}

function SectionLabel({ children }: { children: string }) {
  return <p className="px-3 pb-1.5 pt-5 text-[11px] font-medium text-txt-muted">{children}</p>;
}

/** Floating rounded sidebar panel, reference style. */
export function Sidebar({ items, open, onClose }: SidebarProps) {
  const location = useLocation();
  const main = items.slice(0, 5);
  const bottom = items.slice(5);

  const content = (
    <div className="flex h-full flex-col bg-card">
      <div className="flex h-14 items-center justify-between px-4">
        <Link to="/" aria-label="Zeox home" className="flex items-center gap-2">
          <ZeoxLogo size={18} className="text-white" />
        </Link>
        <div className="flex items-center gap-1">
          <button
            className="hidden h-7 w-7 items-center justify-center rounded-full text-txt-muted hover:text-txt-secondary lg:flex"
            aria-label="Toggle sidebar"
          >
            <PanelLeft size={15} />
          </button>
          <button
            className="flex h-7 w-7 items-center justify-center rounded-full text-txt-muted hover:text-txt-secondary lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      <div className="px-3">
        <div className="flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-2">
          <Search size={13} className="text-txt-muted" />
          <input
            placeholder="Search..."
            className="w-full bg-transparent text-xs text-txt-primary placeholder:text-txt-muted focus:outline-none"
            aria-label="Search"
          />
          <span className="rounded border border-line px-1 font-mono text-[9px] text-txt-muted">⌘K</span>
        </div>
      </div>

      <nav className="mt-1 flex-1 overflow-y-auto px-3 pb-4">
        <SectionLabel>Main menu</SectionLabel>
        <div className="space-y-1">
          {main.map((item) => (
            <NavRow key={item.label} item={item} active={location.pathname === item.to} onClose={onClose} />
          ))}
        </div>
        {bottom.length > 0 && (
          <>
            <SectionLabel>General</SectionLabel>
            <div className="space-y-1">
              {bottom.map((item) => (
                <NavRow key={item.label} item={item} active={location.pathname === item.to} onClose={onClose} />
              ))}
            </div>
          </>
        )}
      </nav>

      <div className="border-t border-line-soft p-3">
        <div className="space-y-1">
          <button className="nav-pill w-full !text-xs">
            <LifeBuoy size={14} strokeWidth={1.75} className="text-txt-muted" />
            Help Center
          </button>
          <button className="nav-pill w-full !text-xs">
            <BookOpen size={14} strokeWidth={1.75} className="text-txt-muted" />
            Documentation
          </button>
          <button className="nav-pill w-full !text-xs">
            <Settings size={14} strokeWidth={1.75} className="text-txt-muted" />
            Settings
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-2 left-2 z-40 hidden w-60 rounded-2xl border border-line-soft lg:block xl:w-64">
        {content}
      </aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={onClose} />
          <aside className="page-enter absolute inset-y-2 left-2 w-72 rounded-2xl border border-line">{content}</aside>
        </div>
      )}
    </>
  );
}
