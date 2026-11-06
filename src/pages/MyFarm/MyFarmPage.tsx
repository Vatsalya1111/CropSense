import React, { FormEvent, useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { farmService } from '../../services';
import { notifyProfileSaved } from '../../services/farmService';
import { FarmProfile } from '../../types';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import L, { LeafletMouseEvent } from 'leaflet';
import { MapPin, Save, Tractor } from 'lucide-react';
import { useI18n } from '../../i18n';
import { useApp } from '../../context/AppContext';

delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const CROP_OPTIONS = ['Ragi', 'Paddy', 'Maize', 'Jowar', 'Bajra', 'Groundnut', 'Sugarcane', 'Cotton', 'Red gram', 'Other'];
const STAGE_OPTIONS = ['Land preparation', 'Sowing', 'Seedling', 'Vegetative', 'Flowering', 'Grain filling', 'Maturity', 'Harvesting', 'Other'];
const SOIL_OPTIONS = ['Red soil', 'Black soil', 'Sandy', 'Sandy Loam', 'Loam', 'Clay', 'Laterite', 'Alluvial', 'Other'];
const IRRIGATION_OPTIONS = ['Rainfed', 'Drip', 'Sprinkler', 'Furrow', 'Flood', 'Canal', 'Borewell', 'Other'];
const KARNATAKA_CENTER: [number, number] = [15.3173, 75.7139];

interface FarmForm {
  farmerName: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  preferredLanguage: 'en' | 'hi';
  farmName: string;
  latitude: string;
  longitude: string;
  elevationM: string;
  area: string;
  areaUnit: 'acres' | 'hectares';
  crop: string;
  cropStage: string;
  soilType: string;
  irrigationType: string;
}

const EMPTY_FORM: FarmForm = {
  farmerName: '', phone: '', village: '', district: '', state: 'Karnataka', preferredLanguage: 'en',
  farmName: 'My farm', latitude: '', longitude: '', elevationM: '0', area: '', areaUnit: 'acres',
  crop: '', cropStage: '', soilType: '', irrigationType: '',
};

function formFromProfile(profile: FarmProfile): FarmForm {
  if (!profile.configured || !profile.farmer || !profile.farm) return EMPTY_FORM;
  return {
    farmerName: profile.farmer.name,
    phone: profile.farmer.phone || '',
    village: profile.farm.location.village,
    district: profile.farm.location.district,
    state: profile.farm.location.state,
    preferredLanguage: profile.farmer.preferredLanguage === 'hi' ? 'hi' : 'en',
    farmName: profile.farm.name,
    latitude: String(profile.farm.location.lat),
    longitude: String(profile.farm.location.lng),
    elevationM: String(profile.farm.location.elevationM ?? 0),
    area: String(profile.farm.area),
    areaUnit: profile.farm.areaUnit,
    crop: profile.farm.crop,
    cropStage: profile.farm.cropStage,
    soilType: profile.farm.soilType,
    irrigationType: profile.farm.irrigationType,
  };
}

interface MyFarmPageProps {
  onSaved?: () => void;
}

interface MapClickPickerProps {
  onChoose: (event: LeafletMouseEvent) => void;
}

const MapClickPicker: React.FC<MapClickPickerProps> = ({ onChoose }) => {
  useMapEvents({ click: onChoose });
  return null;
};

export const MyFarmPage: React.FC<MyFarmPageProps> = ({ onSaved }) => {
  const { t } = useI18n();
  const { settings } = useApp();
  const [form, setForm] = useState<FarmForm>(EMPTY_FORM);
  const [configured, setConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    farmService.getProfile()
      .then((profile) => {
        setConfigured(profile.configured);
        setForm(formFromProfile(profile));
      })
      .catch(() => setError(t('Could not load your profile. Please refresh and try again.')))
      .finally(() => setLoading(false));
  }, [t]);

  const setField = (key: keyof FarmForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setSavedMessage(false);
  };

  const phoneIsValid = /^\+91 ?[6-9]\d{4} ?\d{5}$/.test(form.phone.trim());

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!phoneIsValid) {
      setError(t('Enter a valid Indian mobile number with +91 and 10 digits.'));
      return;
    }
    setSaving(true);
    setError(null);
    setSavedMessage(false);
    try {
      const profile = await farmService.saveProfile({
        farmer: {
          name: form.farmerName.trim(),
          phone: form.phone.trim(),
          village: form.village.trim(),
          district: form.district.trim(),
          state: form.state.trim(),
          preferredLanguage: settings.language,
        },
        farm: {
          name: form.farmName.trim(),
          location: {
            lat: Number(form.latitude),
            lng: Number(form.longitude),
            elevationM: Number(form.elevationM || 0),
            village: form.village.trim(),
            district: form.district.trim(),
            state: form.state.trim(),
          },
          area: Number(form.area),
          areaUnit: form.areaUnit,
          crop: form.crop.trim(),
          cropStage: form.cropStage.trim(),
          soilType: form.soilType.trim(),
          irrigationType: form.irrigationType.trim(),
        },
      });
      setConfigured(profile.configured);
      setSavedMessage(true);
      notifyProfileSaved();
      onSaved?.();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : t('Could not save your profile. Please try again.'));
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'mt-1.5 w-full rounded-2xl border-2 border-[#161922] bg-[#fdfbf7] px-4 py-2.5 text-sm text-[#161922] shadow-[2px_2px_0_#161922] font-semibold focus:outline-none focus:ring-2 focus:ring-[#2b2f8f]';
  const labelClass = 'block font-mono text-xs font-bold uppercase tracking-wider text-[#161922]';
  const selectFarmOption = (field: 'crop' | 'cropStage' | 'soilType' | 'irrigationType', label: string, options: string[]) => {
    const value = form[field];
    const selection = options.includes(value) ? value : value ? 'Other' : '';
    return (
      <label className={labelClass} key={field}>
        {t(label)}
        <select
          className={inputClass}
          required
          value={selection}
          onChange={(event) => {
            const next = event.target.value;
            setField(field, next === 'Other' ? (selection === 'Other' ? value : '') : next);
          }}
        >
          <option value="" disabled>{t('Choose an option')}</option>
          {options.filter((option) => option !== 'Other').map((option) => <option key={option} value={option}>{t(option)}</option>)}
          <option value="Other">{t('Other')}</option>
        </select>
        {selection === 'Other' && (
          <input
            className={inputClass}
            required
            maxLength={100}
            placeholder={t('Enter details')}
            aria-label={`${t(label)}: ${t('Enter details')}`}
            value={value}
            onChange={(event) => setField(field, event.target.value)}
          />
        )}
      </label>
    );
  };
  const parsedLatitude = Number(form.latitude);
  const parsedLongitude = Number(form.longitude);
  const hasCoordinates = form.latitude !== '' && form.longitude !== '' && Number.isFinite(parsedLatitude) && Number.isFinite(parsedLongitude);
  const mapCenter: [number, number] = hasCoordinates ? [parsedLatitude, parsedLongitude] : KARNATAKA_CENTER;
  const markerPosition: [number, number] | null = hasCoordinates ? [parsedLatitude, parsedLongitude] : null;
  const chooseLocation = (latitude: number, longitude: number) => {
    setField('latitude', latitude.toFixed(6));
    setField('longitude', longitude.toFixed(6));
  };

  if (loading) return (
    <div className="p-16 text-center">
      <div className="inline-block p-4 rounded-full border-2 border-[#161922] bg-[#fdfbf7] shadow-[3px_3px_0_#161922] font-mono text-sm font-bold animate-pulse">
        {t('Loading your farm profile...')}
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-7 animate-print-hit">
      <div className="page-heading">
        <div className="mb-1 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#2b2f8f]">
          <Tractor size={14} strokeWidth={2.5} />
          <span>{t('Farm profile')}</span>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-[#161922] sm:text-4xl">
          {configured ? t('Update your farm details') : t('Set up your farm profile')}
        </h2>
        <p className="mt-1 text-sm text-[#585c6d] font-medium">
          {configured ? t('Keep your farmer and field information current for local forecasts and advice.') : t('Add your details to start receiving weather and crop guidance for your farm.')}
        </p>
      </div>

      {error && <div role="alert" className="rounded-2xl border-2 border-[#161922] bg-[#fff1e8] p-4 text-sm font-bold text-[#c32a10] shadow-[3px_3px_0_#161922]">{t(error)}</div>}
      {savedMessage && <div role="status" className="rounded-2xl border-2 border-[#161922] bg-[#f0f9db] p-4 text-sm font-bold text-[#161922] shadow-[3px_3px_0_#161922]">{t('Farm profile saved.')}</div>}

      <form onSubmit={save} className="space-y-6">
        <Card title={t('Farmer details')} subtitle={t('Your contact and home location')}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>{t('Farmer name')}<input className={inputClass} required maxLength={100} value={form.farmerName} onChange={(e) => setField('farmerName', e.target.value)} /></label>
            <label className={labelClass}>{t('Phone number')}<input className={inputClass} required maxLength={15} type="tel" inputMode="tel" placeholder="+91 98765 43210" pattern="\+91 ?[6-9][0-9]{4} ?[0-9]{5}" aria-describedby="phone-error" value={form.phone} onChange={(e) => setField('phone', e.target.value)} />{form.phone && !phoneIsValid && <span id="phone-error" className="mt-1 block font-mono text-xs font-bold text-[#c32a10]">{t('Enter a valid Indian mobile number with +91 and 10 digits.')}</span>}</label>
            <label className={labelClass}>{t('Village')}<input className={inputClass} required maxLength={100} value={form.village} onChange={(e) => setField('village', e.target.value)} /></label>
            <label className={labelClass}>{t('District')}<input className={inputClass} required maxLength={100} value={form.district} onChange={(e) => setField('district', e.target.value)} /></label>
            <label className={labelClass}>{t('State')}<input className={inputClass} required maxLength={100} value={form.state} onChange={(e) => setField('state', e.target.value)} /></label>
          </div>
        </Card>

        <Card title={t('Farm and crop details')} subtitle={t('The crop and field details used to tailor your advice')}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>{t('Farm name')}<input className={inputClass} required maxLength={100} value={form.farmName} onChange={(e) => setField('farmName', e.target.value)} /></label>
            <label className={labelClass}>{t('Farm area')}<input className={inputClass} required min="0.01" step="any" inputMode="decimal" type="number" value={form.area} onChange={(e) => setField('area', e.target.value)} /><select className={inputClass + ' mt-2'} value={form.areaUnit} onChange={(e) => setField('areaUnit', e.target.value)}><option value="acres">{t('acres')}</option><option value="hectares">{t('hectares')}</option></select></label>
            {selectFarmOption('crop', 'Crop', CROP_OPTIONS)}
            {selectFarmOption('cropStage', 'Crop growth stage', STAGE_OPTIONS)}
            {selectFarmOption('soilType', 'Soil type', SOIL_OPTIONS)}
            {selectFarmOption('irrigationType', 'Irrigation method', IRRIGATION_OPTIONS)}
          </div>
        </Card>

        <Card title={t('Farm location')} subtitle={t('Tap the map where your farm is. You can also move the pin or enter coordinates below.')}>
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-1.5 border-[#161922] bg-[#f4efe6] font-mono text-xs font-bold text-[#161922] shadow-xs"><MapPin size={15} className="text-[#2b2f8f]" />{hasCoordinates ? `${form.latitude}, ${form.longitude}` : t('No location selected yet')}</div>
          <div className="mb-4 h-72 overflow-hidden rounded-[20px] border-2 border-[#161922] shadow-[3px_3px_0_#161922] sm:h-80">
            <MapContainer center={mapCenter} zoom={hasCoordinates ? 14 : 7} scrollWheelZoom={false} className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapClickPicker onChoose={(event) => chooseLocation(event.latlng.lat, event.latlng.lng)} />
              {markerPosition && <Marker
                position={markerPosition}
                draggable
                eventHandlers={{ dragend: (event) => {
                  const point = event.target.getLatLng();
                  chooseLocation(point.lat, point.lng);
                } }}
              />}
            </MapContainer>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className={labelClass}>{t('Latitude')}<input className={inputClass} required type="number" min="-90" max="90" step="any" value={form.latitude} onChange={(e) => setField('latitude', e.target.value)} /></label>
            <label className={labelClass}>{t('Longitude')}<input className={inputClass} required type="number" min="-180" max="180" step="any" value={form.longitude} onChange={(e) => setField('longitude', e.target.value)} /></label>
            <label className={labelClass}>{t('Elevation (metres, optional)')}<input className={inputClass} type="number" min="-500" max="9000" step="any" value={form.elevationM} onChange={(e) => setField('elevationM', e.target.value)} /></label>
          </div>
        </Card>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={saving} className="press-btn press-btn-primary px-8 py-3.5 text-base shadow-[3px_3px_0_#161922] disabled:cursor-wait disabled:opacity-60">
            <Save size={18} strokeWidth={2.5} />{saving ? t('Saving...') : configured ? t('Save changes') : t('Save farm profile')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MyFarmPage;
