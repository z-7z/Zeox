import { Suspense, useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { Outlet, useLocation, useOutletContext } from 'react-router-dom';
import { DashboardSkeleton } from '../dashboard/Skeleton';
import type { SamplePeriod } from '../dashboard/period';
import { SourceIntro } from '../source/SourceIntro';
import '../source/layout.css';
import { Shell } from './Shell';
import { ToolSkeleton } from './ToolSkeleton';
import { sectionFor } from './sections';
import { sourceLinkFor } from './sourceLinks';
import { useMotion } from './motion';
import './material.css';
import './panels.css';
import './workspace.css';

interface PageState { notify: (message: string) => void; motion: boolean; period: SamplePeriod; setPeriod: (p: SamplePeriod) => void }
export const useWorkspacePage = () => useOutletContext<PageState>();

export function WorkspaceLayout() {
  const { pathname, hash, key } = useLocation(), active = sectionFor(pathname), motion = useMotion();
  const [period, setPeriod] = useState<SamplePeriod>(30);
  const [notice, setNotice] = useState('');
  const timer = useRef<number>(), previous = useRef(key);
  function notify(message: string) {
    window.clearTimeout(timer.current); setNotice(message); timer.current = window.setTimeout(() => setNotice(''), 3200);
  }
  useEffect(() => {
    document.title = active.id === 'obfuscate' ? 'Lua Obfuscator — Zeox' : `${active.label} — Zeox Obfuscator`;
    if (previous.current !== key) {
      previous.current = key; setNotice('');
      // Let the lazy file tool resolve its own deep links after it mounts.
      if (active.id !== 'obfuscate' || !sourceLinkFor(hash)) {
        document.getElementById('workspace-main')?.focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    }
    return () => window.clearTimeout(timer.current);
  }, [active, hash, key]);
  return <Shell active={active} motion={motion} notify={notify}>
    {active.id === 'obfuscate' && <SourceIntro />}
    <Suspense fallback={active.id === 'dashboard' ? <DashboardSkeleton /> : <ToolSkeleton section={active} />}>
      <Outlet context={{ notify, motion: motion.enabled, period, setPeriod } satisfies PageState} />
    </Suspense>
    {notice && <div className="ws-toast" role="status"><Check size={14} />{notice}</div>}
  </Shell>;
}
