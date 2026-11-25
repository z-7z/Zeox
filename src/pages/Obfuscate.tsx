import { useRef } from 'react';
import { FilePicker } from '../components/FilePicker';
import { OutputFile } from '../components/source/OutputFile';
import { useSourceTool } from '../components/workspace/ToolSessions';

const transforms = [
  ['encodeText', 'Encode text literals'], ['removeComments', 'Remove comments'], ['compactSpacing', 'Compact spacing'],
] as const;

export function Obfuscate() {
  const tool = useSourceTool(), { file, reading, result, issue } = tool;
  const browse = useRef<HTMLButtonElement>(null), builtHere = useRef(false);
  return <>
    <h1>Lua Obfuscator</h1>
    <form onSubmit={e => { e.preventDefault(); builtHere.current = true; tool.build(); }}>
      <FilePicker legend="Source file" label="Attach Lua or Luau file" accept=".lua,.luau"
        hint="Choose or drop one UTF-8 .lua or .luau file (512 KiB max)." file={file} select={tool.attach}
        remove={tool.remove} browse={browse} reading={reading} errorId={issue?.field === 'file' ? 'file-error' : undefined} />
      {issue?.field === 'file' && <p id="file-error" role="alert">{issue.message}{file && ' Your previous file is still attached.'}</p>}
      <fieldset id="build-settings" tabIndex={-1}><legend>Build settings</legend>
        {transforms.map(([key, label]) => <label key={key}>
          <input type="checkbox" checked={tool.options[key]} onChange={e => tool.configure(key, e.target.checked)} />{label}{' '}
        </label>)}
      </fieldset>
      {issue?.field === 'build' && <p role="alert">{issue.message} Fix the file and attach it again.</p>}
      <div id="build-output" tabIndex={-1}>{result ? <OutputFile file={result} focusDownload={builtHere.current} /> :
        <button type="submit" disabled={!file || reading}>Obfuscate file</button>}</div>
    </form>
    <p>Processing stays on this device. Your original file is unchanged.</p>
  </>;
}
