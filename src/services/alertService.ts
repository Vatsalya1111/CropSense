import { Alert } from '../types';
import { apiGet } from './apiClient';

export const alertService = {
  async getAlerts(): Promise<Alert[]> {
    return apiGet<Alert[]>('alerts');
  },
};
