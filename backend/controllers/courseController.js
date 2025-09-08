import { createClient } from '@supabase/supabase-js';

const getSupabaseClient = () => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  // Use SERVICE_ROLE_KEY instead of ANON_KEY for backend operations
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  return createClient(supabaseUrl, supabaseKey);
};

// Get instructor's courses
export const getCourses = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    
    const { data: courses, error } = await supabase
      .from('courses')
      .select(`
        *,
        modules (
          id,
          title,
          lessons (id)
        )
      `)
      .eq('instructor_id', req.user.instructors[0].id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new course
export const createCourse = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { title, description, category, level, type, price, thumbnailUrl, publishImmediately } = req.body;

    if (!title || !category || !level || !type) {
      return res.status(400).json({ error: 'Title, category, level, and type are required' });
    }

    const { data: course, error } = await supabase
      .from('courses')
      .insert({
        instructor_id: req.user.instructors[0].id,
        title,
        description,
        category,
        level,
        type,
        price: type === 'paid' ? price : 0,
        thumbnail_url: thumbnailUrl,
        is_published: publishImmediately || false
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(course);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update course - FIXED
export const updateCourse = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { courseId } = req.params;
    const { title, description, category, level, type, price, thumbnailUrl, publishImmediately } = req.body;

    // Prepare update data with proper field mapping
    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (level !== undefined) updateData.level = level;
    if (type !== undefined) updateData.type = type;
    if (price !== undefined) updateData.price = type === 'paid' ? price : 0;
    if (thumbnailUrl !== undefined) updateData.thumbnail_url = thumbnailUrl;
    if (publishImmediately !== undefined) updateData.is_published = publishImmediately;

    const { data: course, error } = await supabase
      .from('courses')
      .update(updateData)
      .eq('id', courseId)
      .eq('instructor_id', req.user.instructors[0].id)
      .select()
      .single();

    if (error) {
      console.error('Update course error:', error);
      return res.status(400).json({ error: error.message });
    }

    if (!course) {
      return res.status(404).json({ error: 'Course not found or unauthorized' });
    }

    res.json(course);
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { courseId } = req.params;

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId)
      .eq('instructor_id', req.user.instructors[0].id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Toggle course publication
export const toggleCoursePublication = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { courseId } = req.params;

    // First get current publication status
    const { data: currentCourse, error: fetchError } = await supabase
      .from('courses')
      .select('is_published')
      .eq('id', courseId)
      .eq('instructor_id', req.user.instructors[0].id)
      .single();

    if (fetchError) {
      return res.status(400).json({ error: fetchError.message });
    }

    // Toggle the publication status
    const { data: course, error } = await supabase
      .from('courses')
      .update({
        is_published: !currentCourse.is_published,
        updated_at: new Date().toISOString()
      })
      .eq('id', courseId)
      .eq('instructor_id', req.user.instructors[0].id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(course);
  } catch (error) {
    console.error('Toggle course publication error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get course with modules and lessons
export const getCourseContent = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { courseId } = req.params;

    const { data: course, error } = await supabase
      .from('courses')
      .select(`
        *,
        modules (
          *,
          lessons (*)
        )
      `)
      .eq('id', courseId)
      .eq('instructor_id', req.user.instructors[0].id)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(course);
  } catch (error) {
    console.error('Get course content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create module
export const createModule = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { courseId } = req.params;
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Module title is required' });
    }

    // Verify course belongs to instructor
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id')
      .eq('id', courseId)
      .eq('instructor_id', req.user.instructors[0].id)
      .single();

    if (courseError || !course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Get the next order index
    const { count } = await supabase
      .from('modules')
      .select('*', { count: 'exact', head: true })
      .eq('course_id', courseId);

    const { data: module, error } = await supabase
      .from('modules')
      .insert({
        course_id: courseId,
        title,
        description,
        order_index: count || 0
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(module);
  } catch (error) {
    console.error('Create module error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update module
export const updateModule = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { moduleId } = req.params;
    const { title, description } = req.body;

    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    const { data: module, error } = await supabase
      .from('modules')
      .update(updateData)
      .eq('id', moduleId)
      .select(`
        *,
        courses!inner(instructor_id)
      `)
      .single();

    if (error || !module || module.courses.instructor_id !== req.user.instructors[0].id) {
      return res.status(400).json({ error: 'Module not found or unauthorized' });
    }

    res.json(module);
  } catch (error) {
    console.error('Update module error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete module
export const deleteModule = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { moduleId } = req.params;

    // Verify module belongs to instructor's course
    const { data: module, error: fetchError } = await supabase
      .from('modules')
      .select(`
        id,
        courses!inner(instructor_id)
      `)
      .eq('id', moduleId)
      .single();

    if (fetchError || !module || module.courses.instructor_id !== req.user.instructors[0].id) {
      return res.status(404).json({ error: 'Module not found or unauthorized' });
    }

    const { error } = await supabase
      .from('modules')
      .delete()
      .eq('id', moduleId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Module deleted successfully' });
  } catch (error) {
    console.error('Delete module error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create lesson
export const createLesson = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { moduleId } = req.params;
    const { title, description, videoUrl, duration, resourceUrl, additionalContent, allowPreview } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Lesson title is required' });
    }

    // Verify module belongs to instructor's course
    const { data: module, error: moduleError } = await supabase
      .from('modules')
      .select(`
        id,
        courses!inner(instructor_id)
      `)
      .eq('id', moduleId)
      .single();

    if (moduleError || !module || module.courses.instructor_id !== req.user.instructors[0].id) {
      return res.status(404).json({ error: 'Module not found or unauthorized' });
    }

    // Get the next order index
    const { count } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .eq('module_id', moduleId);

    const { data: lesson, error } = await supabase
      .from('lessons')
      .insert({
        module_id: moduleId,
        title,
        description,
        video_url: videoUrl,
        duration: duration || 0,
        resource_url: resourceUrl,
        additional_content: additionalContent,
        allow_preview: allowPreview || false,
        order_index: count || 0
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(lesson);
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update lesson
export const updateLesson = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { lessonId } = req.params;
    const { title, description, videoUrl, duration, resourceUrl, additionalContent, allowPreview } = req.body;

    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (videoUrl !== undefined) updateData.video_url = videoUrl;
    if (duration !== undefined) updateData.duration = duration;
    if (resourceUrl !== undefined) updateData.resource_url = resourceUrl;
    if (additionalContent !== undefined) updateData.additional_content = additionalContent;
    if (allowPreview !== undefined) updateData.allow_preview = allowPreview;

    const { data: lesson, error } = await supabase
      .from('lessons')
      .update(updateData)
      .eq('id', lessonId)
      .select(`
        *,
        modules!inner(
          courses!inner(instructor_id)
        )
      `)
      .single();

    if (error || !lesson || lesson.modules.courses.instructor_id !== req.user.instructors[0].id) {
      return res.status(400).json({ error: 'Lesson not found or unauthorized' });
    }

    res.json(lesson);
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete lesson
export const deleteLesson = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { lessonId } = req.params;

    // Verify lesson belongs to instructor's course
    const { data: lesson, error: fetchError } = await supabase
      .from('lessons')
      .select(`
        id,
        modules!inner(
          courses!inner(instructor_id)
        )
      `)
      .eq('id', lessonId)
      .single();

    if (fetchError || !lesson || lesson.modules.courses.instructor_id !== req.user.instructors[0].id) {
      return res.status(404).json({ error: 'Lesson not found or unauthorized' });
    }

    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lessonId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};