import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Activity, ArrowDownRight, ArrowUpRight, Cpu, LayoutDashboard, ShieldCheck, KeyRound, FileCode2, Settings, Plus, Download, Search, Layers3 } from 'lucide-react';
import { Sidebar, type NavItem } from '../components/Sidebar';
import { DashboardHeader } from '../components/DashboardHeader';
import { PlaceholderPage } from '../components/PlaceholderPage';
import { Donut, AreaChart } from '../components/Charts';
import { usageServices, usageDonut, categories, operationsTable, operationsChart, platformStatus } from '../data/mock';

const navItems: NavItem[] = [
  { label: 'Overview', to: '/dashboard', icon: LayoutDashboard, ready: true },
  { label: 'Zeox Protect', to: '/dashboard/protect', icon: ShieldCheck },
  { label: 'Zeox Keys', to: '/dashboard/keys', icon: KeyRound },
  { label: 'Script Protect', to: '/dashboard/script-protect', icon: FileCode2 },
  { label: 'Activity', to: '/dashboard/activity', icon: Activity },
  { label: 'Settings', to: '/dashboard/settings', icon: Settings },
];

const statusStyle: Record<string, { dot: string; text: string }> = {
  Done: { dot: 'bg-accent-cyan', text: 'text-accent-cyan' },
  Running: { dot: 'bg-accent-orange', text: 'text-accent-orange' },
  Queued: { dot: 'bg-txt-muted', text: 'text-txt-muted' },
};

type OperationStatus = 'Done' | 'Running' | 'Queued';
type OperationRow = { type: string; name: string; service: string; status: OperationStatus; created: string; color: string };

const summaryStats = [
  { label: 'Total operations', value: '3,482', note: 'this month', color: '#5CD4E6' },
  { label: 'Platform uptime', value: '99.98%', note: 'last 30 days', color: '#7BD9C2' },
  { label: 'API latency', value: '42ms', note: 'average response', color: '#FF9150' },
  { label: 'Engine build', value: '2.4.1', note: 'prototype data', color: '#F2A6C7' },
];

function Overview({ searchTerm }: { searchTerm: string }) {
  const [operationRows, setOperationRows] = useState<OperationRow[]>(operationsTable.rows as OperationRow[]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const dialogRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [newName, setNewName] = useState('');
  const [newService, setNewService] = useState('Zeox Protect');
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!dialogOpen) return;
    const dialog = dialogRef.current;
    const getFocusable = () => Array.from(dialog?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]') ?? []);
    getFocusable()[0]?.focus();
    const handleDialogKeys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setDialogOpen(false); return; }
      if (event.key !== 'Tab') return;
      const focusable = getFocusable();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && (document.activeElement === first || !dialog?.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !dialog?.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleDialogKeys);
    return () => { document.removeEventListener('keydown', handleDialogKeys); triggerRef.current?.focus(); };
  }, [dialogOpen]);

  const filteredOperations = operationRows.filter((row) => {
    const query = searchTerm.trim().toLowerCase();
    const matchesQuery = !query || [row.name, row.type, row.service, row.status].some((value) => value.toLowerCase().includes(query));
    return matchesQuery && (statusFilter === 'all' || row.status.toLowerCase() === statusFilter);
  });

  const handleCreateOperation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newName.trim();
    if (!name) { setFormError('Enter a file or operation name.'); return; }
    const serviceDetails: Record<string, { type: string; color: string }> = {
      'Zeox Protect': { type: 'Protect', color: '#5CD4E6' },
      'Zeox Keys': { type: 'Keys', color: '#FF9150' },
      'Script Protect': { type: 'Script', color: '#F2A6C7' },
    };
    const details = serviceDetails[newService] ?? serviceDetails['Zeox Protect'];
    setOperationRows((rows) => [{ type: details.type, name, service: newService, status: 'Queued', created: 'Just now', color: details.color }, ...rows]);
    setNotice('Prototype operation added locally. It has not been saved to a server.');
    setNewName('');
    setFormError('');
    setDialogOpen(false);
  };

  const downloadOperation = (row: OperationRow) => {
    const blob = new Blob([JSON.stringify({ ...row, note: 'Prototype sample; not a live operation.' }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = (row.name.replace(/[^a-z0-9._-]/gi, '_') || 'zeox-operation') + '.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-[1480px] space-y-4 px-4 py-4 sm:px-6 lg:px-7">
      <header className="fade-up flex flex-wrap items-end justify-between gap-3 border-b border-line-soft pb-4">
        <div><p className="eyebrow">CONTROL DECK / 01</p><h1 className="mt-1 text-xl font-semibold tracking-tight text-txt-primary sm:text-2xl">Overview</h1></div>
        <div className="flex items-center gap-3"><span className="hidden font-mono text-[9px] uppercase tracking-wider text-txt-muted sm:inline">Prototype data</span><button ref={triggerRef} onClick={() => setDialogOpen(true)} className="btn-primary !rounded-md !px-3.5 !py-2 text-xs"><Plus size={13} /> New operation</button></div>
      </header>

      <section aria-label="Summary metrics" className="grid grid-cols-2 divide-x divide-y divide-line-soft border-b border-line-soft sm:grid-cols-4 sm:divide-y-0">
        {summaryStats.map((stat) => <div key={stat.label} className="flex min-h-[76px] items-start gap-3 px-3 py-3 first:pl-0 sm:px-4"><span className="mt-1 h-7 w-0.5" style={{ background: stat.color }} /><div><p className="font-mono text-[9px] uppercase tracking-wider text-txt-muted">{stat.label}</p><p className="mt-1 text-lg font-medium tracking-tight text-txt-primary sm:text-xl">{stat.value}</p><p className="mt-0.5 font-mono text-[9px] text-txt-muted">{stat.note}</p></div></div>)}
      </section>

      <section className="grid gap-3 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="card p-4 sm:p-5">
          <div className="flex items-center justify-between border-b border-line-soft pb-3"><div><p className="eyebrow">USAGE / THIS MONTH</p><h2 className="mt-1 text-sm font-medium text-txt-primary">Service breakdown</h2></div><Layers3 size={15} className="text-txt-muted" /></div>
          <div className="flex flex-col items-center gap-5 pt-4 sm:flex-row sm:justify-between">
            <div className="grid w-full flex-1 gap-3">
              {usageServices.map((service) => <div key={service.label}><div className="flex items-center justify-between gap-2 font-mono text-[10px]"><span className="flex min-w-0 items-center gap-2 text-txt-secondary"><span className="status-dot" style={{ background: service.color }} /><span className="truncate">{service.label}</span></span><span className="shrink-0 text-txt-muted">{service.amount} <span className="ml-1 text-txt-primary">{service.pct}%</span></span></div><div className="mt-1.5 h-1 overflow-hidden bg-line-soft"><div className="h-full transition-all duration-700" style={{ width: service.pct + '%', background: service.color }} /></div></div>)}
            </div>
            <Donut segments={usageDonut.segments} total={usageDonut.total} sub={usageDonut.sub} size={132} />
          </div>
        </article>

        <article className="card p-4 sm:p-5">
          <div className="flex items-center justify-between border-b border-line-soft pb-3"><div><p className="eyebrow">SYSTEM / HEALTH</p><h2 className="mt-1 text-sm font-medium text-txt-primary">Service status</h2></div><span className="flex items-center gap-1.5 font-mono text-[9px] uppercase text-accent-green"><span className="status-dot bg-accent-green" />All systems normal</span></div>
          <div className="divide-y divide-line-soft">
            {platformStatus.map((item) => { const Icon = item.icon; return <div key={item.title} className="flex items-center gap-3 py-3"><Icon size={14} className="text-txt-muted" /><div className="min-w-0 flex-1"><p className="truncate text-xs text-txt-primary">{item.title}</p><p className="mt-0.5 font-mono text-[9px] text-txt-muted">{item.metadata}</p></div><span className="flex items-center gap-1.5 font-mono text-[9px] text-accent-green"><span className="status-dot bg-accent-green" />{item.state}</span></div>; })}
          </div>
        </article>
      </section>

      <section className="grid gap-3 xl:grid-cols-[1.3fr_0.7fr]">
        <article className="card p-4 sm:p-5">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line-soft pb-3"><div><p className="eyebrow">ACTIVITY / 30 DAYS</p><h2 className="mt-1 text-sm font-medium text-txt-secondary">Operations over time</h2><p className="mt-1 text-2xl font-medium tracking-tight text-txt-primary">{operationsChart.total}</p></div><span className="flex items-center gap-1.5 font-mono text-[9px] text-accent-cyan"><ArrowUpRight size={12} />{operationsChart.delta}</span></div>
          <div className="pt-4"><AreaChart data={operationsChart.data} labels={operationsChart.labels} highlightIndex={operationsChart.highlightIndex} tooltipLabel={operationsChart.tooltipLabel} tooltipValue={operationsChart.tooltipValue} /></div>
        </article>
        <article className="card p-4 sm:p-5">
          <div className="flex items-center justify-between border-b border-line-soft pb-3"><div><p className="eyebrow">DISTRIBUTION</p><h2 className="mt-1 text-sm font-medium text-txt-primary">By service</h2></div><ArrowDownRight size={14} className="text-txt-muted" /></div>
          <div className="divide-y divide-line-soft">
            {categories.map((category) => { const Icon = category.icon; return <div key={category.name} className="flex items-center gap-2.5 py-2.5"><Icon size={13} style={{ color: category.color }} /><span className="flex-1 text-xs text-txt-secondary">{category.name}</span><span className="font-mono text-[9px] text-txt-muted">{category.count}</span><span className="w-8 text-right font-mono text-[9px] text-txt-primary">{category.pct}%</span></div>; })}
          </div>
        </article>
      </section>

      <section className="fade-up" style={{ animationDelay: '120ms' }}>
        <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
          <div><p className="eyebrow">LOG / 06 RECORDS</p><h2 className="mt-1 text-sm font-medium text-txt-primary">All operations</h2></div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-txt-muted"><span className="hidden sm:inline">Status</span><select className="control-field !py-1.5" aria-label="Filter operations by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">All</option><option value="done">Done</option><option value="running">Running</option><option value="queued">Queued</option></select></label>
            {searchTerm && <span className="inline-flex items-center gap-1 font-mono text-[9px] text-accent-cyan"><Search size={11} />Filtered</span>}
          </div>
        </div>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead><tr className="border-b border-line-soft bg-panel font-mono text-[9px] uppercase tracking-wider text-txt-muted">{operationsTable.columns.map((column, index) => <th key={index} className="px-3 py-2.5 font-normal">{column}</th>)}</tr></thead>
              <tbody>
                {filteredOperations.map((row, index) => { const style = statusStyle[row.status] ?? statusStyle.Queued; return <tr key={row.name + index} className="border-b border-line-soft/70 transition-colors last:border-0 hover:bg-card-hover"><td className="px-3 py-2.5 font-mono text-[10px] text-txt-muted">{String(index + 1).padStart(2, '0')}</td><td className="px-3 py-2.5"><span className="flex items-center gap-2 text-txt-secondary"><span className="status-dot" style={{ background: row.color }} />{row.type}</span></td><td className="px-3 py-2.5 font-mono text-[10px] text-txt-primary">{row.name}</td><td className="px-3 py-2.5 text-txt-secondary">{row.service}</td><td className="px-3 py-2.5"><span className={'flex items-center gap-1.5 font-mono text-[9px] uppercase ' + style.text}><span className={'status-dot ' + style.dot} />{row.status}</span></td><td className="px-3 py-2.5 font-mono text-[9px] text-txt-muted">{row.created}</td><td className="px-3 py-2.5"><button onClick={() => downloadOperation(row)} className="inline-flex items-center gap-1.5 border border-line-soft bg-panel px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-txt-secondary transition-colors hover:border-accent-cyan hover:text-accent-cyan"><Download size={10} />Export</button></td></tr>; })}
                {filteredOperations.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-txt-muted">No operations match this search and status filter.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <p className="sr-only" aria-live="polite">{notice}</p>

      {dialogOpen && <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDialogOpen(false)}><section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="new-operation-title" className="card w-full max-w-md p-5 sm:p-6" onClick={(event) => event.stopPropagation()}>
        <div className="mb-5"><p className="section-kicker">PROTOTYPE / LOCAL ONLY</p><h2 id="new-operation-title" className="mt-2 text-lg font-semibold text-txt-primary">Create an operation</h2><p className="mt-1 text-sm text-txt-secondary">This example is added to the page only; it is not saved to a server.</p></div>
        <form onSubmit={handleCreateOperation} className="space-y-4"><label className="block text-xs font-medium text-txt-secondary">File or operation name<input autoFocus required maxLength={120} value={newName} onChange={(event) => { setNewName(event.target.value); setFormError(''); }} placeholder="e.g. player-core.lua" className="control-field mt-2 w-full" /></label><label className="block text-xs font-medium text-txt-secondary">Service<select value={newService} onChange={(event) => setNewService(event.target.value)} className="control-field mt-2 w-full"><option>Zeox Protect</option><option>Zeox Keys</option><option>Script Protect</option></select></label>{formError && <p className="text-xs text-accent-red" role="alert">{formError}</p>}<div className="flex justify-end gap-2 border-t border-line-soft pt-4"><button type="button" onClick={() => setDialogOpen(false)} className="btn-ghost !rounded-md !px-4 !py-2 text-xs">Cancel</button><button type="submit" className="btn-primary !rounded-md !px-4 !py-2 text-xs">Add sample</button></div></form>
      </section></div>}
    </div>
  );
}

const placeholderMap: Record<string, { icon: typeof ShieldCheck; title: string; description: string }> = {
  '/dashboard/protect': { icon: ShieldCheck, title: 'Zeox Protect', description: 'LuaU script protection and obfuscation tools will live here.' },
  '/dashboard/keys': { icon: KeyRound, title: 'Zeox Keys', description: 'License key management and access control will live here.' },
  '/dashboard/script-protect': { icon: FileCode2, title: 'Script Protect', description: 'Script protection and management tools will live here.' },
  '/dashboard/activity': { icon: Activity, title: 'Activity', description: 'A complete activity log will live here.' },
  '/dashboard/settings': { icon: Settings, title: 'Settings', description: 'Account and workspace settings will live here.' },
};

export function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="min-h-screen bg-page">
      <Sidebar items={navItems} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="lg:pl-60 xl:pl-64">
        <DashboardHeader onMenu={() => setMenuOpen(true)} searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        {location.pathname === '/dashboard' ? <Overview searchTerm={searchTerm} /> : <div className="page-enter" key={location.pathname}><PlaceholderPage {...(placeholderMap[location.pathname] ?? { icon: Cpu, title: 'Coming soon', description: 'This section is planned for a future phase.' })} /><div className="pb-10 text-center"><button onClick={() => navigate('/dashboard')} className="btn-ghost !rounded-md">Back to Overview</button></div></div>}
      </div>
    </div>
  );
}
