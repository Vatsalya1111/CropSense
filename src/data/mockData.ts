import {
  Farmer,
  Farm,
  WeatherData,
  CropHealth,
  IrrigationRecommendation,
  Advisory,
  Alert,
  ScenarioId,
} from '../types';

export const mockFarmer: Farmer = {
  id: 'farmer_01',
  name: 'Ramesh Patel',
  phone: '+91 98765 43210',
  village: 'Rampur',
  district: 'Sitapur',
  state: 'Uttar Pradesh',
  preferredLanguage: 'en',
};

export const mockFarm: Farm = {
  id: 'farm_01',
  farmerId: 'farmer_01',
  name: 'Rampur Adarsh Khet',
  location: {
    lat: 27.5645,
    lng: 80.6789,
    village: 'Rampur',
    district: 'Sitapur',
    state: 'Uttar Pradesh',
  },
  area: 3.5,
  areaUnit: 'acres',
  crop: 'Wheat (HD-2967)',
  cropStage: 'Flowering & Grain Filling',
  soilType: 'Sandy Loam',
  irrigationType: 'Drip & Furrow',
  boundary: [
    [27.5652, 80.6775],
    [27.5658, 80.6802],
    [27.5638, 80.6806],
    [27.5632, 80.6780],
  ],
};

/* =========================================================================
   SCENARIO 1: DRY SPELL
   - Sunny, 35°C, 0% rain probability
   - Soil moisture: 20%
   - Recommendation: Irrigate immediately
   - Crop health: Moderate stress
   - Advisory: High heat stress detected; monitor crop and provide irrigation
   ========================================================================= */

const drySpellWeather: WeatherData = {
  current: {
    temperature: 35,
    weatherCondition: 'Sunny',
    humidity: 32,
    rainProbability: 0,
    windSpeed: 18,
    rainfall: 0,
    feelsLike: 37,
    icon: 'Sun',
    lastUpdated: '10 minutes ago',
  },
  forecast: [
    { date: '2026-10-05', dayName: 'Today', tempMax: 36, tempMin: 22, weatherCondition: 'Sunny & Hot', rainProbability: 0, expectedRainfall: 0, icon: 'Sun' },
    { date: '2026-10-06', dayName: 'Tomorrow', tempMax: 37, tempMin: 23, weatherCondition: 'Sunny', rainProbability: 0, expectedRainfall: 0, icon: 'Sun' },
    { date: '2026-10-07', dayName: 'Wednesday', tempMax: 36, tempMin: 22, weatherCondition: 'Clear Sky', rainProbability: 5, expectedRainfall: 0, icon: 'Sun' },
    { date: '2026-10-08', dayName: 'Thursday', tempMax: 35, tempMin: 21, weatherCondition: 'Mostly Sunny', rainProbability: 5, expectedRainfall: 0, icon: 'SunMedium' },
    { date: '2026-10-09', dayName: 'Friday', tempMax: 34, tempMin: 21, weatherCondition: 'Partly Cloudy', rainProbability: 10, expectedRainfall: 0, icon: 'CloudSun' },
  ],
};

const drySpellCropHealth: CropHealth = {
  overallHealth: 'Moderate Stress',
  healthStatus: 'Moderate heat & moisture stress detected',
  healthScore: 64,
  healthTrend: 'declining',
  cropStage: 'Flowering & Grain Filling',
  observation: 'Canopy temperature is 2.8°C higher than ambient air. Mild leaf curling observed in southern quadrant due to high evaporation rate.',
  recommendedAction: 'Apply urgent morning or late afternoon irrigation to mitigate floral abortion and maintain transpiration cooling.',
  isDemoData: true,
  lastUpdated: 'Today at 08:30 AM',
};

const drySpellIrrigation: IrrigationRecommendation = {
  soilMoisture: 20,
  irrigationStatus: 'Irrigate immediately',
  recommendedAction: 'Irrigate immediately',
  recommendedTime: 'Today before 10:00 AM or after 5:00 PM',
  reason: 'Soil moisture is at critical threshold (20%) during high heat conditions (35°C). Avoid peak afternoon sun to prevent evaporation loss.',
  lastUpdated: 'Just now',
};

const drySpellAdvisories: Advisory[] = [
  {
    id: 'adv-dry-1',
    title: 'High heat stress detected',
    category: 'irrigation',
    whatIsHappening: 'Ambient temperatures have crossed 35°C with 0% rain probability and dry winds.',
    why: 'Rapid evapotranspiration is depleting root-zone moisture below the safe threshold of 35%.',
    whatFarmerShouldDo: 'Monitor crop closely and provide light, frequent irrigation. Avoid midday watering.',
    whenToDoIt: 'Today early morning (before 10 AM) or evening (after 5 PM)',
    priority: 'urgent',
    date: 'Today',
  },
  {
    id: 'adv-dry-2',
    title: 'Mulching recommendation for moisture conservation',
    category: 'crop_protection',
    whatIsHappening: 'Soil surface temperature is elevated, leading to crusting and moisture loss.',
    why: 'Exposed sandy loam soil loses topsoil moisture rapidly under intense direct sunlight.',
    whatFarmerShouldDo: 'Apply organic mulch or crop residue around crop base to retain ground moisture.',
    whenToDoIt: 'Within 2 days',
    priority: 'warning',
    date: 'Today',
  },
];

const drySpellAlerts: Alert[] = [
  {
    id: 'alert-dry-1',
    type: 'extreme_heat',
    severity: 'warning',
    title: 'Extreme Heat Stress',
    message: 'Temperatures expected to peak at 37°C today. Crop evapotranspiration rate is very high.',
    actionRequired: 'Ensure irrigation lines are active and inspect field corners for early wilting.',
    timestamp: '07:00 AM Today',
  },
  {
    id: 'alert-dry-2',
    type: 'low_soil_moisture',
    severity: 'critical',
    title: 'Critical Soil Moisture Level (20%)',
    message: 'Root zone moisture has dropped to 20%, well below the minimum threshold of 30%.',
    actionRequired: 'Initiate drip irrigation cycle for at least 3 hours today.',
    timestamp: '08:15 AM Today',
  },
];

/* =========================================================================
   SCENARIO 2: IMPENDING STORM
   - Cloudy, 26°C, 90% rain probability tomorrow
   - Soil moisture: 40%
   - Recommendation: Do not irrigate (Reason: Heavy rainfall expected)
   - Advisory: Ensure field drainage is clear
   ========================================================================= */

const impendingStormWeather: WeatherData = {
  current: {
    temperature: 26,
    weatherCondition: 'Cloudy',
    humidity: 84,
    rainProbability: 90,
    windSpeed: 24,
    rainfall: 4,
    feelsLike: 27,
    icon: 'CloudRain',
    lastUpdated: '5 minutes ago',
  },
  forecast: [
    { date: '2026-10-05', dayName: 'Today', tempMax: 27, tempMin: 21, weatherCondition: 'Overcast & Humid', rainProbability: 60, expectedRainfall: 6, icon: 'Cloud' },
    { date: '2026-10-06', dayName: 'Tomorrow', tempMax: 24, tempMin: 19, weatherCondition: 'Heavy Rain / Thunder', rainProbability: 95, expectedRainfall: 42, icon: 'CloudLightning' },
    { date: '2026-10-07', dayName: 'Wednesday', tempMax: 25, tempMin: 20, weatherCondition: 'Showers', rainProbability: 75, expectedRainfall: 18, icon: 'CloudRain' },
    { date: '2026-10-08', dayName: 'Thursday', tempMax: 28, tempMin: 21, weatherCondition: 'Scattered Clouds', rainProbability: 25, expectedRainfall: 2, icon: 'CloudSun' },
    { date: '2026-10-09', dayName: 'Friday', tempMax: 30, tempMin: 22, weatherCondition: 'Sunny Breaks', rainProbability: 10, expectedRainfall: 0, icon: 'Sun' },
  ],
};

const impendingStormCropHealth: CropHealth = {
  overallHealth: 'Good',
  healthStatus: 'Good vigour, but high risk of waterlogging',
  healthScore: 82,
  healthTrend: 'stable',
  cropStage: 'Flowering & Grain Filling',
  observation: 'Canopy is lush and vegetative index is healthy. High humidity increases vulnerability to foliar fungal pathogens if water stands.',
  recommendedAction: 'Clear peripheral field drainage ditches and suspend chemical foliar sprays until weather clears.',
  isDemoData: true,
  lastUpdated: 'Today at 09:15 AM',
};

const impendingStormIrrigation: IrrigationRecommendation = {
  soilMoisture: 40,
  irrigationStatus: 'Do not irrigate',
  recommendedAction: 'Do not irrigate',
  recommendedTime: 'Pause all irrigation for next 48 hours',
  reason: 'Heavy rainfall expected (90% probability, ~42 mm forecast tomorrow). Adequate soil moisture (40%) already present.',
  lastUpdated: 'Just now',
};

const impendingStormAdvisories: Advisory[] = [
  {
    id: 'adv-storm-1',
    title: 'Ensure field drainage is clear',
    category: 'weather_alert',
    whatIsHappening: 'Impending heavy rainstorm with 90% rain probability and high wind gusts tomorrow.',
    why: 'Standing water can lead to root asphyxiation and root-rot in loamy soil during the grain filling stage.',
    whatFarmerShouldDo: 'Inspect boundary furrows and ensure field drainage channels are cleared of weeds and debris.',
    whenToDoIt: 'Immediately before rainfall begins this afternoon',
    priority: 'urgent',
    date: 'Today',
  },
  {
    id: 'adv-storm-2',
    title: 'Postpone fertilizer application & pesticide spraying',
    category: 'crop_protection',
    whatIsHappening: 'Strong surface runoff expected due to heavy downpours.',
    why: 'Applied agrochemicals will wash off into drainage, causing financial loss and chemical leaching.',
    whatFarmerShouldDo: 'Wait until the storm clears and soil moisture normalizes before next application.',
    whenToDoIt: 'Reschedule to Thursday or Friday',
    priority: 'warning',
    date: 'Today',
  },
];

const impendingStormAlerts: Alert[] = [
  {
    id: 'alert-storm-1',
    type: 'heavy_rainfall',
    severity: 'critical',
    title: 'Heavy Rainfall Warning (35-50 mm)',
    message: 'Severe thunderstorms forecast for tomorrow with 90% probability. Gusty winds up to 40 km/h.',
    actionRequired: 'Do not irrigate. Check bunds and drainage outlets to avoid field inundation.',
    timestamp: '06:30 AM Today',
  },
  {
    id: 'alert-storm-2',
    type: 'disease_pest_risk',
    severity: 'warning',
    title: 'Elevated Fungal / Blight Risk',
    message: 'Extended canopy wetness and high humidity (>85%) create optimal conditions for fungal spores.',
    actionRequired: 'Scout lower leaves after storm passes; prepare organic fungicide if needed.',
    timestamp: '08:00 AM Today',
  },
];

export const scenariosData: Record<ScenarioId, {
  name: string;
  description: string;
  weather: WeatherData;
  cropHealth: CropHealth;
  irrigation: IrrigationRecommendation;
  advisories: Advisory[];
  alerts: Alert[];
}> = {
  dry_spell: {
    name: 'Scenario 1: Dry Spell',
    description: 'Sunny, 35°C, 20% soil moisture — urgent irrigation needed',
    weather: drySpellWeather,
    cropHealth: drySpellCropHealth,
    irrigation: drySpellIrrigation,
    advisories: drySpellAdvisories,
    alerts: drySpellAlerts,
  },
  impending_storm: {
    name: 'Scenario 2: Impending Storm',
    description: 'Cloudy, 26°C, 90% rain chance — pause irrigation & clear drainage',
    weather: impendingStormWeather,
    cropHealth: impendingStormCropHealth,
    irrigation: impendingStormIrrigation,
    advisories: impendingStormAdvisories,
    alerts: impendingStormAlerts,
  },
};
