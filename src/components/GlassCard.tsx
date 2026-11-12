import { type ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  compact?: boolean;
  /** Use the elevated surface (#15141B) instead of the standard one (#101014). */
  elevated?: boolean;
  /** Optional subtle top accent tint, applied as a border/edge detail, not a glow. */
  accent?: 'purple' | 'orange' | 'none';
}

/**
 * Base card surface of the Zeox design system.
 * Solid premium surfaces only: #101014 / #15141B on #292333 borders.
 * No backdrop blur, no frosted glass, no glow, no diffuse shadows.
 */
export function GlassCard({
  children,
  className = '',
  hover = false,
  compact = false,
  elevated = false,
  accent = 'none',
}: GlassCardProps) {
  const accentClass =
    accent === 'purple'
      ? 'border-t-brand-purple/40'
      : accent === 'orange'
        ? 'border-t-brand-orange/40'
        : '';
  return (
    <div
      className={`${elevated ? 'card-elevated' : 'card'} ${compact ? 'rounded-xl' : ''} ${
        hover ? 'card-hover' : ''
      } ${accentClass} ${className}`}
    >
      {children}
    </div>
  );
}
