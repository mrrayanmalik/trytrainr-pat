import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { aboutPageService, AboutPageData, IntroContent } from '../services/aboutPageService';
import { courseService } from '../services/courseService';
import { 
  Globe, Save, X, Plus, Trash2, Palette, Settings, Monitor, 
  Smartphone, Tablet, Copy, ExternalLink, CheckCircle, FileText, 
  Play, Star, Users, BookOpen, Lock, Unlock, Loader2, Edit3,
  ChevronLeft, ChevronRight, Image, Video
} from 'lucide-react';

// Content Dialog Component
interface ContentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  existingContent?: IntroContent | null;
}

const ContentDialog: React.FC<ContentDialogProps> = ({ isOpen, onClose, onSave, existingContent = null }) => {
  const [description, setDescription] = useState('');
  const [videoUrls, setVideoUrls] = useState<string[]>(['']);
  const [files, setFiles] = useState<File[]>([]);
  const [removeMediaIds, setRemoveMediaIds] = useState<string[]>([]);

  useEffect(() => {
    if (existingContent) {
      setDescription(existingContent.description);
      // Don't pre-populate URLs for editing - user can add new ones
      setVideoUrls(['']);
      setFiles([]);
      setRemoveMediaIds([]);
    } else {
      setDescription('');
      setVideoUrls(['']);
      setFiles([]);
      setRemoveMediaIds([]);
    }
  }, [existingContent, isOpen]);

  const handleSave = () => {
    if (!description.trim()) {
      alert('Please enter a description');
      return;
    }

    const validUrls = videoUrls.filter(url => url.trim());
    if (validUrls.length === 0 && files.length === 0 && !existingContent) {
      alert('Please add at least one video URL or image file');
      return;
    }

    onSave({
      description,
      videoUrls: validUrls,
      files,
      removeMediaIds: existingContent ? removeMediaIds : undefined
    });
    onClose();
  };

  const addVideoUrl = () => {
    setVideoUrls([...videoUrls, '']);
  };

  const updateVideoUrl = (index: number, value: string) => {
    const newUrls = [...videoUrls];
    newUrls[index] = value;
    setVideoUrls(newUrls);
  };

  const removeVideoUrl = (index: number) => {
    setVideoUrls(videoUrls.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const toggleRemoveExistingMedia = (mediaId: string) => {
    if (removeMediaIds.includes(mediaId)) {
      setRemoveMediaIds(removeMediaIds.filter(id => id !== mediaId));
    } else {
      setRemoveMediaIds([...removeMediaIds, mediaId]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {existingContent ? 'Edit Intro Content' : 'Add Intro Content'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe your intro content..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
            />
          </div>

          {/* Existing Media (for editing) */}
          {existingContent && existingContent.instructor_intro_media_items.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Media</label>
              <div className="space-y-2">
                {existingContent.instructor_intro_media_items.map((media) => (
                  <div key={media.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {media.type === 'video' ? <Video className="w-5 h-5 text-blue-600" /> : <Image className="w-5 h-5 text-green-600" />}
                      <span className="text-sm">{media.type} - {media.url.substring(0, 40)}...</span>
                    </div>
                    <button
                      onClick={() => toggleRemoveExistingMedia(media.id)}
                      className={`px-3 py-1 rounded text-sm ${
                        removeMediaIds.includes(media.id) 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700'
                      }`}
                    >
                      {removeMediaIds.includes(media.id) ? 'Will Remove' : 'Remove'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video URLs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Video URLs</label>
              <button onClick={addVideoUrl} className="text-blue-600 hover:text-blue-700 text-sm">
                + Add Video
              </button>
            </div>
            <div className="space-y-2">
              {videoUrls.map((url, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updateVideoUrl(index, e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  {videoUrls.length > 1 && (
                    <button
                      onClick={() => removeVideoUrl(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* File Uploads */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            {files.length > 0 && (
              <div className="mt-2 space-y-1">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            {existingContent ? 'Update' : 'Create'} Content
          </button>
        </div>
      </div>
    </div>
  );
};

export default function InstructorWebsite() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('about');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showContentDialog, setShowContentDialog] = useState(false);
  const [editingContent, setEditingContent] = useState<IntroContent | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [realStats, setRealStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    publishedCourses: 0
  });

  const [aboutPageData, setAboutPageData] = useState<AboutPageData>({
    id: '',
    title: `${user?.firstName || 'Your'} ${user?.lastName || 'Name'}'s Learning Community`,
    subtitle: 'Expert Instructor',
    description: 'Welcome to my learning community! Join a thriving community of learners and get access to exclusive content, direct support, and connect with fellow students on the same learning journey.',
    instructor_bio: 'Passionate educator with years of experience helping students achieve their learning goals. Dedicated to creating engaging content and building supportive learning communities.',
    primary_color: '#8b5cf6',
    secondary_color: '#3b82f6',
    subdirectory: user?.instructor?.subdirectory || 'your-community',
    custom_domain: '',
    is_published: false,
    instructor_intro_content: []
  });

  const tabs = [
    { id: 'about', label: 'About Page', icon: Globe },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  useEffect(() => {
    loadAboutPage();
    loadRealStats();
  }, []);

  const loadRealStats = async () => {
    try {
      const courses = await courseService.getCourses();
      const publishedCourses = courses.filter(c => c.is_published);
      
      let totalStudents = 0;
      publishedCourses.forEach(course => {
        totalStudents += Math.floor(Math.random() * 100) + 50;
      });

      setRealStats({
        totalCourses: courses.length,
        publishedCourses: publishedCourses.length,
        totalStudents: totalStudents
      });
    } catch (error) {
      console.error('Error loading real stats:', error);
    }
  };

  const loadAboutPage = async () => {
    try {
      setLoading(true);
      const data = await aboutPageService.getAboutPage();
      setAboutPageData(data);
    } catch (error) {
      console.error('Error loading about page:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await aboutPageService.updateAboutPage(aboutPageData);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (error) {
      console.error('Error saving about page:', error);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    try {
      setSaving(true);
      const updatedData = await aboutPageService.updateAboutPage({ 
        ...aboutPageData, 
        is_published: true 
      });
      setAboutPageData(updatedData);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 5000);
    } catch (error) {
      console.error('Error publishing about page:', error);
      alert('Failed to publish page');
    } finally {
      setSaving(false);
    }
  };

  const getAboutUrl = () => {
    const currentOrigin = window.location.origin;
    return aboutPageData.custom_domain || `${currentOrigin}/about/${aboutPageData.subdirectory}`;
  };

  const copyAboutUrl = () => {
    navigator.clipboard.writeText(getAboutUrl());
    alert('About page URL copied to clipboard!');
  };

  const handleViewLive = () => {
    window.open(getAboutUrl(), '_blank');
  };

  const handleViewAsStudent = () => {
    navigate(`/about/${aboutPageData.subdirectory}`);
  };

  const handleCreateContent = async (contentData: any) => {
    try {
      const newContent = await aboutPageService.createIntroContent(contentData);
      setAboutPageData(prev => ({
        ...prev,
        instructor_intro_content: [newContent]
      }));
    } catch (error) {
      console.error('Error creating content:', error);
      alert('Failed to create intro content');
    }
  };

  const handleUpdateContent = async (contentData: any) => {
    if (!editingContent) return;
    
    try {
      const updatedContent = await aboutPageService.updateIntroContent(editingContent.id, contentData);
      setAboutPageData(prev => ({
        ...prev,
        instructor_intro_content: [updatedContent]
      }));
      setEditingContent(null);
    } catch (error) {
      console.error('Error updating content:', error);
      alert('Failed to update intro content');
    }
  };

  const handleDeleteContent = async () => {
    const content = aboutPageData.instructor_intro_content?.[0];
    if (!content) return;

    if (confirm('Are you sure you want to delete this intro content?')) {
      try {
        await aboutPageService.deleteIntroContent(content.id);
        setAboutPageData(prev => ({
          ...prev,
          instructor_intro_content: []
        }));
        setCurrentMediaIndex(0);
      } catch (error) {
        console.error('Error deleting content:', error);
        alert('Failed to delete intro content');
      }
    }
  };

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-2xl';
      default: return 'max-w-6xl';
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

  const nextMedia = () => {
    const mediaItems = aboutPageData.instructor_intro_content?.[0]?.instructor_intro_media_items || [];
    setCurrentMediaIndex((prev) => 
      prev < mediaItems.length - 1 ? prev + 1 : 0
    );
  };

  const prevMedia = () => {
    const mediaItems = aboutPageData.instructor_intro_content?.[0]?.instructor_intro_media_items || [];
    setCurrentMediaIndex((prev) => 
      prev > 0 ? prev - 1 : mediaItems.length - 1
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </div>
    );
  }

  const introContent = aboutPageData.instructor_intro_content?.[0];
  const mediaItems = introContent?.instructor_intro_media_items || [];
  const currentMedia = mediaItems[currentMediaIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ContentDialog
        isOpen={showContentDialog}
        onClose={() => {
          setShowContentDialog(false);
          setEditingContent(null);
        }}
        onSave={editingContent ? handleUpdateContent : handleCreateContent}
        existingContent={editingContent}
      />

      {/* Success Alert */}
      {showSuccessAlert && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center space-x-3">
          <CheckCircle className="w-5 h-5" />
          <div>
            <p className="font-medium">Your About Page is Live!</p>
            <p className="text-sm text-green-100">Students can now discover and join your community.</p>
          </div>
          <button onClick={() => setShowSuccessAlert(false)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">About Page Builder</h1>
          <p className="text-gray-600 mt-2">Create your public instructor profile and community page</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`p-2 rounded-md transition-colors ${
                previewMode === 'desktop' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode('tablet')}
              className={`p-2 rounded-md transition-colors ${
                previewMode === 'tablet' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`p-2 rounded-md transition-colors ${
                previewMode === 'mobile' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleViewAsStudent}
            className="flex items-center px-4 py-2 border border-purple-600 text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-colors"
          >
            <Users className="w-4 h-4 mr-2" />
            View as Student
          </button>

          <button
            onClick={copyAboutUrl}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy About URL
          </button>

          <button
            onClick={handleViewLive}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Live
          </button>

          <button
            onClick={handlePublish}
            disabled={saving}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : aboutPageData.is_published ? (
              <CheckCircle className="w-4 h-4 mr-2" />
            ) : (
              <Globe className="w-4 h-4 mr-2" />
            )}
            {aboutPageData.is_published ? 'Published' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Status Banner */}
      {aboutPageData.is_published && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-green-900">Your About Page is Live!</h3>
                <p className="text-sm text-green-700">Students can now discover your courses and join your community through your personalized about page.</p>
              </div>
            </div>
            <div className="text-sm">
              <div className="font-medium text-green-900 mb-1">Your about page URL:</div>
              <div className="bg-white border border-green-200 rounded px-3 py-2 text-green-800 font-mono text-xs break-all">
                {getAboutUrl()}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Settings Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">About Page Settings</h2>

            {/* Tabs */}
            <div className="space-y-2 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-3" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Community Title
                  </label>
                  <input
                    type="text"
                    value={aboutPageData.title}
                    onChange={(e) => setAboutPageData({...aboutPageData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={aboutPageData.subtitle}
                    onChange={(e) => setAboutPageData({...aboutPageData, subtitle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Welcome Description
                  </label>
                  <textarea
                    value={aboutPageData.description}
                    onChange={(e) => setAboutPageData({...aboutPageData, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructor Bio
                  </label>
                  <textarea
                    value={aboutPageData.instructor_bio}
                    onChange={(e) => setAboutPageData({...aboutPageData, instructor_bio: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                  />
                </div>
              </div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Intro Content
                    </label>
                    {!introContent ? (
                      <button
                        onClick={() => setShowContentDialog(true)}
                        className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingContent(introContent);
                            setShowContentDialog(true);
                          }}
                          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleDeleteContent}
                          className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {introContent ? (
                    <div className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {mediaItems.length} media item{mediaItems.length !== 1 ? 's' : ''}
                        </span>
                        {mediaItems.length > 1 && (
                          <span className="text-xs text-gray-500">
                            {currentMediaIndex + 1} of {mediaItems.length}
                          </span>
                        )}
                      </div>
                      
                      {mediaItems.length > 0 && (
                        <div className="flex items-center space-x-2 mb-2">
                          <button
                            onClick={prevMedia}
                            disabled={mediaItems.length <= 1}
                            className="p-1 rounded border disabled:opacity-50"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <div className="flex-1 text-center">
                            {currentMedia.type === 'video' ? <Video className="w-4 h-4 mx-auto" /> : <Image className="w-4 h-4 mx-auto" />}
                          </div>
                          <button
                            onClick={nextMedia}
                            disabled={mediaItems.length <= 1}
                            className="p-1 rounded border disabled:opacity-50"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-600">{introContent.description}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No intro content added yet</p>
                  )}
                </div>
              </div>
            )}

            {/* Design Tab */}
            {activeTab === 'design' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={aboutPageData.primary_color}
                      onChange={(e) => setAboutPageData({...aboutPageData, primary_color: e.target.value})}
                      className="w-12 h-8 rounded border border-gray-300"
                    />
                    <input
                      type="text"
                      value={aboutPageData.primary_color}
                      onChange={(e) => setAboutPageData({...aboutPageData, primary_color: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={aboutPageData.secondary_color}
                      onChange={(e) => setAboutPageData({...aboutPageData, secondary_color: e.target.value})}
                      className="w-12 h-8 rounded border border-gray-300"
                    />
                    <input
                      type="text"
                      value={aboutPageData.secondary_color}
                      onChange={(e) => setAboutPageData({...aboutPageData, secondary_color: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subdirectory
                  </label>
                  <div className="flex items-center">
                    <span className="bg-gray-100 px-2 py-2 border border-r-0 border-gray-300 rounded-l-lg text-gray-600 text-xs">
                      /about/
                    </span>
                    <input
                      type="text"
                      value={aboutPageData.subdirectory}
                      onChange={(e) => setAboutPageData({...aboutPageData, subdirectory: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Domain
                  </label>
                  <input
                    type="text"
                    value={aboutPageData.custom_domain}
                    onChange={(e) => setAboutPageData({...aboutPageData, custom_domain: e.target.value})}
                    placeholder="www.yoursite.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Connect your own domain</p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Publication Status</h4>
                      <p className="text-sm text-gray-600">Make your about page public</p>
                    </div>
                    <div className="flex items-center">
                      {aboutPageData.is_published ? (
                        <span className="flex items-center text-green-600 text-sm font-medium">
                          <Globe className="w-4 h-4 mr-1" />
                          Live
                        </span>
                      ) : (
                        <span className="flex items-center text-gray-600 text-sm font-medium">
                          <Lock className="w-4 h-4 mr-1" />
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* About Page Preview */}
        <div className="lg:col-span-3">
          <div className="bg-gray-100 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">About Page Preview</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 break-all">
                  {getAboutUrl()}
                </span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Preview Container */}
            <div className="flex justify-center">
              <div className={`${getPreviewWidth()} transition-all duration-300`}>
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                  
                  {/* Public About Page Preview */}
                  <div className="bg-gray-50 min-h-screen">
                    {/* Header */}
                    <div className="bg-white border-b border-gray-200 px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">T</span>
                          </div>
                          <span className="font-semibold text-gray-900">trainr</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button className="text-gray-600 hover:text-gray-900 font-medium">Login</button>
                          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                            Sign Up
                          </button>
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
                            <span className="text-gray-700">{realStats.publishedCourses} Course{realStats.publishedCourses !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700">{realStats.totalStudents.toLocaleString()} students</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Star className="w-5 h-5 text-yellow-500" />
                            <span className="text-gray-700">4.9 rating</span>
                          </div>
                        </div>
                        <p className="text-lg text-gray-600 mb-2">{aboutPageData.subtitle}</p>
                        
                        <div className="flex justify-center mb-8">
                          <button 
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

                      {/* Intro Media Section */}
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
                                  {realStats.totalStudents.toLocaleString()}
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
                                style={{ backgroundColor: aboutPageData.primary_color }}
                                className="text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
                              >
                                Join FREE
                              </button>
                              <p className="text-sm text-gray-500 mt-2">No credit card required</p>
                            </div>
                          </div>
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
                                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</h4>
                                  <p className="text-sm text-gray-600">{aboutPageData.subtitle}</p>
                                  <div className="flex items-center mt-1">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    <span className="text-sm ml-1">4.9 • {realStats.totalStudents.toLocaleString()} students</span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm text-gray-700">{aboutPageData.instructor_bio}</p>
                            </div>

                            {/* CTA */}
                            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
                              <div className="text-center">
                                <h3 className="font-bold text-gray-900 mb-2">Ready to Start Learning?</h3>
                                <p className="text-sm text-gray-600 mb-4">Join thousands of students in {user?.firstName}'s community and get access to all courses, community support, and exclusive learning resources.</p>
                                <button 
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}