import { useState } from 'react';
import { Check, FileCode2, Minus } from 'lucide-react';
import { transforms } from '../source/transforms';
import { byteLength, compactSource, type Options } from '../../lib/source/compact';

// This public specimen accepts no input files and never touches a guest session.
const original = '-- A short greeting\nlocal   message = "Hi"\n\nreturn   message';
const defaults: Options = { encodeText: true, removeComments: true, compactSpacing: true };

// Highlight only the small vocabulary of our bundled example. React escapes
// each text node; no execution, HTML injection or syntax library is involved.
function SampleCode({ text }: { text: string }) {
  return (
    <code>
      {text.split(/(--[^\n]*|"[^"\n]*"|\b(?:local|return)\b)/g).map((part, i) => {
        if (i % 2 === 0) return part;
        const tone = part.startsWith('--') ? 'comment' : part.startsWith('"') ? 'string' : 'keyword';
        return (
          <span key={i} className={`lua-${tone}`}>
            {part}
          </span>
        );
      })}
    </code>
  );
}

function CodePane({ text, name, output = false }: { text: string; name: string; output?: boolean }) {
  const label = output ? 'Output' : 'Input';
  return (
    <figure
      className="sample-pane"
      data-output={output || undefined}
      id={output ? 'example-output' : undefined}
      aria-label={`${label}: ${name}`}
    >
      <figcaption>
        <span className="pane-label">{label}</span>
        <span className="pane-name">
          <FileCode2 aria-hidden="true" />
          {name}
        </span>
        <small>{byteLength(text)} B</small>
      </figcaption>
      <div className="sample-code">
        <span className="line-numbers" aria-hidden="true">
          {text
            .split('\n')
            .map((_, i) => String(i + 1).padStart(2, '0'))
            .join('\n')}
        </span>
        <pre>
          <SampleCode text={text} />
        </pre>
      </div>
    </figure>
  );
}

export function LiveExample() {
  const [options, setOptions] = useState(defaults);
  const result = compactSource(original, options);
  const count = Object.values(options).filter(Boolean).length;
  return (
    <section id="live-example" tabIndex={-1} className="site-width example-section" aria-labelledby="example-title">
      <header className="manual-heading">
        <div>
          <span className="section-index" aria-hidden="true">
            01
          </span>
          <h2 id="example-title">Live example</h2>
        </div>
        <p>Switch a transform to see what changes.</p>
      </header>
      <div className="example-bench">
        <div className="sample-pair">
          <CodePane name="greeting.luau" text={original} />
          <CodePane name={`greeting.${options.encodeText ? 'obf' : 'compact'}.luau`} text={result} output />
        </div>
        <div className="sample-controls">
          <div className="sample-passes" role="group" aria-label="Example transforms">
            {transforms.map(([key, label, hint]) => (
              <button
                type="button"
                key={key}
                aria-pressed={options[key]}
                aria-controls="example-output"
                title={hint}
                onClick={() => setOptions((prev) => ({ ...prev, [key]: !prev[key] }))}
              >
                <i aria-hidden="true">{options[key] ? <Check /> : <Minus />}</i>
                {label}
              </button>
            ))}
          </div>
          <span className="pass-count" role="status" aria-atomic="true">
            {count} of 3 on<span className="sr-only">. Example output: {byteLength(result)} bytes.</span>
          </span>
        </div>
      </div>
    </section>
  );
}
