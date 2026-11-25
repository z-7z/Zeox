import { Fragment, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { ChevronDown, ChevronsLeft, ChevronsRight, CircleHelp, Search, Settings, type LucideIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ZeoxMark } from '../ZeoxMark';
import { sections, type Section } from './sections';
import { sourceLinks } from './sourceLinks';
import { SidebarHint } from './SidebarHint';
import './sidebar.css';

const narrowQuery = '(max-width: 1024px), (max-width: 1180px) and (max-height: 520px)';
export type SideAction = 'find' | 'help' | 'settings';
interface Props {
  active: Section;
  count: number;
  onAction: (action: SideAction) => void;
  actions: Record<SideAction, RefObject<HTMLButtonElement>>;
}

export function Sidebar({ active, count, onAction, actions }: Props) {
  const { hash, key } = useLocation();
  const rail = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const restoreToggle = useRef(false);
  const [narrow, setNarrow] = useState(() => matchMedia(narrowQuery).matches);
  const [folded, setFolded] = useState(false);
  const [groupOpen, setGroupOpen] = useState(true);
  const [drawerKey, setDrawerKey] = useState<string | null>(null);
  // A navigation (including back/forward) dismisses the drawer in the same
  // render as the new page. Its main/anchor can now receive focus immediately.
  const modal = narrow && drawerKey === key;
  const compact = narrow ? !modal : folded;
  useEffect(() => setDrawerKey(null), [key]);
  useEffect(() => {
    const media = matchMedia(narrowQuery);
    const sync = () => {
      if (dialog.current?.open) restoreToggle.current = true;
      setNarrow(media.matches);
      setDrawerKey(null);
    };
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  useLayoutEffect(() => {
    if (!modal) {
      if (restoreToggle.current) toggle.current?.focus({ preventScroll: true });
      restoreToggle.current = false;
      return;
    }
    const el = dialog.current!, overflow = document.body.style.overflow;
    el.showModal();
    document.body.style.overflow = 'hidden';
    el.querySelector<HTMLElement>('[aria-current="page"]')?.focus();
    return () => { el.close(); document.body.style.overflow = overflow; };
  }, [modal]);

  function dismiss() { restoreToggle.current = true; setDrawerKey(null); }
  function toggleWidth() {
    if (modal) dismiss();
    else if (narrow) setDrawerKey(key);
    else setFolded(v => !v);
  }
  function utility(id: SideAction, label: string, Icon: LucideIcon) {
    return <button type="button" className="side-item" aria-label={label} aria-haspopup="dialog" ref={actions[id]}
      onClick={() => { setDrawerKey(null); onAction(id); }}>
      <Icon aria-hidden="true" /><span className="side-label">{label}</span>
    </button>;
  }
  const body = <div className="side-surface" data-compact={compact}>
    <div className="side-head">
      <div className="side-lights" aria-hidden="true"><i /><i /><i /></div>
      <div className="side-brand-row">
        {!compact && <Link className="side-brand" to="/" aria-label="Zeox home"><ZeoxMark /><span>Zeox</span></Link>}
        <button ref={toggle} type="button" className="side-toggle" aria-label={compact ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!compact} aria-controls="workspace-sections" aria-haspopup={narrow && compact ? 'dialog' : undefined} onClick={toggleWidth}>
          {compact ? <ChevronsRight size={19} /> : <ChevronsLeft size={19} />}
        </button>
      </div>
    </div>
    <div className="side-scroll">
      <nav id="workspace-sections" className="side-menu" aria-label="Workspace sections">
        <p className="side-eyebrow">Menu</p>
        {utility('find', 'Find a tool', Search)}
        {sections.map(({ id, label, icon: Icon, path }) => {
          const source = id === 'obfuscate', current = active.id === id, badge = id === 'usages' && count > 0;
          return <Fragment key={id}>
            <div className="side-row" data-current={current || undefined}>
              <Link to={path} className="side-item" aria-label={label} aria-current={current ? 'page' : undefined}
                aria-describedby={badge ? 'side-runs' : undefined}>
                <Icon aria-hidden="true" /><span className="side-label">{label}</span>
              </Link>
              {badge && <>
                <span className="side-count" aria-hidden="true">{count > 99 ? '99+' : count}</span>
                <span className="db-sr" id="side-runs">{count} completed {count === 1 ? 'run' : 'runs'}</span>
              </>}
              {source && !compact && <button type="button" className="side-disclosure" aria-label={`${groupOpen ? 'Hide' : 'Show'} Obfuscator sections`}
                aria-expanded={groupOpen} aria-controls="source-shortcuts" onClick={() => setGroupOpen(v => !v)}><ChevronDown size={15} /></button>}
            </div>
            {source && <ul className="side-submenu" id="source-shortcuts" hidden={!groupOpen} aria-label="Obfuscator sections">
              {sourceLinks.map(link => <li key={link.id}>
                <Link className="side-item side-child" to={`${path}#${link.id}`} aria-label={link.label}
                  aria-current={current && hash === `#${link.id}` ? 'location' : undefined}>
                  <i className={`side-dot ${link.color}`} aria-hidden="true" /><span className="side-label">{link.label}</span>
                </Link>
              </li>)}
            </ul>}
          </Fragment>;
        })}
      </nav>
      <div className="side-other" role="group" aria-label="Other tools">
        <p className="side-eyebrow">Other</p>
        {utility('help', 'Help', CircleHelp)}
        {utility('settings', 'Settings', Settings)}
      </div>
    </div>
  </div>;
  return <aside className="side-slot" ref={rail} data-slim={narrow || folded} aria-label="Sidebar">
    {modal ? <dialog className="side-drawer" ref={dialog} aria-label="Workspace menu"
      onCancel={e => { e.preventDefault(); dismiss(); }} onClick={e => { if (e.target === e.currentTarget) dismiss(); }}>{body}</dialog> : body}
    {compact && <SidebarHint rail={rail} />}
  </aside>;
}
