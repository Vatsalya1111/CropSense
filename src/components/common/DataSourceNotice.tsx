import React from 'react';
import { useI18n } from '../../i18n';

interface DataSourceNoticeProps {
  source: string;
  isFallback: boolean;
}

export const DataSourceNotice: React.FC<DataSourceNoticeProps> = ({ source, isFallback }) => {
  const { t } = useI18n();
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 border-[#161922] font-mono text-xs font-bold tracking-wider uppercase shadow-[2px_2px_0_#161922] transition-transform hover:-translate-y-0.5 ${
        isFallback
          ? 'bg-[#fff1e8] text-[#c32a10]'
          : 'bg-[#f0f9db] text-[#161922]'
      }`}
      role="status"
    >
      <span className={`w-2 h-2 rounded-full border border-[#161922] ${isFallback ? 'bg-[#ff5a36] animate-pulse' : 'bg-[#2b2f8f]'}`} />
      <span>{isFallback ? t(source) : `${t('Source:')} ${t(source)}`}</span>
    </div>
  );
};
