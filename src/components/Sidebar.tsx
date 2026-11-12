import { type LucideIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { ZeoxLockup } from './ZeoxLogo';

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

/** Dashboard sidebar. Non-ready items are visual placeholders for future phases. */
export function Sidebar({ items, open, onClose }: SidebarProps) {
  const location = useLocation();

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between px-5">
        <Link to="/" aria-label="Zeox home">
          <ZeoxLockup size={22} />
        </Link>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-txt-secondary lg:hidden"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X size={15} />
        </button>
      </div>

      <nav className="mt-2 flex-1 space-y-1 px-3">
        {items.map((item) => {
          const active = location.pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.to}
              onClick={onClose}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-300 ${
                active
                  ? 'bg-white/[0.06] font-medium text-white'
                  : 'text-txt-secondary hover:bg-white/[0.03] hover:text-white'
              }`}
            >
              {active && (
                <span className="absolute inset-y-2 left-0 w-[2.5px] rounded-full bg-gradient-to-b from-brand-purple to-brand-orange" />
              )}
              <Icon
                size={16}
                strokeWidth={1.75}
                className={active ? 'text-brand-lavender' : 'text-txt-muted transition-colors group-hover:text-txt-secondary'}
              />
              <span className="flex-1">{item.label}</span>
              {!item.ready && (
                <span className="rounded-full border border-white/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-txt-muted">
                  soon
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/[0.06] p-4">
        <div className="card flex items-center gap-2 rounded-xl px-3 py-2.5">
          <span className="status-dot bg-ok animate-pulse-dot" />
          <p className="text-[11px] text-txt-secondary">All systems operational</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/[0.06] bg-ink-soft lg:block">
        {content}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={onClose} />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-white/10 bg-ink-soft">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
