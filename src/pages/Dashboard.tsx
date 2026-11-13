import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  KeyRound,
  FileCode2,
  Activity as ActivityIcon,
  Settings,
  ArrowUpRight,
  Plus,
  Download,
} from 'lucide-react';
import { Sidebar, type NavItem } from '../components/Sidebar';
import { DashboardHeader } from '../components/DashboardHeader';
import { GlassCard } from '../components/GlassCard';
import { PlaceholderPage } from '../components/PlaceholderPage';
import { Donut, AreaChart } from '../components/Charts';
import {
  usageServices,
  usageDonut,
  storageCards,
  categories,
  operationsTable,
  operationsChart,
} from '../data/mock';

const navItems: NavItem[] = [
  { label: 'Overview', to: '/dashboard', icon: LayoutDashboard, ready: true },
  { label: 'Zeox Protect', to: '/dashboard/protect', icon: ShieldCheck },
  { label: 'Zeox Keys', to: '/dashboard/keys', icon: KeyRound },
  { label: 'Script Protect', to: '/dashboard/script-protect', icon: FileCode2 },
  { label: 'Activity', to: '/dashboard/activity', icon: ActivityIcon },
  { label: 'Settings', to: '/dashboard/settings', icon: Settings },
];

const statusStyle: Record<string, { dot: string; text: string }> = {
  Done: { dot: 'bg-accent-blue', text: 'text-accent-blue' },
  Running: { dot: 'bg-accent-orange', text: 'text-accent-orange' },
  Queued: { dot: 'bg-txt-muted', text: 'text-txt-muted' },
};

type OperationStatus = 'Done' | 'Running' | 'Queued';
type OperationRow = {
  type: string;
  name: string;
  service: string;
  status: OperationStatus;
  created: string;
  color: string;
};

function Overview({ searchTerm }: { searchTerm: string }) {
  const [operationRows, setOperationRows] = useState<OperationRow[]>(operationsTable.rows as OperationRow[]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newService, setNewService] = useState('Zeox Protect');
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');

  const filteredOperations = operationRows.filter((row) => {
    const query = searchTerm.trim().toLowerCase();
    const matchesQuery = !query || [row.name, row.type, row.service, row.status].some((value) => value.toLowerCase().includes(query));
    const matchesStatus = statusFilter === 'all' || row.status.toLowerCase() === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const handleCreateOperation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newName.trim();
    if (!name) {
      setFormError('Enter a file or operation name.');
      return;
    }
    const serviceDetails: Record<string, { type: string; color: string }> = {
      'Zeox Protect': { type: 'Protect', color: '#A78BFA' },
      'Zeox Keys': { type: 'Keys', color: '#F2A56F' },
      'Script Protect': { type: 'Script', color: '#E8A7C8' },
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
    <div className="mx-auto max-w-6xl space-y-5 px-4 py-5 sm:px-5 lg:px-6">
      {/* Heading + controls */}
      <div className="fade-up flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Overview</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setDialogOpen(true)} className="btn-primary !px-3.5 !py-1.5 text-xs">
            <Plus size={13} />
            New Operation
          </button>
        </div>
      </div>

      {/* Usage card + storage cards */}
      <section className="fade-up grid grid-cols-1 gap-4 lg:grid-cols-3" style={{ animationDelay: '60ms' }}>
        <GlassCard className="lg:col-span-2">
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Usage</h3>
              <span className="font-mono text-[10px] uppercase tracking-wider text-txt-muted">Prototype data</span>
            </div>
            <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
              <div className="grid w-full flex-1 gap-4">
                {usageServices.map((s) => (
                  <div key={s.label}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-txt-secondary">
                        <span className="status-dot" style={{ background: s.color }} />
                        {s.label}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-txt-muted">{s.amount}</span>
                        <span className="font-mono text-[10px] text-txt-primary">{s.pct}%</span>
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line-soft">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: s.pct + '%', background: s.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Donut segments={usageDonut.segments} total={usageDonut.total} sub={usageDonut.sub} size={150} />
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 gap-4 xs:grid-cols-3 lg:grid-cols-1">
          {storageCards.map((c) => (
            <GlassCard key={c.name} hover className="group">
              <div className="flex items-center gap-4 p-4 sm:p-5">
                <span className="icon-chip h-11 w-11 rounded-xl" style={{ ['--c' as any]: c.color }}>
                  <c.icon size={18} strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{c.name}</p>
                  <p className="text-xs text-txt-muted">{c.sub}</p>
                </div>
                <ArrowUpRight
                  size={15}
                  className="text-txt-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                />
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Categories chips */}
      <section className="fade-up" style={{ animationDelay: '120ms' }}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Services</h2>
          <span className="font-mono text-[10px] uppercase tracking-wider text-txt-muted">This month</span>
        </div>
        <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => (
            <GlassCard key={c.name} hover compact className="group">
              <div className="flex items-center gap-3 p-3.5">
                <span className="icon-chip h-9 w-9 rounded-lg" style={{ ['--c' as any]: c.color }}>
                  <c.icon size={15} strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-white">{c.name}</p>
                  <p className="font-mono text-[10px] text-txt-muted">{c.count}</p>
                </div>
                <span className="font-mono text-[10px] text-txt-secondary">{c.pct}%</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Operations over time */}
      <section className="fade-up" style={{ animationDelay: '160ms' }}>
        <GlassCard>
          <div className="p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-sm font-medium text-txt-secondary">Operations over time</h3>
                <p className="mt-1.5 text-3xl font-semibold tracking-tight text-white">{operationsChart.total}</p>
              </div>
              <span
                className="inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium"
                style={{ borderColor: 'rgba(141,207,230,0.28)', color: '#8DCFE6', background: 'rgba(141,207,230,0.06)' }}
              >
                <span className="status-dot" style={{ background: '#8DCFE6' }} />
                {operationsChart.delta}
              </span>
            </div>
            <div className="mt-6">
              <AreaChart
                data={operationsChart.data}
                labels={operationsChart.labels}
                highlightIndex={operationsChart.highlightIndex}
                tooltipLabel={operationsChart.tooltipLabel}
                tooltipValue={operationsChart.tooltipValue}
              />
            </div>
          </div>
        </GlassCard>
      </section>

      {/* All operations table */}
      <section className="fade-up" style={{ animationDelay: '200ms' }}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">All Operations</h2>
          <label className="flex items-center gap-2 text-xs text-txt-muted">
            <span className="hidden sm:inline">Status</span>
            <select
              className="control-field"
              aria-label="Filter operations by status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="done">Done</option>
              <option value="running">Running</option>
              <option value="queued">Queued</option>
            </select>
          </label>
        </div>
        <GlassCard>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead>
                <tr className="border-b border-line-soft text-[11px] text-txt-muted">
                  {operationsTable.columns.map((c, i) => (
                    <th key={i} className="px-4 py-3 font-medium">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOperations.map((r, i) => {
                  const st = statusStyle[r.status] ?? statusStyle.Queued;
                  return (
                    <tr key={i} className="border-b border-line-soft transition-colors last:border-0 hover:bg-card-hover">
                      <td className="px-4 py-3 text-txt-muted">{i + 1}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2 text-txt-secondary">
                          <span className="status-dot" style={{ background: r.color }} />
                          {r.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-txt-primary">{r.name}</td>
                      <td className="px-4 py-3 text-txt-secondary">{r.service}</td>
                      <td className="px-4 py-3">
                        <span className={'flex items-center gap-1.5 ' + st.text}>
                          <span className={'status-dot ' + st.dot} />
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-txt-muted">{r.created}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => downloadOperation(r)} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1 text-[11px] font-medium text-txt-primary transition-colors hover:bg-card-hover">
                          <Download size={11} />
                          Export
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredOperations.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-sm text-txt-muted">
                      No operations match this search and status filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </section>
      <p className="sr-only" aria-live="polite">{notice}</p>

      {dialogOpen && (
        <div
          className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setDialogOpen(false)}
          onKeyDown={(event) => { if (event.key === 'Escape') setDialogOpen(false); }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-operation-title"
            className="card w-full max-w-md p-5 sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-accent-purple">Prototype only</p>
              <h2 id="new-operation-title" className="mt-2 text-lg font-semibold text-white">Create an operation</h2>
              <p className="mt-1 text-sm text-txt-secondary">This example is added to the page only; it is not saved to a server.</p>
            </div>
            <form onSubmit={handleCreateOperation} className="space-y-4">
              <label className="block text-xs font-medium text-txt-secondary">
                File or operation name
                <input
                  autoFocus
                  required
                  maxLength={120}
                  value={newName}
                  onChange={(event) => { setNewName(event.target.value); setFormError(''); }}
                  placeholder="e.g. player-core.lua"
                  className="control-field mt-2 w-full"
                />
              </label>
              <label className="block text-xs font-medium text-txt-secondary">
                Service
                <select value={newService} onChange={(event) => setNewService(event.target.value)} className="control-field mt-2 w-full">
                  <option>Zeox Protect</option>
                  <option>Zeox Keys</option>
                  <option>Script Protect</option>
                </select>
              </label>
              {formError && <p className="text-xs text-accent-red" role="alert">{formError}</p>}
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setDialogOpen(false)} className="btn-ghost !px-4 !py-2 text-xs">Cancel</button>
                <button type="submit" className="btn-primary !px-4 !py-2 text-xs">Add sample</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

const placeholderMap: Record<string, { icon: typeof ShieldCheck; title: string; description: string }> = {
  '/dashboard/protect': {
    icon: ShieldCheck,
    title: 'Zeox Protect',
    description: 'LuaU script protection and obfuscation tools will live here.',
  },
  '/dashboard/keys': {
    icon: KeyRound,
    title: 'Zeox Keys',
    description: 'License key management and access control will live here.',
  },
  '/dashboard/script-protect': {
    icon: FileCode2,
    title: 'Script Protect',
    description: 'Script protection and management tools will live here.',
  },
  '/dashboard/activity': {
    icon: ActivityIcon,
    title: 'Activity',
    description: 'A complete activity log will live here.',
  },
  '/dashboard/settings': {
    icon: Settings,
    title: 'Settings',
    description: 'Account and workspace settings will live here.',
  },
};

export function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-page">
      <Sidebar items={navItems} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="lg:pl-[17rem] xl:pl-72">
        <DashboardHeader onMenu={() => setMenuOpen(true)} searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        {location.pathname === '/dashboard' ? <Overview searchTerm={searchTerm} /> : null}

        {location.pathname !== '/dashboard' && (
          <div className="page-enter" key={location.pathname}>
            <PlaceholderPage
              {...(placeholderMap[location.pathname] ?? {
                icon: LayoutDashboard,
                title: 'Coming soon',
                description: 'This section is planned for a future phase.',
              })}
            />
            <div className="pb-10 text-center">
              <button onClick={() => navigate('/dashboard')} className="btn-ghost">
                Back to Overview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
