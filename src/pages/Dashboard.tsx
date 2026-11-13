import {
  Bell,
  BarChart3,
  ChevronRight,
  FileText,
  Home,
  Layers,
  LayoutGrid,
  MessageSquare,
  Moon,
  Plus,
  Search,
  Settings,
  Upload,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const sidebarIcons = [Home, BarChart3, Layers, MessageSquare, FileText, Users];

function FunnelCard() {
  const rows = [
    { v: '72K', p: 100, label: '100%' },
    { v: '38.2K', p: 83, label: '83%' },
    { v: '16.8K', p: 23, label: '23%' },
    { v: '5.6K', p: 8, label: '8%' },
  ];
  const foot = ['Product views', 'Add to cart', 'Checkout', 'Purchase'];
  return (
    <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-2xl font-semibold text-white">7.8%</p>
          <p className="mt-1 text-xs text-neutral-500">
            Overall purchase rate. 5.8K orders from 72K views. Last 30 days.
          </p>
        </div>
        <p className="text-xs text-neutral-500">
          <span className="text-white">+ 6.4%</span>
          <br />
          vs. prior 30 days
        </p>
      </div>
      <div className="mt-5 space-y-2">
        {rows.map((r, i) => (
          <div key={r.v} className="relative">
            <span className="absolute -top-4 left-1 text-[10px] text-neutral-400">{r.v}</span>
            <div
              className="flex h-11 items-center rounded-md"
              style={{
                width: r.p + '%',
                background: 'rgba(255,255,255,' + (0.9 - i * 0.2) + ')',
              }}
            >
              <span
                className={
                  'mx-auto rounded-full px-2.5 py-0.5 text-[10px] font-medium ' +
                  (i < 2 ? 'bg-black/80 text-white' : 'bg-black/60 text-white')
                }
              >
                {r.label}
              </span>
            </div>
          </div>
        ))}
        <div className="flex justify-between pt-1 text-[10px] text-neutral-500">
          {foot.map((f) => (
            <span key={f}>{f}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function DonutCard() {
  const segs = [
    { v: 37.9, c: '#ffffff', name: 'Organic search', n: '698' },
    { v: 28.0, c: '#b8b8b8', name: 'Direct', n: '516' },
    { v: 15.0, c: '#828282', name: 'Referral', n: '276' },
    { v: 12.0, c: '#4a4a4a', name: 'Paid social', n: '221' },
    { v: 7.1, c: '#262626', name: 'Others', n: '131' },
  ];
  const r = 42;
  const circ = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-2xl font-semibold text-white">1,842</p>
          <p className="mt-1 text-xs text-neutral-500">Total orders in last 30 days</p>
        </div>
        <p className="text-xs text-neutral-500">
          <span className="text-white">+ 5.6%</span>
          <br />
          vs. prior 30 days
        </p>
      </div>
      <div className="mt-5 flex items-center gap-8">
        <svg viewBox="0 0 100 100" className="h-40 w-40 -rotate-90 flex-none">
          {segs.map((s, i) => {
            const dash = (s.v / 100) * circ;
            const el = (
              <circle
                key={i}
                cx="50"
                cy="50"
                r={r}
                fill="none"
                stroke={s.c}
                strokeWidth="16"
                strokeDasharray={dash + ' ' + (circ - dash)}
                strokeDashoffset={-acc}
              />
            );
            acc += dash;
            return el;
          })}
        </svg>
        <div className="flex-1 space-y-2.5">
          {segs.map((s) => (
            <div key={s.name} className="flex items-center gap-2 text-xs">
              <span className="h-2 w-2 rounded-sm" style={{ background: s.c }} />
              <span className="flex-1 text-neutral-400">{s.name}</span>
              <span className="w-10 text-right text-neutral-300">{s.v}%</span>
              <span className="w-8 text-right text-neutral-600">{s.n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TrafficCard() {
  const rows = [
    { name: 'Organic search', v: '4.1K' },
    { name: 'Direct', v: '2.8K' },
    { name: 'Referral', v: '1.9K' },
    { name: 'Paid social', v: '950' },
    { name: 'Email', v: '620' },
  ];
  return (
    <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-5">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-medium text-white">
          <FileText className="h-3.5 w-3.5 text-neutral-500" />
          Traffic sources
        </p>
        <span className="text-[10px] text-neutral-600">12 months</span>
      </div>
      <div className="mt-4 space-y-3">
        {rows.map((t) => (
          <div key={t.name} className="flex items-baseline gap-2 text-xs">
            <span className="whitespace-nowrap text-neutral-400">{t.name}</span>
            <span className="dotted-leader mx-1 flex-1 self-end pb-1" />
            <span className="text-neutral-200">{t.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamCard() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-[#0d0d0d] p-5 text-center">
      <p className="flex w-full items-center gap-2 text-sm font-medium text-white">
        <Users className="h-3.5 w-3.5 text-neutral-500" />
        Team
      </p>
      <div className="mt-6 flex -space-x-3">
        {['A', 'M', 'K'].map((c) => (
          <span
            key={c}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0d0d0d] bg-neutral-700 text-xs font-semibold text-white"
          >
            {c}
          </span>
        ))}
      </div>
      <p className="mt-4 text-sm font-medium text-white">No Team Members</p>
      <p className="mt-1 text-xs text-neutral-500">Invite your team to collaborate on this project.</p>
      <button className="mt-5 rounded-md border border-white/20 px-3 py-1.5 text-xs text-neutral-200 transition-colors hover:bg-white hover:text-black">
        + Invite Members
      </button>
    </div>
  );
}

function SalesCard() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const shades = ['#1a1a1a', '#3a3a3a', '#6b6b6b', '#a8a8a8', '#ffffff'];
  return (
    <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-5">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-medium text-white">
          <BarChart3 className="h-3.5 w-3.5 text-neutral-500" />
          Sales by hour
        </p>
        <span className="text-[10px] text-neutral-600">Last 7 days</span>
      </div>
      <div className="mt-3 flex items-baseline gap-3">
        <p className="text-2xl font-semibold text-white">$4.8K</p>
        <p className="text-[10px] text-neutral-500">
          Peak: Sat, 8-9 PM
          <br />
          <span className="text-neutral-300">$1.5K</span> Avg. / hour
        </p>
      </div>
      <div className="mt-4 space-y-1">
        {days.map((d, i) => (
          <div key={d} className="flex items-center gap-1">
            <span className="w-7 text-[9px] text-neutral-600">{d}</span>
            {Array.from({ length: 14 }).map((_, j) => (
              <span
                key={j}
                className="h-4 flex-1 rounded-[2px]"
                style={{ background: shades[(i * 7 + j * 5) % 5] }}
              />
            ))}
          </div>
        ))}
        <div className="flex items-center justify-end gap-1 pt-1 text-[9px] text-neutral-600">
          Less
          {shades.map((s) => (
            <span key={s} className="h-2 w-2 rounded-[2px]" style={{ background: s }} />
          ))}
          More
        </div>
      </div>
    </div>
  );
}

function ActionsCard() {
  const actions = [
    { name: 'Add Campaign', icon: Plus },
    { name: 'Create a Campaign', icon: Plus },
    { name: 'Review unfulfilled', icon: FileText },
    { name: 'Workspace settings', icon: Settings },
    { name: 'Export sales', icon: Upload },
  ];
  return (
    <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-5">
      <p className="flex items-center gap-2 text-sm font-medium text-white">
        <LayoutGrid className="h-3.5 w-3.5 text-neutral-500" />
        Quick actions
      </p>
      <ul className="mt-4 space-y-1">
        {actions.map((a) => (
          <li
            key={a.name}
            className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-xs text-neutral-300 transition-colors hover:bg-white/5"
          >
            <a.icon className="h-3.5 w-3.5 text-neutral-500" />
            <span className="flex-1">{a.name}</span>
            <ChevronRight className="h-3 w-3 text-neutral-600" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      <aside className="sticky top-0 flex h-screen w-14 flex-none flex-col items-center gap-5 border-r border-white/10 bg-black py-4">
        <Link
          to="/"
          className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-xs font-bold text-black"
        >
          Z
        </Link>
        {sidebarIcons.map((Icon, i) => (
          <span
            key={i}
            className={
              'flex h-8 w-8 items-center justify-center rounded-md ' +
              (i === 0 ? 'bg-white/15 text-white' : 'text-neutral-600')
            }
          >
            <Icon className="h-4 w-4" />
          </span>
        ))}
        <div className="mt-auto flex flex-col items-center gap-4">
          <Settings className="h-4 w-4 text-neutral-600" />
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-700 text-[10px] font-semibold">
            M
          </span>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex h-12 items-center justify-between border-b border-white/10 px-4">
          <span className="flex items-center gap-2 text-sm font-medium text-white">
            <LayoutGrid className="h-4 w-4 text-neutral-500" />
            Overview
          </span>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-md border border-white/10 bg-[#0d0d0d] px-3 py-1.5 text-xs text-neutral-500 md:flex">
              <Search className="h-3 w-3" />
              Search...
            </span>
            <Bell className="h-4 w-4 text-neutral-500" />
            <Moon className="h-4 w-4 text-neutral-500" />
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-700 text-[10px] font-semibold">
              M
            </span>
          </div>
        </header>

        <main className="space-y-4 p-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <FunnelCard />
            <DonutCard />
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <TrafficCard />
            <TeamCard />
            <SalesCard />
            <ActionsCard />
          </div>
        </main>
      </div>
    </div>
  );
}
