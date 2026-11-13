import { Badge, Card, SectionHeading } from './ui';

function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white">
      {children}
    </div>
  );
}

export function WhatIs() {
  const features = [
    {
      title: 'Decentralized MCP Marketplace',
      desc: 'Discover, register and publish MCP servers on an open, permissionless registry.',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      title: 'Real-Time, Voice-Driven Execution',
      desc: 'Trigger workflows and tool calls with natural voice commands, executed instantly.',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
        </svg>
      ),
    },
    {
      title: 'Protocol Layer for Chain & App Interoperability',
      desc: 'One protocol that bridges chains, apps and services into a single execution fabric.',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <ellipse cx="12" cy="5" rx="8" ry="3" />
          <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
          <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
        </svg>
      ),
    },
  ];
  return (
    <section id="product" className="mx-auto max-w-6xl px-6 py-28">
      <SectionHeading
        badge="Integration"
        title="What is Zeox AI ?"
        subtitle="A voice-native, modular compute protocol (MCP) built on CORA, bridging real-world workflows to the chain with scale-first design."
      />
      <div className="grid gap-5 md:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title}>
            <IconBox>{f.icon}</IconBox>
            <h3 className="mt-5 text-base font-semibold text-white">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">{f.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

const servers = ['Alchemy MCP Server', 'Base', 'GitHub', 'Redis', 'Microsoft Playground MCP'];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-6 py-28">
      <SectionHeading
        badge="Design • Develop • Deploy • Iterate"
        title="How it Works"
        subtitle="Select from our marketplace, deploy to the scale built to suit."
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <h3 className="text-lg font-semibold text-white">Choose Node</h3>
          <p className="mt-2 text-xs leading-relaxed text-neutral-400">
            Select a template node from the MCP marketplace or bring your own.
          </p>
          <div className="mt-6 flex h-32 items-center justify-center">
            <svg viewBox="0 0 120 120" className="h-32 w-32 text-white" fill="none" stroke="currentColor">
              <circle cx="60" cy="60" r="45" strokeWidth="0.5" opacity="0.4" />
              <circle cx="60" cy="60" r="28" strokeWidth="0.5" opacity="0.6" />
              <circle cx="60" cy="60" r="12" strokeWidth="1" fill="#ffffff" stroke="none" />
              <circle cx="105" cy="60" r="3" fill="#737373" stroke="none" />
              <circle cx="38" cy="22" r="3" fill="#737373" stroke="none" />
              <circle cx="20" cy="88" r="3" fill="#737373" stroke="none" />
            </svg>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-white">Deploy to CORA</h3>
          <p className="mt-2 text-xs leading-relaxed text-neutral-400">
            Spin up your node on CORA in CLI or the playground in seconds.
          </p>
          <ul className="mt-6 space-y-2">
            {servers.map((s, i) => (
              <li
                key={s}
                className={
                  'flex items-center gap-2.5 rounded-lg border px-3 py-2 text-xs ' +
                  (i === 1 ? 'border-white/40 bg-white/10 text-white' : 'border-white/10 bg-white/5 text-neutral-300')
                }
              >
                <span className="h-2 w-2 rounded-sm bg-white" />
                {s}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-white">Register + Publish</h3>
          <p className="mt-2 text-xs leading-relaxed text-neutral-400">
            List, monetize, earn and plug sign with built-in analytics.
          </p>
          <div className="mt-6 flex h-32 flex-col justify-end">
            <div className="flex items-center justify-between rounded-xl border border-white/15 bg-black px-4 py-3">
              <span className="text-xs text-neutral-500">Give any command...</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-white">Playground Mode</h3>
          <p className="mt-2 text-xs leading-relaxed text-neutral-400">
            Prototype, verify, and iterate against live builds and real environments.
          </p>
          <div className="mt-6 rounded-xl border border-white/15 bg-black p-4 font-mono text-[10px] leading-5">
            <p className="text-neutral-500">$ zeox deploy --node cora</p>
            <p className="text-neutral-300">✓ Node registered</p>
            <p className="text-neutral-300">✓ Tools synced (12)</p>
            <p className="text-white">✓ SYSTEM: INTERNAL ACCESS GRANTED</p>
          </div>
        </Card>
      </div>
    </section>
  );
}

export function WhatWeProvide() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-28">
      <SectionHeading
        badge="Your AI Co-pilot In One Interface"
        title="What we provide?"
        subtitle="Zeox AI brings together automation, insights, and real-time edits through the CORA runtime."
      />
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="flex flex-col">
          <div className="flex h-40 items-center justify-center rounded-xl border border-white/10 bg-black">
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <span key={i} className={'h-4 w-4 rounded ' + (i % 2 === 0 ? 'bg-white' : 'bg-neutral-700')} />
              ))}
            </div>
          </div>
          <h3 className="mt-5 text-base font-semibold text-white">CORA Kernel</h3>
          <p className="mt-2 text-sm leading-relaxed text-neutral-400">
            Adaptive compute runtime for persistent memory, task orchestration and real-time edge sync.
          </p>
        </Card>

        <Card className="flex flex-col">
          <div className="flex h-40 flex-col justify-center gap-2 rounded-xl border border-white/10 bg-black p-5">
            {servers.slice(0, 4).map((s, i) => (
              <div
                key={s}
                className={
                  'flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[11px] ' +
                  (i === 1 ? 'border-white/40 bg-white/10 text-white' : 'border-white/10 text-neutral-400')
                }
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                {s}
              </div>
            ))}
          </div>
          <h3 className="mt-5 text-base font-semibold text-white">Edge-Synced Execution</h3>
          <p className="mt-2 text-sm leading-relaxed text-neutral-400">
            Deploy the same agent across mobile, apps, and edge devices with seamless state sync.
          </p>
        </Card>

        <Card className="flex flex-col">
          <div className="flex h-40 items-center justify-center gap-3 rounded-xl border border-white/10 bg-black">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white text-black">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 6l-5 6 5 6M16 6l5 6-5 6" />
              </svg>
            </span>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-neutral-900 text-white">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </span>
          </div>
          <h3 className="mt-5 text-base font-semibold text-white">PlayStack Dev Tools</h3>
          <p className="mt-2 text-sm leading-relaxed text-neutral-400">
            CLI, SDK, remote debugging, and sharable playgrounds for building on Zeox.
          </p>
        </Card>
      </div>
    </section>
  );
}
