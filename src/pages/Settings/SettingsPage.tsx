import React from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { useApp } from '../../context/AppContext';
import { Languages, Wifi, Sparkles, CheckCircle, Sun, CloudRain } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, setScenario, updateSettings } = useApp();

  return (
    <div className="space-y-7 max-w-5xl mx-auto">
      <div className="page-heading">
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 uppercase tracking-wider mb-0.5">
          <span>Preferences</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          What Can I Change?
        </h2>
        <p className="text-sm text-stone-600 mt-1">
          Configure app language, test scenarios, and mobile data saver options.
        </p>
      </div>

      {/* Scenario Selection Section */}
      <Card title="Test Scenarios for Hackathon Demo" subtitle="Switch weather and soil conditions to test app decisions">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-3">
          {/* Scenario 1: Dry Spell */}
          <div
            onClick={() => setScenario('dry_spell')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
              settings.activeScenario === 'dry_spell'
                ? 'border-amber-500 bg-amber-50/60 shadow-sm'
                : 'border-stone-200 hover:border-stone-300 hover:shadow-sm bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun size={20} className="text-amber-500" />
                <span className="font-black text-stone-900 text-base">Scenario 1: Dry Spell</span>
              </div>
              {settings.activeScenario === 'dry_spell' && (
                <CheckCircle size={20} className="text-amber-600" />
              )}
            </div>
            <p className="text-xs sm:text-sm text-stone-700 mt-2 font-medium">
              Sunny, 35°C, 20% soil moisture. App directs the farmer to water immediately before peak heat.
            </p>
            <div className="mt-3.5 flex gap-2">
              <Badge variant="amber" size="sm">35°C Sunny</Badge>
              <Badge variant="red" size="sm">20% Soil Water</Badge>
            </div>
          </div>

          {/* Scenario 2: Impending Storm */}
          <div
            onClick={() => setScenario('impending_storm')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
              settings.activeScenario === 'impending_storm'
                ? 'border-sky-600 bg-sky-50/60 shadow-sm'
                : 'border-stone-200 hover:border-stone-300 hover:shadow-sm bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CloudRain size={20} className="text-sky-600" />
                <span className="font-black text-stone-900 text-base">Scenario 2: Rain Storm</span>
              </div>
              {settings.activeScenario === 'impending_storm' && (
                <CheckCircle size={20} className="text-sky-700" />
              )}
            </div>
            <p className="text-xs sm:text-sm text-stone-700 mt-2 font-medium">
              Cloudy, 26°C, 90% rain chance. App directs the farmer NOT to water and to check drainage outlets.
            </p>
            <div className="mt-3.5 flex gap-2">
              <Badge variant="blue" size="sm">90% Rain Chance</Badge>
              <Badge variant="green" size="sm">40% Soil Water</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Preferences Section: Language, Data Saver, Demo Mode */}
      <Card title="Display & Connectivity" subtitle="Options for low-network field conditions">
        <div className="divide-y divide-stone-100">
          {/* Language */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-stone-100 rounded-xl text-stone-700">
                <Languages size={20} />
              </div>
              <div>
                <p className="font-bold text-stone-900 text-sm">App Language</p>
                <p className="text-xs text-stone-500">Select language for farm advice</p>
              </div>
            </div>
            <select
              value={settings.language}
              onChange={(e) => updateSettings({ language: e.target.value as 'en' | 'hi' })}
              aria-label="Select App Language"
              className="bg-white border border-stone-300 font-semibold text-stone-800 text-xs sm:text-sm rounded-xl px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
          </div>

          {/* Data Saver */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-stone-100 rounded-xl text-stone-700">
                <Wifi size={20} />
              </div>
              <div>
                <p className="font-bold text-stone-900 text-sm">Data Saver Mode</p>
                <p className="text-xs text-stone-500">Save mobile data on 2G/3G rural networks</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.dataSaver}
                onChange={(e) => updateSettings({ dataSaver: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Demo Mode Toggle */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-stone-100 rounded-xl text-stone-700">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="font-bold text-stone-900 text-sm">Demo Mode Banner</p>
                <p className="text-xs text-stone-500">Show quick scenario switcher at top of screen</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.demoMode}
                onChange={(e) => updateSettings({ demoMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
