import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Calendar, CheckCircle2, CloudRain, Droplets, MapPin, Sprout, Sun } from 'lucide-react';
import { useI18n } from '../../i18n';
import { weatherService, cropHealthService, irrigationService, alertService, farmService } from '../../services';
import { WeatherData, CropHealth, IrrigationRecommendation, Alert, Farm, Farmer } from '../../types';
import { SoilMoistureBar } from '../../components/common/SoilMoistureBar';

export const DashboardPage: React.FC = () => {
  const { t } = useI18n();
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [farm, setFarm] = useState<Farm | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [cropHealth, setCropHealth] = useState<CropHealth | null>(null);
  const [irrigation, setIrrigation] = useState<IrrigationRecommendation | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      farmService.getFarmer(),
      farmService.getFarm(),
      weatherService.getWeatherData(),
      cropHealthService.getCropHealth(),
      irrigationService.getIrrigationRecommendation(),
      alertService.getAlerts(),
    ]).then(([f, fm, w, c, i, al]) => {
      if (!mounted) return;
      setFarmer(f);
      setFarm(fm);
      setWeather(w);
      setCropHealth(c);
      setIrrigation(i);
      setAlerts(al);
    }).catch(() => {
      if (mounted) setError('Farm insights are unavailable. Start the CropSense API and try again.');
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, [t]);

  if (loading) {
    return (
      <div className="p-16 text-center">
        <div className="inline-block p-4 rounded-full border-2 border-[#161922] bg-[#fdfbf7] shadow-[3px_3px_0_#161922] font-mono text-sm font-bold animate-pulse">
          {t('Loading your farm overview...')}
        </div>
      </div>
    );
  }

  if (error || !weather || !cropHealth || !irrigation) {
    return (
      <div className="p-16 text-center">
        <div className="inline-block p-6 rounded-2xl border-2 border-[#161922] bg-[#fff1e8] text-[#c32a10] shadow-[4px_4px_0_#161922] font-mono text-sm font-bold">
          {t(error || 'Farm insights are unavailable.')}
        </div>
      </div>
    );
  }

  const needsWater = irrigation.irrigationStatus === 'Irrigate immediately';
  const mainAlert = alerts[0];

  return (
    <div className="space-y-7 max-w-5xl mx-auto animate-print-hit">
      {/* Welcome Header */}
      <div className="dashboard-welcome flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#161922] tracking-tight">
            {t('Good morning,')} {farmer?.name.split(' ')[0] || t('Farmer')}
          </h2>
          <p className="font-mono text-xs sm:text-sm text-[#585c6d] mt-1 flex items-center gap-1.5 font-semibold">
            <MapPin size={14} className="text-[#2b2f8f] shrink-0" />
            <span>{farm?.name} · {farm?.location.village}, {farm?.location.district}</span>
          </p>
        </div>
        {farm && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fdfbf7] text-[#161922] font-mono text-xs font-bold border-2 border-[#161922] shadow-[2px_2px_0_#161922] uppercase tracking-wider self-start sm:self-auto">
            <Calendar size={13} className="text-[#2b2f8f]" />
            <span>{t(farm.crop)} · {farm.area} {t(farm.areaUnit)}</span>
          </div>
        )}
      </div>

      {/* Hero Advice Card */}
      <div
        className={`p-6 sm:p-8 rounded-[24px] border-2 border-[#161922] shadow-[5px_5px_0_#161922] transition-all ${
          needsWater ? 'bg-[#fff5f0]' : 'bg-[#eef4ff]'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#b6ff2e] text-[#161922] border-2 border-[#161922] shadow-[1.5px_1.5px_0_#161922]">
              {t("Today's advice")}
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#161922] tracking-tight">
              {t(irrigation.irrigationStatus)}
            </h3>
            <p className="text-sm sm:text-base text-[#161922] font-semibold max-w-2xl leading-relaxed">
              {t(irrigation.reason)}
            </p>
            <p className="text-sm text-[#585c6d] font-medium">
              {t(irrigation.recommendedAction)}
            </p>
          </div>
          <Link
            to="/irrigation"
            className="press-btn press-btn-primary shrink-0 self-start md:self-auto"
          >
            <span>{t('View irrigation details')}</span>
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </div>

        <details className="mt-5 rounded-2xl border-2 border-[#161922] bg-[#fdfbf7] p-4 text-sm shadow-[2px_2px_0_#161922]">
          <summary className="cursor-pointer font-bold font-mono text-xs uppercase tracking-wider text-[#161922] select-none">
            {t('How was this decided?')}
          </summary>
          <div className="mt-3 flex flex-wrap gap-2 font-mono text-xs">
            <span className="rounded-full border-1.5 border-[#161922] bg-[#f4efe6] px-3 py-1 font-bold text-[#161922] shadow-xs">
              {t('Weather source')}: {t(weather.dataSource)}
            </span>
            <span className="rounded-full border-1.5 border-[#161922] bg-[#f4efe6] px-3 py-1 font-bold text-[#161922] shadow-xs">
              {t('Soil moisture input')}: {t('Estimated, no sensor connected')}
            </span>
            <span className="rounded-full border-1.5 border-[#161922] bg-[#f4efe6] px-3 py-1 font-bold text-[#161922] shadow-xs">
              {t('Prediction version')}: {irrigation.modelVersion}
            </span>
          </div>
        </details>
      </div>

      {/* Weather Ticker Bar */}
      <div className="flex items-center justify-between gap-3 rounded-[20px] border-2 border-[#161922] bg-[#fdfbf7] px-5 py-3.5 shadow-[3px_3px_0_#161922]">
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#f4efe6] border-2 border-[#161922] flex items-center justify-center shrink-0">
            <CloudRain className="text-[#2b2f8f]" size={20} strokeWidth={2.3} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-[#161922] truncate">
              {t(weather.current.weatherCondition)} · {weather.current.temperature}°C
            </p>
            <p className="font-mono text-xs font-bold text-[#585c6d]">
              {weather.current.rainProbability}% {t('rain probability')}
            </p>
          </div>
        </div>
        <span className="shrink-0 font-mono text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border-1.5 border-[#161922] bg-[#f4efe6] text-[#161922]">
          {t(weather.dataSource)}
        </span>
      </div>

      {/* 3-Column Field Conditions */}
      <div className="space-y-3">
        <h4 className="font-mono font-bold text-[#585c6d] text-xs tracking-widest uppercase">
          {t('Current Field Conditions')}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Weather Card */}
          <Link
            to="/weather"
            className="press-card-interactive p-5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#161922]/10">
              <span className="font-mono text-xs font-bold text-[#585c6d] uppercase tracking-wider">
                {t('Weather')}
              </span>
              <div className="w-8 h-8 rounded-full border-1.5 border-[#161922] bg-[#f4efe6] flex items-center justify-center">
                {weather.current.rainProbability >= 50 ? (
                  <CloudRain size={16} className="text-[#2b2f8f]" strokeWidth={2.5} />
                ) : (
                  <Sun size={16} className="text-[#ff5a36]" strokeWidth={2.5} />
                )}
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl sm:text-4xl font-black text-[#161922] tracking-tight">
                {weather.current.temperature}°C
              </div>
              <div className="text-sm font-extrabold text-[#161922] mt-1">
                {t(weather.current.weatherCondition)}
              </div>
              <p className="font-mono text-xs font-semibold text-[#585c6d] mt-1.5">
                {weather.current.rainProbability}% {t('rain probability')}
              </p>
            </div>
          </Link>

          {/* Crop Health Card */}
          <Link
            to="/crop-health"
            className="press-card-interactive p-5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#161922]/10">
              <span className="font-mono text-xs font-bold text-[#585c6d] uppercase tracking-wider">
                {t('Crop Health')}
              </span>
              <div className="w-8 h-8 rounded-full border-1.5 border-[#161922] bg-[#b6ff2e] flex items-center justify-center text-[#161922]">
                <Sprout size={16} strokeWidth={2.5} />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-black text-[#161922] tracking-tight">
                {t(cropHealth.overallHealth)}
              </div>
              <div className="text-sm font-extrabold text-[#161922] mt-1">
                {t('Health score')}: {cropHealth.healthScore}/100
              </div>
              <p className="text-xs text-[#585c6d] font-medium mt-1.5 line-clamp-2">
                {t(cropHealth.observation)}
              </p>
            </div>
          </Link>

          {/* Soil Moisture Card */}
          <Link
            to="/irrigation"
            className="press-card-interactive p-5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#161922]/10">
              <span className="font-mono text-xs font-bold text-[#585c6d] uppercase tracking-wider">
                {t('Soil Moisture')}
              </span>
              <div className="w-8 h-8 rounded-full border-1.5 border-[#161922] bg-[#f4efe6] flex items-center justify-center">
                <Droplets size={16} className="text-[#2b2f8f]" strokeWidth={2.5} />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl sm:text-4xl font-black text-[#161922] tracking-tight mb-2">
                {irrigation.soilMoisture}%
              </div>
              <SoilMoistureBar value={irrigation.soilMoisture} />
            </div>
          </Link>
        </div>
      </div>

      {/* Main Alert Banner */}
      {mainAlert && (
        <div className="p-5 sm:p-6 rounded-[22px] border-2 border-[#161922] bg-[#fff5f2] shadow-[4px_4px_0_#ff5a36] flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#ff5a36] text-white border-2 border-[#161922] flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <AlertTriangle size={18} strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-black text-base text-[#161922]">
                {t(mainAlert.title)}
              </span>
              <p className="text-sm text-[#161922] font-semibold mt-1">
                {t(mainAlert.message)}
              </p>
              <p className="text-xs sm:text-sm font-bold text-[#2b2f8f] mt-2 flex items-center gap-1.5">
                <CheckCircle2 size={15} strokeWidth={2.5} className="shrink-0" />
                <span>{t(mainAlert.actionRequired)}</span>
              </p>
            </div>
          </div>
          <Link
            to="/alerts"
            className="press-btn text-xs font-bold shrink-0 self-start sm:self-auto"
          >
            <span>{t('All alerts')} ({alerts.length}) →</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
