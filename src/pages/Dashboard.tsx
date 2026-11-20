import { useMemo, useState } from 'react';
import { ChartDetail, type Inspect, type Selection } from '../components/dashboard/ChartDetail';
import { ExportsMeter, FileGauge, Metrics, OperationMix, VolumeTrend } from '../components/dashboard/Charts';
import { downloadSkeleton } from '../components/dashboard/Skeleton';
import { ActionsCard, SessionCard } from '../components/dashboard/Widgets';
import { sampleReport } from '../components/dashboard/sample';
import { useWorkspacePage } from '../components/workspace/WorkspaceLayout';
import '../components/dashboard/overview.css';

export function Dashboard() {
  const { period, notify } = useWorkspacePage(), report = useMemo(() => sampleReport(period), [period]);
  const [detail, setDetail] = useState<Selection | null>(null);
  const inspect: Inspect = (chart, row) => setDetail({ chart, row });
  return <><div className="overview-grid">
    <Metrics report={report} /><VolumeTrend key={period} report={report} inspect={inspect} />
    <aside className="overview-side" aria-label="Workspace summary"><FileGauge report={report} inspect={inspect} /><ExportsMeter report={report} />
      <ActionsCard download={() => { downloadSkeleton(); notify('Skeleton HTML downloaded.'); }} /></aside>
    <div className="overview-notes"><SessionCard /><OperationMix report={report} inspect={inspect} /></div>
  </div>{detail && <ChartDetail selection={detail} report={report} close={() => setDetail(null)} />}</>;
}
