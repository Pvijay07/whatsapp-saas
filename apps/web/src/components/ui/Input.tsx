import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-mono">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-surface-container-lowest border rounded-lg p-3 text-sm text-on-surface focus:outline-none focus:ring-2 transition-all duration-200 ${
          error
            ? 'border-error focus:ring-error/10'
            : 'border-outline-variant/60 focus:border-primary focus:ring-primary/10'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-error font-medium">{error}</p>}
    </div>
  );
}
