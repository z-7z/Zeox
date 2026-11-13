/** Zeox's angular Z mark and wordmark. */
export function ZeoxLogo({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Zeox logo" role="img">
      <path d="M30.5 45.5 L54 21.5 H95.5 L72 45.5 Z" fill="currentColor" />
      <path d="M33 47.5 L45.5 38.5 H58 L45.5 47.5 Z" fill="currentColor" opacity="0.72" />
      <path d="M46.5 50 L80 50 L57 71.5 H96 L84.5 83.5 H18.5 L46.5 50 Z" fill="currentColor" />
    </svg>
  );
}

export function ZeoxLockup({ size = 26, className = '' }: { size?: number; className?: string }) {
  return (
    <span className={'inline-flex items-center gap-2 ' + className}>
      <ZeoxLogo size={size} className="text-accent-orange" />
      <span className="font-semibold tracking-tight text-txt-primary" style={{ fontSize: size * 0.82, letterSpacing: '-0.02em' }}>Zeox</span>
    </span>
  );
}
