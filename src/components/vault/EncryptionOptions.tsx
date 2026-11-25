import { useEffect, useRef, useState } from 'react';
import { Dices, Eye, EyeOff, KeyRound, SlidersHorizontal } from 'lucide-react';
import type { VaultSession } from './session';
import { PassphraseGenerator } from './PassphraseGenerator';
import { CardTitle } from '../orbit/Panels';
import { Choice } from '../ui/Choice';
import { Disclosure } from '../ui/Disclosure';
import { Toggle } from '../ui/Toggle';

const filenames = [
  { value: 'source', label: 'Use source name' },
  { value: 'neutral', label: 'Use archive.zeox' },
] as const;
export function EncryptionOptions({ session: s, busy }: { session: VaultSession; busy: boolean }) {
  const encrypt = s.mode === 'encrypt',
    { problem } = s;
  const [visible, setVisible] = useState(false),
    [generating, setGenerating] = useState(false),
    [generated, setGenerated] = useState(false);
  const pass = useRef<HTMLInputElement>(null),
    confirm = useRef<HTMLInputElement>(null);
  const shown = visible && !busy,
    EyeIcon = shown ? EyeOff : Eye;
  useEffect(() => {
    if (problem?.field === 'pass') pass.current?.focus();
    if (problem?.field === 'confirm') confirm.current?.focus();
  }, [problem]);
  const passError = problem?.field === 'pass',
    confirmError = problem?.field === 'confirm';
  return (
    <fieldset disabled={busy} className="cipher-options">
      <legend className="sr-only">{encrypt ? 'Encryption options' : 'Decryption options'}</legend>
      <CardTitle step="02" title={encrypt ? 'Set a passphrase' : 'Enter your passphrase'} />
      <p className="section-help">
        {encrypt
          ? 'This is the password you’ll use to open the encrypted file.'
          : 'Use the same passphrase that protected this archive.'}
      </p>
      <div className="pass-grid">
        <div>
          <div className="field-label">
            <label htmlFor="vault-pass">Passphrase</label>
            {encrypt && (
              <button
                className="text-action"
                type="button"
                aria-label="Generate passphrase"
                aria-haspopup="dialog"
                disabled={!s.supported}
                onClick={() => setGenerating(true)}
              >
                <Dices aria-hidden="true" />
                Generate
              </button>
            )}
          </div>
          <div className="secret-input">
            <input
              className="zf-field"
              id="vault-pass"
              ref={pass}
              type={shown ? 'text' : 'password'}
              value={s.passphrase}
              placeholder={encrypt ? 'At least 12 characters' : 'Archive passphrase'}
              onChange={(e) => {
                s.editPass(e.target.value);
                setGenerated(false);
              }}
              autoComplete={encrypt ? 'new-password' : 'current-password'}
              maxLength={1024}
              spellCheck={false}
              autoCapitalize="none"
              aria-invalid={passError}
              aria-describedby={passError ? 'vault-error pass-help' : 'pass-help'}
            />
            <button
              type="button"
              className="visibility"
              aria-label="Show passphrase"
              title={shown ? 'Hide passphrase' : 'Show passphrase'}
              aria-pressed={shown}
              onClick={() => setVisible(!visible)}
            >
              <EyeIcon aria-hidden="true" />
            </button>
          </div>
        </div>
        {encrypt && (
          <div>
            <div className="field-label">
              <label htmlFor="vault-confirm">Confirm passphrase</label>
            </div>
            <input
              id="vault-confirm"
              ref={confirm}
              className="zf-field"
              type={shown ? 'text' : 'password'}
              value={s.confirmation}
              placeholder="Type it again"
              onChange={(e) => s.editConfirm(e.target.value)}
              maxLength={1024}
              autoComplete="new-password"
              spellCheck={false}
              autoCapitalize="none"
              aria-invalid={confirmError}
              aria-describedby={confirmError ? 'vault-error' : undefined}
            />
          </div>
        )}
      </div>
      {(passError || confirmError) && (
        <p role="alert" id="vault-error" className="error">
          {problem.message}
        </p>
      )}
      {generated && !busy && (
        <p className="generator-note" role="status">
          Save the generated passphrase, then enter it again to confirm.
        </p>
      )}
      <p className="field-hint" id="pass-help">
        <KeyRound aria-hidden="true" />
        {encrypt ? 'Keep it safe. There’s no password reset.' : 'A wrong passphrase won’t release a file.'}
      </p>
      {encrypt && (
        <Disclosure
          title="Archive options"
          detail={s.verify || s.archiveName !== 'source' ? 'Custom' : 'Optional'}
          icon={SlidersHorizontal}
          inset
        >
          <div className="option-row">
            <div>
              <label htmlFor="archive-naming">Archive filename</label>
              <small id="name-help">Only changes the name of the .zeox copy.</small>
            </div>
            <Choice
              id="archive-naming"
              label="Archive filename"
              describedBy="name-help"
              options={filenames}
              value={s.archiveName}
              change={s.editArchiveName}
              disabled={busy}
            />
          </div>
          <label className="option-row">
            <span>
              <b id="verify-label">Verify archive</b>
              <small id="verify-help">Check the encrypted copy before download.</small>
            </span>
            <Toggle checked={s.verify} change={s.editVerify} labelledBy="verify-label" describedBy="verify-help" />
          </label>
        </Disclosure>
      )}
      {generating && (
        <PassphraseGenerator
          close={() => setGenerating(false)}
          apply={(value) => {
            s.editPass(value);
            s.editConfirm('');
            setGenerated(true);
            setVisible(true);
            setGenerating(false);
            requestAnimationFrame(() => {
              pass.current?.focus();
              pass.current?.select();
            });
          }}
        />
      )}
    </fieldset>
  );
}
