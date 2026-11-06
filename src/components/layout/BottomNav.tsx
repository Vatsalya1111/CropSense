import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Tractor, CloudSun, ClipboardCheck, AlertTriangle } from 'lucide-react';
import { useI18n } from '../../i18n';

interface BottomNavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
}

const bottomNavItems: BottomNavItem[] = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Farm', path: '/farm', icon: Tractor },
  { label: 'Weather', path: '/weather', icon: CloudSun },
  { label: 'Advisory', path: '/advisory', icon: ClipboardCheck },
  { label: 'Alerts', path: '/alerts', icon: AlertTriangle },
];

export const BottomNav: React.FC = () => {
  const { t } = useI18n();
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-[#f4efe6]/95 backdrop-blur-lg border-t-2 border-[#161922] shadow-[0_-4px_12px_rgba(22,25,34,0.08)] z-40 safe-bottom"
      aria-label={t('Main navigation')}
    >
      <div className="grid grid-cols-5 h-[4.5rem] max-w-lg mx-auto px-2 py-1 items-center">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-150 touch-target ${
                  isActive
                    ? 'bg-[#2b2f8f] text-white border-2 border-[#161922] shadow-[2px_2px_0_#161922] -translate-y-1'
                    : 'text-[#161922] hover:bg-[#eae1d2] font-semibold border-2 border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={19} strokeWidth={isActive ? 2.6 : 2} />
                  <span className={`text-[10px] mt-0.5 tracking-tight truncate max-w-full ${isActive ? 'font-black' : 'font-bold'}`}>
                    {t(item.label)}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
