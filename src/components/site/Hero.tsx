const logos = ['Google', 'Brave', 'alchemy', 'stripe', 'Cloudflare', 'Notion', 'Linear', 'Vercel'];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-40">
      <div
        className="pointer-events-none absolute left-1/2 top-[-100px] h-[700px] w-[1100px] -translate-x-1/2"
        style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 40%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-[380px] h-64 w-px -translate-x-1/2"
        style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)' }}
      />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-7xl">
          Modular Compute
          <br />
          Powered By CORA Engine.
        </h1>
        <p className="mt-6 text-base text-neutral-400 md:text-lg">Voice-triggered. Chain-aware. Built to scale.</p>
        <a
          href="#how"
          className="mt-8 inline-block rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
        >
          Enter the MCP Engine
        </a>
        <div className="relative mx-auto mt-20 flex h-32 w-32 items-center justify-center">
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.08) 45%, transparent 70%)' }}
          />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/40 bg-neutral-900 shadow-[0_0_80px_rgba(255,255,255,0.35)]">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2 21 7v10l-9 5-3-5V7l3-5z" />
              <path d="M12 22V12M12 12 3 7M12 12l9-5" />
            </svg>
          </div>
        </div>
      </div>

      <div className="relative mt-4">
        <svg viewBox="0 0 1440 340" className="block w-full" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 200 C 200 90 420 260 720 170 C 1020 80 1220 250 1440 150 L 1440 340 L 0 340 Z" fill="#141414" />
          <path d="M0 240 C 260 150 480 300 760 210 C 1040 120 1260 280 1440 200 L 1440 340 L 0 340 Z" fill="#0b0b0b" />
          <path d="M0 280 C 320 210 560 330 880 255 C 1140 195 1320 300 1440 250 L 1440 340 L 0 340 Z" fill="#050505" />
          <path d="M0 315 C 380 265 640 350 960 295 C 1200 255 1340 320 1440 295 L 1440 340 L 0 340 Z" fill="#000000" />
        </svg>
        <div className="absolute inset-x-0 bottom-8 overflow-hidden">
          <div className="animate-marquee flex w-max items-center gap-20 px-10">
            {[...logos, ...logos].map((name, i) => (
              <span key={i} className="whitespace-nowrap text-xl font-semibold tracking-wide text-neutral-500">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
