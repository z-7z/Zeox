import { Link, Outlet, useLocation } from 'react-router-dom';
import { ArrowUpRight, Moon, Sun } from 'lucide-react';
import { useSite } from './SiteSession';

function Wordmark() {
  return (
    <Link className="site-wordmark" to="/" aria-label="ZeoxFucator home">
      <img src="/orbit.svg" width="32" height="32" alt="" />
      <span>
        Zeox<b>Fucator</b>
      </span>
    </Link>
  );
}

export function PublicLayout() {
  const { theme, toggleTheme, guest } = useSite();
  const login = useLocation().pathname.toLowerCase().replace(/\/$/, '') === '/login';
  return (
    <div className="public-site">
      <a className="skip" href="#public-content">
        Skip to content
      </a>
      <header className="site-header">
        <div className="site-width site-header-inner">
          <Wordmark />
          {!login && (
            <nav className="site-links" aria-label="Site">
              <Link to="/#quick-start">How it works</Link>
              <Link to="/#questions">FAQ</Link>
            </nav>
          )}
          <div className="site-header-actions">
            <button
              className="site-theme"
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Dark mode: switch to light' : 'Light mode: switch to dark'}
            >
              {theme === 'dark' ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
            </button>
            {!login && (
              <Link className="site-login-link" to={guest ? '/dashboard' : '/login'}>
                {guest ? 'Dashboard' : 'Log in'} <ArrowUpRight aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      </header>
      <main id="public-content" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="site-width">
          <span>ZeoxFucator</span>
          <small>Lua Obfuscator · Runs on your device</small>
        </div>
      </footer>
    </div>
  );
}
