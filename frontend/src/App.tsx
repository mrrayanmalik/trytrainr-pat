import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NewLanding from "./components/NewLanding";
import CleanStudentLogin from "./components/CleanStudentLogin";
import CleanInstructorLogin from "./components/CleanInstructorLogin";
import CleanEducatorSignup from "./components/CleanEducatorSignup";
import CleanStudentSignup from "./components/CleanStudentSignup";

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<NewLanding />} />
          
          {/* Separate login pages */}
          <Route path="/login/instructor" element={<CleanInstructorLogin />} />
          <Route path="/login/student" element={<CleanStudentLogin />} />
          
          {/* Signup pages */}
          <Route path="/signup/instructor" element={<CleanEducatorSignup />} />
          <Route path="/signup/student" element={<CleanStudentSignup />} />
          
          {/* Placeholder dashboard routes */}
          <Route path="/dashboard-instructor" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Instructor Dashboard - Coming Soon!</h1></div>} />
          <Route path="/dashboard-student" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Student Dashboard - Coming Soon!</h1></div>} />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<NewLanding />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
// } from "react-router-dom";
// import Hero from "./components/Hero";
// import InstructorDashboard from "./components/InstructorDashboard";
// import StudentDashboard from "./components/StudentDashboard";
// import Login from "./components/Login";
// import Header from "./components/Header";
// import Footer from "./components/Footer";

// function App() {
//   // Dummy handlers for now
//   const handleLogin = () => {
//     console.log('Login clicked - will implement later')
//   }

//   const handleViewChange = (view: string) => {
//     console.log('View change:', view)
//   }

//   const handleShowEducatorSignup = () => {
//     console.log('Show educator signup')
//   }

//   const handleShowStudentSignup = () => {
//     console.log('Show student signup')
//   }

//   return (
//     <Router>
//       <div className="min-h-screen bg-gray-50">
//         {/* <Header /> */}
        
//         <Routes>
//           {/* Landing Page */}
//           <Route 
//             path="/" 
//             element={
//               <Hero 
//                 onLogin={handleLogin}
//                 onShowEducatorSignup={handleShowEducatorSignup}
//               />
//             } 
//           />
          
//           {/* Login Pages */}
//           <Route 
//             path="/login" 
//             element={
//               <Login 
//                 onLogin={handleLogin}
//                 onShowEducatorSignup={handleShowEducatorSignup}
//                 onShowStudentSignup={handleShowStudentSignup}
//               />
//             } 
//           />
          
//           {/* Dashboard Pages - add empty props if needed */}
//           <Route path="/dashboard-instructor" element={<InstructorDashboard instructorData={undefined} />} />
//           <Route path="/dashboard-student" element={<StudentDashboard />} />
          
//           {/* Catch all - redirect to home */}
//           <Route path="*" element={<Hero onLogin={handleLogin} onShowEducatorSignup={handleShowEducatorSignup} />} />
//         </Routes>
        
//         <Footer />
//       </div>
//     </Router>
//   );
// }

// export default App;