import express from 'express'
import { getJobs, getJobsbyId } from '../controllers/job.controller.js';

const router = express.Router()


//route to get all job data
router.get('/',getJobs)

//route to get single job by id
router.get('/:id',getJobsbyId)

export default router;