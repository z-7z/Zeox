import type { Section } from './sections';

type ToolSection = Exclude<Section, { id: 'dashboard' }>;
function Tile({ shape }: { shape: 'metrics' | 'ledger' | 'bench' | 'engine' | 'log' }) {
  return <div aria-hidden="true" className={`ws-panel sk-card panel-inset tool-placeholder ph-${shape}`}>
    <i className="sk-shape" /><span className="sk-shape" />
  </div>;
}

// Mirror the actual intake, report or workbench, including on cold direct entries.
export function ToolSkeleton({ section }: { section: ToolSection }) {
  if (section.id === 'obfuscate') return <div className="ws-file-layout" role="status" aria-label="Opening Obfuscate">
    <div className="ws-panel sk-card ph-upload" aria-hidden="true"><div className="ph-intake"><i className="sk-shape" /><b className="sk-shape" /><span className="sk-shape" /></div><div className="ph-controls"><i className="sk-shape" /><span className="sk-shape" /></div></div>
  </div>;
  return <div className={`ws-pair-grid${section.id === 'usages' ? ' usage-page' : ''}`} role="status" aria-label={`Opening ${section.label}`}>
    {section.id === 'vault' ? <><Tile shape="bench" /><div className="vault-side-grid"><Tile shape="engine" /><Tile shape="log" /></div></>
      : <><Tile shape="metrics" /><Tile shape="metrics" /><Tile shape="ledger" /></>}
  </div>;
}
