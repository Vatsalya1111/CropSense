import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Sprout, Settings, MapPin } from 'lucide-react';
import { farmService } from '../../services';
import { Farm } from '../../types';
import { useI18n } from '../../i18n';

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
  const { t } = useI18n();
  const [farm, setFarm] = useState<Farm | null>(null);
  const currentTitle = t(PAGE_TITLES[location.pathname] || 'AgriSense');

  useEffect(() => {
    farmService.getFarm().then(setFarm).catch(() => setFarm(null));
  }, []);

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
              <span className="truncate">{farm ? `${farm.name} · ${farm.location.village}` : t('Farm profile unavailable')}</span>
            </div>
          </div>
        </div>

        {/* Right: Settings */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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
            aria-label={t('Settings')}
          >
            <Settings size={18} />
          </NavLink>
        </div>
      </div>
    </header>
  );
};
