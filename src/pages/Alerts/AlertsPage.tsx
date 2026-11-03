import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { alertService } from '../../services';
import { Alert } from '../../types';
import { Flame, CloudRain, Droplets, Bug, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useI18n } from '../../i18n';

export const AlertsPage: React.FC = () => {
  const { t } = useI18n();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    alertService.getAlerts().then(setAlerts).catch(() => setError('Alerts are unavailable. Start the CropSense API and try again.'));
  }, [t]);

  if (error) return <div className="p-16 text-center text-red-700">{t(error)}</div>;

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'extreme_heat':
        return <Flame size={24} className="text-amber-600" />;
      case 'heavy_rainfall':
        return <CloudRain size={24} className="text-sky-600" />;
      case 'low_soil_moisture':
        return <Droplets size={24} className="text-amber-600" />;
      case 'disease_pest_risk':
        return <Bug size={24} className="text-amber-600" />;
      case 'crop_health_deterioration':
      default:
        return <AlertTriangle size={24} className="text-red-600" />;
    }
  };

  const getActionBullets = (alert: Alert): string[] => {
    const parts = alert.actionRequired.split(/[.;]+/).map((part) => part.trim()).filter(Boolean);
    return parts.length ? parts : [alert.actionRequired];
  };

  return (
    <div className="space-y-7 max-w-5xl mx-auto">
      {/* Question Header */}
      <div className="page-heading">
        <div className="flex items-center gap-2 text-xs font-semibold text-red-800 uppercase tracking-wider mb-0.5">
          <AlertTriangle size={14} className="text-red-700" />
          <span>{t('Priority Warnings')}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          {t('Is There Any Danger to My Crop?')}
        </h2>
        <p className="text-sm text-stone-600 mt-1">
          {t('High-priority weather and field warnings that require your attention today.')}
        </p>
      </div>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <Card>
            <div className="text-center py-10">
              <CheckCircle2 size={36} className="mx-auto text-emerald-600 mb-2" />
              <h3 className="font-bold text-stone-900 text-lg">{t('All Clear in Your Field')}</h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-sm mx-auto">
                {t('No extreme weather or crop hazards detected for your crop today.')}
              </p>
            </div>
          </Card>
        ) : (
          alerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            const actionBullets = getActionBullets(alert);
            return (
              <div
                key={alert.id}
                className={`p-5 sm:p-6 rounded-3xl border-2 transition-all shadow-sm ${
                  isCritical
                    ? 'bg-red-50/80 border-red-300 text-stone-900'
                    : 'bg-amber-50/80 border-amber-300 text-stone-900'
                }`}
              >
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-200/60">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`p-2.5 rounded-2xl shrink-0 mt-0.5 ${
                        isCritical ? 'bg-red-200 text-red-950' : 'bg-amber-200 text-amber-950'
                      }`}
                    >
                      {getAlertIcon(alert.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                            isCritical ? 'bg-red-200 text-red-950' : 'bg-amber-200 text-amber-950'
                          }`}
                        >
                          {isCritical ? t('Critical Warning') : t('Notice')}
                        </span>
                        <span className="text-xs text-stone-600 font-medium">{alert.timestamp}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-stone-900 mt-1 uppercase tracking-tight">
                        {alert.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* What is happening (one-line plain explanation) */}
                <div className="mt-3.5">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-0.5">
                    {t('What is happening:')}
                  </span>
                  <p className="text-sm sm:text-base text-stone-800 font-medium leading-relaxed">
                    {alert.message}
                  </p>
                </div>

                {/* 2-4 Action Bullets */}
                <div className="mt-4 p-4 bg-white/95 rounded-xl border border-stone-200/80 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs font-black text-emerald-900 uppercase tracking-wider mb-2.5">
                    <CheckCircle2 size={16} className="text-emerald-700" />
                    <span>{t('What You Should Do Today:')}</span>
                  </div>
                  <ul className="space-y-2">
                    {actionBullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-stone-950 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-700 mt-1.5 shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
