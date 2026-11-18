import { useState } from 'react';
import { byteLength, compactSource, SOURCE_LIMIT, type Options } from '../../lib/source/compact';
import { useUsage } from '../workspace/UsageSession';

const example = `--!strict\nlocal settings = {}\nsettings.name = "Orbit"\nsettings.speed = 16\nreturn settings`;
export function useSourceSession() {
  const { record } = useUsage();
  const [source, setSource] = useState(example);
  const [name, setName] = useState('settings.luau');
  const [documentId, setDocumentId] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [issue, setIssue] = useState<{ field: 'source' | 'build'; message: string } | null>(null);
  const [options, setOptions] = useState<Options>({ removeComments: true, compactSpacing: true, encodeText: true });

  function reject(message: string) {
    setResult(null); setIssue({ field: 'source', message: `${message} Your current source is unchanged.` });
  }
  // A named replacement (Open, Example, Clear) starts a new undo history,
  // even when its filename and text happen to match the current document.
  function edit(text: string, filename?: string) {
    if (text.length > SOURCE_LIMIT || byteLength(text) > SOURCE_LIMIT) { reject('Source must be 512 KiB or smaller.'); return; }
    setSource(text); setIssue(null); setResult(null);
    if (filename !== undefined) { setName(filename); setDocumentId(id => id + 1); }
  }
  function configure(key: keyof Options, enabled: boolean) { setOptions(prev => ({ ...prev, [key]: enabled })); setResult(null); setIssue(null); }
  function build() {
    try { const output = compactSource(source, options); setResult(output); setIssue(null); record('compact', byteLength(source), byteLength(output)); }
    catch (error) { setResult(null); setIssue({ field: 'build', message: error instanceof Error ? error.message : 'Could not compact this source.' }); }
  }
  return { name, documentId, source, options, result, issue, edit, configure, build, reject, sample: () => edit(example, 'settings.luau') };
}
export type SourceSession = ReturnType<typeof useSourceSession>;
