import { FunnelRibbon } from './FunnelRibbon';
import './skeleton.css';

const Bar = ({ name = '' }: { name?: string }) => <span className={`sk-shape ${name}`} />;
export function DashboardSkeleton() {
  return <div className="db-grid db-skeleton" role="status" aria-label="Loading overview">
    <span className="db-sr">Loading the workspace overview…</span>
    {['funnel', 'pie'].map(kind => <div className="db-card status-card sk-card" aria-hidden="true" key={kind}>
      <div className="sk-head"><Bar name="sk-metric" /><Bar name="sk-caption" /><Bar name="sk-delta" /></div>
      {kind === 'funnel' ? <div className="sk-funnel"><FunnelRibbon placeholder shares={[1, .53, .23, .08]} /></div> : <div className="sk-pie"><Bar /><div>{[1, 2, 3, 4, 5].map(n => <Bar key={n} />)}</div></div>}
    </div>)}
    {['traffic', 'team', 'heat', 'actions'].map(kind => <div key={kind} className={`db-card widget-card sk-card sk-${kind}`} aria-hidden="true">
      <Bar name="sk-title" />
      {kind === 'team' ? <div className="sk-center"><div><Bar /><Bar /><Bar /></div><Bar name="sk-caption" /><Bar name="sk-title" /></div>
        : kind === 'heat' ? <><Bar name="sk-metric" /><Bar name="sk-matrix" /><Bar name="sk-title" /></>
        : <div className="sk-rows">{Array.from({ length: kind === 'traffic' ? 5 : 4 }, (_, i) => <div key={i}><Bar name="sk-name" /><Bar name="sk-rule" /></div>)}</div>}
    </div>)}
  </div>;
}
