import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Tractor, CloudSun, ClipboardCheck, AlertTriangle } from 'lucide-react';
import { useI18n } from '../../i18n';

interface BottomNavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
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
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-stone-200/80 shadow-[0_-8px_24px_rgba(33,54,39,0.06)] z-40 safe-bottom"
      aria-label={t('Main navigation')}
    >
      <div className="grid grid-cols-5 h-[4.25rem] max-w-lg mx-auto px-1">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-1 touch-target transition-colors relative ${
                  isActive
                    ? 'text-emerald-800 font-bold'
                    : 'text-stone-500 hover:text-stone-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} className={isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'} />
                  <span className="text-[11px] mt-1 tracking-tight truncate max-w-full">
                    {t(item.label)}
                  </span>
                  {isActive && (
                    <span className="absolute top-0 w-8 h-0.5 bg-emerald-700 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
