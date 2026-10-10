import { Advisory } from '../types';
import { apiGet } from './apiClient';

export const advisoryService = {
  async getAdvisories(): Promise<Advisory[]> {
    return apiGet<Advisory[]>('advisories');
  },
};
