import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { AudioLines, Maximize, Minimize } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ZeoxMark } from '../ZeoxMark';
import { Sidebar, type SideAction } from './Sidebar';
import { ToolFinder } from './ToolFinder';
import { PanelDialog } from './PanelDialog';
import { useUsage } from './UsageSession';
import type { Section } from './sections';
import type { MotionState } from './motion';

function FullScreenButton({ onUnavailable }: { onUnavailable: () => void }) {
  const [full, setFull] = useState(!!document.fullscreenElement);
  useEffect(() => {
    const sync = () => setFull(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);
  if (!document.fullscreenEnabled) return null;
  const Icon = full ? Minimize : Maximize, label = full ? 'Exit full screen' : 'Enter full screen';
  return <button type="button" className="ws-button" onClick={async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
    catch { onUnavailable(); }
  }}><Icon size={15} aria-hidden="true" />{label}</button>;
}

export function Shell({ active, motion, notify, children }: {
  active: Section; motion: MotionState; notify: (message: string) => void; children: ReactNode;
}) {
  const { key } = useLocation(), { count } = useUsage();
  const [panel, setPanel] = useState<SideAction | null>(null);
  const find = useRef<HTMLButtonElement>(null), help = useRef<HTMLButtonElement>(null), settings = useRef<HTMLButtonElement>(null);
  const fromShortcut = useRef(false), close = () => setPanel(null);
  useLayoutEffect(() => setPanel(null), [key]);
  useEffect(() => {
    function shortcut(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k' && !document.querySelector('dialog[open]')) {
        e.preventDefault(); fromShortcut.current = true; setPanel('find');
      }
    }
    window.addEventListener('keydown', shortcut); return () => window.removeEventListener('keydown', shortcut);
  }, []);

  return <div className="db-scene" data-motion={motion.enabled ? 'on' : 'off'}>
    <a className="ws-skip" href="#workspace-main">Skip to content</a>
    <div className="ws-window">
      <Sidebar active={active} count={count} actions={{ find, help, settings }} onAction={id => { fromShortcut.current = false; setPanel(id); }} />
      <div className="ws-content">
        <header className="ws-bar">
          <Link className="ws-compact-brand" to="/" aria-label="Zeox home"><ZeoxMark />Zeox</Link>
          <span className="ws-breadcrumb">Workspace</span><b aria-hidden="true">/</b>
          {active.id === 'obfuscate' ? <span className="ws-route">Script tools</span> :
            <h1 className="ws-route">{active.id === 'dashboard' ? 'Overview' : active.label}</h1>}
          <div className="ws-commands">
            {active.id === 'dashboard' && <span className="ws-sample-tag">Sample charts</span>}
            <span className="ws-device"><i aria-hidden="true" />On device</span>
          </div>
        </header>
        <main id="workspace-main" className="ws-main" tabIndex={-1}>{children}</main>
      </div>
    </div>
    {panel === 'find' && <ToolFinder close={close} returnFocus={fromShortcut.current ? undefined : find} />}
    {panel === 'help' && <PanelDialog title="Help" titleId="help-title" close={close} closeLabel="Close help" returnFocus={help}>
      <p className="dialog-intro">Attach a .lua or .luau file in Obfuscator, choose your build settings, then download the new file. Your original stays unchanged.</p>
      <h3 className="session-subtitle">Keyboard shortcuts</h3>
      <dl className="fact-list"><div><dt>Find a tool</dt><dd>Ctrl / ⌘ + K</dd></div><div><dt>Inspect a focused chart</dt><dd>← → · Home · End</dd></div><div><dt>Dismiss a dialog</dt><dd>Esc</dd></div></dl>
    </PanelDialog>}
    {panel === 'settings' && <PanelDialog title="Settings" titleId="settings-title" close={close} closeLabel="Close settings" returnFocus={settings}>
      <p className="dialog-intro">Files stay on this device. No account or upload is needed.</p>
      <dl className="fact-list"><div><dt>Completed runs</dt><dd>{count}</dd></div><div><dt>Storage</dt><dd>Tab memory</dd></div></dl>
      <div className="session-controls"><button type="button" className="ws-button" onClick={motion.toggle}
        disabled={motion.systemReduced} aria-pressed={motion.enabled}>
        <AudioLines size={15} />{motion.systemReduced ? 'Motion reduced by system preference' : <>Enable animation <small>{motion.enabled ? 'On' : 'Off'}</small></>}</button>
        <FullScreenButton onUnavailable={() => { close(); notify('Full screen is unavailable in this browser window.'); }} /></div>
    </PanelDialog>}
  </div>;
}
