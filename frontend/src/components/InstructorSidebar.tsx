import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  DollarSign, 
  Users, 
  Globe, 
  Settings, 
  HelpCircle,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface InstructorSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const InstructorSidebar: React.FC<InstructorSidebarProps> = ({ 
  currentView, 
  onViewChange 
}) => {
  const { user, logout } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (menuKey: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const menuItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      hasSubmenu: false
    },
    {
      key: 'courses',
      label: 'Courses',
      icon: BookOpen,
      hasSubmenu: false
    },
    {
      key: 'sales',
      label: 'Sales',
      icon: DollarSign,
      hasSubmenu: false
    },
    {
      key: 'students',
      label: 'Students',
      icon: Users,
      hasSubmenu: false
    },
    {
      key: 'website',
      label: 'Website',
      icon: Globe,
      hasSubmenu: false
    }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-20 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
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
                onClick={() => {
                  if (item.hasSubmenu) {
                    toggleMenu(item.key);
                  } else {
                    onViewChange(item.key);
                  }
                }}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentView === item.key || (item.hasSubmenu && expandedMenus[item.key])
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <item.icon size={20} className="flex-shrink-0" />
                <span className="ml-3 flex-1 text-left">{item.label}</span>
                {item.hasSubmenu && (
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform ${
                      expandedMenus[item.key] ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </button>
            </div>
          ))}
        </div>
      </nav>
      
      {/* Bottom Menu Items */}
      <div className="space-y-1 px-3 py-4 border-t border-gray-200">
        <button
          onClick={() => onViewChange('settings')}
          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            currentView === 'settings'
              ? 'bg-purple-50 text-purple-700'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Settings size={20} className="flex-shrink-0" />
          <span className="ml-3 flex-1 text-left">Settings</span>
        </button>
        
        <button
          onClick={() => onViewChange('support')}
          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            currentView === 'support'
              ? 'bg-purple-50 text-purple-700'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
          }`}
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

export default InstructorSidebar;