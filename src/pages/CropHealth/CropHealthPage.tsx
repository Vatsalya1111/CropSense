import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Sprout } from 'lucide-react';
import { DataSourceNotice } from '../../components/common/DataSourceNotice';
import { useI18n } from '../../i18n';
import { cropHealthService } from '../../services';
import { CropHealth } from '../../types';

export const CropHealthPage: React.FC = () => {
  const { t } = useI18n();
  const [health, setHealth] = useState<CropHealth | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cropHealthService.getCropHealth().then(setHealth).catch(() => setError('Crop predictions are unavailable. Start the CropSense API and try again.'));
  }, [t]);

  if (error) {
    return (
      <div className="p-16 text-center">
        <div className="inline-block p-6 rounded-2xl border-2 border-[#161922] bg-[#fff1e8] text-[#c32a10] shadow-[4px_4px_0_#161922] font-mono text-sm font-bold">
          {t(error)}
        </div>
      </div>
    );
  }

  if (!health) {
    return (
      <div className="p-16 text-center">
        <div className="inline-block p-4 rounded-full border-2 border-[#161922] bg-[#fdfbf7] shadow-[3px_3px_0_#161922] font-mono text-sm font-bold animate-pulse">
          {t('Checking crop condition...')}
        </div>
      </div>
    );
  }

  const healthy = health.overallHealth === 'Optimal' || health.overallHealth === 'Good';

  return (
    <div className="space-y-7 max-w-5xl mx-auto animate-print-hit">
      <div className="page-heading">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#2b2f8f] uppercase tracking-wider mb-1">
          <Sprout size={14} strokeWidth={2.5} />
          <span>{t('Crop Condition')}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[#161922] tracking-tight">
          {t('Is my crop healthy?')}
        </h2>
        <p className="text-sm text-[#585c6d] mt-1 font-medium">
          {t('Baseline crop-risk prediction from current weather and soil moisture inputs.')} · <span className="font-mono text-xs">{health.modelVersion}</span>
        </p>
      </div>

      <DataSourceNotice source={health.dataSource} isFallback={health.isFallback} />

      <div className={`p-6 sm:p-8 rounded-[24px] border-2 border-[#161922] transition-all ${
        healthy
          ? 'bg-[#fdfbf7] shadow-[5px_5px_0_#161922]'
          : 'bg-[#fffdf5] shadow-[5px_5px_0_#f59e0b]'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b-2 border-[#161922]/10">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl border-2 border-[#161922] shadow-[2px_2px_0_#161922] flex items-center justify-center shrink-0 ${
              healthy ? 'bg-[#b6ff2e] text-[#161922]' : 'bg-[#f59e0b] text-[#161922]'
            }`}>
              <Sprout size={28} strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#585c6d]">
                {t('Overall Crop Status')}
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#161922] tracking-tight mt-0.5">
                {t(health.overallHealth)}
              </h3>
              <p className="text-sm font-bold text-[#585c6d] mt-0.5">
                {t(health.healthStatus)}
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f4efe6] border-2 border-[#161922] shadow-[2px_2px_0_#161922] font-mono text-xs font-bold text-[#161922] uppercase tracking-wider self-start sm:self-auto">
            {t(health.overallHealth === 'Watch' ? 'Disease conditions to watch' : 'Health conditions stable')}
          </div>
        </div>

        <div className="py-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-b-2 border-[#161922]/10">
          <div className="p-4 sm:p-5 bg-[#f4efe6] rounded-[18px] border-2 border-[#161922] shadow-[2px_2px_0_#161922]">
            <span className="font-mono text-xs font-bold text-[#585c6d] uppercase tracking-wider">
              {t('Current Growth Stage')}
            </span>
            <p className="text-[#161922] font-black text-lg mt-1 tracking-tight">
              {t(health.cropStage)}
            </p>
          </div>

          <div className="p-4 sm:p-5 bg-[#f4efe6] rounded-[18px] border-2 border-[#161922] shadow-[2px_2px_0_#161922]">
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#ff5a36] uppercase tracking-wider mb-1">
              <AlertTriangle size={14} strokeWidth={2.5} />
              <span>{t('Crop Risk Observation')}</span>
            </div>
            <p className="text-[#161922] text-sm sm:text-base font-bold leading-snug">
              {t(health.observation)}
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 size={18} strokeWidth={2.5} className="text-[#2b2f8f] shrink-0 mt-0.5" />
            <span className="text-[#161922] font-semibold">
              <strong className="font-black font-mono uppercase text-xs text-[#2b2f8f] block sm:inline sm:mr-1">
                {t('Recommended Action:')}
              </strong>
              {t(health.recommendedAction)}
            </span>
          </div>
          <span className="font-mono text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-[#f4efe6] border-2 border-[#161922] shadow-[2px_2px_0_#161922] text-[#161922] shrink-0 self-start sm:self-auto">
            {t('Health score')}: {health.healthScore}/100
          </span>
        </div>
      </div>
    </div>
  );
};

export default CropHealthPage;
