import { useEffect, useState } from 'react';
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
  SlidersHorizontal,
  CalendarDays,
  Download,
  MoreHorizontal,
} from 'lucide-react';
import { Sidebar, type NavItem } from '../components/Sidebar';
import { DashboardHeader } from '../components/DashboardHeader';
import { GlassCard } from '../components/GlassCard';
import { PlaceholderPage } from '../components/PlaceholderPage';
import { Donut, AreaChart } from '../components/Charts';
import { Skeleton, SkeletonCard, SkeletonRow } from '../components/Skeleton';
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
  Done: { dot: 'bg-accent-green', text: 'text-accent-green' },
  Running: { dot: 'bg-white animate-pulse-dot', text: 'text-white' },
  Queued: { dot: 'bg-txt-muted', text: 'text-txt-muted' },
};

function Overview() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-5 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-36" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <SkeletonCard className="lg:col-span-2" />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <Skeleton className="h-10 w-full rounded-xl" />
        <div className="card p-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5 px-4 py-5 sm:px-5 lg:px-6">
      {/* Heading + controls */}
      <div className="fade-up flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Overview</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button className="btn-ghost !px-3.5 !py-1.5 text-xs">
            <CalendarDays size={13} />
            Last 30 days
          </button>
          <button className="btn-ghost !px-3.5 !py-1.5 text-xs">
            <SlidersHorizontal size={13} />
            Filters
          </button>
          <button className="btn-primary !px-3.5 !py-1.5 text-xs">
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
              <button className="text-txt-muted transition-colors hover:text-white" aria-label="More">
                <MoreHorizontal size={16} />
              </button>
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
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: 'rgba(255, 255, 255, 0.08)' }}
                >
                  <c.icon size={18} strokeWidth={1.75} style={{ color: c.color }} />
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
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: 'rgba(255, 255, 255, 0.08)' }}
                >
                  <c.icon size={15} strokeWidth={1.75} style={{ color: c.color }} />
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
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-line bg-panel px-2.5 py-1 text-[11px] font-medium text-accent-green">
                <span className="status-dot bg-accent-green" />
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
          <span className="font-mono text-[10px] uppercase tracking-wider text-txt-muted">Sample data</span>
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
                {operationsTable.rows.map((r, i) => {
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
                        <button className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-black transition-colors hover:bg-zinc-200">
                          <Download size={11} />
                          Download
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </section>
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
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-page">
      <Sidebar items={navItems} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="lg:pl-[17rem] xl:pl-72">
        <DashboardHeader onMenu={() => setMenuOpen(true)} />

        {location.pathname === '/dashboard' ? <Overview /> : null}

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
