import { createClient } from '@supabase/supabase-js';

const getSupabaseClient = () => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  return createClient(supabaseUrl, supabaseKey);
};

// Get all communities a student has joined
export const getStudentCommunities = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const studentId = req.user.students[0].id;

    const { data: communities, error } = await supabase
      .from('student_communities')
      .select(`
        *,
        instructors (
          id,
          business_name,
          subdirectory,
          users (
            first_name,
            last_name,
            email
          )
        )
      `)
      .eq('student_id', studentId)
      .eq('is_active', true);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get stats for each community
    const communitiesWithStats = await Promise.all(
      communities.map(async (community) => {
        const instructorId = community.instructors.id;
        
        // Get course stats
        const { data: courses } = await supabase
          .from('courses')
          .select(`
            id,
            is_published,
            enrollments!enrollments_course_id_fkey (id)
          `)
          .eq('instructor_id', instructorId);

        const publishedCourses = courses?.filter(c => c.is_published) || [];
        const totalStudents = new Set(courses?.flatMap(c => c.enrollments?.map(e => e.id)) || []).size;

        return {
          id: community.id,
          instructorId: instructorId,
          name: community.instructors.business_name,
          subdirectory: community.instructors.subdirectory,
          instructor: {
            firstName: community.instructors.users.first_name,
            lastName: community.instructors.users.last_name,
            email: community.instructors.users.email
          },
          joinedAt: community.joined_at,
          stats: {
            totalCourses: publishedCourses.length,
            totalStudents: totalStudents
          }
        };
      })
    );

    res.json(communitiesWithStats);
  } catch (error) {
    console.error('Get student communities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get courses from a specific community
export const getCommunityAvailableCourses = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { instructorId } = req.params;
    const studentId = req.user.students[0].id;
    
    // Verify student is part of this community
    const { data: membership, error: membershipError } = await supabase
      .from('student_communities')
      .select('id')
      .eq('student_id', studentId)
      .eq('instructor_id', instructorId)
      .eq('is_active', true)
      .single();

    if (membershipError || !membership) {
      return res.status(403).json({ error: 'You are not a member of this community' });
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
      .eq('instructor_id', instructorId)
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
    console.error('Get community available courses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// LEGACY: Get available courses from ALL communities (for backward compatibility)
export const getAvailableCourses = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const studentId = req.user.students[0].id;
    
    // Get all communities the student is part of
    const { data: communities, error: communitiesError } = await supabase
      .from('student_communities')
      .select('instructor_id')
      .eq('student_id', studentId)
      .eq('is_active', true);

    if (communitiesError) {
      return res.status(400).json({ error: communitiesError.message });
    }

    if (!communities || communities.length === 0) {
      return res.json([]); // No communities joined yet
    }

    const instructorIds = communities.map(c => c.instructor_id);

    // Get published courses from all instructors the student follows
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
      .in('instructor_id', instructorIds)
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

// Join a community
export const joinCommunity = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { subdirectory } = req.params;
    const studentId = req.user.students[0].id;

    // Get instructor by subdirectory
    const { data: aboutPage, error: aboutError } = await supabase
      .from('instructor_about_pages')
      .select(`
        instructors!inner(id)
      `)
      .eq('subdirectory', subdirectory)
      .eq('is_published', true)
      .single();

    if (aboutError || !aboutPage) {
      return res.status(404).json({ error: 'Community not found' });
    }

    const instructorId = aboutPage.instructors.id;

    // Check if student is already part of this community
    const { data: existingMembership } = await supabase
      .from('student_communities')
      .select('id, is_active')
      .eq('student_id', studentId)
      .eq('instructor_id', instructorId)
      .single();

    if (existingMembership) {
      if (existingMembership.is_active) {
        return res.status(400).json({ error: 'Already a member of this community' });
      } else {
        // Reactivate membership
        const { error: updateError } = await supabase
          .from('student_communities')
          .update({ is_active: true, joined_at: new Date().toISOString() })
          .eq('id', existingMembership.id);

        if (updateError) {
          return res.status(400).json({ error: updateError.message });
        }

        return res.json({ 
          message: 'Successfully rejoined the community!',
          membershipId: existingMembership.id
        });
      }
    }

    // Create new community membership
    const { data: membership, error: membershipError } = await supabase
      .from('student_communities')
      .insert({
        student_id: studentId,
        instructor_id: instructorId
      })
      .select()
      .single();

    if (membershipError) {
      return res.status(400).json({ error: membershipError.message });
    }

    res.json({ 
      message: 'Successfully joined the community!',
      membershipId: membership.id
    });
  } catch (error) {
    console.error('Join community error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get student's enrolled courses (from all communities)
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
            users (first_name, last_name),
            business_name
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
          lastName: course.instructors.users.last_name,
          businessName: course.instructors.business_name
        } : null
      };
    });

    res.json(coursesWithProgress);
  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Enroll student in a course (must be member of community first)
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

    // Verify student is part of the instructor's community
    const { data: membership, error: membershipError } = await supabase
      .from('student_communities')
      .select('id')
      .eq('student_id', studentId)
      .eq('instructor_id', course.instructor_id)
      .eq('is_active', true)
      .single();

    if (membershipError || !membership) {
      return res.status(403).json({ error: 'You must join this instructor\'s community first to enroll in their courses' });
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

// LEGACY: Get student's community info (returns first community for backward compatibility)
export const getStudentCommunity = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const studentId = req.user.students[0].id;

    // Get the first active community (for backward compatibility)
    const { data: community, error } = await supabase
      .from('student_communities')
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
      .eq('student_id', studentId)
      .eq('is_active', true)
      .limit(1)
      .single();

    if (error) {
      return res.status(400).json({ error: 'No community found. Please join a community first.' });
    }

    if (!community.instructors) {
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
      .eq('instructor_id', community.instructor_id);

    const publishedCourses = courses?.filter(c => c.is_published) || [];
    const totalStudents = new Set(courses?.flatMap(c => c.enrollments?.map(e => e.id)) || []).size;

    const communityResponse = {
      id: community.instructors.id,
      name: community.instructors.business_name,
      instructor: {
        firstName: community.instructors.users.first_name,
        lastName: community.instructors.users.last_name,
        email: community.instructors.users.email
      },
      stats: {
        totalCourses: publishedCourses.length,
        totalStudents: totalStudents
      }
    };

    res.json(communityResponse);
  } catch (error) {
    console.error('Get student community error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};