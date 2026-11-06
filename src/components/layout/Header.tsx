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
  const currentTitle = t(PAGE_TITLES[location.pathname] || 'CropSense');

  useEffect(() => {
    const loadFarm = () => farmService.getFarm().then(setFarm).catch(() => setFarm(null));
    loadFarm();
    window.addEventListener('cropsense:profile-updated', loadFarm);
    return () => window.removeEventListener('cropsense:profile-updated', loadFarm);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-[#f4efe6]/90 backdrop-blur-md border-b-2 border-[#161922]">
      <div className="max-w-7xl mx-auto px-4 sm:px-7 lg:px-10 min-h-16 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Mobile Brand & Page title */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-[#b6ff2e] text-[#161922] border-2 border-[#161922] shadow-[2px_2px_0_#161922] shrink-0">
            <Sprout size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-extrabold text-[#161922] tracking-tight truncate">
              {currentTitle}
            </h1>
            <div className="flex items-center gap-1.5 font-mono text-xs text-[#585c6d] mt-0.5">
              <MapPin size={12} className="text-[#2b2f8f] shrink-0" />
              <span className="truncate">{farm ? `${farm.name} · ${farm.location.village}` : t('Farm profile unavailable')}</span>
            </div>
          </div>
        </div>

        {/* Right: Settings */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `p-2.5 rounded-full border-2 border-[#161922] transition-all touch-target flex items-center justify-center shadow-[2px_2px_0_#161922] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                isActive
                  ? 'bg-[#2b2f8f] text-white'
                  : 'bg-[#fdfbf7] text-[#161922] hover:bg-[#efe7d8]'
              }`
            }
            aria-label={t('Settings')}
          >
            <Settings size={18} strokeWidth={2.2} />
          </NavLink>
        </div>
      </div>
    </header>
  );
};
