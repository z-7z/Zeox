import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, FileCheck2, FileCode2, ListFilter, LockKeyhole, SlidersHorizontal } from 'lucide-react';
import { FileName, FilePicker } from '../components/FilePicker';
import { OutputFile } from '../components/source/OutputFile';
import { useSourceTool } from '../components/workspace/ToolSessions';
import { PageTitle, Ribbon, SideNote, SplitFace } from '../components/orbit/Panels';
import { BarPanel, type BarDatum } from '../components/orbit/BarPanel';
import { formatSize } from '../lib/vault/container';
import { downloadText } from '../lib/download';

const transforms = [
  ['encodeText', 'Encode text literals', 'Decimal byte escapes', 'Aa', 'Text'],
  ['removeComments', 'Remove comments', 'Retain license notices', '//', 'Notes'],
  ['compactSpacing', 'Compact spacing', 'Keep token boundaries', '␣', 'Space'],
] as const;
const specimen = 'Zeox.luau';
const bytes: BarDatum[] = Array.from(specimen, (c, i) => {
  const n = c.charCodeAt(0);
  return {
    key: String(i),
    tick: c,
    name: `Byte ${String(i + 1).padStart(2, '0')} • ${c}`,
    value: n,
    facts: [
      ['Decimal', String(n)],
      ['Hex', `0x${n.toString(16).toUpperCase()}`],
      ['Escaped', `\\${String(n).padStart(3, '0')}`],
    ],
  };
});
const tabs = ['Build settings', 'Attachment', 'Output'] as const;
export function Obfuscate() {
  const tool = useSourceTool(),
    { file, reading, result, issue } = tool;
  const browse = useRef<HTMLButtonElement>(null),
    builtHere = useRef(false),
    settings = useRef<HTMLElement>(null);
  const [tab, setTab] = useState<(typeof tabs)[number]>('Build settings'),
    [filter, setFilter] = useState('all');
  const active = Object.values(tool.options).filter(Boolean).length;
  function configure() {
    setTab('Build settings');
    setFilter('all');
    settings.current?.focus({ preventScroll: true });
    settings.current?.scrollIntoView({ block: 'nearest' });
  }
  const shown = transforms.filter(([key]) => filter === 'all' || tool.options[key] === (filter === 'on'));
  return (
    <>
      <PageTitle title="Lua Obfuscator">
        <button
          className="round configure"
          type="button"
          aria-label="Go to build settings"
          title="Build settings"
          onClick={configure}
        >
          <SlidersHorizontal aria-hidden="true" />
        </button>
        <div id="build-output" tabIndex={-1}>
          {result ? (
            <OutputFile file={result} focusDownload={builtHere.current} />
          ) : (
            <button
              className="split-action"
              type="button"
              disabled={!file || reading}
              onClick={() => {
                builtHere.current = true;
                tool.build();
              }}
            >
              <SplitFace>Obfuscate file</SplitFace>
            </button>
          )}
        </div>
      </PageTitle>
      {issue && (
        <p id="file-error" className="error" role="alert">
          {issue.message}
          {file && issue.field === 'file' ? ' Your previous file is still attached.' : ''}
        </p>
      )}
      <div className="desk-grid">
        <FilePicker
          legend="Source file"
          label="Attach Lua or Luau file"
          accept=".lua,.luau"
          hint="Drop .lua or .luau here · UTF-8 only"
          file={file}
          select={tool.attach}
          remove={tool.remove}
          browse={browse}
          reading={reading}
          errorId={issue?.field === 'file' ? 'file-error' : undefined}
        />
        <Ribbon
          title="Build pipeline breakdown"
          metrics={[
            [active, 'transforms'],
            ['512', 'KiB limit'],
          ]}
          steps={[
            { label: 'Lua + Luau', caption: 'Source file' },
            { label: 'Transform', caption: 'Processing' },
            { label: 'Save copy', caption: 'Download' },
          ]}
          current={result ? 2 : file && !reading ? 1 : 0}
          marker={result ? 'Built' : file && !reading ? 'Ready' : 'Intake'}
        />
        <BarPanel
          title="Literal encoding breakdown"
          context={`Reference bytes · “${specimen}”`}
          rows={bytes}
          detail="Byte reading"
          exportData={() =>
            downloadText(
              'zeox-byte-reference.csv',
              'text/csv;charset=utf-8',
              'Position,Decimal,Hex,Escape\r\n' +
                bytes.map((r, i) => [i + 1, ...r.facts.map((f) => f[1])].join(',')).join('\r\n'),
            )
          }
        />
        <section
          className="card inspector"
          id="build-settings"
          ref={settings}
          tabIndex={-1}
          aria-label="Build configuration"
        >
          <div className="panel-side">
            <div className="side-choices" role="group" aria-label="Configuration views">
              {tabs.map((t) => (
                <button key={t} type="button" aria-pressed={tab === t} aria-label={t} onClick={() => setTab(t)}>
                  {t === 'Build settings' ? 'Settings' : t}
                </button>
              ))}
            </div>
            <SideNote title="Files stay local">
              <Link className="pill paper small" to="/usages">
                View activity
              </Link>
            </SideNote>
          </div>
          <div className="panel-body">
            {tab === 'Build settings' ? (
              <>
                <div className="panel-tools">
                  <span>
                    <ListFilter aria-hidden="true" />
                    Build controls
                  </span>
                  <select aria-label="Filter transforms" value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">All states</option>
                    <option value="on">Enabled</option>
                    <option value="off">Disabled</option>
                  </select>
                </div>
                <fieldset className="settings-list">
                  <legend className="sr-only">Build settings</legend>
                  <div className="list-caption">
                    <span>Control</span>
                    <span>Scope</span>
                    <span>State</span>
                  </div>
                  {shown.map(([key, label, hint, mark, scope]) => (
                    <label key={key} className="setting-row">
                      <span className="row-id">
                        <i className={`token token-${key}`} aria-hidden="true">
                          {mark}
                        </i>
                        <span>
                          <b id={`label-${key}`}>{label}</b>
                          <small>{hint}</small>
                        </span>
                      </span>
                      <span className="tint" aria-hidden="true">
                        {scope}
                      </span>
                      <span className="switch-wrap">
                        <input
                          type="checkbox"
                          aria-labelledby={`label-${key}`}
                          checked={tool.options[key]}
                          onChange={(e) => tool.configure(key, e.target.checked)}
                        />
                        <span aria-hidden="true" className="state-chip">
                          {tool.options[key] ? 'On' : 'Off'}
                          <i />
                        </span>
                      </span>
                    </label>
                  ))}
                  {filter === 'all' && (
                    <div className="setting-row fixed-rule">
                      <span className="row-id">
                        <i className="token token-fixed" aria-hidden="true">
                          <LockKeyhole aria-hidden="true" />
                        </i>
                        <span>
                          <b>UTF-8 check</b>
                          <small>Required on attach</small>
                        </span>
                      </span>
                      <span className="tint">Input</span>
                      <span className="fixed-chip">Fixed</span>
                    </div>
                  )}
                  {!shown.length && <p className="muted">No transforms in this state.</p>}
                </fieldset>
              </>
            ) : (
              <div className="inspector-detail">
                {tab === 'Attachment' ? <FileCode2 aria-hidden="true" /> : <FileCheck2 aria-hidden="true" />}
                <h2>
                  {tab === 'Attachment'
                    ? file
                      ? 'Attached script'
                      : 'No file attached'
                    : result
                      ? 'Output ready'
                      : 'No output yet'}
                </h2>
                <p>
                  {tab === 'Attachment' ? (
                    file ? (
                      <FileName name={file.name} />
                    ) : (
                      'Choose a UTF-8 Lua or Luau script to begin.'
                    )
                  ) : result ? (
                    <FileName name={result.name} />
                  ) : (
                    'Run the file build to create a separate copy.'
                  )}
                </p>
                {tab === 'Attachment' ? (
                  <button type="button" className="pill" onClick={() => browse.current?.click()}>
                    {file ? 'Replace script' : 'Browse scripts'} <ArrowUpRight aria-hidden="true" />
                  </button>
                ) : (
                  <small>
                    {result
                      ? `${formatSize(result.blob.size)} · Use Download file above.`
                      : 'Your original is never overwritten.'}
                  </small>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
