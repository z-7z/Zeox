import { useEffect, useMemo, useRef, useState } from 'react';
import { FileCode2, FolderOpen, RotateCcw } from 'lucide-react';
import { CodeEditor } from '../components/source/CodeEditor';
import { BuildSettings } from '../components/source/BuildSettings';
import { OutputFile } from '../components/source/OutputFile';
import { PageHeading } from '../components/workspace/PageHeading';
import { useSourceTool } from '../components/workspace/ToolSessions';
import { useWorkspacePage } from '../components/workspace/WorkspaceLayout';
import { byteLength, SOURCE_LIMIT } from '../lib/source/compact';
import { formatSize } from '../lib/vault/container';
import '../components/source/workshop.css';

export function Obfuscate() {
  const tool = useSourceTool(), { notify } = useWorkspacePage();
  const picker = useRef<HTMLInputElement>(null), readId = useRef(0);
  const [reading, setReading] = useState(false);
  useEffect(() => () => { readId.current++; }, []);
  async function readFile(file: File) {
    const id = ++readId.current; setReading(false);
    if (!/\.(lua|luau)$/i.test(file.name)) { tool.reject('Open a .luau or .lua source file. For Roblox places or models, use Vault.'); return; }
    if (file.size > SOURCE_LIMIT) { tool.reject('Source must be 512 KiB or smaller.'); return; }
    setReading(true);
    try {
      const text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(await file.arrayBuffer());
      if (id !== readId.current) return;
      if (text.includes('\0')) tool.reject('This is not a text script. Choose UTF-8 source.');
      else tool.edit(text, file.name.replace(/[\\/\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g, '_'));
    } catch { if (id === readId.current) tool.reject('Could not read this file as UTF-8 text.'); }
    finally { if (id === readId.current) setReading(false); }
  }
  const { name, source } = tool;
  const stats = useMemo(() => ({ lines: source ? source.split(/\r\n|\r|\n/).length : 0, size: formatSize(byteLength(source)) }), [source]);
  const outputName = name.replace(/\.(luau?)$/i, tool.options.encodeText ? '.obf.$1' : '.compact.$1');
  return <div className="src-studio">
    <PageHeading title="Obfuscate" eyebrow="Source studio" description="Build a separate copy of your Lua or Luau script."
      actions={<span className="src-spec">UTF-8 <i />512 KiB max</span>} />
    <div className="src-desk">
      <section className="glass-card src-panel src-input" aria-label="Source editor" aria-busy={reading}>
        <header className="src-panel-head"><span className="src-step" aria-hidden="true">01</span><h2>Source</h2>
          <div className="src-file-actions"><button className="src-quiet" onClick={tool.sample} disabled={reading} aria-label="Load example source">Example</button>
            <button className="ws-button" disabled={reading} onClick={() => picker.current?.click()}><FolderOpen size={13} />{reading ? 'Reading…' : 'Open file'}</button></div></header>
        <input ref={picker} hidden type="file" disabled={reading} accept=".lua,.luau" aria-label="Open Lua or Luau source" onChange={e => { const file = e.currentTarget.files?.[0]; e.currentTarget.value = ''; if (file) void readFile(file); }} />
        <div className="src-surface"><div className="src-filebar"><FileCode2 size={13} /><code title={name}>{name}</code><span>{/\.luau$/i.test(name) ? 'Luau' : 'Lua 5.1'}</span></div>
          <CodeEditor key={tool.documentId} value={source} filename={name} label="Source code" disabled={reading} onEdit={tool.edit} onBuild={tool.build} onLimit={() => tool.reject('Source must be 512 KiB or smaller.')} /></div>
        <footer className="src-input-foot"><span>{stats.lines} {stats.lines === 1 ? 'line' : 'lines'} <i />{stats.size}<span className="src-mobile-cap"> / 512 KiB</span></span><button className="src-quiet" disabled={!source || reading} onClick={() => tool.edit('', 'untitled.luau')} aria-label="Clear source"><RotateCcw size={11} />Clear</button></footer>
        {tool.issue?.field === 'source' && <p className="src-error" role="alert">{tool.issue.message}</p>}
      </section>
      <BuildSettings tool={tool} reading={reading} />
      <OutputFile result={tool.result} name={outputName} notify={notify} />
    </div>
  </div>;
}
