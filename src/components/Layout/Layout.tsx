import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Messeging from '../../pages/Messaging';
import { Help } from '../../pages/Help';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      <div className="lg:ml-16">
        <Header onMenuClick={toggleSidebar} />
        
        <main className="p-4 lg:p-6">
          <Outlet />
          <Messeging/>

        </main>
      </div>
    </div>
  );
};

export default Layout;