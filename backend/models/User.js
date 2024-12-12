import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  location: {
    type: String,
  },
  bio: {
    type: String,
  },
  phone: {
    type: String,
  },
  role: {
    type: String,
    enum: ['candidate', 'admin'],
    default: 'candidate'
  },
  profile: {
    resume: String,
    phone: String,
    location: String,
    skills: [String]
  },
  appliedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', UserSchema);

export default User;