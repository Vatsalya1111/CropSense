import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { getStoredSettings, saveStoredSettings } from '../services';
import { setApiLanguage } from '../services/apiClient';

interface AppContextType {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const initial = getStoredSettings();
    setApiLanguage(initial.language);
    document.documentElement.dataset.theme = initial.theme;
    document.documentElement.lang = initial.language;
    return initial;
  });

  useEffect(() => {
    saveStoredSettings(settings);
    document.documentElement.dataset.theme = settings.theme;
    document.documentElement.lang = settings.language;
  }, [settings]);

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      setApiLanguage(next.language);
      saveStoredSettings(next);
      document.documentElement.dataset.theme = next.theme;
      document.documentElement.lang = next.language;
      return next;
    });
  };

  return (
    <AppContext.Provider value={{ settings, updateSettings }}>
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
