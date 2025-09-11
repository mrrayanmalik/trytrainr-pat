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
  };
  modules?: any[];
  lessonProgress?: { [lessonId: string]: { completed: boolean; watchTime: number } };
}

export interface Community {
  id: string;
  name: string;
  instructor: {
    firstName: string;
    lastName: string;
    email: string;
  };
  stats: {
    totalCourses: number;
    totalStudents: number;
  };
}

export const studentCourseService = {
  // Get student's community info
  async getCommunity(): Promise<Community> {
    const response = await fetch(`${API_URL}/api/student/community`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch community info');
    return response.json();
  },

  // Get available courses from student's instructor
  async getAvailableCourses(): Promise<StudentCourse[]> {
    const response = await fetch(`${API_URL}/api/student/courses/available`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch available courses');
    return response.json();
  },

  // Get student's enrolled courses
  async getEnrolledCourses(): Promise<StudentCourse[]> {
    const response = await fetch(`${API_URL}/api/student/courses/enrolled`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch enrolled courses');
    return response.json();
  },

  // Enroll in a course
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

  // Get course content for enrolled student
  async getCourseContent(courseId: string): Promise<StudentCourse> {
    const response = await fetch(`${API_URL}/api/student/courses/${courseId}/content`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch course content');
    return response.json();
  },

  // Update lesson progress
  async updateLessonProgress(lessonId: string, completed: boolean, watchTime?: number): Promise<void> {
    const response = await fetch(`${API_URL}/api/student/lessons/${lessonId}/progress`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ completed, watchTime }),
    });
    if (!response.ok) throw new Error('Failed to update lesson progress');
  },

  // Join community
  async joinCommunity(subdirectory: string): Promise<void> {
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