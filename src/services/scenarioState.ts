import { ScenarioId, AppSettings } from '../types';

const STORAGE_KEY_SETTINGS = 'agrisense_settings';

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  dataSaver: false,
  demoMode: true,
  activeScenario: 'dry_spell',
};

export function getStoredSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
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
    // Ignore storage errors in demo environment
  }
}

export function getActiveScenarioId(): ScenarioId {
  return getStoredSettings().activeScenario;
}
