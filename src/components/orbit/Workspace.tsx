import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Bell, CircleHelp, Moon, Search, Sparkles, Sun } from 'lucide-react';
import { useUsage } from '../workspace/UsageSession';
import { tabs } from './tools';
import { useSite } from '../site/SiteSession';
import { UtilitySheet, type Utility } from './UtilitySheet';
import orb from '../../assets/orb.svg';

export function Workspace() {
  const { pathname, key } = useLocation(),
    { count } = useUsage();
  const { theme, toggleTheme } = useSite();
  const light = theme === 'light';
  const [overlay, setOverlay] = useState<{ kind: Utility; key: string } | null>(null);
  const utility = overlay?.key === key ? overlay.kind : null;
  const path = pathname.toLowerCase().replace(/\/$/, '') || '/';
  const guide = path === '/encrypt' ? 'Encryption guide' : 'Build guide';

  function open(kind: Utility) {
    setOverlay({ kind, key });
  }
  useEffect(() => {
    setOverlay(null);
    function shortcut(e: KeyboardEvent) {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === 'k' &&
        !document.querySelector('dialog[open], [role="listbox"]')
      ) {
        e.preventDefault();
        setOverlay({ kind: 'search', key });
      }
    }
    window.addEventListener('keydown', shortcut);
    return () => window.removeEventListener('keydown', shortcut);
  }, [key]);
  return (
    <div className="orbit-app">
      <a className="skip" href="#workspace">
        Skip to content
      </a>
      <header className="topbar">
        <Link className="brand" to="/" aria-label="ZeoxFucator home" title="ZeoxFucator home">
          <img src="/orbit.svg" alt="" />
          <span>
            Zeox<b>Fucator</b>
          </span>
        </Link>
        <button
          type="button"
          className="search-trigger"
          aria-label="Search tools"
          onClick={() => open('search')}
          aria-keyshortcuts="Control+k Meta+k"
          title="Search tools (Ctrl or ⌘ K)"
          aria-haspopup="dialog"
        >
          <Search aria-hidden="true" />
          <span>Search tools</span>
        </button>
        <button
          type="button"
          className="guide-trigger"
          aria-label={guide}
          onClick={() => open('guide')}
          aria-haspopup="dialog"
        >
          <i className="round">
            <Sparkles aria-hidden="true" />
          </i>
          <span>{guide}</span>
        </button>
        <div className="top-end">
          <button
            type="button"
            className="theme-trigger"
            onClick={toggleTheme}
            aria-label={light ? 'Light mode: switch to dark' : 'Dark mode: switch to light'}
          >
            <span>{light ? 'Light mode' : 'Dark mode'}</span>
            <i className="round">{light ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}</i>
          </button>
          <div className="inbox">
            <button
              type="button"
              className="round inbox-trigger"
              aria-label="Session activity"
              aria-describedby="run-count"
              aria-haspopup="dialog"
              onClick={() => open('inbox')}
            >
              <Bell aria-hidden="true" />
            </button>
            <small aria-hidden="true">{count > 99 ? '99+' : count}</small>
            <span id="run-count" className="sr-only">
              {count} completed {count === 1 ? 'run' : 'runs'}
            </span>
          </div>
          <button
            type="button"
            className="account"
            onClick={() => open('local')}
            aria-label="Local workspace information"
            aria-haspopup="dialog"
          >
            <img alt="" src={orb} />
          </button>
        </div>
      </header>
      <div className="workspace-layout">
        <nav aria-label="Tools" className="dock">
          <div className="dock-items">
            {tabs.map(({ url, name, icon: Icon }) => (
              <Link key={url} to={url} aria-label={name} title={name} aria-current={url === path ? 'page' : undefined}>
                <i>
                  <Icon aria-hidden="true" />
                </i>
                <span>{name}</span>
              </Link>
            ))}
            <button type="button" aria-label="Help" title="Help" aria-haspopup="dialog" onClick={() => open('guide')}>
              <i>
                <CircleHelp aria-hidden="true" />
              </i>
              <span>Help</span>
            </button>
          </div>
        </nav>
        <main id="workspace" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
      {utility && <UtilitySheet key={utility} kind={utility} close={() => setOverlay(null)} />}
    </div>
  );
}
