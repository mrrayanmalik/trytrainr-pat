import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2, 
  Settings, 
  BookOpen,
  Users,
  Clock,
  DollarSign,
  Star
} from 'lucide-react';
import { courseService, Course } from '../services/courseService';
import CreateCourseModal from './CreateCourseModal.tsx';
import CourseContentManager from './CourseContentManager.tsx';

const ManageCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const fetchedCourses = await courseService.getCourses();
      setCourses(fetchedCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
      alert('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (courseData: any) => {
    try {
      await courseService.createCourse(courseData);
      setShowCreateModal(false);
      loadCourses();
    } catch (error: any) {
      console.error('Error creating course:', error);
      alert(error.message || 'Failed to create course');
    }
  };

  const handleEditCourse = async (courseData: any) => {
    if (!editingCourse) return;
    
    try {
      await courseService.updateCourse(editingCourse.id, courseData);
      setEditingCourse(null);
      loadCourses();
    } catch (error: any) {
      console.error('Error updating course:', error);
      alert(error.message || 'Failed to update course');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      await courseService.deleteCourse(courseId);
      loadCourses();
    } catch (error: any) {
      console.error('Error deleting course:', error);
      alert(error.message || 'Failed to delete course');
    }
  };

  const handleTogglePublication = async (courseId: string) => {
    try {
      await courseService.toggleCoursePublication(courseId);
      loadCourses();
    } catch (error: any) {
      console.error('Error toggling course publication:', error);
      alert(error.message || 'Failed to toggle course publication');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      technology: 'bg-blue-100 text-blue-800',
      business: 'bg-green-100 text-green-800',
      design: 'bg-purple-100 text-purple-800',
      marketing: 'bg-orange-100 text-orange-800',
      development: 'bg-indigo-100 text-indigo-800',
      'personal development': 'bg-pink-100 text-pink-800',
      'health & fitness': 'bg-red-100 text-red-800',
      photography: 'bg-yellow-100 text-yellow-800',
      music: 'bg-cyan-100 text-cyan-800',
      language: 'bg-teal-100 text-teal-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
  };

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    return colors[level] || colors.beginner;
  };

  if (selectedCourseId) {
    return (
      <CourseContentManager 
        courseId={selectedCourseId}
        onBack={() => setSelectedCourseId(null)}
      />
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
          <p className="text-gray-600 mt-2">Create and manage your course content</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 lg:mt-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>{courses.length === 0 ? 'Create Your First Course' : 'Create New Course'}</span>
        </button>
      </div>

      {courses.length === 0 ? (
        // Empty State
        <div className="text-center py-12">
          <BookOpen className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">No courses found</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Start creating your first course to share knowledge with students.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Create Your First Course</span>
          </button>
        </div>
      ) : (
        // Courses Grid
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const totalModules = course.modules?.length || 0;
            const totalLessons = course.modules?.reduce((acc, module) => acc + (module.lessons?.length || 0), 0) || 0;

            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Course Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-purple-400 to-blue-500">
                  {course.thumbnail_url ? (
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-white opacity-80" />
                    </div>
                  )}
                  
                  {/* Publication Status */}
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => handleTogglePublication(course.id)}
                      className={`p-2 rounded-full transition-all duration-300 ${
                        course.is_published
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'bg-gray-500 hover:bg-gray-600'
                      }`}
                      title={course.is_published ? 'Published (Click to unpublish)' : 'Unpublished (Click to publish)'}
                    >
                      {course.is_published ? (
                        <Eye className="w-4 h-4 text-white" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </div>

                  {/* Course Type Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      course.type === 'free' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {course.type === 'free' ? 'Free' : `$${course.price}`}
                    </span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    {course.description && (
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {course.description}
                      </p>
                    )}
                  </div>

                  {/* Course Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(course.category)}`}>
                      {course.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                  </div>

                  {/* Course Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{totalModules} modules</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{totalLessons} lessons</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedCourseId(course.id)}
                      className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Manage Content</span>
                    </button>
                    
                    <button
                      onClick={() => setEditingCourse(course)}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      title="Edit Course"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Course Modal */}
      {(showCreateModal || editingCourse) && (
        <CreateCourseModal
          course={editingCourse}
          onSave={editingCourse ? handleEditCourse : handleCreateCourse}
          onCancel={() => {
            setShowCreateModal(false);
            setEditingCourse(null);
          }}
        />
      )}
    </div>
  );
};

export default ManageCourses;