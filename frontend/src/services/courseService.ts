const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
  };
};

const getFormDataHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
  };
};

export interface Course {
  id: string;
  title: string;
  description?: string;
  category: string;
  level: string;
  type: string;
  price?: number;
  thumbnail_url?: string;
  is_published: boolean;
  created_at: string;
  modules?: Module[];
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  order_index: number;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description?: string;
  video_url?: string;
  resource_files?: any[];
  additional_content?: string;
  allow_preview: boolean;
  order_index: number;
}

// Course API calls
export const courseService = {
  async getCourses(): Promise<Course[]> {
    const response = await fetch(`${API_URL}/api/courses`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
  },

  async createCourse(courseData: any): Promise<Course> {
    const response = await fetch(`${API_URL}/api/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(courseData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create course');
    }
    return response.json();
  },

  async updateCourse(courseId: string, courseData: any): Promise<Course> {
    const response = await fetch(`${API_URL}/api/courses/${courseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(courseData),
    });
    if (!response.ok) throw new Error('Failed to update course');
    return response.json();
  },

  async deleteCourse(courseId: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/courses/${courseId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete course');
  },

  async toggleCoursePublication(courseId: string): Promise<Course> {
    const response = await fetch(`${API_URL}/api/courses/${courseId}/toggle-publication`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to toggle course publication');
    return response.json();
  },

  async getCourseContent(courseId: string): Promise<Course> {
    const response = await fetch(`${API_URL}/api/courses/${courseId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch course content');
    return response.json();
  },

  // Module API calls
  async createModule(courseId: string, moduleData: any): Promise<Module> {
    const response = await fetch(`${API_URL}/api/courses/${courseId}/modules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(moduleData),
    });
    if (!response.ok) throw new Error('Failed to create module');
    return response.json();
  },

  async updateModule(moduleId: string, moduleData: any): Promise<Module> {
    const response = await fetch(`${API_URL}/api/modules/${moduleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(moduleData),
    });
    if (!response.ok) throw new Error('Failed to update module');
    return response.json();
  },

  async deleteModule(moduleId: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/modules/${moduleId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete module');
  },

  // Lesson API calls
  async createLesson(moduleId: string, lessonData: any): Promise<Lesson> {
    const formData = new FormData();
    
    // Add text fields
    formData.append('title', lessonData.title);
    if (lessonData.description) formData.append('description', lessonData.description);
    if (lessonData.videoUrl) formData.append('videoUrl', lessonData.videoUrl);
    if (lessonData.additionalContent) formData.append('additionalContent', lessonData.additionalContent);
    formData.append('allowPreview', lessonData.allowPreview.toString());
    
    // Add files
    if (lessonData.resourceFiles && lessonData.resourceFiles.length > 0) {
      lessonData.resourceFiles.forEach((file: File) => {
        formData.append('resourceFiles', file);
      });
    }

    const response = await fetch(`${API_URL}/api/modules/${moduleId}/lessons`, {
      method: 'POST',
      headers: getFormDataHeaders(),
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create lesson');
    return response.json();
  },

  async updateLesson(lessonId: string, lessonData: any): Promise<Lesson> {
    const formData = new FormData();
    
    // Add text fields
    formData.append('title', lessonData.title);
    if (lessonData.description) formData.append('description', lessonData.description);
    if (lessonData.videoUrl) formData.append('videoUrl', lessonData.videoUrl);
    if (lessonData.additionalContent) formData.append('additionalContent', lessonData.additionalContent);
    formData.append('allowPreview', lessonData.allowPreview.toString());
    
    // Add files to remove
    if (lessonData.filesToRemove && lessonData.filesToRemove.length > 0) {
      formData.append('filesToRemove', JSON.stringify(lessonData.filesToRemove));
    }
    
    // Add new files
    if (lessonData.resourceFiles && lessonData.resourceFiles.length > 0) {
      lessonData.resourceFiles.forEach((file: File) => {
        formData.append('resourceFiles', file);
      });
    }

    const response = await fetch(`${API_URL}/api/lessons/${lessonId}`, {
      method: 'PUT',
      headers: getFormDataHeaders(),
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update lesson');
    return response.json();
  },

  async deleteLesson(lessonId: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/lessons/${lessonId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete lesson');
  },
};