import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CalendarDays, ChevronDown, Download } from 'lucide-react';
import { dateRange, dayLabel, type SamplePeriod } from '../components/dashboard/period';
import { number, sampleReport } from '../components/dashboard/sample';
import { useUsage } from '../components/workspace/UsageSession';
import { BarPanel, type BarDatum } from '../components/orbit/BarPanel';
import { CardTitle, PageTitle, Ribbon, SideNote } from '../components/orbit/Panels';
import { downloadText } from '../lib/download';

const views = ['Overview', 'Formats', 'Operations'] as const;
const measures = [
  ['Input (MB)', 'mb'],
  ['Files', 'files'],
  ['Saved outputs', 'saved'],
] as const;
export function Dashboard({ period, setPeriod }: { period: SamplePeriod; setPeriod: (value: SamplePeriod) => void }) {
  const { current, previous, rows, formats, operations } = sampleReport(period),
    { count } = useUsage();
  const [view, setView] = useState<(typeof views)[number]>('Overview');
  const series = view === 'Formats' ? formats : operations,
    delta = (current.mb / previous.mb - 1) * 100;
  const bars: BarDatum[] = [],
    stride = period === 30 ? 3 : 1;
  for (let i = 0; i < rows.length; i += stride) {
    const group = rows.slice(i, i + stride),
      first = group[0].time,
      end = group[group.length - 1].time;
    const total = group.reduce(
      (acc, row) => ({ mb: acc.mb + row.mb, files: acc.files + row.files, saved: acc.saved + row.saved }),
      { mb: 0, files: 0, saved: 0 },
    );
    bars.push({
      key: String(first),
      tick: String(new Date(first).getUTCDate()),
      name: dayLabel(first) + (first === end ? '' : ` – ${dayLabel(end)}`),
      value: total.mb,
      facts: [
        ['Input', `${number(total.mb)} MB`],
        ['Files', number(total.files)],
        ['Saved', number(total.saved)],
      ],
    });
  }
  function exportReport() {
    downloadText(
      `zeox-sample-${period}d.csv`,
      'text/csv;charset=utf-8',
      [
        'Sample date (UTC),Input MB,Files,Saved outputs',
        ...rows.map((r) => [new Date(r.time).toISOString().slice(0, 10), r.mb, r.files, r.saved].join(',')),
      ].join('\r\n') + '\r\n',
    );
  }
  return (
    <>
      <PageTitle title="Dashboard" badge="Sample report" kicker="Workspace overview">
        <button
          className="round"
          type="button"
          onClick={exportReport}
          aria-label="Export sample report"
          title="Export sample report"
        >
          <Download aria-hidden="true" />
        </button>
        <label className="period-picker">
          <CalendarDays aria-hidden="true" />
          <select
            aria-label="Sample period"
            value={period}
            onChange={(e) => setPeriod(e.target.value === '7' ? 7 : 30)}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
          </select>
          <ChevronDown aria-hidden="true" />
        </label>
      </PageTitle>
      <div className="desk-grid report-grid">
        <section className="card metric-card">
          <CardTitle title="Total input volume">
            <span className="paper tag">Sample</span>
          </CardTitle>
          <div className="file-value">
            <div className="metric-value">
              {number(current.mb)}
              <small>MB</small>
            </div>
            <span className="gain" title="Compared with the previous period">
              <ArrowUpRight aria-hidden="true" />
              {delta.toFixed(1)}%
            </span>
          </div>
          <p className="file-foot">{dateRange(period)} (UTC)</p>
        </section>
        <Ribbon
          title="Operation breakdown"
          metrics={[
            [number(current.files), 'files'],
            [number(current.saved), 'saved'],
          ]}
          current={0}
          marker="Top"
          steps={[
            { label: 'Source build', caption: `${number(operations[0].value)} builds` },
            { label: 'Encrypt', caption: `${number(operations[1].value)} jobs` },
            { label: 'Restore', caption: `${number(operations[2].value)} jobs` },
          ]}
          weights={operations.map((op) => op.value)}
        />
        <BarPanel
          title="Input volume breakdown"
          context={`Sample data · ${stride === 1 ? 'Daily totals' : 'Three-day totals'} in MB`}
          rows={bars}
          detail="Input reading"
          exportData={exportReport}
        />
        <section className="card inspector" aria-label="Report details">
          <div className="panel-side">
            <div className="side-choices" role="group" aria-label="Report views">
              {views.map((v) => (
                <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}>
                  {v}
                </button>
              ))}
            </div>
            <SideNote title={`This tab: ${number(count)} completed ${count === 1 ? 'run' : 'runs'}.`}>
              <Link className="pill paper small" to="/usages">
                View usages
              </Link>
            </SideNote>
          </div>
          <div className="panel-body">
            <div className="panel-tools">
              <span>
                <CalendarDays aria-hidden="true" />
                Period comparison
              </span>
              <span className="quiet-badge">{period} days</span>
            </div>
            <div className="table-scroll">
              <table className="report-table">
                <caption className="sr-only">
                  {view === 'Overview' ? 'Sample totals' : `Sample ${view.toLowerCase()}`}
                </caption>
                {view === 'Overview' ? (
                  <>
                    <thead>
                      <tr>
                        <th scope="col">Measure</th>
                        <th scope="col">Selected</th>
                        <th scope="col">Previous</th>
                      </tr>
                    </thead>
                    <tbody>
                      {measures.map(([label, k], i) => (
                        <tr key={k}>
                          <th scope="row">
                            <i className={`token token-${i}`} aria-hidden="true">
                              {['M', '#', '✓'][i]}
                            </i>
                            {label}
                          </th>
                          <td className="tint">{number(current[k])}</td>
                          <td>{number(previous[k])}</td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                ) : (
                  <>
                    <thead>
                      <tr>
                        <th scope="col">{view === 'Formats' ? 'Format' : 'Operation'}</th>
                        <th scope="col">Files</th>
                        <th scope="col">Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      {series.map((r, i) => (
                        <tr key={r.label}>
                          <th scope="row">
                            <i className={`token token-${i % 3}`} aria-hidden="true">
                              {r.label.slice(0, 1)}
                            </i>
                            {r.label}
                          </th>
                          <td className="tint">{number(r.value)}</td>
                          <td>{Math.round((r.value / current.files) * 100)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}
              </table>
            </div>
            <p className="table-foot">Illustrative data, not your activity.</p>
          </div>
        </section>
      </div>
      <details className="disclosure">
        <summary>Daily totals</summary>
        <div className="table-scroll">
          <table>
            <caption>Daily sample totals</caption>
            <thead>
              <tr>
                {['Date', 'MB', 'Files', 'Saved'].map((label) => (
                  <th key={label} scope="col">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.time}>
                  <th scope="row">{dayLabel(r.time)}</th>
                  <td>{r.mb}</td>
                  <td>{r.files}</td>
                  <td>{r.saved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </>
  );
}
