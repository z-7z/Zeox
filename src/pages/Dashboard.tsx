import { Link } from 'react-router-dom';
import { dateRange, dayLabel, type SamplePeriod } from '../components/dashboard/period';
import { number, sampleReport } from '../components/dashboard/sample';
import { useUsage } from '../components/workspace/UsageSession';

export function Dashboard({ period, setPeriod }: { period: SamplePeriod; setPeriod: (value: SamplePeriod) => void }) {
  const { current, previous, rows, formats, operations } = sampleReport(period), { count } = useUsage();
  return <>
    <h1>Dashboard</h1>
    <p>Sample report: {dateRange(period)} (UTC). These figures are not your activity.</p>
    <label>Sample period <select value={period} onChange={e => setPeriod(e.target.value === '7' ? 7 : 30)}>
      <option value="7">Last 7 days</option><option value="30">Last 30 days</option>
    </select></label>
    <table><caption>Sample totals</caption>
      <thead><tr><th scope="col">Measure</th><th scope="col">Selected period</th><th scope="col">Previous period</th></tr></thead>
      <tbody>{([['Input (MB)', 'mb'], ['Files', 'files'], ['Saved outputs', 'saved']] as const).map(([label, key]) =>
        <tr key={key}><th scope="row">{label}</th><td>{number(current[key])}</td><td>{number(previous[key])}</td></tr>)}</tbody>
    </table>
    <details><summary>Daily totals</summary><table><caption>Daily sample totals</caption>
      <thead><tr>{['Date', 'MB', 'Files', 'Saved'].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead>
      <tbody>{rows.map(r => <tr key={r.time}><th scope="row">{dayLabel(r.time)}</th><td>{r.mb}</td><td>{r.files}</td><td>{r.saved}</td></tr>)}</tbody>
    </table></details>
    <details><summary>Formats and operations</summary><ul>{[...formats, ...operations].map(({ label, value }) => <li key={label}>{label}: {number(value)}</li>)}</ul></details>
    <p>This tab: {number(count)} completed {count === 1 ? 'run' : 'runs'}. <Link to="/usages">View usages</Link></p>
  </>;
}
