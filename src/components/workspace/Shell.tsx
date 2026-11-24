import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { AudioLines, Grid2X2, Maximize, Minimize, Search, Settings2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ZeoxMark } from '../ZeoxMark';
import { ToolLauncher } from './ToolLauncher';
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
  const [panel, setPanel] = useState<'tools' | 'find' | 'session' | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = () => setPanel(null);
  useLayoutEffect(() => setPanel(null), [key]);
  useEffect(() => {
    function shortcut(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k' && !document.querySelector('dialog[open]')) {
        e.preventDefault(); setPanel('find');
      }
    }
    window.addEventListener('keydown', shortcut); return () => window.removeEventListener('keydown', shortcut);
  }, []);

  return <div className="db-scene" data-motion={motion.enabled ? 'on' : 'off'}>
    <a className="ws-skip" href="#workspace-main">Skip to content</a>
    <div className="ws-window">
      <header className="ws-bar">
        <button ref={trigger} className="ws-launch-button ws-icon-button" type="button" aria-label="Open tools"
          title="Open tools" aria-haspopup="dialog" aria-expanded={panel === 'tools'} onClick={() => setPanel('tools')}>
          <Grid2X2 size={19} aria-hidden="true" />
        </button>
        <Link className="ws-wordmark" to="/" aria-label="Zeox home"><ZeoxMark />Zeox</Link>
        <span className="ws-divider" aria-hidden="true">/</span>
        {active.id === 'obfuscate' ? <span className="ws-route">Script tools</span> :
          <h1 className="ws-route">{active.id === 'dashboard' ? 'Overview' : active.label}</h1>}
        <div className="ws-commands">
          {active.id === 'dashboard' && <span className="ws-sample-tag">Sample charts</span>}
          <button className="tool-search" type="button" aria-label="Find a tool" title="Find a tool (Ctrl / ⌘ + K)"
            aria-haspopup="dialog" onClick={() => setPanel('find')}><Search size={15} /><span>Find a tool</span><kbd>Ctrl / ⌘ K</kbd></button>
          <button className="session-id" type="button" aria-label="Local session information" title="Local session & preferences"
            aria-haspopup="dialog" onClick={() => setPanel('session')}><Settings2 size={17} aria-hidden="true" /><i aria-hidden="true" /><span>Local session</span></button>
        </div>
      </header>
      <main id="workspace-main" className="ws-main" tabIndex={-1}>{children}</main>
    </div>
    {panel === 'tools' && <ToolLauncher active={active} close={close} trigger={trigger} />}
    {panel === 'find' && <ToolFinder close={close} />}
    {panel === 'session' && <PanelDialog title="Local session" titleId="session-title" close={close} closeLabel="Close session information">
      <p className="dialog-intro">Files stay on this device. No account or upload is needed.</p>
      <dl className="fact-list"><div><dt>Completed runs</dt><dd>{count}</dd></div><div><dt>Storage</dt><dd>Tab memory</dd></div></dl>
      <h3 className="session-subtitle">Keyboard shortcuts</h3>
      <dl className="fact-list"><div><dt>Find a tool</dt><dd>Ctrl / ⌘ + K</dd></div><div><dt>Inspect a focused chart</dt><dd>← → · Home · End</dd></div><div><dt>Dismiss a dialog</dt><dd>Esc</dd></div></dl>
      <div className="session-controls"><button type="button" className="ws-button" onClick={motion.toggle}
        disabled={motion.systemReduced} aria-pressed={motion.enabled}
        aria-label={motion.systemReduced ? 'Motion reduced by system preference' : 'Enable animation'}>
        <AudioLines size={15} />{motion.systemReduced ? 'Reduced motion' : motion.enabled ? 'Motion on' : 'Motion off'}</button>
        <FullScreenButton onUnavailable={() => { close(); notify('Full screen is unavailable in this browser window.'); }} /></div>
    </PanelDialog>}
  </div>;
}
