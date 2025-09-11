const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
  };
};

export interface AboutPageData {
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
  instructor_intro_content?: IntroContent[];
}

export interface IntroContent {
  id: string;
  description: string;
  instructor_intro_media_items: MediaItem[];
}

export interface MediaItem {
  id: string;
  type: 'video' | 'image';
  url: string;
  order_index: number;
}

export const aboutPageService = {
  async getAboutPage(): Promise<AboutPageData> {
    const response = await fetch(`${API_URL}/api/instructor/about-page`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch about page');
    return response.json();
  },

  async updateAboutPage(data: Partial<AboutPageData>): Promise<AboutPageData> {
    const response = await fetch(`${API_URL}/api/instructor/about-page`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update about page');
    return response.json();
  },

  async createIntroContent(data: {
    description: string;
    videoUrls?: string[];
    files?: File[];
  }): Promise<IntroContent> {
    const formData = new FormData();
    formData.append('description', data.description);
    
    if (data.videoUrls) {
      data.videoUrls.forEach(url => {
        if (url) formData.append('videoUrls', url);
      });
    }
    
    if (data.files) {
      data.files.forEach(file => {
        formData.append('mediaFiles', file);
      });
    }

    const response = await fetch(`${API_URL}/api/instructor/about-page/intro-content`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create intro content');
    return response.json();
  },

  async updateIntroContent(contentId: string, data: {
    description?: string;
    videoUrls?: string[];
    files?: File[];
    removeMediaIds?: string[];
  }): Promise<IntroContent> {
    const formData = new FormData();
    
    if (data.description) formData.append('description', data.description);
    
    if (data.videoUrls) {
      data.videoUrls.forEach(url => {
        if (url) formData.append('videoUrls', url);
      });
    }
    
    if (data.files) {
      data.files.forEach(file => {
        formData.append('mediaFiles', file);
      });
    }

    if (data.removeMediaIds) {
      data.removeMediaIds.forEach(id => {
        formData.append('removeMediaIds', id);
      });
    }

    const response = await fetch(`${API_URL}/api/instructor/about-page/intro-content/${contentId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update intro content');
    return response.json();
  },

  async deleteIntroContent(contentId: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/instructor/about-page/intro-content/${contentId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete intro content');
  },

  async getPublicAboutPage(subdirectory: string): Promise<AboutPageData & { 
    stats: any; 
    instructor: any; 
    availableCourses: any[] 
  }> {
    const response = await fetch(`${API_URL}/api/public/about/${subdirectory}`);
    if (!response.ok) throw new Error('About page not found');
    return response.json();
  },
};