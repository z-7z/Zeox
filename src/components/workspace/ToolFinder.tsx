import { useRef, useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PanelDialog } from './PanelDialog';
import { sections } from './sections';

export function ToolFinder({ close }: { close: () => void }) {
  const field = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(''),
    navigate = useNavigate();
  const matches = sections.filter((s) =>
    `${s.label} ${s.hint}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  function open(path: string) {
    close();
    navigate(path);
  }
  return (
    <PanelDialog
      title="Find a tool"
      titleId="finder-title"
      initialFocus={field}
      close={close}
      closeLabel="Close search"
    >
      <label className="finder-input">
        <Search size={17} />
        <input
          ref={field}
          type="search"
          aria-label="Search tools"
          placeholder="Tool name or action…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              close();
            } else if (e.key === 'Enter' && !e.nativeEvent.isComposing && matches.length) open(matches[0].path);
          }}
        />
      </label>
      <ul className="finder-results">
        {matches.map(({ path, label, hint, icon: Icon }) => (
          <li key={path}>
            <button onClick={() => open(path)}>
              <Icon size={17} />
              <span>
                {label}
                <small>{hint}</small>
              </span>
              <ArrowUpRight size={14} />
            </button>
          </li>
        ))}
      </ul>
      {!matches.length && (
        <p className="finder-empty" role="status">
          No matching tool. Try “file” or “usage”.
        </p>
      )}
    </PanelDialog>
  );
}
