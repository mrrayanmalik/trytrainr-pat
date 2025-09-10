import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  MessageCircle, 
  Video, 
  Target, 
  Settings, 
  HelpCircle,
  LogOut,
  Home,
  Trophy
} from 'lucide-react';

const StudentSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: 'courses',
      label: 'My Courses',
      icon: BookOpen,
      path: '/student/courses',
      hasSubmenu: false
    },
    {
      key: 'community',
      label: 'Community',
      icon: MessageCircle,
      path: '/student/community',
      hasSubmenu: false
    },
    {
      key: 'live-calls',
      label: 'Live Sessions',
      icon: Video,
      path: '/student/live-calls',
      hasSubmenu: false
    },
    {
      key: 'progress',
      label: 'Progress',
      icon: Target,
      path: '/student/progress',
      hasSubmenu: false
    },
    {
      key: 'achievements',
      label: 'Achievements',
      icon: Trophy,
      path: '/student/achievements',
      hasSubmenu: false
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-20 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="text-xl font-bold text-gray-900">trainr</span>
        </div>
        <div>
          <p className="text-sm text-gray-600">Welcome back,</p>
          <p className="font-semibold text-gray-900">{user?.firstName}!</p>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-3">
          {menuItems.map((item) => (
            <div key={item.key}>
              <button
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <item.icon size={20} className="flex-shrink-0" />
                <span className="ml-3 flex-1 text-left">{item.label}</span>
              </button>
            </div>
          ))}
        </div>
      </nav>
      
      {/* Bottom Menu Items */}
      <div className="space-y-1 px-3 py-4 border-t border-gray-200">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <Home size={20} className="flex-shrink-0" />
          <span className="ml-3 flex-1 text-left">Home</span>
        </button>

        <button
          onClick={() => navigate('/student/settings')}
          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            isActive('/student/settings')
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Settings size={20} className="flex-shrink-0" />
          <span className="ml-3 flex-1 text-left">Settings</span>
        </button>
        
        <button
          onClick={() => alert('Support page coming soon!')}
          className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <HelpCircle size={20} className="flex-shrink-0" />
          <span className="ml-3 flex-1 text-left">Support</span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} className="flex-shrink-0" />
          <span className="ml-3 flex-1 text-left">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default StudentSidebar;