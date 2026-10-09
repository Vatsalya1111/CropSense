import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { advisoryService } from '../../services';
import { Advisory } from '../../types';
import { useApp } from '../../context/AppContext';
import { ClipboardCheck, Clock, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export const AdvisoryPage: React.FC = () => {
  const { settings } = useApp();
  const [advisories, setAdvisories] = useState<Advisory[]>([]);

  useEffect(() => {
    advisoryService.getAdvisories(settings.activeScenario).then(setAdvisories);
  }, [settings.activeScenario]);

  return (
    <div className="space-y-7 max-w-5xl mx-auto">
      {/* Question Header */}
      <div className="page-heading">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-0.5">
          <ClipboardCheck size={14} className="text-emerald-700" />
          <span>Field Guidance</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          What Should I Do on the Farm Today?
        </h2>
        <p className="text-sm text-stone-600 mt-1">
          Simple daily checklist with timing and clear reasons for your wheat crop.
        </p>
      </div>

      {/* Visual Advisory Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm bg-emerald-950">
        <img
          src="/images/farmer-inspection.svg"
          alt="Field advisory inspection checklist"
          className="w-full h-36 sm:h-44 object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent flex flex-col justify-end p-5 text-white">
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
            Daily Agronomy Advice
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
            {advisories.length} Action Tasks for Your Crop Today
          </h3>
        </div>
      </div>

      {/* Actionable Advisories List */}
      <div className="space-y-4">
        {advisories.map((item) => (
          <Card key={item.id} className="border-stone-200/80 shadow-sm">
            <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-xl shrink-0">
                  <ClipboardCheck size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-lg sm:text-xl">{item.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                    <span>{item.date}</span>
                    <span>•</span>
                    <span className="capitalize">{item.category.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  item.priority === 'urgent'
                    ? 'bg-amber-100 text-amber-900 border border-amber-200'
                    : 'bg-stone-100 text-stone-700'
                }`}
              >
                {item.priority === 'urgent' ? 'Important' : 'Routine'}
              </span>
            </div>

            {/* Simple Farmer Checklist Format */}
            <div className="pt-4 space-y-3">
              {/* 1. What You Should Do (Highlighted in Green) */}
              <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-900 uppercase tracking-wider mb-1">
                  <CheckCircle2 size={15} className="text-emerald-700" />
                  <span>Action: What to Do</span>
                </div>
                <p className="text-emerald-950 font-bold text-base sm:text-lg leading-snug">
                  {item.whatFarmerShouldDo}
                </p>
              </div>

              {/* 2. When to do it */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center gap-2.5">
                <Clock size={16} className="text-stone-600 shrink-0" />
                <div className="text-xs sm:text-sm">
                  <span className="font-bold text-stone-900 mr-2">When:</span>
                  <span className="text-stone-800 font-semibold">{item.whenToDoIt}</span>
                </div>
              </div>

              {/* 3 & 4. What is happening & Why (Two columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm pt-1">
                <div className="p-3.5 bg-stone-50/70 rounded-xl border border-stone-100">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                    <AlertCircle size={12} className="text-stone-400" />
                    <span>What Is Happening</span>
                  </div>
                  <p className="text-stone-700 leading-relaxed font-medium">{item.whatIsHappening}</p>
                </div>

                <div className="p-3.5 bg-stone-50/70 rounded-xl border border-stone-100">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                    <HelpCircle size={12} className="text-stone-400" />
                    <span>Why This Matters</span>
                  </div>
                  <p className="text-stone-700 leading-relaxed font-medium">{item.why}</p>
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
