import { createClient } from '@supabase/supabase-js';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const getSupabaseClient = () => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  return createClient(supabaseUrl, supabaseKey);
};

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /\.(jpg|jpeg|png|gif|mp4|mov|avi|webm)$/i;
    const extname = allowedTypes.test(path.extname(file.originalname));
    const mimetype = /^(image|video)\//i.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

const uploadFileToStorage = async (file, folder = 'about-page-media') => {
  const supabase = getSupabaseClient();
  const fileExtension = path.extname(file.originalname);
  const fileName = `${folder}/${uuidv4()}${fileExtension}`;
  
  const { data, error } = await supabase.storage
    .from('instructor-media')
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data: urlData } = supabase.storage
    .from('instructor-media')
    .getPublicUrl(fileName);

  return {
    url: urlData.publicUrl,
    fileName: fileName,
    originalName: file.originalname,
    size: file.size,
    mimeType: file.mimetype
  };
};

export const getAboutPage = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    
    const { data: aboutPage, error } = await supabase
      .from('instructor_about_pages')
      .select(`
        *,
        instructor_intro_content (
          *,
          instructor_intro_media_items (*)
        )
      `)
      .eq('instructor_id', req.user.instructors[0].id)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(400).json({ error: error.message });
    }

    if (!aboutPage) {
      const defaultData = {
        instructor_id: req.user.instructors[0].id,
        title: `${req.user.first_name || 'Your'} ${req.user.last_name || 'Name'}'s Learning Community`,
        subtitle: 'Expert Instructor',
        description: 'Welcome to my learning community! Join a thriving community of learners.',
        instructor_bio: 'Passionate educator helping students achieve their learning goals.',
        primary_color: '#8b5cf6',
        secondary_color: '#3b82f6',
        subdirectory: req.user.instructors[0].subdirectory,
        is_published: false
      };

      const { data: newAboutPage, error: createError } = await supabase
        .from('instructor_about_pages')
        .insert(defaultData)
        .select(`
          *,
          instructor_intro_content (
            *,
            instructor_intro_media_items (*)
          )
        `)
        .single();

      if (createError) {
        return res.status(400).json({ error: createError.message });
      }

      return res.json(newAboutPage);
    }

    res.json(aboutPage);
  } catch (error) {
    console.error('Get about page error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateAboutPage = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const updateData = { updated_at: new Date().toISOString() };
    
    const allowedFields = ['title', 'subtitle', 'description', 'instructor_bio', 'primary_color', 'secondary_color', 'subdirectory', 'custom_domain', 'is_published'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field.replace(/([A-Z])/g, '_$1').toLowerCase()] = req.body[field];
      }
    });

    const { data: aboutPage, error } = await supabase
      .from('instructor_about_pages')
      .update(updateData)
      .eq('instructor_id', req.user.instructors[0].id)
      .select(`
        *,
        instructor_intro_content (
          *,
          instructor_intro_media_items (*)
        )
      `)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(aboutPage);
  } catch (error) {
    console.error('Update about page error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createIntroContent = [
  upload.array('mediaFiles', 10),
  async (req, res) => {
    try {
      const supabase = getSupabaseClient();
      const { description, videoUrls } = req.body;

      if (!description) {
        return res.status(400).json({ error: 'Description is required' });
      }

      // Get about page
      const { data: aboutPage } = await supabase
        .from('instructor_about_pages')
        .select('id')
        .eq('instructor_id', req.user.instructors[0].id)
        .single();

      if (!aboutPage) {
        return res.status(404).json({ error: 'About page not found' });
      }

      // Check if intro content already exists
      const { data: existingContent } = await supabase
        .from('instructor_intro_content')
        .select('id')
        .eq('about_page_id', aboutPage.id)
        .single();

      if (existingContent) {
        return res.status(400).json({ error: 'Intro content already exists. Use update instead.' });
      }

      // Create intro content
      const { data: introContent, error: contentError } = await supabase
        .from('instructor_intro_content')
        .insert({
          about_page_id: aboutPage.id,
          description
        })
        .select()
        .single();

      if (contentError) {
        return res.status(400).json({ error: contentError.message });
      }

      // Process video URLs
      const mediaItems = [];
      if (videoUrls) {
        const urls = Array.isArray(videoUrls) ? videoUrls : [videoUrls];
        for (let i = 0; i < urls.length; i++) {
          if (urls[i]) {
            mediaItems.push({
              intro_content_id: introContent.id,
              type: 'video',
              url: urls[i],
              order_index: mediaItems.length
            });
          }
        }
      }

      // Process uploaded files
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          try {
            const uploadResult = await uploadFileToStorage(file);
            mediaItems.push({
              intro_content_id: introContent.id,
              type: 'image',
              url: uploadResult.url,
              file_name: uploadResult.fileName,
              order_index: mediaItems.length
            });
          } catch (uploadError) {
            console.error('File upload error:', uploadError);
            continue;
          }
        }
      }

      // Insert media items
      if (mediaItems.length > 0) {
        const { error: mediaError } = await supabase
          .from('instructor_intro_media_items')
          .insert(mediaItems);

        if (mediaError) {
          console.error('Media items insert error:', mediaError);
        }
      }

      // Return complete intro content with media items
      const { data: completeContent } = await supabase
        .from('instructor_intro_content')
        .select(`
          *,
          instructor_intro_media_items (*)
        `)
        .eq('id', introContent.id)
        .single();

      res.status(201).json(completeContent);
    } catch (error) {
      console.error('Create intro content error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
];

export const updateIntroContent = [
  upload.array('mediaFiles', 10),
  async (req, res) => {
    try {
      const supabase = getSupabaseClient();
      const { contentId } = req.params;
      const { description, videoUrls, removeMediaIds } = req.body;

      // Update description if provided
      if (description) {
        const { error: updateError } = await supabase
          .from('instructor_intro_content')
          .update({ 
            description,
            updated_at: new Date().toISOString()
          })
          .eq('id', contentId);

        if (updateError) {
          return res.status(400).json({ error: updateError.message });
        }
      }

      // Remove specified media items
      if (removeMediaIds) {
        const idsToRemove = Array.isArray(removeMediaIds) ? removeMediaIds : [removeMediaIds];
        
        // Get file names to delete from storage
        const { data: mediaToDelete } = await supabase
          .from('instructor_intro_media_items')
          .select('file_name')
          .in('id', idsToRemove)
          .eq('intro_content_id', contentId);

        // Delete from storage
        if (mediaToDelete && mediaToDelete.length > 0) {
          const filesToDelete = mediaToDelete.filter(m => m.file_name).map(m => m.file_name);
          if (filesToDelete.length > 0) {
            await supabase.storage
              .from('instructor-media')
              .remove(filesToDelete);
          }
        }

        // Delete from database
        const { error: deleteError } = await supabase
          .from('instructor_intro_media_items')
          .delete()
          .in('id', idsToRemove)
          .eq('intro_content_id', contentId);

        if (deleteError) {
          console.error('Delete media error:', deleteError);
        }
      }

      // Add new video URLs
      const newMediaItems = [];
      if (videoUrls) {
        const urls = Array.isArray(videoUrls) ? videoUrls : [videoUrls];
        
        // Get current max order_index
        const { data: existingMedia } = await supabase
          .from('instructor_intro_media_items')
          .select('order_index')
          .eq('intro_content_id', contentId)
          .order('order_index', { ascending: false })
          .limit(1);

        let nextOrderIndex = existingMedia && existingMedia.length > 0 ? existingMedia[0].order_index + 1 : 0;

        for (let i = 0; i < urls.length; i++) {
          if (urls[i]) {
            newMediaItems.push({
              intro_content_id: contentId,
              type: 'video',
              url: urls[i],
              order_index: nextOrderIndex++
            });
          }
        }
      }

      // Add new uploaded files
      if (req.files && req.files.length > 0) {
        // Get current max order_index if we haven't already
        if (newMediaItems.length === 0) {
          const { data: existingMedia } = await supabase
            .from('instructor_intro_media_items')
            .select('order_index')
            .eq('intro_content_id', contentId)
            .order('order_index', { ascending: false })
            .limit(1);

          let nextOrderIndex = existingMedia && existingMedia.length > 0 ? existingMedia[0].order_index + 1 : 0;

          for (const file of req.files) {
            try {
              const uploadResult = await uploadFileToStorage(file);
              newMediaItems.push({
                intro_content_id: contentId,
                type: 'image',
                url: uploadResult.url,
                file_name: uploadResult.fileName,
                order_index: nextOrderIndex++
              });
            } catch (uploadError) {
              console.error('File upload error:', uploadError);
              continue;
            }
          }
        } else {
          let nextOrderIndex = newMediaItems[newMediaItems.length - 1].order_index + 1;
          
          for (const file of req.files) {
            try {
              const uploadResult = await uploadFileToStorage(file);
              newMediaItems.push({
                intro_content_id: contentId,
                type: 'image',
                url: uploadResult.url,
                file_name: uploadResult.fileName,
                order_index: nextOrderIndex++
              });
            } catch (uploadError) {
              console.error('File upload error:', uploadError);
              continue;
            }
          }
        }
      }

      // Insert new media items
      if (newMediaItems.length > 0) {
        const { error: mediaError } = await supabase
          .from('instructor_intro_media_items')
          .insert(newMediaItems);

        if (mediaError) {
          console.error('Media items insert error:', mediaError);
        }
      }

      // Return updated content
      const { data: updatedContent } = await supabase
        .from('instructor_intro_content')
        .select(`
          *,
          instructor_intro_media_items (*)
        `)
        .eq('id', contentId)
        .single();

      res.json(updatedContent);
    } catch (error) {
      console.error('Update intro content error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
];

export const deleteIntroContent = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { contentId } = req.params;

    // Get media files to delete from storage
    const { data: mediaItems } = await supabase
      .from('instructor_intro_media_items')
      .select('file_name')
      .eq('intro_content_id', contentId);

    // Delete files from storage
    if (mediaItems && mediaItems.length > 0) {
      const filesToDelete = mediaItems.filter(m => m.file_name).map(m => m.file_name);
      if (filesToDelete.length > 0) {
        await supabase.storage
          .from('instructor-media')
          .remove(filesToDelete);
      }
    }

    // Delete intro content (media items will be deleted via cascade)
    const { error } = await supabase
      .from('instructor_intro_content')
      .delete()
      .eq('id', contentId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Intro content deleted successfully' });
  } catch (error) {
    console.error('Delete intro content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPublicAboutPage = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { subdirectory } = req.params;

    const { data: aboutPage, error } = await supabase
      .from('instructor_about_pages')
      .select(`
        *,
        instructor_intro_content (
          *,
          instructor_intro_media_items (*)
        ),
        instructors!inner(
          id,
          business_name,
          users!inner(first_name, last_name)
        )
      `)
      .eq('subdirectory', subdirectory)
      .eq('is_published', true)
      .single();

    if (error) {
      return res.status(404).json({ error: 'About page not found' });
    }

    // Get course stats
    const { data: courses } = await supabase
      .from('courses')
      .select('id, title, is_published')
      .eq('instructor_id', aboutPage.instructors.id);

    const publishedCourses = courses?.filter(c => c.is_published) || [];

    // Get student count from enrollments
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('student_id')
      .in('course_id', publishedCourses.map(c => c.id));

    const uniqueStudents = new Set(enrollments?.map(e => e.student_id) || []).size;

    const responseData = {
      ...aboutPage,
      stats: {
        totalCourses: publishedCourses.length,
        totalStudents: uniqueStudents,
        rating: 4.9
      },
      availableCourses: publishedCourses.map(course => ({
        id: course.id,
        title: course.title
      })),
      instructor: aboutPage.instructors
    };

    res.json(responseData);
  } catch (error) {
    console.error('Get public about page error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};