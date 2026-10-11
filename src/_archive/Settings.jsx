import {
  Bell,
  Globe,
  Thermometer,
  Ruler,
  Sprout,
  Radio,
  User,
  ChevronRight,
} from "lucide-react";

function Settings() {
  return (
    <div className="settings-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">PREFERENCES</p>
          <h1>Settings</h1>
          <p className="page-subtitle">
            Customize how CropSense works for you.
          </p>
        </div>
      </header>

      {/* Notifications */}
      <section className="settings-section">
        <div className="settings-section-title">
          <Bell size={18} />
          <div>
            <h2>Notifications</h2>
            <p>Choose which alerts you want to receive.</p>
          </div>
        </div>

        <div className="settings-list">
          <div className="setting-row">
            <div>
              <strong>Weather alerts</strong>
              <span>Get notified about important weather changes.</span>
            </div>

            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span></span>
            </label>
          </div>

          <div className="setting-row">
            <div>
              <strong>Farm advisories</strong>
              <span>Receive important crop and irrigation recommendations.</span>
            </div>

            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span></span>
            </label>
          </div>
        </div>
      </section>

      {/* Display */}
      <section className="settings-section">
        <div className="settings-section-title">
          <Globe size={18} />
          <div>
            <h2>Display & Units</h2>
            <p>Choose how weather information is displayed.</p>
          </div>
        </div>

        <div className="settings-list">
          <div className="setting-row">
            <div className="setting-with-icon">
              <Thermometer size={18} />
              <div>
                <strong>Temperature</strong>
                <span>Used for weather readings.</span>
              </div>
            </div>

            <select defaultValue="celsius">
              <option value="celsius">Celsius (°C)</option>
              <option value="fahrenheit">Fahrenheit (°F)</option>
            </select>
          </div>

          <div className="setting-row">
            <div className="setting-with-icon">
              <Ruler size={18} />
              <div>
                <strong>Rainfall</strong>
                <span>Used for rainfall measurements.</span>
              </div>
            </div>

            <select defaultValue="mm">
              <option value="mm">Millimetres (mm)</option>
              <option value="inch">Inches (in)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Farm preferences */}
      <section className="settings-section">
        <div className="settings-section-title">
          <Sprout size={18} />
          <div>
            <h2>Farm Preferences</h2>
            <p>Information used to personalize recommendations.</p>
          </div>
        </div>

        <button className="settings-link">
          <div>
            <strong>Farm information</strong>
            <span>Crop, area, soil and location</span>
          </div>

          <ChevronRight size={18} />
        </button>

        <button className="settings-link">
          <div>
            <strong>Crop preferences</strong>
            <span>Manage crop-related advisory settings</span>
          </div>

          <ChevronRight size={18} />
        </button>
      </section>

      {/* Sensor */}
      <section className="settings-section">
        <div className="settings-section-title">
          <Radio size={18} />
          <div>
            <h2>Field Sensor</h2>
            <p>Manage your connected sensor information.</p>
          </div>
        </div>

        <div className="sensor-settings-status">
          <div className="status-dot"></div>

          <div>
            <strong>ESP32 Sensor Unit</strong>
            <span>Connected · Data syncing normally</span>
          </div>

          <span className="connected-label">Connected</span>
        </div>
      </section>

      {/* Account */}
      <section className="settings-section">
        <div className="settings-section-title">
          <User size={18} />
          <div>
            <h2>Account</h2>
            <p>Manage your farmer account.</p>
          </div>
        </div>

        <button className="settings-link">
          <div>
            <strong>Profile information</strong>
            <span>View and update your account details</span>
          </div>

          <ChevronRight size={18} />
        </button>
      </section>
    </div>
  );
}

export default Settings;