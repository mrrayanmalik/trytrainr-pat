import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, Play, FileText, Video, ExternalLink, Eye, BookOpen, Users, Upload, X } from 'lucide-react';
import { courseService, Course, Module, Lesson } from '../services/courseService';
import CourseLearningView from './CourseLearningView';

interface CourseContentManagerProps {
  courseId: string;
  onBack: () => void;
}

const CourseContentManager: React.FC<CourseContentManagerProps> = ({ courseId, onBack }) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLearningView, setShowLearningView] = useState(false);
  
  // Module modal states
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');
  
  // Lesson modal states
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [lessonVideoUrl, setLessonVideoUrl] = useState('');
  const [lessonAdditionalContent, setLessonAdditionalContent] = useState('');
  const [lessonAllowPreview, setLessonAllowPreview] = useState(false);
  const [resourceFiles, setResourceFiles] = useState<File[]>([]);

  useEffect(() => {
    loadCourseContent();
  }, [courseId]);

  // If showing learning view, render that component
  if (showLearningView) {
    return (
      <CourseLearningView 
        courseId={courseId}
        onBack={() => setShowLearningView(false)}
      />
    );
  }

  const loadCourseContent = async () => {
    try {
      setLoading(true);
      const courseData = await courseService.getCourseContent(courseId);
      setCourse(courseData);
    } catch (error) {
      console.error('Error loading course content:', error);
      alert('Failed to load course content');
    } finally {
      setLoading(false);
    }
  };

  const resetModuleForm = () => {
    setModuleTitle('');
    setModuleDescription('');
    setEditingModule(null);
  };

  const resetLessonForm = () => {
    setLessonTitle('');
    setLessonDescription('');
    setLessonVideoUrl('');
    setLessonAdditionalContent('');
    setLessonAllowPreview(false);
    setResourceFiles([]);
    setEditingLesson(null);
    setSelectedModuleId(null);
  };

  const openCreateModuleModal = () => {
    resetModuleForm();
    setShowModuleModal(true);
  };

  const openEditModuleModal = (module: Module) => {
    setEditingModule(module);
    setModuleTitle(module.title);
    setModuleDescription(module.description || '');
    setShowModuleModal(true);
  };

  const openCreateLessonModal = (moduleId: string) => {
    resetLessonForm();
    setSelectedModuleId(moduleId);
    setShowLessonModal(true);
  };

  const openEditLessonModal = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setSelectedModuleId(lesson.module_id);
    setLessonTitle(lesson.title);
    setLessonDescription(lesson.description || '');
    setLessonVideoUrl(lesson.video_url || '');
    setLessonAdditionalContent(lesson.additional_content || '');
    setLessonAllowPreview(lesson.allow_preview);
    setResourceFiles([]); // For editing, we'll show existing files separately
    setShowLessonModal(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file sizes (10MB max each)
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });
    
    setResourceFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setResourceFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateModule = async () => {
    if (!moduleTitle.trim()) {
      alert('Module title is required');
      return;
    }

    try {
      await courseService.createModule(courseId, {
        title: moduleTitle,
        description: moduleDescription
      });
      setShowModuleModal(false);
      resetModuleForm();
      loadCourseContent();
    } catch (error: any) {
      console.error('Error creating module:', error);
      alert(error.message || 'Failed to create module');
    }
  };

  const handleEditModule = async () => {
    if (!editingModule || !moduleTitle.trim()) {
      alert('Module title is required');
      return;
    }

    try {
      await courseService.updateModule(editingModule.id, {
        title: moduleTitle,
        description: moduleDescription
      });
      setShowModuleModal(false);
      resetModuleForm();
      loadCourseContent();
    } catch (error: any) {
      console.error('Error updating module:', error);
      alert(error.message || 'Failed to update module');
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module? All lessons in this module will also be deleted.')) {
      return;
    }

    try {
      await courseService.deleteModule(moduleId);
      loadCourseContent();
    } catch (error: any) {
      console.error('Error deleting module:', error);
      alert(error.message || 'Failed to delete module');
    }
  };

  const handleCreateLesson = async () => {
    if (!selectedModuleId || !lessonTitle.trim()) {
      alert('Lesson title is required');
      return;
    }

    try {
      await courseService.createLesson(selectedModuleId, {
        title: lessonTitle,
        description: lessonDescription,
        videoUrl: lessonVideoUrl,
        additionalContent: lessonAdditionalContent,
        allowPreview: lessonAllowPreview,
        resourceFiles: resourceFiles
      });
      
      setShowLessonModal(false);
      resetLessonForm();
      loadCourseContent();
    } catch (error: any) {
      console.error('Error creating lesson:', error);
      alert(error.message || 'Failed to create lesson');
    }
  };

  const handleEditLesson = async () => {
    if (!editingLesson || !lessonTitle.trim()) {
      alert('Lesson title is required');
      return;
    }

    try {
      await courseService.updateLesson(editingLesson.id, {
        title: lessonTitle,
        description: lessonDescription,
        videoUrl: lessonVideoUrl,
        additionalContent: lessonAdditionalContent,
        allowPreview: lessonAllowPreview,
        resourceFiles: resourceFiles
      });
      
      setShowLessonModal(false);
      resetLessonForm();
      loadCourseContent();
    } catch (error: any) {
      console.error('Error updating lesson:', error);
      alert(error.message || 'Failed to update lesson');
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) {
      return;
    }

    try {
      await courseService.deleteLesson(lessonId);
      loadCourseContent();
    } catch (error: any) {
      console.error('Error deleting lesson:', error);
      alert(error.message || 'Failed to delete lesson');
    }
  };

  const getTotalLessons = () => {
    return course?.modules?.reduce((acc, module) => acc + (module.lessons?.length || 0), 0) || 0;
  };

  const hasContent = () => {
    return course?.modules && course.modules.length > 0 && getTotalLessons() > 0;
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📃';
      case 'ppt':
      case 'pptx':
        return '📊';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️';
      case 'zip':
      case 'rar':
        return '🗜️';
      default:
        return '📁';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900">Course not found</h3>
          <button onClick={onBack} className="mt-4 text-purple-600 hover:text-purple-700">
            Go back to courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-purple-600 hover:text-purple-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Courses
        </button>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-600 mt-2">Manage course content and structure</p>
            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>{course.modules?.length || 0} modules</span>
              </div>
              <div className="flex items-center space-x-1">
                <Play className="w-4 h-4" />
                <span>{getTotalLessons()} lessons</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{course.type === 'free' ? 'Free' : `$${course.price}`}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 lg:mt-0 flex items-center space-x-3">
            {hasContent() && (
              <button
                onClick={() => setShowLearningView(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Preview Course</span>
              </button>
            )}
            
            <button 
              onClick={openCreateModuleModal}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>{!course.modules || course.modules.length === 0 ? 'Add First Module' : 'Add New Module'}</span>
            </button>
          </div>
        </div>
      </div>

      {!course.modules || course.modules.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">No modules yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Start organizing your course by creating modules to group related lessons together.
          </p>
          <button 
            onClick={openCreateModuleModal}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Add First Module</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {course.modules.map((module, moduleIndex) => (
            <div key={module.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                        Module {moduleIndex + 1}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900">{module.title}</h3>
                    </div>
                    {module.description && (
                      <p className="text-gray-600">{module.description}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      {module.lessons?.length || 0} lesson{(module.lessons?.length || 0) !== 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => openCreateLessonModal(module.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{!module.lessons || module.lessons.length === 0 ? 'Add First Lesson' : 'Add Lesson'}</span>
                    </button>
                    
                    <button 
                      onClick={() => openEditModuleModal(module)}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" 
                      title="Edit Module"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    
                    <button 
                      onClick={() => handleDeleteModule(module.id)}
                      className="p-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors" 
                      title="Delete Module"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>

              {!module.lessons || module.lessons.length === 0 ? (
                <div className="p-8 text-center">
                  <Video className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No lessons yet</p>
                  <button 
                    onClick={() => openCreateLessonModal(module.id)}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Add your first lesson
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <div key={lesson.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-24 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            {lesson.video_url ? (
                              <Video className="w-6 h-6 text-gray-400" />
                            ) : (
                              <FileText className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                  Lesson {lessonIndex + 1}
                                </span>
                                <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                                {lesson.allow_preview && (
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                    Preview
                                  </span>
                                )}
                              </div>
                              
                              {lesson.description && (
                                <p className="text-gray-600 text-sm mb-2">{lesson.description}</p>
                              )}
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                {lesson.video_url && (
                                  <span className="text-purple-600">Video Available</span>
                                )}
                                {lesson.resource_files && lesson.resource_files.length > 0 && (
                                  <span className="text-blue-600">{lesson.resource_files.length} Resource{lesson.resource_files.length > 1 ? 's' : ''}</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-4">
                              <button 
                                onClick={() => openEditLessonModal(lesson)}
                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" 
                                title="Edit Lesson"
                              >
                                <Edit className="w-4 h-4 text-gray-600" />
                              </button>
                              
                              <button 
                                onClick={() => handleDeleteLesson(lesson.id)}
                                className="p-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors" 
                                title="Delete Lesson"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Module Modal */}
      {showModuleModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border-2 border-gray-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingModule ? 'Edit Module' : 'Add New Module'}
              </h2>
              <button
                onClick={() => {
                  setShowModuleModal(false);
                  resetModuleForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Module Title *
                </label>
                <input
                  type="text"
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter module title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={moduleDescription}
                  onChange={(e) => setModuleDescription(e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Describe what this module covers"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowModuleModal(false);
                    resetModuleForm();
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingModule ? handleEditModule : handleCreateModule}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  {editingModule ? 'Save Changes' : 'Add Module'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
              </h2>
              <button
                onClick={() => {
                  setShowLessonModal(false);
                  resetLessonForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Title *
                </label>
                <input
                  type="text"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter lesson title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={lessonDescription}
                  onChange={(e) => setLessonDescription(e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Describe what students will learn in this lesson"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL (Optional)
                </label>
                <input
                  type="url"
                  value={lessonVideoUrl}
                  onChange={(e) => setLessonVideoUrl(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://youtube.com/watch?v=..."
                />
                <p className="text-sm text-gray-500 mt-1">YouTube, Vimeo, etc.</p>
              </div>

              {/* Resource Files Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resource Files (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">Upload resource files for this lesson</p>
                  <p className="text-sm text-gray-500 mb-4">PDF, DOC, PPT, images, etc. (Max 10MB each)</p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resource-upload"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.zip,.rar"
                  />
                  <label
                    htmlFor="resource-upload"
                    className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors cursor-pointer"
                  >
                    Choose Files
                  </label>
                </div>

                {/* Display selected files */}
                {resourceFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Selected Files:</p>
                    {resourceFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getFileIcon(file.name)}</span>
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Show existing files for editing */}
                {editingLesson && editingLesson.resource_files && editingLesson.resource_files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Current Files:</p>
                    {editingLesson.resource_files.map((file: any, index: number) => (
                      <div key={index} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getFileIcon(file.originalName)}</span>
                          <span className="text-sm text-gray-700">{file.originalName}</span>
                        </div>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Content (Optional)
                </label>
                <textarea
                  value={lessonAdditionalContent}
                  onChange={(e) => setLessonAdditionalContent(e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Additional notes, transcript, key points, etc."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allowPreview"
                  checked={lessonAllowPreview}
                  onChange={(e) => setLessonAllowPreview(e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="allowPreview" className="ml-2 text-sm text-gray-700">
                  Allow preview (students can watch without enrolling)
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowLessonModal(false);
                    resetLessonForm();
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingLesson ? handleEditLesson : handleCreateLesson}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  {editingLesson ? 'Save Changes' : 'Add Lesson'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseContentManager;