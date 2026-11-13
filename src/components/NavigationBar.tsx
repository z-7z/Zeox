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
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line-soft bg-page">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="shrink-0" aria-label="Zeox home">
          <ZeoxLockup size={22} />
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-txt-secondary transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2.5 md:flex">
          <Link to="/dashboard" className="btn-ghost !px-4 !py-1.5">
            Login
          </Link>
          <Link to="/dashboard" className="btn-primary !px-4 !py-1.5">
            Get Started
          </Link>
        </div>

        <button
          className="flex h-8 w-8 items-center justify-center rounded-md text-txt-secondary hover:bg-card-hover md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-line-soft bg-page px-5 pb-5 pt-2 md:hidden">
          <div className="flex flex-col gap-0.5">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm text-txt-secondary transition-colors hover:bg-card-hover hover:text-white"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-3 flex gap-2.5">
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
