import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Users, Video, Award, Calendar, MessageCircle, TrendingUp, Clock } from 'lucide-react';

const CleanStudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
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
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-600">Ready to continue your learning journey?</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">5</p>
                <p className="text-gray-600 text-sm">Courses Enrolled</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">78%</p>
                <p className="text-gray-600 text-sm">Average Progress</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">24h</p>
                <p className="text-gray-600 text-sm">This Week</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-gray-600 text-sm">Certificates</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Continue Learning */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Continue Learning</h2>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Advanced JavaScript</h3>
                      <p className="text-gray-600 text-sm">Chapter 5: Async Programming</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">85% complete</div>
                      <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                        <div className="w-[85%] h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">React Fundamentals</h3>
                      <p className="text-gray-600 text-sm">Chapter 3: State Management</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">65% complete</div>
                      <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                        <div className="w-[65%] h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Live Sessions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Live Sessions</h2>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">JavaScript Q&A Session</p>
                    <p className="text-sm text-gray-600">Today at 3:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <Video className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">React Workshop</p>
                    <p className="text-sm text-gray-600">Tomorrow at 2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Community Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <MessageCircle className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">New discussion in React group</p>
                    <p className="text-xs text-gray-600">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">5 new members joined</p>
                    <p className="text-xs text-gray-600">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                  Browse Courses
                </button>
                <button className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                  Join Community
                </button>
                <button className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors">
                  View Certificates
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanStudentDashboard;