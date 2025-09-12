const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export interface StudentCourse {
  id: string;
  title: string;
  description?: string;
  category: string;
  level: string;
  type: string;
  price?: number;
  thumbnail_url?: string;
  totalLessons: number;
  completedLessons?: number;
  progressPercentage?: number;
  totalStudents: number;
  isEnrolled: boolean;
  enrollmentId?: string;
  enrolledAt?: string;
  instructor?: {
    firstName: string;
    lastName: string;
    businessName?: string;
  };
  modules?: any[];
  lessonProgress?: { [lessonId: string]: { completed: boolean; watchTime: number } };
}

export interface Community {
  id: string;
  instructorId: string;
  name: string;
  subdirectory: string;
  instructor: {
    firstName: string;
    lastName: string;
    email: string;
  };
  joinedAt: string;
  stats: {
    totalCourses: number;
    totalStudents: number;
  };
}

export const studentCourseService = {
  // NEW: Get all communities a student has joined
  async getCommunities(): Promise<Community[]> {
    const response = await fetch(`${API_URL}/api/student/communities`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch communities');
    return response.json();
  },

  // NEW: Get courses from a specific community
  async getCommunityAvailableCourses(instructorId: string): Promise<StudentCourse[]> {
    const response = await fetch(`${API_URL}/api/student/communities/${instructorId}/courses`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch community courses');
    return response.json();
  },

  // NEW: Join a community
  async joinCommunity(subdirectory: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/student/communities/join/${subdirectory}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to join community');
    }
  },

  // MODIFIED: Get available courses from ALL communities
  async getAvailableCourses(): Promise<StudentCourse[]> {
    const response = await fetch(`${API_URL}/api/student/courses/available`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch available courses');
    return response.json();
  },

  // SAME: Get student's enrolled courses
  async getEnrolledCourses(): Promise<StudentCourse[]> {
    const response = await fetch(`${API_URL}/api/student/courses/enrolled`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch enrolled courses');
    return response.json();
  },

  // MODIFIED: Enroll in a course (now requires community membership)
  async enrollInCourse(courseId: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/student/courses/${courseId}/enroll`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to enroll in course');
    }
  },

  // SAME: Get course content for enrolled student
  async getCourseContent(courseId: string): Promise<StudentCourse> {
    const response = await fetch(`${API_URL}/api/student/courses/${courseId}/content`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch course content');
    return response.json();
  },

  // SAME: Update lesson progress
  async updateLessonProgress(lessonId: string, completed: boolean, watchTime?: number): Promise<void> {
    const response = await fetch(`${API_URL}/api/student/lessons/${lessonId}/progress`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ completed, watchTime }),
    });
    if (!response.ok) throw new Error('Failed to update lesson progress');
  },

  // NEW: Join community through public about page
  async joinCommunityPublic(subdirectory: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/public/about/${subdirectory}/join`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to join community');
    }
  },
};