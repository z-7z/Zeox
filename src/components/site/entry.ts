import { workspacePages } from '../orbit/navigation';

// A cold bookmark may resume a known internal page after preview entry. The
// public calls to action have no return target and always land on Dashboard.
export function entryDestination(state: unknown) {
  const dest = (state as { resume?: { pathname?: string; search?: string; hash?: string } } | null)?.resume;
  if (typeof dest?.pathname !== 'string') return '/dashboard';
  const path = dest.pathname.toLowerCase().replace(/\/$/, '');
  const page = workspacePages.find((t) => t.url === path);
  if (!page) return '/dashboard';
  return {
    pathname: page.url,
    search: typeof dest.search === 'string' ? dest.search : '',
    hash: typeof dest.hash === 'string' ? dest.hash : '',
  };
}
