const cols = [
  { title: 'Product', links: ['Overview', 'CORA Engine', 'Playground', 'Changelog'] },
  { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
  { title: 'Resources', links: ['Docs', 'API Reference', 'Community', 'Status'] },
  { title: 'Legal', links: ['Privacy', 'Terms', 'Security'] },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-6">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-black">Z</span>
              <span className="text-base font-semibold text-white">Zeox</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-500">
              Modular compute powered by the CORA Engine. Voice-triggered. Chain-aware. Built to scale.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white">{c.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#top" className="text-sm text-neutral-500 transition-colors hover:text-white">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs text-neutral-600">© 2026 Zeox. All rights reserved.</p>
          <div className="flex gap-5">
            {['X', 'GitHub', 'Discord'].map((s) => (
              <a key={s} href="#top" className="text-xs text-neutral-500 transition-colors hover:text-white">
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
