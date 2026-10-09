import { CropHealth, ScenarioId } from '../types';
import { scenariosData } from '../data/mockData';
import { getActiveScenarioId } from './scenarioState';

export const cropHealthService = {
  async getCropHealth(scenarioId?: ScenarioId): Promise<CropHealth> {
    const active = scenarioId || getActiveScenarioId();
    const data = scenariosData[active]?.cropHealth || scenariosData.dry_spell.cropHealth;
    return new Promise((resolve) => {
      setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), 50);
    });
  },
};
