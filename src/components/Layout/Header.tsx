import React, { useState, useEffect } from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import userLogo from '../../assets/user_logo.jpg';
import { useAuth } from '../../contexts/AuthContext';
import Notification from '../../pages/Employee/Notification';
import { mockNotifications } from '../../data/mockData'; // ✅ Import mock data
import { NavLink } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [userNotifications, setUserNotifications] = useState<
    { id: string; title: string; message: string }[]
  >([]);

  useEffect(() => {
    if (user?.id) {
      const filtered = mockNotifications.filter(
        (notif) => notif.userId === String(user.id)
      );
      setUserNotifications(filtered);
    }
  }, [user]);

  const notificationCount = userNotifications.length;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          {/* <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div> */}
        </div>

        <div className="flex items-center space-x-4">
          <button
            className="relative p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setShowNotifications((prev) => !prev)}
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Pass the list to Notification */}
          <Notification
            visible={showNotifications}
            onClose={() => setShowNotifications(false)}
            notifications={userNotifications}
          />

          <NavLink
            to="/profile" 
            className="flex items-center space-x-3">
            <img
              src={user?.avatar || userLogo}
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Header;
