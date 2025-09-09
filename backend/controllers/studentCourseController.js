import { createClient } from '@supabase/supabase-js';

const getSupabaseClient = () => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  return createClient(supabaseUrl, supabaseKey);
};

// Get courses from student's instructor/community (published only)
export const getAvailableCourses = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const studentId = req.user.students[0].id;
    
    // Get student's instructor
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('instructor_id')
      .eq('id', studentId)
      .single();

    if (studentError || !student.instructor_id) {
      return res.status(400).json({ error: 'Student not assigned to any instructor' });
    }

    // Get published courses from the instructor
    const { data: courses, error } = await supabase
      .from('courses')
      .select(`
        *,
        modules (
          id,
          title,
          lessons (id)
        ),
        enrollments!enrollments_course_id_fkey (
          id,
          student_id
        )
      `)
      .eq('instructor_id', student.instructor_id)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Add enrollment status and statistics for each course
    const coursesWithStats = courses.map(course => {
      const totalLessons = course.modules?.reduce((sum, module) => sum + (module.lessons?.length || 0), 0) || 0;
      const totalStudents = course.enrollments?.length || 0;
      const isEnrolled = course.enrollments?.some(enrollment => enrollment.student_id === studentId) || false;

      return {
        ...course,
        totalLessons,
        totalStudents,
        isEnrolled,
        enrollments: undefined // Remove enrollments from response for privacy
      };
    });

    res.json(coursesWithStats);
  } catch (error) {
    console.error('Get available courses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get student's enrolled courses
export const getEnrolledCourses = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const studentId = req.user.students[0].id;

    const { data: enrollments, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        courses (
          *,
          instructors (
            users (first_name, last_name)
          ),
          modules (
            id,
            title,
            lessons (id)
          )
        ),
        lesson_progress (
          lesson_id,
          completed
        )
      `)
      .eq('student_id', studentId)
      .order('enrolled_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Calculate progress for each course
    const coursesWithProgress = enrollments.map(enrollment => {
      const course = enrollment.courses;
      const totalLessons = course.modules?.reduce((sum, module) => sum + (module.lessons?.length || 0), 0) || 0;
      const completedLessons = enrollment.lesson_progress?.filter(progress => progress.completed).length || 0;
      const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      return {
        ...course,
        enrollmentId: enrollment.id,
        enrolledAt: enrollment.enrolled_at,
        totalLessons,
        completedLessons,
        progressPercentage,
        instructor: course.instructors?.users ? {
          firstName: course.instructors.users.first_name,
          lastName: course.instructors.users.last_name
        } : null
      };
    });

    res.json(coursesWithProgress);
  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Enroll student in a course
export const enrollInCourse = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { courseId } = req.params;
    const studentId = req.user.students[0].id;

    // Check if course exists and is published
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, is_published, instructor_id')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (!course.is_published) {
      return res.status(400).json({ error: 'Course is not published' });
    }

    // Verify student belongs to this instructor
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('instructor_id')
      .eq('id', studentId)
      .single();

    if (studentError || student.instructor_id !== course.instructor_id) {
      return res.status(403).json({ error: 'You can only enroll in courses from your instructor' });
    }

    // Check if already enrolled
    const { data: existingEnrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('student_id', studentId)
      .eq('course_id', courseId)
      .single();

    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Create enrollment
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .insert({
        student_id: studentId,
        course_id: courseId
      })
      .select()
      .single();

    if (enrollmentError) {
      return res.status(400).json({ error: enrollmentError.message });
    }

    res.status(201).json({
      message: 'Successfully enrolled in course',
      enrollment
    });
  } catch (error) {
    console.error('Enroll in course error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get course content for enrolled student
export const getStudentCourseContent = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { courseId } = req.params;
    const studentId = req.user.students[0].id;

    // Verify student is enrolled in this course
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('id')
      .eq('student_id', studentId)
      .eq('course_id', courseId)
      .single();

    if (enrollmentError || !enrollment) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }

    // Get course content with progress
    const { data: course, error } = await supabase
      .from('courses')
      .select(`
        *,
        instructors (
          users (first_name, last_name),
          business_name
        ),
        modules (
          *,
          lessons (*)
        )
      `)
      .eq('id', courseId)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get lesson progress
    const { data: lessonProgress } = await supabase
      .from('lesson_progress')
      .select('lesson_id, completed, watch_time')
      .eq('enrollment_id', enrollment.id);

    // Create progress map
    const progressMap = {};
    lessonProgress?.forEach(progress => {
      progressMap[progress.lesson_id] = {
        completed: progress.completed,
        watchTime: progress.watch_time
      };
    });

    // Add progress to course data
    const courseWithProgress = {
      ...course,
      enrollmentId: enrollment.id,
      lessonProgress: progressMap,
      instructor: course.instructors ? {
        firstName: course.instructors.users.first_name,
        lastName: course.instructors.users.last_name,
        businessName: course.instructors.business_name
      } : null
    };

    res.json(courseWithProgress);
  } catch (error) {
    console.error('Get student course content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update lesson progress
export const updateLessonProgress = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { lessonId } = req.params;
    const { completed, watchTime } = req.body;
    const studentId = req.user.students[0].id;

    // Get lesson and verify student access
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select(`
        id,
        module_id,
        modules (
          course_id,
          courses (
            enrollments!enrollments_course_id_fkey (
              id,
              student_id
            )
          )
        )
      `)
      .eq('id', lessonId)
      .single();

    if (lessonError || !lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const enrollment = lesson.modules.courses.enrollments.find(e => e.student_id === studentId);
    if (!enrollment) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }

    // Upsert lesson progress
    const { data: progress, error } = await supabase
      .from('lesson_progress')
      .upsert({
        enrollment_id: enrollment.id,
        lesson_id: lessonId,
        completed: completed || false,
        watch_time: watchTime || 0,
        completed_at: completed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'enrollment_id,lesson_id'
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: 'Lesson progress updated',
      progress
    });
  } catch (error) {
    console.error('Update lesson progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get student's instructor/community info
export const getStudentCommunity = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const studentId = req.user.students[0].id;

    const { data: student, error } = await supabase
      .from('students')
      .select(`
        instructor_id,
        instructors (
          id,
          business_name,
          users (
            first_name,
            last_name,
            email
          )
        )
      `)
      .eq('id', studentId)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!student.instructors) {
      return res.status(400).json({ error: 'Student not assigned to any instructor' });
    }

    // Get course statistics
    const { data: courses } = await supabase
      .from('courses')
      .select(`
        id,
        is_published,
        enrollments!enrollments_course_id_fkey (id)
      `)
      .eq('instructor_id', student.instructor_id);

    const publishedCourses = courses?.filter(c => c.is_published) || [];
    const totalStudents = new Set(courses?.flatMap(c => c.enrollments?.map(e => e.id)) || []).size;

    const community = {
      id: student.instructors.id,
      name: student.instructors.business_name,
      instructor: {
        firstName: student.instructors.users.first_name,
        lastName: student.instructors.users.last_name,
        email: student.instructors.users.email
      },
      stats: {
        totalCourses: publishedCourses.length,
        totalStudents: totalStudents
      }
    };

    res.json(community);
  } catch (error) {
    console.error('Get student community error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};