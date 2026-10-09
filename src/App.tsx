import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { MainLayout } from './components/layout/MainLayout';

import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { MyFarmPage } from './pages/MyFarm/MyFarmPage';
import { WeatherPage } from './pages/Weather/WeatherPage';
import { CropHealthPage } from './pages/CropHealth/CropHealthPage';
import { IrrigationPage } from './pages/Irrigation/IrrigationPage';
import { AdvisoryPage } from './pages/Advisory/AdvisoryPage';
import { AlertsPage } from './pages/Alerts/AlertsPage';
import { SettingsPage } from './pages/Settings/SettingsPage';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="farm" element={<MyFarmPage />} />
            <Route path="weather" element={<WeatherPage />} />
            <Route path="crop-health" element={<CropHealthPage />} />
            <Route path="irrigation" element={<IrrigationPage />} />
            <Route path="advisory" element={<AdvisoryPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
