import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  className?: string;
  hover?: boolean;
  glow?: 'violet' | 'fuchsia' | 'cyan' | 'none';
  children: ReactNode;
}

export function GlassCard({ className, hover = false, glow = 'none', children }: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl glass p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]',
        hover && 'transition-all duration-300 hover:bg-white/[0.08] hover:border-white/[0.18] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.4)]',
        glow === 'violet' && 'glow-violet',
        glow === 'fuchsia' && 'glow-fuchsia',
        glow === 'cyan' && 'glow-cyan',
        className
      )}
    >
      {children}
    </div>
  );
}
