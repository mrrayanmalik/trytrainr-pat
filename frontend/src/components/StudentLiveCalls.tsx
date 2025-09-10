import React, { useState } from 'react';
import { Video, Calendar, Clock, Users, Bell, CalendarIcon, RefreshCw, Download, ArrowUp } from 'lucide-react';

const StudentLiveCalls: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');

  const liveCalls = [
    {
      id: 1,
      title: "React State Management Q&A",
      instructor: "Test Instructor",
      date: "Today",
      time: "3:00 PM - 4:00 PM",
      status: "upcoming",
      participants: 45,
      course: "React Masterclass"
    },
    {
      id: 2,
      title: "JavaScript Advanced Concepts",
      instructor: "Test Instructor",
      date: "Tomorrow",
      time: "2:00 PM - 3:00 PM",
      status: "upcoming",
      participants: 32,
      course: "JavaScript Fundamentals"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live Sessions</h1>
          <p className="text-gray-600 mt-2">Join live sessions with your instructor and peers</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming Sessions</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className="flex items-center text-green-600">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+1</span>
            </div>
            <span className="text-sm text-gray-600 ml-2">this week</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sessions Attended</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Video className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className="flex items-center text-green-600">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+2</span>
            </div>
            <span className="text-sm text-gray-600 ml-2">this month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-gray-900">12h</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className="flex items-center text-green-600">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+3h</span>
            </div>
            <span className="text-sm text-gray-600 ml-2">this week</span>
          </div>
        </div>
      </div>

      {/* Live Calls List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Scheduled Sessions</h3>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export Schedule
          </button>
        </div>

        <div className="space-y-4">
          {liveCalls.map((call) => (
            <div key={call.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{call.title}</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      call.status === 'upcoming' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {call.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">with {call.instructor}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{call.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{call.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>{call.participants} participants</span>
                    </div>
                  </div>
                  <div>
                    <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">{call.course}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => alert("Join call functionality")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Video className="w-5 h-5" />
                    <span>Join Call</span>
                  </button>
                  <button 
                    onClick={() => alert("Set reminder functionality")}
                    className="border border-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentLiveCalls;