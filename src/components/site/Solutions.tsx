import { Link } from 'react-router-dom';
import { Card } from './ui';

export function FeatureTrio() {
  const items = [
    {
      title: 'Automated reporting',
      desc: 'Automated reporting is you best, automate insights with zero manual effort.',
      art: (
        <div className="flex h-24 items-center justify-center gap-2">
          <span className="h-10 w-10 rounded-lg border border-white/25 bg-white" />
          <span className="h-14 w-14 rounded-lg border border-white/15 bg-neutral-900" />
        </div>
      ),
    },
    {
      title: 'Multi-platform compatibility',
      desc: 'Multi-platform compatibility lets you code work smoothly across any device or system.',
      art: (
        <div className="flex h-24 items-center justify-center gap-4">
          {['a', 'b', 'c', 'd'].map((c, i) => (
            <span
              key={c}
              className={
                'flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold ' +
                (i === 1 ? 'border-white bg-white text-black' : 'border-white/25 text-neutral-400')
              }
            >
              {c.toUpperCase()}
            </span>
          ))}
        </div>
      ),
    },
    {
      title: 'Secure and compliant',
      desc: 'Secure and compliant means your data stays protected and meets required standards.',
      art: (
        <div className="flex h-24 items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-14 w-14 text-white" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M12 2 20 6v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
      ),
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-28">
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((it) => (
          <Card key={it.title}>
            {it.art}
            <h3 className="mt-5 text-base font-semibold text-white">{it.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">{it.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function AISolutions() {
  const capabilities = [
    { title: 'AI Automation Systems', desc: 'Streamline your business processes with workflow automation and orchestration.' },
    { title: 'AI Development', desc: 'Build custom AI agents and RAG for your business needs and internal operations.' },
    { title: 'Predictive Analytics', desc: 'Turn raw data into accurate forecasts and data-driven insights.' },
    { title: 'Chatbots & Assistants', desc: 'Enhance customer support with 24/7 AI bots that understand and respond.' },
  ];
  return (
    <section id="solutions" className="mx-auto max-w-6xl px-6 py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
            AI Solutions Engineered for Maximum Performance
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-400">
            Discover their gets tools that streamline operations, reduce manual work, and help your business move faster.
          </p>
          <a
            href="#pricing"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
          >
            Explore More
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
        </div>
        <Card className="p-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-4xl font-semibold text-white">1,632</p>
              <p className="mt-1 text-xs text-neutral-500">Total queries this week</p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs text-neutral-300">
              Explore
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </span>
          </div>
          <svg viewBox="0 0 400 130" className="mt-6 w-full">
            <polyline
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              points="0,100 55,78 110,88 165,50 220,66 275,28 330,44 400,18"
            />
            <circle cx="275" cy="28" r="4" fill="#ffffff" />
            <circle cx="275" cy="28" r="9" fill="none" stroke="#ffffff" strokeOpacity="0.3" />
          </svg>
        </Card>
      </div>

      <div className="mt-20 grid gap-8 border-t border-white/10 pt-12 md:grid-cols-2 lg:grid-cols-4">
        {capabilities.map((c) => (
          <div key={c.title}>
            <div className="mb-4 h-px w-10 bg-white" />
            <h3 className="text-sm font-semibold text-white">{c.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-neutral-400">{c.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Donut() {
  const segs = [
    { v: 37.9, c: '#ffffff' },
    { v: 28.0, c: '#b3b3b3' },
    { v: 15.0, c: '#7a7a7a' },
    { v: 12.0, c: '#454545' },
    { v: 7.1, c: '#242424' },
  ];
  const r = 40;
  const circ = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
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
            strokeWidth="14"
            strokeDasharray={dash + ' ' + (circ - dash)}
            strokeDashoffset={-acc}
          />
        );
        acc += dash;
        return el;
      })}
    </svg>
  );
}

function Heatmap() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const shades = ['#1c1c1c', '#3a3a3a', '#6b6b6b', '#a3a3a3', '#ffffff'];
  return (
    <div className="space-y-1">
      {days.map((d, i) => (
        <div key={d} className="flex items-center gap-1">
          <span className="w-6 text-[8px] text-neutral-500">{d}</span>
          {Array.from({ length: 14 }).map((_, j) => (
            <span
              key={j}
              className="h-3 flex-1 rounded-[2px]"
              style={{ background: shades[(i * 7 + j * 5) % 5] }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function DashboardPreview() {
  const traffic = [
    { name: 'Organic search', v: '4.1K' },
    { name: 'Direct', v: '2.8K' },
    { name: 'Referral', v: '1.9K' },
    { name: 'Paid social', v: '950' },
    { name: 'Email', v: '620' },
  ];
  const funnel = [
    { label: 'Product views', v: '72K', p: '100%' },
    { label: 'Add to cart', v: '38.2K', p: '83%' },
    { label: 'Checkout', v: '16.8K', p: '23%' },
    { label: 'Purchase', v: '5.6K', p: '8%' },
  ];
  const actions = ['Add Campaign', 'Create a Campaign', 'Review unfulfilled', 'Workspace settings', 'Export sales'];
  const sources = [
    { name: 'Organic search', v: '37.9%', n: '698' },
    { name: 'Direct', v: '28.0%', n: '516' },
    { name: 'Referral', v: '15.0%', n: '276' },
    { name: 'Paid social', v: '12.0%', n: '221' },
    { name: 'Others', v: '7.1%', n: '131' },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-28">
      <Link to="/dashboard" className="block cursor-pointer transition-opacity hover:opacity-90">
      <div className="rounded-2xl border border-white/10 bg-neutral-950 p-3 shadow-[0_0_80px_rgba(255,255,255,0.06)]">
        <div className="flex overflow-hidden rounded-xl border border-white/10 bg-black">
          <div className="hidden w-11 flex-col items-center gap-4 border-r border-white/10 py-4 sm:flex">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-[10px] font-bold text-black">Z</span>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <span key={i} className={'h-5 w-5 rounded ' + (i === 0 ? 'bg-white/20' : 'bg-white/5')} />
            ))}
          </div>
          <div className="min-w-0 flex-1 p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-medium text-white">Overview</span>
              <div className="flex items-center gap-2">
                <span className="hidden rounded-md border border-white/10 px-3 py-1 text-[10px] text-neutral-500 md:block">Search...</span>
                <span className="h-5 w-5 rounded-full border border-white/15" />
                <span className="h-5 w-5 rounded-full bg-white" />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-white/10 p-4">
                <div className="flex items-baseline justify-between">
                  <p className="text-xl font-semibold text-white">7.8%</p>
                  <p className="text-[10px] text-neutral-500">+ 6.4%</p>
                </div>
                <p className="text-[9px] text-neutral-500">Overall purchase rate. 5.8K orders from 72K views. Last 30 days.</p>
                <div className="mt-4 space-y-2">
                  {funnel.map((f, i) => (
                    <div key={f.label} className="flex items-center gap-2">
                      <div className="relative h-6 overflow-hidden rounded" style={{ width: f.p, background: 'rgba(255,255,255,' + (0.85 - i * 0.18) + ')' }}>
                        <span className={'absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-medium ' + (i < 2 ? 'text-black' : 'text-white')}>
                          {f.p}
                        </span>
                      </div>
                      <span className="whitespace-nowrap text-[9px] text-neutral-500">{f.v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-[8px] text-neutral-600">
                    {funnel.map((f) => (
                      <span key={f.label}>{f.label}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-white/10 p-4">
                <div className="flex items-baseline justify-between">
                  <p className="text-xl font-semibold text-white">1,842</p>
                  <p className="text-[10px] text-neutral-500">+ 5.6%</p>
                </div>
                <p className="text-[9px] text-neutral-500">Total orders in last 30 days</p>
                <div className="mt-3 flex items-center gap-5">
                  <Donut />
                  <div className="flex-1 space-y-1.5">
                    {sources.map((s, i) => (
                      <div key={s.name} className="flex items-center gap-1.5 text-[9px]">
                        <span className="h-1.5 w-1.5 rounded-sm" style={{ background: ['#ffffff', '#b3b3b3', '#7a7a7a', '#454545', '#242424'][i] }} />
                        <span className="flex-1 text-neutral-400">{s.name}</span>
                        <span className="text-neutral-300">{s.v}</span>
                        <span className="text-neutral-600">{s.n}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-white/10 p-3">
                <p className="mb-2 text-[10px] font-medium text-white">Traffic sources</p>
                {traffic.map((t) => (
                  <div key={t.name} className="flex items-baseline gap-1 py-1 text-[9px]">
                    <span className="whitespace-nowrap text-neutral-400">{t.name}</span>
                    <span className="dotted-leader mx-1 flex-1 self-end pb-0.5" />
                    <span className="text-neutral-300">{t.v}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center justify-center rounded-lg border border-white/10 p-3 text-center">
                <div className="mb-2 flex -space-x-2">
                  {['A', 'M', 'K'].map((c) => (
                    <span key={c} className="flex h-7 w-7 items-center justify-center rounded-full border border-black bg-neutral-700 text-[10px] font-semibold text-white">
                      {c}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] font-medium text-white">No Team Members</p>
                <p className="mt-1 text-[8px] text-neutral-500">Invite your team to collaborate on this project.</p>
                <span className="mt-2 rounded-md border border-white/20 px-2.5 py-1 text-[9px] text-neutral-300">+ Invite Members</span>
              </div>

              <div className="rounded-lg border border-white/10 p-3">
                <div className="mb-2 flex items-baseline justify-between">
                  <p className="text-[10px] font-medium text-white">Sales by hour</p>
                  <p className="text-[8px] text-neutral-500">Last 7 days</p>
                </div>
                <p className="text-lg font-semibold text-white">
                  $4.8K <span className="text-[9px] font-normal text-neutral-500">Peak: Sat, 8-9 PM</span>
                </p>
                <div className="mt-2">
                  <Heatmap />
                </div>
              </div>

              <div className="rounded-lg border border-white/10 p-3">
                <p className="mb-2 text-[10px] font-medium text-white">Quick actions</p>
                <ul className="space-y-1.5">
                  {actions.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-[9px] text-neutral-400">
                      <span className="h-3 w-3 rounded-sm border border-white/20" />
                      <span className="flex-1">{a}</span>
                      <span className="text-neutral-600">›</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
    </section>
  );
}
