import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Video, 
  MessageCircle, 
  Calendar, 
  Star, 
  Clock, 
  Play, 
  Award, 
  Target, 
  Settings, 
  User, 
  ArrowLeft, 
  LogOut, 
  Users, 
  Bell, 
  MoreVertical, 
  Send, 
  Camera, 
  Download, 
  Globe, 
  Eye, 
  Calendar as CalendarIcon, 
  FileText, 
  Trophy, 
  Zap, 
  Loader2 
} from 'lucide-react';
import { studentCourseService, StudentCourse } from '../services/studentCourseService';
import StudentLearningView from './StudentLearningView';

const CleanStudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState<StudentCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [progress, setProgress] = useState({
    coursesEnrolled: 0,
    coursesCompleted: 0,
    totalHours: 0,
    currentStreak: 7, // This could be calculated based on actual progress
  });

  useEffect(() => {
    loadEnrolledCourses();
  }, []);

  const loadEnrolledCourses = async () => {
    try {
      setLoading(true);
      const courses = await studentCourseService.getEnrolledCourses();
      setEnrolledCourses(courses);
      
      // Calculate progress stats
      const completedCourses = courses.filter(course => course.progressPercentage === 100).length;
      const totalHours = courses.reduce((sum, course) => {
        // Estimate hours based on lessons (assuming 10 minutes per lesson)
        return sum + ((course.totalLessons || 0) * 10 / 60);
      }, 0);

      setProgress({
        coursesEnrolled: courses.length,
        coursesCompleted: completedCourses,
        totalHours: Math.round(totalHours),
        currentStreak: 7, // This would come from actual streak tracking
      });
    } catch (error) {
      console.error('Error loading enrolled courses:', error);
      // Fallback to show empty state instead of error
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (courseId: string) => {
    setSelectedCourseId(courseId);
  };

  const handleBackFromCourse = () => {
    setSelectedCourseId(null);
    // Reload courses to get updated progress
    loadEnrolledCourses();
  };

  // If viewing a specific course, show the learning view
  if (selectedCourseId) {
    return (
      <StudentLearningView 
        courseId={selectedCourseId} 
        onBack={handleBackFromCourse}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">My Courses</h2>
        <p className="text-gray-600 mt-2">Continue your learning journey</p>
      </div>

      {/* Progress Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Courses Enrolled</p>
              <p className="text-3xl font-bold text-blue-900">{progress.coursesEnrolled}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Completed</p>
              <p className="text-3xl font-bold text-green-900">{progress.coursesCompleted}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Learning Hours</p>
              <p className="text-3xl font-bold text-purple-900">{progress.totalHours}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-sm border border-yellow-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Current Streak</p>
              <p className="text-3xl font-bold text-yellow-900">{progress.currentStreak} days</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Course Cards */}
      {enrolledCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses enrolled yet</h3>
          <p className="text-gray-600 mb-6">Browse available courses in your community to get started</p>
          <button
            onClick={() => navigate("/student/community")}
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {enrolledCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => handleCourseClick(course.id)}
            >
              <div className="relative">
                <img
                  src={course.thumbnail_url || "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400"}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300">
                  <button className="bg-white/95 backdrop-blur-sm p-4 rounded-full hover:bg-white hover:scale-110 transition-all duration-300">
                    <Play className="w-8 h-8 text-blue-600" />
                  </button>
                </div>
                <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {course.progressPercentage || 0}% Complete
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4">
                  by {course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'Instructor'}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
                  <span>{course.completedLessons || 0}/{course.totalLessons || 0} lessons</span>
                  <span className="font-medium">{course.progressPercentage || 0}% complete</span>
                </div>

                <div className="mb-6">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${course.progressPercentage || 0}%` }}
                    ></div>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
                  Continue Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate("/student/community")}
            className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 hover:border-blue-300 transition-all duration-300 text-left"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-300">
              <MessageCircle className="w-6 h-6 text-blue-600 group-hover:text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Join Community</h4>
            <p className="text-sm text-gray-600">Connect with other students</p>
          </button>

          <button
            onClick={() => navigate("/student/live-calls")}
            className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 hover:border-green-300 transition-all duration-300 text-left"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500 group-hover:scale-110 transition-all duration-300">
              <Calendar className="w-6 h-6 text-green-600 group-hover:text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Live Sessions</h4>
            <p className="text-sm text-gray-600">Join upcoming live calls</p>
          </button>

          <button
            onClick={() => navigate("/student/progress")}
            className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 hover:border-purple-300 transition-all duration-300 text-left"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500 group-hover:scale-110 transition-all duration-300">
              <Star className="w-6 h-6 text-purple-600 group-hover:text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Achievements</h4>
            <p className="text-sm text-gray-600">View your progress</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CleanStudentDashboard;