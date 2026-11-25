import { useEffect, useRef, useState } from 'react';
import { FileName, FilePicker } from '../components/FilePicker';
import { phaseLabel } from '../components/vault/session';
import { useVaultTool } from '../components/workspace/ToolSessions';
import { formatSize, SOURCE_ACCEPT } from '../lib/vault/container';

export function VaultStudio() {
  const s = useVaultTool(), { mode, result, urls, problem, forgetPassphrase } = s;
  const encrypt = mode === 'encrypt', busy = !!s.phase;
  const [visible, setVisible] = useState(false);
  const browse = useRef<HTMLButtonElement>(null), download = useRef<HTMLAnchorElement>(null);
  const pass = useRef<HTMLInputElement>(null), confirm = useRef<HTMLInputElement>(null);
  useEffect(() => forgetPassphrase, [forgetPassphrase]);
  useEffect(() => setVisible(false), [mode, result]);
  useEffect(() => {
    if (problem?.field === 'file') browse.current?.focus();
    if (problem?.field === 'pass') pass.current?.focus();
    if (problem?.field === 'confirm') confirm.current?.focus();
  }, [problem]);
  useEffect(() => { if (result && urls) download.current?.focus(); }, [result, urls]);

  const cleaned = result?.cleanup?.file, primary = cleaned ?? result;
  const action = encrypt ? 'Download .zeox' : result?.cleanup?.kind === 'reading' ? 'Download reading' : cleaned ? 'Download cleaned file' : 'Download original';
  return <>
    <h1>Vault</h1>
    <fieldset disabled={busy}><legend>Operation</legend>{(['encrypt', 'decrypt'] as const).map(value => <label key={value}>
      <input type="radio" name="operation" checked={mode === value} onChange={() => s.switchMode(value)} />{value === 'encrypt' ? 'Encrypt' : 'Decrypt'}{' '}
    </label>)}</fieldset>
    {!s.supported && <p role="alert">Local encryption requires HTTPS and a browser with Web Crypto.</p>}
    {result && primary ? <section aria-label="Vault result">
      <h2>{encrypt ? 'File encrypted' : 'File restored'}</h2>
      <p>{result.cleanup?.message ?? 'Keep the archive and passphrase. Your original is unchanged.'}</p>
      <p><FileName name={primary.name} /> ({formatSize(primary.blob.size)})</p>
      {urls && <p><a ref={download} href={urls.cleaned ?? urls.original} download={primary.name}>{action}</a>{' '}
        {cleaned && <a href={urls.original} download={result.name}>Download original</a>}</p>}
      <button type="button" onClick={() => { s.reset(); requestAnimationFrame(() => browse.current?.focus()); }}>Process another file</button>
    </section> : <form noValidate onSubmit={e => { e.preventDefault(); void s.run(); }} aria-busy={busy}>
      <FilePicker legend={encrypt ? 'Source file' : 'Encrypted archive'} label={encrypt ? 'Choose a source file' : 'Choose a .zeox archive'}
        accept={encrypt ? SOURCE_ACCEPT : '.zeox'} choose="Browse files" disabled={busy} browse={browse} file={s.file}
        select={s.selectFile} remove={s.removeFile} errorId={problem?.field === 'file' ? 'vault-error' : undefined}
        hint={encrypt ? 'Choose or drop a Lua/Luau script, Roblox file or EXF partial listing (25 MB max).' : 'Choose or drop the .zeox archive to restore.'} />
      {encrypt && <button type="button" disabled={busy} onClick={s.sample}>Use sample</button>}
      <p><label>Passphrase <input ref={pass} type={visible ? 'text' : 'password'} value={s.passphrase} disabled={busy}
        onChange={e => s.editPass(e.target.value)} maxLength={1024} autoComplete={encrypt ? 'new-password' : 'current-password'}
        autoCapitalize="none" spellCheck={false} aria-invalid={problem?.field === 'pass'} aria-describedby="pass-help" /></label></p>
      {encrypt && <p><label>Confirm passphrase <input ref={confirm} type={visible ? 'text' : 'password'} value={s.confirmation} disabled={busy}
        onChange={e => s.editConfirm(e.target.value)} maxLength={1024} autoComplete="new-password" autoCapitalize="none" spellCheck={false}
        aria-invalid={problem?.field === 'confirm'} /></label></p>}
      <label><input type="checkbox" disabled={busy} checked={visible} onChange={e => setVisible(e.target.checked)} />Show passphrase</label>
      <p id="pass-help">{encrypt ? 'Use at least 12 characters. A lost passphrase cannot be recovered.' : 'After a successful decrypt, supported scripts are cleaned automatically. The original is always available.'}</p>
      {problem && <p id="vault-error" role="alert">{problem.message}</p>}
      <button type="submit" disabled={busy || !s.supported}>{encrypt ? 'Encrypt file' : 'Decrypt file'}</button>
      {s.phase && <p role="status">{phaseLabel[s.phase]}…</p>}
    </form>}
    <details><summary>Session log</summary>
      {s.events.length ? <><ul>{s.events.map(event => <li key={event.id}>
        {new Date(event.time).toLocaleTimeString()} — {event.mode === 'encrypt' ? 'Encrypted' : 'Restored'}{' '}
        <FileName name={event.name} /> ({formatSize(event.size)})
      </li>)}</ul><button type="button" onClick={s.clearLog}>Clear session log</button></> : <p>No files processed yet</p>}
    </details>
  </>;
}
