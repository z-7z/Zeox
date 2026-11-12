import { type ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  compact?: boolean;
  /** Legacy props, kept for API compatibility. Ignored in the flat design. */
  accent?: 'purple' | 'orange' | 'none';
  shine?: boolean;
  shineIdle?: boolean;
}

/**
 * Core card surface of the Zeox design system.
 * Flat, solid premium surface (no blur, no glow).
 */
export function GlassCard({ children, className = '', hover = false, compact = false }: GlassCardProps) {
  return (
    <div className={'card ' + (hover ? 'card-hover ' : '') + (compact ? 'rounded-lg ' : '') + className}>
      <div className="h-full">{children}</div>
    </div>
  );
}
