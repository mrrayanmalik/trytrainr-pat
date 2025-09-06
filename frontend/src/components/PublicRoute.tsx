import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // If user is logged in, redirect to their dashboard
  if (user) {
    const redirectMap = {
      instructor: '/dashboard-instructor',
      student: '/dashboard-student',
      admin: '/admin'
    };
    return <Navigate to={redirectMap[user.role] || '/'} replace />;
  }

  // If not logged in, show the auth page
  return <>{children}</>;
};

export default PublicRoute;