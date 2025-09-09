import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Users, 
  Star,
  ChevronRight,
  ChevronLeft,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  Download,
  Share2,
  FileText,
  ExternalLink,
  PlayCircle,
  PauseCircle
} from 'lucide-react';
import { courseService, Course, Module, Lesson } from '../services/courseService';

interface CourseLearningViewProps {
  courseId: string;
  onBack: () => void;
}

const CourseLearningView: React.FC<CourseLearningViewProps> = ({ courseId, onBack }) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lessonProgress, setLessonProgress] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadCourseContent();
  }, [courseId]);

  const loadCourseContent = async () => {
    try {
      setLoading(true);
      const courseData = await courseService.getCourseContent(courseId);
      setCourse(courseData);
      
      // Load lesson progress (in a real app, this would come from the backend)
      const savedProgress = localStorage.getItem(`course_progress_${courseId}`);
      if (savedProgress) {
        setLessonProgress(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error('Error loading course content:', error);
      alert('Failed to load course content');
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = (lessonId: string, completed: boolean) => {
    const newProgress = { ...lessonProgress, [lessonId]: completed };
    setLessonProgress(newProgress);
    localStorage.setItem(`course_progress_${courseId}`, JSON.stringify(newProgress));
  };

  const getCurrentLesson = (): Lesson | null => {
    if (!course?.modules || !course.modules[currentModuleIndex]) return null;
    const currentModule = course.modules[currentModuleIndex];
    return currentModule.lessons?.[currentLessonIndex] || null;
  };

  const getAllLessons = (): { lesson: Lesson; moduleIndex: number; lessonIndex: number }[] => {
    if (!course?.modules) return [];
    const allLessons: { lesson: Lesson; moduleIndex: number; lessonIndex: number }[] = [];
    course.modules.forEach((module, moduleIndex) => {
      module.lessons?.forEach((lesson, lessonIndex) => {
        allLessons.push({ lesson, moduleIndex, lessonIndex });
      });
    });
    return allLessons;
  };

  const getCompletedLessonsCount = (): number => {
    return Object.values(lessonProgress).filter(Boolean).length;
  };

  const getTotalLessonsCount = (): number => {
    return getAllLessons().length;
  };

  const getProgressPercentage = (): number => {
    const total = getTotalLessonsCount();
    const completed = getCompletedLessonsCount();
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const navigateToLesson = (moduleIndex: number, lessonIndex: number) => {
    setCurrentModuleIndex(moduleIndex);
    setCurrentLessonIndex(lessonIndex);
  };

  const nextLesson = () => {
    const allLessons = getAllLessons();
    const currentGlobalIndex = allLessons.findIndex(
      item => item.moduleIndex === currentModuleIndex && item.lessonIndex === currentLessonIndex
    );
    
    if (currentGlobalIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentGlobalIndex + 1];
      navigateToLesson(nextLesson.moduleIndex, nextLesson.lessonIndex);
    }
  };

  const prevLesson = () => {
    const allLessons = getAllLessons();
    const currentGlobalIndex = allLessons.findIndex(
      item => item.moduleIndex === currentModuleIndex && item.lessonIndex === currentLessonIndex
    );
    
    if (currentGlobalIndex > 0) {
      const prevLesson = allLessons[currentGlobalIndex - 1];
      navigateToLesson(prevLesson.moduleIndex, prevLesson.lessonIndex);
    }
  };

  const markAsComplete = () => {
    const currentLesson = getCurrentLesson();
    if (currentLesson) {
      saveProgress(currentLesson.id, true);
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getYouTubeVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getVimeoVideoId = (url: string): string | null => {
    const regex = /(?:vimeo\.com\/)([0-9]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getEmbedUrl = (url: string): string => {
    const youtubeId = getYouTubeVideoId(url);
    if (youtubeId) {
      return `https://www.youtube.com/embed/${youtubeId}`;
    }
    
    const vimeoId = getVimeoVideoId(url);
    if (vimeoId) {
      return `https://player.vimeo.com/video/${vimeoId}`;
    }
    
    return url;
  };

  const getVideoSource = (url: string): string => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'YouTube';
    }
    if (url.includes('vimeo.com')) {
      return 'Vimeo';
    }
    return 'Video';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Course not found</h3>
          <button onClick={onBack} className="text-purple-600 hover:text-purple-700">
            Go back
          </button>
        </div>
      </div>
    );
  }

  const currentLesson = getCurrentLesson();
  const allLessons = getAllLessons();
  const currentGlobalIndex = allLessons.findIndex(
    item => item.moduleIndex === currentModuleIndex && item.lessonIndex === currentLessonIndex
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Courses
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-sm text-gray-600">
                {course.modules?.length || 0} modules • {getTotalLessonsCount()} lessons
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Lesson {currentGlobalIndex + 1} of {getTotalLessonsCount()}
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-900">{getProgressPercentage()}%</span>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Course Content */}
        <div className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto">
          <div className="p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Course Content</h2>
            <div className="space-y-4">
              {course.modules?.map((module, moduleIndex) => (
                <div key={module.id} className="border border-gray-200 rounded-lg">
                  <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="font-medium text-gray-900">{module.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {module.lessons?.length || 0} lessons
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    {module.lessons?.map((lesson, lessonIndex) => {
                      const isCurrentLesson = moduleIndex === currentModuleIndex && lessonIndex === currentLessonIndex;
                      const isCompleted = lessonProgress[lesson.id];
                      
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => navigateToLesson(moduleIndex, lessonIndex)}
                          className={`w-full text-left p-4 transition-colors ${
                            isCurrentLesson
                              ? 'bg-purple-50 border-l-4 border-purple-500'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isCompleted
                                ? 'bg-green-500 text-white' 
                                : isCurrentLesson
                                  ? 'bg-purple-500 text-white'
                                  : 'bg-gray-200 text-gray-600'
                            }`}>
                              {isCompleted ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : lesson.video_url ? (
                                <PlayCircle className="w-4 h-4" />
                              ) : (
                                <FileText className="w-4 h-4" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-medium text-sm ${
                                isCurrentLesson ? 'text-purple-900' : 'text-gray-900'
                              }`}>
                                {lesson.title}
                              </h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <Clock className="w-3 h-3 text-gray-500" />
                                <span className="text-xs text-gray-600">
                                  {formatDuration(lesson.duration)}
                                </span>
                                {lesson.video_url && (
                                  <span className="text-xs text-purple-600">
                                    {getVideoSource(lesson.video_url)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {currentLesson ? (
            <div className="max-w-4xl mx-auto p-8">
              {/* Lesson Header */}
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    Module {currentModuleIndex + 1}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    Lesson {currentLessonIndex + 1}
                  </span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentLesson.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{formatDuration(currentLesson.duration)}</span>
                  {currentLesson.video_url && (
                    <>
                      <span>•</span>
                      <span>{getVideoSource(currentLesson.video_url)}</span>
                    </>
                  )}
                  {lessonProgress[currentLesson.id] && (
                    <>
                      <span>•</span>
                      <span className="text-green-600 font-medium">Completed</span>
                    </>
                  )}
                </div>
              </div>

              {/* Video Player */}
              {currentLesson.video_url && (
                <div className="bg-black rounded-xl overflow-hidden mb-8 shadow-xl">
                  <div className="aspect-video">
                    <iframe
                      src={getEmbedUrl(currentLesson.video_url)}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={currentLesson.title}
                    />
                  </div>
                </div>
              )}

              {/* Lesson Content */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Lesson Overview</h2>
                
                {currentLesson.description && (
                  <div className="prose prose-lg max-w-none mb-6">
                    <p className="text-gray-700 leading-relaxed">{currentLesson.description}</p>
                  </div>
                )}

                {currentLesson.additional_content && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Additional Notes</h3>
                    <div className="text-gray-700 whitespace-pre-wrap">
                      {currentLesson.additional_content}
                    </div>
                  </div>
                )}

                {/* Resources */}
                {currentLesson.resource_url && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Lesson Resources</h4>
                            <p className="text-sm text-gray-600">Additional materials for this lesson</p>
                          </div>
                        </div>
                        <a
                          href={currentLesson.resource_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Open Resource</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={prevLesson}
                  disabled={currentGlobalIndex === 0}
                  className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Previous Lesson
                </button>

                <div className="flex items-center space-x-4">
                  {!lessonProgress[currentLesson.id] && (
                    <button
                      onClick={markAsComplete}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Mark as Complete
                    </button>
                  )}

                  <button
                    onClick={nextLesson}
                    disabled={currentGlobalIndex === allLessons.length - 1}
                    className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Lesson
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No lesson selected</h3>
                <p className="text-gray-600">Select a lesson from the sidebar to start learning</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseLearningView;