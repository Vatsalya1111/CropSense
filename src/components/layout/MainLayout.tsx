import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { DemoScenarioBanner } from '../common/DemoScenarioBanner';

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f5f7f2] flex flex-col">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 transition-all duration-200">
        <DemoScenarioBanner />
        <Header />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-7 lg:px-10 py-6 sm:py-8 pb-24 md:pb-12">
          {children || <Outlet />}
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export default MainLayout;
