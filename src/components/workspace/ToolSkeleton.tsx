import type { Section } from './sections';

type ToolSection = Exclude<Section, { id: 'dashboard' }>;
function Tile({ shape, wide }: { shape: 'editor' | 'settings' | 'output' | 'metrics' | 'ledger' | 'bench' | 'engine' | 'log'; wide?: boolean }) {
  return <div aria-hidden="true" className={`glass-card sk-card panel-inset tool-placeholder ph-${shape}${wide ? ' ws-full-row' : ''}`}>
    <i className="sk-shape" /><span className="sk-shape" />
  </div>;
}

// Keep the shell and working surfaces in place while the relevant tool chunk loads.
// Only Dashboard has the illustrated six-slot overview and its offline export.
export function ToolSkeleton({ section }: { section: ToolSection }) {
  return <div className="ws-pair-grid" role="status" aria-label={`Opening ${section.label}`}>
    {section.id === 'vault' ? <><Tile shape="bench" /><div className="vault-side-grid"><Tile shape="engine" /><Tile shape="log" /></div></>
      : section.id === 'obfuscate' ? <><Tile shape="editor" /><Tile shape="settings" /><Tile shape="output" wide /></>
      : <><Tile shape="metrics" /><Tile shape="metrics" /><Tile shape="ledger" wide /></>}
  </div>;
}
