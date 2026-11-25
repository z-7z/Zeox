import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, BookOpen, LockKeyhole, Search, ShieldCheck } from 'lucide-react';
import { operationLabels, useUsage } from '../workspace/UsageSession';
import { formatSize } from '../../lib/vault/container';
import { Dialog } from './Dialog';
import { workspacePages } from './navigation';
import { useSite } from '../site/SiteSession';

export type Utility = 'search' | 'guide' | 'inbox' | 'local';
const titles: Record<Utility, string> = {
  search: 'Go to page',
  guide: 'Workspace guide',
  inbox: 'Session activity',
  local: 'Private workspace',
};

export function UtilitySheet({ kind, close }: { kind: Utility; close: () => void }) {
  const [query, setQuery] = useState(''),
    usage = useUsage(),
    navigate = useNavigate();
  const { endGuest } = useSite();
  const path = useLocation().pathname.toLowerCase().replace(/\/$/, '') || '/';
  const matches = workspacePages.filter((t) =>
    `${t.name} ${t.info}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <Dialog title={titles[kind]} close={close}>
      {kind === 'search' && (
        <>
          <label className="search-box">
            <Search aria-hidden="true" />
            <input
              data-first
              type="search"
              aria-label="Filter pages"
              placeholder="Page or action…"
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
          {!matches.length && <p role="status">No matching pages.</p>}
        </>
      )}
      {kind === 'guide' && path === '/encrypt' && (
        <>
          <p>Protect a single file without uploading it to a server.</p>
          <ol className="guide-steps">
            <li>
              Choose Encrypt, then Upload file or drop a Lua/Luau script, Roblox place/model or supported partial
              listing (25 MB max).
            </li>
            <li>
              Set and confirm a passphrase, or use Generate to make one locally. For a different filename or an extra
              verification check, expand Archive options.
            </li>
            <li>
              Select Encrypt file. When the download card says Ready, save the .zeox archive. To restore the original,
              choose Decrypt and enter the same passphrase.
            </li>
          </ol>
          <p className="hint">
            <LockKeyhole aria-hidden="true" /> There is no passphrase recovery.
          </p>
        </>
      )}
      {kind === 'guide' && path !== '/encrypt' && (
        <>
          <p>Obfuscate a Lua or Luau script without uploading it.</p>
          <ol className="guide-steps">
            <li>Choose or drop one UTF-8 .lua or .luau file (512 KiB max).</li>
            <li>Choose which text, comment and spacing transforms to apply.</li>
            <li>Select Obfuscate file, then download the result. Your original is unchanged.</li>
          </ol>
          <p className="hint">
            <BookOpen aria-hidden="true" size={15} /> Obfuscation changes how the source reads. It does not encrypt the
            script.
          </p>
          {path !== '/obfuscate' && (
            <Link className="pill paper" to="/obfuscate" onClick={close}>
              Open Obfuscator <ArrowUpRight aria-hidden="true" />
            </Link>
          )}
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
            <p className="muted">Completed runs will appear here.</p>
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
          <p>
            Guest preview · No account is connected. Source files, passphrases and downloads stay in this browser tab.
          </p>
          <p className="muted">
            <LockKeyhole aria-hidden="true" size={14} /> Save your downloads first. Refreshing or ending the session
            clears your work.
          </p>
          <button
            className="pill"
            type="button"
            onClick={() => {
              close();
              endGuest();
              navigate('/', { replace: true });
            }}
          >
            End guest session
          </button>
        </>
      )}
    </Dialog>
  );
}
