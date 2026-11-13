import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  KeyRound,
  LockKeyhole,
} from 'lucide-react';
import { NavigationBar } from '../components/NavigationBar';
import { Footer } from '../components/Footer';
import { ZeoxLogo } from '../components/ZeoxLogo';
import { platformStatus, services } from '../data/mock';
import { scrollToSection } from '../utils/scrollToSection';

const accent = {
  cyan: '#5CD4E6',
  orange: '#FF9150',
  pink: '#F2A6C7',
};

const heroUsage = [
  { label: 'Protect', value: '1,204', pct: 68, color: accent.cyan },
  { label: 'Keys', value: '890', pct: 54, color: accent.orange },
  { label: 'Scripts', value: '612', pct: 41, color: accent.pink },
];

const activityRows = [
  { file: 'main-script.lua', action: 'PROTECT', state: 'DONE', color: accent.cyan },
  { file: 'batch-25-keys', action: 'KEYS', state: 'DONE', color: accent.orange },
  { file: 'loader-v2.lua', action: 'SCRIPT', state: 'RUNNING', color: accent.pink },
];

const steps = [
  { number: '01', title: 'Protect a build', detail: 'Run a LuaU script through the protection pipeline.', icon: LockKeyhole },
  { number: '02', title: 'Control access', detail: 'Issue and manage license keys from one workspace.', icon: KeyRound },
  { number: '03', title: 'Track activity', detail: 'Review operations, status and usage in one view.', icon: Activity },
];

export function Landing() {
  return (
    <div id="home" className="page-enter min-h-screen bg-page text-txt-primary">
      <NavigationBar />
      <main id="main-content" className="pt-14">
        <section className="mx-auto max-w-[1320px] px-4 pb-9 pt-8 sm:px-6 sm:pt-12 lg:px-8 lg:pb-12 lg:pt-16">
          <div className="grid items-stretch gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
            <div className="fade-up flex flex-col justify-center border-l-2 border-accent-orange pl-5 sm:pl-7">
              <p className="eyebrow flex items-center gap-2">
                <span className="status-dot bg-accent-cyan" />
                LUAU SECURITY / CONTROL DECK
              </p>
              <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight text-txt-primary sm:text-5xl lg:text-[3.5rem]">
                Protect every build.
                <span className="mt-1 block text-accent-cyan">Stay in control.</span>
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-6 text-txt-secondary sm:text-base">
                Protect LuaU scripts, manage license access, and follow each operation from one focused workspace.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link to="/dashboard" className="btn-primary">
                  Open control deck <ArrowRight size={15} />
                </Link>
                <a href="#services" onClick={(event) => scrollToSection(event, 'services')} className="btn-ghost">
                  Explore the platform <ChevronRight size={15} />
                </a>
              </div>
              <p className="mt-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-txt-muted">
                <span className="status-dot bg-accent-orange" />
                Prototype UI <span className="text-line">/</span> sample data only
              </p>
            </div>

            <div className="fade-up card min-w-0" style={{ animationDelay: '90ms' }}>
              <div className="flex items-center justify-between border-b border-line-soft bg-panel px-4 py-3 sm:px-5">
                <div className="flex items-center gap-2.5">
                  <ZeoxLogo size={16} className="text-accent-orange" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-txt-secondary">Workspace / Overview</span>
                </div>
                <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-accent-cyan">
                  <span className="status-dot bg-accent-cyan" /> DEMO
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="eyebrow">OPERATIONS MONITOR</p>
                    <p className="mt-1 text-lg font-medium tracking-tight text-txt-primary">Protection activity</p>
                  </div>
                  <span className="rounded-md border border-line px-2 py-1 font-mono text-[9px] text-txt-muted">LAST 30 DAYS</span>
                </div>

                <div className="mt-4 grid grid-cols-3 divide-x divide-line-soft border-y border-line-soft py-3">
                  <div className="px-2 first:pl-0">
                    <p className="font-mono text-[9px] uppercase text-txt-muted">Operations</p>
                    <p className="mt-1 text-lg font-medium tracking-tight">3,482</p>
                  </div>
                  <div className="px-3">
                    <p className="font-mono text-[9px] uppercase text-txt-muted">Uptime</p>
                    <p className="mt-1 text-lg font-medium tracking-tight">99.98%</p>
                  </div>
                  <div className="px-3 last:pr-0">
                    <p className="font-mono text-[9px] uppercase text-txt-muted">Latency</p>
                    <p className="mt-1 text-lg font-medium tracking-tight">42<span className="ml-1 text-xs text-txt-muted">ms</span></p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_0.82fr]">
                  <div className="space-y-3">
                    {heroUsage.map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between font-mono text-[10px]">
                          <span className="flex items-center gap-2 text-txt-secondary"><span className="status-dot" style={{ background: item.color }} />{item.label}</span>
                          <span className="text-txt-muted">{item.value} <span className="ml-1 text-txt-primary">{item.pct}%</span></span>
                        </div>
                        <div className="mt-1.5 h-1 overflow-hidden bg-line-soft">
                          <div className="h-full" style={{ width: item.pct + '%', background: item.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex min-h-24 items-end gap-1 border-l border-line-soft pl-4">
                    {[28, 44, 38, 58, 49, 72, 61, 82, 70, 92, 78, 100].map((height, index) => (
                      <div key={index} className="flex-1" style={{ height: height + '%', minHeight: 8, background: index === 11 ? accent.orange : '#263238' }} />
                    ))}
                  </div>
                </div>

                <div className="mt-5 border-t border-line-soft pt-2">
                  {activityRows.map((row) => (
                    <div key={row.file} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-line-soft/70 py-2 last:border-0">
                      <span className="flex min-w-0 items-center gap-2 font-mono text-[10px] text-txt-secondary"><span className="status-dot" style={{ background: row.color }} /><span className="truncate">{row.file}</span></span>
                      <span className="font-mono text-[9px] text-txt-muted">{row.action}</span>
                      <span className="font-mono text-[9px]" style={{ color: row.color }}>{row.state}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Platform metrics" className="border-y border-line-soft bg-panel/70">
          <div className="mx-auto grid max-w-[1320px] grid-cols-2 divide-x divide-y divide-line-soft px-4 sm:px-6 md:grid-cols-4 md:divide-y-0 lg:px-8">
            {[
              { value: '99.98%', label: 'Platform uptime', color: accent.cyan },
              { value: '30,240', label: 'Operations / month', color: accent.cyan },
              { value: '< 50ms', label: 'Average API latency', color: accent.orange },
              { value: '2.4.1', label: 'Engine build', color: accent.pink },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 px-3 py-4 first:pl-0 md:px-5 md:py-5">
                <span className="h-5 w-0.5" style={{ background: item.color }} />
                <div><p className="text-lg font-medium tracking-tight text-txt-primary sm:text-xl">{item.value}</p><p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-txt-muted">{item.label}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section id="services" className="scroll-mt-16 mx-auto grid max-w-[1320px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.65fr_1.35fr] lg:px-8 lg:py-14">
          <div className="max-w-sm">
            <p className="section-kicker">THE PLATFORM</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-txt-primary sm:text-3xl">One console.<br />Three core tools.</h2>
            <p className="mt-3 text-sm leading-6 text-txt-secondary">A compact workspace for script protection, license keys, and operation monitoring.</p>
            <Link to="/dashboard" className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-accent-cyan hover:text-txt-primary">
              View dashboard <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="divide-y divide-line-soft border-y border-line-soft">
            {services.map((service, index) => {
              const color = index === 0 ? accent.cyan : index === 1 ? accent.orange : accent.pink;
              const Icon = service.icon;
              return (
                <div key={service.name} className="group grid grid-cols-[2rem_2.25rem_1fr_auto] items-center gap-3 py-4 sm:grid-cols-[2.5rem_2.5rem_1fr_auto] sm:gap-4">
                  <span className="font-mono text-[10px] text-txt-muted">0{index + 1}</span>
                  <span className="flex h-9 w-9 items-center justify-center border border-line-soft bg-panel" style={{ color }}><Icon size={16} strokeWidth={1.7} /></span>
                  <div className="min-w-0"><h3 className="truncate text-sm font-medium text-txt-primary">{service.name}</h3><p className="mt-1 truncate text-xs text-txt-muted">{service.description}</p></div>
                  <Link to="/dashboard" aria-label={'Open ' + service.name} className="flex h-8 w-8 items-center justify-center border border-line-soft text-txt-muted transition-colors group-hover:border-line group-hover:text-accent-cyan"><ArrowUpRight size={14} /></Link>
                </div>
              );
            })}
          </div>
        </section>

        <section id="status" className="scroll-mt-16 border-y border-line-soft bg-panel/55">
          <div className="mx-auto max-w-[1320px] px-4 py-9 sm:px-6 lg:px-8 lg:py-11">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div><p className="section-kicker">SYSTEM STATUS</p><h2 className="mt-2 text-xl font-semibold tracking-tight text-txt-primary">Service health</h2></div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-txt-muted">Sample status / not live telemetry</span>
            </div>
            <div className="grid gap-0 border-y border-line-soft sm:grid-cols-3 sm:divide-x sm:divide-line-soft">
              {platformStatus.map((item) => {
                const Icon = item.icon;
                const color = item.level === 'operational' ? accent.cyan : accent.orange;
                return (
                  <div key={item.title} className="flex items-start gap-3 border-b border-line-soft px-3 py-4 last:border-0 sm:border-0 sm:px-5 sm:first:pl-0">
                    <Icon size={15} className="mt-0.5 shrink-0" style={{ color }} />
                    <div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><p className="truncate text-xs font-medium text-txt-primary">{item.title}</p><span className="flex items-center gap-1.5 font-mono text-[9px] uppercase" style={{ color }}><span className="status-dot" style={{ background: color }} />{item.state}</span></div><p className="mt-1 font-mono text-[9px] text-txt-muted">{item.metadata}</p></div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="workflow" className="scroll-mt-16 mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-7 lg:grid-cols-[0.65fr_1.35fr]">
            <div><p className="section-kicker">HOW IT WORKS</p><h2 className="mt-3 text-2xl font-semibold tracking-tight text-txt-primary sm:text-3xl">Built around the work.</h2><p className="mt-3 max-w-sm text-sm leading-6 text-txt-secondary">Move from protected code to managed access without leaving the console.</p></div>
            <div className="grid gap-0 border-y border-line-soft sm:grid-cols-3 sm:divide-x sm:divide-line-soft">
              {steps.map((step) => {
                const Icon = step.icon;
                return <article key={step.number} className="border-b border-line-soft px-3 py-4 last:border-0 sm:border-0 sm:px-5 sm:first:pl-0"><div className="flex items-center justify-between"><span className="font-mono text-[10px] text-accent-orange">/{step.number}</span><Icon size={15} className="text-txt-muted" /></div><h3 className="mt-4 text-sm font-medium text-txt-primary">{step.title}</h3><p className="mt-1.5 text-xs leading-5 text-txt-muted">{step.detail}</p></article>;
              })}
            </div>
          </div>
        </section>

        <section id="developers" className="mx-auto max-w-[1320px] px-4 pb-10 sm:px-6 lg:px-8 lg:pb-14">
          <div className="grid items-center gap-5 border border-line-soft bg-panel px-5 py-6 sm:px-7 lg:grid-cols-[1fr_auto] lg:px-9">
            <div><p className="section-kicker">READY WHEN YOU ARE</p><h2 className="mt-2 text-xl font-semibold tracking-tight text-txt-primary sm:text-2xl">Take the next build into your own hands.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-txt-secondary">Open the prototype control deck to explore sample usage, operation search, and export flows.</p></div>
            <Link to="/dashboard" className="btn-primary w-fit">Open control deck <ArrowRight size={15} /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
