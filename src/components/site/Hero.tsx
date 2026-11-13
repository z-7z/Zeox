const logos = ['Google', 'Brave', 'alchemy', 'stripe', 'Cloudflare', 'Notion', 'Linear', 'Vercel'];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-36">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2"
        style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 40%, transparent 70%)' }}
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
        <div className="relative mx-auto mt-16 flex h-28 w-28 items-center justify-center">
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 65%)' }}
          />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/30 bg-neutral-900 shadow-[0_0_60px_rgba(255,255,255,0.25)]">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2 21 7v10l-9 5-3-5V7l3-5z" />
              <path d="M12 22V12M12 12 3 7M12 12l9-5" />
            </svg>
          </div>
        </div>
      </div>

      <div className="relative mt-8">
        <svg viewBox="0 0 1440 300" className="w-full" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 220 C 240 120 420 280 720 190 C 1020 100 1200 260 1440 170 L 1440 300 L 0 300 Z" fill="#0d0d0d" />
          <path d="M0 250 C 300 170 520 300 780 220 C 1040 140 1240 280 1440 210 L 1440 300 L 0 300 Z" fill="#060606" />
          <path d="M0 280 C 360 220 600 320 900 260 C 1140 215 1300 300 1440 260 L 1440 300 L 0 300 Z" fill="#000000" />
        </svg>
        <div className="absolute inset-x-0 bottom-6 overflow-hidden">
          <div className="animate-marquee flex w-max items-center gap-16 px-8">
            {[...logos, ...logos].map((name, i) => (
              <span key={i} className="whitespace-nowrap text-lg font-semibold tracking-wide text-neutral-500">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
