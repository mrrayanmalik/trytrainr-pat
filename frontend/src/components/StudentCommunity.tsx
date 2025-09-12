import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
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
  Download,
  Plus,
  Calendar,
  Settings
} from 'lucide-react';
import { studentCourseService, StudentCourse, Community } from '../services/studentCourseService';

const StudentCommunity: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { instructorId } = useParams<{ instructorId?: string }>();
  
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [communityTab, setCommunityTab] = useState<'announcements' | 'discussions' | 'browse-courses' | 'chat'>('announcements');
  const [availableCourses, setAvailableCourses] = useState<StudentCourse[]>([]);
  const [isLoadingCommunities, setIsLoadingCommunities] = useState(true);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);

  // Mock data for demo
  const MOCK_DATA = {
    announcements: [
      {
        id: 1,
        author: "Instructor",
        avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
        title: "Welcome to the Community!",
        content: "I'm excited to have you all here. This is where we'll share updates, resources, and connect with each other.",
        timestamp: "2 hours ago",
        priority: "high"
      }
    ],
    discussions: [
      {
        id: 1,
        author: "John Doe",
        avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100",
        content: "Just completed the first module! The concepts were really well explained. Anyone else working through this?",
        timestamp: "3 hours ago",
        likes: 8,
        replies: 4,
        type: "discussion"
      }
    ]
  };

  useEffect(() => {
    loadCommunities();
  }, []);

  useEffect(() => {
    if (instructorId && communities.length > 0) {
      const community = communities.find(c => c.instructorId === instructorId);
      if (community) {
        setSelectedCommunity(community);
        loadCommunityAvailableCourses(instructorId);
      } else {
        navigate('/student/community');
      }
    }
  }, [instructorId, communities, navigate]);

  const loadCommunities = async () => {
    try {
      setIsLoadingCommunities(true);
      const communitiesData = await studentCourseService.getCommunities();
      setCommunities(communitiesData);
    } catch (error) {
      console.error('Error loading communities:', error);
    } finally {
      setIsLoadingCommunities(false);
    }
  };

  const loadCommunityAvailableCourses = async (instructorId: string) => {
    try {
      setIsLoadingCourses(true);
      const courses = await studentCourseService.getCommunityAvailableCourses(instructorId);
      setAvailableCourses(courses);
    } catch (error) {
      console.error('Error loading community courses:', error);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const handleEnrollInCourse = async (courseId: string) => {
    try {
      setEnrollingCourseId(courseId);
      await studentCourseService.enrollInCourse(courseId);
      if (selectedCommunity) {
        await loadCommunityAvailableCourses(selectedCommunity.instructorId);
      }
      alert('Successfully enrolled in course! Check your "My Courses" section.');
    } catch (error: any) {
      console.error('Error enrolling in course:', error);
      alert(error.message || 'Failed to enroll in course');
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const handleSelectCommunity = (community: Community) => {
    navigate(`/student/community/${community.instructorId}`);
  };

  const handleBackToCommunities = () => {
    navigate('/student/community');
  };

  if (isLoadingCommunities) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading communities...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show communities list if no specific community is selected
  if (!selectedCommunity) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Communities</h1>
            <p className="text-gray-600 mt-2">Connect with your instructors and fellow students</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <button 
              onClick={loadCommunities}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {communities.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No communities yet</h3>
            <p className="text-gray-600 mb-6">You haven't joined any learning communities yet. Explore instructor about pages to join communities.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <div
                key={community.id}
                onClick={() => handleSelectCommunity(community)}
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
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{community.stats.totalCourses}</div>
                      <div className="text-xs text-gray-500">Courses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{community.stats.totalStudents}</div>
                      <div className="text-xs text-gray-500">Members</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Joined {new Date(community.joinedAt).toLocaleDateString()}</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Active</span>
                    </div>
                  </div>

                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Enter Community
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Show specific community content
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <button
            onClick={handleBackToCommunities}
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
              <h1 className="text-3xl font-bold text-gray-900">{selectedCommunity.name}</h1>
              <p className="text-gray-600">Community • {selectedCommunity.instructor.firstName} {selectedCommunity.instructor.lastName}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 lg:mt-0">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">{selectedCommunity.stats.totalCourses}</div>
              <div className="text-sm text-gray-600">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">{selectedCommunity.stats.totalStudents}</div>
              <div className="text-sm text-gray-600">Members</div>
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
                if (tab.id === 'browse-courses') {
                  loadCommunityAvailableCourses(selectedCommunity.instructorId);
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
          {MOCK_DATA.announcements.map((announcement) => (
            <div key={announcement.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start space-x-4">
                <img
                  src={announcement.avatar}
                  alt="Instructor"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-gray-900">{selectedCommunity.instructor.firstName} {selectedCommunity.instructor.lastName}</h4>
                      <span className="bg-blue-100 text-blue-700 text-sm font-medium px-2 py-1 rounded-full">
                        Instructor
                      </span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        announcement.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
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
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
              </div>
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
                    onClick={() => alert("Post discussion functionality coming soon!")}
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
            {MOCK_DATA.discussions.map((post) => (
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
            <p className="text-gray-600">Discover and enroll in courses from {selectedCommunity.instructor.firstName} {selectedCommunity.instructor.lastName}</p>
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
              <p className="text-gray-600">This instructor hasn't published any courses yet.</p>
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
                <span className="text-sm">{selectedCommunity.stats.totalStudents} members</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Live chat coming soon</h3>
              <p className="text-gray-600">Connect with other members in real-time.</p>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled
              />
              <button 
                className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCommunity;