import { useState } from 'react';
import { byteLength, compactSource, SOURCE_LIMIT, type Options } from '../../lib/source/compact';
import { useUsage } from '../workspace/UsageSession';

const example = `--!strict\n-- Settings for a small game world.\nlocal settings = {\n    name  =  "Orbit",\n    speed =  16,\n}\n\nreturn settings\n`;
export function useSourceSession() {
  const { record } = useUsage();
  const [source, setSource] = useState(example);
  const [name, setName] = useState('settings.luau');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [options, setOptions] = useState<Options>({ removeComments: true, compactSpacing: true, encodeText: true });
  function edit(text: string, filename = name) {
    setError(''); setResult(null);
    if (text.length > SOURCE_LIMIT || byteLength(text) > SOURCE_LIMIT) { setError('Source must be 512 KiB or smaller.'); return; }
    setSource(text); setName(filename);
  }
  function configure(key: keyof Options, enabled: boolean) { setOptions(prev => ({ ...prev, [key]: enabled })); setResult(null); setError(''); }
  function build() {
    try { const output = compactSource(source, options); setResult(output); setError(''); record('compact', byteLength(source), byteLength(output)); }
    catch (issue) { setResult(null); setError(issue instanceof Error ? issue.message : 'Could not compact this source.'); }
  }
  return { name, source, options, result, error, edit, configure, build, sample: () => edit(example, 'settings.luau'),
    reject: (message: string) => { setResult(null); setError(`${message} Your current source is unchanged.`); } };
}
