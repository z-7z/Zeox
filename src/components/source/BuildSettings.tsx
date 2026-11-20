import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import type { Options } from '../../lib/source/compact';
import type { SourceSession } from './session';

const transforms: { key: keyof Options; label: string; hint: string }[] = [
  { key: 'encodeText', label: 'Encode text literals', hint: 'Use byte escapes for plain strings.' },
  { key: 'removeComments', label: 'Remove comments', hint: 'Keep directives and license notices.' },
  { key: 'compactSpacing', label: 'Compact spacing', hint: 'Trim unnecessary whitespace.' },
];

export function BuildSettings({ tool }: { tool: SourceSession }) {
  return <details className="src-settings">
    <summary><SlidersHorizontal size={15} aria-hidden="true" />Build settings
      <span className="src-option-count">{transforms.filter(({ key }) => tool.options[key]).length} enabled</span><ChevronDown className="src-chevron" size={15} aria-hidden="true" /></summary>
    <fieldset className="src-options"><legend className="db-sr">Source transformations</legend>
      {transforms.map(({ key, label, hint }) => <label key={key}>
        <span><strong id={`opt-${key}`}>{label}</strong><small id={`hint-${key}`}>{hint}</small></span>
        <input type="checkbox" checked={tool.options[key]} aria-labelledby={`opt-${key}`} aria-describedby={`hint-${key}`} onChange={e => tool.configure(key, e.target.checked)} />
      </label>)}
    </fieldset>
  </details>;
}
