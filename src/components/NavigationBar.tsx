import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ZeoxLockup } from './ZeoxLogo';

const links = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Documentation', href: '#docs' },
];

/** Public site navigation — internal pages are placeholders for a later phase. */
export function NavigationBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-ink/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="shrink-0" aria-label="Zeox home">
          <ZeoxLockup size={24} />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-txt-secondary transition-colors duration-300 hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/dashboard" className="btn-ghost !px-4 !py-2">
            Login
          </Link>
          <Link to="/dashboard" className="btn-primary !px-4 !py-2">
            Get Started
          </Link>
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-txt-secondary md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={17} /> : <Menu size={17} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/[0.06] bg-ink/95 px-5 pb-5 pt-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-txt-secondary transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-3 flex gap-3">
              <Link to="/dashboard" className="btn-ghost flex-1" onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link to="/dashboard" className="btn-primary flex-1" onClick={() => setOpen(false)}>
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
