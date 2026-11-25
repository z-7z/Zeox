import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Braces, LockKeyhole } from 'lucide-react';
import { FilePicker } from '../components/FilePicker';
import { EncodingReference } from '../components/source/EncodingReference';
import { SourceDownload } from '../components/source/OutputFile';
import { LocalNote, SectionHead, StudioHeader } from '../components/studio/Studio';
import { useSourceTool } from '../components/workspace/ToolSessions';

const transforms = [
  ['encodeText', 'Encode text literals', 'Write plain quoted strings as decimal byte escapes.', 'Aa'],
  ['removeComments', 'Remove comments', 'Keep directives and license notices.', '//'],
  ['compactSpacing', 'Compact spacing', 'Remove extra whitespace without merging tokens.', '␣'],
] as const;
export function Obfuscate() {
  const tool = useSourceTool(),
    { file, reading, result, issue } = tool;
  const browse = useRef<HTMLButtonElement>(null),
    builtHere = useRef(false);
  return (
    <div className="file-studio">
      <StudioHeader
        title="Lua Obfuscator"
        description="Build a separate copy of your Lua or Luau script with the transforms you choose."
      >
        <Link className="tool-jump" to="/encrypt">
          <LockKeyhole aria-hidden="true" />
          File encryption
          <ArrowUpRight aria-hidden="true" />
        </Link>
        <button
          className="run-action"
          type="button"
          disabled={!file || reading || !!result}
          onClick={() => {
            builtHere.current = true;
            tool.build();
          }}
        >
          <Braces aria-hidden="true" />
          {result ? 'Built' : 'Obfuscate file'}
          <ArrowRight aria-hidden="true" />
        </button>
      </StudioHeader>
      <div className="studio-grid">
        <div className="studio-input">
          <FilePicker
            legend="Source file"
            label="Attach Lua or Luau file"
            accept=".lua,.luau"
            hint="One UTF-8 .lua or .luau script"
            limitLabel="512 KiB"
            file={file}
            select={tool.attach}
            remove={tool.remove}
            browse={browse}
            reading={reading}
            errorId={issue?.field === 'file' ? 'source-error' : undefined}
          />
          {issue && (
            <p id="source-error" className="error" role="alert">
              {issue.message}
              {file && issue.field === 'file' ? ' Your previous file is still attached.' : ''}
            </p>
          )}
          <section id="build-settings" className="studio-section" aria-label="Build configuration" tabIndex={-1}>
            <SectionHead index="02" title="Build settings">
              <small>{Object.values(tool.options).filter(Boolean).length} enabled</small>
            </SectionHead>
            <fieldset className="transform-options">
              <legend className="sr-only">Build settings</legend>
              {transforms.map(([key, label, hint, mark]) => (
                <label className="transform-option" key={key}>
                  <i className={`token token-${key}`} aria-hidden="true">
                    {mark}
                  </i>
                  <span>
                    <b id={`opt-${key}`}>{label}</b>
                    <small>{hint}</small>
                  </span>
                  <span className="studio-toggle">
                    <input
                      type="checkbox"
                      checked={tool.options[key]}
                      aria-labelledby={`opt-${key}`}
                      onChange={(e) => tool.configure(key, e.target.checked)}
                    />
                    <i aria-hidden="true" />
                  </span>
                </label>
              ))}
            </fieldset>
          </section>
          <LocalNote />
        </div>
        <div className="studio-output">
          <SourceDownload file={result} focusDownload={builtHere.current} failed={issue?.field === 'build'} />
          <EncodingReference />
        </div>
      </div>
    </div>
  );
}
