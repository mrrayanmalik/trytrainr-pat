import express from 'express';
import { 
  studentSignup, 
  instructorSignup, 
  login, 
  getCurrentUser, 
  checkSubdirectory, 
  getInstructors 
} from './controllers/authController.js';
import { authenticateToken } from './middleware/auth.js';

const router = express.Router();

// Auth routes
router.post('/auth/signup/student', studentSignup);
router.post('/auth/signup/instructor', instructorSignup);
router.post('/auth/login', login);
router.get('/auth/me', authenticateToken, getCurrentUser);
router.get('/auth/check-subdirectory/:subdirectory', checkSubdirectory);
router.get('/auth/instructors', getInstructors);

// Test routes
router.get('/health', (req, res) => {
  res.json({ 
    message: 'API is healthy!',
    timestamp: new Date().toISOString()
  });
});

export default router;