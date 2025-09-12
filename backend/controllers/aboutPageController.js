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
    const instructorId = req.user.instructors[0].id;
    
    console.log('Getting about page for instructor:', instructorId);

    // First, get the about page
    const { data: aboutPage, error: aboutPageError } = await supabase
      .from('instructor_about_pages')
      .select('*')
      .eq('instructor_id', instructorId)
      .single();

    console.log('About page query:', { aboutPage, aboutPageError });

    if (aboutPageError && aboutPageError.code !== 'PGRST116') {
      return res.status(400).json({ error: aboutPageError.message });
    }

    if (!aboutPage) {
      // Create default about page
      const defaultData = {
        instructor_id: instructorId,
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
        .select()
        .single();

      if (createError) {
        return res.status(400).json({ error: createError.message });
      }

      aboutPage = newAboutPage;
    }

    // Separately get intro content
    const { data: introContent, error: introError } = await supabase
      .from('instructor_intro_content')
      .select('*')
      .eq('about_page_id', aboutPage.id);

    console.log('Intro content query:', { introContent, introError });

    // If intro content exists, get media items
    let mediaItems = [];
    if (introContent && introContent.length > 0) {
      const { data: media, error: mediaError } = await supabase
        .from('instructor_intro_media_items')
        .select('*')
        .eq('intro_content_id', introContent[0].id)
        .order('order_index');

      console.log('Media items query:', { media, mediaError });
      mediaItems = media || [];
    }

    // Manually construct the nested structure
    const formattedIntroContent = introContent && introContent.length > 0 ? [{
      ...introContent[0],
      instructor_intro_media_items: mediaItems
    }] : [];

    console.log('Formatted intro content:', formattedIntroContent);

    // Get course stats 
    const { data: courses } = await supabase
      .from('courses')
      .select('id, title, is_published, thumbnail_url, description')
      .eq('instructor_id', instructorId);

    const publishedCourses = courses?.filter(c => c.is_published) || [];

    // Get student count from enrollments
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('student_id')
      .in('course_id', publishedCourses.map(c => c.id));

    const uniqueStudents = new Set(enrollments?.map(e => e.student_id) || []).size;

    const responseData = {
      ...aboutPage,
      instructor_intro_content: formattedIntroContent,
      stats: {
        totalCourses: publishedCourses.length,
        totalStudents: uniqueStudents,
        rating: 4.9
      },
      availableCourses: publishedCourses.map(course => ({
        id: course.id,
        title: course.title,
        thumbnail_url: course.thumbnail_url,
        description: course.description
      })),
      instructor: {
        id: instructorId,
        business_name: req.user.instructors[0].business_name,
        users: {
          first_name: req.user.first_name,
          last_name: req.user.last_name
        }
      }
    };

    console.log('Final response - intro content:', responseData.instructor_intro_content);
    res.json(responseData);
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

      console.log('Creating intro content:', { 
        description, 
        videoUrls, 
        files: req.files?.length,
        user: req.user?.id,
        instructor: req.user?.instructors?.[0]?.id 
      });

      if (!description) {
        console.log('Error: Description is required');
        return res.status(400).json({ error: 'Description is required' });
      }

      // Check if user has instructor profile
      if (!req.user.instructors || req.user.instructors.length === 0) {
        console.log('Error: User has no instructor profile');
        return res.status(400).json({ error: 'No instructor profile found' });
      }

      const instructorId = req.user.instructors[0].id;
      console.log('Instructor ID:', instructorId);

      // Get about page
      const { data: aboutPage, error: aboutPageError } = await supabase
        .from('instructor_about_pages')
        .select('id')
        .eq('instructor_id', instructorId)
        .single();

      console.log('About page query result:', { aboutPage, aboutPageError });

      if (aboutPageError || !aboutPage) {
        console.log('Error: About page not found, creating one...');
        
        // Create about page if it doesn't exist
        const defaultData = {
          instructor_id: instructorId,
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
          .select('id')
          .single();

        if (createError) {
          console.log('Error creating about page:', createError);
          return res.status(400).json({ error: 'Failed to create about page: ' + createError.message });
        }

        aboutPage = newAboutPage;
        console.log('Created new about page:', aboutPage);
      }

      // Check if intro content already exists
      const { data: existingContent, error: existingError } = await supabase
        .from('instructor_intro_content')
        .select('id')
        .eq('about_page_id', aboutPage.id)
        .single();

      console.log('Existing content check:', { existingContent, existingError });

      if (existingContent) {
        console.log('Error: Intro content already exists');
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

      console.log('Intro content creation result:', { introContent, contentError });

      if (contentError) {
        console.error('Content creation error:', contentError);
        return res.status(400).json({ error: 'Failed to create intro content: ' + contentError.message });
      }

      // Process video URLs
      const mediaItems = [];
      if (videoUrls) {
        const urls = Array.isArray(videoUrls) ? videoUrls : [videoUrls];
        console.log('Processing video URLs:', urls);
        
        for (let i = 0; i < urls.length; i++) {
          if (urls[i] && urls[i].trim()) {
            mediaItems.push({
              intro_content_id: introContent.id,
              type: 'video',
              url: urls[i].trim(),
              order_index: mediaItems.length
            });
          }
        }
      }

      // Process uploaded files
      if (req.files && req.files.length > 0) {
        console.log('Processing uploaded files:', req.files.length);
        
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

      console.log('Media items to insert:', mediaItems);

      // Insert media items
      if (mediaItems.length > 0) {
        const { error: mediaError } = await supabase
          .from('instructor_intro_media_items')
          .insert(mediaItems);

        if (mediaError) {
          console.error('Media items insert error:', mediaError);
          return res.status(400).json({ error: 'Failed to insert media items: ' + mediaError.message });
        }
      }

      // Return complete intro content with media items
      const { data: completeContent, error: fetchError } = await supabase
        .from('instructor_intro_content')
        .select(`
          *,
          instructor_intro_media_items (*)
        `)
        .eq('id', introContent.id)
        .single();

      if (fetchError) {
        console.error('Error fetching complete content:', fetchError);
        return res.status(400).json({ error: 'Failed to fetch complete content: ' + fetchError.message });
      }

      console.log('Successfully created intro content:', completeContent);
      res.status(201).json(completeContent);
    } catch (error) {
      console.error('Create intro content error:', error);
      res.status(500).json({ error: 'Internal server error: ' + error.message });
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
          if (urls[i] && urls[i].trim()) {
            newMediaItems.push({
              intro_content_id: contentId,
              type: 'video',
              url: urls[i].trim(),
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

    console.log('Getting public about page for subdirectory:', subdirectory);

    // Use the same approach as getAboutPage - separate queries
    const { data: aboutPage, error } = await supabase
      .from('instructor_about_pages')
      .select(`
        *,
        instructors!inner(
          id,
          business_name,
          users!inner(first_name, last_name)
        )
      `)
      .eq('subdirectory', subdirectory)
      .eq('is_published', true)
      .single();

    console.log('Public about page query result:', { aboutPage, error });

    if (error) {
      console.log('Public about page not found:', error);
      return res.status(404).json({ error: 'About page not found' });
    }

    // Separately get intro content
    const { data: introContent, error: introError } = await supabase
      .from('instructor_intro_content')
      .select('*')
      .eq('about_page_id', aboutPage.id);

    console.log('Public intro content query:', { introContent, introError });

    // If intro content exists, get media items
    let mediaItems = [];
    if (introContent && introContent.length > 0) {
      const { data: media, error: mediaError } = await supabase
        .from('instructor_intro_media_items')
        .select('*')
        .eq('intro_content_id', introContent[0].id)
        .order('order_index');

      console.log('Public media items query:', { media, mediaError });
      mediaItems = media || [];
    }

    // Manually construct the nested structure
    const formattedIntroContent = introContent && introContent.length > 0 ? [{
      ...introContent[0],
      instructor_intro_media_items: mediaItems
    }] : [];

    console.log('Public formatted intro content:', formattedIntroContent);

    // Get course stats
    const { data: courses } = await supabase
      .from('courses')
      .select('id, title, is_published, thumbnail_url, description')
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
      instructor_intro_content: formattedIntroContent,
      stats: {
        totalCourses: publishedCourses.length,
        totalStudents: uniqueStudents,
        rating: 4.9
      },
      availableCourses: publishedCourses.map(course => ({
        id: course.id,
        title: course.title,
        thumbnail_url: course.thumbnail_url,
        description: course.description
      })),
      instructor: aboutPage.instructors
    };

    console.log('Public final response - intro content:', responseData.instructor_intro_content);
    res.json(responseData);
  } catch (error) {
    console.error('Get public about page error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// New endpoint for joining community
// Update the existing joinCommunity function
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