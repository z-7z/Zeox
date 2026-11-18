import { ArrowRight, CornerDownLeft } from 'lucide-react';
import type { Options } from '../../lib/source/compact';
import type { SourceSession } from './session';

const transforms: { key: keyof Options; label: string; hint: string }[] = [
  { key: 'encodeText', label: 'Encode text literals', hint: 'Use byte escapes for plain strings.' },
  { key: 'removeComments', label: 'Remove comments', hint: 'Keep directives and license notices.' },
  { key: 'compactSpacing', label: 'Compact spacing', hint: 'Trim unnecessary whitespace.' },
];

export function BuildSettings({ tool, reading }: { tool: SourceSession; reading: boolean }) {
  const count = transforms.filter(({ key }) => tool.options[key]).length;
  return <section className="glass-card src-panel src-recipe" aria-labelledby="recipe-title">
    <header className="src-panel-head"><span className="src-step" aria-hidden="true">02</span><h2 id="recipe-title">Build settings</h2><small>{count} of 3 on</small></header>
    <fieldset className="src-transforms" disabled={reading}><legend className="db-sr">Source transformations</legend>
      {transforms.map(({ key, label, hint }) => <label key={key} className="src-transform">
        <span><strong id={`opt-${key}`}>{label}</strong><small id={`hint-${key}`}>{hint}</small></span>
        <input type="checkbox" checked={tool.options[key]} aria-labelledby={`opt-${key}`} aria-describedby={`hint-${key}`} onChange={e => tool.configure(key, e.target.checked)} />
      </label>)}
    </fieldset>
    {tool.issue?.field === 'build' && <p className="src-error" role="alert">{tool.issue.message}</p>}
    <div className="src-run"><button className="ws-button ws-primary" onClick={tool.build} disabled={reading} aria-keyshortcuts="Control+Enter Meta+Enter">Build output <ArrowRight size={14} /></button>
      <span className="src-hotkey" title="Ctrl+Enter or Command+Enter while editing"><span>Ctrl / ⌘</span><CornerDownLeft size={11} /></span></div>
  </section>;
}
