import { Bell, ChevronDown, LogOut, Settings, UserRound, Menu, Search } from 'lucide-react';
import { useState } from 'react';

interface DashboardHeaderProps {
  onMenu: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

/** Top bar: search pill + notifications + account menu. */
export function DashboardHeader({ onMenu, searchTerm, onSearchChange }: DashboardHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-line-soft bg-page">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-5 lg:px-6">
        <button
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-txt-secondary hover:bg-card-hover lg:hidden"
          onClick={onMenu}
          aria-label="Open menu"
        >
          <Menu size={16} />
        </button>

        <div className="flex w-full max-w-xs items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5">
          <Search size={13} className="text-txt-muted" />
          <input
            placeholder="Search operations..."
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-full bg-transparent text-xs text-txt-primary placeholder:text-txt-muted focus:outline-none"
            aria-label="Search"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            className="relative flex h-8 w-8 items-center justify-center rounded-full text-txt-secondary transition-colors hover:bg-card-hover hover:text-white"
            aria-label="Notifications"
          >
            <Bell size={15} strokeWidth={1.75} />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent-green" />
          </button>

          <div className="relative">
            <button
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-card-hover"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[11px] font-bold text-black">
                Z
              </span>
              <span className="hidden text-sm text-txt-secondary sm:block">Zeox Dev</span>
              <ChevronDown size={13} className="text-txt-muted" />
            </button>

            {menuOpen && (
              <div className="card scale-in absolute right-0 mt-2 w-44 p-1">
                {[
                  { icon: UserRound, label: 'Account' },
                  { icon: Settings, label: 'Settings' },
                  { icon: LogOut, label: 'Sign out' },
                ].map((i) => (
                  <button
                    key={i.label}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-txt-secondary transition-colors hover:bg-card-hover hover:text-white"
                    onClick={() => setMenuOpen(false)}
                  >
                    <i.icon size={14} strokeWidth={1.75} />
                    {i.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
