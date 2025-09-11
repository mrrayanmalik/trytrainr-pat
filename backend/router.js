import express from 'express';
import { 
  studentSignup, 
  instructorSignup, 
  login, 
  getCurrentUser, 
  checkSubdirectory, 
  getInstructors 
} from './controllers/authController.js';
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  toggleCoursePublication,
  getCourseContent,
  createModule,
  updateModule,
  deleteModule,
  createLesson,
  updateLesson,
  deleteLesson
} from './controllers/courseController.js';
import {
  getAboutPage,
  updateAboutPage,
  createIntroContent,
  updateIntroContent,
  deleteIntroContent,
  getPublicAboutPage,
  joinCommunity
} from './controllers/aboutPageController.js';
import {
  getAvailableCourses,
  getEnrolledCourses,
  enrollInCourse,
  getStudentCourseContent,
  updateLessonProgress,
  getStudentCommunity
} from './controllers/studentCourseController.js';
import { authenticateToken, requireRole } from './middleware/auth.js';

const router = express.Router();

// Auth routes
router.post('/auth/signup/student', studentSignup);
router.post('/auth/signup/instructor', instructorSignup);
router.post('/auth/login', login);
router.get('/auth/me', authenticateToken, getCurrentUser);
router.get('/auth/check-subdirectory/:subdirectory', checkSubdirectory);
router.get('/auth/instructors', getInstructors);

// Instructor Course routes (protected, instructor only)
router.get('/courses', authenticateToken, requireRole(['instructor']), getCourses);
router.post('/courses', authenticateToken, requireRole(['instructor']), createCourse);
router.get('/courses/:courseId', authenticateToken, requireRole(['instructor']), getCourseContent);
router.put('/courses/:courseId', authenticateToken, requireRole(['instructor']), updateCourse);
router.delete('/courses/:courseId', authenticateToken, requireRole(['instructor']), deleteCourse);
router.patch('/courses/:courseId/toggle-publication', authenticateToken, requireRole(['instructor']), toggleCoursePublication);

// Module routes (instructor only)
router.post('/courses/:courseId/modules', authenticateToken, requireRole(['instructor']), createModule);
router.put('/modules/:moduleId', authenticateToken, requireRole(['instructor']), updateModule);
router.delete('/modules/:moduleId', authenticateToken, requireRole(['instructor']), deleteModule);

// Lesson routes (instructor only) - Note: these now handle file uploads
router.post('/modules/:moduleId/lessons', authenticateToken, requireRole(['instructor']), createLesson);
router.put('/lessons/:lessonId', authenticateToken, requireRole(['instructor']), updateLesson);
router.delete('/lessons/:lessonId', authenticateToken, requireRole(['instructor']), deleteLesson);

// Student Course routes (protected, student only)
router.get('/student/community', authenticateToken, requireRole(['student']), getStudentCommunity);
router.get('/student/courses/available', authenticateToken, requireRole(['student']), getAvailableCourses);
router.get('/student/courses/enrolled', authenticateToken, requireRole(['student']), getEnrolledCourses);
router.post('/student/courses/:courseId/enroll', authenticateToken, requireRole(['student']), enrollInCourse);
router.get('/student/courses/:courseId/content', authenticateToken, requireRole(['student']), getStudentCourseContent);
router.put('/student/lessons/:lessonId/progress', authenticateToken, requireRole(['student']), updateLessonProgress);

// Instructor about page routes (protected)
router.get('/instructor/about-page', authenticateToken, requireRole(['instructor']), getAboutPage);
router.put('/instructor/about-page', authenticateToken, requireRole(['instructor']), updateAboutPage);
router.post('/instructor/about-page/intro-content', authenticateToken, requireRole(['instructor']), createIntroContent);
router.put('/instructor/about-page/intro-content/:contentId', authenticateToken, requireRole(['instructor']), updateIntroContent);
router.delete('/instructor/about-page/intro-content/:contentId', authenticateToken, requireRole(['instructor']), deleteIntroContent);

// Public about page route
router.get('/public/about/:subdirectory', getPublicAboutPage);

// Join community route (for students)
router.post('/public/about/:subdirectory/join', authenticateToken, requireRole(['student']), joinCommunity);

// Add this temporary test endpoint to router.js
router.get('/test/intro-content-debug', authenticateToken, requireRole(['instructor']), async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const instructorId = req.user.instructors[0].id;
    
    console.log('Testing queries for instructor:', instructorId);

    // Test the exact query from getAboutPage
    const { data: aboutPageWithContent, error: queryError } = await supabase
      .from('instructor_about_pages')
      .select(`
        *,
        instructor_intro_content (
          *,
          instructor_intro_media_items (*)
        )
      `)
      .eq('instructor_id', instructorId)
      .single();

    console.log('Query error:', queryError);
    console.log('Raw query result:', JSON.stringify(aboutPageWithContent, null, 2));

    res.json({
      success: true,
      queryError,
      data: aboutPageWithContent,
      instructor_intro_content: aboutPageWithContent?.instructor_intro_content,
      media_items: aboutPageWithContent?.instructor_intro_content?.[0]?.instructor_intro_media_items
    });

  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test routes
router.get('/health', (req, res) => {
  res.json({ 
    message: 'API is healthy!',
    timestamp: new Date().toISOString()
  });
});

export default router;