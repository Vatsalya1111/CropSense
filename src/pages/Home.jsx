import {
  MapPin,
  Sprout,
  Thermometer,
  Droplets,
  CloudRain,
  Wind,
  ArrowRight,
  Leaf,
  Radio,
  Gauge,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  farmData,
  currentWeather,
  actionRequired,
  forecast,
} from "../data/mockData";

function Home() {
  return (
    <div className="home-page">

      {/* Header */}
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">FARM OVERVIEW</p>

          <h1>
            Good morning, {farmData.farmerName} <span>👋</span>
          </h1>

          <p className="header-subtitle">
            Here's what's happening around your farm today.
          </p>
        </div>

        <div className="location-badge">
          <MapPin size={17} />

          <div>
            <strong>{farmData.location}</strong>
            <span>{farmData.block}</span>
          </div>
        </div>
      </header>


      {/* Farm Summary */}
      <section className="farm-summary">
        <div className="farm-summary-icon">
          <Sprout size={24} />
        </div>

        <div>
          <span className="summary-label">YOUR FARM</span>

          <div className="farm-details">
            <strong>{farmData.crop}</strong>
            <span>•</span>
            <span>{farmData.area}</span>
            <span>•</span>
            <span>{farmData.soil} soil</span>
          </div>
        </div>
      </section>


      {/* Weather */}
      <section className="dashboard-section">

        <div className="section-heading">
          <div>
            <p className="eyebrow">LOCALIZED WEATHER</p>
            <h2>Today's conditions</h2>
          </div>

          <span className="updated-text">
            Updated just now
          </span>
        </div>


        <div className="weather-grid">

          <div className="weather-card">
            <div className="weather-icon temperature">
              <Thermometer size={21} />
            </div>

            <div>
              <span>Temperature</span>

              <strong>
                {currentWeather.temperature}C
              </strong>
            </div>
          </div>


          <div className="weather-card">
            <div className="weather-icon humidity">
              <Droplets size={21} />
            </div>

            <div>
              <span>Humidity</span>

              <strong>
                {currentWeather.humidity}%
              </strong>
            </div>
          </div>


          <div className="weather-card rain-card">

            <div className="weather-icon rainfall">
              <CloudRain size={21} />
            </div>

            <div>
              <span>Rain probability</span>

              <strong>
                {currentWeather.rainProbability}%
              </strong>
            </div>

            <div className="rain-indicator">
              High chance
            </div>

          </div>


          <div className="weather-card">

            <div className="weather-icon wind">
              <Wind size={21} />
            </div>

            <div>
              <span>Wind speed</span>

              <strong>
                {currentWeather.windSpeed} km/h
              </strong>
            </div>

          </div>

        </div>

      </section>


      {/* Action Required */}
      <section className="action-card">

        <div className="action-left">

          <div className="action-icon">
            ⚠️
          </div>

          <div>

            <p className="action-label">
              ACTION REQUIRED
            </p>

            <h2>
              {actionRequired.title}
            </h2>

            <p className="action-description">
              Your Panchayat is expected to receive significant rainfall
              during this period.
            </p>

            <div className="rainfall-info">

              <CloudRain size={18} />

              <span>
                Expected rainfall{" "}
                <strong>
                  {actionRequired.rainfall}
                </strong>
              </span>

            </div>

          </div>

        </div>


        <div className="water-saving">

          <div className="water-icon">
            <Droplets size={20} />
          </div>

          <span>
            Estimated water saved
          </span>

          <strong>
            ~{actionRequired.waterSaved}
          </strong>

          <Link
            to="/advisory"
            className="advisory-link"
          >
            View advisory
            <ArrowRight size={16} />
          </Link>

        </div>

      </section>


      {/* Forecast */}
      <section className="dashboard-section forecast-section">

        <div className="section-heading">

          <div>
            <p className="eyebrow">
              WEATHER OUTLOOK
            </p>

            <h2>
              Next 72 hours
            </h2>
          </div>

          <Link
            to="/weather"
            className="text-button"
          >
            Full forecast
            <ArrowRight size={16} />
          </Link>

        </div>


        <div className="forecast-grid">

          {forecast.map((item) => (

            <div
              className="forecast-card"
              key={item.day}
            >

              <span className="forecast-day">
                {item.day}
              </span>

              <div className="forecast-icon">
                {item.icon}
              </div>

              {/* FIXED: removed extra degree symbol */}
              <strong>
                {item.temperature}C
              </strong>

              <div className="forecast-rain">

                <CloudRain size={15} />

                {item.rain}

              </div>

              <span className="forecast-mm">
                {item.rainfall}
              </span>

            </div>

          ))}

        </div>

      </section>


      {/* Farm Status */}
      <section className="dashboard-section">

        <div className="section-heading">

          <div>
            <p className="eyebrow">
              FIELD STATUS
            </p>

            <h2>
              Your farm
            </h2>
          </div>

          <Link
            to="/farm"
            className="text-button"
          >
            View farm
            <ArrowRight size={16} />
          </Link>

        </div>


        <div className="farm-status-grid">

          <div className="status-card">

            <div className="status-icon crop-status">
              <Sprout size={20} />
            </div>

            <div>
              <span>Crop</span>

              <strong>
                {farmData.crop}
              </strong>

              <small>
                Growing season
              </small>
            </div>

          </div>


          <div className="status-card">

            <div className="status-icon soil-status">
              <Gauge size={20} />
            </div>

            <div>
              <span>Soil moisture</span>

              <strong>
                43%
              </strong>

              <small>
                Moderate
              </small>
            </div>

          </div>


          <div className="status-card">

            <div className="status-icon sensor-status">
              <Radio size={20} />
            </div>

            <div>
              <span>Field sensor</span>

              <strong className="online-text">
                Online
              </strong>

              <small>
                Updated 2 min ago
              </small>
            </div>

          </div>

        </div>

      </section>


      {/* Localized Insight */}
      <div className="insight-banner">

        <div className="insight-icon">
          <Leaf size={20} />
        </div>

        <div>

          <strong>
            Localized for your farm
          </strong>

          <p>
            Weather insights are generated for your Panchayat to provide
            more relevant farm-level recommendations.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Home;