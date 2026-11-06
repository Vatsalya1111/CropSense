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

  if (error) {
    return (
      <div className="p-16 text-center">
        <div className="inline-block p-6 rounded-2xl border-2 border-[#161922] bg-[#fff1e8] text-[#c32a10] shadow-[4px_4px_0_#161922] font-mono text-sm font-bold">
          {t(error)}
        </div>
      </div>
    );
  }

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'extreme_heat':
        return <Flame size={22} className="text-[#ff5a36]" strokeWidth={2.5} />;
      case 'heavy_rainfall':
        return <CloudRain size={22} className="text-[#2b2f8f]" strokeWidth={2.5} />;
      case 'low_soil_moisture':
        return <Droplets size={22} className="text-[#ff5a36]" strokeWidth={2.5} />;
      case 'disease_pest_risk':
        return <Bug size={22} className="text-[#f59e0b]" strokeWidth={2.5} />;
      case 'crop_health_deterioration':
      default:
        return <AlertTriangle size={22} className="text-[#ff5a36]" strokeWidth={2.5} />;
    }
  };

  const getActionBullets = (alert: Alert): string[] => {
    const parts = alert.actionRequired.split(/[.;]+/).map((part) => part.trim()).filter(Boolean);
    return parts.length ? parts : [alert.actionRequired];
  };

  return (
    <div className="space-y-7 max-w-5xl mx-auto animate-print-hit">
      {/* Question Header */}
      <div className="page-heading">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#ff5a36] uppercase tracking-wider mb-1">
          <AlertTriangle size={14} strokeWidth={2.5} />
          <span>{t('Priority Warnings')}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[#161922] tracking-tight">
          {t('Is There Any Danger to My Crop?')}
        </h2>
        <p className="text-sm text-[#585c6d] mt-1 font-medium">
          {t('High-priority weather and field warnings that require your attention today.')}
        </p>
      </div>

      <div className="space-y-5">
        {alerts.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <div className="w-14 h-14 rounded-full border-2 border-[#161922] bg-[#b6ff2e] text-[#161922] shadow-[3px_3px_0_#161922] flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={30} strokeWidth={2.5} />
              </div>
              <h3 className="font-black text-[#161922] text-xl">{t('All Clear in Your Field')}</h3>
              <p className="text-sm text-[#585c6d] mt-1.5 max-w-sm mx-auto font-medium">
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
                className={`p-6 sm:p-7 rounded-[24px] border-2 border-[#161922] transition-all ${
                  isCritical
                    ? 'bg-[#fff5f2] shadow-[5px_5px_0_#ff5a36]'
                    : 'bg-[#fffdf5] shadow-[5px_5px_0_#f59e0b]'
                }`}
              >
                <div className="flex items-start justify-between gap-3 pb-4 border-b-2 border-[#161922]/10">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl border-2 border-[#161922] flex items-center justify-center shrink-0 shadow-[2px_2px_0_#161922] mt-0.5 ${
                        isCritical ? 'bg-[#ff5a36]/20' : 'bg-[#f59e0b]/20'
                      }`}
                    >
                      {getAlertIcon(alert.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span
                          className={`px-3 py-0.5 rounded-full font-mono text-xs font-black uppercase tracking-wider border-1.5 border-[#161922] shadow-xs ${
                            isCritical ? 'bg-[#ff5a36] text-white' : 'bg-[#f59e0b] text-[#161922]'
                          }`}
                        >
                          {isCritical ? t('Critical Warning') : t('Notice')}
                        </span>
                        <span className="font-mono text-xs text-[#585c6d] font-bold uppercase">{alert.timestamp}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-[#161922] mt-1.5 tracking-tight">
                        {alert.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* What is happening */}
                <div className="mt-4">
                  <span className="font-mono text-[11px] font-bold text-[#585c6d] uppercase tracking-wider block mb-1">
                    {t('What is happening:')}
                  </span>
                  <p className="text-sm sm:text-base text-[#161922] font-semibold leading-relaxed">
                    {alert.message}
                  </p>
                </div>

                {/* Action Bullets */}
                <div className="mt-4 p-4 sm:p-5 bg-[#fdfbf7] rounded-[18px] border-2 border-[#161922] shadow-[2px_2px_0_#161922]">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-black text-[#2b2f8f] uppercase tracking-wider mb-3">
                    <CheckCircle2 size={16} strokeWidth={2.5} />
                    <span>{t('What You Should Do Today:')}</span>
                  </div>
                  <ul className="space-y-2.5">
                    {actionBullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-[#161922] font-bold">
                        <span className="w-2 h-2 rounded-full bg-[#2b2f8f] mt-2 shrink-0" />
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
