import { Alert, ScenarioId } from '../types';
import { scenariosData } from '../data/mockData';
import { getActiveScenarioId } from './scenarioState';

export const alertService = {
  async getAlerts(scenarioId?: ScenarioId): Promise<Alert[]> {
    const active = scenarioId || getActiveScenarioId();
    const data = scenariosData[active]?.alerts || scenariosData.dry_spell.alerts;
    return new Promise((resolve) => {
      setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), 50);
    });
  },
};
