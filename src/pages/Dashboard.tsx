import { useState } from 'react';
import { ChartDetail, type Selection } from '../components/dashboard/ChartDetail';
import { FormatsCard, FunnelCard } from '../components/dashboard/Charts';
import { downloadSkeleton } from '../components/dashboard/Skeleton';
import { ActionsCard, InputsCard, SessionCard, VolumeCard } from '../components/dashboard/Widgets';
import type { Inspect } from '../components/dashboard/sample';
import { MotionGrid } from '../components/workspace/motion';
import { useWorkspacePage } from '../components/workspace/WorkspaceLayout';
import '../components/dashboard/overview.css';

export function Dashboard() {
  const { motion, notify } = useWorkspacePage();
  const [detail, setDetail] = useState<Selection | null>(null);
  const inspect: Inspect = (chart, row) => setDetail({ chart, row });
  return <><MotionGrid enabled={motion}>
    <FunnelCard inspect={inspect} /><FormatsCard inspect={inspect} />
    <InputsCard inspect={inspect} /><SessionCard /><VolumeCard inspect={inspect} />
    <ActionsCard download={() => { downloadSkeleton(); notify('Skeleton HTML downloaded.'); }} />
  </MotionGrid>{detail && <ChartDetail selection={detail} close={() => setDetail(null)} />}</>;
}
