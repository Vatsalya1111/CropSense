import { useEffect, useState } from "react";

import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  MapPin,
  Thermometer,
  Droplets,
  CloudRain,
  Wind,
  TrendingUp,
  CalendarDays,
} from "lucide-react";

import {
  getFarmData,
  getCurrentWeather,
  getForecast,
} from "../services/api";


/* =========================
   TEMPORARY CHART DATA

   This is mock data for now.
   Later we will replace this
   with Sailesh's backend/ML data.
========================= */

const chartData = [
  {
    time: "Now",
    temperature: 31,
    rainfall: 2,
  },
  {
    time: "6 PM",
    temperature: 29,
    rainfall: 4,
  },
  {
    time: "12 AM",
    temperature: 26,
    rainfall: 8,
  },
  {
    time: "6 AM",
    temperature: 25,
    rainfall: 12,
  },
  {
    time: "12 PM",
    temperature: 28,
    rainfall: 18,
  },
  {
    time: "6 PM",
    temperature: 27,
    rainfall: 22,
  },
  {
    time: "12 AM",
    temperature: 25,
    rainfall: 15,
  },
];


function Weather() {
  const [farm, setFarm] = useState(null);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  /* =========================
     LOAD WEATHER DATA
  ========================= */

  useEffect(() => {
    async function loadWeatherData() {
      try {
        setLoading(true);
        setError("");

        const [
          farmData,
          currentWeather,
          forecastData,
        ] = await Promise.all([
          getFarmData(),
          getCurrentWeather(),
          getForecast(),
        ]);

        setFarm(farmData);
        setWeather(currentWeather);
        setForecast(forecastData);

      } catch (err) {
        console.error(err);

        setError(
          "Unable to load weather information."
        );

      } finally {
        setLoading(false);
      }
    }

    loadWeatherData();
  }, []);


  /* =========================
     LOADING STATE
  ========================= */

  if (loading) {
    return (
      <div className="weather-page">

        <div className="page-loading">

          <div className="loading-spinner"></div>

          <p>
            Loading localized weather...
          </p>

        </div>

      </div>
    );
  }


  /* =========================
     ERROR STATE
  ========================= */

  if (error || !farm || !weather) {
    return (
      <div className="weather-page">

        <div className="page-error">

          <h2>
            Weather unavailable
          </h2>

          <p>
            {error || "Something went wrong."}
          </p>

        </div>

      </div>
    );
  }


  /* =========================
     MAIN PAGE
  ========================= */

  return (
    <div className="weather-page">

      {/* =====================
          HEADER
      ===================== */}

      <header className="page-header">

        <div>

          <p className="eyebrow">
            LOCALIZED FORECAST
          </p>

          <h1>
            Weather
          </h1>

          <p className="page-subtitle">
            Weather conditions and predictions
            for your farm.
          </p>

        </div>


        {/* Location */}

        <div className="location-badge">

          <MapPin size={17} />

          <div>

            <strong>
              {farm.location}
            </strong>

            <span>
              {farm.block}
            </span>

          </div>

        </div>

      </header>


      {/* =====================
          CURRENT WEATHER
      ===================== */}

      <section className="current-weather-card">

        <div className="current-weather-main">

          <span>
            NOW
          </span>

          <div className="temperature-display">

            <strong>
              {weather.temperature}°
            </strong>

            <span>
              C
            </span>

          </div>

          <p>
            Current farm conditions
          </p>

        </div>


        <div className="current-weather-stats">

          {/* Feels like */}

          <div>

            <Thermometer size={18} />

            <span>
              Feels like
            </span>

            <strong>
              33°C
            </strong>

          </div>


          {/* Humidity */}

          <div>

            <Droplets size={18} />

            <span>
              Humidity
            </span>

            <strong>
              {weather.humidity}%
            </strong>

          </div>


          {/* Rain */}

          <div>

            <CloudRain size={18} />

            <span>
              Rain chance
            </span>

            <strong>
              {weather.rainProbability}%
            </strong>

          </div>


          {/* Wind */}

          <div>

            <Wind size={18} />

            <span>
              Wind
            </span>

            <strong>
              {weather.windSpeed} km/h
            </strong>

          </div>

        </div>

      </section>


      {/* Weather Trend */}

<section className="weather-section">

  <div className="section-heading">

    <div>
      <p className="eyebrow">72-HOUR TREND</p>
      <h2>Temperature & rainfall</h2>
    </div>

    <span className="forecast-location">
      Localized prediction
    </span>

  </div>
  <div className="chart-legend">
  <span>
    <i className="legend-temperature"></i>
    Temperature
  </span>

  <span>
    <i className="legend-rainfall"></i>
    Rainfall
  </span>
</div>

  <div className="weather-chart-card">

    <ResponsiveContainer width="100%" height={300}>

      <ComposedChart
        data={chartData}
        margin={{
          top: 10,
          right: 20,
          left: 0,
          bottom: 5,
        }}
      >

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e6ece7"
        />

        <XAxis
          dataKey="time"
          tick={{
            fontSize: 10,
            fill: "#718078",
          }}
          axisLine={{
            stroke: "#dce5dd",
          }}
        />

        {/* Temperature axis */}

        <YAxis
          yAxisId="temperature"
          orientation="left"
          domain={[20, 35]}
          tick={{
            fontSize: 10,
            fill: "#718078",
          }}
          axisLine={{
            stroke: "#dce5dd",
          }}
          label={{
            value: "°C",
            angle: -90,
            position: "insideLeft",
            style: {
              fill: "#397653",
              fontSize: 10,
            },
          }}
        />

        {/* Rainfall axis */}

        <YAxis
          yAxisId="rainfall"
          orientation="right"
          domain={[0, 25]}
          tick={{
            fontSize: 10,
            fill: "#718078",
          }}
          axisLine={{
            stroke: "#dce5dd",
          }}
          label={{
            value: "mm",
            angle: 90,
            position: "insideRight",
            style: {
              fill: "#5d8aa8",
              fontSize: 10,
            },
          }}
        />

        <Tooltip
          contentStyle={{
            borderRadius: "10px",
            border: "1px solid #dce5dd",
            boxShadow: "0 5px 20px rgba(40, 70, 50, 0.08)",
            fontSize: "11px",
          }}
        />

        {/* Rainfall */}

        <Bar
          yAxisId="rainfall"
          dataKey="rainfall"
          name="Rainfall"
          fill="#8bb8c8"
          barSize={22}
          radius={[5, 5, 0, 0]}
        />

        {/* Temperature */}

        <Line
          yAxisId="temperature"
          type="monotone"
          dataKey="temperature"
          name="Temperature"
          stroke="#397653"
          strokeWidth={3}
          dot={{
            r: 4,
            fill: "#ffffff",
            stroke: "#397653",
            strokeWidth: 2,
          }}
          activeDot={{
            r: 6,
          }}
        />

      </ComposedChart>

    </ResponsiveContainer>

  </div>

</section>


      {/* =====================
          FORECAST
      ===================== */}

      <section className="weather-section">

        <div className="section-heading">

          <div>

            <p className="eyebrow">
              FORECAST
            </p>

            <h2>
              Next 72 hours
            </h2>

          </div>


          <span className="forecast-location">

            <MapPin size={13} />

            Panchayat-level

          </span>

        </div>


        <div className="detailed-forecast">

          {forecast.map(
            (item, index) => (

              <div
                className={`detailed-forecast-card ${
                  index === 1
                    ? "forecast-highlight"
                    : ""
                }`}
                key={item.day}
              >

                {/* Date */}

                <div className="forecast-date">

                  <CalendarDays size={16} />

                  <strong>
                    {item.day}
                  </strong>

                </div>


                {/* Weather icon */}

                <div className="big-weather-icon">

                  {item.icon}

                </div>


                {/* Temperature */}

                <div className="forecast-temperature">

                  <strong>
                    {item.temperature}°C
                  </strong>

                  <span>
                    Expected temperature
                  </span>

                </div>


                {/* Rain probability */}

                <div className="forecast-metric">

                  <CloudRain size={17} />

                  <div>

                    <span>
                      Rain probability
                    </span>

                    <strong>
                      {item.rain}
                    </strong>

                  </div>

                </div>


                {/* Rainfall */}

                <div className="forecast-metric">

                  <Droplets size={17} />

                  <div>

                    <span>
                      Expected rainfall
                    </span>

                    <strong>
                      {item.rainfall}
                    </strong>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      </section>


      {/* =====================
          WEATHER INSIGHT
      ===================== */}

      <section className="weather-insight">

        <div className="weather-insight-icon">

          <TrendingUp size={21} />

        </div>


        <div>

          <p className="eyebrow">
            WEATHER INSIGHT
          </p>

          <h3>
            Rainfall is expected to peak tomorrow.
          </h3>

          <p>
            Your Panchayat may receive around
            18–25 mm of rainfall. This forecast
            is used to generate crop-specific
            recommendations.
          </p>

        </div>

      </section>

    </div>
  );
}


export default Weather;