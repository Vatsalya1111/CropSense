import { WeatherData } from '../types';
import { apiGet } from './apiClient';

export const weatherService = {
  async getWeatherData(): Promise<WeatherData> {
    return apiGet<WeatherData>('weather');
  },
};
