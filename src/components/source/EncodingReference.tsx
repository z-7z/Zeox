import { BookOpen } from 'lucide-react';
import { BarPanel, type BarDatum } from '../orbit/BarPanel';
import { downloadText } from '../../lib/download';

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
export function EncodingReference() {
  return (
    <details className="job-log byte-reference">
      <summary>
        <BookOpen aria-hidden="true" />
        Encoding reference
      </summary>
      <BarPanel
        title="Literal encoding breakdown"
        context={`Reference bytes · “${specimen}”`}
        rows={bytes}
        detail="Byte reading"
        exportData={() =>
          downloadText(
            'zeoxfucator-byte-reference.csv',
            'text/csv;charset=utf-8',
            'Position,Decimal,Hex,Escape\r\n' +
              bytes.map((r, i) => [i + 1, ...r.facts.map((f) => f[1])].join(',')).join('\r\n'),
          )
        }
      />
    </details>
  );
}
