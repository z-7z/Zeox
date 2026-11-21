import { ArrowUpRight } from 'lucide-react';
import { formatSize } from '../../lib/vault/container';

/** Cartridge symbol for the actual intake controls, not an image of a user file. */
export function Cartridge({ kind }: { kind: 'script' | 'archive' }) {
  return (
    <svg className={`cartridge cartridge-${kind}`} viewBox="0 0 100 80" aria-hidden="true">
      <path
        d="M17 8h58l13 13v47a5 5 0 0 1-5 5H17a5 5 0 0 1-5-5V13a5 5 0 0 1 5-5Z"
        fill="#151517"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M23 8h47v21H23z" fill="currentColor" />
      <path d="M57 10h9v14h-9z" fill="#222126" />
      <path d="M21 43h59v23H21z" fill="#2a292b" />
      <g stroke="currentColor" strokeWidth="2">
        {[26, 30, 36, 39, 46, 50, 57, 64, 69, 74].map((x, i) => (
          <path key={x} d={`M${x} 50v${i % 3 === 0 ? 12 : 9}`} />
        ))}
      </g>
      <circle cx="18" cy="17" r="1.6" fill="currentColor" />
    </svg>
  );
}
export function CapacityTile({
  limit,
  label,
  size,
  archive = false,
}: {
  limit: number;
  label: string;
  size: number | null;
  archive?: boolean;
}) {
  const pct = size === null ? 0 : Math.min(100, (size / limit) * 100);
  const title = archive ? 'Archive capacity' : 'Source capacity';
  return (
    <section className="ws-panel instrument-limit mint-card" aria-label={title}>
      <ArrowUpRight className="card-watermark" aria-hidden="true" />
      <h2>{title}</h2>
      <strong>{label}</strong>
      <p>{archive ? 'Source + archive overhead' : 'Per input file'}</p>
      <div className="capacity-meter" aria-hidden="true">
        <i style={{ width: `${pct}%` }} />
      </div>
      <small>
        {size === null
          ? archive
            ? 'No archive attached'
            : 'No source attached'
          : `${formatSize(size)} attached`}
      </small>
    </section>
  );
}
