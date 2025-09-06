import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import NewLanding from "./components/NewLanding";
import CleanStudentLogin from "./components/CleanStudentLogin";
import CleanInstructorLogin from "./components/CleanInstructorLogin";
import CleanEducatorSignup from "./components/CleanEducatorSignup";
import CleanStudentSignup from "./components/CleanStudentSignup";
import CleanStudentDashboard from "./components/CleanStudentDashboard";
import CleanInstructorDashboard from "./components/CleanInstructorDashboard";
import AdminDashboard from "./components/AdminDashboard";
import PublicRoute from "./components/PublicRoute";

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
        return <Navigate to="/dashboard-instructor" replace />;
      case 'student':
        return <Navigate to="/dashboard-student" replace />;
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
            
            {/* Protected routes */}
            <Route
              path="/dashboard-instructor"
              element={
                <ProtectedRoute allowedRoles={['instructor']}>
                  <CleanInstructorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard-student"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <CleanStudentDashboard />
                </ProtectedRoute>
              }
            />
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