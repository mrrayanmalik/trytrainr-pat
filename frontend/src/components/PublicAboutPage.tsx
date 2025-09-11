import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { aboutPageService } from '../services/aboutPageService';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, BookOpen, Star, Play, Loader2, Globe, Unlock, 
  ChevronLeft, ChevronRight, Image, Video
} from 'lucide-react';

interface PublicAboutPageData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  instructor_bio: string;
  primary_color: string;
  secondary_color: string;
  subdirectory: string;
  custom_domain?: string;
  is_published: boolean;
  instructor_intro_content?: Array<{
    id: string;
    description: string;
    instructor_intro_media_items: Array<{
      id: string;
      type: 'video' | 'image';
      url: string;
      order_index: number;
    }>;
  }>;
  stats: {
    totalCourses: number;
    totalStudents: number;
    rating: number;
  };
  instructor: {
    id: string;
    business_name: string;
    users: {
      first_name: string;
      last_name: string;
    };
  };
  availableCourses: Array<{
    id: string;
    title: string;
  }>;
}

const PublicAboutPage: React.FC = () => {
  const { subdirectory } = useParams<{ subdirectory: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [aboutPageData, setAboutPageData] = useState<PublicAboutPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  useEffect(() => {
    if (subdirectory) {
      loadPublicAboutPage();
    }
  }, [subdirectory]);

  const loadPublicAboutPage = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await aboutPageService.getPublicAboutPage(subdirectory!);
      setAboutPageData(data);
    } catch (error) {
      console.error('Error loading about page:', error);
      setError('About page not found or not published');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCommunity = () => {
    if (user) {
      if (user.role === 'student') {
        navigate('/student/community');
      } else {
        alert('You need a student account to join this community');
      }
    } else {
      navigate('/signup/student');
    }
  };

  const getYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getEmbedUrl = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading community page...</p>
        </div>
      </div>
    );
  }

  if (error || !aboutPageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Page Not Found</h3>
          <p className="text-gray-600 mb-4">{error || 'This community page does not exist or is not published.'}</p>
          <button
            onClick={() => navigate('/')}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const introContent = aboutPageData.instructor_intro_content?.[0];
  const mediaItems = introContent?.instructor_intro_media_items || [];
  const currentMedia = mediaItems[currentMediaIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-semibold text-gray-900">trainr</span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <span className="text-gray-600">Welcome, {user.firstName}!</span>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login/student')}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup/student')}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {aboutPageData.title}
          </h1>
          <div className="flex justify-center items-center space-x-8 mb-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">{aboutPageData.stats.totalCourses} Course{aboutPageData.stats.totalCourses !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">{aboutPageData.stats.totalStudents.toLocaleString()} students</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700">{aboutPageData.stats.rating} rating</span>
            </div>
          </div>
          <p className="text-lg text-gray-600 mb-2">{aboutPageData.subtitle}</p>
          
          <div className="flex justify-center mb-8">
            <button 
              onClick={handleJoinCommunity}
              style={{ backgroundColor: aboutPageData.primary_color }}
              className="text-white px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Join Learning Community
            </button>
          </div>
          <p className="text-sm text-gray-600 flex items-center justify-center">
            <Unlock className="w-4 h-4 mr-2" />
            Free access to all courses • No credit card required
          </p>
        </div>

        {/* Intro Media */}
        {introContent && mediaItems.length > 0 && (
          <div className="mb-12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative">
                {currentMedia.type === 'video' && getEmbedUrl(currentMedia.url) ? (
                  <div className="aspect-video">
                    <iframe
                      src={getEmbedUrl(currentMedia.url)}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : currentMedia.type === 'image' ? (
                  <img
                    src={currentMedia.url}
                    alt="Community media"
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Play className="w-16 h-16 text-white mb-4 mx-auto" />
                      <h3 className="text-xl font-bold">Media Content</h3>
                    </div>
                  </div>
                )}
                
                {/* Navigation dots */}
                {mediaItems.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {mediaItems.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentMediaIndex(index)}
                        className={`w-2 h-2 rounded-full ${
                          index === currentMediaIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {introContent.description && (
                <div className="p-6">
                  <p className="text-gray-700">{introContent.description}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Welcome Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome to the Community!</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                {aboutPageData.description}
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {aboutPageData.stats.totalStudents.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Active Members</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                  <div className="text-sm text-gray-600">Community Support</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">∞</div>
                  <div className="text-sm text-gray-600">Lifetime Access</div>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Join the Community</h3>
                <p className="text-gray-600 mb-6">Get instant access to all courses, community support, and exclusive content</p>
                <button 
                  onClick={handleJoinCommunity}
                  style={{ backgroundColor: aboutPageData.primary_color }}
                  className="text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
                >
                  Join FREE
                </button>
                <p className="text-sm text-gray-500 mt-2">No credit card required</p>
              </div>
            </div>

            {/* Available Courses */}
            {aboutPageData.availableCourses.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Courses</h2>
                <div className="grid gap-4">
                  {aboutPageData.availableCourses.map((course) => (
                    <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-bold text-lg text-gray-900">{course.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">Join the community to access this course</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* About Instructor */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">About Your Instructor</h3>
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {aboutPageData.instructor.users.first_name[0]}{aboutPageData.instructor.users.last_name[0]}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {aboutPageData.instructor.users.first_name} {aboutPageData.instructor.users.last_name}
                    </h4>
                    <p className="text-sm text-gray-600">{aboutPageData.subtitle}</p>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm ml-1">{aboutPageData.stats.rating} • {aboutPageData.stats.totalStudents.toLocaleString()} students</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{aboutPageData.instructor_bio}</p>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
                <div className="text-center">
                  <h3 className="font-bold text-gray-900 mb-2">Ready to Start Learning?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Join thousands of students in {aboutPageData.instructor.users.first_name}'s community and get access to all courses, community support, and exclusive learning resources.
                  </p>
                  <button 
                    onClick={handleJoinCommunity}
                    style={{ backgroundColor: aboutPageData.primary_color }}
                    className="w-full text-white py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
                  >
                    Join Learning Community - FREE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicAboutPage;