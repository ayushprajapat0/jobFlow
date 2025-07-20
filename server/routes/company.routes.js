import express from 'express'
import { changeJobApplicationStatus, chnageJobVisibility, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from '../controllers/company.controller.js';
import upload from '../config/multer.js';
import { authMiddleware } from '../middlewares/authmiddleware.js';

const router=express.Router();

//register a company
router.post('/register',upload.single('image'),registerCompany);

//company login
router.post('/login',loginCompany);

//get company data
router.get('/company',authMiddleware,getCompanyData);

//post a job
router.post('/post-job',authMiddleware,postJob);

//get applicants data of company
router.get('/applicants',authMiddleware,getCompanyJobApplicants);

//get company job list
router.get('/list-jobs',authMiddleware,getCompanyPostedJobs);

//change application status
router.post('/change-status',authMiddleware,changeJobApplicationStatus);

//change application visibility
router.post('/change-visibility',authMiddleware,chnageJobVisibility);

export default router;