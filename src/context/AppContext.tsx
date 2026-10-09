import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppSettings, ScenarioId } from '../types';
import { getStoredSettings, saveStoredSettings } from '../services';

interface AppContextType {
  settings: AppSettings;
  setScenario: (scenario: ScenarioId) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => getStoredSettings());

  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  const setScenario = (scenario: ScenarioId) => {
    setSettings((prev) => ({
      ...prev,
      activeScenario: scenario,
    }));
  };

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...partial,
    }));
  };

  return (
    <AppContext.Provider value={{ settings, setScenario, updateSettings }}>
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
