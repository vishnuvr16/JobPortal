import express from "express";
import authRoutes from "../routes/authRoutes.js"
import jobRoutes from "../routes/jobRoutes.js"

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);

export default router;
