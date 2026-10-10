import { IrrigationRecommendation } from '../types';
import { apiGet } from './apiClient';

export const irrigationService = {
  async getIrrigationRecommendation(): Promise<IrrigationRecommendation> {
    return apiGet<IrrigationRecommendation>('irrigation');
  },
};
