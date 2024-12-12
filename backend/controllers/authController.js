import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import Job from "../models/Job.js"

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: 'candidate' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token',token ,{
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24*60*60*1000
    })

    res.status(201).json({ token, user: { id: user._id, name: user.fullName,email: user.email, role: 'candidate' } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token',token ,{
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24*60*60*1000
    })

    res.json({ token, user: { id: user._id, name: user.fullName,email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const logout = async (req,res) =>{
  res.cookie('token','',{
    httpOnly: true,
    expires: new Date(0),
    sameSite: 'lax',
  })

  res.status(200).json({message: "Logged out successfully"})
}

export const getProfile = async(req, res) => {
  const user = await User.findById(req.user.id)
      .select('-password')
      // .populate('applicants');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
}

export const updateProfile = async (req, res) => {
  try {
    console.log("body",req.body)
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, 
      req.body, 
      { new: true }
    ).select('-password');
    console.log("updated",updatedUser)
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
}

export const fetchUserApplications = async (req, res) => {
  try {
    const applications = await Job.find({
      'applicants.user': req.user.id, 
    });

    if (applications.length === 0) {
      return res.status(200).json(applications);
    }

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching user applications',
      error: error.message,
    });
  }
}