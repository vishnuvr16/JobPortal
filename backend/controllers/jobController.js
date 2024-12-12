import Job from "../models/Job.js"
import User from "../models/User.js"

export const createJob = async (req, res) => {
  try {
    const { 
      title, 
      company, 
      description, 
      location, 
      type,
      salaryMin,
      salaryMax,
      requirements,
      responsibilities,
      benefits,
      category,
      applicationDeadline
    } = req.body;

    // Validate required fields
    if (!title || !company || !description || !location || !type) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        requiredFields: ['title', 'company', 'description', 'location', 'type']
      });
    }

    // Validate salary range
    if (salaryMin && salaryMax && salaryMin > salaryMax) {
      return res.status(400).json({ 
        message: 'Minimum salary cannot be greater than maximum salary' 
      });
    }

    // Create new job object with comprehensive details
    const newJob = new Job({
      title,
      company,
      description,
      location,
      type: type,
      salaryRange: {
        min: salaryMin || null,
        max: salaryMax || null
      },
      requirements: requirements || [],
      responsibilities: responsibilities || [],
      benefits: benefits || [],
      category: category || 'Uncategorized',
      applicationDeadline: applicationDeadline 
        ? new Date(applicationDeadline) 
        : null,
      status: 'active',
      postedBy: req.user.id
    });

    // Save the job
    const savedJob = await newJob.save();

    // Respond with created job
    res.status(201).json({
      message: 'Job created successfully',
      job: savedJob
    });

  } catch (error) {
    console.error('Job creation error:', error);

    // Handle specific MongoDB validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation Error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    // Generic error response
    res.status(500).json({ 
      message: 'Error creating job', 
      error: error.message 
    });
  }
};

// export const getAllJobs = async (req, res) => {
//   try {
//     const { 
//       search, 
//       category, 
//       location, 
//       type, 
//       page = 1, 
//       limit = 10 
//     } = req.query;

//     const query = {};
    
//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { company: { $regex: search, $options: 'i' } }
//       ];
//     }
    
//     if (category) query.category = category;
//     if (location) query.location = { $regex: location, $options: 'i' };
//     if (type) query.type = type;

//     const jobs = await Job.find(query)
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .sort({ createdAt: -1 });

//     const total = await Job.countDocuments(query);

//     res.json({
//       jobs,
//       totalPages: Math.ceil(total / limit),
//       currentPage: page
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching jobs', error: error.message });
//   }
// };

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch jobs."
    });
  }
};


export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job', error: error.message });
  }
};

export const getJobByCategory = async (req, res) => {
  try {
    const {category} = req.params;

    const jobs = await Job.find({category});
    
    if (jobs.length === 0) {
      return res.status(404).json({ message: 'No jobs found in this category' });
    }

    res.json({jobs:jobs});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
};

export const getFeaturedjobs = async (req, res) => {
  try {
    
    const jobs = await Job.find({featured: true});
    
    if (jobs.length === 0) {
      return res.status(404).json({ message: 'No jobs found in this category' });
    }

    res.json({jobs:jobs});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
};

export const applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user has already applied
    const hasApplied = job.applicants.some(
      applicant => applicant.user.toString() === req.user.id
    );

    if (hasApplied) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }

    job.applicants.push({
      user: req.user.id,
      status: 'pending',
      resumeurl: job.resumeurl,
      coverLetter: job.coverLetter
    });

    await job.save();

    // Update user's applied jobs
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { appliedJobs: job._id }
    });

    res.status(200).json({ message: 'Application submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error applying to job', error: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user.id }, 
      req.body, 
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error updating job', error: error.message });
  }
}

export const deleteJob = async (req, res) => {
  try {
    console.log("Query Conditions:", { _id: req.params.id, postedBy: req.user.id });

    const job = await Job.findOneAndDelete({ 
      _id: req.params.id, 
    });

    console.log("job",job)

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job', error: error.message });
  }
}

export const fetchJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId)
      .populate('applicants.user', 'fullName email profile phone');

     if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job.applicants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applicants', error: error.message });
  }
}

export const fetchApplicantDetails = async (req, res) => {
  try {
    const { status } = req.body;
    const job = await Job.findOneAndUpdate(
      { 
        _id: req.params.jobId, 
        'applicants._id': req.params.applicantId 
      },
      { 
        $set: { 'applicants.$.status': status } 
      },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job or applicant not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error updating applicant status', error: error.message });
  }
}