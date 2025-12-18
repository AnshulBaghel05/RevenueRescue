import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'grade-a' | 'grade-b' | 'grade-c' | 'grade-d' | 'grade-f';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full';

  const variantStyles = {
    success: 'bg-green-500/10 text-green-400 border border-green-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    error: 'bg-red-500/10 text-red-400 border border-red-500/20',
    info: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    neutral: 'bg-gray-700 text-gray-300 border border-gray-600',
    'grade-a': 'bg-green-500/10 text-green-400 border border-green-500/30 font-bold',
    'grade-b': 'bg-blue-500/10 text-blue-400 border border-blue-500/30 font-bold',
    'grade-c': 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold',
    'grade-d': 'bg-orange-500/10 text-orange-400 border border-orange-500/30 font-bold',
    'grade-f': 'bg-red-500/10 text-red-400 border border-red-500/30 font-bold',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
}
