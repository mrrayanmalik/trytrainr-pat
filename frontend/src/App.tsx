import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Hero from "./components/Hero";
import InstructorDashboard from "./components/InstructorDashboard";
import StudentDashboard from "./components/StudentDashboard";
import Login from "./components/Login";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  // Dummy handlers for now
  const handleLogin = () => {
    console.log('Login clicked - will implement later')
  }

  const handleViewChange = (view: string) => {
    console.log('View change:', view)
  }

  const handleShowEducatorSignup = () => {
    console.log('Show educator signup')
  }

  const handleShowStudentSignup = () => {
    console.log('Show student signup')
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* <Header /> */}
        
        <Routes>
          {/* Landing Page */}
          <Route 
            path="/" 
            element={
              <Hero 
                onLogin={handleLogin}
                onShowEducatorSignup={handleShowEducatorSignup}
              />
            } 
          />
          
          {/* Login Pages */}
          <Route 
            path="/login" 
            element={
              <Login 
                onLogin={handleLogin}
                onShowEducatorSignup={handleShowEducatorSignup}
                onShowStudentSignup={handleShowStudentSignup}
              />
            } 
          />
          
          {/* Dashboard Pages - add empty props if needed */}
          <Route path="/dashboard-instructor" element={<InstructorDashboard instructorData={undefined} />} />
          <Route path="/dashboard-student" element={<StudentDashboard studentData={undefined} />} />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Hero onLogin={handleLogin} onShowEducatorSignup={handleShowEducatorSignup} />} />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;