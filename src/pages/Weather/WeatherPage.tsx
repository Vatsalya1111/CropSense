import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { weatherService } from '../../services';
import { WeatherData } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  CloudSun,
  Droplet,
  Wind,
  CloudRain,
  Thermometer,
  Sun,
  SunMedium,
  CloudLightning,
  Cloud,
} from 'lucide-react';

export const WeatherPage: React.FC = () => {
  const { settings } = useApp();
  const [data, setData] = useState<WeatherData | null>(null);

  useEffect(() => {
    weatherService.getWeatherData(settings.activeScenario).then(setData);
  }, [settings.activeScenario]);

  if (!data) {
    return <div className="p-16 text-center text-stone-500 font-medium">Checking weather forecast...</div>;
  }

  const { current, forecast } = data;
  const isDrySpell = settings.activeScenario === 'dry_spell';

  const renderWeatherIcon = (iconName: string, size = 20) => {
    switch (iconName) {
      case 'Sun':
        return <Sun size={size} className="text-amber-500" />;
      case 'SunMedium':
        return <SunMedium size={size} className="text-amber-500" />;
      case 'CloudRain':
        return <CloudRain size={size} className="text-sky-600" />;
      case 'CloudLightning':
        return <CloudLightning size={size} className="text-sky-700" />;
      case 'Cloud':
        return <Cloud size={size} className="text-stone-500" />;
      default:
        return <CloudSun size={size} className="text-amber-500" />;
    }
  };

  const getRainIntensityLabel = (rainfallMm: number) => {
    if (rainfallMm >= 25) return 'Heavy Rain';
    if (rainfallMm >= 10) return 'Moderate Rain';
    if (rainfallMm > 0) return 'Light Showers';
    return 'No Rain';
  };

  return (
    <div className="space-y-7 max-w-5xl mx-auto">
      {/* Question Header */}
      <div className="page-heading">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-800 uppercase tracking-wider mb-0.5">
          <CloudSun size={14} className="text-sky-700" />
          <span>Weather & Forecast</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          What Is the Weather Going to Do?
        </h2>
        <p className="text-sm text-stone-600 mt-1">
          Simple rain risk and field temperatures for Rampur village over the next 5 days.
        </p>
      </div>

      {/* HERO WEATHER OVERVIEW */}
      <div
        className={`p-6 sm:p-7 rounded-3xl border-2 transition-all shadow-sm ${
          isDrySpell
            ? 'bg-amber-50/80 border-amber-300 text-stone-900'
            : 'bg-sky-50/80 border-sky-300 text-stone-900'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-5 border-b border-stone-200/60">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                isDrySpell ? 'bg-amber-200' : 'bg-sky-200'
              }`}
            >
              {renderWeatherIcon(current.icon, 36)}
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-black text-stone-900 tracking-tight">
                {current.temperature}°C
              </div>
              <p className="text-base sm:text-lg font-bold text-stone-800 mt-0.5">
                {current.weatherCondition}
              </p>
            </div>
          </div>

          <div
            className={`p-3.5 rounded-xl border text-xs sm:text-sm font-bold self-start sm:self-auto flex items-center gap-1.5 ${
              isDrySpell
                ? 'bg-white/90 border-amber-200 text-amber-950'
                : 'bg-white/90 border-sky-200 text-sky-950'
            }`}
          >
            {isDrySpell ? (
              <>
                <Sun size={16} className="text-amber-500 shrink-0" />
                <span>0% Rain Risk Today</span>
              </>
            ) : (
              <>
                <CloudRain size={16} className="text-sky-600 shrink-0" />
                <span>Heavy Rain Expected Tomorrow</span>
              </>
            )}
          </div>
        </div>

        {/* Farmer-friendly Impact Note */}
        <div className="py-4 border-b border-stone-200/60 text-xs sm:text-sm font-medium text-stone-800 leading-relaxed">
          {isDrySpell
            ? 'Daytime heat will peak at 36°C with dry winds. Soil will lose moisture rapidly. Complete field work in the morning.'
            : 'A heavy rain storm is expected tomorrow (~42 mm rain). Make sure field ditches are open so standing water does not harm crop roots.'}
        </div>

        {/* 4 Supporting Metrics in Clean Grid */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-white/90 rounded-xl border border-stone-200/80">
            <div className="flex items-center justify-center gap-1.5 text-stone-500 text-xs mb-0.5">
              <Droplet size={14} className="text-sky-600" />
              <span>Humidity</span>
            </div>
            <div className="text-lg font-black text-stone-900">{current.humidity}%</div>
          </div>

          <div className="p-3 bg-white/90 rounded-xl border border-stone-200/80">
            <div className="flex items-center justify-center gap-1.5 text-stone-500 text-xs mb-0.5">
              <CloudRain size={14} className="text-sky-600" />
              <span>Rain Today</span>
            </div>
            <div className="text-lg font-black text-stone-900">{current.rainfall} mm</div>
          </div>

          <div className="p-3 bg-white/90 rounded-xl border border-stone-200/80">
            <div className="flex items-center justify-center gap-1.5 text-stone-500 text-xs mb-0.5">
              <Wind size={14} className="text-stone-600" />
              <span>Wind Speed</span>
            </div>
            <div className="text-lg font-black text-stone-900">{current.windSpeed} km/h</div>
          </div>

          <div className="p-3 bg-white/90 rounded-xl border border-stone-200/80">
            <div className="flex items-center justify-center gap-1.5 text-stone-500 text-xs mb-0.5">
              <Thermometer size={14} className="text-amber-600" />
              <span>Feels Like</span>
            </div>
            <div className="text-lg font-black text-stone-900">{current.feelsLike}°C</div>
          </div>
        </div>
      </div>

      {/* 5-DAY SIMPLE FORECAST TABLE */}
      <Card title="5-Day Rain & Weather Outlook" subtitle="Know when rain is coming this week">
        <div className="divide-y divide-stone-100">
          {forecast.map((day) => {
            const intensity = getRainIntensityLabel(day.expectedRainfall);
            return (
              <div key={day.date} className="py-4 flex items-center justify-between text-sm gap-2 sm:gap-4">
                <div className="w-28 font-bold text-stone-900 flex items-center gap-2 shrink-0">
                  {renderWeatherIcon(day.icon, 20)}
                  <span>{day.dayName}</span>
                </div>

                <div className="flex-1 text-xs text-stone-600 truncate hidden sm:block">
                  {day.weatherCondition}
                </div>

                <div className="text-xs font-bold text-sky-800 text-right sm:text-center w-36 shrink-0">
                  <span>{day.rainProbability}% Rain</span>
                  {day.expectedRainfall > 0 && (
                    <span className="block text-[11px] font-semibold text-stone-500">
                      {day.expectedRainfall} mm • {intensity}
                    </span>
                  )}
                </div>

                <div className="font-bold text-stone-900 text-right w-16 shrink-0">
                  {day.tempMax}° / {day.tempMin}°
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default WeatherPage;
