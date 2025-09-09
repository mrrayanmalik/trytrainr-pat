import React from 'react';
import { Video, Calendar, Clock, Users, Bell, CalendarIcon } from 'lucide-react';

const StudentLiveCalls: React.FC = () => {
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
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Live Calls</h2>
        <p className="text-gray-600 mt-2">Join live sessions with your instructor and peers</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Upcoming Sessions</p>
              <p className="text-3xl font-bold text-green-900">2</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Sessions Attended</p>
              <p className="text-3xl font-bold text-blue-900">8</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Total Hours</p>
              <p className="text-3xl font-bold text-purple-900">12</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {liveCalls.map((call) => (
          <div key={call.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{call.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    call.status === 'upcoming' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {call.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">with {call.instructor}</p>
                <div className="flex items-center space-x-6 text-sm text-gray-500">
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
                <div className="mt-3">
                  <span className="text-blue-600 text-sm font-medium">{call.course}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => alert("Join call functionality")}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                >
                  <Video className="w-5 h-5" />
                  <span>Join Call</span>
                </button>
                <button 
                  onClick={() => alert("Set reminder functionality")}
                  className="border border-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300"
                >
                  <Bell className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentLiveCalls;