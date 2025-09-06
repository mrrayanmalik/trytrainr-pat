import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Users, Video, BarChart3, DollarSign, Calendar, MessageCircle, Plus } from 'lucide-react';

const CleanInstructorDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900">trainr</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.firstName}!</span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}! 🚀
          </h1>
          <p className="text-gray-600">Manage your courses and grow your teaching business</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">1,247</p>
                <p className="text-gray-600 text-sm">Total Students</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">$8,542</p>
                <p className="text-gray-600 text-sm">This Month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-gray-600 text-sm">Active Courses</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">94%</p>
                <p className="text-gray-600 text-sm">Completion Rate</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Management */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Your Courses</h2>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  New Course
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Advanced JavaScript Mastery</h3>
                      <p className="text-gray-600 text-sm">284 students • 4.8/5 rating</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">$2,840</div>
                      <div className="text-sm text-gray-600">This month</div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">React Development Bootcamp</h3>
                      <p className="text-gray-600 text-sm">156 students • 4.9/5 rating</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">$1,560</div>
                      <div className="text-sm text-gray-600">This month</div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Node.js Backend Development</h3>
                      <p className="text-gray-600 text-sm">98 students • 4.7/5 rating</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">$980</div>
                      <div className="text-sm text-gray-600">This month</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Schedule */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Live Sessions</h2>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">JavaScript Q&A Session</p>
                    <p className="text-sm text-gray-600">Today at 3:00 PM • 45 students registered</p>
                  </div>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    Start
                  </button>
                </div>
                
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <Video className="w-5 h-5 text-green-600 mr-3" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">React Workshop</p>
                    <p className="text-sm text-gray-600">Tomorrow at 2:00 PM • 32 students registered</p>
                  </div>
                  <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">15 new students enrolled</p>
                    <p className="text-xs text-gray-600">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">New question in course forum</p>
                    <p className="text-xs text-gray-600">4 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                    <BarChart3 className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Course completion rate increased</p>
                    <p className="text-xs text-gray-600">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                  Create New Course
                </button>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Schedule Live Session
                </button>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                  View Analytics
                </button>
                <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                  Manage Students
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanInstructorDashboard;