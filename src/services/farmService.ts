import { Farm, Farmer } from '../types';
import { mockFarm, mockFarmer } from '../data/mockData';

export const farmService = {
  async getFarm(): Promise<Farm> {
    // Simulated realistic async latency for future API swap
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...mockFarm }), 50);
    });
  },

  async getFarmer(): Promise<Farmer> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...mockFarmer }), 50);
    });
  },
};
