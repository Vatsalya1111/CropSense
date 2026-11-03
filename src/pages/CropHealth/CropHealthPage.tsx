import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Sprout, TrendingDown, TrendingUp } from 'lucide-react';
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
  if (error) return <div className="p-16 text-center text-red-700">{t(error)}</div>;
  if (!health) return <div className="p-16 text-center text-stone-500 font-medium">{t('Checking crop condition...')}</div>;

  const healthy = health.healthScore >= 70;
  return (
    <div className="space-y-7 max-w-5xl mx-auto">
      <div className="page-heading">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-0.5"><Sprout size={14} /><span>{t('Crop Condition')}</span></div>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900">{t('Is My Crop Healthy?')}</h2>
        <p className="text-sm text-stone-600 mt-1">{t('Baseline crop-risk prediction from current weather and soil moisture inputs.')} · {health.modelVersion}.</p>
      </div>
      <DataSourceNotice source={health.dataSource} isFallback={health.isFallback} />
      <div className={`p-6 sm:p-7 rounded-3xl border-2 shadow-sm ${healthy ? 'bg-emerald-50/70 border-emerald-300' : 'bg-amber-50/70 border-amber-300'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-200/60">
          <div className="flex items-center gap-4"><div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${healthy ? 'bg-emerald-200 text-emerald-950' : 'bg-amber-200 text-amber-950'}`}><Sprout size={32} /></div><div><span className="text-xs font-black uppercase tracking-wider text-stone-600">{t('Overall Crop Status')}</span><h3 className="text-2xl sm:text-3xl font-black text-stone-900">{t(health.overallHealth)}</h3><p className="text-sm font-semibold text-stone-700">{t(health.healthStatus)}</p></div></div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-stone-200 text-xs font-bold">{healthy ? <TrendingUp size={15} className="text-emerald-700" /> : <TrendingDown size={15} className="text-amber-700" />}{healthy ? t('Lower estimated risk') : t('Stress risk detected')}</div>
        </div>
        <div className="py-5 grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-stone-200/60">
          <div className="p-4 bg-white/90 rounded-xl border border-stone-200"><span className="text-xs font-bold text-stone-500 uppercase">{t('Current Growth Stage')}</span><p className="text-stone-900 font-bold mt-1">{t(health.cropStage)}</p></div>
          <div className="p-4 bg-white/90 rounded-xl border border-stone-200"><div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase mb-1"><AlertTriangle size={14} />{t('Crop Risk Observation')}</div><p className="text-stone-900 text-sm font-semibold">{t(health.observation)}</p></div>
        </div>
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm"><div className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" /><span><strong>{t('Recommended Action:')}</strong> {t(health.recommendedAction)}</span></div><span className="text-stone-600 font-semibold shrink-0">{t('Risk score:')} {health.healthScore}/100</span></div>
      </div>
    </div>
  );
};

export default CropHealthPage;
