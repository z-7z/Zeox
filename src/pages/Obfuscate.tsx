import { useRef, type ReactNode } from 'react';
import { ArrowRight, Check, CircleAlert } from 'lucide-react';
import { AttachmentField } from '../components/source/AttachmentField';
import { BuildSettings } from '../components/source/BuildSettings';
import { OutputFile } from '../components/source/OutputFile';
import { formatSize } from '../lib/vault/container';
import { useSourceTool } from '../components/workspace/ToolSessions';
import '../components/source/workshop.css';

function SectionHead({ number, title, id, children }: { number: string; title: string; id: string; children?: ReactNode }) {
  return <header className="src-head"><span aria-hidden="true">{number}</span><h2 id={id}>{title}</h2>{children}</header>;
}

export function Obfuscate() {
  const tool = useSourceTool(), { file, reading, result, issue } = tool;
  const builtHere = useRef(false), step = result ? 2 : file && !reading ? 1 : 0;
  return <div className="source-board">
    <section className="ws-panel src-job" aria-labelledby="src-input-title">
      <SectionHead number="01" title="Source file" id="src-input-title"><small>UTF-8</small></SectionHead>
      <AttachmentField tool={tool} />
      {issue?.field === 'build' && <p className="src-error" role="alert"><CircleAlert size={15} />{issue.message} Fix the file and attach it again.</p>}
      <footer className="src-foot">
        {result ? <OutputFile file={result} focusDownload={builtHere.current} /> : <>
          <span className="src-status" role="status"><i data-ready={!!file && !reading || undefined} />
            {reading ? 'Reading file…' : file ? 'Ready to build' : 'Waiting for a file'}</span>
          <button type="button" className="ws-button ws-primary src-action" disabled={!file || reading}
            onClick={() => { builtHere.current = true; tool.build(); }}>Obfuscate file <ArrowRight size={15} /></button>
        </>}
      </footer>
    </section>
    <section className="ws-panel src-profile" aria-labelledby="src-config-title">
      <SectionHead number="02" title="Build settings" id="src-config-title"><small>{Object.values(tool.options).filter(Boolean).length} enabled</small></SectionHead>
      <BuildSettings tool={tool} />
    </section>
    <section className="ws-panel src-receipt" aria-labelledby="src-output-title">
      <SectionHead number="03" title="Build output" id="src-output-title"><small>{result ? formatSize(result.blob.size) : 'LOCAL ONLY'}</small></SectionHead>
      <div className="src-output-copy"><strong>{result ? <bdi dir="ltr" title={result.name}>{result.name}</bdi> : 'No output yet'}</strong>
        <p>{result ? 'Your copy is ready to download.' : 'Your original stays unchanged.'}</p></div>
      <ol className="src-flow" aria-label="File workflow">
        {['Attach', 'Build', 'Save'].map((label, i) => <li key={label} aria-current={i === step ? 'step' : undefined} data-done={i < step || undefined}>
          <i aria-hidden="true">{i < step ? <Check size={12} /> : `0${i + 1}`}</i>{label}</li>)}
      </ol>
    </section>
  </div>;
}
