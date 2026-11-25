import { ArrowRight } from 'lucide-react';

// Two glyphs from the example, set like a dot-matrix type specimen.
const dots = ['10001000100', '10001000000', '10001001100', '11111000100', '10001000100', '10001000100', '10001001110'];

export function LiteralStudy() {
  return (
    <figure className="literal-study" aria-label="String encoding example: Hi becomes two decimal byte escapes">
      <div className="study-key" aria-hidden="true">
        <span>Literal study</span>
        <span>UTF-8</span>
      </div>
      <svg viewBox="0 0 210 90" aria-hidden="true" focusable="false">
        <defs>
          <pattern id="specimen-dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="1.3" fill="var(--plate-dot)" />
          </pattern>
        </defs>
        <rect width="210" height="90" fill="url(#specimen-dots)" />
        {dots.flatMap((row, y) =>
          [...row].map(
            (bit, x) =>
              bit === '1' && <circle key={`${y}-${x}`} cx={55 + 10 * x} cy={15 + 10 * y} r="3.9" fill="currentColor" />,
          ),
        )}
      </svg>
      <figcaption>
        <code>"Hi"</code>
        <ArrowRight aria-hidden="true" />
        <code>{'"\\072\\105"'}</code>
      </figcaption>
    </figure>
  );
}
