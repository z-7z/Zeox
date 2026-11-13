import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ZeoxLockup } from './ZeoxLogo';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line-soft bg-panel">
      <div className="mx-auto grid max-w-[1320px] gap-7 px-4 py-7 sm:px-6 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
        <div>
          <ZeoxLockup size={19} />
          <p className="mt-2 max-w-md text-xs leading-5 text-txt-muted">LuaU protection, key management, and operation visibility in one workspace.</p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-[9px] uppercase tracking-wider text-txt-muted">
          <a href="#services" className="transition-colors hover:text-txt-primary">Platform</a>
          <a href="#status" className="transition-colors hover:text-txt-primary">System status</a>
          <a href="#workflow" className="transition-colors hover:text-txt-primary">Workflow</a>
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-accent-orange hover:text-txt-primary">Open deck <ArrowUpRight size={11} /></Link>
        </nav>
        <div className="flex items-center justify-between border-t border-line-soft pt-4 font-mono text-[9px] uppercase tracking-wider text-txt-muted md:col-span-2">
          <span>© {year} Zeox</span><span>Prototype / sample data only</span>
        </div>
      </div>
    </footer>
  );
}
