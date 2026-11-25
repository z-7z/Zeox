import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, BookOpen, LockKeyhole, Search, ShieldCheck } from 'lucide-react';
import { operationLabels, useUsage } from '../workspace/UsageSession';
import { formatSize } from '../../lib/vault/container';
import { Dialog } from './Dialog';
import { tools } from './tools';

export type Utility = 'search' | 'guide' | 'inbox' | 'local';
const titles: Record<Utility, string> = {
  search: 'Find a tool',
  guide: 'Workspace guide',
  inbox: 'Session activity',
  local: 'Private workspace',
};

export function UtilitySheet({ kind, close }: { kind: Utility; close: () => void }) {
  const [query, setQuery] = useState(''),
    usage = useUsage(),
    navigate = useNavigate();
  const encryption = useLocation().pathname.toLowerCase().replace(/\/$/, '') === '/encrypt';
  const matches = tools.filter((t) => `${t.name} ${t.info}`.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <Dialog title={titles[kind]} close={close}>
      {kind === 'search' && (
        <>
          <label className="search-box">
            <Search aria-hidden="true" />
            <input
              data-first
              type="search"
              aria-label="Filter tools"
              placeholder="Tool or action…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.nativeEvent.isComposing) return;
                // Search inputs otherwise consume Escape to clear their value first.
                if (e.key === 'Escape') {
                  e.preventDefault();
                  close();
                }
                if (e.key === 'Enter' && matches.length) {
                  e.preventDefault();
                  close();
                  navigate(matches[0].url);
                }
              }}
            />
          </label>
          <ul className="finder-list">
            {matches.map(({ url, name, info, icon: Icon }) => (
              <li key={url}>
                <Link to={url} onClick={close}>
                  <Icon aria-hidden="true" />
                  <span>
                    <b>{name}</b>
                    <small>{info}</small>
                  </span>
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          {!matches.length && <p role="status">No matching tools.</p>}
        </>
      )}
      {kind === 'guide' && encryption && (
        <>
          <p>Protect a single file without uploading it to a server.</p>
          <ol className="guide-steps">
            <li>Choose Encrypt and attach a supported file up to 25 MB.</li>
            <li>
              Set and confirm a passphrase. You can generate one locally, choose the outer archive name and verify the
              archive before download.
            </li>
            <li>
              Select Encrypt file and save the .zeox archive. To restore the original, choose Decrypt and enter the same
              passphrase.
            </li>
          </ol>
          <p className="hint">
            <LockKeyhole aria-hidden="true" /> There is no passphrase recovery.
          </p>
        </>
      )}
      {kind === 'guide' && !encryption && (
        <>
          <p>Build a separate copy without uploading your script.</p>
          <ol className="guide-steps">
            <li>Choose or drop one UTF-8 .lua or .luau file (512 KiB max).</li>
            <li>Choose which text, comment and spacing transforms to apply.</li>
            <li>Select Obfuscate file, then download the result. Your original is unchanged.</li>
          </ol>
          <p className="hint">
            <BookOpen aria-hidden="true" size={15} /> For a password-protected archive, use the separate encryption
            tool.
          </p>
          <Link className="pill paper" to="/encrypt" onClick={close}>
            Open file encryption <ArrowUpRight aria-hidden="true" />
          </Link>
        </>
      )}
      {kind === 'inbox' && (
        <>
          <p>
            {usage.count} successful {usage.count === 1 ? 'operation' : 'operations'} in this tab.
          </p>
          {usage.recent.length ? (
            <ul className="event-list">
              {usage.recent.slice(0, 5).map((r) => (
                <li key={r.id}>
                  <span>{operationLabels[r.operation]}</span>
                  <small>{formatSize(r.output)}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">Completed builds and restores will appear here.</p>
          )}
          <Link className="pill paper" to="/usages" onClick={close}>
            View full ledger <ArrowUpRight aria-hidden="true" />
          </Link>
        </>
      )}
      {kind === 'local' && (
        <>
          <p className="hint">
            <ShieldCheck aria-hidden="true" /> On-device processing
          </p>
          <p>No account is connected or required. Source files, passphrases and downloads stay in this browser tab.</p>
          <p className="muted">
            <LockKeyhole aria-hidden="true" size={14} /> Refreshing clears this workspace.
          </p>
        </>
      )}
    </Dialog>
  );
}
