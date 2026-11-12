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
} from 'lucide-react';
import { Sidebar, type NavItem } from '../components/Sidebar';
import { DashboardHeader } from '../components/DashboardHeader';
import { GlassCard } from '../components/GlassCard';
import { StatCard } from '../components/StatCard';
import { StatusCard } from '../components/StatusCard';
import { ActivityItem } from '../components/ActivityItem';
import { PlaceholderPage } from '../components/PlaceholderPage';
import { stats, dashboardStatus, activities } from '../data/mock';

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

function Overview() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-5 py-8 lg:px-8">
      {/* Stat cards */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.title} {...s} />
          ))}
        </div>
      </section>

      {/* Status cards */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-base font-semibold tracking-tight text-white">System Status</h2>
          <span className="font-mono text-[10px] uppercase tracking-wider text-txt-muted">
            Prototype data
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {dashboardStatus.map((s) => (
            <StatusCard key={s.title} {...s} />
          ))}
        </div>
      </section>

      {/* Recent activity */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-base font-semibold tracking-tight text-white">Recent Activity</h2>
          <span className="font-mono text-[10px] uppercase tracking-wider text-txt-muted">
            Sample data
          </span>
        </div>
        <GlassCard>
          <div className="divide-y divide-white/[0.05] p-2">
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
              <GlassCard hover accent="purple" className="group h-full">
                <div className="flex items-center gap-4 p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-purple/25 bg-brand-purple/[0.09]">
                    <q.icon size={17} strokeWidth={1.75} className="text-brand-lavender" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{q.name}</p>
                    <p className="text-xs text-txt-muted">Open service</p>
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="text-txt-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-orangeLight"
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

export function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-ink">
      <Sidebar items={navItems} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="lg:pl-64">
        <DashboardHeader onMenu={() => setMenuOpen(true)} />

        {/* Overview is the only fully developed section for this phase. */}
        {location.pathname === '/dashboard' ? (
          <Overview />
        ) : null}

        {/* Placeholder routes for future phases */}
        {location.pathname !== '/dashboard' && (
          <PlaceholderRoutes onBack={() => navigate('/dashboard')} />
        )}
      </div>
    </div>
  );
}

function PlaceholderRoutes({ onBack }: { onBack: () => void }) {
  const map: Record<string, { icon: typeof ShieldCheck; title: string; description: string }> = {
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
  const entry = map[location.pathname] ?? {
    icon: LayoutDashboard,
    title: 'Coming soon',
    description: 'This section is planned for a future phase.',
  };
  return (
    <div>
      <PlaceholderPage {...entry} />
      <div className="pb-10 text-center">
        <button onClick={onBack} className="btn-ghost">
          Back to Overview
        </button>
      </div>
    </div>
  );
}
