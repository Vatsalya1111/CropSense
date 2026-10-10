import React from 'react';
import { useI18n } from '../../i18n';

interface DataSourceNoticeProps {
  source: string;
  isFallback: boolean;
}

export const DataSourceNotice: React.FC<DataSourceNoticeProps> = ({ source, isFallback }) => {
  const { t } = useI18n();
  return <div
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${
      isFallback
        ? 'bg-amber-50 text-amber-900 border-amber-200'
        : 'bg-emerald-50 text-emerald-900 border-emerald-200'
    }`}
    role="status"
  >
    <span className={`w-1.5 h-1.5 rounded-full ${isFallback ? 'bg-amber-500' : 'bg-emerald-600'}`} />
    {isFallback ? t(source) : `${t('Source:')} ${t(source)}`}
  </div>
};
