import { PanelDialog } from '../workspace/PanelDialog';
import { formatSize } from '../../lib/vault/container';
import { days, formats, hour, hourlyKB, inputs, number, stages, total, type Chart } from './sample';

export interface Selection { chart: Chart; row?: number }
function detail(chart: Chart) {
  if (chart === 'hours') return { title: 'Volume by hour', headings: ['Day', 'Processed', 'Peak hour'],
    rows: hourlyKB.map((row, i) => [days[i], formatSize(total(row) * 1000), hour(row.indexOf(Math.max(...row)))]) };
  const series = chart === 'flow' ? stages : chart === 'formats' ? formats : inputs;
  const base = chart === 'flow' ? stages[0].value : total(series.map(s => s.value));
  return { title: { flow: 'Export funnel', formats: 'File distribution', inputs: 'Input formats' }[chart],
    headings: chart === 'flow' ? ['Stage', 'Volume', 'Share of opens'] : ['Format', 'Files', 'Share'],
    rows: series.map(s => [s.name, number(s.value), `${(s.value / base * 100).toFixed(1)}%`]) };
}

/** Read-only chart inspection, not a workspace command menu. */
export function ChartDetail({ selection, close }: { selection: Selection; close: () => void }) {
  const { title, headings, rows } = detail(selection.chart);
  return <PanelDialog className="chart-detail" title={title} titleId="chart-detail-title" close={close} closeLabel="Close chart details">
    <p>Sample chart data. Your actual tool activity is in Usages.</p>
    <table><thead><tr>{headings.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{rows.map(([name, amount, share], i) =>
      <tr key={name} className={selection.row === i ? 'chosen-row' : undefined}><th scope="row">{name}</th><td>{amount}</td><td>{share}</td></tr>)}</tbody></table>
  </PanelDialog>;
}
