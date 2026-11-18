import { useEffect, useRef } from 'react';
import { BookOpen, History, LockKeyhole, Trash2, X } from 'lucide-react';
import { FORMATS } from '../../lib/vault/container';
import { FormatMark, type StudioModal } from './StudioChrome';
import { EventRow } from './EnginePanels';
import type { SessionEvent } from './session';

export function StudioDialog({ kind, close, events, clearLog }: { kind: Exclude<StudioModal, null>; close: () => void; events: SessionEvent[]; clearLog: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current, opener = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog?.showModal(); document.body.style.overflow = 'hidden';
    return () => { dialog?.close(); document.body.style.overflow = overflow; if (opener?.isConnected) opener.focus({ preventScroll: true }); };
  }, []);
  return <dialog ref={ref} className="vt-dialog" aria-labelledby="vault-dialog-title" onCancel={e => { e.preventDefault(); close(); }} onClick={e => { if (e.target === e.currentTarget) close(); }}>
    <div className="vt-dialog-inner"><div className="vt-dialog-header"><div><p className="vt-eyebrow">ZEOX VAULT <span>/</span> {kind === 'guide' ? 'MANUAL' : 'SESSION'}</p>
      <h2 id="vault-dialog-title">{kind === 'guide' ? <><BookOpen size={20} />Studio guide</> : <><History size={20} />Session log</>}</h2></div><button className="vt-dialog-close" onClick={close} aria-label="Close dialog"><X size={17} /></button></div>
    {kind === 'guide' ? <><p className="vt-dialog-intro">Seal a local copy for storage or sharing. A .zeox archive must be decrypted before its contents can be used in Roblox Studio.</p>
      <h3 className="vt-eyebrow">SUPPORTED FILES</h3><div className="vt-format-list">{FORMATS.map(f => <div key={f.name}><FormatMark type={f.name} /><span><strong>{f.name}</strong><small>{f.description}</small></span><code>{f.extensions.join('  ')}</code></div>)}</div>
      <h3 className="vt-eyebrow">WORKFLOW</h3><ol className="vt-manual-steps"><li><b>01</b><span>Choose a source file up to 25 MB. Its contents are never executed.</span></li>
        <li><b>02</b><span>Set and confirm a passphrase, encrypt, then save the .zeox archive. Keep your original and passphrase safe.</span></li>
        <li><b>03</b><span>To restore, switch to Decrypt, select the archive and enter its passphrase. Download the original bytes.</span></li></ol>
      <p className="vt-dialog-note"><LockKeyhole size={14} />Web Crypto uses AES-256-GCM and PBKDF2-SHA-256 (600,000 iterations), with a new salt and nonce for every archive. Files and passphrases are never sent to a server.</p></>
      : <><p className="vt-dialog-intro">The last 30 completed operations in this tab. This log contains metadata only and clears on refresh.</p>
        {events.length ? <><ul className="vt-all-events">{events.map(e => <EventRow event={e} key={e.id} />)}</ul><button className="vt-secondary vt-clear-log" onClick={clearLog}><Trash2 size={13} />Clear session log</button></>
          : <div className="vt-empty-dialog"><History size={24} /><strong>No files processed yet</strong><p>Encrypt or decrypt a file to start your session log.</p></div>}</>}
    </div>
  </dialog>;
}
