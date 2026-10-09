import {
  MapPin,
  Sprout,
  Ruler,
  Mountain,
  Droplets,
  Radio,
  Pencil,
  CheckCircle2,
} from "lucide-react";

import { farmData } from "../data/mockData";

function Farm() {
  return (
    <div className="farm-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">FARM PROFILE</p>
          <h1>My Farm</h1>
          <p className="page-subtitle">
            Manage and view the information used for your farm insights.
          </p>
        </div>

        <button className="edit-farm-btn">
          <Pencil size={16} />
          Edit farm
        </button>
      </header>

      <section className="farm-location-card">
        <div className="farm-location-icon">
          <MapPin size={24} />
        </div>

        <div>
          <p className="card-label">FARM LOCATION</p>
          <h2>{farmData.location}</h2>
          <p>{farmData.block}</p>

          <span className="location-info">
            Used for localized weather predictions and advisories.
          </span>
        </div>
      </section>

      <section className="farm-info-grid">
        <div className="farm-info-card">
          <div className="info-icon crop-info">
            <Sprout size={20} />
          </div>

          <span>Crop</span>
          <strong>{farmData.crop}</strong>
        </div>

        <div className="farm-info-card">
          <div className="info-icon area-info">
            <Ruler size={20} />
          </div>

          <span>Farm area</span>
          <strong>{farmData.area}</strong>
        </div>

        <div className="farm-info-card">
          <div className="info-icon soil-info">
            <Mountain size={20} />
          </div>

          <span>Soil type</span>
          <strong>{farmData.soil}</strong>
        </div>

        <div className="farm-info-card">
          <div className="info-icon stage-info">
            <Sprout size={20} />
          </div>

          <span>Crop stage</span>
          <strong>Flowering</strong>
        </div>
      </section>

      <section className="farm-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FIELD CONDITIONS</p>
            <h2>Current farm status</h2>
          </div>
        </div>

        <div className="field-status-grid">
          <div className="field-status-card">
            <div className="field-status-icon moisture">
              <Droplets size={21} />
            </div>

            <div>
              <span>Soil moisture</span>
              <strong>43%</strong>
              <p>Moderate moisture level</p>
            </div>
          </div>

          <div className="field-status-card">
            <div className="field-status-icon sensor">
              <Radio size={21} />
            </div>

            <div>
              <span>Field sensor</span>

              <strong className="sensor-online">
                <CheckCircle2 size={16} />
                Online
              </strong>

              <p>Last updated 2 minutes ago</p>
            </div>
          </div>
        </div>
      </section>

      <section className="farm-note">
        <div>
          <strong>Why this information matters</strong>

          <p>
            Your location, crop, soil and field conditions help the system
            provide more relevant weather predictions and agricultural
            recommendations.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Farm;