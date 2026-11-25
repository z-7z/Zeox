import { useEffect, useRef, useState } from 'react';
import { compactSource, SOURCE_LIMIT, type Options } from '../../lib/source/compact';
import { useUsage } from '../workspace/UsageSession';

interface Attachment { name: string; size: number; text: string }
export interface SourceArtifact { name: string; blob: Blob }
type Issue = { field: 'file' | 'build'; message: string };

async function readScript(files: File[]): Promise<Attachment> {
  if (files.length !== 1) throw new Error('Attach one script at a time.');
  const [file] = files;
  if (!/\.(lua|luau)$/i.test(file.name)) throw new Error('Choose a .lua or .luau file. For Roblox models and places, use File encryption.');
  if (file.size > SOURCE_LIMIT) throw new Error('The file must be 512 KiB or smaller.');
  let text: string;
  try {
    // Preserve line endings and any BOM. Reject invalid UTF-8 instead of silently replacing bytes.
    text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(await file.arrayBuffer());
  } catch { throw new Error('Could not read this file as UTF-8 text.'); }
  if (text.includes('\0')) throw new Error('This is not a text script. Choose a UTF-8 file.');
  if (!text.trim()) throw new Error('This script is empty. Choose a file with Lua or Luau source.');
  return { text, size: file.size, name: file.name.replace(/[\\/\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g, '_') };
}

export function useSourceSession() {
  const { record } = useUsage();
  const [script, setScript] = useState<Attachment | null>(null);
  const [result, setResult] = useState<SourceArtifact | null>(null);
  const [issue, setIssue] = useState<Issue | null>(null);
  const [options, setOptions] = useState<Options>({ removeComments: true, compactSpacing: true, encodeText: true });
  const [reading, setReading] = useState(false), revision = useRef(0);
  useEffect(() => () => { revision.current++; }, []);

  async function attach(files: File[]) {
    if (!files.length) return; // A dismissed chooser isn't a replacement.
    const id = ++revision.current;
    setReading(true); setResult(null); setIssue(null);
    try {
      const next = await readScript(files);
      if (id === revision.current) setScript(next);
    } catch (error) {
      if (id === revision.current) setIssue({ field: 'file', message: error instanceof Error ? error.message : 'Could not read this file.' });
    } finally { if (id === revision.current) setReading(false); }
  }
  function remove() {
    revision.current++; setReading(false); setScript(null); setIssue(null); setResult(null);
  }
  function configure(key: keyof Options, enabled: boolean) {
    setOptions(prev => ({ ...prev, [key]: enabled })); setResult(null);
    setIssue(prev => prev?.field === 'build' ? null : prev);
  }
  function build() {
    if (!script || reading || result) return;
    try {
      const blob = new Blob([compactSource(script.text, options)], { type: 'text/plain;charset=utf-8' });
      const name = script.name.replace(/\.(luau?)$/i, options.encodeText ? '.obf.$1' : '.compact.$1');
      setResult({ name, blob }); setIssue(null); record('compact', script.size, blob.size);
    } catch (error) {
      setIssue({ field: 'build', message: error instanceof Error ? error.message : 'Could not build this script.' });
    }
  }
  // File contents stay in the controller. The page only needs attachment metadata and a downloadable artifact.
  return { file: script && { name: script.name, size: script.size }, reading, options, result, issue, attach, remove, configure, build };
}
export type SourceSession = ReturnType<typeof useSourceSession>;
