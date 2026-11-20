import { PanelDialog } from '../workspace/PanelDialog';
import { History, LockKeyhole, Trash2 } from 'lucide-react';
import { FORMATS } from '../../lib/vault/container';
import { FormatMark, type StudioModal } from './StudioChrome';
import { EventRow } from './EnginePanels';
import type { SessionEvent } from './session';

export function StudioDialog({ kind, close, events, clearLog }: { kind: Exclude<StudioModal, null>; close: () => void; events: SessionEvent[]; clearLog: () => void }) {
  return <PanelDialog title={kind === 'guide' ? 'Studio guide' : 'Session log'} titleId="vault-dialog-title" className="vt-dialog" close={close} closeLabel="Close dialog">
    {kind === 'guide' ? <><p className="vt-dialog-intro">Seal a local copy for storage or sharing. A .zeox archive must be decrypted before its contents can be used in Roblox Studio.</p>
      <h3 className="vt-eyebrow">SUPPORTED FILES</h3><div className="vt-format-list">{FORMATS.map(f => <div key={f.name}><FormatMark type={f.name} /><span><strong>{f.name}</strong><small>{f.description}</small></span><code>{f.extensions.join('  ')}</code></div>)}</div>
      <h3 className="vt-eyebrow">WORKFLOW</h3><ol className="vt-manual-steps"><li><b>01</b><span>Choose a source file up to 25 MB. Its contents are never executed.</span></li>
        <li><b>02</b><span>Set and confirm a passphrase, encrypt, then save the .zeox archive. Keep your original and passphrase safe.</span></li>
        <li><b>03</b><span>To restore, switch to Decrypt, select the archive and enter its passphrase. Download the original bytes.</span></li></ol>
      <p className="vt-dialog-note"><LockKeyhole size={14} />Web Crypto uses AES-256-GCM and PBKDF2-SHA-256 (600,000 iterations), with a new salt and nonce for every archive. Files and passphrases are never sent to a server.</p></>
      : <><p className="vt-dialog-intro">The last 30 completed operations in this tab. This log contains metadata only and clears on refresh.</p>
        {events.length ? <><ul className="vt-all-events">{events.map(e => <EventRow event={e} key={e.id} />)}</ul><button className="ws-button vt-clear-log" onClick={clearLog}><Trash2 size={13} />Clear session log</button></>
          : <div className="vt-empty-dialog"><History size={24} /><strong>No files processed yet</strong><p>Encrypt or decrypt a file to start your session log.</p></div>}</>}
  </PanelDialog>;
}
