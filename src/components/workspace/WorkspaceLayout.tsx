import { Suspense, useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { Outlet, useLocation, useOutletContext } from 'react-router-dom';
import { DashboardSkeleton } from '../dashboard/Skeleton';
import { Shell } from './Shell';
import { ToolSkeleton } from './ToolSkeleton';
import { sectionFor } from './sections';
import { useMotion } from './motion';
import './material.css';
import './panels.css';
import './workspace.css';

interface PageState { notify: (message: string) => void; motion: boolean }
export const useWorkspacePage = () => useOutletContext<PageState>();

export function WorkspaceLayout() {
  const { pathname } = useLocation(), active = sectionFor(pathname), motion = useMotion();
  const [notice, setNotice] = useState('');
  const timer = useRef<number>(), previous = useRef(pathname);
  function notify(message: string) {
    window.clearTimeout(timer.current); setNotice(message); timer.current = window.setTimeout(() => setNotice(''), 3200);
  }
  useEffect(() => {
    document.title = `${active.label} — Zeox Workspace`;
    if (previous.current !== pathname) {
      previous.current = pathname; setNotice('');
      document.getElementById('workspace-main')?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    return () => window.clearTimeout(timer.current);
  }, [active, pathname]);
  return <Shell active={active} motion={motion}>
    <Suspense fallback={active.id === 'dashboard' ? <DashboardSkeleton /> : <ToolSkeleton section={active} />}>
      <Outlet context={{ notify, motion: motion.enabled } satisfies PageState} />
    </Suspense>
    {notice && <div className="ws-toast" role="status"><Check size={14} />{notice}</div>}
  </Shell>;
}
