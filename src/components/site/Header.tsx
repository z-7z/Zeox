const links = [
  { label: 'Product', href: '#product' },
  { label: 'How it Works', href: '#how' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Pricing', href: '#pricing' },
];

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-black">Z</span>
          <span className="text-base font-semibold tracking-tight text-white">Zeox</span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="text-sm text-neutral-400 transition-colors hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>
        <a href="#pricing" className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200">
          Get Started
        </a>
      </div>
    </header>
  );
}
