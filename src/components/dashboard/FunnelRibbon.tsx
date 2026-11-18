// The same curve meets on either side of each column. The three nested
// envelopes make the thickness of the ribbon legible, even at phone sizes.
const ribbon = [
  ['#404146', '#8e8e97', '#c9c9d1'],
  ['#34353a', '#53545f', '#757580'],
  ['#292a30', '#3e3e48', '#565660'],
  ['#29292e', '#393941', '#45454e'],
];
function envelope(column: number, start: number, end: number, scale: number) {
  const x = column * 160, next = x + 160;
  const a = 136 * start * scale, b = 136 * end * scale;
  return `M${x},${150 - a} C${x + 85},${150 - a} ${next - 78},${150 - b} ${next},${150 - b}
    L${next},${150 + b} C${next - 78},${150 + b} ${x + 85},${150 + a} ${x},${150 + a} Z`;
}

export function FunnelRibbon({ shares, placeholder = false }: { shares: number[]; placeholder?: boolean }) {
  return <svg viewBox="0 0 640 300" preserveAspectRatio="none" aria-hidden="true">
    {shares.map((start, i) => (placeholder ? [1] : [1, .89, .78]).map((scale, layer) =>
      <path key={`${i}-${layer}`} d={envelope(i, start, shares[i + 1] ?? start, scale)} fill={placeholder ? '#26272d' : ribbon[i][layer]} />
    ))}
  </svg>;
}
