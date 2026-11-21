import {
  ArrowDownLeft,
  ArrowUpRight,
  BookOpen,
  CircuitBoard,
  History,
  LockKeyhole,
  Radio,
  UnlockKeyhole,
} from 'lucide-react';
import { PanelHeader } from '../workspace/PanelHeader';
import { formatSize } from '../../lib/vault/container';
import { phaseLabel, type SessionEvent, type VaultSession } from './session';

export function EnginePanel({ session, openGuide }: { session: VaultSession; openGuide: () => void }) {
  const { phase, supported, mode } = session;
  return (
    <section className="ws-panel station-info vt-engine" aria-label="Cipher engine">
      <PanelHeader title="Cipher engine" icon={CircuitBoard}>
        <span className={`vt-status${phase ? ' working' : !supported ? ' unavailable' : ''}`}>
          <i />
          {!supported ? 'Unavailable' : phase ? 'Working' : 'Ready'}
        </span>
        <button className="ws-button" onClick={openGuide} aria-label="Open studio guide" aria-haspopup="dialog">
          <BookOpen size={13} />
          Guide
        </button>
      </PanelHeader>
      <div className="cipher-readout">
        <small>AUTHENTICATED CIPHER</small>
        <strong>
          AES<span>256</span>
        </strong>
        <p>Galois / Counter Mode</p>
      </div>
      <ol className="cipher-stages" aria-label="Processing stages">
        {(['reading', 'deriving', mode === 'encrypt' ? 'sealing' : 'restoring'] as const).map((stage, i) => (
          <li key={stage} aria-current={phase === stage ? 'step' : undefined}>
            <i>{'0' + (i + 1)}</i>
            {phaseLabel[stage]}
          </li>
        ))}
      </ol>
      <dl className="fact-list vt-specs">
        <div>
          <dt>Cipher</dt>
          <dd>AES-256-GCM</dd>
        </div>
        <div>
          <dt>Key derivation</dt>
          <dd>
            PBKDF2 <span>/</span> SHA-256
          </dd>
        </div>
        <div>
          <dt>Execution</dt>
          <dd className="vt-execution">
            <Radio size={12} />
            {phase ? phaseLabel[phase] : 'On device'}
          </dd>
        </div>
      </dl>
    </section>
  );
}
const time = (n: number) =>
  new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit', hour12: false }).format(n);
export function EventRow({ event }: { event: SessionEvent }) {
  const sealed = event.mode === 'encrypt';
  const Icon = sealed ? LockKeyhole : UnlockKeyhole;
  return (
    <li className="vt-event">
      <span className="vt-event-icon">
        <Icon size={15} />
      </span>
      <span className="vt-event-body">
        <strong>
          <bdi dir="ltr">{event.name}</bdi>
        </strong>
        <small>
          {sealed ? 'Encrypted' : 'Restored'} <b>·</b> {formatSize(event.size)}
        </small>
      </span>
      <time dateTime={new Date(event.time).toISOString()}>{time(event.time)}</time>
    </li>
  );
}
export function SessionPanel({ events, openLog }: { events: SessionEvent[]; openLog: () => void }) {
  return (
    <section className="ws-panel station-note vt-log-panel" aria-label="Session activity">
      <PanelHeader title="Session activity" icon={History}>
        <button
          onClick={openLog}
          className="ws-quiet"
          aria-haspopup="dialog"
          aria-label="Open session log"
          title="Open session log"
        >
          Log
          <ArrowUpRight size={13} />
        </button>
      </PanelHeader>
      {events.length ? (
        <ul className="vt-latest">
          {events.slice(0, 2).map((e) => (
            <EventRow event={e} key={e.id} />
          ))}
        </ul>
      ) : (
        <div className="vt-log-empty">
          <span>
            <ArrowDownLeft size={18} />
          </span>
          <div>
            <strong>No files processed yet</strong>
            <p>Completed operations will appear here.</p>
          </div>
        </div>
      )}
    </section>
  );
}
