import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { farmService } from '../../services';
import { Farm } from '../../types';
import { Tractor, Sprout, Layers, Droplets, Compass } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet default icon paths in React/Vite builds
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export const MyFarmPage: React.FC = () => {
  const [farm, setFarm] = useState<Farm | null>(null);

  useEffect(() => {
    farmService.getFarm().then(setFarm);
  }, []);

  if (!farm) {
    return <div className="p-16 text-center text-stone-500 font-medium">Loading your farm profile...</div>;
  }

  return (
    <div className="space-y-7 max-w-5xl mx-auto">
      {/* Question Header */}
      <div className="page-heading">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-0.5">
          <Tractor size={14} className="text-emerald-700" />
          <span>Field Profile</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          What Is My Farm and Crop?
        </h2>
        <p className="text-sm text-stone-600 mt-1">
          Registered land details, crop stage, and GPS location for Rampur Adarsh Khet.
        </p>
      </div>

      {/* Visual Farm Landscape Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm bg-emerald-950">
        <img
          src="/images/wheat-field-hero.svg"
          alt="Farmland landscape"
          className="w-full h-44 sm:h-52 object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent flex flex-col justify-end p-5 text-white">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-[11px] font-bold uppercase tracking-wider">
              Registered Plot
            </span>
            <span className="text-xs text-stone-200">{farm.location.village}, {farm.location.district}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold mt-1 text-white">
            {farm.name} • {farm.crop} ({farm.area} {farm.areaUnit})
          </h3>
        </div>
      </div>

      {/* Farm attributes grid with agriculture icons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Card className="text-center p-4 rounded-2xl border-stone-200/80 shadow-xs">
          <div className="flex justify-center text-stone-400 mb-1.5">
            <Compass size={20} />
          </div>
          <div className="text-[11px] text-stone-500 font-bold uppercase tracking-wider">Total Area</div>
          <div className="text-base sm:text-lg font-black text-stone-900 mt-0.5">{farm.area} {farm.areaUnit}</div>
        </Card>

        <Card className="text-center p-4 rounded-2xl border-stone-200/80 shadow-xs">
          <div className="flex justify-center text-emerald-600 mb-1.5">
            <Sprout size={20} />
          </div>
          <div className="text-[11px] text-stone-500 font-bold uppercase tracking-wider">Primary Crop</div>
          <div className="text-base sm:text-lg font-black text-emerald-800 mt-0.5 truncate">{farm.crop}</div>
        </Card>

        <Card className="text-center p-4 rounded-2xl border-stone-200/80 shadow-xs">
          <div className="flex justify-center text-emerald-600 mb-1.5">
            <Tractor size={20} />
          </div>
          <div className="text-[11px] text-stone-500 font-bold uppercase tracking-wider">Crop Stage</div>
          <div className="text-xs sm:text-sm font-bold text-stone-900 mt-1 truncate" title={farm.cropStage}>
            {farm.cropStage}
          </div>
        </Card>

        <Card className="text-center p-4 rounded-2xl border-stone-200/80 shadow-xs">
          <div className="flex justify-center text-amber-600 mb-1.5">
            <Layers size={20} />
          </div>
          <div className="text-[11px] text-stone-500 font-bold uppercase tracking-wider">Soil Type</div>
          <div className="text-base sm:text-lg font-black text-stone-900 mt-0.5">{farm.soilType}</div>
        </Card>

        <Card className="text-center p-4 rounded-2xl border-stone-200/80 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex justify-center text-sky-600 mb-1.5">
            <Droplets size={20} />
          </div>
          <div className="text-[11px] text-stone-500 font-bold uppercase tracking-wider">Water System</div>
          <div className="text-base sm:text-lg font-black text-stone-900 mt-0.5 truncate">{farm.irrigationType}</div>
        </Card>
      </div>

      {/* Simple Leaflet Map Container */}
      <Card title="Farm Ground Location & Satellite Map" subtitle="OpenStreetMap GPS view of your wheat plot">
        <div className="h-64 sm:h-80 w-full rounded-xl overflow-hidden border border-stone-200 mt-2 z-0 relative">
          <MapContainer
            center={[farm.location.lat, farm.location.lng]}
            zoom={15}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[farm.location.lat, farm.location.lng]}>
              <Popup>
                <div className="text-xs">
                  <strong>{farm.name}</strong>
                  <br />
                  {farm.crop} ({farm.area} {farm.areaUnit})
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </Card>
    </div>
  );
};

export default MyFarmPage;
