import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRightLeft } from 'lucide-react';

export const DemoScenarioBanner: React.FC = () => {
  const { settings, setScenario } = useApp();

  if (!settings.demoMode) return null;

  const isDrySpell = settings.activeScenario === 'dry_spell';

  return (
    <div className="bg-amber-50 border-b border-amber-200/80 px-4 sm:px-7 py-2.5 text-xs text-amber-950 flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center gap-2">
        <Sparkles size={14} className="text-amber-700 shrink-0" />
        <span>
          <strong className="font-semibold">Demo Mode:</strong> Active test scenario is{' '}
          <span className="font-semibold underline">
            {isDrySpell ? 'Scenario 1 (Dry Spell)' : 'Scenario 2 (Impending Storm)'}
          </span>
        </span>
      </div>

      <button
        type="button"
        onClick={() => setScenario(isDrySpell ? 'impending_storm' : 'dry_spell')}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 font-semibold text-amber-950 transition-colors cursor-pointer min-h-9"
        title="Switch to other test scenario"
      >
        <ArrowRightLeft size={12} />
        <span>Switch to {isDrySpell ? 'Impending Storm' : 'Dry Spell'}</span>
      </button>
    </div>
  );
};
