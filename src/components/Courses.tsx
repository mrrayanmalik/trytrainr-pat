import React from 'react';
import { Play, Clock, Users, Star, BookOpen, CheckCircle, Video, Plus, Upload, X, Trash2, AlertTriangle, MoreHorizontal, Edit3, Save } from 'lucide-react';
import VideoLinkInput from './VideoLinkInput';
import VideoEmbed from './VideoEmbed';

interface CoursesProps {
  onStartLearning: (courseId: number) => void;
}

export default function Courses({ onStartLearning }: CoursesProps) {
  const [showAddCourseModal, setShowAddCourseModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showCourseMenu, setShowCourseMenu] = React.useState<number | null>(null);
  const [showVideoInput, setShowVideoInput] = React.useState(false);
  const [editingCourseForVideo, setEditingCourseForVideo] = React.useState<any>(null);
  const [courseToDelete, setCourseToDelete] = React.useState<any>(null);
  const [courseToEdit, setCourseToEdit] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Mock courses data based on reference image
  const [courses, setCourses] = React.useState([
    {
      id: 1,
      title: 'Complete Web Development Bootcamp',
      description: 'Learn full-stack web development from scratch with HTML, CSS, JavaScript, React, Node.js, and MongoDB.',
      image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400',
      level: 'Beginner',
      type: 'free',
      price: 0,
      published: true,
      progress: 65,
      lessons: [
        { id: 1, title: 'Introduction to Web Development', duration: '15:30', completed: true, current: true },
        { id: 2, title: 'HTML Fundamentals', duration: '27:45', completed: true, current: false },
        { id: 3, title: 'CSS Styling and Layout', duration: '28:15', completed: true, current: false },
        { id: 4, title: 'JavaScript Basics', duration: '35:20', completed: false, current: false },
        { id: 5, title: 'Advanced JavaScript', duration: '42:10', completed: false, current: false },
        { id: 6, title: 'React Introduction', duration: '38:30', completed: false, current: false }
      ],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoSource: 'youtube'
    },
    {
      id: 2,
      title: 'Advanced React Patterns',
      description: 'Master advanced React patterns including hooks, context, HOCs, and performance optimization techniques.',
      image: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=400',
      level: 'Advanced',
      type: 'paid',
      price: 199,
      published: true,
      progress: 30,
      lessons: [
        { id: 1, title: 'Advanced Hooks Patterns', duration: '25:15', completed: true, current: false },
        { id: 2, title: 'Context API Deep Dive', duration: '32:40', completed: false, current: true },
        { id: 3, title: 'Performance Optimization', duration: '28:20', completed: false, current: false },
        { id: 4, title: 'Custom Hooks', duration: '22:30', completed: false, current: false }
      ],
      videoUrl: 'https://www.loom.com/share/1234567890abcdef1234567890abcdef',
      videoSource: 'loom'
    },
    {
      id: 3,
      title: 'UI/UX Design Fundamentals',
      description: 'Learn the principles of user interface and user experience design with hands-on projects.',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
      level: 'Intermediate',
      type: 'free',
      price: 0,
      published: true,
      progress: 0,
      lessons: [
        { id: 1, title: 'Design Principles', duration: '20:15', completed: false, current: false },
        { id: 2, title: 'Color Theory', duration: '18:30', completed: false, current: false },
        { id: 3, title: 'Typography', duration: '22:45', completed: false, current: false }
      ],
      videoUrl: '',
      videoSource: ''
    }
  ]);
  
  const [newCourse, setNewCourse] = React.useState({
    name: '',
    description: '',
    type: 'free',
    price: '',
    thumbnail: null as File | null,
    thumbnailPreview: '',
    published: true
  });

  const [editCourse, setEditCourse] = React.useState({
    name: '',
    description: '',
    type: 'free',
    price: '',
    thumbnail: null as File | null,
    thumbnailPreview: '',
    published: true
  });

  const [videoData, setVideoData] = React.useState({
    videoUrl: '',
    videoTitle: '',
    videoDescription: '',
    videoSource: 'youtube'
  });

  const handleDeleteCourse = (course: any) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
    setShowCourseMenu(null);
  };

  const handleEditVideo = (course: any) => {
    setEditingCourseForVideo(course);
    setShowVideoInput(true);
  };

  const handleVideoAdd = (videoData: any) => {
    if (!editingCourseForVideo) return;
    
    // Update the course with new video data
    setCourses(prev => prev.map(course => 
      course.id === editingCourseForVideo.id 
        ? { 
            ...course, 
            videoUrl: videoData.url,
            videoSource: videoData.source,
            videoTitle: videoData.title
          }
        : course
    ));
    
    setShowVideoInput(false);
    setEditingCourseForVideo(null);
  };

  const handleEditCourse = (course: any) => {
    setCourseToEdit(course);
    setEditCourse({
      name: course.title,
      description: course.description,
      type: course.type,
      price: course.price.toString(),
      thumbnail: null,
      thumbnailPreview: course.image,
      published: course.published
    });
    setShowEditModal(true);
    setShowCourseMenu(null);
  };

  const saveEditCourse = () => {
    if (!courseToEdit) return;
    
    const updatedCourse = {
      ...courseToEdit,
      title: editCourse.name,
      description: editCourse.description,
      type: editCourse.type,
      price: editCourse.price ? parseFloat(editCourse.price) : 0,
      image: editCourse.thumbnailPreview || courseToEdit.image,
      published: editCourse.published
    };
    
    setCourses(prev => prev.map(course => 
      course.id === courseToEdit.id ? updatedCourse : course
    ));
    
    setShowEditModal(false);
    setCourseToEdit(null);
    setEditCourse({
      name: '',
      description: '',
      type: 'free',
      price: '',
      thumbnail: null,
      thumbnailPreview: '',
      published: true
    });
  };

  const cancelEditCourse = () => {
    setShowEditModal(false);
    setCourseToEdit(null);
    setEditCourse({
      name: '',
      description: '',
      type: 'free',
      price: '',
      thumbnail: null,
      thumbnailPreview: '',
      published: true
    });
  };

  const confirmDeleteCourse = () => {
    if (!courseToDelete) return;
    
    setCourses(prev => prev.filter(course => course.id !== courseToDelete.id));
    setShowDeleteModal(false);
    setCourseToDelete(null);
  };

  const handleAddCourse = () => {
    const newCourseData = {
      id: Date.now(),
      title: newCourse.name,
      description: newCourse.description,
      image: newCourse.thumbnailPreview || 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400',
      level: 'Beginner',
      type: newCourse.type,
      price: newCourse.type === 'paid' ? parseFloat(newCourse.price) || 0 : 0,
      published: newCourse.published,
      progress: 0,
      lessons: []
    };
    
    setCourses(prev => [newCourseData, ...prev]);
    
    if (newCourse.thumbnailPreview) {
      URL.revokeObjectURL(newCourse.thumbnailPreview);
    }
    setNewCourse({
      name: '',
      description: '',
      type: 'free',
      price: '',
      thumbnail: null,
      thumbnailPreview: '',
      published: true
    });
    setShowAddCourseModal(false);
  };

  const cancelDeleteCourse = () => {
    setShowDeleteModal(false);
    setCourseToDelete(null);
  };

  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewCourse(prev => ({
        ...prev,
        thumbnail: file,
        thumbnailPreview: URL.createObjectURL(file)
      }));
    }
  };

  const removeThumbnail = () => {
    if (newCourse.thumbnailPreview) {
      URL.revokeObjectURL(newCourse.thumbnailPreview);
    }
    setNewCourse(prev => ({
      ...prev,
      thumbnail: null,
      thumbnailPreview: ''
    }));
  };

  const closeModal = () => {
    if (newCourse.thumbnailPreview) {
      URL.revokeObjectURL(newCourse.thumbnailPreview);
    }
    setNewCourse({
      name: '',
      description: '',
      type: 'free',
      price: '',
      thumbnail: null,
      thumbnailPreview: '',
      published: true
    });
    setShowAddCourseModal(false);
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

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-2">Continue your learning journey</p>
        </div>
        <button 
          onClick={() => setShowAddCourseModal(true)}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Course
        </button>
      </div>

      {/* Course Cards Grid - Based on Reference Image 1 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="relative">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover bg-gray-100"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => onStartLearning(course.id)}
                  className="bg-white/90 p-3 rounded-full hover:bg-white transition-colors"
                >
                  <Play className="w-6 h-6 text-purple-600" />
                </button>
              </div>
              <span className={`absolute top-4 left-4 px-2 py-1 rounded-full text-xs font-medium ${
                course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {course.level}
              </span>
              {!course.published && (
                <span className="absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  Draft
                </span>
              )}
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">{course.description}</p>
              
              {/* Course Type Badge */}
              <div className="mb-4">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  course.type === 'free' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {course.type === 'free' ? '🆓 Free' : `💰 $${course.price || 0}`}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-auto">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                </div>
                
                {/* Course Actions */}
                <div className="flex items-center justify-between pt-4">
                  <button
                    onClick={() => onStartLearning(course.id)}
                    className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors"
                  >
                    Continue Learning
                  </button>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditVideo(course)}
                      className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center"
                    >
                      <Video className="w-4 h-4 mr-1" />
                      {course.videoUrl ? 'Change Video' : 'Add Video'}
                    </button>
                    <button
                      onClick={() => handleEditCourse(course)}
                      className="bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      Edit Course
                    </button>
                  </div>
                </div>
                
                {/* Video Preview */}
                {course.videoUrl && (
                  <div className="mt-4">
                    <VideoEmbed
                      url={course.videoUrl}
                      source={course.videoSource}
                      title={course.videoTitle || course.title}
                      className="max-w-xs"
                      onEdit={() => handleEditVideo(course)}
                      onRemove={() => {
                        setCourses(prev => prev.map(c => 
                          c.id === course.id 
                            ? { ...c, videoUrl: '', videoSource: '', videoTitle: '' }
                            : c
                        ));
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Storage Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
          <Video className="w-6 h-6 text-indigo-600" />
        </div>
        <p className="text-sm text-gray-600">Video Storage</p>
        <p className="text-2xl font-bold text-gray-900">15.2 GB</p>
        <p className="text-xs text-gray-500">of 100 GB used</p>
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '15.2%' }}></div>
          </div>
        </div>
      </div>

      {/* Add Course Modal */}
      {showAddCourseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Add course</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Course Name */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Course name
                  </label>
                  <span className="text-sm text-gray-500">
                    {newCourse.name.length} / 50
                  </span>
                </div>
                <input
                  type="text"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, name: e.target.value.slice(0, 50) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter course name"
                />
              </div>

              {/* Course Description */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Course description
                  </label>
                  <span className="text-sm text-gray-500">
                    {newCourse.description.length} / 500
                  </span>
                </div>
                <textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, description: e.target.value.slice(0, 500) }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter course description"
                />
              </div>

              {/* Course Type - Free or Paid */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Course Access
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setNewCourse(prev => ({ ...prev, type: 'free' }))}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      newCourse.type === 'free'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        newCourse.type === 'free'
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {newCourse.type === 'free' && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                        )}
                      </div>
                      <span className="font-medium text-gray-900">Free</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-7">
                      All members can access.
                    </p>
                  </button>

                  <button
                    onClick={() => setNewCourse(prev => ({ ...prev, type: 'paid' }))}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      newCourse.type === 'paid'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        newCourse.type === 'paid'
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {newCourse.type === 'paid' && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                        )}
                      </div>
                      <span className="font-medium text-gray-900">Paid</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-7">
                      Paid members only.
                    </p>
                  </button>
                </div>
              </div>

              {/* Price Field - Only show if paid */}
              {newCourse.type === 'paid' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={newCourse.price}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="199"
                    min="0"
                    step="0.01"
                  />
                </div>
              )}

              {/* Thumbnail Upload */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cover
                    </label>
                    <p className="text-sm text-gray-500">1460 x 752 px</p>
                  </div>
                  {newCourse.thumbnailPreview && (
                    <button
                      onClick={removeThumbnail}
                      className="text-gray-500 hover:text-gray-700 font-medium"
                    >
                      CHANGE
                    </button>
                  )}
                </div>
                
                <div className="flex space-x-4">
                  {/* Upload Area */}
                  <div className="flex-1">
                    {newCourse.thumbnailPreview ? (
                      <div className="relative">
                        <img
                          src={newCourse.thumbnailPreview}
                          alt="Course thumbnail"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          onClick={removeThumbnail}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-blue-500" />
                          <p className="text-blue-500 font-medium">Upload</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleThumbnailUpload}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200">
              {/* Published Toggle */}
              <div className="flex items-center space-x-3">
                <span className={`font-medium ${newCourse.published ? 'text-green-600' : 'text-gray-600'}`}>
                  Published
                </span>
                <button
                  onClick={() => setNewCourse(prev => ({ ...prev, published: !prev.published }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    newCourse.published ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      newCourse.published ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleAddCourse}
                  disabled={!newCourse.name.trim() || !newCourse.description.trim()}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    newCourse.name.trim() && newCourse.description.trim()
                      ? 'bg-gray-800 text-white hover:bg-gray-900'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  ADD
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditModal && courseToEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Course</h2>
                <button
                  onClick={cancelEditCourse}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Course Name */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Course name
                    </label>
                    <span className="text-sm text-gray-500">
                      {editCourse.name.length} / 50
                    </span>
                  </div>
                  <input
                    type="text"
                    value={editCourse.name}
                    onChange={(e) => setEditCourse(prev => ({ ...prev, name: e.target.value.slice(0, 50) }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter course name"
                  />
                </div>

                {/* Course Description */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Course description
                    </label>
                    <span className="text-sm text-gray-500">
                      {editCourse.description.length} / 500
                    </span>
                  </div>
                  <textarea
                    value={editCourse.description}
                    onChange={(e) => setEditCourse(prev => ({ ...prev, description: e.target.value.slice(0, 500) }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Enter course description"
                  />
                </div>

                {/* Course Type - Free or Paid */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Course Access
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setEditCourse(prev => ({ ...prev, type: 'free' }))}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        editCourse.type === 'free'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          editCourse.type === 'free'
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {editCourse.type === 'free' && (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                          )}
                        </div>
                        <span className="font-medium text-gray-900">Free</span>
                      </div>
                      <p className="text-sm text-gray-600 ml-7">
                        All members can access.
                      </p>
                    </button>

                    <button
                      onClick={() => setEditCourse(prev => ({ ...prev, type: 'paid' }))}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        editCourse.type === 'paid'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          editCourse.type === 'paid'
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {editCourse.type === 'paid' && (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                          )}
                        </div>
                        <span className="font-medium text-gray-900">Paid</span>
                      </div>
                      <p className="text-sm text-gray-600 ml-7">
                        Paid members only.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Price Field - Only show if paid */}
                {editCourse.type === 'paid' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      value={editCourse.price}
                      onChange={(e) => setEditCourse(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="199"
                      min="0"
                      step="0.01"
                    />
                  </div>
                )}

                {/* Thumbnail Upload */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Cover
                      </label>
                      <p className="text-sm text-gray-500">1460 x 752 px</p>
                    </div>
                    {editCourse.thumbnailPreview && (
                      <button
                        onClick={() => setEditCourse(prev => ({ ...prev, thumbnailPreview: '', thumbnail: null }))}
                        className="text-gray-500 hover:text-gray-700 font-medium"
                      >
                        CHANGE
                      </button>
                    )}
                  </div>
                  
                  <div className="flex space-x-4">
                    {/* Upload Area */}
                    <div className="flex-1">
                      {editCourse.thumbnailPreview ? (
                        <div className="relative">
                          <img
                            src={editCourse.thumbnailPreview}
                            alt="Course thumbnail"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => setEditCourse(prev => ({ ...prev, thumbnailPreview: '', thumbnail: null }))}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-blue-500" />
                            <p className="text-blue-500 font-medium">Upload</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setEditCourse(prev => ({
                                  ...prev,
                                  thumbnail: file,
                                  thumbnailPreview: URL.createObjectURL(file)
                                }));
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-8">
                {/* Published Toggle */}
                <div className="flex items-center space-x-3">
                  <span className={`font-medium ${editCourse.published ? 'text-green-600' : 'text-gray-600'}`}>
                    Published
                  </span>
                  <button
                    onClick={() => setEditCourse(prev => ({ ...prev, published: !prev.published }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      editCourse.published ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        editCourse.published ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={cancelEditCourse}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={saveEditCourse}
                    disabled={!editCourse.name.trim() || !editCourse.description.trim()}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      editCourse.name.trim() && editCourse.description.trim()
                        ? 'bg-gray-800 text-white hover:bg-gray-900'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    UPDATE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && courseToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              {/* Warning Icon */}
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              
              {/* Title and Message */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Course</h3>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete <strong>"{courseToDelete.title}"</strong>?
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                  <p className="text-red-800 text-sm font-medium mb-2">⚠️ This action cannot be undone</p>
                  <ul className="text-red-700 text-sm space-y-1">
                    <li>• All course content will be permanently deleted</li>
                    <li>• Student progress will be lost</li>
                    <li>• Course analytics will be removed</li>
                  </ul>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={cancelDeleteCourse}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteCourse}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Delete Course
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Input Modal */}
      {showVideoInput && editingCourseForVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Add Video to "{editingCourseForVideo.title}"
              </h3>
              <VideoLinkInput
                onVideoAdd={handleVideoAdd}
                onCancel={() => {
                  setShowVideoInput(false);
                  setEditingCourseForVideo(null);
                }}
                placeholder="Paste YouTube or Loom link for this course..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}