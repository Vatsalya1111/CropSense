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
    <div aria-label={`${clampedValue}% ${t(label)}`}>
      <div className="relative h-4 overflow-hidden rounded-full border border-stone-300 bg-stone-100">
        <div className="absolute inset-y-0 left-0 w-1/4 bg-amber-400" />
        <div className="absolute inset-y-0 left-1/4 w-1/4 bg-emerald-500" />
        <div className="absolute inset-y-0 left-1/2 right-0 bg-sky-400" />
        <div
          className="absolute top-1/2 h-6 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-stone-950 shadow ring-2 ring-white"
          style={{ left: `${clampedValue}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs font-bold text-stone-700">
        <span>{t('Dry')}</span>
        <span>{t('Good')}</span>
        <span>{t('Wet')}</span>
      </div>
      <p className="mt-1 text-xs text-amber-900">{t('Estimated, no sensor connected')}</p>
    </div>
  );
};
