import type { Section } from './sections';

const layouts = {
  obfuscate: { board: 'source-board', slots: ['src-job', 'src-profile', 'src-receipt'] },
  vault: { board: 'station-board vt-app', slots: ['station-work', 'station-info', 'instrument-limit mint-card', 'station-flow', 'station-note'] },
  usages: { board: 'ledger-board', slots: ['usage-totals', 'usage-mix', 'usage-in mint-card', 'usage-out', 'usage-ledger'] },
};
export function ToolSkeleton({ section }: { section: Exclude<Section, { id: 'dashboard' }> }) {
  const { board, slots } = layouts[section.id];
  return <div className={board} role="status" aria-label={`Opening ${section.label}`}>
    {slots.map(slot => <div key={slot} className={`ws-panel sk-card tool-slot ${slot}`} aria-hidden="true">
      <i className="sk-shape" /><b className="sk-shape" />
    </div>)}
  </div>;
}
