import { type ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  compact?: boolean;
  /** Optional accent glow tinted toward the brand accent (orange). */
  accent?: 'purple' | 'orange' | 'none';
  /** Enable the hover shine sweep effect. */
  shine?: boolean;
  /** Continuous gentle shine, for hero surfaces. */
  shineIdle?: boolean;
}

const accentStyles: Record<string, string> = {
  purple:
    'before:bg-[radial-gradient(80%_60%_at_50%_0%,rgba(255,116,17,0.10),transparent_70%)]',
  orange:
    'before:bg-[radial-gradient(80%_60%_at_50%_0%,rgba(255,116,17,0.08),transparent_70%)]',
  none: '',
};

/**
 * Core Liquid Glass surface of the Zeox design system.
 * Translucent layered glass with backdrop blur, subtle reflections,
 * and an optional shine sweep. Orange-only accents.
 */
export function GlassCard({
  children,
  className = '',
  hover = false,
  compact = false,
  accent = 'none',
  shine = false,
  shineIdle = false,
}: GlassCardProps) {
  return (
    <div
      className={`glass ${compact ? 'glass-compact' : ''} ${hover ? 'glass-hover' : ''} ${
        shine ? 'shine' : ''
      } ${shineIdle ? 'shine-idle' : ''} ${accentStyles[accent]} ${className}`}
    >
      <div className="relative z-[1] h-full">{children}</div>
    </div>
  );
}
