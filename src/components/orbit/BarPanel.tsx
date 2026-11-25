import { useId, useRef, useState } from 'react';
import { ArrowUpRight, ChartColumnIncreasing, Download } from 'lucide-react';
import { Dialog } from './Dialog';
import { CardTitle } from './Panels';

export interface BarDatum {
  key: string;
  tick: string;
  name: string;
  value: number;
  facts: [string, string][];
}
interface Props {
  title: string;
  context: string;
  rows: BarDatum[];
  detail: string;
  exportData?: () => void;
  empty?: string;
}
/** Hatched columns and a highlighted reading. Pointer, focus, touch and arrow
 * keys all select the same datum; the table exposes every value without hover. */
export function BarPanel({ title, context, rows, detail, exportData, empty }: Props) {
  const [picked, setPicked] = useState(2),
    [table, setTable] = useState(false),
    [show, setShow] = useState(true);
  const refs = useRef<(HTMLButtonElement | null)[]>([]),
    id = useId();
  const index = Math.min(picked, rows.length - 1),
    selected = rows[index],
    peak = Math.max(1, ...rows.map((r) => r.value));
  const select = (i: number) => {
    setPicked(i);
    setShow(true);
  };
  return (
    <section className="card bar-card" aria-label={title}>
      <CardTitle title={title} context={context}>
        {exportData && (
          <button
            className="round"
            type="button"
            aria-label={`Export ${title.toLowerCase()} CSV`}
            title="Export CSV"
            onClick={exportData}
          >
            <Download aria-hidden="true" />
          </button>
        )}
        <button
          className="round"
          type="button"
          aria-label={`View ${title.toLowerCase()} table`}
          title="View all values"
          disabled={!rows.length}
          onClick={() => setTable(true)}
        >
          <ArrowUpRight aria-hidden="true" />
        </button>
      </CardTitle>
      {selected ? (
        <div
          className="bars"
          role="group"
          aria-label={title}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setShow(false);
          }}
        >
          {rows.map((r, i) => (
            <button
              type="button"
              className="bar-column"
              key={r.key}
              ref={(el) => {
                refs.current[i] = el;
              }}
              aria-label={`${r.tick}: ${r.name}, ${r.facts.map(([label, value]) => `${label}: ${value}`).join(', ')}`}
              aria-pressed={index === i}
              tabIndex={index === i ? 0 : -1}
              onPointerMove={(e) => {
                // Scrolling to a keyboard-focused column can move a different one
                // under a stationary pointer. Only actual movement selects a reading.
                if (e.pointerType !== 'touch' && (e.movementX || e.movementY)) select(i);
              }}
              onFocus={() => select(i)}
              onClick={() => select(i)}
              onKeyDown={(e) => {
                let to: number;
                if (e.key === 'ArrowLeft') to = Math.max(i - 1, 0);
                else if (e.key === 'ArrowRight') to = Math.min(i + 1, rows.length - 1);
                else if (e.key === 'Home') to = 0;
                else if (e.key === 'End') to = rows.length - 1;
                else return;
                e.preventDefault();
                refs.current[to]?.focus();
              }}
            >
              <span className="bar-well">
                <i style={{ height: `${Math.max(2, (r.value / peak) * 98)}%` }} />
              </span>
              <span className="bar-tick">{r.tick}</span>
            </button>
          ))}
          {show && (
            <div
              className="reading"
              aria-hidden="true"
              style={
                index < rows.length / 2
                  ? { left: `${Math.min(56, ((index + 0.95) / rows.length) * 100)}%` }
                  : { right: `${Math.min(56, ((rows.length - index - 0.05) / rows.length) * 100)}%` }
              }
            >
              <div className="reading-head">
                <i>
                  <ChartColumnIncreasing aria-hidden="true" />
                </i>
                <b>
                  {detail}
                  <small>{selected.name}</small>
                </b>
              </div>
              <dl>
                {selected.facts.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      ) : (
        <div className="empty-state">
          <ChartColumnIncreasing aria-hidden="true" />
          <h3>No runs yet</h3>
          <p>{empty}</p>
        </div>
      )}
      {table && (
        <Dialog title={title} close={() => setTable(false)}>
          <p>{context}</p>
          <div className="table-scroll" role="region" aria-labelledby={id} tabIndex={0}>
            <table>
              <caption id={id}>{detail} values</caption>
              <thead>
                <tr>
                  <th scope="col">Reading</th>
                  {rows[0]?.facts.map(([k]) => (
                    <th scope="col" key={k}>
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.key}>
                    <th scope="row">{r.name}</th>
                    {r.facts.map(([k, v]) => (
                      <td key={k}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Dialog>
      )}
    </section>
  );
}
