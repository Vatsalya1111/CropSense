import React, { useEffect, useState } from 'react';
import { irrigationService } from '../../services';
import { IrrigationRecommendation } from '../../types';
import { useApp } from '../../context/AppContext';
import { Droplets, Clock, HelpCircle, CheckCircle2 } from 'lucide-react';

export const IrrigationPage: React.FC = () => {
  const { settings } = useApp();
  const [data, setData] = useState<IrrigationRecommendation | null>(null);

  useEffect(() => {
    irrigationService.getIrrigationRecommendation(settings.activeScenario).then(setData);
  }, [settings.activeScenario]);

  if (!data) {
    return <div className="p-16 text-center text-stone-500 font-medium">Checking soil water levels...</div>;
  }

  const isWaterNeeded = data.irrigationStatus === 'Irrigate immediately';

  return (
    <div className="space-y-7 max-w-5xl mx-auto">
      {/* Question Header */}
      <div className="page-heading">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-800 uppercase tracking-wider mb-0.5">
          <Droplets size={14} className="text-sky-700" />
          <span>Irrigation Decision</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Should I Water My Crop?
        </h2>
        <p className="text-sm text-stone-600 mt-1 font-medium">
          Daily watering decision to save your crop, conserve water, and reduce pump electricity.
        </p>
      </div>

      {/* UNMISTAKABLE DECISION HERO */}
      <div
        className={`p-6 sm:p-7 rounded-3xl border-2 transition-all shadow-sm ${
          isWaterNeeded
            ? 'bg-amber-50/90 border-amber-300 text-stone-900'
            : 'bg-sky-50/90 border-sky-300 text-stone-900'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-200/60">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                isWaterNeeded ? 'bg-amber-200 text-amber-950' : 'bg-sky-200 text-sky-950'
              }`}
            >
              <Droplets size={32} />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-stone-600">
                Today's Decision
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-stone-900 mt-0.5">
                {isWaterNeeded ? 'Water your field today' : "Don't water today"}
              </h3>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-stone-200/80 text-xs font-bold text-stone-800 self-start sm:self-auto">
            <Clock size={14} className="text-stone-600" />
            <span>{data.recommendedTime}</span>
          </div>
        </div>

        {/* WHY (ONE LINE) & ACTION (ONE LINE) */}
        <div className="py-5 grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-stone-200/60">
          {/* WHY */}
          <div className="p-4 bg-white/95 rounded-xl border border-stone-200/80">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
              <HelpCircle size={14} className="text-stone-500" />
              <span>Why?</span>
            </div>
            <p className="text-stone-900 text-sm font-semibold leading-relaxed">
              {isWaterNeeded
                ? 'High heat (35°C) is rapidly drying out topsoil moisture and plants need water.'
                : 'Heavy rain is expected tomorrow (~42 mm) and your soil already has enough water.'}
            </p>
          </div>

          {/* ACTION */}
          <div className="p-4 bg-white/95 rounded-xl border border-stone-200/80">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              <CheckCircle2 size={14} className="text-emerald-700" />
              <span>Action:</span>
            </div>
            <p className="text-stone-950 text-sm font-black leading-relaxed">
              {isWaterNeeded
                ? 'Turn on drip lines for 3 hours early this morning before 10 AM.'
                : 'Skip irrigation for the next 48 hours and let the rain water your crop.'}
            </p>
          </div>
        </div>

        {/* SOIL MOISTURE GAUGE */}
        <div className="pt-4">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
              Current Soil Moisture
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-stone-900">{data.soilMoisture}%</span>
              <span className={`text-xs font-bold ${isWaterNeeded ? 'text-amber-800' : 'text-emerald-800'}`}>
                ({isWaterNeeded ? 'Dry' : 'Good Water Level'})
              </span>
            </div>
          </div>

          <div className="w-full h-3.5 bg-stone-200/80 rounded-full overflow-hidden flex">
            <div
              className={`h-full transition-all duration-500 ${
                isWaterNeeded ? 'bg-amber-500' : 'bg-emerald-600'
              }`}
              style={{ width: `${Math.min(100, data.soilMoisture * 1.5)}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] font-bold text-stone-500 mt-2">
            <span className={data.soilMoisture < 25 ? 'text-amber-800 font-black' : ''}>
              Dry (Under 25%)
            </span>
            <span className={data.soilMoisture >= 25 && data.soilMoisture <= 50 ? 'text-emerald-800 font-black' : ''}>
              Good for Crop (25% – 50%)
            </span>
            <span>Too Wet (Over 50%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IrrigationPage;
