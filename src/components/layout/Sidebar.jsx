import {
  Home,
  Sprout,
  CloudSun,
  AlertTriangle,
  Radio,
  Map,
  Settings,
  User,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "My Farm", path: "/farm", icon: Sprout },
  { name: "Weather", path: "/weather", icon: CloudSun },
  { name: "Advisory", path: "/advisory", icon: AlertTriangle },
  { name: "Sensors", path: "/sensors", icon: Radio },
  { name: "Panchayat Map", path: "/map", icon: Map },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <Sprout size={22} />
        </div>

        <div>
          <h2>AgriSense</h2>
          <span>Smart farming</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-label">MENU</p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `settings-btn ${isActive ? "settings-active" : ""}`
          }
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>

        <NavLink
          to="/profile"
          className="farmer-profile"
        >
          <div className="profile-avatar">
            <User size={17} />
          </div>

          <div>
            <strong>Farmer</strong>
            <span>My Farm</span>
          </div>
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;