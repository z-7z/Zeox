import { useEffect, useRef, useState } from 'react';
import { Dices, KeyRound } from 'lucide-react';
import type { VaultSession } from './session';
import { generatePassphrase } from './passphrase';
import { SectionHead } from '../studio/Studio';

export function EncryptionOptions({ session: s, busy }: { session: VaultSession; busy: boolean }) {
  const encrypt = s.mode === 'encrypt',
    { problem } = s;
  const [visible, setVisible] = useState(false),
    [generated, setGenerated] = useState(false);
  const pass = useRef<HTMLInputElement>(null),
    confirm = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (problem?.field === 'pass') pass.current?.focus();
    if (problem?.field === 'confirm') confirm.current?.focus();
  }, [problem]);
  return (
    <fieldset disabled={busy} className="studio-section cipher-options">
      <legend className="sr-only">{encrypt ? 'Encryption options' : 'Decryption options'}</legend>
      <SectionHead index="02" title={encrypt ? 'Encryption options' : 'Decryption options'}>
        <small className="cipher-badge">AES-256-GCM</small>
      </SectionHead>
      <div className="pass-grid">
        <div>
          <div className="pass-label">
            <label htmlFor="vault-pass">Passphrase</label>
            {encrypt && (
              <button
                type="button"
                className="text-action"
                aria-label="Generate passphrase"
                title="Generate a random passphrase"
                disabled={!s.supported}
                onClick={() => {
                  s.editPass(generatePassphrase());
                  s.editConfirm('');
                  setVisible(true);
                  setGenerated(true);
                  requestAnimationFrame(() => {
                    pass.current?.focus();
                    pass.current?.select();
                  });
                }}
              >
                <Dices aria-hidden="true" />
                Generate
              </button>
            )}
          </div>
          <input
            className="studio-field"
            id="vault-pass"
            ref={pass}
            type={visible && !busy ? 'text' : 'password'}
            value={s.passphrase}
            placeholder={encrypt ? 'At least 12 characters' : 'Enter the archive passphrase'}
            onChange={(e) => {
              s.editPass(e.target.value);
              setGenerated(false);
            }}
            autoComplete={encrypt ? 'new-password' : 'current-password'}
            maxLength={1024}
            spellCheck={false}
            autoCapitalize="none"
            aria-invalid={problem?.field === 'pass'}
            aria-describedby={problem?.field === 'pass' ? 'vault-error pass-help' : 'pass-help'}
          />
        </div>
        {encrypt && (
          <label className="pass-field">
            Confirm passphrase
            <input
              ref={confirm}
              className="studio-field"
              type={visible && !busy ? 'text' : 'password'}
              value={s.confirmation}
              placeholder="Repeat your passphrase"
              onChange={(e) => s.editConfirm(e.target.value)}
              maxLength={1024}
              autoComplete="new-password"
              spellCheck={false}
              autoCapitalize="none"
              aria-invalid={problem?.field === 'confirm'}
              aria-describedby={problem?.field === 'confirm' ? 'vault-error' : undefined}
            />
          </label>
        )}
      </div>
      {generated && !busy && (
        <p className="field-hint" role="status">
          Save the generated passphrase, then enter it again to confirm.
        </p>
      )}
      <label className="show-pass">
        <input type="checkbox" checked={visible && !busy} onChange={(e) => setVisible(e.target.checked)} />
        Show passphrase
      </label>
      {encrypt && (
        <div className="archive-controls">
          <label className="archive-naming">
            <span>
              <b id="name-label">Archive filename</b>
              <small id="name-help">Only changes the outer .zeox name.</small>
            </span>
            <select
              value={s.archiveName}
              aria-labelledby="name-label"
              aria-describedby="name-help"
              onChange={(e) => s.editArchiveName(e.target.value === 'neutral' ? 'neutral' : 'source')}
            >
              <option value="source">Use source name</option>
              <option value="neutral">Use archive.zeox</option>
            </select>
          </label>
          <label className="verify-option">
            <span>
              <b id="verify-label">Verify archive</b>
              <small id="verify-help">Check the authentication tag before download.</small>
            </span>
            <span className="studio-toggle">
              <input
                type="checkbox"
                checked={s.verify}
                aria-labelledby="verify-label"
                aria-describedby="verify-help"
                onChange={(e) => s.editVerify(e.target.checked)}
              />
              <i aria-hidden="true" />
            </span>
          </label>
        </div>
      )}
      <p className="field-hint" id="pass-help">
        <KeyRound aria-hidden="true" />
        {encrypt
          ? 'A lost passphrase cannot be recovered.'
          : 'The same passphrase is required. No file is released before authentication.'}
      </p>
    </fieldset>
  );
}
