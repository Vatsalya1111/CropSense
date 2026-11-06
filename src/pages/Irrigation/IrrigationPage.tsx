import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Droplets, HelpCircle } from 'lucide-react';
import { DataSourceNotice } from '../../components/common/DataSourceNotice';
import { useI18n } from '../../i18n';
import { irrigationService } from '../../services';
import { IrrigationRecommendation } from '../../types';
import { SoilMoistureBar } from '../../components/common/SoilMoistureBar';

export const IrrigationPage: React.FC = () => {
  const { t } = useI18n();
  const [data, setData] = useState<IrrigationRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    irrigationService.getIrrigationRecommendation().then(setData).catch(() => setError('Irrigation recommendations are unavailable. Start the CropSense API and try again.'));
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

  if (!data) {
    return (
      <div className="p-16 text-center">
        <div className="inline-block p-4 rounded-full border-2 border-[#161922] bg-[#fdfbf7] shadow-[3px_3px_0_#161922] font-mono text-sm font-bold animate-pulse">
          {t('Checking soil water levels...')}
        </div>
      </div>
    );
  }

  const waterNeeded = data.irrigationStatus === 'Irrigate immediately';

  return (
    <div className="space-y-7 max-w-5xl mx-auto animate-print-hit">
      <div className="page-heading">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#2b2f8f] uppercase tracking-wider mb-1">
          <Droplets size={14} strokeWidth={2.5} />
          <span>{t('Irrigation Decision')}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[#161922] tracking-tight">
          {t('Should I water my crop?')}
        </h2>
        <p className="text-sm text-[#585c6d] mt-1 font-medium">
          {t('Recommendation derived from soil moisture and expected rainfall.')}
        </p>
      </div>

      <DataSourceNotice source={data.dataSource} isFallback={data.isFallback} />

      <div className={`p-6 sm:p-8 rounded-[24px] border-2 border-[#161922] transition-all ${
        waterNeeded
          ? 'bg-[#fff5f0] shadow-[5px_5px_0_#ff5a36]'
          : 'bg-[#fdfbf7] shadow-[5px_5px_0_#161922]'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b-2 border-[#161922]/10">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl border-2 border-[#161922] shadow-[2px_2px_0_#161922] flex items-center justify-center shrink-0 ${
              waterNeeded ? 'bg-[#ff5a36] text-white' : 'bg-[#b6ff2e] text-[#161922]'
            }`}>
              <Droplets size={28} strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#585c6d]">
                {t('Current Decision')}
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#161922] tracking-tight mt-0.5">
                {t(data.irrigationStatus)}
              </h3>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f4efe6] border-2 border-[#161922] shadow-[2px_2px_0_#161922] font-mono text-xs font-bold text-[#161922] uppercase tracking-wider self-start sm:self-auto">
            <Clock size={14} className="text-[#2b2f8f]" strokeWidth={2.5} />
            <span>{t(data.recommendedTime)}</span>
          </div>
        </div>

        <div className="py-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-b-2 border-[#161922]/10">
          <div className="p-4 sm:p-5 bg-[#f4efe6] rounded-[18px] border-2 border-[#161922] shadow-[2px_2px_0_#161922]">
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#585c6d] uppercase tracking-wider mb-1.5">
              <HelpCircle size={14} className="text-[#2b2f8f]" strokeWidth={2.5} />
              <span>{t('Why?')}</span>
            </div>
            <p className="text-[#161922] text-sm sm:text-base font-bold leading-snug">
              {t(data.reason)}
            </p>
          </div>

          <div className="p-4 sm:p-5 bg-[#f0f9db] rounded-[18px] border-2 border-[#161922] shadow-[2px_2px_0_#161922]">
            <div className="flex items-center gap-1.5 font-mono text-xs font-black text-[#161922] uppercase tracking-wider mb-1.5">
              <CheckCircle2 size={14} className="text-[#2b2f8f]" strokeWidth={2.5} />
              <span>{t('Action')}</span>
            </div>
            <p className="text-[#161922] text-sm sm:text-base font-black leading-snug">
              {t(data.recommendedAction)}
            </p>
          </div>
        </div>

        <div className="pt-6">
          <div className="flex justify-between items-baseline mb-3">
            <span className="font-mono text-xs font-bold text-[#585c6d] uppercase tracking-wider">
              {t('Soil Moisture Estimate')}
            </span>
            <span className="font-mono text-3xl font-black text-[#161922]">
              {data.soilMoisture}%
            </span>
          </div>
          <SoilMoistureBar value={data.soilMoisture} />
        </div>
      </div>
    </div>
  );
};

export default IrrigationPage;
