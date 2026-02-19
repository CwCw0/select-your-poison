'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth = false, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-[3px] font-mono tracking-wide',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C0C0C]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'active:scale-[0.98]',

          // Size variants
          {
            'py-3 px-8 text-[10px] tracking-[1px]': size === 'sm',
            'py-4 px-10 text-[12px] tracking-[1px]': size === 'md',
            'py-5 px-14 text-[13px] tracking-[1px]': size === 'lg',
          },

          // Color variants
          {
            'bg-[#FF0000] text-black font-bold hover:bg-[#E50000] hover:shadow-[0_0_20px_rgba(255,0,0,0.3)]': variant === 'primary',
            'bg-[#1A1A1A] text-white hover:bg-[#252525] border border-[#333333]': variant === 'secondary',
            'bg-transparent border border-[#444444] text-white hover:border-[#FF0000] hover:bg-[#FF0000]/5': variant === 'outline',
            'bg-transparent text-white hover:bg-[#1A1A1A]': variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700 hover:shadow-[0_0_15px_rgba(220,38,38,0.3)]': variant === 'danger',
            'bg-green-500 text-black font-bold hover:bg-green-600 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]': variant === 'success',
          },

          // Full width
          fullWidth && 'w-full',

          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
