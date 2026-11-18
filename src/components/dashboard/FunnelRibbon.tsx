import { useId } from 'react';

// Fixed data geometry. Light moves along the ribbon, never the values/labels.
const ribbon = [
  ['#474747', '#939393', '#d2d2d2'], ['#363636', '#545454', '#828282'],
  ['#292929', '#414141', '#606060'], ['#282828', '#373737', '#494949'],
];
function edges(col: number, start: number, end: number, scale: number) {
  const x = col * 160, next = x + 160, a = 136 * start * scale, b = 136 * end * scale;
  const top = `M${x},${150 - a} C${x + 85},${150 - a} ${next - 78},${150 - b} ${next},${150 - b}`;
  return { top, fill: `${top} L${next},${150 + b} C${next - 78},${150 + b} ${x + 85},${150 + a} ${x},${150 + a} Z` };
}
export function FunnelRibbon({ shares }: { shares: number[] }) {
  const id = useId();
  const path = (i: number, scale: number) => edges(i, shares[i], shares[i + 1] ?? shares[i], scale);
  return <svg viewBox="0 0 640 300" preserveAspectRatio="none" aria-hidden="true">
    {shares.map((_, i) => [1, .89, .78].map((scale, layer) =>
      <path key={`${i}-${layer}`} className={layer === 2 ? 'ribbon-surface' : undefined} d={path(i, scale).fill} fill={ribbon[i][layer]} />))}
    <defs><clipPath id={`${id}-ribbon`}><path d={shares.map((_, i) => path(i, 1).fill).join(' ')} /></clipPath>
      <linearGradient id={`${id}-light`}><stop stopColor="white" stopOpacity="0" /><stop offset=".62" stopColor="white" stopOpacity=".26" /><stop offset="1" stopColor="white" stopOpacity="0" /></linearGradient></defs>
    <g className="ribbon-light" clipPath={`url(#${id}-ribbon)`}>
      <g className="ribbon-sheen"><path d="M-202 0h135L-140 300h-135z" fill={`url(#${id}-light)`} /></g>
      {[.9, -.89].map(scale => <path key={scale} className="ribbon-stream" d={shares.map((_, i) => path(i, scale).top).join(' ')} fill="none" stroke="white" strokeOpacity=".44" strokeWidth="1.5" />)}
    </g>
  </svg>;
}
