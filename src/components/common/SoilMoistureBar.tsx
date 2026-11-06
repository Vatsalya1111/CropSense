import React from 'react';
import { useI18n } from '../../i18n';

interface SoilMoistureBarProps {
  value: number;
}

export const SoilMoistureBar: React.FC<SoilMoistureBarProps> = ({ value }) => {
  const { t } = useI18n();
  const clampedValue = Math.max(0, Math.min(100, value));
  const label = clampedValue < 25 ? 'Dry' : clampedValue < 50 ? 'Good' : 'Wet';

  return (
    <div aria-label={`${clampedValue}% ${t(label)}`} className="w-full">
      <div className="relative h-5 overflow-hidden rounded-full border-2 border-[#161922] bg-[#f4efe6] shadow-[2px_2px_0_#161922]">
        <div className="absolute inset-y-0 left-0 w-1/4 bg-[#ff5a36] opacity-90" />
        <div className="absolute inset-y-0 left-1/4 w-1/4 bg-[#b6ff2e]" />
        <div className="absolute inset-y-0 left-1/2 right-0 bg-[#2b2f8f] opacity-80" />
        <div
          className="absolute top-1/2 h-7 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#161922] border-2 border-white shadow-sm transition-all duration-300"
          style={{ left: `${clampedValue}%` }}
        />
      </div>
      <div className="mt-2.5 flex justify-between font-mono text-[11px] font-bold uppercase tracking-wider text-[#161922]">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ff5a36] inline-block" />{t('Dry')}</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#b6ff2e] border border-[#161922] inline-block" />{t('Good')}</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#2b2f8f] inline-block" />{t('Wet')}</span>
      </div>
      <p className="mt-1.5 font-mono text-xs font-semibold text-[#585c6d] uppercase tracking-wide">
        {t('Estimated, no sensor connected')}
      </p>
    </div>
  );
};
