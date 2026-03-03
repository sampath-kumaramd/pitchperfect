import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  function GlassButton({ className, variant = 'primary', size = 'md', isLoading = false, disabled, children, ...props }, ref) {
    const variantClasses = {
      primary: 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-0 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40',
      secondary: 'glass text-slate-200 hover:bg-white/[0.08] hover:text-white',
      ghost: 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]',
      danger: 'bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500/30 hover:text-red-300',
    };

    const sizeClasses = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-5 text-sm',
      lg: 'h-12 px-8 text-base font-semibold',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50',
          variantClasses[variant],
          sizeClasses[size],
          isLoading && 'opacity-60 animate-pulse cursor-not-allowed',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);
