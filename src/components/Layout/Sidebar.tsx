import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/geezjobs_logo.jpg';
import userLogo from '../../assets/user_logo.jpg';
import { 
  Home, 
  Users, 
  Calendar, 
  Clock, 
  DollarSign, 
  Settings, 
  LogOut,
  Briefcase,
  UserCheck,
  Building,
  Megaphone,
  CalendarClock,
  Building2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  // const location = useLocation();

  const getNavigationItems = () => {
    const baseItems = [
      { path: '/dashboard', icon: Home, label: 'Dashboard' }
    ];

    if (user?.role === 'employee') {
      return [
        ...baseItems,
        // { path: '/profile', icon: User, label: 'Profile' },
        { path: '/attendance', icon: Clock, label: 'Attendance' },
        { path: '/leaves', icon: Calendar, label: 'Leave Management' },
        { path: '/payroll', icon: DollarSign, label: 'Payroll' }
        // { path: '/notifications', icon: AlertTriangle, label: 'Notifications' }
      ];
    } else if (user?.role === 'hr') {
      return [
        ...baseItems,
        { path: '/employees', icon: Users, label: 'Employees' },
        { path: '/attendance-overview', icon: UserCheck, label: 'Attendance' },
        { path: '/leave-management', icon: CalendarClock, label: 'Leave Requests' },
        { path: '/payroll-management', icon: DollarSign, label: 'Payroll' },
        { path: '/job-post', icon: Megaphone, label: 'Job Post' },
        { path: '/recruitment', icon: Briefcase, label: 'Recruitment' }
        
      ];
    } else if (user?.role === 'admin') {
      return [
        ...baseItems,
        { path: '/user-records', icon: Users, label: 'User Records' },
        { path: '/company-records', icon: Building2, label: 'Company Records' },
        { path: '/job-postings', icon: Briefcase, label: 'Job Postings' }
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white shadow-lg transform transition-all duration-300 ease-in-out z-50 group
        ${isOpen ? 'w-64 translate-x-0' : 'w-16 -translate-x-full'}
        lg:translate-x-0 lg:w-16 lg:hover:w-64
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <NavLink
           to="/dashboard"
           className="p-4 bg-gradient-to-r from-[#72c02c] to-[#73c03c] flex items-center">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
               <img src={logo} alt="logo" className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="ml-3 overflow-hidden transition-all duration-300 lg:opacity-0 lg:w-0 lg:group-hover:opacity-100 lg:group-hover:w-auto">
              <h1 className="text-white font-bold text-lg whitespace-nowrap">HR System</h1>
              <p className="text-emerald-100 text-sm capitalize whitespace-nowrap">{user?.role}</p>
            </div>
          </NavLink>

          {/* User Profile */}
          <NavLink 
            to="/profile"
            className="p-4 bg-gray-50 border-b flex items-center">
            <img 
              src={user?.avatar || userLogo} 
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div className="ml-3 overflow-hidden transition-all duration-300 lg:opacity-0 lg:w-0 lg:group-hover:opacity-100 lg:group-hover:w-auto">
              <p className="text-sm font-medium text-gray-900 truncate whitespace-nowrap">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate whitespace-nowrap">{user?.position}</p>
            </div>
          </NavLink>

          {/* Navigation */}
          <nav className="flex-1 p-2">
            <ul className="space-y-1">
              {navigationItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-3 rounded-lg transition-all duration-200 group/item relative ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                    onClick={() => window.innerWidth < 1024 && onClose()}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="ml-3 font-medium overflow-hidden transition-all duration-300 lg:opacity-0 lg:w-0 lg:group-hover:opacity-100 lg:group-hover:w-auto whitespace-nowrap">
                      {item.label}
                    </span>
                    
                    {/* Tooltip for collapsed state */}
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 pointer-events-none transition-opacity duration-200 lg:group-hover/item:opacity-0 lg:group-hover:group-hover/item:opacity-0 lg:group-hover/item:opacity-100 lg:group-hover:group-hover/item:opacity-0 whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-2 border-t">
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 group/logout relative"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="ml-3 font-medium overflow-hidden transition-all duration-300 lg:opacity-0 lg:w-0 lg:group-hover:opacity-100 lg:group-hover:w-auto whitespace-nowrap">
                Logout
              </span>
              
              {/* Tooltip for collapsed state */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 pointer-events-none transition-opacity duration-200 lg:group-hover/logout:opacity-0 lg:group-hover:group-hover/logout:opacity-0 lg:group-hover/logout:opacity-100 lg:group-hover:group-hover/logout:opacity-0 whitespace-nowrap z-50">
                Logout
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;