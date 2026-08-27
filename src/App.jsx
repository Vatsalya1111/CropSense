import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";
import "./App.css";
import Home from "./pages/Home";
import Farm from "./pages/Farm";
import Weather from "./pages/Weather";
import Advisory from "./pages/Advisory";
import Sensors from "./pages/Sensors";
import Map from "./pages/Map";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/farm" element={<Farm />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/advisory" element={<Advisory />} />
          <Route path="/sensors" element={<Sensors />} />
          <Route path="/map" element={<Map />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;