import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Sprout, Settings, MapPin, Sun, CloudRain } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockFarm } from '../../data/mockData';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Today on My Farm',
  '/farm': 'My Farm Profile',
  '/weather': 'Weather Forecast',
  '/crop-health': 'Crop Health',
  '/irrigation': 'Water & Irrigation',
  '/advisory': 'Daily Farm Advice',
  '/alerts': 'Farm Warnings',
  '/settings': 'App Settings',
};

export const Header: React.FC = () => {
  const location = useLocation();
  const { settings, setScenario } = useApp();
  const currentTitle = PAGE_TITLES[location.pathname] || 'AgriSense';

  return (
    <header className="sticky top-0 z-20 bg-[#fbfcf9]/95 backdrop-blur-xl border-b border-[#e5ebe3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-7 lg:px-10 min-h-16 py-2 flex items-center justify-between gap-4">
        {/* Left: Mobile Brand & Page title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-700 text-white shrink-0 shadow-xs">
            <Sprout size={22} />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-stone-900 tracking-tight truncate">
              {currentTitle}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <MapPin size={12} className="text-emerald-700 shrink-0" />
              <span className="truncate">{mockFarm.name} • {mockFarm.location.village}</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Scenario Switcher & Settings */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Scenario Selector */}
          <div className="flex items-center bg-stone-100/80 rounded-xl p-1 border border-stone-200/80 text-xs">
            <button
              type="button"
              onClick={() => setScenario('dry_spell')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                settings.activeScenario === 'dry_spell'
                  ? 'bg-white text-amber-800 shadow-sm ring-1 ring-stone-200/80'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Switch to Scenario 1: Dry Spell"
            >
              <Sun size={13} />
              <span className="hidden sm:inline">Dry Spell</span>
              <span className="sm:hidden">Dry</span>
            </button>
            <button
              type="button"
              onClick={() => setScenario('impending_storm')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                settings.activeScenario === 'impending_storm'
                  ? 'bg-white text-sky-800 shadow-sm ring-1 ring-stone-200/80'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Switch to Scenario 2: Impending Storm"
            >
              <CloudRain size={13} />
              <span className="hidden sm:inline">Storm</span>
              <span className="sm:hidden">Rain</span>
            </button>
          </div>

          {/* Settings Nav Button */}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `p-2.5 rounded-xl border transition-colors touch-target flex items-center justify-center ${
                isActive
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-stone-600 border-stone-200/80 hover:bg-stone-50'
              }`
            }
            aria-label="Settings"
          >
            <Settings size={18} />
          </NavLink>
        </div>
      </div>
    </header>
  );
};
