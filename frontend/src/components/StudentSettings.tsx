import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Download, Eye, Globe, RefreshCw, Camera } from 'lucide-react';

const StudentSettings: React.FC = () => {
  const { user } = useAuth();
  const [notificationSettings, setNotificationSettings] = useState({
    courseUpdates: true,
    liveCallReminders: true,
    communityActivity: true,
    achievementUnlocked: false,
    weeklyProgress: false
  });

  const toggleNotification = (key: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account and preferences</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Profile Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <img
                  src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <button 
                    onClick={() => alert("Change photo functionality")}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                  </button>
                  <p className="text-sm text-gray-500 mt-1">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user?.firstName}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="City, Country"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  placeholder="Tell us about yourself..."
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button 
                onClick={() => alert("Save changes functionality")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
            <div className="space-y-6">
              {[
                { key: 'courseUpdates', label: "Course Updates", description: "Get notified about new lessons and content" },
                { key: 'liveCallReminders', label: "Live Call Reminders", description: "Receive notifications before live sessions" },
                { key: 'communityActivity', label: "Community Activity", description: "Updates from community discussions" },
                { key: 'achievementUnlocked', label: "Achievement Unlocked", description: "When you earn new badges and certificates" },
                { key: 'weeklyProgress', label: "Weekly Progress", description: "Your weekly learning summary" }
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{setting.label}</h4>
                    <p className="text-sm text-gray-500">{setting.description}</p>
                  </div>
                  <button
                    onClick={() => toggleNotification(setting.key)}
                    className="relative"
                  >
                    <div className={`w-12 h-6 rounded-full transition-colors ${
                      notificationSettings[setting.key as keyof typeof notificationSettings] ? 'bg-blue-600' : 'bg-gray-300'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform transform ${
                        notificationSettings[setting.key as keyof typeof notificationSettings] ? 'translate-x-6' : 'translate-x-1'
                      } mt-0.5`}></div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Account Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Actions</h3>
            <div className="space-y-4">
              <button 
                onClick={() => alert("Export data functionality")}
                className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Download className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Export Data</span>
                </div>
                <span className="text-blue-600">→</span>
              </button>

              <button 
                onClick={() => alert("Privacy settings functionality")}
                className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Eye className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900">Privacy Settings</span>
                </div>
                <span className="text-green-600">→</span>
              </button>

              <button 
                onClick={() => alert("Language & region functionality")}
                className="w-full flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-900">Language & Region</span>
                </div>
                <span className="text-purple-600">→</span>
              </button>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
            <p className="text-gray-600 mb-6">Our support team is here to help you with any questions or issues.</p>
            <button 
              onClick={() => alert("Contact support functionality")}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSettings;