import { Bell, ChevronDown, LogOut, Settings, UserRound } from 'lucide-react';
import { useState } from 'react';

interface DashboardHeaderProps {
  onMenu: () => void;
}

/** Dashboard top header with greeting, notifications and account menu (visual only). */
export function DashboardHeader({ onMenu }: DashboardHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-ink/70 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-4 px-5 lg:px-8">
        <div className="min-w-0">
          <button
            className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-txt-secondary lg:hidden"
            onClick={onMenu}
            aria-label="Open menu"
          >
            <span className="flex flex-col gap-[3px]">
              <span className="h-[1.5px] w-4 rounded bg-current" />
              <span className="h-[1.5px] w-4 rounded bg-current" />
              <span className="h-[1.5px] w-4 rounded bg-current" />
            </span>
          </button>
          <div className="hidden sm:block">
            <h1 className="text-[15px] font-semibold tracking-tight text-white">Welcome back</h1>
            <p className="text-xs text-txt-muted">Here's an overview of your Zeox workspace.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-txt-secondary transition-colors hover:text-white"
            aria-label="Notifications"
          >
            <Bell size={16} strokeWidth={1.75} />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand-orange" />
          </button>

          <div className="relative">
            <button
              className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] py-1.5 pl-1.5 pr-3 transition-colors hover:border-white/20"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-orangeDeep to-brand-orangeLight text-[11px] font-bold text-white">
                ZD
              </span>
              <span className="hidden text-sm text-txt-secondary sm:block">Zeox Dev</span>
              <ChevronDown size={14} className="text-txt-muted" />
            </button>

            {menuOpen && (
              <div className="glass glass-compact absolute right-0 mt-2 w-48 p-1.5">
                {[
                  { icon: UserRound, label: 'Account' },
                  { icon: Settings, label: 'Settings' },
                  { icon: LogOut, label: 'Sign out' },
                ].map((i) => (
                  <button
                    key={i.label}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-txt-secondary transition-colors hover:bg-white/[0.05] hover:text-white"
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
