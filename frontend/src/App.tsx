import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import NewLanding from "./components/NewLanding";
import CleanStudentLogin from "./components/CleanStudentLogin";
import CleanInstructorLogin from "./components/CleanInstructorLogin";
import CleanEducatorSignup from "./components/CleanEducatorSignup";
import CleanStudentSignup from "./components/CleanStudentSignup";
import PublicRoute from "./components/PublicRoute";

// Import instructor components
import InstructorLayout from "./components/InstructorLayout";
import CleanInstructorDashboard from "./components/CleanInstructorDashboard";
import ManageCourses from "./components/ManageCourses";
import InstructorSales from "./components/InstructorSales";
import InstructorStudents from "./components/InstructorStudents";
import InstructorWebsite from "./components/InstructorWebsite";
import InstructorSettings from "./components/InstructorSettings";

// Import student components
import StudentLayout from "./components/StudentLayout";
import CleanStudentDashboard from "./components/CleanStudentDashboard";
import StudentCommunity from "./components/StudentCommunity";
import StudentLiveCalls from "./components/StudentLiveCalls";
import StudentProgress from "./components/StudentProgress";
import StudentSettings from "./components/StudentSettings";

import AdminDashboard from "./components/AdminDashboard";

// Component to handle redirects based on user role
const AuthRedirect: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (user) {
    switch (user.role) {
      case 'instructor':
        return <Navigate to="/instructor" replace />;
      case 'student':
        return <Navigate to="/student" replace />;
      case 'admin':
        return <Navigate to="/admin" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <NewLanding />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<AuthRedirect />} />
            
            {/* Auth routes - wrapped with PublicRoute */}
            <Route
              path="/login/instructor"
              element={
                <PublicRoute>
                  <CleanInstructorLogin />
                </PublicRoute>
              }
            />
            <Route
              path="/login/student"
              element={
                <PublicRoute>
                  <CleanStudentLogin />
                </PublicRoute>
              }
            />
            <Route
              path="/signup/instructor"
              element={
                <PublicRoute>
                  <CleanEducatorSignup />
                </PublicRoute>
              }
            />
            <Route
              path="/signup/student"
              element={
                <PublicRoute>
                  <CleanStudentSignup />
                </PublicRoute>
              }
            />
            
            {/* Instructor Protected Routes */}
            <Route
              path="/instructor"
              element={
                <ProtectedRoute allowedRoles={['instructor']}>
                  <InstructorLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<CleanInstructorDashboard />} />
              <Route path="courses" element={<ManageCourses />} />
              <Route path="sales" element={<InstructorSales />} />
              <Route path="students" element={<InstructorStudents />} />
              <Route path="website" element={<InstructorWebsite />} />
              <Route path="settings" element={<InstructorSettings />} />
            </Route>
            
            {/* Student Protected Routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="courses" replace />} />
              <Route path="courses" element={<CleanStudentDashboard />} />
              <Route path="community" element={<StudentCommunity />} />
              <Route path="live-calls" element={<StudentLiveCalls />} />
              <Route path="progress" element={<StudentProgress />} />
              <Route path="settings" element={<StudentSettings />} />
            </Route>
            
            {/* Admin Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;