import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, RefreshCw } from 'lucide-react';
import { Shell } from '../components/dashboard/Shell';
import { FunnelCard, OrdersCard } from '../components/dashboard/Charts';
import { ActionsCard, SalesCard, TeamCard, TrafficCard } from '../components/dashboard/Widgets';
import { DashboardSkeleton } from '../components/dashboard/Skeleton';
import { WorkspaceDialog } from '../components/dashboard/WorkspaceDialog';
import { downloadSales } from '../components/dashboard/downloads';
import { useOverview, useWorkspace, type OpenPanel, type PanelId } from '../components/dashboard/model';
import '../components/dashboard/dashboard.css';

export function Dashboard() {
  const { data, error, refresh } = useOverview();
  const state = useWorkspace();
  const [panel, setPanel] = useState<{ id: PanelId; row?: number } | null>(null);
  const [notice, setNotice] = useState('');
  const [seen, setSeen] = useState<string | null>(null);
  const timer = useRef<number>();
  const open: OpenPanel = useCallback((id, row) => { setPanel({ id, row }); setNotice(''); }, []);
  const close = useCallback(() => setPanel(null), []);
  function notify(message: string) {
    window.clearTimeout(timer.current); setNotice(message);
    timer.current = window.setTimeout(() => setNotice(''), 3200);
  }
  function exportSales() {
    if (data) { downloadSales(data); notify('Hourly sales CSV downloaded.'); }
  }
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Overview — Zeox Workspace';
    function keydown(e: KeyboardEvent) {
      const typing = e.target instanceof HTMLElement && !!e.target.closest('input, textarea, select, [contenteditable="true"]');
      if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey)) {
        e.preventDefault(); open('search');
      }
    }
    window.addEventListener('keydown', keydown);
    return () => { document.title = previousTitle; window.removeEventListener('keydown', keydown); window.clearTimeout(timer.current); };
  }, [open]);
  useEffect(() => { if (panel?.id === 'activity') setSeen(state.workspace.activity[0]); }, [panel?.id, state.workspace.activity]);

  return <Shell open={open} unread={seen !== state.workspace.activity[0]} workspaceName={state.workspace.name}>
    {error ? <section className="db-error" role="alert"><h2>Overview unavailable</h2><p>The local data snapshot could not be loaded.</p>
      <button className="subtle-button" onClick={refresh}><RefreshCw size={14} />Try again</button></section>
      : data ? <div className="db-grid"><FunnelCard data={data} open={open} /><OrdersCard data={data} open={open} />
        <TrafficCard data={data} open={open} /><TeamCard count={state.workspace.invites.length} open={open} />
        <SalesCard data={data} open={open} /><ActionsCard open={open} exportSales={exportSales} /></div> : <DashboardSkeleton />}
    {panel && <WorkspaceDialog {...state} {...panel} {...{ open, close, data, notify, exportSales, refresh, notice }} />}
    {notice && !panel && <div className="db-toast" role="status"><Check size={14} />{notice}</div>}
  </Shell>;
}
