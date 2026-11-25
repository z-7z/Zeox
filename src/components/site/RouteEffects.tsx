import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { tools } from '../orbit/tools';

/** Announce the destination and move focus across both layouts, including hash links. */
export function RouteEffects() {
  const { pathname, hash, key } = useLocation();
  const previous = useRef(key);
  useEffect(() => {
    const path = pathname.toLowerCase().replace(/\/$/, '') || '/';
    const name =
      path === '/'
        ? 'Main'
        : path === '/login'
          ? 'Log in'
          : (tools.find((t) => t.url === path)?.name ?? 'Page not found');
    document.title = `${name === 'Obfuscator' ? 'Lua Obfuscator' : name} — ZeoxFucator`;
    const target = hash && document.getElementById(hash.slice(1));
    if (target) {
      target.focus({ preventScroll: true });
      target.scrollIntoView();
    } else if (previous.current !== key) {
      document.querySelector('main')?.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
    previous.current = key;
  }, [pathname, hash, key]);
  return null;
}
