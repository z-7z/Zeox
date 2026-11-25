import { useEffect, useRef, useState, type DragEvent } from 'react';
import { ArrowDownToLine, ArrowRight, ArrowUpRight, FolderLock, CheckCheck, CircleAlert, Eye, EyeOff, FileCode2, KeyRound, LoaderCircle, LockKeyhole, RotateCcw, ShieldCheck, UnlockKeyhole, X } from 'lucide-react';
import { formatSize, SOURCE_ACCEPT, type Mode } from '../../lib/vault/container';
import { phaseLabel, type VaultSession } from './session';
import { PanelHeader } from '../workspace/PanelHeader';
import { Cartridge } from '../workspace/InstrumentTiles';

function SectionLabel({ no, title }: { no: string; title: string }) {
  return <h3 className="vt-step"><span>{no}</span>{title}</h3>;
}
function ModeSwitch({ mode, change, disabled }: { mode: Mode; change: (mode: Mode) => void; disabled: boolean }) {
  return <div className={`vt-switch ${mode}`} role="group" aria-label="Operation">{(['encrypt', 'decrypt'] as const).map(value => {
    const Icon = value === 'encrypt' ? LockKeyhole : UnlockKeyhole;
    return <button key={value} type="button" aria-pressed={mode === value} disabled={disabled} onClick={() => change(value)}><Icon size={13} />{value === 'encrypt' ? 'Encrypt' : 'Decrypt'}</button>;
  })}</div>;
}

export function Workbench({ s }: { s: VaultSession }) {
  const [dragging, setDragging] = useState(false), [visible, setVisible] = useState(false);
  const input = useRef<HTMLInputElement>(null), browse = useRef<HTMLButtonElement>(null);
  const pass = useRef<HTMLInputElement>(null), confirm = useRef<HTMLInputElement>(null), download = useRef<HTMLAnchorElement>(null);
  const dragDepth = useRef(0);
  const encrypt = s.mode === 'encrypt', busy = !!s.phase;
  useEffect(() => {
    if (s.problem?.field === 'file') browse.current?.focus();
    if (s.problem?.field === 'pass') pass.current?.focus();
    if (s.problem?.field === 'confirm') confirm.current?.focus();
  }, [s.problem]);
  useEffect(() => { setVisible(false); setDragging(false); dragDepth.current = 0; }, [s.mode, s.result]);
  useEffect(() => { if (s.result && s.urls) download.current?.focus({ preventScroll: true }); }, [s.result, s.urls]);
  function onDrop(e: DragEvent) {
    e.preventDefault(); dragDepth.current = 0; setDragging(false);
    if (!busy) s.selectFile(Array.from(e.dataTransfer.files));
  }
  const { result, urls } = s;
  const cleaned = result?.cleanup?.file;
  const primary = cleaned ?? result;
  const action = encrypt ? 'Download .zeox' : result?.cleanup?.kind === 'reading' ? 'Download reading' : cleaned ? 'Download cleaned file' : 'Download original';
  return <section className="ws-panel station-work vt-workbench" id="workbench" aria-labelledby="bench-title" tabIndex={-1}>
    <PanelHeader title="Archive console" id="bench-title" icon={FolderLock}>
      <ModeSwitch mode={s.mode} change={s.switchMode} disabled={busy} /></PanelHeader>
    {!s.supported && <div className="vt-warning" role="alert"><CircleAlert size={15} />This browser needs HTTPS and Web Crypto to process files locally.</div>}
    {result && primary ? <div className="vt-result" key="result"><div className="vt-result-mark"><ShieldCheck size={30} /></div>
      <p className="vt-eyebrow">OPERATION COMPLETE</p><h3>{encrypt ? 'File encrypted' : 'File restored'}</h3>
      <p>{result.cleanup?.message ?? 'Save the archive and keep your passphrase. Your original is unchanged.'}</p>
      <div className="vt-output"><FileCode2 size={17} /><strong><bdi dir="ltr">{primary.name}</bdi></strong>
        <small>{cleaned && <><span className="sr-only">Original size: </span>{formatSize(result.blob.size)} → <span className="sr-only">Result size: </span></>}{formatSize(primary.blob.size)}</small></div>
      <div className="vt-result-actions">{urls && <>
        <a ref={download} href={urls.cleaned ?? urls.original} download={primary.name} className="ws-button ws-primary"><ArrowDownToLine size={15} />{action}</a>
        {cleaned && <a href={urls.original} download={result.name} className="ws-button" title={`${result.name} · ${formatSize(result.blob.size)}`}>Download original</a>}
      </>}
        <button type="button" className="ws-button" onClick={() => { s.reset(); requestAnimationFrame(() => browse.current?.focus({ preventScroll: true })); }}><RotateCcw size={13} />Process another file</button></div>
    </div> : <form noValidate onSubmit={e => { e.preventDefault(); void s.run(); }} aria-busy={busy}>
      <div className="vt-bench-fields">
        <div className="vt-file-step">
          <div className="vt-field-heading"><SectionLabel no="01" title={encrypt ? 'Source file' : 'Encrypted archive'} />
            {encrypt && <button type="button" className="ws-quiet" onClick={s.sample} disabled={busy}>Use sample<ArrowUpRight size={12} /></button>}</div>
          <input ref={input} type="file" aria-label={encrypt ? 'Choose a source file' : 'Choose a .zeox archive'} hidden disabled={busy} accept={encrypt ? SOURCE_ACCEPT : '.zeox'} onChange={e => { s.selectFile(Array.from(e.currentTarget.files || [])); e.currentTarget.value = ''; }} />
          <div className={`vt-drop intake-surface${dragging ? ' is-dragging' : ''}${s.file ? ' has-file' : ''}${s.problem?.field === 'file' ? ' has-error' : ''}`}
            onDragEnter={e => { e.preventDefault(); if (!busy && e.dataTransfer.types.includes('Files')) { dragDepth.current++; setDragging(true); } }}
            onDragLeave={e => { e.preventDefault(); if (--dragDepth.current <= 0) { dragDepth.current = 0; setDragging(false); } }} onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = busy ? 'none' : 'copy'; }} onDrop={onDrop}>
            <button ref={browse} type="button" className="vt-drop-button" disabled={busy} onClick={() => input.current?.click()} aria-describedby={s.problem?.field === 'file' ? 'vt-error' : undefined}>
              <Cartridge kind="archive"/><span className="vt-drop-copy">{s.file ? <><strong><bdi dir="ltr">{s.file.name}</bdi></strong><small>{formatSize(s.file.size)} <b>·</b> {dragging ? 'Release to replace' : 'Replace selected file'}</small></>
                : <><strong>{dragging ? 'Release to select this file' : <>Drop your file or <em>browse files</em></>}</strong><small>{encrypt ? 'Luau, Lua & Roblox files' : 'Zeox archives (.zeox)'}<b>·</b>25 MB max{encrypt ? '' : ' source'}</small></>}</span>
            </button>
            {s.file && <button type="button" className="vt-remove" aria-label="Remove selected file" disabled={busy} onClick={s.removeFile}><X size={15} /></button>}
          </div>
        </div>
        <div className="vt-key-step">
          <div className="vt-field-heading"><SectionLabel no="02" title="Passphrase" /><span className="vt-key-hint"><KeyRound size={11} />NEVER STORED</span></div>
          <div className={`vt-pass-grid${encrypt ? '' : ' single'}`}>
            <label className="vt-input-wrap"><KeyRound size={15} /><span className="sr-only">Passphrase</span><input ref={pass} type={visible ? 'text' : 'password'} placeholder={encrypt ? 'Enter passphrase' : 'Archive passphrase'} value={s.passphrase} onChange={e => s.editPass(e.target.value)} maxLength={1024} autoComplete={encrypt ? 'new-password' : 'current-password'} spellCheck={false} autoCapitalize="none" disabled={busy} aria-describedby="vt-pass-help" aria-invalid={s.problem?.field === 'pass'} /></label>
            {encrypt && <label className="vt-input-wrap"><CheckCheck size={15} /><span className="sr-only">Confirm passphrase</span><input ref={confirm} type={visible ? 'text' : 'password'} placeholder="Confirm passphrase" value={s.confirmation} onChange={e => s.editConfirm(e.target.value)} maxLength={1024} autoComplete="new-password" spellCheck={false} autoCapitalize="none" disabled={busy} aria-invalid={s.problem?.field === 'confirm'} /></label>}
            <button type="button" className="vt-reveal" aria-label={visible ? 'Hide passphrase' : 'Show passphrase'} aria-pressed={visible} onClick={() => setVisible(v => !v)} disabled={busy}>{visible ? <EyeOff size={15} /> : <Eye size={15} />}</button>
          </div>
          <p className="vt-pass-help" id="vt-pass-help">{encrypt ? 'Use 12 or more characters. Lost passphrases cannot be recovered.' : 'Enter the archive passphrase. Supported scripts are cleaned after decryption.'}</p>
        </div>
        {s.problem && <p className="vt-error" id="vt-error" role="alert"><CircleAlert size={14} />{s.problem.message}</p>}
      </div>
      <div className="vt-action-bar"><span className="vt-local-proof"><ShieldCheck size={14} />{busy ? 'Processing locally' : 'No upload'}</span>
        <button className="ws-button ws-primary" type="submit" disabled={busy || !s.supported}>{s.phase ? <><LoaderCircle size={15} className="vt-spinner" />{phaseLabel[s.phase]}…</> : <>{encrypt ? <LockKeyhole size={14} /> : <UnlockKeyhole size={14} />}{encrypt ? 'Encrypt file' : 'Decrypt file'}<ArrowRight size={15} /></>}</button>
      </div></form>}
    <span className="sr-only" role="status">{s.phase ? phaseLabel[s.phase] : result ? (encrypt ? 'File encrypted. Download ready.' : `File restored. ${result.cleanup?.message ?? ''}`) : s.file ? `${s.file.name} selected` : ''}</span>
  </section>;
}
