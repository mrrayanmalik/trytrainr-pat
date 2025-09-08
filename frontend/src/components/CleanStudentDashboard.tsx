import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import StudentSidebar from './StudentSidebar';
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

// Mock data from StudentDashboard
const MOCK_DATA = {
  communityPosts: [
    {
      id: 1,
      author: "John Doe",
      avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100",
      content: "Just completed the React Hooks module! The useState examples were really helpful. Anyone else working through this?",
      timestamp: "2 hours ago",
      likes: 12,
      replies: 5,
      course: "React Masterclass",
      courseId: 3,
      type: "discussion"
    },
    {
      id: 2,
      author: "Sarah Johnson",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100",
      content: "Quick question about async/await in the JavaScript course. How do you handle multiple API calls efficiently?",
      timestamp: "4 hours ago",
      likes: 8,
      replies: 12,
      course: "Advanced JavaScript",
      courseId: 2,
      type: "discussion"
    }
  ],
  announcements: [
    {
      id: 1,
      author: "Test Instructor",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
      title: "New Assignment Released - React Components",
      content: "I've just released a new assignment focusing on React component composition. Please check the course materials and submit by Friday.",
      timestamp: "1 hour ago",
      course: "React Masterclass",
      courseId: 3,
      priority: "high"
    }
  ],
  chatMessages: [
    {
      id: 1,
      author: "Alex Rodriguez",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
      message: "Hey everyone! Anyone working on the portfolio project?",
      timestamp: "10:45 AM",
      courseId: 1
    }
  ]
};

const MOCK_AVAILABLE_COURSES = [
  {
    id: 4,
    title: "Python for Beginners",
    description: "Learn Python programming from scratch with hands-on projects and real-world examples.",
    image_url: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400",
    type: "free",
    level: "Beginner",
    lessons: new Array(20).fill({}),
    course_analytics: [{ total_students: 156 }]
  }
];

const CleanStudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState("courses");
  const [selectedCommunity, setSelectedCommunity] = useState<number | null>(null);
  const [communityTab, setCommunityTab] = useState<'announcements' | 'discussions' | 'browse-courses' | 'chat'>('announcements');
  const [progress, setProgress] = useState({
    coursesEnrolled: 3,
    coursesCompleted: 1,
    totalHours: 24,
    currentStreak: 7,
  });
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);

  const enrolledCourses = [
    {
      id: 1,
      title: "Web Development Fundamentals",
      instructor: "Test Instructor",
      progress: 65,
      totalLessons: 24,
      completedLessons: 16,
      image: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 2,
      title: "Advanced JavaScript",
      instructor: "Test Instructor",
      progress: 30,
      totalLessons: 18,
      completedLessons: 5,
      image: "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 3,
      title: "React Masterclass",
      instructor: "Test Instructor",
      progress: 85,
      totalLessons: 32,
      completedLessons: 27,
      image: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  ];

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

  const achievements = [
    {
      id: 1,
      title: "First Course Completed",
      description: "Complete your first course",
      icon: Trophy,
      earned: true,
      date: "2 weeks ago"
    },
    {
      id: 2,
      title: "Week Warrior",
      description: "Learn for 7 days straight",
      icon: Zap,
      earned: true,
      date: "3 days ago"
    }
  ];

  useEffect(() => {
    if (activeView === "community") {
      loadAvailableCourses();
    }
  }, [activeView]);

  const loadAvailableCourses = async () => {
    setIsLoadingCourses(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAvailableCourses(MOCK_AVAILABLE_COURSES);
    } catch (error) {
      console.error('Error loading available courses:', error);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const getFilteredContent = (courseId: number, type: string): any[] => {
    switch (type) {
      case 'announcements':
        return MOCK_DATA.announcements.filter(item => item.courseId === courseId);
      case 'discussions':
        return MOCK_DATA.communityPosts.filter(item => item.courseId === courseId);
      case 'chat':
        return MOCK_DATA.chatMessages.filter(item => item.courseId === courseId);
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-teal-500 to-green-500">
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <StudentSidebar 
          activeView={activeView}
          onViewChange={setActiveView}
          progress={progress}
        />

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-6xl">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
              
              {/* MY COURSES VIEW */}
              {activeView === "courses" && (
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
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {enrolledCourses.map((course) => (
                      <div
                        key={course.id}
                        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="relative">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300">
                            <button className="bg-white/95 backdrop-blur-sm p-4 rounded-full hover:bg-white hover:scale-110 transition-all duration-300">
                              <Play className="w-8 h-8 text-blue-600" />
                            </button>
                          </div>
                          <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {course.progress}% Complete
                          </div>
                        </div>

                        <div className="p-8">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                          <p className="text-gray-600 mb-4">by {course.instructor}</p>

                          <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
                            <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                            <span className="font-medium">{course.progress}% complete</span>
                          </div>

                          <div className="mb-6">
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${course.progress}%` }}
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

                  {/* Quick Actions */}
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <button
                        onClick={() => setActiveView("community")}
                        className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 hover:border-blue-300 transition-all duration-300 text-left"
                      >
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-300">
                          <MessageCircle className="w-6 h-6 text-blue-600 group-hover:text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Join Community</h4>
                        <p className="text-sm text-gray-600">Connect with other students</p>
                      </button>

                      <button
                        onClick={() => setActiveView("live-calls")}
                        className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 hover:border-green-300 transition-all duration-300 text-left"
                      >
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500 group-hover:scale-110 transition-all duration-300">
                          <Calendar className="w-6 h-6 text-green-600 group-hover:text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Live Sessions</h4>
                        <p className="text-sm text-gray-600">Join upcoming live calls</p>
                      </button>

                      <button
                        onClick={() => setActiveView("progress")}
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
              )}

              {/* COMMUNITY VIEW */}
              {activeView === "community" && (
                <div>
                  {!selectedCommunity ? (
                    <div>
                      <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Course Communities</h2>
                        <p className="text-gray-600 mt-2">Join discussions for your enrolled courses</p>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-blue-600 font-medium">Active Communities</p>
                              <p className="text-3xl font-bold text-blue-900">{enrolledCourses.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                              <Users className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-green-600 font-medium">Your Posts</p>
                              <p className="text-3xl font-bold text-green-900">12</p>
                            </div>
                            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                              <MessageCircle className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-purple-600 font-medium">Reputation Points</p>
                              <p className="text-3xl font-bold text-purple-900">847</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                              <Star className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrolledCourses.map((course) => {
                          const courseAnnouncements = MOCK_DATA.announcements.filter(a => a.courseId === course.id);
                          const courseDiscussions = MOCK_DATA.communityPosts.filter(p => p.courseId === course.id);
                          const recentActivity = courseAnnouncements.length + courseDiscussions.length;

                          return (
                            <div
                              key={course.id}
                              onClick={() => setSelectedCommunity(course.id)}
                              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                            >
                              <div className="relative">
                                <img
                                  src={course.image}
                                  alt={course.title}
                                  className="w-full h-32 object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"></div>
                                <div className="absolute bottom-4 left-4 right-4">
                                  <h3 className="text-white font-bold text-lg mb-1">{course.title}</h3>
                                  <p className="text-white/80 text-sm">by {course.instructor}</p>
                                </div>
                              </div>

                              <div className="p-6">
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{courseAnnouncements.length}</div>
                                    <div className="text-xs text-gray-500">Announcements</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">{courseDiscussions.length}</div>
                                    <div className="text-xs text-gray-500">Discussions</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">
                                      {MOCK_DATA.chatMessages.filter(m => m.courseId === course.id).length}
                                    </div>
                                    <div className="text-xs text-gray-500">Messages</div>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                                  <span>{recentActivity} recent activities</span>
                                  <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span>Active</span>
                                  </div>
                                </div>

                                <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300 group-hover:from-blue-600 group-hover:to-green-600">
                                  Join Discussion
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div>
                      {(() => {
                        const selectedCourse = enrolledCourses.find(c => c.id === selectedCommunity);
                        return (
                          <>
                            <div className="mb-8">
                              <button
                                onClick={() => setSelectedCommunity(null)}
                                className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
                              >
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Back to Communities
                              </button>
                              <div className="flex items-center space-x-4">
                                <img
                                  src={selectedCourse?.image}
                                  alt={selectedCourse?.title}
                                  className="w-16 h-16 rounded-xl object-cover"
                                />
                                <div>
                                  <h2 className="text-3xl font-bold text-gray-900">{selectedCourse?.title}</h2>
                                  <p className="text-gray-600">Community • {selectedCourse?.instructor}</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-xl">
                              {[
                                { id: 'announcements', label: 'Announcements', icon: Bell },
                                { id: 'discussions', label: 'Discussions', icon: MessageCircle },
                                { id: 'browse-courses', label: 'Browse Courses', icon: BookOpen },
                                { id: 'chat', label: 'Live Chat', icon: Users }
                              ].map((tab) => (
                                <button
                                  key={tab.id}
                                  onClick={() => setCommunityTab(tab.id as any)}
                                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                                    communityTab === tab.id
                                      ? 'bg-white text-blue-600 shadow-sm'
                                      : 'text-gray-600 hover:text-gray-900'
                                  }`}
                                >
                                  <tab.icon className="w-5 h-5" />
                                  <span>{tab.label}</span>
                                </button>
                              ))}
                            </div>

                            {communityTab === 'announcements' && (
                              <div className="space-y-6">
                                {getFilteredContent(selectedCommunity, 'announcements').map((announcement: any) => (
                                  <div key={announcement.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-start space-x-4">
                                      <img
                                        src={announcement.avatar}
                                        alt={announcement.author}
                                        className="w-12 h-12 rounded-full object-cover"
                                      />
                                      <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                          <div className="flex items-center space-x-3">
                                            <h4 className="font-semibold text-gray-900">{announcement.author}</h4>
                                            <span className="text-blue-600 text-sm font-medium bg-blue-100 px-2 py-1 rounded-full">
                                              Instructor
                                            </span>
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                              announcement.priority === 'high' ? 'bg-red-100 text-red-600' :
                                              announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                              'bg-gray-100 text-gray-600'
                                            }`}>
                                              {announcement.priority} priority
                                            </span>
                                          </div>
                                          <span className="text-sm text-gray-500">{announcement.timestamp}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{announcement.title}</h3>
                                        <p className="text-gray-700">{announcement.content}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {communityTab === 'discussions' && (
                              <div>
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Start a discussion</h3>
                                  <div className="flex items-start space-x-4">
                                    <img
                                      src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100"
                                      alt="Your avatar"
                                      className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                      <textarea
                                        placeholder="Ask a question, share your progress, or help other students..."
                                        className="w-full p-4 border border-gray-200 rounded-xl resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      />
                                      <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center space-x-4">
                                          <button className="text-gray-500 hover:text-blue-600 transition-colors">
                                            <Camera className="w-5 h-5" />
                                          </button>
                                          <button className="text-gray-500 hover:text-green-600 transition-colors">
                                            <FileText className="w-5 h-5" />
                                          </button>
                                        </div>
                                        <button 
                                          onClick={() => alert("Post discussion functionality")}
                                          className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                                        >
                                          Post Discussion
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-6">
                                  {getFilteredContent(selectedCommunity, 'discussions').map((post: any) => (
                                    <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
                                      <div className="flex items-start space-x-4">
                                        <img
                                          src={post.avatar}
                                          alt={post.author}
                                          className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                          <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-3">
                                              <h4 className="font-semibold text-gray-900">{post.author}</h4>
                                              <span className="text-gray-500 text-sm">{post.timestamp}</span>
                                            </div>
                                            <button className="text-gray-400 hover:text-gray-600">
                                              <MoreVertical className="w-5 h-5" />
                                            </button>
                                          </div>
                                          <p className="text-gray-700 mb-4">{post.content}</p>
                                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                                            <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
                                              <Star className="w-4 h-4" />
                                              <span>{post.likes} likes</span>
                                            </button>
                                            <button className="flex items-center space-x-2 hover:text-green-600 transition-colors">
                                              <MessageCircle className="w-4 h-4" />
                                              <span>{post.replies} replies</span>
                                            </button>
                                            <button className="flex items-center space-x-2 hover:text-purple-600 transition-colors">
                                              <Send className="w-4 h-4" />
                                              <span>Share</span>
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {communityTab === 'browse-courses' && (
                              <div>
                                <div className="mb-6">
                                  <h3 className="text-xl font-bold text-gray-900 mb-4">Available Courses from Your Instructor</h3>
                                  <p className="text-gray-600">Discover and enroll in courses offered by your instructor</p>
                                </div>

                                {isLoadingCourses ? (
                                  <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                      <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                                      <p className="text-gray-600">Loading courses...</p>
                                    </div>
                                  </div>
                                ) : availableCourses.length === 0 ? (
                                  <div className="text-center py-12">
                                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available yet</h3>
                                    <p className="text-gray-600">Your instructor hasn't published any courses yet.</p>
                                  </div>
                                ) : (
                                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {availableCourses.map((course) => (
                                      <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                                        <div className="relative">
                                          <img
                                            src={course.image_url}
                                            alt={course.title}
                                            className="w-full h-48 object-cover"
                                          />
                                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                            <span className={`text-sm font-medium ${
                                              course.type === 'free' ? 'text-green-600' : 'text-blue-600'
                                            }`}>
                                              {course.type === 'free' ? 'Free' : `$${course.price}`}
                                            </span>
                                          </div>
                                        </div>

                                        <div className="p-6">
                                          <div className="mb-3">
                                            <h4 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">{course.title}</h4>
                                            <p className="text-gray-600 text-sm line-clamp-3">{course.description}</p>
                                          </div>

                                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                            <div className="flex items-center space-x-4">
                                              <div className="flex items-center space-x-1">
                                                <BookOpen className="w-4 h-4" />
                                                <span>{course.lessons?.length || 0} lessons</span>
                                              </div>
                                              <div className="flex items-center space-x-1">
                                                <Users className="w-4 h-4" />
                                                <span>{course.course_analytics?.[0]?.total_students || 0} students</span>
                                              </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                              course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                                              course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                              'bg-red-100 text-red-700'
                                            }`}>
                                              {course.level}
                                            </span>
                                          </div>

                                          <div className="flex items-center space-x-3">
                                            <button 
                                              className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                                              onClick={() => {
                                                console.log('Enrolling in course:', course.id);
                                                alert('Enrollment functionality coming soon!');
                                              }}
                                            >
                                              Enroll Now
                                            </button>
                                            <button 
                                              className="border border-gray-300 text-gray-700 py-2 px-4 rounded-xl hover:bg-gray-50 transition-all duration-300"
                                              onClick={() => {
                                                console.log('Viewing course details:', course.id);
                                                alert('Course preview coming soon!');
                                              }}
                                            >
                                              <Eye className="w-4 h-4" />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {communityTab === 'chat' && (
                              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-96 flex flex-col">
                                <div className="p-4 border-b border-gray-200">
                                  <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-900">Live Chat</h3>
                                    <div className="flex items-center space-x-2 text-green-600">
                                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                      <span className="text-sm">12 online</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                  {getFilteredContent(selectedCommunity, 'chat').map((message: any) => (
                                    <div key={message.id} className="flex items-start space-x-3">
                                      <img
                                        src={message.avatar}
                                        alt={message.author}
                                        className="w-8 h-8 rounded-full object-cover"
                                      />
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                          <span className="font-medium text-sm text-gray-900">{message.author}</span>
                                          <span className="text-xs text-gray-500">{message.timestamp}</span>
                                        </div>
                                        <p className="text-gray-700 text-sm">{message.message}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <div className="p-4 border-t border-gray-200">
                                  <div className="flex items-center space-x-3">
                                    <input
                                      type="text"
                                      placeholder="Type your message..."
                                      className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <button 
                                      onClick={() => alert("Send message functionality")}
                                      className="bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition-colors"
                                    >
                                      <Send className="w-5 h-5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* LIVE CALLS VIEW */}
              {activeView === "live-calls" && (
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
              )}

              {/* PROGRESS VIEW */}
              {activeView === "progress" && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Your Progress</h2>
                    <p className="text-gray-600 mt-2">Track your achievements and learning milestones</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Learning Stats</h3>
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600">Overall Progress</span>
                            <span className="font-semibold text-gray-900">60%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600">This Week</span>
                            <span className="font-semibold text-gray-900">8.5 hours</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600">Engagement Score</span>
                            <span className="font-semibold text-gray-900">92/100</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full" style={{ width: '92%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h3>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Award className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Completed React Hooks lesson</p>
                            <p className="text-sm text-gray-500">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <MessageCircle className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Posted in JavaScript community</p>
                            <p className="text-sm text-gray-500">4 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Star className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Earned Week Warrior badge</p>
                            <p className="text-sm text-gray-500">1 day ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Achievements</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                            achievement.earned
                              ? 'border-green-200 bg-green-50'
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="text-center">
                            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                              achievement.earned
                                ? 'bg-green-500'
                                : 'bg-gray-400'
                            }`}>
                              <achievement.icon className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">{achievement.title}</h4>
                            <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>
                            {achievement.earned ? (
                              <span className="text-green-600 text-sm font-medium">
                                Earned {achievement.date}
                              </span>
                            ) : (
                              <div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{ width: `${(achievement as any).progress || 0}%` }}
                                  ></div>
                                </div>
                                <span className="text-gray-500 text-sm">
                                  {(achievement as any).progress || 0}% complete
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SETTINGS VIEW */}
              {activeView === "settings" && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
                    <p className="text-gray-600 mt-2">Manage your account and preferences</p>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h3>
                        <div className="space-y-6">
                          <div className="flex items-center space-x-6">
                            <img
                              src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100"
                              alt="Profile"
                              className="w-20 h-20 rounded-full object-cover"
                            />
                            <div>
                              <button 
                                onClick={() => alert("Change photo functionality")}
                                className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors"
                              >
                                Change Photo
                              </button>
                              <p className="text-sm text-gray-500 mt-1">JPG, GIF or PNG. 1MB max.</p>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                              <input
                                type="text"
                                defaultValue={user?.firstName}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                              <input
                                type="email"
                                defaultValue={user?.email}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                              <input
                                type="tel"
                                placeholder="+1 (555) 123-4567"
                                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                              <input
                                type="text"
                                placeholder="City, Country"
                                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                            <textarea
                              placeholder="Tell us about yourself..."
                              className="w-full p-3 border border-gray-200 rounded-xl resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <button 
                            onClick={() => alert("Save changes functionality")}
                            className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h3>
                        <div className="space-y-6">
                          {[
                            { label: "Course Updates", description: "Get notified about new lessons and content" },
                            { label: "Live Call Reminders", description: "Receive notifications before live sessions" },
                            { label: "Community Activity", description: "Updates from community discussions" },
                            { label: "Achievement Unlocked", description: "When you earn new badges and certificates" },
                            { label: "Weekly Progress", description: "Your weekly learning summary" }
                          ].map((setting, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">{setting.label}</h4>
                                <p className="text-sm text-gray-500">{setting.description}</p>
                              </div>
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  defaultChecked={index < 3}
                                  className="sr-only"
                                />
                                <div className={`w-12 h-6 rounded-full transition-colors ${
                                  index < 3 ? 'bg-blue-500' : 'bg-gray-300'
                                }`}>
                                  <div className={`w-5 h-5 bg-white rounded-full transition-transform transform ${
                                    index < 3 ? 'translate-x-6' : 'translate-x-1'
                                  } mt-0.5`}></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Account Actions</h3>
                        <div className="space-y-4">
                          <button 
                            onClick={() => alert("Export data functionality")}
                            className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <Download className="w-5 h-5 text-blue-600" />
                              <span className="font-medium text-blue-900">Export Data</span>
                            </div>
                            <span className="text-blue-600">→</span>
                          </button>

                          <button 
                            onClick={() => alert("Privacy settings functionality")}
                            className="w-full flex items-center justify-between p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <Eye className="w-5 h-5 text-green-600" />
                              <span className="font-medium text-green-900">Privacy Settings</span>
                            </div>
                            <span className="text-green-600">→</span>
                          </button>

                          <button 
                            onClick={() => alert("Language & region functionality")}
                            className="w-full flex items-center justify-between p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <Globe className="w-5 h-5 text-purple-600" />
                              <span className="font-medium text-purple-900">Language & Region</span>
                            </div>
                            <span className="text-purple-600">→</span>
                          </button>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h3>
                        <p className="text-gray-600 mb-6">Our support team is here to help you with any questions or issues.</p>
                        <button 
                          onClick={() => alert("Contact support functionality")}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                        >
                          Contact Support
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanStudentDashboard;