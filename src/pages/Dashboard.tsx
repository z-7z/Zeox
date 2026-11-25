import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, FileCode2 } from 'lucide-react';
import type { SamplePeriod } from '../components/dashboard/period';
import { SampleReport } from '../components/dashboard/SampleReport';
import { FileName } from '../components/FilePicker';
import { CardTitle, PageTitle, SplitFace } from '../components/orbit/Panels';
import { transforms } from '../components/source/transforms';
import { useSourceTool } from '../components/workspace/ToolSessions';
import { useUsage } from '../components/workspace/UsageSession';
import { formatSize } from '../lib/vault/container';

export function Dashboard({ period, setPeriod }: { period: SamplePeriod; setPeriod: (value: SamplePeriod) => void }) {
  const { file, options, result, reading, issue } = useSourceTool();
  const { byTool } = useUsage();
  return (
    <div className="script-dashboard">
      <PageTitle
        title="Dashboard"
        kicker="Lua Obfuscator"
        badge="Guest session"
        description="Choose a script, set the transforms and download a separate copy."
      >
        <Link className="split-action" to={result ? '/obfuscate#build-output' : '/obfuscate'}>
          <SplitFace>{result ? 'Open download' : file ? 'Continue build' : 'Obfuscate a script'}</SplitFace>
        </Link>
      </PageTitle>
      <div className="build-overview">
        <section className="card current-script" aria-label="Current script">
          <CardTitle title="Current script">
            <span className="quiet-badge">
              {reading
                ? 'Reading'
                : result
                  ? 'Copy ready'
                  : issue
                    ? 'Check source'
                    : file
                      ? 'Attached'
                      : 'Not attached'}
            </span>
          </CardTitle>
          <div className="script-identity">
            <i aria-hidden="true">
              <FileCode2 />
            </i>
            <div>
              <h3>{file ? <FileName name={file.name} /> : 'Start with a Lua or Luau file'}</h3>
              <p>{file ? `${formatSize(file.size)} · Attached locally` : 'One UTF-8 script · 512 KiB max'}</p>
            </div>
          </div>
          <p className="script-foot">
            {result ? (
              <>
                Output: <FileName name={result.name} />
              </>
            ) : (
              'Your source stays on this device and is never executed.'
            )}
          </p>
        </section>
        <section className="card build-counter" aria-label="Script builds">
          <CardTitle title="Script builds">
            <span className="quiet-badge">This tab</span>
          </CardTitle>
          <strong className="metric-value">{byTool.compact.toLocaleString('en-US')}</strong>
          <p className="script-foot">Completed builds in this session.</p>
          <Link className="workspace-link" to="/usages">
            View session activity <ArrowUpRight aria-hidden="true" />
          </Link>
        </section>
        <section className="card build-recipe" aria-label="Build settings">
          <CardTitle title="Build settings">
            <Link className="workspace-link" to="/obfuscate#build-settings">
              Edit settings <ArrowRight aria-hidden="true" />
            </Link>
          </CardTitle>
          <ul>
            {transforms.map(([key, label, hint, mark]) => (
              <li key={key}>
                <i className={`token token-${key}`} aria-hidden="true">
                  {mark}
                </i>
                <div>
                  <h3>
                    {label} <span>{options[key] ? 'On' : 'Off'}</span>
                  </h3>
                  <p>{hint}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <SampleReport period={period} setPeriod={setPeriod} />
    </div>
  );
}
