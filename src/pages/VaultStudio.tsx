import { useEffect, useRef, useState } from 'react';
import { Check, CircleCheck, Fingerprint, KeyRound, LockKeyhole, ShieldCheck } from 'lucide-react';
import { FileName, FilePicker } from '../components/FilePicker';
import { CardTitle, PageTitle, Ribbon, SplitFace } from '../components/orbit/Panels';
import { phaseLabel } from '../components/vault/session';
import { useVaultTool } from '../components/workspace/ToolSessions';
import { formatSize, MAX_ARCHIVE, MAX_BYTES, SOURCE_ACCEPT } from '../lib/vault/container';

export function VaultStudio() {
  const s = useVaultTool(),
    { mode, result, urls, problem, forgetPassphrase } = s;
  const encrypt = mode === 'encrypt',
    busy = !!s.phase;
  const [visible, setVisible] = useState(false);
  const browse = useRef<HTMLButtonElement>(null),
    download = useRef<HTMLAnchorElement>(null);
  const pass = useRef<HTMLInputElement>(null),
    confirm = useRef<HTMLInputElement>(null);
  useEffect(() => forgetPassphrase, [forgetPassphrase]);
  useEffect(() => setVisible(false), [mode, result]);
  useEffect(() => {
    if (problem?.field === 'file') browse.current?.focus();
    if (problem?.field === 'pass') pass.current?.focus();
    if (problem?.field === 'confirm') confirm.current?.focus();
  }, [problem]);
  useEffect(() => {
    if (result && urls) download.current?.focus();
  }, [result, urls]);

  const cleaned = result?.cleanup?.file,
    primary = cleaned ?? result;
  const action = encrypt
    ? 'Download .zeox'
    : result?.cleanup?.kind === 'reading'
      ? 'Download reading'
      : cleaned
        ? 'Download cleaned file'
        : 'Download original';
  return (
    <>
      <PageTitle title="Vault" kicker="File protection">
        <fieldset className="mode-picker" disabled={busy}>
          <legend className="sr-only">Operation</legend>
          {(['encrypt', 'decrypt'] as const).map((value) => (
            <label key={value}>
              <input type="radio" name="operation" checked={mode === value} onChange={() => s.switchMode(value)} />
              <span>{value === 'encrypt' ? 'Encrypt' : 'Decrypt'}</span>
            </label>
          ))}
        </fieldset>
        {!result && (
          <button type="submit" form="vault-form" className="split-action" disabled={busy || !s.supported}>
            <SplitFace>{encrypt ? 'Encrypt file' : 'Decrypt file'}</SplitFace>
          </button>
        )}
      </PageTitle>
      {!s.supported && (
        <p className="error" role="alert">
          Local encryption requires HTTPS and a browser with Web Crypto.
        </p>
      )}
      {problem && (
        <p id="vault-error" className="error" role="alert">
          {problem.message}
        </p>
      )}
      <form
        id="vault-form"
        className="desk-grid vault-grid"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void s.run();
        }}
        aria-busy={busy}
      >
        {result && primary ? (
          <section className="card result-card" aria-label="Vault result">
            <CardTitle title={encrypt ? 'File encrypted' : 'File restored'}>
              <span className="result-tag">
                <CircleCheck aria-hidden="true" />
                Ready
              </span>
            </CardTitle>
            <div className="result-file">
              <i>
                <ShieldCheck aria-hidden="true" />
              </i>
              <div>
                <FileName name={primary.name} />
                <small>{formatSize(primary.blob.size)}</small>
              </div>
            </div>
            <p>{result.cleanup?.message ?? 'Keep the archive and passphrase. Your original is unchanged.'}</p>
            <div className="button-row">
              {urls && (
                <>
                  <a
                    ref={download}
                    className="split-action"
                    href={urls.cleaned ?? urls.original}
                    download={primary.name}
                  >
                    <SplitFace>{action}</SplitFace>
                  </a>
                  {cleaned && (
                    <a className="pill" href={urls.original} download={result.name}>
                      Download original
                    </a>
                  )}
                </>
              )}
              <button
                type="button"
                className="pill"
                onClick={() => {
                  s.reset();
                  requestAnimationFrame(() => browse.current?.focus());
                }}
              >
                Process another file
              </button>
            </div>
          </section>
        ) : (
          <FilePicker
            legend={encrypt ? 'Source file' : 'Encrypted archive'}
            label={encrypt ? 'Choose a source file' : 'Choose a .zeox archive'}
            accept={encrypt ? SOURCE_ACCEPT : '.zeox'}
            choose="Browse files"
            disabled={busy}
            browse={browse}
            file={s.file}
            select={s.selectFile}
            remove={s.removeFile}
            errorId={problem?.field === 'file' ? 'vault-error' : undefined}
            limit={encrypt ? MAX_BYTES : MAX_ARCHIVE}
            hint={encrypt ? 'Drop a script, Studio file or partial listing' : 'Drop a .zeox archive to restore'}
          />
        )}
        <Ribbon
          title="Archive workflow"
          metrics={[
            [25, 'MB limit'],
            ['v1', 'container'],
          ]}
          steps={[
            { label: encrypt ? 'Source file' : '.zeox file', caption: 'Attachment' },
            { label: encrypt ? 'Seal' : 'Restore', caption: 'Web Crypto' },
            { label: 'Save copy', caption: 'Download' },
          ]}
          current={result ? 2 : s.file ? 1 : 0}
          marker={result ? 'Done' : busy ? 'Busy' : s.file ? 'Ready' : 'Intake'}
        />
        {!result && (
          <section className="card pass-card">
            <CardTitle title="Access settings">
              {encrypt && (
                <button type="button" className="pill small" disabled={busy} onClick={s.sample}>
                  Use sample
                </button>
              )}
            </CardTitle>
            <label className="pass-field">
              Passphrase
              <input
                ref={pass}
                type={visible ? 'text' : 'password'}
                value={s.passphrase}
                disabled={busy}
                placeholder="Enter passphrase"
                onChange={(e) => s.editPass(e.target.value)}
                maxLength={1024}
                autoComplete={encrypt ? 'new-password' : 'current-password'}
                autoCapitalize="none"
                spellCheck={false}
                aria-invalid={problem?.field === 'pass'}
                aria-describedby={problem?.field === 'pass' ? 'vault-error pass-help' : 'pass-help'}
              />
            </label>
            {encrypt && (
              <label className="pass-field">
                Confirm passphrase
                <input
                  ref={confirm}
                  type={visible ? 'text' : 'password'}
                  value={s.confirmation}
                  disabled={busy}
                  placeholder="Repeat passphrase"
                  onChange={(e) => s.editConfirm(e.target.value)}
                  maxLength={1024}
                  autoComplete="new-password"
                  autoCapitalize="none"
                  spellCheck={false}
                  aria-invalid={problem?.field === 'confirm'}
                  aria-describedby={problem?.field === 'confirm' ? 'vault-error' : undefined}
                />
              </label>
            )}
            <label className="show-pass">
              <input type="checkbox" disabled={busy} checked={visible} onChange={(e) => setVisible(e.target.checked)} />
              Show passphrase
            </label>
            <p className="table-foot" id="pass-help">
              {encrypt
                ? 'Use at least 12 characters. A lost passphrase cannot be recovered.'
                : 'Supported scripts are cleaned after a successful decrypt. The exact original is always available.'}
            </p>
            {s.phase && <p role="status">{phaseLabel[s.phase]}…</p>}
          </section>
        )}
        <section className="card protocol-card">
          <CardTitle title="Archive details">
            <Fingerprint aria-hidden="true" />
          </CardTitle>
          <dl className="protocol-list">
            <div>
              <dt>
                <i>
                  <LockKeyhole aria-hidden="true" />
                </i>
                Cipher
              </dt>
              <dd>AES-256-GCM</dd>
            </div>
            <div>
              <dt>
                <i>
                  <KeyRound aria-hidden="true" />
                </i>
                Key derivation
              </dt>
              <dd>PBKDF2 · SHA-256</dd>
            </div>
            <div>
              <dt>
                <i>
                  <Check aria-hidden="true" />
                </i>
                Iterations
              </dt>
              <dd>600,000</dd>
            </div>
          </dl>
          <details className="disclosure">
            <summary>Session log</summary>
            {s.events.length ? (
              <>
                <ul className="event-list">
                  {s.events.map((event) => (
                    <li key={event.id}>
                      <span>
                        {event.mode === 'encrypt' ? 'Encrypted' : 'Restored'} <FileName name={event.name} />
                        <small>{new Date(event.time).toLocaleTimeString()}</small>
                      </span>
                      <small>{formatSize(event.size)}</small>
                    </li>
                  ))}
                </ul>
                <button className="pill small" type="button" onClick={s.clearLog}>
                  Clear session log
                </button>
              </>
            ) : (
              <p>No files processed yet</p>
            )}
          </details>
        </section>
      </form>
    </>
  );
}
