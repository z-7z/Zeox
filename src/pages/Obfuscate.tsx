import { useRef } from 'react';
import { ArrowRight, Check, CircleAlert, FileCheck2, Layers3 } from 'lucide-react';
import { AttachmentField } from '../components/source/AttachmentField';
import { BuildSettings } from '../components/source/BuildSettings';
import { OutputFile } from '../components/source/OutputFile';
import { SOURCE_LIMIT } from '../lib/source/compact';
import { formatSize } from '../lib/vault/container';
import { useSourceTool } from '../components/workspace/ToolSessions';
import { CapacityTile } from '../components/workspace/InstrumentTiles';
import '../components/source/workshop.css';

export function Obfuscate() {
  const tool = useSourceTool(),
    { file, reading, result, issue } = tool,
    builtHere = useRef(false);
  const step = result ? 2 : file && !reading ? 1 : 0;
  return (
    <div className="station-board source-board">
      <section className="ws-panel station-work src-job" aria-labelledby="src-title">
        <header className="station-head">
          <div>
            <small className="eyebrow">SOURCE STATION / 01</small>
            <h2 id="src-title">Script intake</h2>
          </div>
          <span className="source-badge">
            <Layers3 size={13} /> LUA + LUAU
          </span>
        </header>
        <AttachmentField tool={tool} />
        {issue?.field === 'build' && (
          <p className="src-error" role="alert">
            <CircleAlert size={15} />
            {issue.message} Fix the file and attach it again.
          </p>
        )}
        <footer className="src-foot">
          {result ? (
            <OutputFile file={result} focusDownload={builtHere.current} />
          ) : (
            <>
              <span className="src-status" role="status">
                <i />
                {reading ? 'Reading file…' : file ? 'File attached' : 'Waiting for a file'}
              </span>
              <button
                className="ws-button ws-primary src-action"
                disabled={!file || reading}
                onClick={() => {
                  builtHere.current = true;
                  tool.build();
                }}
              >
                Obfuscate file <ArrowRight size={15} />
              </button>
            </>
          )}
        </footer>
      </section>
      <section className="ws-panel station-info src-profile" aria-label="Build profile">
        <small className="eyebrow">PROCESSOR</small>
        <h2>Build profile</h2>
        <div className="profile-value">
          {String(Object.values(tool.options).filter(Boolean).length).padStart(2, '0')}
          <small> / 03 transforms</small>
        </div>
        <BuildSettings tool={tool} />
        <dl className="fact-list">
          <div>
            <dt>Input encoding</dt>
            <dd>UTF-8</dd>
          </div>
          <div>
            <dt>Runtime</dt>
            <dd>On device</dd>
          </div>
          <div>
            <dt>Output</dt>
            <dd>Separate file</dd>
          </div>
        </dl>
      </section>
      <CapacityTile label="512 KiB" limit={SOURCE_LIMIT} size={file?.size ?? null} />
      <section className="ws-panel station-flow src-flow" aria-label="Build pipeline">
        <h2>Build pipeline</h2>
        <ol aria-label="File workflow">
          {['Attach', 'Build', 'Save'].map((s, i) => (
            <li key={s} aria-current={i === step ? 'step' : undefined}>
              <i>{i < step ? <Check size={13} /> : String(i + 1).padStart(2, '0')}</i>
              {s}
            </li>
          ))}
        </ol>
      </section>
      <section className="ws-panel station-note src-receipt" aria-label="Build receipt">
        <div>
          <FileCheck2 size={18} />
          <h2>Build receipt</h2>
        </div>
        <strong>{result ? formatSize(result.blob.size) : 'No output yet'}</strong>
        <p>
          {result ? (
            <bdi dir="ltr">{result.name}</bdi>
          ) : (
            'Attach a script and build a copy. Your original stays unchanged.'
          )}
        </p>
      </section>
    </div>
  );
}
