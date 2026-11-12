import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  KeyRound,
  FileCode2,
  Activity as ActivityIcon,
  Settings,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import { Sidebar, type NavItem } from '../components/Sidebar';
import { DashboardHeader } from '../components/DashboardHeader';
import { AccountCard } from '../components/AccountCard';
import { GlassCard } from '../components/GlassCard';
import { StatCard } from '../components/StatCard';
import { StatusCard } from '../components/StatusCard';
import { ActivityItem } from '../components/ActivityItem';
import { PlaceholderPage } from '../components/PlaceholderPage';
import { AreaChart, MiniBars } from '../components/Charts';
import {
  stats,
  dashboardStatus,
  activities,
  account,
  operationsChart,
  keysManagement,
  uptime,
} from '../data/mock';

const navItems: NavItem[] = [
  { label: 'Overview', to: '/dashboard', icon: LayoutDashboard, ready: true },
  { label: 'Zeox Protect', to: '/dashboard/protect', icon: ShieldCheck },
  { label: 'Zeox Keys', to: '/dashboard/keys', icon: KeyRound },
  { label: 'Script Protect', to: '/dashboard/script-protect', icon: FileCode2 },
  { label: 'Activity', to: '/dashboard/activity', icon: ActivityIcon },
  { label: 'Settings', to: '/dashboard/settings', icon: Settings },
];

const quickAccess = [
  { icon: ShieldCheck, name: 'Zeox Protect', to: '/dashboard/protect' },
  { icon: KeyRound, name: 'Zeox Keys', to: '/dashboard/keys' },
  { icon: FileCode2, name: 'Script Protect', to: '/dashboard/script-protect' },
];

function KeysManagementCard() {
  const [tab, setTab] = useState(0);
  return (
    <GlassCard className="h-full">
      <div className="p-6">
        <h3 className="text-sm font-semibold text-white">License Keys</h3>
        <div className="mt-4 flex gap-6 border-b border-line-soft text-xs">
          {keysManagement.tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={
                '-mb-px border-b-2 pb-2.5 transition-colors ' +
                (tab === i
                  ? 'border-txt-primary font-medium text-white'
                  : 'border-transparent text-txt-muted hover:text-txt-secondary')
              }
            >
              {t}
            </button>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {keysManagement.groups.map((g) => (
            <div key={g.label} className="rounded-lg border border-line-soft bg-panel p-4">
              <div className="h-1 w-8 rounded bg-line" />
              <p className="mt-3 text-xs text-txt-secondary">{g.label}</p>
              <p className="mt-0.5 text-2xl font-semibold tracking-tight text-white">
                {g.value}
                <span className="ml-1.5 text-xs font-normal text-txt-muted">{g.sub}</span>
              </p>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-line-soft">
                <div className="h-full rounded-full bg-txt-secondary" style={{ width: g.pct + '%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

function UptimeCard() {
  return (
    <GlassCard className="h-full">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Service Uptime</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-semibold tracking-tight text-white">{uptime.rate}</p>
              <p className="text-xs font-medium text-accent-green">{uptime.delta}</p>
            </div>
          </div>
          <span className="rounded-md border border-line p-1.5 text-txt-muted">
            <Info size={14} />
          </span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          {uptime.legend.map((l, i) => (
            <span key={l} className="flex items-center gap-1.5 text-[10px] text-txt-muted">
              <span className={'h-1.5 w-1.5 rounded-sm ' + (i === 0 ? 'bg-txt-primary' : 'bg-line')} />
              {l}
            </span>
          ))}
        </div>
        <div className="mt-4">
          <MiniBars values={uptime.values} highlight={uptime.highlight} />
        </div>
      </div>
    </GlassCard>
  );
}

function Overview() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-5 py-6 lg:px-6">
      {/* Stat cards */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.title} {...s} />
          ))}
        </div>
      </section>

      {/* Big chart card */}
      <section>
        <GlassCard>
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-medium text-txt-secondary">Operations over time</h3>
                  <Info size={12} className="text-txt-muted" />
                </div>
                <p className="mt-1.5 text-3xl font-semibold tracking-tight text-white">{operationsChart.total}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel px-2.5 py-1 text-[11px] font-medium text-accent-green">
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

      {/* Keys management + uptime */}
      <section className="grid gap-4 lg:grid-cols-2">
        <KeysManagementCard />
        <UptimeCard />
      </section>

      {/* Status cards */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-base font-semibold tracking-tight text-white">System Status</h2>
          <span className="font-mono text-[10px] uppercase tracking-wider text-txt-muted">Prototype data</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {dashboardStatus.map((s) => (
            <StatusCard key={s.title} {...s} />
          ))}
        </div>
      </section>

      {/* Account */}
      <section>
        <h2 className="mb-4 text-base font-semibold tracking-tight text-white">Account</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <AccountCard
            plan={account.plan}
            planDescription={account.planDescription}
            renewal={account.renewal}
            credits={account.credits}
          />
          <GlassCard className="lg:col-span-2">
            <div className="p-6">
              <h3 className="text-sm font-semibold text-white">Usage this cycle</h3>
              <p className="mt-1 text-xs text-txt-muted">Prototype data · resets Dec 12, 2026</p>
              <div className="mt-5 space-y-4">
                {account.usage.map((u) => (
                  <div key={u.label}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-txt-secondary">{u.label}</span>
                      <span className="font-mono text-txt-muted">{u.value}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line-soft">
                      <div className="h-full rounded-full bg-txt-secondary" style={{ width: u.pct + '%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Recent activity */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-base font-semibold tracking-tight text-white">Recent Activity</h2>
          <span className="font-mono text-[10px] uppercase tracking-wider text-txt-muted">Sample data</span>
        </div>
        <GlassCard>
          <div className="divide-y divide-line-soft p-2">
            {activities.map((a) => (
              <ActivityItem key={a.title} {...a} />
            ))}
          </div>
        </GlassCard>
      </section>

      {/* Quick access */}
      <section>
        <h2 className="mb-4 text-base font-semibold tracking-tight text-white">Quick Access</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {quickAccess.map((q) => (
            <Link key={q.name} to={q.to}>
              <GlassCard hover className="group h-full">
                <div className="flex items-center gap-4 p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-panel">
                    <q.icon size={17} strokeWidth={1.75} className="text-txt-primary" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{q.name}</p>
                    <p className="text-xs text-txt-muted">Open service</p>
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="text-txt-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-txt-primary"
                  />
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
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
      <div className="lg:pl-64">
        <DashboardHeader onMenu={() => setMenuOpen(true)} />

        {location.pathname === '/dashboard' ? <Overview /> : null}

        {location.pathname !== '/dashboard' && (
          <div>
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
