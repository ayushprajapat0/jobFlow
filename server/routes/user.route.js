import express from 'express'
import { 
    signup, 
    signin, 
    applyforJob, 
    getUserData, 
    getUserJobApplications, 
    updateUserResume 
} from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/authmiddleware.js';
import upload, { handleMulterError } from '../config/multer.js'

const router = express.Router();

// Public routes
router.post('/signup', upload.single('image'), signup);
router.post('/signin', signin);

// Protected routes
router.get('/user', authMiddleware, getUserData);
router.post('/apply', authMiddleware, applyforJob);
router.get('/applications', authMiddleware, getUserJobApplications);
router.post('/update-resume', authMiddleware, upload.single('resume'), handleMulterError, updateUserResume);

export default router;