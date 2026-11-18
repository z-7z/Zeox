import { useState, type CSSProperties } from 'react';
import { ArrowDownToLine, ChevronRight, Clock3, Plus, Settings, Timer, Truck, UsersRound, Zap } from 'lucide-react';
import { compact, days, hour, money, salesSummary, type OpenPanel, type Overview } from './model';
import { WidgetHeading } from './StatusCard';
import { quickActions } from './navigation';
import orbit from '../../assets/avatars/orbit.svg';
import moth from '../../assets/avatars/moth.svg';
import profile from '../../assets/avatars/profile.svg';

export function TrafficCard({ data, open }: { data: Overview; open: OpenPanel }) {
  const max = Math.max(...data.traffic.map(s => s.visits));
  return <section className="db-card widget-card" aria-label="Traffic sources">
    <WidgetHeading name="Traffic sources" icon={Clock3} meta="12 months" />
    <ul className="traffic-list">{data.traffic.map((s, i) => <li key={s.name}>
      <button type="button" onClick={() => open('traffic', i)}>
        <span className="traffic-label">{s.name}<span>{compact(s.visits)}</span></span>
        <span className="segment-track" aria-hidden="true" style={{ '--row': i } as CSSProperties}><span style={{ width: `${s.visits / max * 100}%` }} /></span>
      </button>
    </li>)}</ul>
  </section>;
}

export function TeamCard({ count, open }: { count: number; open: OpenPanel }) {
  return <section className="db-card widget-card" aria-label="Team">
    <WidgetHeading name="Team" icon={UsersRound} />
    <div className="team-empty">
      <div className="avatar-stack" aria-hidden="true">
        {[orbit, moth, profile].map(src => <img key={src} src={src} alt="" width="44" height="44" />)}
      </div>
      <h3>{count ? `${count} pending ${count === 1 ? 'invitation' : 'invitations'}` : 'No Team Members'}</h3>
      <p>{count ? 'Manage invitations and roles for your workspace.' : 'Invite your team to collaborate on this project.'}</p>
      <button className="subtle-button invite-trigger" type="button" onClick={() => open('team')}><Plus size={13} />Invite Members</button>
    </div>
  </section>;
}

// Discrete, perceptually ordered shades keep nearby hours distinguishable.
const heatScale = ['#212121', '#2a2a2a', '#353535', '#414141', '#525252', '#646464', '#797979', '#939393', '#b6b6b6', '#d6d6d6'];
export function SalesCard({ data, open }: { data: Overview; open: OpenPanel }) {
  const { peak, day, hourIndex, average } = salesSummary(data.hourlySales);
  const [cell, setCell] = useState<{ d: number; h: number } | null>(null);
  return <section className="db-card widget-card" aria-label="Sales by hour">
    <WidgetHeading name="Sales by hour" icon={Timer} meta="Last 7 days" />
    <div className="sales-stats"><div><strong>${compact(peak)}</strong><p>Peak · {day} {hour(hourIndex)}–{hour(hourIndex + 1)}</p></div>
      <div><b>${compact(average)}</b><p>Avg / hour</p></div></div>
    <button className="heatmap" aria-label="Inspect hourly sales for the last seven days" onClick={() => open('sales')} onMouseLeave={() => setCell(null)}>
      {data.hourlySales.map((row, d) => <span className="heat-row" key={days[d]} style={{ '--row': d } as CSSProperties}><span className="heat-day">{days[d]}</span>
        <span className="heat-cells">{row.map((n, h) => <span key={h} onMouseEnter={() => setCell({ d, h })}
          style={{ background: heatScale[Math.min(9, Math.floor(n / peak * 10))] }} />)}</span>
      </span>)}
      <span className="heat-axis"><span>12a</span><span>6a</span><span>12p</span><span>6p</span><span>11p</span></span>
    </button>
    <div className="heat-key">{cell ? <span className="cell-value">{days[cell.d]} · {hour(cell.h)}–{hour(cell.h + 1)} <b>{money(data.hourlySales[cell.d][cell.h])}</b></span> :
      <><span>Lower</span><span className="heat-scale">{[0, 2, 4, 6, 8].map(i => <i key={i} style={{ background: heatScale[i] }} />)}</span><span>Higher</span></>}</div>
  </section>;
}

const actionIcons = [Plus, Truck, Settings, ArrowDownToLine];
export function ActionsCard({ open, exportSales }: { open: OpenPanel; exportSales: () => void }) {
  return <section className="db-card widget-card" aria-label="Quick actions">
    <WidgetHeading name="Quick actions" icon={Zap} />
    <div className="action-list">{quickActions.map((a, i) => {
      const Icon = actionIcons[i];
      return <button type="button" className="quick-action" key={a.id} onClick={() => a.id === 'export' ? exportSales() : open(a.id)}>
        <Icon size={15} /><span className="action-copy"><strong>{a.name}</strong><small>{a.description}</small></span><ChevronRight size={13} />
      </button>;
    })}</div>
  </section>;
}
