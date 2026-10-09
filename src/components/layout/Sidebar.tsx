import React from 'react';
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
  Sun,
  CloudRain,
} from 'lucide-react';
import { mockFarmer, mockFarm } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
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
  const { settings } = useApp();
  const isDrySpell = settings.activeScenario === 'dry_spell';

  return (
    <aside className="hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 bg-[#fbfcf9] text-stone-700 border-r border-[#e5ebe3] z-30">
      {/* Brand Header */}
      <div className="px-5 py-6 border-b border-[#e9eee7] flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm">
          <Sprout size={24} />
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-stone-900 tracking-tight">AgriSense</h2>
          <p className="text-[11px] text-emerald-800 font-semibold">Farmer Decision Support</p>
        </div>
      </div>

      {/* Scenario Indicator in Sidebar */}
      <div className="mx-4 mt-5 p-3 rounded-xl bg-[#f2f6ef] border border-[#e5ebe3] text-xs">
        <p className="text-stone-500 font-bold uppercase tracking-wider text-[10px]">Active Demo Condition</p>
        <div className="flex items-center gap-1.5 mt-1.5 font-semibold text-stone-800">
          {isDrySpell ? (
            <>
              <Sun size={15} className="text-amber-600" />
              <span>Scenario 1: Dry Spell</span>
            </>
          ) : (
            <>
              <CloudRain size={15} className="text-sky-700" />
              <span>Scenario 2: Rain Storm</span>
            </>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                  ? 'bg-emerald-50 text-emerald-900 shadow-sm ring-1 ring-emerald-100'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Farmer profile badge at bottom */}
      <div className="p-4 border-t border-[#e9eee7] bg-[#f7f9f5]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
            <User size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-stone-800 truncate">{mockFarmer.name}</p>
            <p className="text-xs text-stone-500 truncate">{mockFarm.crop} • {mockFarm.area} {mockFarm.areaUnit}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
