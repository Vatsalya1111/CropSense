import React, { useEffect, useState } from 'react';
import {
  weatherService,
  cropHealthService,
  irrigationService,
  alertService,
  farmService,
} from '../../services';
import { WeatherData, CropHealth, IrrigationRecommendation, Alert, Farm, Farmer } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Sun,
  CloudRain,
  Droplets,
  Sprout,
  AlertTriangle,
  ArrowRight,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { settings } = useApp();
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [farm, setFarm] = useState<Farm | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [cropHealth, setCropHealth] = useState<CropHealth | null>(null);
  const [irrigation, setIrrigation] = useState<IrrigationRecommendation | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setLoading(true);
      const [f, fm, w, c, i, al] = await Promise.all([
        farmService.getFarmer(),
        farmService.getFarm(),
        weatherService.getWeatherData(settings.activeScenario),
        cropHealthService.getCropHealth(settings.activeScenario),
        irrigationService.getIrrigationRecommendation(settings.activeScenario),
        alertService.getAlerts(settings.activeScenario),
      ]);
      if (mounted) {
        setFarmer(f);
        setFarm(fm);
        setWeather(w);
        setCropHealth(c);
        setIrrigation(i);
        setAlerts(al);
        setLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, [settings.activeScenario]);

  const isDrySpell = settings.activeScenario === 'dry_spell';

  return (
    <div className="space-y-7 max-w-5xl mx-auto">
      {/* 1. GREETING & FARM IDENTITY */}
      <div className="dashboard-welcome flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Good morning, {farmer?.name?.split(' ')[0] || 'Ramesh'}
          </h2>
          <p className="text-sm text-stone-600 mt-0.5 flex items-center gap-1.5 font-medium">
            <MapPin size={14} className="text-emerald-700 shrink-0" />
            <span>{farm?.name || 'Rampur Adarsh Khet'} • {farm?.location.village || 'Rampur'}, {farm?.location.district || 'Sitapur'}</span>
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-stone-100 text-xs text-stone-700 font-semibold border border-stone-200/80">
          <Calendar size={13} className="text-emerald-700" />
          <span>Wheat Crop • Flowering Stage ({farm?.area || '3.5'} Acres)</span>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-stone-500 font-medium">Loading your farm overview...</div>
      ) : (
        <>
          {/* 2. RELEVANT FARM / CROP VISUAL */}
          <div className="relative rounded-3xl overflow-hidden shadow-sm border border-stone-200/90 bg-emerald-950">
            <img
              src="/images/wheat-field-hero.svg"
              alt="Wheat field in Rampur"
              className="w-full h-44 sm:h-52 object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent flex flex-col justify-end p-5 sm:p-7 text-white">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                {farm?.name || 'Rampur Adarsh Khet'} • Today's Outlook
              </span>
              <p className="text-lg sm:text-xl font-bold text-white mt-0.5">
                {isDrySpell
                  ? 'Hot, sunny weather — dry air and rapid moisture loss today.'
                  : 'Rain expected tomorrow — cloudy skies and incoming storm.'}
              </p>
            </div>
          </div>

          {/* 3. DOMINANT RECOMMENDATION (THE VISUAL FOCUS) */}
          <div
            className={`p-6 sm:p-7 rounded-3xl border-2 transition-all shadow-sm ${
              isDrySpell
                ? 'bg-amber-50/90 border-amber-300 text-stone-900'
                : 'bg-sky-50/90 border-sky-300 text-stone-900'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      isDrySpell
                        ? 'bg-amber-200 text-amber-950'
                        : 'bg-sky-200 text-sky-950'
                    }`}
                  >
                    Main Decision Today
                  </span>
                  <span className="text-xs font-semibold text-stone-600 flex items-center gap-1">
                    <Clock size={13} />
                    {isDrySpell ? 'Action needed this morning' : 'No watering needed'}
                  </span>
                </div>

                <h3
                  className={`text-2xl sm:text-3xl font-black tracking-tight ${
                    isDrySpell ? 'text-amber-950' : 'text-sky-950'
                  }`}
                >
                  {isDrySpell ? 'Water your field today' : "Don't water today"}
                </h3>

                <p className="text-sm sm:text-base text-stone-800 font-medium max-w-2xl leading-relaxed">
                  {isDrySpell
                    ? 'Root-zone moisture is low (20%) and temperatures will reach 35°C. Water early before 10 AM to prevent heat stress.'
                    : 'Heavy rain is expected tomorrow and your soil already has enough water (40%). Hold watering and check field drains.'}
                </p>
              </div>

              <div className="shrink-0">
                <Link
                  to={isDrySpell ? '/irrigation' : '/advisory'}
                  className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm text-white shadow-xs transition-colors touch-target ${
                    isDrySpell
                      ? 'bg-amber-700 hover:bg-amber-800'
                      : 'bg-sky-700 hover:bg-sky-800'
                  }`}
                >
                  <span>{isDrySpell ? 'Watering Guide' : 'Drainage Checklist'}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* 4. 3 SUPPORTING STATS (TEMPERATURE, CROP STATUS, SOIL MOISTURE) */}
          <div className="space-y-3">
            <h4 className="font-bold text-stone-500 text-xs tracking-wider uppercase">
              Current Field Conditions
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Stat 1: Weather / Temperature */}
              <Link
                to="/weather"
                className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 hover:border-emerald-300 hover:shadow-md transition-all shadow-sm group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Weather</span>
                  {isDrySpell ? (
                    <Sun size={20} className="text-amber-500" />
                  ) : (
                    <CloudRain size={20} className="text-sky-600" />
                  )}
                </div>
                <div className="mt-3">
                  <div className="text-3xl font-black text-stone-900">
                    {weather?.current.temperature}°C
                  </div>
                  <div className="text-sm font-bold text-stone-800 mt-0.5">
                    {weather?.current.weatherCondition}
                  </div>
                  <p className="text-xs text-stone-600 mt-1">
                    {isDrySpell ? '0% rain • High sun' : 'Rain likely tomorrow'}
                  </p>
                </div>
              </Link>

              {/* Stat 2: Crop Status */}
              <Link
                to="/crop-health"
                className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 hover:border-emerald-300 hover:shadow-md transition-all shadow-sm group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Crop Status</span>
                  <Sprout size={20} className={isDrySpell ? 'text-amber-600' : 'text-emerald-700'} />
                </div>
                <div className="mt-3">
                  <div className="text-3xl font-black text-stone-900">
                    {cropHealth?.overallHealth || (isDrySpell ? 'Moderate Stress' : 'Good')}
                  </div>
                  <div className="text-sm font-bold text-stone-800 mt-0.5">
                    {cropHealth?.cropStage || 'Flowering Stage'} • Wheat
                  </div>
                  <p className="text-xs text-stone-600 mt-1">
                    {isDrySpell ? 'Leaves curling under heat' : 'Healthy green leaves'}
                  </p>
                </div>
              </Link>

              {/* Stat 3: Soil Moisture */}
              <Link
                to="/irrigation"
                className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 hover:border-emerald-300 hover:shadow-md transition-all shadow-sm group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Soil Moisture</span>
                  <Droplets size={20} className={isDrySpell ? 'text-amber-600' : 'text-sky-600'} />
                </div>
                <div className="mt-3">
                  <div className="text-3xl font-black text-stone-900">
                    {irrigation?.soilMoisture}%
                  </div>
                  <div className={`text-sm font-bold mt-0.5 ${isDrySpell ? 'text-amber-800' : 'text-emerald-800'}`}>
                    {isDrySpell ? 'Low (Needs Water)' : 'Good Moisture'}
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full mt-2.5 overflow-hidden">
                    <div
                      className={`h-full ${isDrySpell ? 'bg-amber-500' : 'bg-emerald-600'}`}
                      style={{ width: `${Math.min(100, (irrigation?.soilMoisture || 20) * 1.5)}%` }}
                    />
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* 5. IMPORTANT ALERT (IF ANY) */}
          {alerts.length > 0 && (
            <div
              className={`p-4 sm:p-5 rounded-2xl border flex items-start justify-between gap-3 shadow-xs ${
                alerts[0].severity === 'critical'
                  ? 'bg-red-50/90 border-red-200 text-red-950'
                  : 'bg-amber-50/90 border-amber-200 text-amber-950'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <AlertTriangle
                  size={22}
                  className={
                    alerts[0].severity === 'critical'
                      ? 'text-red-600 shrink-0 mt-0.5'
                      : 'text-amber-600 shrink-0 mt-0.5'
                  }
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm sm:text-base">{alerts[0].title}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider ${
                        alerts[0].severity === 'critical'
                          ? 'bg-red-200 text-red-900'
                          : 'bg-amber-200 text-amber-900'
                      }`}
                    >
                      Alert
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-800 mt-1 leading-relaxed font-medium">
                    {alerts[0].message}
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-stone-900 mt-1.5 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-700 shrink-0" />
                    <span>Action: <span className="font-semibold text-stone-800">{alerts[0].actionRequired}</span></span>
                  </p>
                </div>
              </div>
              <Link
                to="/alerts"
                className="text-xs font-bold text-emerald-800 hover:underline shrink-0 whitespace-nowrap ml-2"
              >
                All Alerts ({alerts.length}) →
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardPage;
