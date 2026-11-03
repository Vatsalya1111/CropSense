import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Calendar, CheckCircle2, CloudRain, Droplets, MapPin, Sprout, Sun } from 'lucide-react';
import { useI18n } from '../../i18n';
import { weatherService, cropHealthService, irrigationService, alertService, farmService } from '../../services';
import { WeatherData, CropHealth, IrrigationRecommendation, Alert, Farm, Farmer } from '../../types';

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
      farmService.getFarmer(), farmService.getFarm(), weatherService.getWeatherData(),
      cropHealthService.getCropHealth(), irrigationService.getIrrigationRecommendation(), alertService.getAlerts(),
    ]).then(([f, fm, w, c, i, al]) => {
      if (!mounted) return;
      setFarmer(f); setFarm(fm); setWeather(w); setCropHealth(c); setIrrigation(i); setAlerts(al);
    }).catch(() => {
      if (mounted) setError('Farm insights are unavailable. Start the CropSense API and try again.');
    }).finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [t]);

  if (loading) return <div className="p-16 text-center text-stone-500 font-medium">{t('Loading your farm overview...')}</div>;
  if (error || !weather || !cropHealth || !irrigation) return <div className="p-16 text-center text-red-700">{t(error || 'Farm insights are unavailable.')}</div>;

  const needsWater = irrigation.irrigationStatus === 'Irrigate immediately';
  const moistureLabel = irrigation.soilMoisture < 25 ? 'Low moisture' : irrigation.soilMoisture > 50 ? 'Very wet' : 'Moderate moisture';
  const mainAlert = alerts[0];
  return (
    <div className="space-y-7 max-w-5xl mx-auto">
      <div className="dashboard-welcome flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div><h2 className="text-2xl sm:text-3xl font-black text-stone-900">{t('Good morning,')} {farmer?.name.split(' ')[0] || t('Farmer')}</h2><p className="text-sm text-stone-600 mt-0.5 flex items-center gap-1.5"><MapPin size={14} className="text-emerald-700" /><span>{farm?.name} · {farm?.location.village}, {farm?.location.district}</span></p></div>
        {farm && <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 text-xs text-stone-700 font-semibold border border-stone-200"><Calendar size={13} className="text-emerald-700" /><span>{t(farm.crop)} · {farm.area} {t(farm.areaUnit)}</span></div>}
      </div>

      <div className="relative rounded-3xl overflow-hidden shadow-sm border border-stone-200 bg-emerald-950"><img src="/images/wheat-field-hero.svg" alt={t('Farm field')} className="w-full h-44 sm:h-52 object-cover opacity-90" /><div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent flex flex-col justify-end p-5 sm:p-7 text-white"><span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">{farm?.name} · {t('Current conditions')}</span><p className="text-lg sm:text-xl font-bold mt-0.5">{t(weather.current.weatherCondition)} · {weather.current.temperature}°C · {weather.current.rainProbability}% {t('rain probability')}</p></div></div>

      <div className={`p-6 sm:p-7 rounded-3xl border-2 shadow-sm ${needsWater ? 'bg-amber-50/90 border-amber-300' : 'bg-sky-50/90 border-sky-300'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5"><div className="space-y-2"><span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-white/80">{t('Model recommendation')}</span><h3 className="text-2xl sm:text-3xl font-black">{t(irrigation.irrigationStatus)}</h3><p className="text-sm sm:text-base text-stone-800 font-medium max-w-2xl">{t(irrigation.reason)}</p><p className="text-sm text-stone-800">{t(irrigation.recommendedAction)}</p></div><Link to="/irrigation" className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm text-white bg-emerald-800 hover:bg-emerald-900"><span>{t('View irrigation details')}</span><ArrowRight size={16} /></Link></div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs"><span className="px-2.5 py-1 rounded-full bg-white/80 border">{t('Weather')}: {t(weather.dataSource)}</span><span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900">{t('Soil Moisture')}: {t('Estimated input')}</span><span className="px-2.5 py-1 rounded-full bg-white/80 border">{t('Prediction')}: {irrigation.modelVersion}</span></div>
      </div>

      <div className="space-y-3"><h4 className="font-bold text-stone-500 text-xs tracking-wider uppercase">{t('Current Field Conditions')}</h4><div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <Link to="/weather" className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 hover:border-emerald-300 shadow-sm"><div className="flex items-center justify-between"><span className="text-xs font-bold text-stone-500 uppercase">{t('Weather')}</span>{weather.current.rainProbability >= 50 ? <CloudRain size={20} className="text-sky-600" /> : <Sun size={20} className="text-amber-500" />}</div><div className="mt-3"><div className="text-3xl font-black">{weather.current.temperature}°C</div><div className="text-sm font-bold mt-0.5">{t(weather.current.weatherCondition)}</div><p className="text-xs text-stone-600 mt-1">{weather.current.rainProbability}% {t('rain probability')}</p></div></Link>
        <Link to="/crop-health" className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 hover:border-emerald-300 shadow-sm"><div className="flex items-center justify-between"><span className="text-xs font-bold text-stone-500 uppercase">{t('Crop Risk')}</span><Sprout size={20} className="text-emerald-700" /></div><div className="mt-3"><div className="text-2xl font-black">{t(cropHealth.overallHealth)}</div><div className="text-sm font-bold mt-0.5">{cropHealth.healthScore}/100 {t('score')}</div><p className="text-xs text-stone-600 mt-1">{t(cropHealth.observation)}</p></div></Link>
        <Link to="/irrigation" className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 hover:border-emerald-300 shadow-sm"><div className="flex items-center justify-between"><span className="text-xs font-bold text-stone-500 uppercase">{t('Soil Moisture')}</span><Droplets size={20} className="text-sky-600" /></div><div className="mt-3"><div className="text-3xl font-black">{irrigation.soilMoisture}%</div><div className="text-sm font-bold mt-0.5">{t(moistureLabel)}</div><div className="w-full h-2 bg-stone-100 rounded-full mt-2.5 overflow-hidden"><div className="h-full bg-emerald-600 transition-[width] duration-700" style={{ width: `${Math.min(100, irrigation.soilMoisture * 1.5)}%` }} /></div><p className="text-[11px] text-amber-800 mt-1">{t('Estimated')} · {t('no sensor connected')}</p></div></Link>
      </div></div>

      {mainAlert && <div className="p-4 sm:p-5 rounded-2xl border flex items-start justify-between gap-3 bg-amber-50 border-amber-200"><div className="flex items-start gap-3"><AlertTriangle size={22} className="text-amber-600 shrink-0 mt-0.5" /><div><span className="font-bold text-sm">{t(mainAlert.title)}</span><p className="text-sm text-stone-800 mt-1">{t(mainAlert.message)}</p><p className="text-sm font-bold mt-1.5 flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-700" />{t(mainAlert.actionRequired)}</p></div></div><Link to="/alerts" className="text-xs font-bold text-emerald-800 hover:underline shrink-0">{t('All alerts')} ({alerts.length}) →</Link></div>}
    </div>
  );
};

export default DashboardPage;
