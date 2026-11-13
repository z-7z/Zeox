/** Lightweight SVG charts for the dashboard. */

interface AreaChartProps {
  data: number[];
  labels: string[];
  highlightIndex?: number;
  tooltipLabel?: string;
  tooltipValue?: string;
}

function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return '';
  let d = 'M ' + pts[0][0] + ' ' + pts[0][1];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ' C ' + c1x + ' ' + c1y + ', ' + c2x + ' ' + c2y + ', ' + p2[0] + ' ' + p2[1];
  }
  return d;
}

export function AreaChart({ data, labels, highlightIndex = -1, tooltipLabel, tooltipValue }: AreaChartProps) {
  const W = 600;
  const H = 180;
  const padX = 8;
  const padY = 12;
  const max = Math.max(...data);
  const pts: [number, number][] = data.map((value, index) => [
    padX + (index * (W - 2 * padX)) / (data.length - 1),
    H - padY - (value / max) * (H - 2 * padY),
  ]);
  const line = smoothPath(pts);
  const area = line + ' L ' + pts[pts.length - 1][0] + ' ' + H + ' L ' + pts[0][0] + ' ' + H + ' Z';
  const highlighted = pts[highlightIndex];
  const highlightPercent = highlighted ? (highlighted[0] / W) * 100 : 0;

  return (
    <div>
      <div className="relative">
        <svg viewBox={'0 0 ' + W + ' ' + H} className="h-40 w-full sm:h-44" preserveAspectRatio="none" role="img" aria-label="Operations over time chart">
          <defs>
            <linearGradient id="zeox-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5CD4E6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#5CD4E6" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((fraction) => <line key={fraction} x1={0} x2={W} y1={H * fraction} y2={H * fraction} stroke="#1E292E" strokeWidth={1} />)}
          <path d={area} fill="url(#zeox-area)" />
          <path d={line} fill="none" stroke="#5CD4E6" strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
          {highlighted && <><line x1={highlighted[0]} x2={highlighted[0]} y1={padY} y2={H} stroke="#34444A" strokeWidth={1} strokeDasharray="3 3" vectorEffect="non-scaling-stroke" /><circle cx={highlighted[0]} cy={highlighted[1]} r={4} fill="#FF9150" /></>}
        </svg>
        {highlighted && tooltipValue && (
          <div className="pointer-events-none absolute top-0 flex -translate-x-1/2 items-center gap-2 rounded-md border border-line bg-card px-2.5 py-1.5" style={{ left: 'min(max(' + highlightPercent + '%, 60px), calc(100% - 60px))' }}>
            <span className="status-dot bg-accent-orange" />
            <span className="font-mono text-[9px] text-txt-muted">{tooltipLabel}</span>
            <span className="font-mono text-[10px] text-txt-primary">{tooltipValue}</span>
          </div>
        )}
      </div>
      <div className="mt-2 flex justify-between">
        {labels.map((label, index) => <span key={label + index} className={'font-mono text-[9px] ' + (index === highlightIndex ? 'text-accent-orange' : 'text-txt-muted')}>{label}</span>)}
      </div>
    </div>
  );
}

interface DonutProps { segments: { label: string; value: number; color: string }[]; total: string; sub: string; size?: number }

export function Donut({ segments, total, sub, size = 160 }: DonutProps) {
  const sum = segments.reduce((totalValue, segment) => totalValue + segment.value, 0) || 1;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90" role="img" aria-label="Usage breakdown">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#1E292E" strokeWidth="10" />
        {segments.map((segment) => {
          const length = (segment.value / sum) * circumference;
          const circle = <circle key={segment.label} cx="70" cy="70" r={radius} fill="none" stroke={segment.color} strokeWidth="10" strokeLinecap="butt" strokeDasharray={Math.max(0, length - 2) + ' ' + (circumference - Math.max(0, length - 2))} strokeDashoffset={-offset} />;
          offset += length;
          return circle;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center"><p className="font-mono text-lg text-txt-primary">{total}</p><p className="font-mono text-[9px] uppercase text-txt-muted">{sub}</p></div>
    </div>
  );
}

interface MiniBarsProps { values: number[]; highlight?: number }

export function MiniBars({ values, highlight = -1 }: MiniBarsProps) {
  const max = Math.max(...values);
  return <div className="flex h-24 items-end gap-[3px]">{values.map((value, index) => <div key={index} className="flex-1" style={{ height: Math.max(6, (value / max) * 100) + '%', background: index === highlight ? '#FF9150' : index % 2 === 0 ? '#263036' : '#182024' }} />)}</div>;
}
