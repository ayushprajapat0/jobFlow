import express from 'express'
import { applyforJob, getUserData, getUserJobApplications, updateUserResume } from '../controllers/user.controller.js';
import upload from '../config/multer.js'


const router = express.Router();

router.get('/user',getUserData);
router.post('/apply',applyforJob);
router.get('/applications',getUserJobApplications);
router.post('/update-resume',upload.single('resume'),updateUserResume);

export default router;