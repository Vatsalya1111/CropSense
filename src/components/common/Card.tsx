import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  title,
  subtitle,
  headerAction,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-[#e5ebe3] shadow-[0_3px_12px_rgba(33,54,39,0.035)] p-5 sm:p-6 ${
        onClick ? 'cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all' : ''
      } ${className}`}
    >
      {(title || subtitle || headerAction) && (
        <div className="flex items-start justify-between gap-2 mb-3 pb-2 border-b border-stone-100">
          <div>
            {title && <h3 className="font-semibold text-stone-900 text-base leading-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
