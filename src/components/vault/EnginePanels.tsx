import { ArrowDownLeft, ArrowUpRight, CircuitBoard, Cpu, History, LockKeyhole, Radio, UnlockKeyhole } from 'lucide-react';
import { formatSize } from '../../lib/vault/container';
import { phaseLabel, type SessionEvent, type VaultSession } from './session';

const traces = [
  'M0 16 H45 L64 35 H122', 'M0 34 H51 L63 46 H122', 'M0 54 H122', 'M0 74 H52 L64 62 H122', 'M0 92 H39 L60 71 H122',
];
function Circuit({ active }: { active: boolean }) {
  return <div className={`vt-circuit${active ? ' is-active' : ''}`} aria-hidden="true">
    <svg viewBox="0 0 300 108" preserveAspectRatio="none"><defs><pattern id="circuit-dots" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="#393939" /></pattern></defs><rect width="300" height="108" fill="url(#circuit-dots)" />
      {[false, true].map(mirror => <g key={String(mirror)} transform={mirror ? 'translate(300 0) scale(-1 1)' : undefined}>{traces.map((d, i) => <g key={d}><path d={d} className="vt-trace" />
        {i % 2 === 0 && <path d={d} pathLength="100" className={`vt-packet packet-${i}${mirror ? ' reverse' : ''}`} />}</g>)}</g>)}
    </svg><div className="vt-chip"><span className="vt-chip-face"><Cpu size={17} /><b>AES</b></span></div>
    <span className="vt-circuit-code">C1 : 256</span>
  </div>;
}
export function EnginePanel({ session }: { session: VaultSession }) {
  const { phase, supported } = session;
  return <section className="vt-panel vt-engine" aria-label="Cipher engine"><div className="vt-side-head"><h2><CircuitBoard size={16} />Cipher engine</h2>
    <span className={`vt-status${phase ? ' working' : !supported ? ' unavailable' : ''}`}><i />{!supported ? 'Offline' : phase ? 'Working' : 'Ready'}</span></div>
    <Circuit active={!!phase} />
    <dl className="vt-specs"><div><dt>Cipher</dt><dd>AES-256-GCM</dd></div><div><dt>Key derivation</dt><dd>PBKDF2 <span>/</span> SHA-256</dd></div>
      <div><dt>Execution</dt><dd className="vt-execution"><Radio size={12} />{phase ? phaseLabel[phase] : 'On device'}</dd></div></dl>
  </section>;
}
const time = (n: number) => new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit', hour12: false }).format(n);
export function EventRow({ event }: { event: SessionEvent }) {
  const sealed = event.mode === 'encrypt'; const Icon = sealed ? LockKeyhole : UnlockKeyhole;
  return <li className="vt-event"><span className="vt-event-icon"><Icon size={15} /></span><span className="vt-event-body"><strong>{event.name}</strong><small>{sealed ? 'Encrypted' : 'Restored'} <b>·</b> {formatSize(event.size)}</small></span><time dateTime={new Date(event.time).toISOString()}>{time(event.time)}</time></li>;
}
export function SessionPanel({ events, openLog }: { events: SessionEvent[]; openLog: () => void }) {
  return <section className="vt-panel vt-log-panel" aria-label="Session activity"><div className="vt-side-head"><h2><History size={16} />Session activity</h2><button onClick={openLog} className="vt-opening" aria-label="View all session activity"><ArrowUpRight size={16} /></button></div>
    {events.length ? <ul className="vt-latest">{events.slice(0, 2).map(e => <EventRow event={e} key={e.id} />)}</ul> : <div className="vt-log-empty"><span><ArrowDownLeft size={18} /></span><div><strong>No files processed yet</strong><p>Completed operations will appear here.</p></div></div>}
  </section>;
}
