import { Link } from 'react-router-dom';
import { Card } from './ui';
import overviewPreview from '../../assets/overview-preview.webp';

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

// A lightweight thumbnail links to the real workspace rather than maintaining
// a second, divergent implementation of all six dashboard cards here.
export function DashboardPreview() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-28" aria-label="Dashboard preview">
      <Link to="/dashboard" aria-label="Open the interactive Zeox dashboard"
        className="block overflow-hidden rounded-xl border border-white/10 transition-colors hover:border-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
        <img src={overviewPreview} width={2031} height={1176} loading="lazy" decoding="async"
          alt="Zeox overview with a purchase funnel, order distribution, traffic sources and hourly sales heatmap."
          className="block h-auto w-full" />
      </Link>
    </section>
  );
}
