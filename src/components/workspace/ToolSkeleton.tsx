import type { Section } from './sections';

type ToolSection = Exclude<Section, { id: 'dashboard' }>;
function Tile({ shape, wide }: { shape: 'metrics' | 'ledger' | 'bench' | 'engine' | 'log'; wide?: boolean }) {
  return <div aria-hidden="true" className={`glass-card sk-card panel-inset tool-placeholder ph-${shape}${wide ? ' ws-full-row' : ''}`}>
    <i className="sk-shape" /><span className="sk-shape" />
  </div>;
}

// Mirror the actual intake, report or workbench, including on cold direct entries.
export function ToolSkeleton({ section }: { section: ToolSection }) {
  if (section.id === 'obfuscate') return <div className="ws-file-layout" role="status" aria-label="Opening Obfuscate">
    <div className="glass-card sk-card ph-intake" aria-hidden="true"><i className="sk-shape" /><b className="sk-shape" /><span className="sk-shape" /><i className="sk-shape" /></div>
  </div>;
  return <div className="ws-pair-grid" role="status" aria-label={`Opening ${section.label}`}>
    {section.id === 'vault' ? <><Tile shape="bench" /><div className="vault-side-grid"><Tile shape="engine" /><Tile shape="log" /></div></>
      : <><Tile shape="metrics" /><Tile shape="metrics" /><Tile shape="ledger" wide /></>}
  </div>;
}
