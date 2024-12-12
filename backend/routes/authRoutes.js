// routes/authRoutes.js
import express from "express";
import { register,login, getProfile, updateProfile, logout, fetchUserApplications } from "../controllers/authController.js";
import { authMiddleware,checkRole } from "../middlewares/auth.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import Job from "../models/Job.js"

const router = express.Router();

// Public Routes
router.post('/register', register);
router.post('/login', login);

router.post('/logout',logout)

// ! get profile
router.get('/profile',authMiddleware, getProfile);

// ! update profile
router.put('/profile', authMiddleware, updateProfile);

// ! get user applications
router.get("/applications", authMiddleware, fetchUserApplications);


export default router;