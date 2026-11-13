import { Bell, ChevronDown, LogOut, Settings, UserRound, Menu, Search } from 'lucide-react';
import { useState } from 'react';

interface DashboardHeaderProps { onMenu: () => void; searchTerm: string; onSearchChange: (value: string) => void }

export function DashboardHeader({ onMenu, searchTerm, onSearchChange }: DashboardHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 border-b border-line-soft bg-page/95">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-5 lg:px-7">
        <button className="flex h-8 w-8 shrink-0 items-center justify-center border border-line-soft text-txt-secondary hover:bg-card-hover lg:hidden" onClick={onMenu} aria-label="Open menu"><Menu size={15} /></button>
        <div className="hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-txt-muted sm:flex"><span>Workspace</span><span className="text-line">/</span><span className="text-accent-cyan">Overview</span></div>
        <div className="flex w-full max-w-[18rem] items-center gap-2 border border-line-soft bg-panel px-3 py-2 sm:ml-auto sm:w-auto">
          <Search size={13} className="text-txt-muted" />
          <input placeholder="Search operations..." value={searchTerm} onChange={(event) => onSearchChange(event.target.value)} className="w-full bg-transparent font-mono text-[10px] text-txt-primary placeholder:text-txt-muted focus:outline-none" aria-label="Search operations" />
          <kbd className="hidden border border-line-soft px-1 font-mono text-[8px] text-txt-muted md:inline">/</kbd>
        </div>
        <div className="ml-auto flex items-center gap-2 sm:ml-2">
          <button className="relative flex h-8 w-8 items-center justify-center text-txt-secondary transition-colors hover:bg-card-hover hover:text-txt-primary" aria-label="Notifications"><Bell size={15} strokeWidth={1.75} /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 bg-accent-orange" /></button>
          <div className="relative">
            <button className="flex items-center gap-2 border border-line-soft px-1.5 py-1 transition-colors hover:bg-card-hover" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Open account menu">
              <span className="flex h-6 w-6 items-center justify-center bg-accent-orange font-mono text-[10px] font-bold text-page">Z</span>
              <span className="hidden font-mono text-[9px] uppercase tracking-wider text-txt-secondary sm:block">Zeox Dev</span>
              <ChevronDown size={12} className="text-txt-muted" />
            </button>
            {menuOpen && <div className="card scale-in absolute right-0 mt-2 w-44 p-1">{[
              { icon: UserRound, label: 'Account' }, { icon: Settings, label: 'Settings' }, { icon: LogOut, label: 'Sign out' },
            ].map((item) => <button key={item.label} className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs text-txt-secondary transition-colors hover:bg-card-hover hover:text-txt-primary" onClick={() => setMenuOpen(false)}><item.icon size={13} strokeWidth={1.75} />{item.label}</button>)}</div>}
          </div>
        </div>
      </div>
    </header>
  );
}
