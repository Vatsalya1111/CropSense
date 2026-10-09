import React, { useEffect, useState } from 'react';
import { cropHealthService } from '../../services';
import { CropHealth } from '../../types';
import { useApp } from '../../context/AppContext';
import { Sprout, CheckCircle2, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

export const CropHealthPage: React.FC = () => {
  const { settings } = useApp();
  const [health, setHealth] = useState<CropHealth | null>(null);

  useEffect(() => {
    cropHealthService.getCropHealth(settings.activeScenario).then(setHealth);
  }, [settings.activeScenario]);

  if (!health) {
    return <div className="p-16 text-center text-stone-500 font-medium">Checking crop condition...</div>;
  }

  const isDrySpell = settings.activeScenario === 'dry_spell';
  const isGood = !isDrySpell;

  return (
    <div className="space-y-7 max-w-5xl mx-auto">
      {/* Question Header */}
      <div className="page-heading">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-0.5">
          <Sprout size={14} className="text-emerald-700" />
          <span>Crop Condition</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Is My Crop Healthy?
        </h2>
        <p className="text-sm text-stone-600 mt-1 font-medium">
          Simple observation of your wheat crop's vigour and growth stage.
        </p>
      </div>

      {/* Relevant Crop Image */}
      <div className="relative rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm bg-emerald-950">
        <img
          src="/images/crop-health-vital.svg"
          alt="Healthy wheat crop ears close-up"
          className="w-full h-44 sm:h-52 object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent flex flex-col justify-end p-5 text-white">
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
            Wheat Crop (HD-2967)
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
            {isGood ? 'Crop condition is Good' : 'Crop has Heat Stress'}
          </h3>
        </div>
      </div>

      {/* Primary Crop Card */}
      <div
        className={`p-6 sm:p-7 rounded-3xl border-2 transition-all shadow-sm ${
          isGood
            ? 'bg-emerald-50/70 border-emerald-300 text-stone-900'
            : 'bg-amber-50/70 border-amber-300 text-stone-900'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-200/60">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                isGood ? 'bg-emerald-200 text-emerald-950' : 'bg-amber-200 text-amber-950'
              }`}
            >
              <Sprout size={32} />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-stone-600">
                Overall Crop Status
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-stone-900 mt-0.5">
                {isGood ? 'Good' : 'Moderate Stress'}
              </h3>
              <p className="text-sm font-semibold text-stone-700 mt-1">
                {isGood
                  ? 'Your wheat crop is growing with healthy green leaves.'
                  : 'High daytime heat is causing mild leaf curling in direct sunlight.'}
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-stone-200/80 text-xs font-bold text-stone-800 self-start sm:self-auto">
            {isGood ? (
              <TrendingUp size={15} className="text-emerald-700" />
            ) : (
              <TrendingDown size={15} className="text-amber-700" />
            )}
            <span>{isGood ? 'Normal growth' : 'Needs attention'}</span>
          </div>
        </div>

        {/* Growth Stage & Watch-Out Note */}
        <div className="py-5 grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-stone-200/60">
          <div className="p-4 bg-white/90 rounded-xl border border-stone-200/80">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
              Current Growth Stage
            </span>
            <p className="text-stone-900 text-base font-bold">
              {health.cropStage}
            </p>
            <p className="text-xs text-stone-600 mt-1 font-medium">
              Grains are currently forming on the wheat ears.
            </p>
          </div>

          <div className="p-4 bg-white/90 rounded-xl border border-stone-200/80">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
              <AlertTriangle size={14} className="text-amber-600" />
              <span>Watch-Out Note</span>
            </div>
            <p className="text-stone-900 text-xs sm:text-sm font-semibold leading-relaxed">
              {isGood
                ? 'High humidity may cause crop disease. Check lower leaves for dark spots or discoloration after rain.'
                : 'Direct afternoon sun can dry out topsoil fast. Water early in the morning before heat peaks.'}
            </p>
          </div>
        </div>

        {/* Recommended Action */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-700">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
            <span className="font-bold text-stone-900">Recommended Action:</span>
            <span className="font-medium text-stone-800">{health.recommendedAction}</span>
          </div>

          {/* Secondary Health Score */}
          <div className="flex items-center gap-2 self-start sm:self-auto text-stone-500 font-semibold shrink-0">
            <span>Vigour score: {health.healthScore}/100</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropHealthPage;
