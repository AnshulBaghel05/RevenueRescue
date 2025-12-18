import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function Card({
  children,
  className = '',
  hover = false,
  glow = false,
  padding = 'md',
  onClick,
  style,
}: CardProps) {
  const baseStyles = 'bg-gray-800 border border-gray-700 rounded-xl transition-all duration-200';

  const hoverStyles = hover
    ? 'cursor-pointer hover:border-primary hover:shadow-lg hover:-translate-y-1'
    : '';

  const glowStyles = glow ? 'shadow-glow-primary' : '';

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${glowStyles} ${paddingStyles[padding]} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}
