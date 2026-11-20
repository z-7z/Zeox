import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, Check, Copy, FileOutput } from 'lucide-react';
import { PanelHeader } from '../workspace/PanelHeader';
import { byteLength } from '../../lib/source/compact';
import { formatSize } from '../../lib/vault/container';
import { CodeEditor, type EditorHandle } from './CodeEditor';

interface Props { result: string | null; name: string; notify: (message: string) => void }
export function OutputFile({ result, name, notify }: Props) {
  const preview = useRef<EditorHandle>(null), [url, setUrl] = useState('');
  useEffect(() => {
    if (result === null) { setUrl(''); return; }
    const next = URL.createObjectURL(new Blob([result], { type: 'text/plain;charset=utf-8' }));
    setUrl(next); return () => URL.revokeObjectURL(next);
  }, [result]);
  async function copy() {
    if (result === null) return;
    try { await navigator.clipboard.writeText(result); notify('Output copied to clipboard.'); }
    catch { preview.current?.selectAll(); notify('Output selected. Use your device’s copy command.'); }
  }
  return <section className="glass-card ws-full-row src-artifact" aria-labelledby="artifact-title">
    <PanelHeader id="artifact-title" title="Output file" icon={FileOutput} meta={result === null ? 'Not built' : undefined} bar>
      {result !== null && <><button className="ws-button" onClick={copy}><Copy size={13} />Copy</button>
        {url && <a className="ws-button" download={name} href={url}><ArrowDownToLine size={13} />Download</a>}</>}
    </PanelHeader>
    {result === null ? <p className="src-pending">Build to preview and download a separate file.</p> : <>
      <div className="src-surface"><div className="src-filebar"><FileOutput size={13} /><code title={name}>{name}</code><span>Read only</span></div>
        <CodeEditor key={name} ref={preview} value={result} label="Build output" filename={name} readOnly /></div>
      <p className="src-result-status" role="status"><Check size={13} />Build complete <i />{formatSize(byteLength(result))} · UTF-8</p>
    </>}
  </section>;
}
