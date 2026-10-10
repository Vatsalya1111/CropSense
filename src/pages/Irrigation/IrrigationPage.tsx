import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Droplets, HelpCircle } from 'lucide-react';
import { DataSourceNotice } from '../../components/common/DataSourceNotice';
import { useI18n } from '../../i18n';
import { irrigationService } from '../../services';
import { IrrigationRecommendation } from '../../types';

export const IrrigationPage: React.FC = () => {
  const { t } = useI18n();
  const [data, setData] = useState<IrrigationRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    irrigationService.getIrrigationRecommendation().then(setData).catch(() => setError('Irrigation recommendations are unavailable. Start the CropSense API and try again.'));
  }, [t]);
  if (error) return <div className="p-16 text-center text-red-700">{t(error)}</div>;
  if (!data) return <div className="p-16 text-center text-stone-500 font-medium">{t('Checking soil water levels...')}</div>;

  const waterNeeded = data.irrigationStatus === 'Irrigate immediately';
  return (
    <div className="space-y-7 max-w-5xl mx-auto">
      <div className="page-heading">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-800 uppercase tracking-wider mb-0.5"><Droplets size={14} /><span>{t('Irrigation Decision')}</span></div>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900">{t('Should I Water My Crop?')}</h2>
        <p className="text-sm text-stone-600 mt-1">{t('Recommendation derived from soil moisture and expected rainfall.')}</p>
      </div>
      <DataSourceNotice source={data.dataSource} isFallback={data.isFallback} />
      <div className={`p-6 sm:p-7 rounded-3xl border-2 shadow-sm ${waterNeeded ? 'bg-amber-50/90 border-amber-300' : 'bg-sky-50/90 border-sky-300'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-200/60">
          <div className="flex items-center gap-4"><div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${waterNeeded ? 'bg-amber-200 text-amber-950' : 'bg-sky-200 text-sky-950'}`}><Droplets size={32} /></div><div><span className="text-xs font-black uppercase tracking-wider text-stone-600">{t('Current Decision')}</span><h3 className="text-2xl sm:text-3xl font-black text-stone-900">{t(data.irrigationStatus)}</h3></div></div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-stone-200 text-xs font-bold"><Clock size={14} />{t(data.recommendedTime)}</div>
        </div>
        <div className="py-5 grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-stone-200/60">
          <div className="p-4 bg-white/95 rounded-xl border border-stone-200"><div className="flex items-center gap-1.5 text-xs font-bold text-stone-600 uppercase mb-1"><HelpCircle size={14} />{t('Why?')}</div><p className="text-stone-900 text-sm font-semibold">{t(data.reason)}</p></div>
          <div className="p-4 bg-white/95 rounded-xl border border-stone-200"><div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase mb-1"><CheckCircle2 size={14} />{t('Action')}</div><p className="text-stone-950 text-sm font-black">{t(data.recommendedAction)}</p></div>
        </div>
        <div className="pt-4"><div className="flex justify-between items-baseline mb-2"><span className="text-xs font-bold text-stone-600 uppercase">{t('Soil Moisture Estimate')}</span><span className="text-2xl font-black text-stone-900">{data.soilMoisture}%</span></div><div className="w-full h-3.5 bg-stone-200 rounded-full overflow-hidden"><div className={`h-full ${waterNeeded ? 'bg-amber-500' : 'bg-emerald-600'}`} style={{ width: `${Math.min(100, data.soilMoisture * 1.5)}%` }} /></div><div className="flex justify-between text-[11px] font-bold text-stone-500 mt-2"><span>{t('Dry (<25%)')}</span><span>{t('Good (25–50%)')}</span><span>{t('Wet (>50%)')}</span></div></div>
      </div>
    </div>
  );
};

export default IrrigationPage;
