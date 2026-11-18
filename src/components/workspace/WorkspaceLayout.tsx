import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { Outlet, useLocation, useOutletContext } from 'react-router-dom';
import { Shell } from '../dashboard/Shell';
import { WorkspaceDialog } from '../dashboard/WorkspaceDialog';
import { downloadSales } from '../dashboard/downloads';
import { useOverview, useWorkspace, type OpenPanel, type PanelId } from '../dashboard/model';
import { sectionFor } from './sections';
import { useMotion } from './motion';
import '../dashboard/dashboard.css';
import './workspace.css';

interface PageState extends ReturnType<typeof useOverview> { open: OpenPanel; exportSales: () => void; notify: (msg: string) => void; invites: number; motion: boolean }
export const useWorkspacePage = () => useOutletContext<PageState>();

export function WorkspaceLayout() {
  const { pathname } = useLocation(), active = sectionFor(pathname), motion = useMotion();
  const state = useWorkspace();
  const [panel, setPanel] = useState<{ id: PanelId; row?: number } | null>(null);
  const overview = useOverview(active.id === 'dashboard' || (!!panel && ['funnel', 'channels', 'sales', 'traffic', 'downloads'].includes(panel.id)));
  const [notice, setNotice] = useState(''), [seen, setSeen] = useState<string | null>(null);
  const timer = useRef<number>(), previous = useRef(pathname);
  const open: OpenPanel = useCallback((id, row) => { setPanel({ id, row }); setNotice(''); }, []);
  const close = useCallback(() => setPanel(null), []);
  function notify(message: string) { window.clearTimeout(timer.current); setNotice(message); timer.current = window.setTimeout(() => setNotice(''), 3200); }
  function exportSales() { if (overview.data) { downloadSales(overview.data); notify('Hourly sales CSV downloaded.'); } }
  useEffect(() => {
    function keydown(e: KeyboardEvent) {
      if (document.querySelector('dialog[open]')) return;
      const typing = e.target instanceof HTMLElement && !!e.target.closest('input, textarea, select, [contenteditable="true"]');
      if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey)) { e.preventDefault(); open('search'); }
    }
    window.addEventListener('keydown', keydown);
    return () => { window.removeEventListener('keydown', keydown); window.clearTimeout(timer.current); };
  }, [open]);
  useEffect(() => {
    document.title = `${active.label} — Zeox Workspace`;
    if (previous.current !== pathname) {
      previous.current = pathname; close(); setNotice('');
      document.getElementById('workspace-main')?.focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [active, pathname, close]);
  useEffect(() => { if (panel?.id === 'activity') setSeen(state.workspace.activity[0]); }, [panel?.id, state.workspace.activity]);
  const page: PageState = { ...overview, open, notify, exportSales, invites: state.workspace.invites.length, motion: motion.enabled };
  return <Shell active={active} open={open} motion={motion} unread={seen !== state.workspace.activity[0]} workspaceName={state.workspace.name}>
    <Suspense fallback={<p role="status" className="ws-loading">Opening {active.label}…</p>}><Outlet context={page} /></Suspense>
    {panel && <WorkspaceDialog {...state} {...panel} {...{ open, close, notify, exportSales, notice }} data={overview.data} refresh={overview.refresh} />}
    {notice && !panel && <div className="db-toast" role="status"><Check size={14} />{notice}</div>}
  </Shell>;
}
