import { type ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  compact?: boolean;
  accent?: 'cyan' | 'orange' | 'pink' | 'none';
  shine?: boolean;
  shineIdle?: boolean;
}

/** Solid OLED surface with a restrained border and optional hover lift. */
export function GlassCard({ children, className = '', hover = false, compact = false }: GlassCardProps) {
  return <div className={'card ' + (hover ? 'card-hover ' : '') + (compact ? 'rounded-md ' : '') + className}><div className="h-full">{children}</div></div>;
}
