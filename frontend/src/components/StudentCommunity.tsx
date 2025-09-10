import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  BookOpen, 
  MessageCircle, 
  Star, 
  Users, 
  Bell, 
  MoreVertical, 
  Send, 
  Camera, 
  Eye, 
  FileText, 
  Loader2,
  ArrowLeft,
  CheckCircle,
  Clock,
  RefreshCw,
  Download
} from 'lucide-react';
import { studentCourseService, StudentCourse, Community } from '../services/studentCourseService';

// Mock data for discussions/announcements
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
      type: "discussion"
    }
  ],
  announcements: [
    {
      id: 1,
      author: "Instructor",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
      title: "New Assignment Released - React Components",
      content: "I've just released a new assignment focusing on React component composition. Please check the course materials and submit by Friday.",
      timestamp: "1 hour ago",
      priority: "high"
    }
  ],
  chatMessages: [
    {
      id: 1,
      author: "Alex Rodriguez",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
      message: "Hey everyone! Anyone working on the portfolio project?",
      timestamp: "10:45 AM"
    }
  ]
};

const StudentCommunity: React.FC = () => {
  const { user } = useAuth();
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const [communityTab, setCommunityTab] = useState<'announcements' | 'discussions' | 'browse-courses' | 'chat'>('announcements');
  const [community, setCommunity] = useState<Community | null>(null);
  const [availableCourses, setAvailableCourses] = useState<StudentCourse[]>([]);
  const [isLoadingCommunity, setIsLoadingCommunity] = useState(true);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);

  useEffect(() => {
    loadCommunityInfo();
  }, []);

  const loadCommunityInfo = async () => {
    try {
      setIsLoadingCommunity(true);
      const communityData = await studentCourseService.getCommunity();
      setCommunity(communityData);
    } catch (error) {
      console.error('Error loading community info:', error);
    } finally {
      setIsLoadingCommunity(false);
    }
  };

  const loadAvailableCourses = async () => {
    try {
      setIsLoadingCourses(true);
      const courses = await studentCourseService.getAvailableCourses();
      setAvailableCourses(courses);
    } catch (error) {
      console.error('Error loading available courses:', error);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const handleEnrollInCourse = async (courseId: string) => {
    try {
      setEnrollingCourseId(courseId);
      await studentCourseService.enrollInCourse(courseId);
      await loadAvailableCourses();
      alert('Successfully enrolled in course! Check your "My Courses" section.');
    } catch (error: any) {
      console.error('Error enrolling in course:', error);
      alert(error.message || 'Failed to enroll in course');
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const handleJoinCommunity = () => {
    setSelectedCommunity(community?.id || 'default');
    loadAvailableCourses();
  };

  if (isLoadingCommunity) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading community...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No community found</h3>
          <p className="text-gray-600">You haven't been assigned to any instructor community yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {!selectedCommunity ? (
        <div>
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Community</h1>
              <p className="text-gray-600 mt-2">Connect with your instructor and fellow students</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* Community Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Communities</p>
                  <p className="text-2xl font-bold text-gray-900">1</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Available Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{community.stats.totalCourses}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Community Members</p>
                  <p className="text-2xl font-bold text-gray-900">{community.stats.totalStudents}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Community Card */}
          <div className="max-w-2xl mx-auto">
            <div
              onClick={handleJoinCommunity}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="bg-gradient-to-r from-blue-500 to-green-500 h-32 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-white font-bold text-xl mb-1">{community.name}</h3>
                  <p className="text-white/80 text-sm">
                    by {community.instructor.firstName} {community.instructor.lastName}
                  </p>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{MOCK_DATA.announcements.length}</div>
                    <div className="text-xs text-gray-500">Announcements</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{MOCK_DATA.communityPosts.length}</div>
                    <div className="text-xs text-gray-500">Discussions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{community.stats.totalCourses}</div>
                    <div className="text-xs text-gray-500">Courses</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                  <span>{community.stats.totalStudents} members</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Active</span>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Join Discussion
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div>
              <button
                onClick={() => setSelectedCommunity(null)}
                className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Communities
              </button>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{community.name}</h1>
                  <p className="text-gray-600">Community • {community.instructor.firstName} {community.instructor.lastName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="flex space-x-1 p-1">
              {[
                { id: 'announcements', label: 'Announcements', icon: Bell },
                { id: 'discussions', label: 'Discussions', icon: MessageCircle },
                { id: 'browse-courses', label: 'Browse Courses', icon: BookOpen },
                { id: 'chat', label: 'Live Chat', icon: Users }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setCommunityTab(tab.id as any);
                    if (tab.id === 'browse-courses' && availableCourses.length === 0) {
                      loadAvailableCourses();
                    }
                  }}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    communityTab === tab.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {communityTab === 'announcements' && (
            <div className="space-y-6">
              {MOCK_DATA.announcements.map((announcement: any) => (
                <div key={announcement.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={announcement.avatar}
                      alt={announcement.author}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-semibold text-gray-900">{community.instructor.firstName} {community.instructor.lastName}</h4>
                          <span className="bg-blue-100 text-blue-700 text-sm font-medium px-2 py-1 rounded-full">
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
              {/* Create Post */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
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
                      className="w-full p-4 border border-gray-200 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Post Discussion
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Discussion Posts */}
              <div className="space-y-6">
                {MOCK_DATA.communityPosts.map((post: any) => (
                  <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
                <h3 className="text-xl font-bold text-gray-900 mb-4">Available Courses</h3>
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
                    <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                      <div className="relative">
                        <img
                          src={course.thumbnail_url || "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400"}
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
                        {course.isEnrolled && (
                          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Enrolled</span>
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <div className="mb-3">
                          <h4 className="font-bold text-gray-900 text-lg mb-2">{course.title}</h4>
                          <p className="text-gray-600 text-sm">{course.description}</p>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <BookOpen className="w-4 h-4" />
                              <span>{course.totalLessons} lessons</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{course.totalStudents} students</span>
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
                          {course.isEnrolled ? (
                            <button 
                              className="flex-1 bg-green-100 text-green-700 py-2 px-4 rounded-lg font-medium cursor-default"
                              disabled
                            >
                              Already Enrolled
                            </button>
                          ) : (
                            <button 
                              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => handleEnrollInCourse(course.id)}
                              disabled={enrollingCourseId === course.id}
                            >
                              {enrollingCourseId === course.id ? (
                                <div className="flex items-center justify-center space-x-2">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  <span>Enrolling...</span>
                                </div>
                              ) : (
                                'Enroll Now'
                              )}
                            </button>
                          )}
                          <button 
                            className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                            onClick={() => alert('Course preview coming soon!')}
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-96 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Live Chat</h3>
                  <div className="flex items-center space-x-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">{community.stats.totalStudents} members</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {MOCK_DATA.chatMessages.map((message: any) => (
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
                    className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button 
                    onClick={() => alert("Send message functionality")}
                    className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentCommunity;