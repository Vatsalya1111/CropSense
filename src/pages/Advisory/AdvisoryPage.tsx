import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { advisoryService } from '../../services';
import { Advisory } from '../../types';
import { ClipboardCheck, Clock, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { useI18n } from '../../i18n';

export const AdvisoryPage: React.FC = () => {
  const { t } = useI18n();
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    advisoryService
      .getAdvisories()
      .then((nextAdvisories) => {
        setError(null);
        setAdvisories(nextAdvisories);
      })
      .catch(() => setError('Farm guidance is unavailable. Start the CropSense API and try again.'));
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

  return (
    <div className="space-y-7 max-w-5xl mx-auto animate-print-hit">
      {/* Question Header */}
      <div className="page-heading">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#2b2f8f] uppercase tracking-wider mb-1">
          <ClipboardCheck size={14} strokeWidth={2.5} />
          <span>{t('Field Guidance')}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[#161922] tracking-tight">
          {t('What should I do on the farm today?')}
        </h2>
        <p className="text-sm text-[#585c6d] mt-1 font-medium">
          {t('Simple daily checklist with timing and clear reasons for your crop.')}
        </p>
      </div>

      {/* Visual Advisory Header Banner */}
      <div className="rounded-[22px] border-2 border-[#161922] bg-[#2b2f8f] p-6 text-white shadow-[4px_4px_0_#161922]">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#b6ff2e]">
          {t('Daily Agronomy Advice')}
        </span>
        <h3 className="mt-1 text-xl sm:text-2xl font-black tracking-tight">
          {advisories.length} {t(advisories.length === 1 ? 'task' : 'tasks')} {t('for your crop today')}
        </h3>
      </div>

      {/* Actionable Advisories List */}
      <div className="space-y-5">
        {advisories.map((item) => (
          <Card key={item.id}>
            <div className="flex items-start justify-between gap-3 pb-4 border-b-2 border-[#161922]/10">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#b6ff2e] text-[#161922] border-2 border-[#161922] shadow-[2px_2px_0_#161922] flex items-center justify-center shrink-0">
                  <ClipboardCheck size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-black text-[#161922] text-lg sm:text-xl tracking-tight">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 font-mono text-xs text-[#585c6d] mt-0.5 font-bold uppercase">
                    <span>{item.date}</span>
                    <span>•</span>
                    <span>{t(item.category === 'crop_protection' ? 'Crop protection' : item.category)}</span>
                  </div>
                </div>
              </div>
              <span
                className={`font-mono text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border-2 border-[#161922] shadow-[1.5px_1.5px_0_#161922] ${
                  item.priority === 'urgent'
                    ? 'bg-[#ff5a36] text-white'
                    : 'bg-[#f4efe6] text-[#161922]'
                }`}
              >
                {t(item.priority === 'urgent' ? 'Important' : 'Routine')}
              </span>
            </div>

            {/* Farmer Checklist Format */}
            <div className="pt-4 space-y-3.5">
              {/* 1. What You Should Do */}
              <div className="p-4 sm:p-5 bg-[#f0f9db] rounded-[18px] border-2 border-[#161922] shadow-[2px_2px_0_#161922]">
                <div className="flex items-center gap-1.5 font-mono text-xs font-black text-[#161922] uppercase tracking-wider mb-1">
                  <CheckCircle2 size={16} strokeWidth={2.5} className="text-[#2b2f8f]" />
                  <span>{t('Action: What to Do')}</span>
                </div>
                <p className="text-[#161922] font-black text-base sm:text-lg leading-snug">
                  {item.whatFarmerShouldDo}
                </p>
              </div>

              {/* 2. When to do it */}
              <div className="p-3.5 bg-[#f4efe6] rounded-2xl border-2 border-[#161922] flex items-center gap-2.5">
                <Clock size={16} strokeWidth={2.5} className="text-[#2b2f8f] shrink-0" />
                <div className="text-xs sm:text-sm font-semibold">
                  <span className="font-mono font-bold text-[#161922] mr-2 uppercase">{t('When:')}</span>
                  <span className="text-[#161922]">{item.whenToDoIt}</span>
                </div>
              </div>

              {/* 3 & 4. What is happening & Why */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm pt-1">
                <div className="p-4 bg-[#f4efe6] rounded-2xl border-1.5 border-[#161922]">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#585c6d] uppercase tracking-wider mb-1.5">
                    <AlertCircle size={14} className="text-[#2b2f8f]" strokeWidth={2.5} />
                    <span>{t('What is happening')}</span>
                  </div>
                  <p className="text-[#161922] leading-relaxed font-semibold">{item.whatIsHappening}</p>
                </div>

                <div className="p-4 bg-[#f4efe6] rounded-2xl border-1.5 border-[#161922]">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#585c6d] uppercase tracking-wider mb-1.5">
                    <HelpCircle size={14} className="text-[#2b2f8f]" strokeWidth={2.5} />
                    <span>{t('Why this matters')}</span>
                  </div>
                  <p className="text-[#161922] leading-relaxed font-semibold">{item.why}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdvisoryPage;
