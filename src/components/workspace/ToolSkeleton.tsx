import type { Section } from './sections';
import '../vault/layout.css';

type ToolSection = Exclude<Section, { id: 'dashboard' }>;
function Tile({ shape }: { shape: 'metrics' | 'ledger' | 'engine' | 'log' }) {
  return <div aria-hidden="true" className={`ws-panel sk-card panel-inset tool-placeholder ph-${shape}`}>
    <i className="sk-shape" /><span className="sk-shape" />
  </div>;
}

// Mirror the actual intake, report or workbench, including on cold direct entries.
export function ToolSkeleton({ section }: { section: ToolSection }) {
  if (section.id === 'obfuscate') return <div className="ws-file-layout" role="status" aria-label="Opening Obfuscate">
    <div className="ws-panel sk-card ph-upload" aria-hidden="true"><div className="ph-intake"><i className="sk-shape" /><b className="sk-shape" /><span className="sk-shape" /></div><div className="ph-controls"><i className="sk-shape" /><span className="sk-shape" /></div></div>
  </div>;
  if (section.id === 'vault') return <div className="vault-page" role="status" aria-label="Opening Vault">
    <div className="ws-panel sk-card vt-workbench" aria-hidden="true">
      <div className="ph-bench-head"><i className="sk-shape" /><span className="sk-shape" /></div>
      <div className="vt-bench-fields">
        <div className="vt-file-step"><i className="sk-shape ph-step" /><div className="sk-shape vt-drop" /></div>
        <div className="vt-key-step"><i className="sk-shape ph-step" /><div className="sk-shape ph-input" /><i className="sk-shape ph-hint" /></div>
      </div>
      <div className="ph-bench-foot"><i className="sk-shape" /><span className="sk-shape" /></div>
    </div>
    <div className="vault-side-grid"><Tile shape="engine" /><Tile shape="log" /></div>
  </div>;
  return <div className="ws-pair-grid usage-page" role="status" aria-label="Opening Usages">
    <Tile shape="metrics" /><Tile shape="metrics" /><Tile shape="ledger" />
  </div>;
}
