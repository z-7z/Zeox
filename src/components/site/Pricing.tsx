import { SectionHeading } from './ui';

const plans = [
  {
    name: 'Free',
    price: '$0',
    note: 'per user/month, billed annually',
    features: ['Unlimited Projects', 'Works with known models', 'AI integration'],
    popular: false,
  },
  {
    name: 'Standard',
    price: '$85',
    note: 'per user/month, billed annually',
    features: ['Unlimited Projects', 'AI integration', 'Migration service', 'CI hooks and permissions'],
    popular: true,
  },
  {
    name: 'Premium',
    price: '$120',
    note: 'per user/month, billed annually',
    features: ['Scale volume up to 50k/mo', 'Role in customer data 2.5%', 'Fully flexible permissions', 'Fast support with your own CSS'],
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-28">
      <SectionHeading
        badge="Pricing"
        title={
          <>
            Find the Perfect Plan
            <br />
            for Your Business
          </>
        }
        subtitle="Choose the full potential of AI with flexible pricing."
      />
      <div className="grid gap-5 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={
              'relative rounded-2xl border p-7 ' +
              (p.popular
                ? 'border-white bg-white text-black'
                : 'border-white/10 bg-neutral-950 text-white')
            }
          >
            {p.popular ? (
              <span className="absolute right-6 top-6 rounded-full bg-black px-3 py-1 text-[10px] font-medium text-white">Popular</span>
            ) : null}
            <div className="mb-6 h-9 w-9 rounded-lg border ' + (p.popular ? 'border-black/20' : 'border-white/20') + ''} />
            <h3 className="text-sm font-medium opacity-70">{p.name}</h3>
            <p className="mt-2 text-5xl font-semibold tracking-tight">{p.price}</p>
            <p className={'mt-2 text-xs ' + (p.popular ? 'text-black/60' : 'text-neutral-500')}>{p.note}</p>
            <ul className="mt-7 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <span
                    className={
                      'flex h-4 w-4 flex-none items-center justify-center rounded-full ' +
                      (p.popular ? 'bg-black text-white' : 'bg-white text-black')
                    }
                  >
                    <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="#top"
              className={
                'mt-8 block rounded-full py-2.5 text-center text-sm font-medium transition-colors ' +
                (p.popular
                  ? 'bg-black text-white hover:bg-neutral-800'
                  : 'border border-white/25 text-white hover:bg-white hover:text-black')
              }
            >
              Get Started
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

const integrations = ['Slack', 'GitHub', 'Notion', 'Figma', 'Linear', 'Stripe', 'Vercel', 'Zapier'];

export function Integrations() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-28">
      <SectionHeading
        badge="Integrations"
        title={
          <>
            Seamless Integrations
            <br />
            for Every Workflow
          </>
        }
        subtitle="Bring all your systems together with seamless AI-powered integrations that get smarter over time."
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {integrations.map((name) => (
          <div
            key={name}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-neutral-950 px-5 py-4 transition-colors hover:border-white/30"
          >
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-white text-sm font-bold text-black">
              {name.charAt(0)}
            </span>
            <span className="text-sm font-medium text-neutral-300">{name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
