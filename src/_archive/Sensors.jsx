import { useEffect, useState } from "react";

import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Thermometer,
  Droplets,
  CloudRain,
  Radio,
  Wifi,
  Clock3,
  Activity,
  RefreshCw,
} from "lucide-react";

import { getSensorData } from "../services/api";


const sensorChartData = [
  {
    time: "8 AM",
    temperature: 28,
    humidity: 72,
    soil: 64,
  },
  {
    time: "10 AM",
    temperature: 29,
    humidity: 70,
    soil: 62,
  },
  {
    time: "12 PM",
    temperature: 31,
    humidity: 67,
    soil: 60,
  },
  {
    time: "2 PM",
    temperature: 32,
    humidity: 65,
    soil: 58,
  },
  {
    time: "4 PM",
    temperature: 31,
    humidity: 69,
    soil: 61,
  },
  {
    time: "6 PM",
    temperature: 29,
    humidity: 74,
    soil: 64,
  },
];


function Sensors() {
  const [sensor, setSensor] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");


  async function loadSensorData(isRefresh = false) {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getSensorData();

      setSensor(data);

    } catch (err) {
      console.error(err);

      setError("Unable to load sensor data.");

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }


  useEffect(() => {
    loadSensorData();
  }, []);


  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="sensors-page">

        <div className="page-loading">

          <div className="loading-spinner"></div>

          <p>
            Connecting to field sensor...
          </p>

        </div>

      </div>
    );
  }


  /* =========================
     ERROR
  ========================= */

  if (error || !sensor) {
    return (
      <div className="sensors-page">

        <div className="page-error">

          <h2>
            Sensor unavailable
          </h2>

          <p>
            {error || "Something went wrong."}
          </p>

          <button
            className="refresh-btn"
            onClick={() => loadSensorData(true)}
          >
            <RefreshCw size={15} />
            Try again
          </button>

        </div>

      </div>
    );
  }


  return (
    <div className="sensors-page">


      {/* =========================
          HEADER
      ========================= */}

      <header className="page-header">

        <div>

          <p className="eyebrow">
            FIELD MONITORING
          </p>

          <h1>
            Field Sensors
          </h1>

          <p className="page-subtitle">
            Live conditions collected from your
            farm sensor.
          </p>

        </div>


        <div className="sensor-live-badge">

          <span className="live-dot"></span>

          Live

        </div>

      </header>


      {/* =========================
          SENSOR CONNECTION
      ========================= */}

      <section className="sensor-connection">

        <div className="connection-left">

          <div className="connection-icon">

            <Radio size={22} />

          </div>


          <div>

            <span>
              FIELD SENSOR
            </span>

            <h2>
              ESP32 Sensor Unit
            </h2>

            <p>

              <Wifi size={13} />

              {sensor.status === "online"
                ? "Connected and sending data"
                : "Sensor offline"}

            </p>

          </div>

        </div>


        <div className="connection-time">

          <Clock3 size={15} />

          Last updated {sensor.lastUpdated}

        </div>

      </section>


      {/* =========================
          LIVE READINGS
      ========================= */}

      <section className="sensor-section">

        <div className="section-heading">

          <div>

            <p className="eyebrow">
              LIVE READINGS
            </p>

            <h2>
              Current field conditions
            </h2>

          </div>


          <button
            className="refresh-btn"
            onClick={() => loadSensorData(true)}
            disabled={refreshing}
          >

            <RefreshCw
              size={15}
              className={
                refreshing
                  ? "refresh-spin"
                  : ""
              }
            />

            {refreshing
              ? "Updating..."
              : "Refresh"}

          </button>

        </div>


        <div className="sensor-grid">


          {/* Temperature */}

          <div className="sensor-reading-card">

            <div className="sensor-reading-icon">

              <Thermometer size={22} />

            </div>

            <span>
              Temperature
            </span>

            <strong>
              {sensor.temperature}°C
            </strong>

            <small>
              Field air temperature
            </small>

          </div>


          {/* Humidity */}

          <div className="sensor-reading-card">

            <div className="sensor-reading-icon">

              <Droplets size={22} />

            </div>

            <span>
              Humidity
            </span>

            <strong>
              {sensor.humidity}%
            </strong>

            <small>
              Relative humidity
            </small>

          </div>


          {/* Soil moisture */}

          <div className="sensor-reading-card">

            <div className="sensor-reading-icon">

              <Activity size={22} />

            </div>

            <span>
              Soil moisture
            </span>

            <strong>
              {sensor.soilMoisture}%
            </strong>

            <small>
              Current soil moisture
            </small>

          </div>


          {/* Rainfall */}

          <div className="sensor-reading-card">

            <div className="sensor-reading-icon">

              <CloudRain size={22} />

            </div>

            <span>
              Rainfall
            </span>

            <strong>
              {sensor.rainfall} mm
            </strong>

            <small>
              Today's field rainfall
            </small>

          </div>

        </div>

      </section>


      {/* =========================
          SENSOR TREND
      ========================= */}

      <section className="sensor-section">

        <div className="section-heading">

          <div>

            <p className="eyebrow">
              SENSOR HISTORY
            </p>

            <h2>
              Field conditions today
            </h2>

          </div>

          <span className="forecast-location">
            ESP32 readings
          </span>

        </div>


        <div className="sensor-chart-card">

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <ComposedChart
              data={sensorChartData}
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
              />


              <YAxis
                tick={{
                  fontSize: 10,
                  fill: "#718078",
                }}
                domain={[0, 100]}
              />


              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #dce5dd",
                  boxShadow:
                    "0 5px 20px rgba(40,70,50,0.08)",
                  fontSize: "11px",
                }}
              />


              <Area
                type="monotone"
                dataKey="soil"
                name="Soil moisture"
                fill="#dcebdc"
                stroke="#397653"
                strokeWidth={2}
              />


              <Line
                type="monotone"
                dataKey="humidity"
                name="Humidity"
                stroke="#6f9eb0"
                strokeWidth={2}
                dot={{ r: 3 }}
              />


            </ComposedChart>

          </ResponsiveContainer>

        </div>

      </section>


      {/* =========================
          SENSOR INFORMATION
      ========================= */}

      <section className="sensor-info-banner">

        <div className="sensor-info-icon">

          <Activity size={20} />

        </div>


        <div>

          <p className="eyebrow">
            WHY SENSOR DATA MATTERS
          </p>

          <strong>
            Local observations improve farm-level
            decisions.
          </strong>

          <p>
            Sensor readings can complement weather
            and satellite information, helping the
            system understand actual field conditions
            and generate more relevant advisories.
          </p>

        </div>

      </section>


    </div>
  );
}


export default Sensors;