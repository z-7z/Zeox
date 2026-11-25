import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Braces } from 'lucide-react';
import { FilePicker } from '../components/FilePicker';
import { EncodingReference } from '../components/source/EncodingReference';
import { SourceDownload } from '../components/source/OutputFile';
import { CardTitle, PageTitle } from '../components/orbit/Panels';
import { Toggle } from '../components/ui/Toggle';
import { useSourceTool } from '../components/workspace/ToolSessions';

import { transforms } from '../components/source/transforms';

export function Obfuscate() {
  const tool = useSourceTool(),
    { file, reading, result, issue } = tool;
  const browse = useRef<HTMLButtonElement>(null),
    builtHere = useRef(false);
  return (
    <div className="task-page source-tool">
      <PageTitle
        kicker="Script workspace"
        badge="On this device"
        title="Lua Obfuscator"
        description="Build a separate copy of your Lua or Luau script with the transforms you choose."
      >
        <button
          className="pill paper run-action"
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
      </PageTitle>
      <div className="work-pair">
        <FilePicker
          title="Choose a script"
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
          feedback={
            issue?.field === 'file' && (
              <p id="source-error" className="error" role="alert">
                {issue.message}
                {file ? ' Your previous file is still attached.' : ''}
              </p>
            )
          }
        />
        <section id="build-settings" className="card settings-card" aria-label="Build configuration" tabIndex={-1}>
          <CardTitle step="02" title="Build settings">
            <span className="quiet-badge">{Object.values(tool.options).filter(Boolean).length} enabled</span>
          </CardTitle>
          <fieldset className="transform-options">
            <legend className="sr-only">Build settings</legend>
            {transforms.map(([key, label, hint, mark]) => (
              <label className="transform-option" key={key}>
                <i className={`token token-${key}`} aria-hidden="true">
                  {mark}
                </i>
                <span>
                  <b id={`opt-${key}`}>{label}</b>
                  <small id={`hint-${key}`}>{hint}</small>
                </span>
                <Toggle
                  checked={tool.options[key]}
                  labelledBy={`opt-${key}`}
                  describedBy={`hint-${key}`}
                  change={(on) => tool.configure(key, on)}
                />
              </label>
            ))}
          </fieldset>
          {issue?.field === 'build' && (
            <p className="error" role="alert">
              {issue.message}
            </p>
          )}
        </section>
      </div>
      <SourceDownload file={result} focusDownload={builtHere.current} failed={issue?.field === 'build'} />
      <EncodingReference />
      <p className="archive-note">
        Need a passphrase-protected archive instead?{' '}
        <Link to="/encrypt">
          File encryption <ArrowUpRight aria-hidden="true" />
        </Link>
      </p>
    </div>
  );
}
