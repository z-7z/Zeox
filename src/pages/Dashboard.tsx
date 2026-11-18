import { ArrowDownToLine, CalendarDays, RefreshCw } from 'lucide-react';
import { FunnelCard, OrdersCard } from '../components/dashboard/Charts';
import { ActionsCard, SalesCard, TeamCard, TrafficCard } from '../components/dashboard/Widgets';
import { DashboardSkeleton } from '../components/dashboard/Skeleton';
import { PageHeading } from '../components/workspace/PageHeading';
import { MotionGrid } from '../components/workspace/motion';
import { useWorkspacePage } from '../components/workspace/WorkspaceLayout';

export function Dashboard() {
  const { data, error, refresh, invites, open, exportSales, motion } = useWorkspacePage();
  return <>
    <PageHeading title="Overview" eyebrow="Workspace analytics" badge="Demo data" actions={<>
      <span className="ws-period"><CalendarDays size={13} />Last {data?.periodDays ?? 30} days</span>
      <button className="ws-button" onClick={() => open('downloads')} aria-label="Open downloads"><ArrowDownToLine size={14} />Downloads</button></>} />
    {error ? <section className="db-error" role="alert"><h2>Overview unavailable</h2><p>The local data snapshot could not be loaded.</p>
      <button className="subtle-button" onClick={refresh}><RefreshCw size={14} />Try again</button></section>
      : data ? <MotionGrid enabled={motion}><FunnelCard data={data} open={open} /><OrdersCard data={data} open={open} />
        <TrafficCard data={data} open={open} /><TeamCard count={invites} open={open} /><SalesCard data={data} open={open} /><ActionsCard open={open} exportSales={exportSales} /></MotionGrid>
        : <DashboardSkeleton />}
  </>;
}
