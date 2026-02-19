'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 text-xs font-semibold tracking-[2px] uppercase text-[#666666] font-mono">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'w-full px-4 py-3',
            'bg-[#1A1A1A] border border-[#333333]',
            'text-white placeholder:text-[#666666]',
            'focus:outline-none focus:border-red-500',
            'transition-colors duration-150',
            error && 'border-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
