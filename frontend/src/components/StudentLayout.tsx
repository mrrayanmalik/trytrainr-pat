import React from 'react';
import { Outlet } from 'react-router-dom';
import CleanStudentSidebar from './StudentSidebar';
import StudentSidebar from './StudentSidebar';

const StudentLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout;