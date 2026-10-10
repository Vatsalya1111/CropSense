export interface Farmer {
  id: string;
  name: string;
  phone?: string;
  village: string;
  district: string;
  state: string;
  preferredLanguage: string;
}

export interface Farm {
  id: string;
  farmerId: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    village: string;
    district: string;
    state: string;
  };
  area: number;
  areaUnit: 'acres' | 'hectares';
  crop: string;
  cropStage: string;
  soilType: string;
  irrigationType: string;
  boundary?: [number, number][];
}

export interface WeatherDayForecast {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  weatherCondition: string;
  rainProbability: number;
  expectedRainfall: number; // in mm
  icon: string;
}

export interface WeatherData {
  current: {
    temperature: number;
    weatherCondition: string;
    humidity: number;
    rainProbability: number;
    windSpeed: number;
    rainfall: number; // in mm
    feelsLike: number;
    icon: string;
    lastUpdated: string;
  };
  forecast: WeatherDayForecast[];
  dataSource: string;
  isFallback: boolean;
}

export interface CropHealth {
  overallHealth: 'Optimal' | 'Good' | 'Moderate Stress' | 'Severe Stress';
  healthStatus: string;
  healthScore: number; // 0 - 100
  healthTrend: 'improving' | 'stable' | 'declining';
  cropStage: string;
  observation: string;
  recommendedAction: string;
  lastUpdated: string;
  dataSource: string;
  isFallback: boolean;
  modelVersion: string;
}

export interface IrrigationRecommendation {
  soilMoisture: number; // percentage (e.g. 20% or 40%)
  irrigationStatus: 'Irrigate immediately' | 'Do not irrigate' | 'Normal';
  recommendedAction: string;
  recommendedTime: string;
  reason: string;
  lastUpdated: string;
  dataSource: string;
  isFallback: boolean;
  modelVersion: string;
}

export interface Advisory {
  id: string;
  title: string;
  category: 'irrigation' | 'crop_protection' | 'weather_alert' | 'general';
  whatIsHappening: string;
  why: string;
  whatFarmerShouldDo: string;
  whenToDoIt: string;
  priority: 'urgent' | 'warning' | 'normal';
  date: string;
}

export interface Alert {
  id: string;
  type: 'heavy_rainfall' | 'extreme_heat' | 'low_soil_moisture' | 'crop_health_deterioration' | 'disease_pest_risk';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  actionRequired: string;
  timestamp: string;
}

export interface AppSettings {
  language: 'en' | 'hi';
  dataSaver: boolean;
  theme: 'light' | 'dark';
}
