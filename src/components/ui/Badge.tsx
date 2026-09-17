import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'fresh' | 'earthy';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-primary text-white",
    secondary: "border-amber-200 bg-amber-50 text-amber-900",
    destructive: "border-red-200 bg-red-50 text-red-700",
    outline: "border-emerald-200/80 bg-white/80 text-emerald-900",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    fresh: "border-emerald-300 bg-emerald-100/80 text-emerald-950 font-bold",
    earthy: "border-amber-200 bg-amber-50/70 text-amber-950",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
