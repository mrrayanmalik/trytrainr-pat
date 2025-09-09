import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  MessageCircle, 
  Video, 
  Target, 
  Settings, 
  User, 
  ArrowLeft, 
  LogOut 
} from 'lucide-react';

interface StudentSidebarProps {
  progress: {
    coursesEnrolled: number;
    coursesCompleted: number;
    totalHours: number;
    currentStreak: number;
  };
}

const StudentSidebar: React.FC<StudentSidebarProps> = ({ progress }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "courses", label: "My Courses", icon: BookOpen, path: "/student/courses" },
    { id: "community", label: "Community", icon: MessageCircle, path: "/student/community" },
    { id: "live-calls", label: "Live Calls", icon: Video, path: "/student/live-calls" },
    { id: "progress", label: "Progress", icon: Target, path: "/student/progress" },
    { id: "settings", label: "Settings", icon: Settings, path: "/student/settings" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="w-80 flex flex-col p-8 text-white bg-gradient-to-br from-blue-500 via-teal-500 to-green-500">
      <div className="mb-12">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <User className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-bold">Trainr</span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-blue-100">Student Learning Portal</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">
              {progress.coursesEnrolled}
            </div>
            <div className="text-blue-100 text-sm">Enrolled</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">
              {progress.coursesCompleted}
            </div>
            <div className="text-blue-100 text-sm">Completed</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{progress.totalHours}</div>
            <div className="text-blue-100 text-sm">Hours</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">
              {progress.currentStreak}
            </div>
            <div className="text-blue-100 text-sm">Day Streak</div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.path)}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
              isActive(item.path)
                ? "bg-white/20 backdrop-blur-sm text-white border border-white/30"
                : "text-blue-100 hover:text-white hover:bg-white/10"
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="space-y-3 mt-8">
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-3" />
          Back to Home
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default StudentSidebar;