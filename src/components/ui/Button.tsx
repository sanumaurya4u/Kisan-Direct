import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'fresh';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer';
    
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-medium shadow-xs hover:shadow-md',
      secondary: 'bg-secondary text-slate-950 hover:bg-amber-500 shadow-xs font-bold',
      fresh: 'bg-fresh text-white hover:bg-fresh-hover shadow-xs font-bold',
      outline: 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 shadow-xs hover:border-gray-300',
      ghost: 'hover:bg-emerald-50 hover:text-primary text-gray-700',
    };
    
    const sizes = {
      sm: 'h-8 px-3.5 text-xs tracking-tight',
      md: 'h-10 px-4 py-2 text-sm',
      lg: 'h-12 px-7 text-base font-bold',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
