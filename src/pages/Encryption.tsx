import { useEffect, useRef } from 'react';
import { ArrowRight, Download, History, LockKeyhole, Plus, ShieldCheck, UnlockKeyhole } from 'lucide-react';
import { FileName, FilePicker } from '../components/FilePicker';
import { DownloadPanel, type JobProgress } from '../components/studio/DownloadPanel';
import { PageTitle } from '../components/orbit/Panels';
import { Disclosure } from '../components/ui/Disclosure';
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
    <Disclosure title="Session log" icon={History} detail={events.length}>
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
    </Disclosure>
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
  const suggestedName =
    encrypt && s.file ? (s.archiveName === 'neutral' ? 'archive.zeox' : `${s.file.name}.zeox`) : undefined;
  return (
    <div className="task-page">
      <PageTitle
        title={encrypt ? 'File encryption' : 'File decryption'}
        kicker="Local archive"
        badge="On this device"
        description={
          ready
            ? 'Your file is ready. Save it below or start another file.'
            : encrypt
              ? 'Choose one file, set a passphrase, then save the encrypted copy.'
              : 'Choose a .zeox archive, enter its passphrase, then save the original file.'
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
      </PageTitle>
      {!s.supported && (
        <p className="error" role="alert">
          Local encryption requires HTTPS and a browser with Web Crypto.
        </p>
      )}
      {!ready && (
        <form
          noValidate
          className="work-pair"
          aria-busy={busy}
          onSubmit={(e) => {
            e.preventDefault();
            startedHere.current = true;
            void s.run();
          }}
        >
          <FilePicker
            legend={encrypt ? 'Source file' : 'Encrypted archive'}
            title={encrypt ? 'Choose a file' : 'Choose an archive'}
            label={encrypt ? 'Choose a source file' : 'Choose a .zeox archive'}
            hint={encrypt ? 'Lua, Luau, Roblox files or a partial listing' : 'A .zeox archive made with ZeoxFucator'}
            limitLabel="25 MB"
            choose="Upload file"
            accept={encrypt ? SOURCE_ACCEPT : '.zeox'}
            file={s.file}
            select={s.selectFile}
            remove={s.removeFile}
            browse={browse}
            disabled={busy}
            errorId={problem?.field === 'file' ? 'vault-error' : undefined}
            feedback={
              problem?.field === 'file' && (
                <p className="error" role="alert" id="vault-error">
                  {problem.message}
                </p>
              )
            }
            extra={
              encrypt &&
              !s.file && (
                <button type="button" className="text-action" disabled={busy} onClick={s.sample}>
                  Use sample <ArrowRight aria-hidden="true" />
                </button>
              )
            }
          />
          <div className="card settings-card">
            <EncryptionOptions key={mode} session={s} busy={busy} />
            {problem?.field === 'operation' && (
              <p role="alert" id="vault-error" className="error">
                {problem.message}
              </p>
            )}
            <div className="card-footer">
              <button className="pill paper run-action" type="submit" disabled={busy || !s.supported}>
                <ModeIcon aria-hidden="true" />
                {busy ? (encrypt ? 'Encrypting…' : 'Decrypting…') : encrypt ? 'Encrypt file' : 'Decrypt file'}
                <ArrowRight aria-hidden="true" />
              </button>
              <span className="local-note">
                <ShieldCheck aria-hidden="true" />
                AES-256-GCM
              </span>
            </div>
          </div>
        </form>
      )}
      <DownloadPanel
        kind={mode}
        job={job}
        result={ready}
        suggestedName={suggestedName}
        failed={problem?.field === 'operation'}
        followJob={startedHere.current}
        note={
          ready
            ? (result?.cleanup?.message ?? 'Keep your passphrase. You’ll need it to open this archive.')
            : problem?.field === 'operation'
              ? problem.message
              : encrypt
                ? 'Select Encrypt file above to make your .zeox download. Your original stays unchanged.'
                : 'Select Decrypt file above to recover the original name and contents.'
        }
      >
        {urls && primary && (
          <>
            <a ref={download} className="pill paper" href={urls.cleaned ?? urls.original} download={primary.name}>
              <Download aria-hidden="true" />
              {action}
            </a>
            {cleaned && result && (
              <a className="pill" href={urls.original} download={result.name}>
                Download original
              </a>
            )}
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
          </>
        )}
      </DownloadPanel>
      <SessionLog events={s.events} clearLog={s.clearLog} />
    </div>
  );
}
