import express from 'express'
import { changeJobApplicationStatus, chnageJobVisibility, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from '../controllers/company.controller.js';
import upload from '../config/multer.js';
import { protectCompany } from '../middlewares/authmiddleware.js';

const router=express.Router();

//register a company
router.post('/register',upload.single('image'),registerCompany);

//company login
router.post('/login',loginCompany);

//get company data
router.get('/company',protectCompany,getCompanyData);

//post a job
router.post('/post-job',protectCompany,postJob);

//get applicants data of company
router.get('/applicants',protectCompany,getCompanyJobApplicants);

//get company job list
router.get('/list-jobs',protectCompany,getCompanyPostedJobs);

//change application status
router.post('/change-status',protectCompany,changeJobApplicationStatus);

//change application visibility
router.post('/change-visibility',protectCompany,chnageJobVisibility);

export default router;