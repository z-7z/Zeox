import { type ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  compact?: boolean;
  /** Optional accent glow tinted toward purple or orange. */
  accent?: 'purple' | 'orange' | 'none';
}

const accentStyles: Record<string, string> = {
  purple:
    'before:bg-[radial-gradient(80%_60%_at_50%_0%,rgba(139,92,246,0.10),transparent_70%)]',
  orange:
    'before:bg-[radial-gradient(80%_60%_at_50%_0%,rgba(255,116,17,0.08),transparent_70%)]',
  none: '',
};

/** Core Liquid Glass surface used across the whole design system. */
export function GlassCard({ children, className = '', hover = false, compact = false, accent = 'none' }: GlassCardProps) {
  return (
    <div
      className={`glass ${compact ? 'glass-compact' : ''} ${hover ? 'glass-hover' : ''} ${accentStyles[accent]} ${className}`}
    >
      <div className="relative z-[1] h-full">{children}</div>
    </div>
  );
}
