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
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { NavigationBar } from '../components/NavigationBar';
import { Footer } from '../components/Footer';
import { GlassCard } from '../components/GlassCard';
import { ZeoxLogo } from '../components/ZeoxLogo';
import { services, platformStatus } from '../data/mock';
import { StatusCard } from '../components/StatusCard';

const P = '#A855F7';
const BL = '#3B82F6';
const C = '#22D3EE';
const G = '#22C55E';
const Y = '#FACC15';
const O = '#FB923C';

const trustStats = [
  { value: '99.98%', label: 'Platform uptime' },
  { value: '30,240', label: 'Operations / month' },
  { value: '< 50ms', label: 'Avg. API latency' },
  { value: '2.4.1', label: 'Engine build' },
];

const whyItems = [
  {
    icon: Lock,
    title: 'Military-grade obfuscation',
    description: 'Layered LuaU encryption engineered to resist tampering, dumping, and reverse engineering.',
    color: P,
  },
  {
    icon: KeyRound,
    title: 'Total key control',
    description: 'Issue, scope, expire, and revoke license keys in seconds from one control surface.',
    color: O,
  },
  {
    icon: Gauge,
    title: 'Zero-lag pipeline',
    description: 'A protection pipeline optimized for speed. Secure your scripts without slowing down.',
    color: C,
  },
];

const features = [
  { icon: ShieldCheck, title: 'Script Protection', description: 'Multi-layer defenses for LuaU scripts.', color: P },
  { icon: KeyRound, title: 'License System', description: 'Full lifecycle management for keys.', color: O },
  { icon: Terminal, title: 'Developer Tools', description: 'A growing toolkit for daily work.', color: BL },
  { icon: LayoutDashboard, title: 'Unified Dashboard', description: 'Every service in one workspace.', color: Y },
  { icon: ActivityIcon, title: 'Live Activity', description: 'Operations and usage in real time.', color: C },
  { icon: Zap, title: 'Fast Engine', description: 'Low-latency protection pipeline.', color: G },
];

const heroBars = [35, 50, 42, 65, 55, 78, 62, 88, 70, 95, 82, 100];
const heroUsage = [
  { label: 'Zeox Protect', pct: 68, color: P },
  { label: 'Zeox Keys', pct: 54, color: O },
  { label: 'Script Protect', pct: 41, color: Y },
  { label: 'API Requests', pct: 27, color: BL },
];

const previewRows = [
  { name: 'main-script.lua', service: 'Zeox Protect', status: 'Done', color: P },
  { name: 'batch-25-keys', service: 'Zeox Keys', status: 'Done', color: O },
  { name: 'loader-v2.lua', service: 'Script Protect', status: 'Running', color: Y },
];

const checks = ['Prototype interface', 'Mock data only', 'Built for Roblox LuaU'];

export function Landing() {
  return (
    <div id="home" className="page-enter relative min-h-screen overflow-hidden bg-page">
      <NavigationBar />

      {/* ===== Hero ===== */}
      <section className="relative pt-24 lg:pt-32">
        {/* background: grid + glowing orbs */}
        <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-[560px]" />
        <div className="orb h-72 w-72" style={{ ['--c' as any]: P, top: '-40px', left: '8%' }} />
        <div className="orb h-80 w-80" style={{ ['--c' as any]: BL, top: '120px', right: '4%', animationDelay: '2.5s' }} />
        <div className="orb h-56 w-56" style={{ ['--c' as any]: C, top: '380px', left: '42%', opacity: 0.14, animationDelay: '4s' }} />

        <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
          <div className="fade-up mx-auto max-w-3xl text-center">
            <span
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium text-txt-secondary"
              style={{ borderColor: 'rgba(168, 85, 247, 0.35)', background: 'rgba(168, 85, 247, 0.08)', boxShadow: '0 0 18px rgba(168, 85, 247, 0.15)' }}
            >
              <span className="status-dot" style={{ ['--dot' as any]: P, background: P }} />
              LuaU encryption &amp; protection platform
            </span>

            <h1 className="mt-8 text-4xl font-bold leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Encrypt. Protect.
              <br />
              <span
                className="bg-gradient-to-r from-neon-purple via-neon-blue to-neon-cyan bg-clip-text text-transparent"
                style={{ filter: 'drop-shadow(0 0 28px rgba(168, 85, 247, 0.45))' }}
              >
                Ship Your Scripts.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-txt-secondary sm:text-lg">
              Lock down your LuaU scripts with layered encryption, control every license key,
              and watch every operation from one glowing command center.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link to="/dashboard" className="btn-primary !px-8 !py-3">
                Open Dashboard
                <ArrowRight size={16} />
              </Link>
              <a href="#services" className="btn-ghost !px-8 !py-3">
                See what&rsquo;s inside
              </a>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
              {checks.map((c) => (
                <span key={c} className="flex items-center gap-1.5 text-xs text-txt-muted">
                  <CheckCircle2 size={13} className="text-accent-green" />
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Dashboard preview in a glowing gradient frame */}
          <div className="fade-up relative mx-auto mt-16 max-w-4xl" style={{ animationDelay: '120ms' }}>
            <div className="glow-frame">
              <div className="rounded-[1.2rem] bg-panel p-2 sm:p-3">
                <div className="rounded-xl bg-page p-4 sm:p-5">
                  <div className="flex items-center justify-between border-b border-line-soft pb-3">
                    <div className="flex items-center gap-2.5">
                      <ZeoxLogo size={16} className="text-white" />
                      <span className="text-sm font-medium text-white">Overview</span>
                    </div>
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px]"
                      style={{ borderColor: 'rgba(34,211,238,0.35)', color: C, background: 'rgba(34,211,238,0.07)', boxShadow: '0 0 12px rgba(34,211,238,0.12)' }}
                    >
                      <span className="status-dot" style={{ ['--dot' as any]: C, background: C }} />
                      Sample data
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="card p-4 text-left">
                      <p className="text-xs font-medium text-white">Usage</p>
                      <div className="mt-3 space-y-2.5">
                        {heroUsage.map((u) => (
                          <div key={u.label}>
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="flex items-center gap-1.5 text-txt-secondary">
                                <span className="status-dot" style={{ ['--dot' as any]: u.color, background: u.color }} />
                                {u.label}
                              </span>
                              <span className="font-mono text-txt-muted">{u.pct}%</span>
                            </div>
                            <div className="mt-1 h-1 overflow-hidden rounded-full bg-line-soft">
                              <div
                                className="h-full rounded-full"
                                style={{ width: u.pct + '%', background: u.color, boxShadow: '0 0 8px ' + u.color }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="card flex flex-col justify-center p-4">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-[10px] text-txt-muted">Operations over time</p>
                          <p className="mt-1 text-2xl font-semibold tracking-tight text-white">30,240</p>
                        </div>
                        <span className="font-mono text-[10px] text-accent-green">+7.5%</span>
                      </div>
                      <div className="mt-3 flex h-16 items-end gap-1">
                        {heroBars.map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-sm"
                            style={{
                              height: h + '%',
                              background: i === heroBars.length - 1 ? P : 'rgba(255,255,255,0.12)',
                              boxShadow: i === heroBars.length - 1 ? '0 0 10px ' + P : 'none',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="card mt-3 p-2">
                    {previewRows.map((r, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-lg px-2 py-2">
                        <span className="status-dot" style={{ ['--dot' as any]: r.color, background: r.color }} />
                        <span className="flex-1 truncate font-mono text-[10px] text-txt-primary">{r.name}</span>
                        <span className="hidden text-[10px] text-txt-muted sm:block">{r.service}</span>
                        <span className={'text-[10px] ' + (r.status === 'Running' ? 'text-accent-cyan' : 'text-accent-green')}>
                          {r.status}
                        </span>
                        <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-semibold text-black">Download</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust stats */}
          <div className="fade-up mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4" style={{ animationDelay: '200ms' }}>
            {trustStats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="glow-text text-xl font-semibold tracking-tight sm:text-2xl" style={{ ['--c' as any]: P }}>{s.value}</p>
                <p className="mt-1 text-[11px] text-txt-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Platform status ===== */}
      <section id="status" className="relative py-16">
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

      {/* ===== Services ===== */}
      <section id="services" className="py-16">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-white">Services</h2>
            <p className="mt-3 text-sm leading-relaxed text-txt-secondary">
              A unified platform for protection, licensing, and script management.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {services.map((s, i) => {
              const colors = [P, O, C];
              const c = colors[i % colors.length];
              return (
                <GlassCard key={s.name} hover className="group h-full">
                  <div className="flex h-full flex-col p-6">
                    <div className="flex items-center justify-between">
                      <span className="icon-chip h-11 w-11 rounded-xl" style={{ ['--c' as any]: c }}>
                        <s.icon size={19} strokeWidth={1.75} />
                      </span>
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium"
                        style={{ borderColor: c + '55', color: c, background: c + '12' }}
                      >
                        <span className="status-dot" style={{ ['--dot' as any]: c, background: c }} />
                        {s.status}
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">{s.name}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-txt-secondary">{s.description}</p>
                    <Link
                      to="/dashboard"
                      className="mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-medium transition-colors"
                      style={{ color: c }}
                    >
                      Explore
                      <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Why Zeox ===== */}
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
                  <span className="icon-chip h-11 w-11 rounded-xl" style={{ ['--c' as any]: w.color }}>
                    <w.icon size={18} strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-white">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-txt-secondary">{w.description}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section id="features" className="py-16">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-white">Platform Features</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <GlassCard key={f.title} hover compact>
                <div className="p-5">
                  <span className="icon-chip h-10 w-10 rounded-lg" style={{ ['--c' as any]: f.color }}>
                    <f.icon size={16} strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-4 text-sm font-semibold text-white">{f.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-txt-secondary">{f.description}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Developer experience ===== */}
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
              <div
                className="rounded-xl border p-5 font-mono text-xs leading-6"
                style={{ borderColor: 'rgba(34,211,238,0.25)', background: '#050507', boxShadow: '0 0 30px rgba(34,211,238,0.06) inset' }}
              >
                <p className="text-txt-muted">$ zeox encrypt ./script.lua</p>
                <p className="text-accent-green">✓ encrypted · 128 KB → 121 KB</p>
                <p className="text-txt-muted">$ zeox keys create --batch 25</p>
                <p className="text-accent-green">✓ 25 keys issued</p>
                <p className="text-txt-muted">$ zeox status</p>
                <p className="text-accent-cyan">✓ sample status: operational</p>
                <p className="mt-2 text-[10px] text-txt-muted">// illustrative prototype output</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ===== Final CTA ===== */}
      <section id="pricing" className="relative py-24">
        <div className="orb h-64 w-64" style={{ ['--c' as any]: P, bottom: '-60px', left: '30%', opacity: 0.12 }} />
        <div className="relative mx-auto max-w-3xl px-5 text-center lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Ready to build on <span className="glow-text" style={{ ['--c' as any]: P }}>Zeox</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-txt-secondary">
            Join the platform and take control of your scripts, keys, and services.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/dashboard" className="btn-primary">
              Open Dashboard
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
