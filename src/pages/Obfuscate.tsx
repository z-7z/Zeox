import { useRef } from 'react';
import { ArrowRight, Check, CircleAlert } from 'lucide-react';
import { AttachmentField } from '../components/source/AttachmentField';
import { BuildSettings } from '../components/source/BuildSettings';
import { OutputFile } from '../components/source/OutputFile';
import { useSourceTool } from '../components/workspace/ToolSessions';
import '../components/source/workshop.css';

const steps = ['Attach', 'Build', 'Save'];
export function Obfuscate() {
  const tool = useSourceTool(), { file, reading, result, issue } = tool;
  const step = result ? 2 : file && !reading ? 1 : 0;
  const builtHere = useRef(false);
  return <div className="ws-file-layout"><section className="glass-card src-job" aria-labelledby="src-title">
    <header className="src-heading">
      <div className="src-topline"><span className="src-kicker"><span aria-hidden="true">//</span> LUA + LUAU</span>
        <ol className="src-steps" aria-label="File workflow">{steps.map((label, i) => <li key={label} aria-current={i === step ? 'step' : undefined}>
          <span aria-hidden="true">{i < step ? <Check size={11} /> : `0${i + 1}`}</span>{label}
        </li>)}</ol></div>
      <h2 id="src-title">Script obfuscator</h2>
      <p>Build a separate copy of your script without sending it off your device.</p>
    </header>
    <div className="src-body"><AttachmentField tool={tool} /><BuildSettings tool={tool} /></div>
    {issue?.field === 'build' && <p className="src-error src-build-error" role="alert"><CircleAlert size={15} aria-hidden="true" /><span>{issue.message} Fix the file and attach it again.</span></p>}
    <footer className="src-foot">{result ? <OutputFile file={result} focusDownload={builtHere.current} /> : <>
      <span className="src-status" role="status"><i aria-hidden="true" />{reading ? 'Reading file…' : file ? issue?.field === 'build' ? 'Build failed' : 'File attached' : 'Waiting for a file'}</span>
      <button type="button" className="ws-button ws-primary src-action" disabled={!file || reading} onClick={() => { builtHere.current = true; tool.build(); }}>Obfuscate file <ArrowRight size={15} aria-hidden="true" /></button>
    </>}</footer>
  </section></div>;
}
