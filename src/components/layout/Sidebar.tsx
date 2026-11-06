import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Tractor,
  CloudSun,
  Sprout,
  Droplets,
  ClipboardCheck,
  AlertTriangle,
  Settings,
  User,
} from 'lucide-react';
import { farmService } from '../../services';
import { Farm, Farmer } from '../../types';
import { useI18n } from '../../i18n';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
}

const navItems: NavItem[] = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'My Farm', path: '/farm', icon: Tractor },
  { label: 'Weather', path: '/weather', icon: CloudSun },
  { label: 'Crop Health', path: '/crop-health', icon: Sprout },
  { label: 'Irrigation', path: '/irrigation', icon: Droplets },
  { label: 'Advisory', path: '/advisory', icon: ClipboardCheck },
  { label: 'Alerts', path: '/alerts', icon: AlertTriangle },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { t } = useI18n();
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [farm, setFarm] = useState<Farm | null>(null);

  useEffect(() => {
    const loadProfile = () => {
      Promise.all([farmService.getFarmer(), farmService.getFarm()]).then(([currentFarmer, currentFarm]) => {
        setFarmer(currentFarmer);
        setFarm(currentFarm);
      }).catch(() => {
        setFarmer(null);
        setFarm(null);
      });
    };
    loadProfile();
    window.addEventListener('cropsense:profile-updated', loadProfile);
    return () => window.removeEventListener('cropsense:profile-updated', loadProfile);
  }, []);

  return (
    <aside className="hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 bg-[#f4efe6] text-[#161922] border-r-2 border-[#161922] z-30">
      {/* Brand Header */}
      <div className="px-5 py-5 border-b-2 border-[#161922] flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-[#b6ff2e] text-[#161922] border-2 border-[#161922] flex items-center justify-center shrink-0 shadow-[2px_2px_0_#161922] transition-transform hover:rotate-3">
          <Sprout size={22} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-xl font-black text-[#161922] tracking-tight leading-none">{t('CropSense')}</h2>
          <p className="font-mono text-[10px] text-[#2b2f8f] font-bold uppercase tracking-wider mt-1">{t('Farmer Decision Support')}</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3.5 py-5 space-y-1.5 overflow-y-auto" aria-label={t('Main navigation')}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-full text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-[#2b2f8f] text-white border-2 border-[#161922] shadow-[3px_3px_0_#161922] font-bold translate-x-1'
                    : 'text-[#161922] hover:bg-[#eae1d2] font-semibold border-2 border-transparent'
                }`
              }
            >
              <Icon size={18} strokeWidth={2.2} />
              <span className="tracking-tight">{t(item.label)}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Farmer profile badge at bottom */}
      <div className="p-3">
        <div className="p-3 bg-[#fdfbf7] rounded-[18px] border-2 border-[#161922] shadow-[2px_2px_0_#161922] flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#ff5a36] text-white border-2 border-[#161922] flex items-center justify-center shrink-0 shadow-xs">
            <User size={16} strokeWidth={2.5} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black text-[#161922] truncate">{farmer?.name || t('Farmer profile unavailable')}</p>
            <p className="font-mono text-[10px] text-[#585c6d] truncate uppercase">{farm ? `${farm.crop} · ${farm.area} ${farm.areaUnit}` : t('Farm details unavailable')}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
