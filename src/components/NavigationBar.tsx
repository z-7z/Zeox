import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { ZeoxLockup } from './ZeoxLogo';
import { scrollToSection } from '../utils/scrollToSection';

const links = [
  { label: 'Platform', target: 'services' },
  { label: 'System status', target: 'status' },
  { label: 'Workflow', target: 'workflow' },
];

/** Compact public navigation for the Zeox control deck. */
export function NavigationBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line-soft bg-page/95">
      <nav className="mx-auto flex h-14 max-w-[1320px] items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link to="/" className="shrink-0" aria-label="Zeox home"><ZeoxLockup size={21} /></Link>
        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <a key={link.label} href={'#' + link.target} onClick={(event) => scrollToSection(event, link.target)} className="font-mono text-[10px] uppercase tracking-wider text-txt-muted transition-colors hover:text-txt-primary">{link.label}</a>
          ))}
        </div>
        <div className="hidden md:block"><Link to="/dashboard" className="btn-primary !rounded-md !px-3.5 !py-2 text-xs">Open control deck <ArrowUpRight size={13} /></Link></div>
        <button className="flex h-9 w-9 items-center justify-center border border-line-soft text-txt-secondary transition-colors hover:bg-card-hover hover:text-txt-primary md:hidden" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-line-soft bg-panel px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col">
            {links.map((link) => (
              <a key={link.label} href={'#' + link.target} onClick={(event) => { scrollToSection(event, link.target); setOpen(false); }} className="border-b border-line-soft px-2 py-3 font-mono text-[10px] uppercase tracking-wider text-txt-secondary">{link.label}</a>
            ))}
            <Link to="/dashboard" className="btn-primary mt-3 w-fit !rounded-md !px-3.5 !py-2 text-xs" onClick={() => setOpen(false)}>Open control deck <ArrowUpRight size={13} /></Link>
          </div>
        </div>
      )}
    </header>
  );
}
