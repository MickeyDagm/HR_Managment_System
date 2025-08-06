import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, Search} from 'lucide-react';
import userLogo from '../../assets/user_logo.jpg';
import { useAuth } from '../../contexts/AuthContext';
import Notification from '../../pages/Notification';
import { mockNotifications, mockEmployees } from '../../data/mockData';
import { NavLink, useNavigate } from 'react-router-dom';
import { computeFinalPermissions } from '../../types/levels';
import { User } from '../../types/index';
import { getNavigationItems, NavigationItem } from './Navigation';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth() as { user: User | null };
  const [showNotifications, setShowNotifications] = useState(false);
  const [userNotifications, setUserNotifications] = useState<{ id: string; title: string; message: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<NavigationItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUserNotifications(user?.id ? mockNotifications.filter(notif => notif.userId === String(user.id)) : []);
  }, [user]);

  useEffect(() => {
    const employee = user?.id ? mockEmployees.find(emp => emp.id === user.id) : undefined;
    const userPermissions = employee ? computeFinalPermissions(employee.level || 'LEVEL_1', employee.customOverrides || []) : [];
    const permittedItems = getNavigationItems(userPermissions);
    const filtered = searchQuery.trim()
      ? permittedItems.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
      : permittedItems.slice(0, 3); // Limit to 3 items when no query

    setFilteredItems(filtered);
  }, [searchQuery, user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleItemClick = (path: string) => {
    navigate(path);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button onClick={onMenuClick} className="p-2 rounded-lg hover:bg-gray-100 lg:hidden">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="relative md:flex items-center" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search pages..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#72c02c] focus:border-transparent transition duration-200"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && filteredItems.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden">
                {filteredItems.map(item => (
                  <div
                    key={item.path}
                    className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out"
                    onClick={() => handleItemClick(item.path)}
                  >
                    <item.icon className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="relative p-2 rounded-lg hover:bg-gray-100 transition duration-150"
            onClick={() => setShowNotifications(prev => !prev)}
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {userNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                {userNotifications.length}
              </span>
            )}
          </button>
          <Notification
            visible={showNotifications}
            onClose={() => setShowNotifications(false)}
            notifications={userNotifications}
          />
          <NavLink to="/profile" className="flex items-center space-x-3">
            <img
              src={user?.avatar || userLogo}
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'Guest'}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role || 'unknown'}</p>
            </div>
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Header;