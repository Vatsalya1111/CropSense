import React from 'react';
import { Card } from '../../components/common/Card';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import { Languages, Moon, Sun, Wifi } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const { t } = useI18n();

  return (
    <div className="space-y-7 max-w-5xl mx-auto animate-print-hit">
      <div className="page-heading">
        <div className="font-mono text-xs font-bold text-[#2b2f8f] uppercase tracking-wider mb-1">
          {t('Preferences')}
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[#161922] tracking-tight">
          {t('What Can I Change?')}
        </h2>
        <p className="text-sm text-[#585c6d] mt-1 font-medium">
          {t('Configure app language and mobile data saver options.')}
        </p>
      </div>

      <Card title={t('Appearance')} subtitle={t('Choose a comfortable color theme')}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
          <div>
            <p className="font-extrabold text-[#161922] text-sm">{t('Theme')}</p>
            <p className="font-mono text-xs text-[#585c6d] mt-0.5">{t('Switch between light and dark display')}</p>
          </div>
          <div className="inline-flex self-start rounded-full border-2 border-[#161922] bg-[#f4efe6] p-1 shadow-[2px_2px_0_#161922]" role="group" aria-label={t('Theme')}>
            {(['light', 'dark'] as const).map((theme) => {
              const active = settings.theme === theme;
              const Icon = theme === 'light' ? Sun : Moon;
              const label = theme === 'light' ? 'Light' : 'Dark';
              return (
                <button
                  key={theme}
                  type="button"
                  aria-pressed={active}
                  aria-label={t(`${label} theme`)}
                  onClick={() => updateSettings({ theme })}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
                    active
                      ? 'bg-[#2b2f8f] text-white border-2 border-[#161922] shadow-[2px_2px_0_#161922]'
                      : 'text-[#161922] hover:bg-[#efe7d8] border-2 border-transparent'
                  }`}
                >
                  <Icon size={15} strokeWidth={2.5} />
                  <span>{t(label)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      <Card title={t('Display & Connectivity')} subtitle={t('Options for low-network field conditions')}>
        <div className="divide-y-2 divide-[#161922]/10">
          <div className="py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#f4efe6] border-2 border-[#161922] text-[#161922] shadow-[2px_2px_0_#161922] flex items-center justify-center shrink-0">
                <Languages size={18} strokeWidth={2.3} />
              </div>
              <div>
                <p className="font-extrabold text-[#161922] text-sm">{t('App Language')}</p>
                <p className="font-mono text-xs text-[#585c6d] mt-0.5">{t('Select language for farm advice')}</p>
              </div>
            </div>
            <select
              value={settings.language}
              onChange={(event) => updateSettings({ language: event.target.value as 'en' | 'hi' })}
              aria-label={t('Select language for farm advice')}
              className="bg-[#fdfbf7] border-2 border-[#161922] font-mono font-bold text-[#161922] text-xs sm:text-sm rounded-full px-4 py-2 shadow-[2px_2px_0_#161922] focus:ring-2 focus:ring-[#2b2f8f] transition-all cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>

          <div className="py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#f4efe6] border-2 border-[#161922] text-[#161922] shadow-[2px_2px_0_#161922] flex items-center justify-center shrink-0">
                <Wifi size={18} strokeWidth={2.3} />
              </div>
              <div>
                <p className="font-extrabold text-[#161922] text-sm">{t('Data Saver Mode')}</p>
                <p className="font-mono text-xs text-[#585c6d] mt-0.5">{t('Save mobile data on 2G/3G rural networks')}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.dataSaver}
                onChange={(event) => updateSettings({ dataSaver: event.target.checked })}
                className="sr-only peer"
                aria-label={t('Data Saver Mode')}
              />
              <div className="w-12 h-7 bg-[#f4efe6] border-2 border-[#161922] shadow-[2px_2px_0_#161922] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-[#161922] after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-[#161922] after:border-2 after:border-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#b6ff2e]" />
            </label>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
