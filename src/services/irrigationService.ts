import { IrrigationRecommendation, ScenarioId } from '../types';
import { scenariosData } from '../data/mockData';
import { getActiveScenarioId } from './scenarioState';

export const irrigationService = {
  async getIrrigationRecommendation(scenarioId?: ScenarioId): Promise<IrrigationRecommendation> {
    const active = scenarioId || getActiveScenarioId();
    const data = scenariosData[active]?.irrigation || scenariosData.dry_spell.irrigation;
    return new Promise((resolve) => {
      setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), 50);
    });
  },
};
