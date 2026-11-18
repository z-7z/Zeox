import { useState, type FormEvent } from 'react';
import { Check, ChevronRight, Plus, Trash2, UsersRound } from 'lucide-react';
import { money, type OpenPanel, type WorkspaceState } from './model';

type Props = WorkspaceState & { notify: (message: string) => void };

export function TeamPanel({ workspace, update, notify }: Props) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Editor');
  const [error, setError] = useState('');
  function submit(e: FormEvent) {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (workspace.invites.some(i => i.email === value)) { setError('This email already has a pending invitation.'); return; }
    update({ invites: [...workspace.invites, { email: value, role }] }, `Invitation drafted for ${value}.`);
    setEmail(''); setError(''); notify('Invitation saved to this workspace.');
  }
  return <>
    <p className="panel-intro">Invite a collaborator and choose their level of access.</p>
    <form className="panel-form" onSubmit={submit}>
      <label>Email address<input data-initial type="email" placeholder="name@company.com" required maxLength={254} value={email} onChange={e => { setEmail(e.target.value); setError(''); }} aria-describedby={error ? 'invite-error' : undefined} /></label>
      <label>Workspace role<select value={role} onChange={e => setRole(e.target.value)}><option>Editor</option><option>Viewer</option></select></label>
      {error && <p className="form-error" role="alert" id="invite-error">{error}</p>}
      <button className="panel-primary" type="submit"><Plus size={14} />Create invitation</button>
    </form>
    {workspace.invites.length > 0 && <><p className="eyebrow section-rule">Pending invitations · {workspace.invites.length}</p><ul className="record-list">
      {workspace.invites.map(i => <li key={i.email}><div><strong>{i.email}</strong><small>{i.role} · Pending</small></div>
        <button className="record-icon" aria-label={`Remove invitation for ${i.email}`} onClick={() => { update({ invites: workspace.invites.filter(x => x.email !== i.email) }, `Invitation removed for ${i.email}.`); notify('Invitation removed.'); }}><Trash2 size={15} /></button>
      </li>)}
    </ul></>}
    <p className="local-note">Demo workspace. Invitations are stored on this device; no email is sent.</p>
  </>;
}

export function CampaignPanel({ workspace, update, notify }: Props) {
  const [name, setName] = useState('');
  const [channel, setChannel] = useState('Organic search');
  const [error, setError] = useState('');
  return <><p className="panel-intro">Start a campaign draft for an acquisition channel.</p>
    <form className="panel-form" onSubmit={e => {
      e.preventDefault();
      const title = name.trim();
      if (!title) { setError('Give your campaign a name.'); return; }
      if (workspace.campaigns.some(c => c.name.toLowerCase() === title.toLowerCase())) { setError('A draft with this name already exists.'); return; }
      update({ campaigns: [{ name: title, channel }, ...workspace.campaigns] }, `Campaign draft created: ${title}.`);
      setName(''); setError(''); notify('Campaign draft saved.');
    }}>
      <label>Campaign name<input data-initial required maxLength={80} value={name} onChange={e => { setName(e.target.value); setError(''); }} placeholder="e.g. Winter collection" /></label>
      <label>Channel<select value={channel} onChange={e => setChannel(e.target.value)}>{['Organic search', 'Direct', 'Referral', 'Paid social', 'Email'].map(c => <option key={c}>{c}</option>)}</select></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="panel-primary"><Plus size={14} />Create draft</button>
    </form>
    {workspace.campaigns.length > 0 && <><p className="eyebrow section-rule">Saved drafts · {workspace.campaigns.length}</p><ul className="record-list">
      {workspace.campaigns.map(c => <li key={c.name}><div><strong>{c.name}</strong><small>{c.channel}</small></div><span className="small-tag">Draft</span></li>)}
    </ul></>}
    <p className="local-note">Drafts stay on this device. Creating one does not publish an ad.</p>
  </>;
}

export function SettingsPanel({ workspace, update, notify, open }: Props & { open: OpenPanel }) {
  const [name, setName] = useState(workspace.name);
  return <><p className="panel-intro">Manage this workspace and its collaborators.</p>
    <form className="panel-form" onSubmit={e => { e.preventDefault(); update({ name: name.trim() }, 'Workspace name updated.'); notify('Workspace settings saved.'); }}>
      <label>Workspace name<input data-initial value={name} required maxLength={48} onChange={e => setName(e.target.value)} /></label>
      <button className="panel-primary" disabled={!name.trim() || name.trim() === workspace.name}><Check size={14} />Save changes</button>
    </form>
    <button className="panel-link section-rule" onClick={() => open('team')}><UsersRound size={17} /><span>Manage team access<small>Members, invitations and roles</small></span><ChevronRight size={15} /></button>
    <p className="local-note">Settings apply to this local demo workspace.</p>
  </>;
}

const sampleOrders = [{ id: 'ZX-1042', items: 3, total: 148 }, { id: 'ZX-1041', items: 1, total: 64 }, { id: 'ZX-1039', items: 2, total: 96 }];
export function OrdersPanel({ workspace, update, notify }: Props) {
  const pending = sampleOrders.filter(order => !workspace.fulfilled.includes(order.id));
  return <><p className="panel-intro">{pending.length ? `${pending.length} sample ${pending.length === 1 ? 'order is' : 'orders are'} waiting to ship.` : 'All caught up. There are no orders waiting to ship.'}</p>
    <ul className="record-list">{pending.map(order => <li key={order.id}><div><strong>#{order.id}</strong><small>{order.items} {order.items === 1 ? 'item' : 'items'} · {money(order.total)}</small></div>
      <button className="record-button" onClick={() => { update({ fulfilled: [...workspace.fulfilled, order.id] }, `Order #${order.id} marked fulfilled.`); notify(`Order #${order.id} fulfilled locally.`); }}><Check size={13} />Mark fulfilled</button>
    </li>)}</ul>
    <p className="local-note">Demo orders only. No shipping request is sent.</p>
  </>;
}
