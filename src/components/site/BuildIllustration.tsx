import { compactSource } from '../../lib/source/compact';
import flux from '../../assets/guide/flux.webp';
import fluxSmall from '../../assets/guide/flux-small.webp';

// Use the actual lexical pass on a bundled example, never a visitor's script.
const input = '-- Greeting\nlocal  msg = "Hi"\nreturn msg';
const output = compactSource(input, { encodeText: true, removeComments: true, compactSpacing: true });

export function BuildIllustration() {
  return (
    <figure className="build-illustration" aria-labelledby="example-caption">
      <figcaption className="sr-only" id="example-caption">
        A Luau script before and after all three transforms.
      </figcaption>
      <img
        src={flux}
        srcSet={`${fluxSmall} 640w, ${flux} 1220w`}
        sizes="(max-width: 680px) 94vw, (max-width: 1500px) 51vw, 730px"
        width="1220"
        height="976"
        alt=""
      />
      <div>
        <p className="specimen-label">
          <b>Input</b> greeting.luau
        </p>
        <pre>
          <code>{input}</code>
        </pre>
      </div>
      <div className="specimen-output">
        <p className="specimen-label">
          <b>Output</b> greeting.obf.luau
        </p>
        <pre>
          <code>{output}</code>
        </pre>
      </div>
    </figure>
  );
}
