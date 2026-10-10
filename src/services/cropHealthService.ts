import { CropHealth } from '../types';
import { apiGet } from './apiClient';

export const cropHealthService = {
  async getCropHealth(): Promise<CropHealth> {
    return apiGet<CropHealth>('crop-health');
  },
};
