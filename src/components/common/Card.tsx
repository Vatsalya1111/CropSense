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
      className={`bg-[#fdfbf7] rounded-[22px] border-2 border-[#161922] shadow-[4px_4px_0_#161922] p-5 sm:p-6 transition-all duration-150 ${
        onClick
          ? 'cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#161922] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
          : ''
      } ${className}`}
    >
      {(title || subtitle || headerAction) && (
        <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b-2 border-[#161922]/10">
          <div>
            {title && <h3 className="font-extrabold text-[#161922] text-base sm:text-lg tracking-tight leading-snug">{title}</h3>}
            {subtitle && <p className="font-mono text-xs text-[#585c6d] mt-1 tracking-wider uppercase">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
