import { Farm, FarmProfile, Farmer } from '../types';
import { apiGet, apiPut } from './apiClient';

export const farmService = {
  async getFarm(): Promise<Farm> {
    return apiGet<Farm>('farm');
  },

  async getFarmer(): Promise<Farmer> {
    return apiGet<Farmer>('farmer');
  },

  async getProfile(): Promise<FarmProfile> {
    return apiGet<FarmProfile>('profile');
  },

  async saveProfile(profile: { farmer: Omit<Farmer, 'id'>; farm: Omit<Farm, 'id' | 'farmerId'> }): Promise<FarmProfile> {
    return apiPut<FarmProfile>('profile', profile);
  },
};

export function notifyProfileSaved(): void {
  window.dispatchEvent(new Event('cropsense:profile-updated'));
}
