import { useEffect, useRef } from 'react';
import { PanelDialog } from '../workspace/PanelDialog';
import { dateRange, dayLabel } from './period';
import { number, type Report } from './sample';

export interface Selection {
  chart: 'volume' | 'formats' | 'operations';
  row?: number;
}
export type Inspect = (chart: Selection['chart'], row?: number) => void;
export function ChartDetail({
  selection,
  report,
  close,
}: {
  selection: Selection;
  report: Report;
  close: () => void;
}) {
  const marker = useRef<HTMLTableRowElement>(null);
  useEffect(() => {
    marker.current?.scrollIntoView({ block: 'nearest' });
  }, []);
  const { chart } = selection,
    volume = chart === 'volume';
  const rows = volume
    ? report.rows.map((d) => [
        dayLabel(d.time),
        `${d.mb} MB`,
        number(d.files),
        number(d.saved),
        number(d.files - d.saved),
      ])
    : report[chart].map((s) => [
        s.label,
        number(s.value),
        `${((s.value / report.current.files) * 100).toFixed(1)}%`,
      ]);
  const headings = volume
    ? ['Day', 'Input', 'Files', 'Saved', 'Unsaved']
    : [chart === 'formats' ? 'Format' : 'Operation', 'Files', 'Share'];
  return (
    <PanelDialog
      className="chart-detail"
      title={
        { volume: 'Daily processed volume', formats: 'File distribution', operations: 'Operation mix' }[chart]
      }
      titleId="chart-detail-title"
      close={close}
      closeLabel="Close chart details"
    >
      <p>Sample chart data · {dateRange(report.period)}</p>
      <div className="detail-scroll" tabIndex={0} role="region" aria-label="Chart values">
        <table>
          <thead>
            <tr>
              {headings.map((h) => (
                <th key={h} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, ...values], i) => (
              <tr
                key={name}
                ref={i === selection.row ? marker : undefined}
                className={i === selection.row ? 'chosen-row' : undefined}
              >
                <th scope="row">{name}</th>
                {values.map((v, j) => (
                  <td key={headings[j + 1]}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PanelDialog>
  );
}
