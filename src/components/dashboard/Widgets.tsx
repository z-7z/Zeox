import { useState, type CSSProperties } from 'react';
import { ArrowDownToLine, ArrowUpRight, Braces, ChartNoAxesColumn, ChevronRight, Clock3, FolderLock, Timer, UsersRound, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { operationLabels, useUsage } from '../workspace/UsageSession';
import { formatSize } from '../../lib/vault/container';
import { compact, days, hour, hourlyKB, inputs, total, type Inspect } from './sample';
import { WidgetHeading } from './StatusCard';
import orbit from '../../assets/avatars/orbit.svg';
import moth from '../../assets/avatars/moth.svg';
import portrait from '../../assets/avatars/profile.svg';

export function InputsCard({ inspect }: { inspect: Inspect }) {
  const max = Math.max(...inputs.map(s => s.value));
  return <section className="db-card glass-card widget-card" aria-label="Input formats">
    <WidgetHeading name="Input formats" icon={Clock3} meta="12 months" />
    <ul className="input-list">{inputs.map((s, i) => <li key={s.name}><button onClick={() => inspect('inputs', i)}>
      <span className="input-label">{s.name}<span>{compact(s.value)}</span></span>
      <span className="segment-track" aria-hidden="true" style={{ '--row': i } as CSSProperties}><span style={{ width: `${s.value / max * 100}%` }} /></span>
    </button></li>)}</ul></section>;
}

export function SessionCard() {
  const { count, input, recent } = useUsage();
  return <section className="db-card glass-card widget-card" aria-label="Session summary">
    <WidgetHeading name="This session" icon={UsersRound} meta={count ? `Live · ${formatSize(input)}` : 'Live'} />
    <div className={`session-summary${count ? ' has-runs' : ''}`}><div className="avatar-stack" aria-hidden="true">
      {[orbit, moth, portrait].map(src => <img key={src} src={src} alt="" width="44" height="44" />)}</div>
      <h3>{count ? `${count.toLocaleString('en-US')} completed ${count === 1 ? 'run' : 'runs'}` : 'No runs yet'}</h3>
      {recent.length ? <ol className="session-recent" aria-label="Recent runs">{recent.slice(0, 3).map(r => <li key={r.id}><span>{operationLabels[r.operation]}</span><small>{formatSize(r.input)}</small></li>)}</ol>
        : <p>Build a script or process a file to start your session.</p>}
      <Link className="subtle-button usage-trigger" to="/usages"><ArrowUpRight size={13} />View report</Link>
    </div></section>;
}

const shades = ['#212121','#2a2a2a','#353535','#414141','#525252','#646464','#797979','#939393','#b6b6b6','#d6d6d6'];
const values = hourlyKB.flat(), peak = Math.max(...values), peakAt = values.indexOf(peak), average = total(values) / values.length;
export function VolumeCard({ inspect }: { inspect: Inspect }) {
  const [cell, setCell] = useState<{ d: number; h: number } | null>(null);
  return <section className="db-card glass-card widget-card" aria-label="Volume by hour"><WidgetHeading name="Volume by hour" icon={Timer} meta="Last 7 days" />
    <div className="volume-stats"><div><strong>{formatSize(peak * 1000)}</strong><p>Peak · {days[Math.floor(peakAt / 24)]} {hour(peakAt % 24)}–{hour(peakAt % 24 + 1)}</p></div>
      <div><b>{formatSize(average * 1000)}</b><p>Avg / hour</p></div></div>
    <button className="heatmap" aria-label="Inspect processed volume by day" onClick={() => inspect('hours', cell?.d)} onMouseLeave={() => setCell(null)}>
      {hourlyKB.map((row, d) => <span className="heat-row" key={days[d]} style={{ '--row': d } as CSSProperties}><span className="heat-day">{days[d]}</span>
        <span className="heat-cells">{row.map((n, h) => <span key={h} onMouseEnter={() => setCell({ d, h })} style={{ background: shades[Math.min(9, Math.floor(n / peak * 10))] }} />)}</span>
      </span>)}<span className="heat-axis"><span>12a</span><span>6a</span><span>12p</span><span>6p</span><span>11p</span></span>
    </button>
    <div className="heat-key">{cell ? <span className="cell-value">{days[cell.d]} · {hour(cell.h)} <b>{formatSize(hourlyKB[cell.d][cell.h] * 1000)}</b></span> :
      <><span>Lower</span><span className="heat-scale">{[0,2,4,6,8].map(i => <i key={i} style={{ background: shades[i] }} />)}</span><span>Higher</span></>}</div></section>;
}

const actions = [
  { to: '/obfuscate', name: 'Open editor', description: 'Build Lua or Luau source.', icon: Braces },
  { to: '/vault', name: 'Open vault', description: 'Seal or restore a file.', icon: FolderLock },
  { to: '/usages', name: 'View usages', description: 'Review your session log.', icon: ChartNoAxesColumn },
];
export function ActionsCard({ download }: { download: () => void }) {
  return <section className="db-card glass-card widget-card" aria-label="Quick actions"><WidgetHeading name="Quick actions" icon={Zap} />
    <div className="action-list">{actions.map(a => <Link key={a.to} className="quick-action" to={a.to} aria-label={a.name}><a.icon size={15} /><span className="action-copy"><strong>{a.name}</strong><small>{a.description}</small></span><ChevronRight size={13} /></Link>)}
      <button className="quick-action" onClick={download} aria-label="Download skeleton"><ArrowDownToLine size={15} /><span className="action-copy"><strong>Download skeleton</strong><small>Save the offline HTML layout.</small></span><ChevronRight size={13} /></button>
    </div></section>;
}
