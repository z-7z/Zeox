import { useEffect, useRef } from 'react';
import { ArrowRight, CheckCheck, Download, History, LockKeyhole, Plus, UnlockKeyhole } from 'lucide-react';
import { FileName, FilePicker } from '../components/FilePicker';
import { DownloadPanel, type JobProgress } from '../components/studio/DownloadPanel';
import { LocalNote, StudioHeader } from '../components/studio/Studio';
import { EncryptionOptions } from '../components/vault/EncryptionOptions';
import { phaseLabel, type VaultSession } from '../components/vault/session';
import { useVaultTool } from '../components/workspace/ToolSessions';
import { formatSize, SOURCE_ACCEPT, type Phase } from '../lib/vault/container';

const phases: Record<'encrypt' | 'decrypt', (Phase | 'preparing')[]> = {
  encrypt: ['reading', 'deriving', 'sealing', 'preparing'],
  decrypt: ['reading', 'deriving', 'restoring', 'cleaning', 'preparing'],
};

function SessionLog({ events, clearLog }: Pick<VaultSession, 'events' | 'clearLog'>) {
  return (
    <details className="job-log">
      <summary>
        <History aria-hidden="true" /> Session log <small>{events.length}</small>
      </summary>
      {events.length ? (
        <>
          <ul className="event-list">
            {events.map((e) => (
              <li key={e.id}>
                <span>
                  {e.mode === 'encrypt' ? 'Encrypted' : 'Restored'} <FileName name={e.name} />
                  <small>{new Date(e.time).toLocaleTimeString()}</small>
                </span>
                <small>{formatSize(e.size)}</small>
              </li>
            ))}
          </ul>
          <button type="button" className="pill small" onClick={clearLog}>
            Clear session log
          </button>
        </>
      ) : (
        <p>No files processed yet</p>
      )}
    </details>
  );
}

export function Encryption() {
  const s = useVaultTool(),
    { mode, result, urls, phase, problem, forgetPassphrase } = s,
    encrypt = mode === 'encrypt';
  const browse = useRef<HTMLButtonElement>(null),
    download = useRef<HTMLAnchorElement>(null),
    startedHere = useRef(false);
  useEffect(() => forgetPassphrase, [forgetPassphrase]);
  useEffect(() => {
    if (problem?.field === 'file') browse.current?.focus();
  }, [problem]);
  useEffect(() => {
    if (result && urls && startedHere.current) download.current?.focus();
  }, [result, urls]);

  const current = phase ?? (result && !urls ? 'preparing' : null),
    busy = !!current;
  const steps =
    encrypt && s.verify
      ? (['reading', 'deriving', 'sealing', 'verifying', 'preparing'] as (Phase | 'preparing')[])
      : phases[mode];
  const job: JobProgress | undefined = current
    ? {
        title: encrypt ? 'Encryption progress' : 'Decryption progress',
        step: current === 'preparing' ? 'Preparing download' : phaseLabel[current],
        completed: steps.indexOf(current),
        total: steps.length,
      }
    : undefined;
  const cleaned = result?.cleanup?.file,
    primary = cleaned ?? result,
    ready = primary && urls ? { name: primary.name, size: primary.blob.size } : undefined;
  const action = encrypt
    ? 'Download .zeox'
    : result?.cleanup?.kind === 'reading'
      ? 'Download reading'
      : cleaned
        ? 'Download cleaned file'
        : 'Download original';
  const ModeIcon = encrypt ? LockKeyhole : UnlockKeyhole;
  return (
    <div className="file-studio">
      <StudioHeader
        title={encrypt ? 'File encryption' : 'File decryption'}
        description={
          encrypt
            ? 'Protect a local file with a passphrase. Download the encrypted archive when it’s ready.'
            : 'Unlock a .zeox archive and download the authenticated original.'
        }
      >
        <fieldset className="mode-picker" disabled={busy}>
          <legend className="sr-only">Operation</legend>
          {(['encrypt', 'decrypt'] as const).map((m) => (
            <label key={m}>
              <input type="radio" name="operation" checked={m === mode} onChange={() => s.switchMode(m)} />
              <span>
                {m === 'encrypt' ? <LockKeyhole aria-hidden="true" /> : <UnlockKeyhole aria-hidden="true" />}
                {m === 'encrypt' ? 'Encrypt' : 'Decrypt'}
              </span>
            </label>
          ))}
        </fieldset>
      </StudioHeader>
      {!s.supported && (
        <p className="error" role="alert">
          Local encryption requires HTTPS and a browser with Web Crypto.
        </p>
      )}
      <div className="studio-grid">
        <div className="studio-input">
          {ready ? (
            <section className="finished-note">
              <i>
                <CheckCheck aria-hidden="true" />
              </i>
              <p className="output-label">Operation complete</p>
              <h2>{encrypt ? 'File encrypted' : 'File restored'}</h2>
              <p>
                {encrypt
                  ? 'Keep your passphrase safe. You’ll need it to open this archive.'
                  : 'Your original bytes are ready to save. If a cleaned copy is available, you can download it separately.'}
              </p>
              <button
                type="button"
                className="pill"
                onClick={() => {
                  startedHere.current = false;
                  s.reset();
                  requestAnimationFrame(() => browse.current?.focus());
                }}
              >
                <Plus aria-hidden="true" />
                Process another file
              </button>
            </section>
          ) : (
            <form
              noValidate
              aria-busy={busy}
              onSubmit={(e) => {
                e.preventDefault();
                startedHere.current = true;
                void s.run();
              }}
            >
              <FilePicker
                legend={encrypt ? 'Source file' : 'Encrypted archive'}
                label={encrypt ? 'Choose a source file' : 'Choose a .zeox archive'}
                hint={
                  encrypt
                    ? 'Lua, Luau, Roblox files or a partial listing'
                    : '.zeox archive created on this device or another'
                }
                limitLabel="25 MB"
                choose="Upload file"
                accept={encrypt ? SOURCE_ACCEPT : '.zeox'}
                file={s.file}
                select={s.selectFile}
                remove={s.removeFile}
                browse={browse}
                disabled={busy}
                errorId={problem?.field === 'file' ? 'vault-error' : undefined}
                extra={
                  encrypt ? (
                    <button type="button" className="text-action" disabled={busy} onClick={s.sample}>
                      Use sample <ArrowRight aria-hidden="true" />
                    </button>
                  ) : undefined
                }
              />
              <EncryptionOptions key={mode} session={s} busy={busy} />
              {problem && (
                <p role="alert" id="vault-error" className="error">
                  {problem.message}
                </p>
              )}
              <div className="run-row">
                <button className="run-action" type="submit" disabled={busy || !s.supported}>
                  <ModeIcon aria-hidden="true" />
                  {busy ? (encrypt ? 'Encrypting…' : 'Decrypting…') : encrypt ? 'Encrypt file' : 'Decrypt file'}
                  <ArrowRight aria-hidden="true" />
                </button>
                <LocalNote />
              </div>
            </form>
          )}
        </div>
        <div className="studio-output">
          <DownloadPanel
            kind={mode}
            job={job}
            result={ready}
            failed={problem?.field === 'operation'}
            followJob={startedHere.current}
            note={
              ready
                ? (result?.cleanup?.message ?? 'Your passphrase-protected archive is ready to save.')
                : problem?.field === 'operation'
                  ? problem.message
                  : encrypt
                    ? 'Your .zeox archive will appear here after encryption.'
                    : 'Your restored file will appear here after decryption.'
            }
          >
            {urls && primary && (
              <>
                <a ref={download} className="run-action" href={urls.cleaned ?? urls.original} download={primary.name}>
                  <Download aria-hidden="true" />
                  {action}
                </a>
                {cleaned && result && (
                  <a className="pill" href={urls.original} download={result.name}>
                    Download original
                  </a>
                )}
              </>
            )}
          </DownloadPanel>
          <SessionLog events={s.events} clearLog={s.clearLog} />
        </div>
      </div>
    </div>
  );
}
