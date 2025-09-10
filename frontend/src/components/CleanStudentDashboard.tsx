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
  Users, 
  ArrowUp,
  Download,
  RefreshCw,
  ChevronRight,
  Plus,
  Loader2,
  Trophy,
  Zap,
  TrendingUp,
  Activity,
  Settings
} from 'lucide-react';
import { studentCourseService, StudentCourse } from '../services/studentCourseService';
import StudentLearningView from './StudentLearningView';

const CleanStudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState<StudentCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [progress, setProgress] = useState({
    coursesEnrolled: 0,
    coursesCompleted: 0,
    totalHours: 0,
    currentStreak: 7,
    weeklyGoal: 80,
    weeklyProgress: 65
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
        return sum + ((course.totalLessons || 0) * 10 / 60);
      }, 0);

      setProgress(prev => ({
        ...prev,
        coursesEnrolled: courses.length,
        coursesCompleted: completedCourses,
        totalHours: Math.round(totalHours)
      }));
    } catch (error) {
      console.error('Error loading enrolled courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (courseId: string) => {
    setSelectedCourseId(courseId);
  };

  const handleBackFromCourse = () => {
    setSelectedCourseId(null);
    loadEnrolledCourses();
  };

  // Recent activity mock data
  const recentActivity = [
    { type: 'course', message: 'Completed lesson: React Hooks', course: 'React Development', time: '2 min ago' },
    { type: 'achievement', message: 'Earned badge: Fast Learner', time: '1 hour ago' },
    { type: 'community', message: 'New reply in discussion', course: 'JavaScript Fundamentals', time: '3 hours ago' },
    { type: 'streak', message: '7-day learning streak maintained', time: '1 day ago' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'course': return BookOpen;
      case 'achievement': return Trophy;
      case 'community': return MessageCircle;
      case 'streak': return Zap;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'course': return 'bg-blue-100 text-blue-600';
      case 'achievement': return 'bg-yellow-100 text-yellow-600';
      case 'community': return 'bg-green-100 text-green-600';
      case 'streak': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
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
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Learning Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your progress and continue learning</p>
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
            <option value="1y">Last year</option>
          </select>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Courses Enrolled</p>
              <p className="text-2xl font-bold text-gray-900">{progress.coursesEnrolled}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
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
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{progress.coursesCompleted}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className="flex items-center text-green-600">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+1</span>
            </div>
            <span className="text-sm text-gray-600 ml-2">this month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Learning Hours</p>
              <p className="text-2xl font-bold text-gray-900">{progress.totalHours}h</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className="flex items-center text-green-600">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+5h</span>
            </div>
            <span className="text-sm text-gray-600 ml-2">this week</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900">{progress.currentStreak} days</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className="flex items-center text-green-600">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+2</span>
            </div>
            <span className="text-sm text-gray-600 ml-2">vs last week</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Course Progress */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">My Courses</h3>
            <button
              onClick={() => navigate("/student/community")}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              Browse All
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No courses enrolled yet</h4>
              <p className="text-gray-600 mb-4">Start your learning journey by enrolling in a course</p>
              <button
                onClick={() => navigate("/student/community")}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Courses
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {enrolledCourses.slice(0, 3).map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleCourseClick(course.id)}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={course.thumbnail_url || "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=100"}
                      alt={course.title}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{course.title}</h4>
                      <p className="text-sm text-gray-600">{course.completedLessons || 0}/{course.totalLessons || 0} lessons</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{course.progressPercentage || 0}%</div>
                    <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${course.progressPercentage || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats & Goals */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Goal</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Learning Progress</span>
                  <span className="font-medium">{progress.weeklyProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full" style={{ width: `${progress.weeklyProgress}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{Math.round(progress.weeklyProgress * progress.weeklyGoal / 100)} of {progress.weeklyGoal} minutes this week</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-600 mr-3" />
                  <span className="text-sm text-gray-600">Certificates</span>
                </div>
                <span className="font-medium text-gray-900">{progress.coursesCompleted}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Trophy className="w-5 h-5 text-purple-600 mr-3" />
                  <span className="text-sm text-gray-600">Achievements</span>
                </div>
                <span className="font-medium text-gray-900">{Math.floor(progress.coursesCompleted * 2.5)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-sm text-gray-600">Study Groups</span>
                </div>
                <span className="font-medium text-gray-900">3</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-sm text-gray-600">Live Sessions</span>
                </div>
                <span className="font-medium text-gray-900">2</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const IconComponent = getActivityIcon(activity.type);
              return (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    {activity.course && (
                      <p className="text-xs text-gray-600 mt-1">in {activity.course}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Upcoming Sessions</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Video className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">React Advanced Concepts</h4>
                  <p className="text-xs text-gray-600">Today at 2:00 PM</p>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Join</button>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Study Group Discussion</h4>
                  <p className="text-xs text-gray-600">Tomorrow at 6:00 PM</p>
                </div>
              </div>
              <button className="text-sm text-green-600 hover:text-green-700 font-medium">Join</button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate("/student/community")}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <Plus className="w-8 h-8 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Browse Courses</h4>
            <p className="text-sm text-gray-600">Find new courses to enroll</p>
          </button>
          <button
            onClick={() => navigate("/student/live-calls")}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <Calendar className="w-8 h-8 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Join Live Session</h4>
            <p className="text-sm text-gray-600">Attend upcoming live calls</p>
          </button>
          <button
            onClick={() => navigate("/student/community")}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <MessageCircle className="w-8 h-8 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Join Discussion</h4>
            <p className="text-sm text-gray-600">Connect with other students</p>
          </button>
          <button
            onClick={() => navigate("/student/progress")}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <Settings className="w-8 h-8 text-gray-600 mb-2" />
            <h4 className="font-medium text-gray-900">View Progress</h4>
            <p className="text-sm text-gray-600">Track your achievements</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CleanStudentDashboard;