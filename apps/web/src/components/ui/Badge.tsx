import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'neutral' | 'info';
}

export default function Badge({
  children,
  variant = 'neutral',
}: BadgeProps) {
  const styles = {
    success: 'bg-status-success/10 text-status-success ring-1 ring-status-success/20',
    warning: 'bg-status-warning/10 text-status-warning ring-1 ring-status-warning/20',
    error: 'bg-status-error/10 text-status-error ring-1 ring-status-error/20',
    neutral: 'bg-surface-container text-on-surface-variant ring-1 ring-outline-variant/30',
    info: 'bg-primary/10 text-primary ring-1 ring-primary/20',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-mono tracking-wider uppercase ${styles[variant]}`}>
      {children}
    </span>
  );
}
