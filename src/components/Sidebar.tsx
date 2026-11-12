import { type LucideIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { X, Search, PanelLeft, CircleHelp, BookOpen, Sparkles } from 'lucide-react';
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
      className={
        'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ' +
        (active
          ? 'bg-card-hover font-medium text-white'
          : 'text-txt-secondary hover:bg-card-hover hover:text-white')
      }
    >
      <Icon size={15} strokeWidth={1.75} className={active ? 'text-white' : 'text-txt-muted'} />
      <span className="flex-1">{item.label}</span>
      {!item.ready && (
        <span className="rounded border border-line px-1 py-px font-mono text-[9px] uppercase text-txt-muted">
          soon
        </span>
      )}
    </Link>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="px-2.5 pb-1.5 pt-4 text-[11px] font-medium text-txt-muted">{children}</p>
  );
}

/** Dashboard sidebar in the flat reference style. */
export function Sidebar({ items, open, onClose }: SidebarProps) {
  const location = useLocation();
  const platform = items.slice(0, 5);
  const system = items.slice(5);

  const content = (
    <div className="flex h-full flex-col bg-panel">
      <div className="flex h-14 items-center justify-between px-4">
        <Link to="/" aria-label="Zeox home" className="flex items-center gap-2">
          <ZeoxLogo size={18} className="text-white" />
        </Link>
        <div className="flex items-center gap-1">
          <button
            className="hidden h-7 w-7 items-center justify-center rounded-md text-txt-muted hover:text-txt-secondary lg:flex"
            aria-label="Toggle sidebar"
          >
            <PanelLeft size={15} />
          </button>
          <button
            className="flex h-7 w-7 items-center justify-center rounded-md text-txt-muted hover:text-txt-secondary lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      <div className="px-3">
        <div className="flex items-center gap-2 rounded-md border border-line bg-card px-2.5 py-1.5">
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
        <SectionLabel>Platform</SectionLabel>
        <div className="space-y-0.5">
          {platform.map((item) => (
            <NavRow key={item.label} item={item} active={location.pathname === item.to} onClose={onClose} />
          ))}
        </div>
        {system.length > 0 && (
          <>
            <SectionLabel>System</SectionLabel>
            <div className="space-y-0.5">
              {system.map((item) => (
                <NavRow key={item.label} item={item} active={location.pathname === item.to} onClose={onClose} />
              ))}
            </div>
          </>
        )}
      </nav>

      <div className="border-t border-line-soft p-3">
        <div className="card p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-medium text-txt-secondary">
            <Sparkles size={12} className="text-txt-muted" />
            What's new?
          </p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-txt-muted">
            New dashboard layout is live. More services coming soon.
          </p>
        </div>
        <div className="mt-2 space-y-0.5">
          <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-xs text-txt-secondary hover:bg-card-hover hover:text-white">
            <CircleHelp size={14} strokeWidth={1.75} className="text-txt-muted" />
            Help Center
          </button>
          <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-xs text-txt-secondary hover:bg-card-hover hover:text-white">
            <BookOpen size={14} strokeWidth={1.75} className="text-txt-muted" />
            Documentation
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-line-soft lg:block">{content}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={onClose} />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-line">{content}</aside>
        </div>
      )}
    </>
  );
}
