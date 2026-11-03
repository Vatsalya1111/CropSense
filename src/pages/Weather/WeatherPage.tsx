import React, { useEffect, useState } from 'react';
import { CloudSun, CloudRain, Droplet, Wind, Thermometer, Sun, Cloud } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { DataSourceNotice } from '../../components/common/DataSourceNotice';
import { weatherService } from '../../services';
import { WeatherData } from '../../types';
import { useI18n } from '../../i18n';

function iconFor(name: string, size = 20) {
  if (name.includes('Rain') || name.includes('Lightning')) return <CloudRain size={size} className="text-sky-600" />;
  if (name === 'Cloud') return <Cloud size={size} className="text-stone-500" />;
  if (name.includes('Sun')) return <Sun size={size} className="text-amber-500" />;
  return <CloudSun size={size} className="text-sky-600" />;
}

export const WeatherPage: React.FC = () => {
  const { t } = useI18n();
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    weatherService.getWeatherData().then(setData).catch(() => setError('Weather data is unavailable. Start the CropSense API and try again.'));
  }, [t]);

  if (error) return <div className="p-16 text-center text-red-700">{t(error)}</div>;
  if (!data) return <div className="p-16 text-center text-stone-500 font-medium">{t('Checking weather forecast...')}</div>;

  const { current, forecast } = data;
  const rainy = current.rainProbability >= 50;
  return (
    <div className="space-y-7 max-w-5xl mx-auto">
      <div className="page-heading">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-800 uppercase tracking-wider mb-0.5"><CloudSun size={14} /><span>{t('Weather & Forecast')}</span></div>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">{t('What Is the Weather Going to Do?')}</h2>
        <p className="text-sm text-stone-600 mt-1">{t('Current conditions and a five-day outlook for your farm.')}</p>
      </div>
      <DataSourceNotice source={data.dataSource} isFallback={data.isFallback} />
      <div className={`p-6 sm:p-7 rounded-3xl border-2 shadow-sm ${rainy ? 'bg-sky-50/80 border-sky-300' : 'bg-amber-50/80 border-amber-300'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-5 border-b border-stone-200/60">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${rainy ? 'bg-sky-200' : 'bg-amber-200'}`}>{iconFor(current.icon, 36)}</div>
            <div><div className="text-4xl sm:text-5xl font-black text-stone-900">{current.temperature}°C</div><p className="text-lg font-bold text-stone-800">{t(current.weatherCondition)}</p></div>
          </div>
          <div className="p-3.5 rounded-xl border bg-white/90 text-sm font-bold text-stone-900 flex items-center gap-2">
            {rainy ? <CloudRain size={16} className="text-sky-600" /> : <Sun size={16} className="text-amber-500" />}
            <span>{current.rainProbability}% {t('rain probability today')}</span>
          </div>
        </div>
        <div className="py-4 border-b border-stone-200/60 text-sm font-medium text-stone-800">
          {forecast[1] ? `${t(forecast[1].weatherCondition)} ${t('is forecast tomorrow with')} ${forecast[1].expectedRainfall} ${t('mm expected rainfall.')}` : t('Check the forecast before planning field work.')}
        </div>
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {[
            ['Humidity', `${current.humidity}%`, <Droplet size={14} />],
            ['Rain today', `${current.rainfall} mm`, <CloudRain size={14} />],
            ['Wind speed', `${current.windSpeed} km/h`, <Wind size={14} />],
            ['Feels like', `${current.feelsLike}°C`, <Thermometer size={14} />],
          ].map(([label, value, icon]) => <div key={String(label)} className="p-3 bg-white/90 rounded-xl border border-stone-200/80"><div className="flex items-center justify-center gap-1.5 text-stone-500 text-xs">{icon}{t(String(label))}</div><div className="text-lg font-black text-stone-900">{value}</div></div>)}
        </div>
      </div>
      <Card title={t('5-Day Weather Outlook')} subtitle={t('Forecast values are updated from the weather source')}>
        <div className="divide-y divide-stone-100">{forecast.map((day) => <div key={day.date} className="py-4 flex items-center justify-between gap-3 text-sm"><div className="w-28 font-bold text-stone-900 flex items-center gap-2">{iconFor(day.icon)}<span>{t(day.dayName)}</span></div><div className="flex-1 text-xs text-stone-600 hidden sm:block">{t(day.weatherCondition)}</div><div className="text-xs font-bold text-sky-800 text-right">{day.rainProbability}% {t('rain')}<span className="block text-stone-500">{day.expectedRainfall} mm</span></div><div className="font-bold text-stone-900 text-right">{day.tempMax}° / {day.tempMin}°</div></div>)}</div>
      </Card>
    </div>
  );
};

export default WeatherPage;
