import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
title: {
  type: String,
  required: true,
  trim: true
},
company: {
  type: String,
  required: true,
  trim: true
},
description: {
  type: String,
  required: true
},
location: {
  type: String,
  required: true
},
type: {
  type: String,
  enum: ['Full-time', 'Part-time', 'Contract', 'Remote'],
},
salaryRange: {
  min: Number,
  max: Number
},
category: {
  type: String,
  default: 'All'
},
requirements: [String],
responsibilities: [String],
benefits: [String],
applicationDeadline: Date,
postedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
},
applicants: [{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  resumeurl : {
    type: String,
  },
  coverLetter: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending'
  }
}],
status: {
  type: String,
  default: 'Active'
},
featured: {
  type: Boolean,
  default: false
}
}, {
timestamps: true
});

const Job = mongoose.model('Job', JobSchema);

export default Job;