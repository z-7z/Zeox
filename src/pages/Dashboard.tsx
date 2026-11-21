import { useMemo, useState } from 'react';
import { ChartDetail, type Inspect, type Selection } from '../components/dashboard/ChartDetail';
import { SignalPlot } from '../components/dashboard/SignalPlot';
import {
  BatchTape,
  FormatBars,
  Launcher,
  LossCard,
  MixIndex,
  SessionTile,
  YieldCard,
} from '../components/dashboard/DeskTiles';
import { downloadSkeleton } from '../components/dashboard/Skeleton';
import { sampleReport } from '../components/dashboard/sample';
import { useWorkspacePage } from '../components/workspace/WorkspaceLayout';
import '../components/dashboard/overview.css';

export function Dashboard() {
  const { period, setPeriod, notify } = useWorkspacePage(),
    report = useMemo(() => sampleReport(period), [period]);
  const [detail, setDetail] = useState<Selection | null>(null),
    inspect: Inspect = (chart, row) => setDetail({ chart, row });
  return (
    <>
      <div className="signal-board">
        <SignalPlot report={report} setPeriod={setPeriod} inspect={inspect} />
        <BatchTape report={report} inspect={inspect} />
        <Launcher
          download={() => {
            downloadSkeleton();
            notify('Skeleton HTML downloaded.');
          }}
        />
        <YieldCard report={report} />
        <LossCard report={report} />
        <MixIndex report={report} inspect={inspect} />
        <SessionTile />
        <FormatBars report={report} inspect={inspect} />
      </div>
      {detail && <ChartDetail selection={detail} report={report} close={() => setDetail(null)} />}
    </>
  );
}
