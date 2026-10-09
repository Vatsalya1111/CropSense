import React from 'react';

export type BadgeVariant = 'green' | 'blue' | 'amber' | 'red' | 'stone';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  green: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  blue: 'bg-sky-50 text-sky-800 border-sky-200',
  amber: 'bg-amber-50 text-amber-900 border-amber-200',
  red: 'bg-red-50 text-red-800 border-red-200',
  stone: 'bg-stone-100 text-stone-700 border-stone-200',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'stone',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variantStyles[variant]} ${sizeStyles} ${className}`}
    >
      {children}
    </span>
  );
};
