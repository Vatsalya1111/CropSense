import React from 'react';
import { Card } from '../../components/common/Card';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import { Languages, Moon, Sun, Wifi } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const { t } = useI18n();

  return (
    <div className="space-y-7 max-w-5xl mx-auto">
      <div className="page-heading">
        <div className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-0.5">{t('Preferences')}</div>
        <h2>{t('What Can I Change?')}</h2>
        <p>{t('Configure app language and mobile data saver options.')}</p>
      </div>

      <Card title={t('Appearance')} subtitle={t('Choose a comfortable color theme')}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
          <div>
            <p className="font-bold text-stone-900 text-sm">{t('Theme')}</p>
            <p className="text-xs text-stone-500">{t('Switch between light and dark display')}</p>
          </div>
          <div className="inline-flex self-start rounded-xl border border-stone-200 bg-stone-100 p-1" role="group" aria-label={t('Theme')}>
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
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-[0.97] ${active ? 'bg-white text-emerald-900 shadow-sm ring-1 ring-stone-200' : 'text-stone-600 hover:text-stone-900'}`}
                >
                  <Icon size={16} />
                  <span>{t(label)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      <Card title={t('Display & Connectivity')} subtitle={t('Options for low-network field conditions')}>
        <div className="divide-y divide-stone-100">
          <div className="py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-stone-100 rounded-xl text-stone-700"><Languages size={20} /></div>
              <div>
                <p className="font-bold text-stone-900 text-sm">{t('App Language')}</p>
                <p className="text-xs text-stone-500">{t('Select language for farm advice')}</p>
              </div>
            </div>
            <select
              value={settings.language}
              onChange={(event) => updateSettings({ language: event.target.value as 'en' | 'hi' })}
              aria-label={t('Select language for farm advice')}
              className="bg-white border border-stone-300 font-semibold text-stone-800 text-xs sm:text-sm rounded-xl px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>

          <div className="py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-stone-100 rounded-xl text-stone-700"><Wifi size={20} /></div>
              <div>
                <p className="font-bold text-stone-900 text-sm">{t('Data Saver Mode')}</p>
                <p className="text-xs text-stone-500">{t('Save mobile data on 2G/3G rural networks')}</p>
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
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
