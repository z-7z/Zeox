import type { Section } from './sections';

const station = ['station-work', 'station-info', 'instrument-limit mint-card', 'station-flow', 'station-note'];
const ledger = ['usage-totals', 'usage-mix', 'usage-in mint-card', 'usage-out', 'usage-ledger'];
export function ToolSkeleton({ section }: { section: Exclude<Section, { id: 'dashboard' }> }) {
  const report = section.id === 'usages';
  return (
    <div
      className={
        report ? 'ledger-board' : section.id === 'vault' ? 'station-board vt-app' : 'station-board source-board'
      }
      role="status"
      aria-label={`Opening ${section.label}`}
    >
      {(report ? ledger : station).map((slot) => (
        <div key={slot} className={`ws-panel sk-card tool-slot ${slot}`} aria-hidden="true">
          <i className="sk-shape" />
          <b className="sk-shape" />
        </div>
      ))}
    </div>
  );
}
