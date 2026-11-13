import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  KeyRound,
  Terminal,
  Gauge,
  Lock,
  LayoutDashboard,
  ArrowRight,
  Activity as ActivityIcon,
} from 'lucide-react';
import { NavigationBar } from '../components/NavigationBar';
import { Footer } from '../components/Footer';
import { GlassCard } from '../components/GlassCard';
import { ServiceCard } from '../components/ServiceCard';
import { StatusCard } from '../components/StatusCard';
import { ZeoxLogo } from '../components/ZeoxLogo';
import { services, platformStatus } from '../data/mock';

const whyItems = [
  {
    icon: Lock,
    title: 'Serious protection',
    description: 'Purpose-built LuaU obfuscation designed to resist tampering and reverse engineering.',
  },
  {
    icon: KeyRound,
    title: 'Full key control',
    description: 'Issue, scope, and revoke license keys from one unified control surface.',
  },
  {
    icon: Gauge,
    title: 'Built for speed',
    description: 'A lightweight pipeline that keeps your workflow fast while staying secure.',
  },
];

const features = [
  { icon: ShieldCheck, title: 'Script Protection', description: 'Layered defenses for LuaU scripts.' },
  { icon: Terminal, title: 'Developer Tools', description: 'A growing toolkit for everyday development.' },
  { icon: LayoutDashboard, title: 'Unified Dashboard', description: 'Every service in one clean workspace.' },
  { icon: ActivityIcon, title: 'Activity Tracking', description: 'See operations and usage at a glance.' },
];

const previewStats = [
  { label: 'Protected Scripts', value: '1,204', delta: '+6.0%' },
  { label: 'Active Keys', value: '312', delta: '+2.0%' },
  { label: 'Operations', value: '3,482', delta: '+7.5%' },
];

const previewBars = [35, 50, 42, 65, 55, 78, 62, 88, 70, 95, 82, 100];

export function Landing() {
  return (
    <div id="home" className="page-enter min-h-screen bg-page">
      <NavigationBar />

      {/* Hero */}
      <section className="pt-28 pb-20 lg:pt-36">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="fade-up mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1 text-xs font-medium text-txt-secondary">
              <span className="status-dot bg-accent-green" />
              LuaU encryption &amp; protection platform
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
              Encrypt. Protect. Ship Your Scripts.
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-txt-secondary">
              Zeox is an advanced ecosystem for LuaU script encryption, protection, and license
              management — built for Roblox developers who take security seriously.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/dashboard" className="btn-primary">
                Get Started
                <ArrowRight size={15} />
              </Link>
              <a href="#services" className="btn-ghost">
                Explore Platform
              </a>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="fade-up mx-auto mt-16 max-w-3xl" style={{ animationDelay: '120ms' }}>
            <div className="rounded-2xl border border-line bg-panel p-2 shadow-2xl">
              <div className="rounded-xl bg-page p-4">
                <div className="flex items-center justify-between border-b border-line-soft pb-3">
                  <div className="flex items-center gap-2.5">
                    <ZeoxLogo size={16} className="text-white" />
                    <span className="text-sm font-medium text-white">Overview</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-2.5 py-1 text-[10px] text-txt-secondary">
                    <span className="status-dot bg-accent-green" />
                    Live
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {previewStats.map((s) => (
                    <div key={s.label} className="card p-3.5">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] text-txt-secondary">{s.label}</p>
                        <span className="flex items-center gap-1 text-[10px] font-medium text-accent-green">
                          <span className="status-dot bg-accent-green" />
                          {s.delta}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xl font-semibold tracking-tight text-white">{s.value}</p>
                    </div>
                  ))}
                </div>
                <div className="card mt-3 p-3.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-txt-secondary">Operations over time</p>
                    <p className="font-mono text-[10px] text-accent-green">+7.5% vs last month</p>
                  </div>
                  <div className="mt-3 flex h-14 items-end gap-1">
                    {previewBars.map((h, i) => (
                      <div
                        key={i}
                        className={'flex-1 rounded-sm ' + (i === previewBars.length - 1 ? 'bg-txt-primary' : 'bg-line')}
                        style={{ height: h + '%' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-wider text-txt-muted">
              Prototype preview · demonstration data
            </p>
          </div>
        </div>
      </section>

      {/* Platform status */}
      <section id="status" className="py-14">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-xl font-semibold tracking-tight text-white">Platform Status</h2>
            <span className="font-mono text-[10px] uppercase tracking-wider text-txt-muted">Prototype data</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {platformStatus.map((s) => (
              <StatusCard key={s.title} {...s} compact />
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-white">Services</h2>
            <p className="mt-3 text-sm leading-relaxed text-txt-secondary">
              A unified platform for protection, licensing, and script management.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {services.map((s) => (
              <ServiceCard key={s.name} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Zeox */}
      <section id="why" className="py-16">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-white">Why Zeox</h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-txt-secondary">
            Built for developers who take their work seriously.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {whyItems.map((w) => (
              <GlassCard key={w.title} hover>
                <div className="p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-panel">
                    <w.icon size={17} strokeWidth={1.75} className="text-txt-primary" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-white">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-txt-secondary">{w.description}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Platform features */}
      <section id="features" className="py-16">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-white">Platform Features</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <GlassCard key={f.title} hover compact>
                <div className="p-5">
                  <f.icon size={18} strokeWidth={1.75} className="text-txt-primary" />
                  <h3 className="mt-4 text-sm font-semibold text-white">{f.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-txt-secondary">{f.description}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Developer experience */}
      <section id="developers" className="py-16">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <GlassCard>
            <div className="grid items-center gap-8 p-8 lg:grid-cols-2 lg:p-12">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-white lg:text-3xl">
                  Developer Experience, First
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-txt-secondary">
                  Zeox is designed around a clean, predictable workflow: encrypt a script, manage
                  its keys, and monitor everything from a single dashboard. No clutter, no guesswork.
                </p>
                <Link to="/dashboard" className="btn-primary mt-7">
                  Open Dashboard
                  <ArrowRight size={15} />
                </Link>
              </div>
              <div className="rounded-xl border border-line bg-black p-5 font-mono text-xs leading-6">
                <p className="text-txt-muted">$ zeox encrypt ./script.lua</p>
                <p className="text-txt-primary">✓ encrypted · 128 KB → 121 KB</p>
                <p className="text-txt-muted">$ zeox keys create --batch 25</p>
                <p className="text-txt-primary">✓ 25 keys issued</p>
                <p className="text-txt-muted">$ zeox status</p>
                <p className="text-accent-green">✓ all services operational</p>
                <p className="mt-2 text-[10px] text-txt-muted">// illustrative prototype output</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Final CTA */}
      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-3xl px-5 text-center lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Ready to build on Zeox?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-txt-secondary">
            Join the platform and take control of your scripts, keys, and services.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/dashboard" className="btn-primary">
              Get Started
            </Link>
            <a href="#docs" className="btn-ghost">
              Documentation
            </a>
          </div>
        </div>
      </section>

      <div id="docs" />
      <Footer />
    </div>
  );
}
