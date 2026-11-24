import { useRef, useState, type RefObject } from 'react';
import { Link } from 'react-router-dom';
import { PanelDialog } from './PanelDialog';
import { sections, type Section } from './sections';

/** A compact, on-demand tool picker. No second navigation tree for touch. */
export function ToolLauncher({ active, close, trigger }: {
  active: Section; close: () => void; trigger: RefObject<HTMLButtonElement>;
}) {
  const current = useRef<HTMLAnchorElement>(null);
  const [pointed, setPointed] = useState<Section | null>(null);
  const [focused, setFocused] = useState<Section | null>(null);
  const caption = pointed ?? focused ?? active;
  return <PanelDialog title="Tools" titleId="launcher-title" className="ws-launcher" close={close}
    closeLabel="Close tool menu" initialFocus={current} returnFocus={trigger}>
    <nav className="launcher-grid" aria-label="Workspace sections" onPointerLeave={() => setPointed(null)}>
      {sections.map(section => {
        const selected = active.id === section.id, Icon = section.icon;
        return <Link key={section.id} ref={selected ? current : undefined} to={section.path}
          title={section.label} aria-label={section.label} aria-current={selected ? 'page' : undefined}
          onPointerEnter={() => setPointed(section)} onFocus={() => { setFocused(section); setPointed(null); }} onBlur={() => setFocused(null)}
          onClick={e => { if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) close(); }}>
          <Icon size={23} aria-hidden="true" />
        </Link>;
      })}
    </nav>
    <div className="launcher-caption" aria-hidden="true"><strong>{caption.label}</strong><small>{caption.hint}</small></div>
  </PanelDialog>;
}
