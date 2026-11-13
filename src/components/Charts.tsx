/**
 * Lightweight SVG charts for the dashboard.
 * Pure SVG + CSS, no chart library dependency.
 */

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
  const H = 200;
  const padX = 8;
  const padY = 12;
  const max = Math.max(...data);
  const pts: [number, number][] = data.map((v, i) => [
    padX + (i * (W - 2 * padX)) / (data.length - 1),
    H - padY - (v / max) * (H - 2 * padY),
  ]);
  const line = smoothPath(pts);
  const area = line + ' L ' + pts[pts.length - 1][0] + ' ' + H + ' L ' + pts[0][0] + ' ' + H + ' Z';
  const hp = pts[highlightIndex];
  const hlPct = hp ? (hp[0] / W) * 100 : 0;

  return (
    <div>
      <div className="relative">
        <svg viewBox={'0 0 ' + W + ' ' + H} className="h-48 w-full sm:h-52" preserveAspectRatio="none" role="img" aria-label="Operations over time chart">
          <defs>
            <linearGradient id="zeox-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} x1={0} x2={W} y1={H * f} y2={H * f} stroke="#1C1C21" strokeWidth={1} />
          ))}
          <path d={area} fill="url(#zeox-area)" />
          <path d={line} fill="none" stroke="#B8A6F2" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
          {hp && (
            <>
              <line x1={hp[0]} x2={hp[0]} y1={padY} y2={H} stroke="#3F3F46" strokeWidth={1} strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
              <circle cx={hp[0]} cy={hp[1]} r={4} fill="#FFFFFF" />
            </>
          )}
        </svg>
        {hp && tooltipValue && (
          <div
            className="pointer-events-none absolute top-0 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-line bg-card px-2.5 py-1.5"
            style={{ left: 'min(max(' + hlPct + '%, 60px), calc(100% - 60px))' }}
          >
            <span className="status-dot bg-white" />
            <span className="text-[10px] text-txt-muted">{tooltipLabel}</span>
            <span className="text-[11px] font-semibold text-white">{tooltipValue}</span>
          </div>
        )}
      </div>
      <div className="mt-2 flex justify-between">
        {labels.map((l, i) => (
          <span
            key={l + i}
            className={
              'rounded-full px-2 py-0.5 text-[10px] ' +
              (i === highlightIndex ? 'bg-white font-medium text-black' : 'text-txt-muted')
            }
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

interface DonutProps {
  segments: { label: string; value: number; color: string }[];
  total: string;
  sub: string;
  size?: number;
}

export function Donut({ segments, total, sub, size = 160 }: DonutProps) {
  const sum = segments.reduce((a, s) => a + s.value, 0) || 1;
  const r = 54;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#1C1C21" strokeWidth="12" />
        {segments.map((s) => {
          const len = (s.value / sum) * c;
          const el = (
            <circle
              key={s.label}
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={Math.max(0, len - 4) + ' ' + (c - Math.max(0, len - 4))}
              strokeDashoffset={-offset}
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-lg font-semibold tracking-tight text-white">{total}</p>
        <p className="text-[10px] text-txt-muted">{sub}</p>
      </div>
    </div>
  );
}

interface MiniBarsProps {
  values: number[];
  highlight?: number;
}

export function MiniBars({ values, highlight = -1 }: MiniBarsProps) {
  const max = Math.max(...values);
  return (
    <div className="flex h-24 items-end gap-[3px]">
      {values.map((v, i) => (
        <div
          key={i}
          className={
            'flex-1 rounded-sm transition-colors ' +
            (i === highlight ? 'bg-txt-primary' : i % 2 === 0 ? 'bg-line' : 'bg-[#3F3F46]')
          }
          style={{ height: Math.max(6, (v / max) * 100) + '%' }}
        />
      ))}
    </div>
  );
}
