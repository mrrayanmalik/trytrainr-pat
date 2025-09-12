import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

// Helper function to create supabase client
const getSupabaseClient = () => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  // Use SERVICE_ROLE_KEY instead of ANON_KEY for backend operations
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  return createClient(supabaseUrl, supabaseKey);
};

// Helper function to generate JWT
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

// Student Signup
// Remove instructor selection from student signup
export const studentSignup = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    
    const { firstName, lastName, email, password } = req.body; // Remove selectedInstructorId

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        role: 'student',
        first_name: firstName,
        last_name: lastName
      })
      .select()
      .single();

    if (userError) {
      return res.status(400).json({ error: userError.message });
    }

    // Create student profile without instructor_id
    const { error: studentError } = await supabase
        .from('students')
        .insert({
            user_id: user.id,
            instructor_id: null // Always null now
        });

    if (studentError) {
      return res.status(400).json({ error: studentError.message });
    }

    const token = generateToken(user.id, user.role);
    
    res.status(201).json({
      message: 'Student account created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name
      }
    });
  } catch (error) {
    console.error('Student signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Instructor Signup
export const instructorSignup = async (req, res) => {
  try {
    const supabase = getSupabaseClient(); // Create client here
    
    const { firstName, lastName, email, password, businessName, subdirectory } = req.body;

    if (!firstName || !lastName || !email || !password || !businessName || !subdirectory) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Check if subdirectory is available
    const { data: existingSubdirectory } = await supabase
      .from('instructors')
      .select('id')
      .eq('subdirectory', subdirectory)
      .single();

    if (existingSubdirectory) {
      return res.status(400).json({ error: 'Subdirectory already taken' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        role: 'instructor',
        first_name: firstName,
        last_name: lastName
      })
      .select()
      .single();

    if (userError) {
      return res.status(400).json({ error: userError.message });
    }

    // Create instructor profile
    const { error: instructorError } = await supabase
      .from('instructors')
      .insert({
        user_id: user.id,
        business_name: businessName,
        subdirectory: subdirectory
      });

    if (instructorError) {
      return res.status(400).json({ error: instructorError.message });
    }

    const token = generateToken(user.id, user.role);
    
    res.status(201).json({
      message: 'Instructor account created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name
      }
    });
  } catch (error) {
    console.error('Instructor signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const supabase = getSupabaseClient(); // Create client here
    
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Get user with associated data
    let query = supabase
      .from('users')
      .select('*, instructors(*), students(*)')
      .eq('email', email);

    if (role) {
      query = query.eq('role', role);
    }

    const { data: user, error } = await query.single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.role);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        instructor: user.instructors?.[0] || null,
        student: user.students?.[0] || null
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      firstName: req.user.first_name,
      lastName: req.user.last_name,
      instructor: req.user.instructors?.[0] || null,
      student: req.user.students?.[0] || null
    }
  });
};

// Check subdirectory availability
export const checkSubdirectory = async (req, res) => {
  try {
    const supabase = getSupabaseClient(); // Create client here
    const { subdirectory } = req.params;
    
    const { data } = await supabase
      .from('instructors')
      .select('id')
      .eq('subdirectory', subdirectory)
      .single();

    res.json({ available: !data });
  } catch (error) {
    res.status(500).json({ error: 'Error checking subdirectory' });
  }
};

// Get instructors list for student signup
export const getInstructors = async (req, res) => {
  try {
    const supabase = getSupabaseClient(); // Create client here
    
    const { data: instructors, error } = await supabase
      .from('instructors')
      .select('id, business_name')
      .order('business_name');

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(instructors);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching instructors' });
  }
};