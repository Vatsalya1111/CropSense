import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { farmService } from '../../services';
import { MyFarmPage } from '../../pages/MyFarm/MyFarmPage';
import { useI18n } from '../../i18n';

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { t } = useI18n();
  const [profileState, setProfileState] = useState<'loading' | 'setup' | 'ready' | 'error'>('loading');

  useEffect(() => {
    farmService.getProfile()
      .then((profile) => setProfileState(profile.configured ? 'ready' : 'setup'))
      .catch(() => setProfileState('error'));
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f7f2] flex flex-col">
      {/* Desktop Sidebar */}
      {profileState === 'ready' && <Sidebar />}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 transition-all duration-200">
        {profileState === 'ready' && <Header />}

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-7 lg:px-10 py-6 sm:py-8 pb-24 md:pb-12">
          {profileState === 'loading' && <div className="p-16 text-center text-stone-500 font-medium">{t('Loading your farm profile...')}</div>}
          {profileState === 'error' && <div className="p-16 text-center text-red-700">{t('Farm profile could not be loaded. Check that the CropSense API is running and refresh.')}</div>}
          {profileState === 'setup' && <MyFarmPage onSaved={() => setProfileState('ready')} />}
          {profileState === 'ready' && (children || <Outlet />)}
        </main>

        {/* Mobile Bottom Navigation */}
        {profileState === 'ready' && <BottomNav />}
      </div>
    </div>
  );
};

export default MainLayout;
