import { CalendarDays } from 'lucide-react';
import { dateRange, type SamplePeriod } from './period';

export function ReportControls({ period, setPeriod }: { period: SamplePeriod; setPeriod: (period: SamplePeriod) => void }) {
  return <div className="ws-report-controls">
    <span className="ws-device"><i aria-hidden="true" />Sample charts</span>
    <select aria-label="Sample period" value={period} onChange={e => setPeriod(e.target.value === '7' ? 7 : 30)}>
      <option value={7}>7 days</option><option value={30}>30 days</option>
    </select>
    <span className="ws-dates"><CalendarDays size={14} aria-hidden="true" />{dateRange(period)}</span>
  </div>;
}
