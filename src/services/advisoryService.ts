import { Advisory, ScenarioId } from '../types';
import { scenariosData } from '../data/mockData';
import { getActiveScenarioId } from './scenarioState';

export const advisoryService = {
  async getAdvisories(scenarioId?: ScenarioId): Promise<Advisory[]> {
    const active = scenarioId || getActiveScenarioId();
    const data = scenariosData[active]?.advisories || scenariosData.dry_spell.advisories;
    return new Promise((resolve) => {
      setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), 50);
    });
  },
};
