import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { AudioLines, Keyboard, Fingerprint, Layers3, Maximize, Minimize, Menu, PanelLeftClose, PanelLeftOpen, Search, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ToolFinder } from './ToolFinder';
import { PanelDialog } from './PanelDialog';
import { useUsage } from './UsageSession';
import { ZeoxMark } from '../ZeoxMark';
import { dayLabel, sampleEnd } from '../dashboard/period';
import { sections, type Section } from './sections';
import type { MotionState } from './motion';

// Keep in sync with the compact-shell query in workspace.css (including landscape phones).
const narrowQuery = '(max-width: 760px), (max-width: 1024px) and (max-height: 520px)';
function useNarrowScreen() {
  const [narrow, setNarrow] = useState(() => matchMedia(narrowQuery).matches);
  useEffect(() => {
    const query = matchMedia(narrowQuery), sync = () => setNarrow(query.matches);
    sync(); query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);
  return narrow;
}

function Sections({ active, select }: { active: Section; select?: () => void }) {
  return <nav className="ws-sections" aria-label="Workspace sections">{sections.map(({ id, path, label, icon: Icon }) =>
    <Link key={id} to={path} aria-label={label} title={label} aria-current={active.id === id ? 'page' : undefined} onClick={e => {
      if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) select?.();
    }}><Icon size={19} aria-hidden="true" /></Link>)}
  </nav>;
}
function MotionButton({ motion }: { motion: MotionState }) {
  return <button type="button" className="ws-motion" onClick={motion.toggle} disabled={motion.systemReduced}
    aria-label={motion.systemReduced ? 'Motion reduced by system preference' : 'Enable animation'} aria-pressed={motion.enabled}
    title={motion.systemReduced ? 'Reduced by system preference' : 'Toggle interface motion'}>
    <AudioLines size={18} aria-hidden="true" />
  </button>;
}

// A modal drawer only at narrow widths. The native dialog makes the page
// behind it inert and contains keyboard focus; the desktop rail is not modal.
function Drawer({ open, close, active, motion, trigger }: { open: boolean; close: () => void; active: Section; motion: MotionState; trigger: RefObject<HTMLButtonElement> }) {
  const ref = useRef<HTMLDialogElement>(null);
  useLayoutEffect(() => {
    if (!open || !ref.current) return;
    const el = ref.current, overflow = document.body.style.overflow;
    const opener = trigger.current; // Tapping a button need not focus it on iOS.
    el.showModal(); document.body.style.overflow = 'hidden';
    el.querySelector<HTMLElement>('[aria-current="page"]')?.focus({ preventScroll: true });
    return () => {
      el.close(); document.body.style.overflow = overflow;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [open, trigger]);
  return <dialog ref={ref} id="workspace-sidebar" className="ws-drawer" aria-label="Workspace navigation"
    onCancel={e => { e.preventDefault(); close(); }} onClick={e => { if (e.target === e.currentTarget) close(); }}>
    <div className="ws-drawer-body"><div className="ws-drawer-head">
      <button className="ws-icon-button" onClick={close} aria-label="Close sidebar"><X size={19} /></button></div>
      <Sections active={active} select={close} /><MotionButton motion={motion} />
    </div>
  </dialog>;
}

// Full-bleed layout does not depend on this optional browser feature. Only enter on request.
function FullScreenButton({ onUnavailable }: { onUnavailable: () => void }) {
  const [full, setFull] = useState(!!document.fullscreenElement);
  useEffect(() => { const sync = () => setFull(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', sync); return () => document.removeEventListener('fullscreenchange', sync);
  }, []);
  if (!document.fullscreenEnabled) return null;
  const Icon = full ? Minimize : Maximize, label = full ? 'Exit full screen' : 'Enter full screen';
  return <button type="button" className="ws-icon-button ws-expand" aria-label={label} title={label} onClick={async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
    catch { onUnavailable(); }
  }}><Icon size={15} aria-hidden="true" /></button>;
}

export function Shell({ active, motion, notify, children }: { active: Section; motion: MotionState; notify: (message: string) => void; children: ReactNode }) {
  const narrow = useNarrowScreen(), { key } = useLocation();
  const [rail, setRail] = useState(true), [drawer, setDrawer] = useState(false);
  useLayoutEffect(() => { setDrawer(false); }, [key, narrow]);
  const [utility, setUtility] = useState<'find' | 'info' | 'keys' | null>(null);
  useLayoutEffect(() => setUtility(null), [key]);
  const { count } = useUsage();
  useEffect(() => {
    function shortcut(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k' && !document.querySelector('dialog[open]')) {
        e.preventDefault(); setUtility('find');
      }
    }
    window.addEventListener('keydown', shortcut); return () => window.removeEventListener('keydown', shortcut);
  }, []);
  const trigger = useRef<HTMLButtonElement>(null);
  const visible = narrow ? drawer : rail;
  const Toggle = narrow ? Menu : visible ? PanelLeftClose : PanelLeftOpen;
  return <div className="db-scene" data-motion={motion.enabled ? 'on' : 'off'}>
    <a className="ws-skip" href="#workspace-main">Skip to content</a>
    <div className="ws-window">
      {narrow ? <Drawer open={drawer} close={() => setDrawer(false)} active={active} motion={motion} trigger={trigger} /> :
        <aside id="workspace-sidebar" className="ws-rail" aria-label="Sidebar" hidden={!rail}>
          <Link className="ws-rail-brand" to="/dashboard" aria-label="Zeox home" title="Zeox home"><ZeoxMark /></Link><Sections active={active} /><MotionButton motion={motion} />
        </aside>}
      <div className="ws-frame"><header className="ws-bar">
        <div className="ws-product"><span className="product-token"><Layers3 size={19} /></span><div>
          <h1>{active.id === 'dashboard' ? 'Overview' : active.label}</h1><small>ZEOX / WORKSPACE</small></div></div>
        <button ref={trigger} type="button" className="ws-icon-button rail-switch" aria-label={visible ? 'Hide sidebar' : 'Open sidebar'} title={visible ? 'Hide sidebar' : 'Open sidebar'}
          aria-expanded={visible} aria-controls="workspace-sidebar" aria-haspopup={narrow ? 'dialog' : undefined}
          onClick={() => narrow ? setDrawer(v => !v) : setRail(v => !v)}><Toggle size={17} /></button>
        <div className="ws-instruments">
          <button className="ws-icon-button" aria-label="Keyboard shortcuts" aria-haspopup="dialog" title="Keyboard shortcuts" onClick={() => setUtility('keys')}><Keyboard size={16} /></button>
          <FullScreenButton onUnavailable={() => notify('Full screen is unavailable in this browser window.')} /></div>
        <div className="ws-toolbar-end">
          <button className="tool-search" aria-label="Find a tool" aria-haspopup="dialog" onClick={() => setUtility('find')}><Search size={15}/><span>Find a tool…</span><kbd>⌘ / Ctrl K</kbd></button>
          <span className="scope-tag"><i />{active.id === 'dashboard' ? 'Sample charts' : 'On device'}</span>
          <button className="session-id" aria-label="Local session information" aria-haspopup="dialog" onClick={() => setUtility('info')}><span>Local session</span><b aria-hidden="true"><Fingerprint /></b></button>
          {(narrow || !rail) && active.id !== 'dashboard' && <Link className="ws-icon-button ws-home" to="/dashboard" aria-label="Zeox home" title="Dashboard"><ZeoxMark /></Link>}
        </div>
      </header>
        <main id="workspace-main" className="ws-main" tabIndex={-1}>{children}</main>
      </div>
    </div>
    {utility === 'find' && <ToolFinder close={() => setUtility(null)} />}
    {utility === 'keys' && <PanelDialog title="Keyboard shortcuts" titleId="keys-title" close={() => setUtility(null)} closeLabel="Close shortcuts">
      <dl className="fact-list"><div><dt>Find a tool</dt><dd>Ctrl / ⌘ + K</dd></div><div><dt>Inspect a focused chart</dt><dd>← → · Home · End</dd></div><div><dt>Dismiss a dialog</dt><dd>Esc</dd></div></dl></PanelDialog>}
    {utility === 'info' && <PanelDialog title="Local session" titleId="local-id" close={() => setUtility(null)} closeLabel="Close session information">
      <p className="dialog-intro">This workspace runs in your browser. Files and passphrases stay on this device.</p>
      <dl className="fact-list"><div><dt>Completed runs</dt><dd>{count}</dd></div><div><dt>Storage</dt><dd>Tab memory</dd></div><div><dt>Demo report</dt><dd>Ends {dayLabel(sampleEnd)}, {new Date(sampleEnd).getUTCFullYear()}</dd></div></dl>
    </PanelDialog>}
  </div>;
}
