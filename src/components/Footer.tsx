import { ZeoxLockup } from './ZeoxLogo';

/** Public footer — links are placeholders for a later phase. */
export function Footer() {
  const year = new Date().getFullYear();
  const groups: { title: string; items: string[] }[] = [
    { title: 'Platform', items: ['Zeox Protect', 'Zeox Keys', 'Script Protect'] },
    { title: 'Resources', items: ['Documentation', 'Pricing', 'Status'] },
    { title: 'Company', items: ['About', 'Contact', 'Terms'] },
  ];

  return (
    <footer className="border-t border-white/[0.06] bg-ink-soft">
      <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <ZeoxLockup size={22} />
            <p className="mt-4 text-sm leading-relaxed text-txt-muted">
              An advanced ecosystem of developer tools, script protection, and license management.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {groups.map((g) => (
              <div key={g.title}>
                <p className="text-xs font-semibold uppercase tracking-wider text-txt-secondary">{g.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {g.items.map((i) => (
                    <li key={i}>
                      <span className="cursor-default text-sm text-txt-muted transition-colors hover:text-txt-secondary">
                        {i}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-txt-muted">© {year} Zeox. All rights reserved.</p>
          <p className="font-mono text-xs text-txt-muted">zeox.xyz</p>
        </div>
      </div>
    </footer>
  );
}
