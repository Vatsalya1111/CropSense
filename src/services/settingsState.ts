import { AppSettings } from '../types';

const STORAGE_KEY_SETTINGS = 'agrisense_settings';

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  dataSaver: false,
  theme: 'light',
};

export function getStoredSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (raw) {
      const stored = JSON.parse(raw) as Partial<AppSettings>;
      return {
        language: stored.language === 'hi' ? 'hi' : 'en',
        dataSaver: Boolean(stored.dataSaver),
        theme: stored.theme === 'dark' ? 'dark' : 'light',
      };
    }
  } catch {
    // Fallback if localStorage is restricted
  }
  return DEFAULT_SETTINGS;
}

export function saveStoredSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch {
    // Ignore storage errors in browser environments that restrict local storage.
  }
}

