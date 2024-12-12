import express from "express";
import { createJob,getAllJobs,getJobById,applyToJob, getJobByCategory, getFeaturedjobs, updateJob, deleteJob, fetchJobApplicants, fetchApplicantDetails} from "../controllers/jobController.js";
import { authMiddleware,checkRole } from "../middlewares/auth.js";
import Job from "../models/Job.js";

const router = express.Router();

router.get('/featured',getFeaturedjobs);

// Public Routes
router.get('/', getAllJobs);
router.get('/:id', getJobById);

//! Create a job 
router.post('/', 
  authMiddleware, 
  checkRole(['admin']), 
  createJob
);

// ! apply for a job
router.post('/:id/apply', 
  authMiddleware, 
  checkRole(['candidate']), 
  applyToJob
);

router.get('/category/:category',getJobByCategory);

router.get('/candidate/applied-jobs', 
  authMiddleware, 
  checkRole(['candidate']), 
  async (req, res) => {
    try {
      const jobs = await Job.find({ 
        'applicants.user': req.user.id 
      });
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching applied jobs', error: error.message });
    }
  }
);

// ! update job
router.put('/:id', 
  authMiddleware, 
  checkRole(['employer', 'admin']), 
  updateJob
);

// ! delete job
router.delete('/:id', 
  authMiddleware, 
  checkRole(['admin']), 
  deleteJob
);

// ! all applicants of a job
router.get('/:jobId/applicants', 
  authMiddleware, 
  checkRole(['employer', 'admin']), 
  fetchJobApplicants
);

// ! get applicant details
router.put('/:jobId/applicants/:applicantId', 
  authMiddleware, 
  checkRole(['employer', 'admin']), 
  fetchApplicantDetails
);

export default router;