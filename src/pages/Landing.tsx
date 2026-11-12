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

export function Landing() {
  return (
    <div id="home" className="min-h-screen bg-ink">
      <NavigationBar />

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40">
        <div className="pointer-events-none absolute inset-0 ambient-purple" />
        <div className="pointer-events-none absolute inset-0 ambient-orange" />

        <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange/25 bg-brand-orange/[0.08] px-3 py-1 text-xs font-medium text-brand-lavender">
                <span className="status-dot bg-brand-violet animate-pulse-dot" />
                Developer platform · zeox.xyz
              </span>
              <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
                Protect Your Scripts.{' '}
                <span className="text-gradient">Power Your Development.</span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-txt-secondary">
                An advanced ecosystem of developer tools, script protection, and license
                management — designed for modern developers.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/dashboard" className="btn-primary">
                  Get Started
                  <ArrowRight size={15} />
                </Link>
                <a href="#services" className="btn-ghost">
                  Explore Platform
                </a>
              </div>
            </div>

            {/* Floating dashboard preview */}
            <div className="relative animate-float-slow">
              <div className="pointer-events-none absolute -inset-8 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,116,17,0.14),transparent_70%)]" />
              <GlassCard shineIdle className="relative">
                <div className="p-5">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                    <div className="flex items-center gap-2.5">
                      <ZeoxLogo size={20} className="text-white" />
                      <span className="text-sm font-medium text-white">Workspace</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-txt-secondary">
                      <span className="status-dot bg-ok animate-pulse-dot" />
                      Live
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      { label: 'Protected Scripts', value: '1,204' },
                      { label: 'Active Keys', value: '312' },
                      { label: 'Operations', value: '3,482' },
                      { label: 'Success Rate', value: '99.6%' },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3.5">
                        <p className="text-[11px] text-txt-muted">{s.label}</p>
                        <p className="mt-1 text-lg font-semibold tracking-tight text-white">{s.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-3.5">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-txt-muted">Protection Engine</p>
                      <p className="font-mono text-[10px] text-ok">operational</p>
                    </div>
                    <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                      <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-brand-orangeDeep via-brand-orange to-brand-orangeLight" />
                    </div>
                  </div>
                </div>
              </GlassCard>
              <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-wider text-txt-muted">
                Prototype preview · demonstration data
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PLATFORM STATUS ============ */}
      <section id="status" className="relative py-14">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-xl font-semibold tracking-tight text-white">Platform Status</h2>
            <span className="font-mono text-[10px] uppercase tracking-wider text-txt-muted">
              Prototype data
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {platformStatus.map((s) => (
              <StatusCard key={s.title} {...s} compact />
            ))}
          </div>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section id="services" className="relative py-16">
        <div className="pointer-events-none absolute inset-0 ambient-purple opacity-60" />
        <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-white">Services</h2>
            <p className="mt-3 text-sm leading-relaxed text-txt-secondary">
              A unified platform for protection, licensing, and script management.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {services.map((s) => (
              <ServiceCard key={s.name} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY ZEOX ============ */}
      <section id="why" className="py-16">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-white">Why Zeox</h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-txt-secondary">
            Built for developers who take their work seriously.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {whyItems.map((w) => (
              <GlassCard key={w.title} hover accent="purple" shine>
                <div className="p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-orange/25 bg-brand-orange/[0.09]">
                    <w.icon size={17} strokeWidth={1.75} className="text-brand-lavender" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-white">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-txt-secondary">{w.description}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PLATFORM FEATURES ============ */}
      <section id="features" className="py-16">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-white">Platform Features</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <GlassCard key={f.title} hover compact shine>
                <div className="p-5">
                  <f.icon size={18} strokeWidth={1.75} className="text-brand-lavender" />
                  <h3 className="mt-4 text-sm font-semibold text-white">{f.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-txt-secondary">{f.description}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ============ DEVELOPER EXPERIENCE ============ */}
      <section id="developers" className="py-16">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <GlassCard accent="orange" shine>
            <div className="grid items-center gap-8 p-8 lg:grid-cols-2 lg:p-12">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-white lg:text-3xl">
                  Developer Experience, First
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-txt-secondary">
                  Zeox is designed around a clean, predictable workflow: protect a script, manage
                  its keys, and monitor everything from a single dashboard. No clutter, no guesswork.
                </p>
                <Link to="/dashboard" className="btn-primary mt-7">
                  Open Dashboard
                  <ArrowRight size={15} />
                </Link>
              </div>
              <div className="rounded-xl border border-white/[0.07] bg-black/40 p-5 font-mono text-xs leading-6">
                <p className="text-txt-muted">$ zeox protect ./script.lua</p>
                <p className="text-brand-lavender">✓ obfuscated · 128 KB → 121 KB</p>
                <p className="text-txt-muted">$ zeox keys create --batch 25</p>
                <p className="text-brand-orangeLight">✓ 25 keys issued</p>
                <p className="text-txt-muted">$ zeox status</p>
                <p className="text-ok">✓ all services operational</p>
                <p className="mt-2 text-[10px] text-txt-muted">// illustrative prototype output</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section id="pricing" className="relative overflow-hidden py-20">
        <div className="pointer-events-none absolute inset-0 ambient-purple" />
        <div className="relative mx-auto max-w-3xl px-5 text-center lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Ready to build on <span className="text-gradient">Zeox</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-txt-secondary">
            Join the platform and take control of your scripts, keys, and services.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
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
