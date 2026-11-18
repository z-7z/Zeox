import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, ArrowRight, ArrowUpRight, Braces, Check, Code2, Copy, FileCode2, FolderOpen, SlidersHorizontal } from 'lucide-react';
import { PageHeading } from '../components/workspace/PageHeading';
import { useSourceTool } from '../components/workspace/ToolSessions';
import { useWorkspacePage } from '../components/workspace/WorkspaceLayout';
import { byteLength, SOURCE_LIMIT, type Options } from '../lib/source/compact';
import { formatSize } from '../lib/vault/container';

export function Obfuscate() {
  const s = useSourceTool(), { notify } = useWorkspacePage();
  const picker = useRef<HTMLInputElement>(null), preview = useRef<HTMLTextAreaElement>(null);
  const readId = useRef(0), [reading, setReading] = useState(false), [url, setUrl] = useState('');
  useEffect(() => () => { readId.current++; }, []);
  useEffect(() => {
    if (s.result === null) { setUrl(''); return; }
    const next = URL.createObjectURL(new Blob([s.result], { type: 'text/plain;charset=utf-8' })); setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [s.result]);
  async function readFile(file: File) {
    const id = ++readId.current; setReading(false);
    if (!/\.(lua|luau)$/i.test(file.name)) { s.reject('Open a .luau or .lua source file. For Roblox places or models, use Vault.'); return; }
    if (file.size > SOURCE_LIMIT) { s.reject('Source must be 512 KiB or smaller.'); return; }
    setReading(true);
    try {
      const text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(await file.arrayBuffer());
      if (id !== readId.current) return;
      if (text.includes('\0')) s.reject('This is not a text script. Choose UTF-8 source.');
      else s.edit(text, file.name.replace(/[\\/\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g, '_'));
    } catch { if (id === readId.current) s.reject('Could not read this file as UTF-8 text.'); }
    finally { if (id === readId.current) setReading(false); }
  }
  async function copy() {
    if (s.result === null) return;
    try { await navigator.clipboard.writeText(s.result); notify('Output copied to clipboard.'); }
    catch { preview.current?.focus(); preview.current?.select(); notify('Output selected. Use your device’s copy command.'); }
  }
  const outputName = s.name.replace(/\.(luau?)$/i, s.options.encodeText ? '.obf.$1' : '.compact.$1');
  const outputReady = s.result !== null;
  const settings: { key: keyof Options; label: string }[] = [{ key: 'encodeText', label: 'Encode text literals' }, { key: 'removeComments', label: 'Remove comments' }, { key: 'compactSpacing', label: 'Compact spacing' }];
  return <>
    <PageHeading title="Obfuscate" eyebrow="Source tools" badge="Local build" actions={<>
      <button className="ws-button" disabled={reading} onClick={s.sample} aria-label="Load example source">Example <ArrowUpRight size={13} /></button>
      <button className="ws-button" disabled={reading} onClick={() => picker.current?.click()}><FolderOpen size={14} />{reading ? 'Reading…' : 'Open file'}</button></>} />
    <input hidden ref={picker} type="file" disabled={reading} accept=".lua,.luau" aria-label="Open Lua or Luau source" onChange={e => { const file = e.currentTarget.files?.[0]; e.currentTarget.value = ''; if (file) void readFile(file); }} />
    <div className="ws-tool-intro"><span className="tool-sigil"><Braces size={18} /></span><div><h2>Source builder</h2><p>Rewrite plain strings as Lua byte escapes and trim comments or spacing. Your script is never uploaded or executed.</p></div></div>
    <div className="ws-editors"><section className="db-card ws-editor ws-source" aria-label="Source editor"><header><h2><FileCode2 size={15} />Source</h2><code>{s.name}</code></header>
      <textarea aria-label="Source code" spellCheck={false} autoCapitalize="off" autoCorrect="off" wrap="off" placeholder={'-- Paste Lua or Luau here\n-- or open a source file.'} disabled={reading} value={s.source} onChange={e => s.edit(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); s.build(); } }} />
      <footer><span>{s.source ? s.source.split(/\r\n|\r|\n/).length : 0} lines <b>·</b> {formatSize(byteLength(s.source))}</span><button disabled={!s.source || reading} onClick={() => s.edit('', 'untitled.luau')}>Clear</button></footer></section>
      <section className="db-card ws-build-bar" aria-label="Build settings"><div className="ws-build-copy"><h2><SlidersHorizontal size={15} />Build settings</h2><small>Source transforms, not encryption.</small></div>
      <div className="ws-checks">{settings.map(({ key, label }) => <label key={key}><input type="checkbox" checked={s.options[key]} onChange={e => s.configure(key, e.target.checked)} /><span aria-hidden="true">{s.options[key] && <Check size={11} />}</span>{label}</label>)}</div>
      <button className="ws-button ws-primary" onClick={s.build} disabled={reading}>Build output <ArrowRight size={14} /></button></section>
      <section className="db-card ws-editor ws-preview" aria-label="Output preview"><header><h2><Code2 size={15} />Output</h2><span className="ws-tag">{outputReady ? 'Built' : 'Preview'}</span></header>
        {outputReady ? <textarea aria-label="Build output" ref={preview} readOnly wrap="off" value={s.result ?? ''} /> : <div className="ws-output-empty"><span className="ws-empty-mark"><Code2 size={23} /></span><strong>No build yet</strong><p>Build your source to see the result here.</p></div>}
        <footer><span>{outputReady ? formatSize(byteLength(s.result ?? '')) : '—'} <b>·</b> UTF-8</span><div><button disabled={!outputReady} onClick={copy}><Copy size={12} />Copy</button>
          {outputReady && url && <a href={url} download={outputName}><ArrowDownToLine size={12} />Download</a>}</div></footer></section></div>
    {s.error && <p role="alert" className="ws-inline-message">{s.error}</p>}
    <p role="status" className="ws-build-status">{outputReady ? `Build complete · ${formatSize(byteLength(s.source))} in / ${formatSize(byteLength(s.result ?? ''))} out` : 'Supports .luau and .lua · Up to 512 KiB · Draft stays in this tab'}</p>
  </>;
}
