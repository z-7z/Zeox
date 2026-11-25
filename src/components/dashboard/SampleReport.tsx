import { useState } from 'react';
import { ArrowUpRight, CalendarDays, ChartColumn, Download, Table2 } from 'lucide-react';
import { dateRange, dayLabel, type SamplePeriod } from './period';
import { number, sampleReport } from './sample';
import { BarPanel, type BarDatum } from '../orbit/BarPanel';
import { CardTitle, Ribbon, SideNote } from '../orbit/Panels';
import { downloadText } from '../../lib/download';

import { Choice } from '../ui/Choice';
import { Disclosure } from '../ui/Disclosure';

const periods = [
  { value: 7, label: 'Last 7 days' },
  { value: 30, label: 'Last 30 days' },
] as const;
const views = ['Overview', 'Formats', 'Settings'] as const;
const measures = [
  ['Input (KiB)', 'kib'],
  ['Scripts', 'files'],
  ['Saved outputs', 'saved'],
] as const;
export function SampleReport({
  period,
  setPeriod,
}: {
  period: SamplePeriod;
  setPeriod: (value: SamplePeriod) => void;
}) {
  const { current, previous, rows, formats, settings } = sampleReport(period);
  const [view, setView] = useState<(typeof views)[number]>('Overview');
  const series = view === 'Formats' ? formats : settings,
    delta = (current.kib / previous.kib - 1) * 100;
  const bars: BarDatum[] = [],
    stride = period === 30 ? 3 : 1;
  for (let i = 0; i < rows.length; i += stride) {
    const group = rows.slice(i, i + stride),
      first = group[0].time,
      end = group[group.length - 1].time;
    const total = group.reduce(
      (acc, row) => ({ kib: acc.kib + row.kib, files: acc.files + row.files, saved: acc.saved + row.saved }),
      { kib: 0, files: 0, saved: 0 },
    );
    bars.push({
      key: String(first),
      tick: String(new Date(first).getUTCDate()),
      name: dayLabel(first) + (first === end ? '' : ` – ${dayLabel(end)}`),
      value: total.kib,
      facts: [
        ['Input', `${number(total.kib)} KiB`],
        ['Scripts', number(total.files)],
        ['Saved', number(total.saved)],
      ],
    });
  }
  function exportReport() {
    downloadText(
      `zeoxfucator-sample-${period}d.csv`,
      'text/csv;charset=utf-8',
      [
        'Sample date (UTC),Input KiB,Scripts,Saved outputs',
        ...rows.map((r) => [new Date(r.time).toISOString().slice(0, 10), r.kib, r.files, r.saved].join(',')),
      ].join('\r\n') + '\r\n',
    );
  }
  return (
    <Disclosure title="Sample report" detail="Example data" icon={ChartColumn}>
      <div className="sample-toolbar">
        <p>Example Lua and Luau builds for the selected period. These numbers are illustrative, not your activity.</p>
        <div className="button-row">
          <button
            className="round"
            type="button"
            onClick={exportReport}
            aria-label="Export sample report"
            title="Export sample report"
          >
            <Download aria-hidden="true" />
          </button>
          <Choice<SamplePeriod>
            label="Sample period"
            value={period}
            options={periods}
            change={setPeriod}
            icon={CalendarDays}
          />
        </div>
      </div>
      <div className="desk-grid report-grid">
        <section className="card metric-card">
          <CardTitle title="Total input volume">
            <span className="paper tag">Sample</span>
          </CardTitle>
          <div className="file-value">
            <div className="metric-value">
              {number(current.kib)}
              <small>KiB</small>
            </div>
            <span className="gain" title="Compared with the previous period">
              <ArrowUpRight aria-hidden="true" />
              {delta.toFixed(1)}%
            </span>
          </div>
          <p className="file-foot">{dateRange(period)} (UTC)</p>
        </section>
        <Ribbon
          title="Build settings mix"
          metrics={[
            [number(current.files), 'scripts'],
            [number(current.saved), 'saved'],
          ]}
          current={0}
          marker="Top"
          steps={[
            { label: settings[0].label, caption: `${number(settings[0].value)} builds` },
            { label: settings[1].label, caption: `${number(settings[1].value)} builds` },
            { label: settings[2].label, caption: `${number(settings[2].value)} builds` },
          ]}
          weights={settings.map((s) => s.value)}
        />
        <BarPanel
          title="Input volume breakdown"
          context={`Sample data · ${stride === 1 ? 'Daily totals' : 'Three-day totals'} in KiB`}
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
            <SideNote title="Report key">Settings group scripts by the transforms applied.</SideNote>
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
                              {['K', '#', '✓'][i]}
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
                        <th scope="col">{view === 'Formats' ? 'Format' : 'Settings'}</th>
                        <th scope="col">Scripts</th>
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
      <Disclosure title="Daily totals" icon={Table2} inset>
        <div className="table-scroll">
          <table>
            <caption>Daily sample totals</caption>
            <thead>
              <tr>
                {['Date', 'KiB', 'Scripts', 'Saved'].map((label) => (
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
                  <td>{r.kib}</td>
                  <td>{r.files}</td>
                  <td>{r.saved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Disclosure>
    </Disclosure>
  );
}
