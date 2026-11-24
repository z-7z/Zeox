import { AlignLeft, MessageSquareOff, Type } from 'lucide-react';
import type { Options } from '../../lib/source/compact';
import type { SourceSession } from './session';

const transforms = [
  { key: 'encodeText', label: 'Encode text literals', hint: 'Write plain strings as byte escapes.', icon: Type },
  { key: 'removeComments', label: 'Remove comments', hint: 'Keep directives and license notices.', icon: MessageSquareOff },
  { key: 'compactSpacing', label: 'Compact spacing', hint: 'Trim unnecessary whitespace.', icon: AlignLeft },
] satisfies { key: keyof Options; label: string; hint: string; icon: typeof Type }[];

export function BuildSettings({ tool }: { tool: SourceSession }) {
  return <fieldset className="src-options"><legend className="db-sr">Source transformations</legend>
    {transforms.map(({ key, label, hint, icon: Icon }) => <label key={key}>
      <Icon size={17} aria-hidden="true" />
      <span><strong id={`opt-${key}`}>{label}</strong><small id={`hint-${key}`}>{hint}</small></span>
      <input type="checkbox" checked={tool.options[key]} aria-labelledby={`opt-${key}`} aria-describedby={`hint-${key}`} onChange={e => tool.configure(key, e.target.checked)} />
    </label>)}
  </fieldset>;
}
