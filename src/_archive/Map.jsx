import { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";

import {
  MapPin,
  CloudRain,
  Thermometer,
  AlertTriangle,
  Droplets,
  Layers3,
} from "lucide-react";

import "leaflet/dist/leaflet.css";

/* =========================
   TEMPORARY PANCHAYAT DATA
   Later this will come from
   Sailesh's backend / ML model.
========================= */

const panchayatData = [
  {
    id: 1,
    name: "Rampur Panchayat",
    block: "ABC Block",
    latitude: 20.5937,
    longitude: 78.9629,
    temperature: 27,
    rainfall: "18–25 mm",
    rainProbability: 82,
    risk: "high",
    riskText: "High rainfall risk",
  },

  {
    id: 2,
    name: "Lakshmipur Panchayat",
    block: "ABC Block",
    latitude: 20.599,
    longitude: 78.972,
    temperature: 29,
    rainfall: "8–12 mm",
    rainProbability: 55,
    risk: "moderate",
    riskText: "Moderate risk",
  },

  {
    id: 3,
    name: "Devgaon Panchayat",
    block: "ABC Block",
    latitude: 20.586,
    longitude: 78.975,
    temperature: 31,
    rainfall: "2–5 mm",
    rainProbability: 24,
    risk: "low",
    riskText: "Low risk",
  },

  {
    id: 4,
    name: "Shivpur Panchayat",
    block: "ABC Block",
    latitude: 20.584,
    longitude: 78.948,
    temperature: 28,
    rainfall: "12–18 mm",
    rainProbability: 68,
    risk: "moderate",
    riskText: "Moderate rainfall risk",
  },

  {
    id: 5,
    name: "Kisan Nagar Panchayat",
    block: "ABC Block",
    latitude: 20.602,
    longitude: 78.947,
    temperature: 26,
    rainfall: "20–28 mm",
    rainProbability: 88,
    risk: "high",
    riskText: "High rainfall risk",
  },
];

/* =========================
   MAP AUTO CENTER
========================= */

function MapCenter({ selected }) {
  const map = useMap();

  useEffect(() => {
    if (!selected) return;

    map.flyTo(
      [selected.latitude, selected.longitude],
      13,
      {
        duration: 0.8,
      }
    );
  }, [selected, map]);

  return null;
}

/* =========================
   RISK COLOR
========================= */

function getRiskColor(risk) {
  if (risk === "high") {
    return "#c95c4b";
  }

  if (risk === "moderate") {
    return "#d49a3a";
  }

  return "#4d8b62";
}

/* =========================
   MAP PAGE
========================= */

function Map() {
  const [selected, setSelected] = useState(
    panchayatData[0]
  );

  return (
    <div className="map-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="page-header">

        <div>
          <p className="eyebrow">
            LOCALIZED WEATHER MAP
          </p>

          <h1>Panchayat Map</h1>

          <p className="page-subtitle">
            Explore localized weather conditions
            and agricultural risk across Panchayats.
          </p>
        </div>

        <div className="map-location-badge">

          <MapPin size={17} />

          <div>
            <strong>
              {selected.name}
            </strong>

            <span>
              {selected.block}
            </span>
          </div>

        </div>

      </header>


      {/* =========================
          MAP + DETAILS
      ========================= */}

      <section className="map-layout">

        {/* =========================
            MAP
        ========================= */}

        <div className="map-card">

          <MapContainer
  center={[
    selected.latitude,
    selected.longitude,
  ]}
  zoom={12}
  scrollWheelZoom={true}
  zoomControl={false}
  attributionControl={false}
            
            style={{
              width: "100%",
              height: "520px",
            }}
          >

            <TileLayer
              attribution=""
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapCenter selected={selected} />


            {/* PANCHAYAT MARKERS */}

            {panchayatData.map((panchayat) => {

              const isSelected =
                selected.id === panchayat.id;

              return (
                <CircleMarker
                  key={panchayat.id}
                  center={[
                    panchayat.latitude,
                    panchayat.longitude,
                  ]}
                  radius={
                    isSelected ? 8 : 5
                  }
                  pathOptions={{
                    color: "#ffffff",
                    weight: isSelected ? 3 : 2,
                    fillColor: getRiskColor(
                      panchayat.risk
                    ),
                    fillOpacity: 0.95,
                  }}
                  eventHandlers={{
                    click: () =>
                      setSelected(panchayat),
                  }}
                >

                  <Popup>

                    <strong>
                      {panchayat.name}
                    </strong>

                    <br />

                    {panchayat.riskText}

                    <br />

                    Rainfall:{" "}
                    {panchayat.rainfall}

                  </Popup>

                </CircleMarker>
              );
            })}

          </MapContainer>


          {/* =========================
              MAP LEGEND
          ========================= */}

          <div className="map-legend">

            <div className="legend-title">

              <Layers3 size={15} />

              Weather risk

            </div>

            <div className="legend-item">

              <span className="risk-dot risk-low"></span>

              Low

            </div>

            <div className="legend-item">

              <span className="risk-dot risk-moderate"></span>

              Moderate

            </div>

            <div className="legend-item">

              <span className="risk-dot risk-high"></span>

              High

            </div>

          </div>

        </div>


        {/* =========================
            PANCHAYAT DETAILS
        ========================= */}

        <aside className="panchayat-details">

          <p className="eyebrow">
            SELECTED PANCHAYAT
          </p>

          <h2>
            {selected.name}
          </h2>

          <p className="panchayat-block">
            {selected.block}
          </p>


          {/* RISK */}

          <div
            className={`risk-banner risk-${selected.risk}`}
          >

            <AlertTriangle size={19} />

            <div>

              <span>
                CURRENT RISK
              </span>

              <strong>
                {selected.riskText}
              </strong>

            </div>

          </div>


          {/* WEATHER */}

          <div className="panchayat-metrics">

            <div className="panchayat-metric">

              <div className="metric-icon">
                <Thermometer size={19} />
              </div>

              <div>

                <span>
                  Temperature
                </span>

                <strong>
                  {selected.temperature}°C
                </strong>

              </div>

            </div>


            <div className="panchayat-metric">

              <div className="metric-icon">
                <CloudRain size={19} />
              </div>

              <div>

                <span>
                  Rain probability
                </span>

                <strong>
                  {selected.rainProbability}%
                </strong>

              </div>

            </div>


            <div className="panchayat-metric">

              <div className="metric-icon">
                <Droplets size={19} />
              </div>

              <div>

                <span>
                  Expected rainfall
                </span>

                <strong>
                  {selected.rainfall}
                </strong>

              </div>

            </div>

          </div>


          {/* LOCALIZED INFORMATION */}

          <div className="localized-note">

            <MapPin size={17} />

            <div>

              <strong>
                Panchayat-level prediction
              </strong>

              <p>
                Weather information is localized
                for this Panchayat to support
                farm-level decision making.
              </p>

            </div>

          </div>


          {/* PANCHAYAT SELECTOR */}

          <div className="panchayat-selector">

            <p className="eyebrow">
              EXPLORE PANCHAYATS
            </p>

            {panchayatData.map((panchayat) => (

              <button
                key={panchayat.id}
                className={
                  selected.id === panchayat.id
                    ? "panchayat-option active"
                    : "panchayat-option"
                }
                onClick={() =>
                  setSelected(panchayat)
                }
              >

                <span
                  className={`option-dot risk-${panchayat.risk}`}
                ></span>

                <span>
                  {panchayat.name}
                </span>

              </button>

            ))}

          </div>

        </aside>

      </section>


      {/* =========================
          LOCALIZATION INSIGHT
      ========================= */}

      <section className="map-insight">

        <div className="map-insight-icon">

          <CloudRain size={21} />

        </div>

        <div>

          <p className="eyebrow">
            WHY LOCALIZATION MATTERS
          </p>

          <h3>
            Weather conditions can vary across
            nearby Panchayats.
          </h3>

          <p>
            CropSense aims to downscale weather
            information from broader forecasts to
            Panchayat-level predictions, helping
            farmers receive more relevant,
            location-specific advisories.
          </p>

        </div>

      </section>

    </div>
  );
}

export default Map;