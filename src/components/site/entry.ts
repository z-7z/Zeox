import { tools } from '../orbit/tools';

// A cold bookmark may resume a *known internal* tool after preview entry. The
// public calls to action have no return target and always land on Dashboard.
export function entryDestination(state: unknown) {
  const dest = (state as { resume?: { pathname?: string; search?: string; hash?: string } } | null)?.resume;
  if (typeof dest?.pathname !== 'string') return '/dashboard';
  const path = dest.pathname.toLowerCase().replace(/\/$/, '');
  const tool = tools.find((t) => t.url === path);
  if (!tool) return '/dashboard';
  return {
    pathname: tool.url,
    search: typeof dest.search === 'string' ? dest.search : '',
    hash: typeof dest.hash === 'string' ? dest.hash : '',
  };
}
