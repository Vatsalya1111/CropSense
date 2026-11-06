import React, { useEffect, useState } from 'react';
import { CloudSun, CloudRain, Droplet, Wind, Thermometer, Sun, Cloud } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { DataSourceNotice } from '../../components/common/DataSourceNotice';
import { weatherService } from '../../services';
import { WeatherData } from '../../types';
import { useI18n } from '../../i18n';

function iconFor(name: string, size = 20) {
  if (name.includes('Rain') || name.includes('Lightning')) return <CloudRain size={size} className="text-[#2b2f8f]" strokeWidth={2.3} />;
  if (name === 'Cloud') return <Cloud size={size} className="text-[#585c6d]" strokeWidth={2.3} />;
  if (name.includes('Sun')) return <Sun size={size} className="text-[#ff5a36]" strokeWidth={2.3} />;
  return <CloudSun size={size} className="text-[#2b2f8f]" strokeWidth={2.3} />;
}

export const WeatherPage: React.FC = () => {
  const { t } = useI18n();
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    weatherService.getWeatherData().then(setData).catch(() => setError('Weather data is unavailable. Start the CropSense API and try again.'));
  }, [t]);

  if (error) {
    return (
      <div className="p-16 text-center">
        <div className="inline-block p-6 rounded-2xl border-2 border-[#161922] bg-[#fff1e8] text-[#c32a10] shadow-[4px_4px_0_#161922] font-mono text-sm font-bold">
          {t(error)}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-16 text-center">
        <div className="inline-block p-4 rounded-full border-2 border-[#161922] bg-[#fdfbf7] shadow-[3px_3px_0_#161922] font-mono text-sm font-bold animate-pulse">
          {t('Checking weather forecast...')}
        </div>
      </div>
    );
  }

  const { current, forecast } = data;
  const rainy = current.rainProbability >= 50;

  return (
    <div className="space-y-7 max-w-5xl mx-auto animate-print-hit">
      <div className="page-heading">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#2b2f8f] uppercase tracking-wider mb-1">
          <CloudSun size={14} strokeWidth={2.5} />
          <span>{t('Weather & Forecast')}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[#161922] tracking-tight">
          {t('What is the weather going to do?')}
        </h2>
        <p className="text-sm text-[#585c6d] mt-1 font-medium">
          {t('Current conditions and a five-day outlook for your farm.')}
        </p>
      </div>

      <DataSourceNotice source={data.dataSource} isFallback={data.isFallback} />

      {/* Main Meteorological Card */}
      <div className="p-6 sm:p-8 rounded-[24px] border-2 border-[#161922] bg-[#fdfbf7] shadow-[5px_5px_0_#161922]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b-2 border-[#161922]/10">
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-2xl border-2 border-[#161922] shadow-[2px_2px_0_#161922] flex items-center justify-center shrink-0 ${
              rainy ? 'bg-[#b6ff2e]' : 'bg-[#fff1e8]'
            }`}>
              {iconFor(current.icon, 34)}
            </div>
            <div>
              <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#161922] tracking-tight">
                {current.temperature}°C
              </div>
              <p className="text-lg font-extrabold text-[#161922] mt-0.5">
                {t(current.weatherCondition)}
              </p>
            </div>
          </div>
          <div className="px-4 py-2.5 rounded-full border-2 border-[#161922] bg-[#f4efe6] shadow-[2px_2px_0_#161922] text-xs sm:text-sm font-bold font-mono text-[#161922] flex items-center gap-2 self-start sm:self-auto uppercase tracking-wide">
            {rainy ? <CloudRain size={16} className="text-[#2b2f8f]" strokeWidth={2.5} /> : <Sun size={16} className="text-[#ff5a36]" strokeWidth={2.5} />}
            <span>{current.rainProbability}% {t('rain probability today')}</span>
          </div>
        </div>

        <div className="py-4 border-b-2 border-[#161922]/10 text-sm font-bold text-[#161922] leading-relaxed">
          {forecast[1]
            ? `${t(forecast[1].weatherCondition)} ${t(forecast[1].weatherCondition === 'Rain showers' ? 'are forecast tomorrow with' : 'is forecast tomorrow with')} ${forecast[1].expectedRainfall} ${t('mm expected rainfall.')}`
            : t('Check the forecast before planning field work.')}
        </div>

        <div className="pt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {[
            ['Humidity', `${current.humidity}%`, <Droplet size={14} className="text-[#2b2f8f]" strokeWidth={2.5} />],
            ['Rained so far', `${current.rainfall} mm`, <CloudRain size={14} className="text-[#2b2f8f]" strokeWidth={2.5} />],
            ['Wind speed', `${current.windSpeed} km/h`, <Wind size={14} className="text-[#585c6d]" strokeWidth={2.5} />],
            ['Feels like', `${current.feelsLike}°C`, <Thermometer size={14} className="text-[#ff5a36]" strokeWidth={2.5} />],
          ].map(([label, value, icon]) => (
            <div key={String(label)} className="p-3.5 bg-[#f4efe6] rounded-[18px] border-2 border-[#161922] shadow-[2px_2px_0_#161922]">
              <div className="flex items-center justify-center gap-1.5 font-mono text-xs font-bold text-[#585c6d] uppercase tracking-wider">
                {icon}
                <span>{t(String(label))}</span>
              </div>
              <div className="text-xl font-black text-[#161922] mt-1 tracking-tight font-mono">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5-Day Weather Outlook */}
      <Card
        title={t('5-Day Weather Outlook')}
        subtitle={t('Forecast values are updated from the weather source')}
      >
        <div className="divide-y-2 divide-[#161922]/10">
          {forecast.map((day) => (
            <div key={day.date} className="py-3.5 flex items-center justify-between gap-3 text-sm transition-colors hover:bg-[#f4efe6]/50 rounded-xl px-2">
              <div className="w-32 font-bold text-[#161922] flex items-center gap-2.5">
                {iconFor(day.icon, 18)}
                <span className="font-extrabold">{t(day.dayName)}</span>
              </div>
              <div className="flex-1 text-xs text-[#585c6d] font-semibold hidden sm:block">
                {t(day.weatherCondition)}
              </div>
              <div className="font-mono text-xs font-bold text-[#2b2f8f] text-right">
                {day.rainProbability}% {t('rain')}
                <span className="block text-[#585c6d] font-normal">{day.expectedRainfall} mm</span>
              </div>
              <div className="font-mono font-bold text-[#161922] text-right">
                {day.tempMax}° / {day.tempMin}°
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default WeatherPage;
