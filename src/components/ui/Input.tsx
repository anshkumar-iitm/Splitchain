import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#B3B3B3] mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full
            px-4 py-3
            bg-white/5
            border border-white/10
            rounded-lg
            text-white
            placeholder-white/30
            focus:outline-none
            focus:border-[#B11226]
            focus:ring-2
            focus:ring-[#B11226]/20
            transition-all
            duration-200
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
