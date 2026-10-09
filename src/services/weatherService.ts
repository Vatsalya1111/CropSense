import { WeatherData, ScenarioId } from '../types';
import { scenariosData } from '../data/mockData';
import { getActiveScenarioId } from './scenarioState';

export const weatherService = {
  async getWeatherData(scenarioId?: ScenarioId): Promise<WeatherData> {
    const active = scenarioId || getActiveScenarioId();
    const data = scenariosData[active]?.weather || scenariosData.dry_spell.weather;
    return new Promise((resolve) => {
      setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), 50);
    });
  },
};
