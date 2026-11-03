import { Farm, Farmer } from '../types';
import { apiGet } from './apiClient';

export const farmService = {
  async getFarm(): Promise<Farm> {
    return apiGet<Farm>('farm');
  },

  async getFarmer(): Promise<Farmer> {
    return apiGet<Farmer>('farmer');
  },
};
