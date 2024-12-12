import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js"
import jobRoutes from "./routes/jobRoutes.js"

const app = express();
dotenv.config();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET','POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type','Authorization'],
    exposedHeaders: ['Set-Cookie']
}))

const connect = () =>{
    mongoose.connect(process.env.MONGO_URL).then(()=> console.log("connected to DB")).catch((err)=>{
        throw err;
    })
}

app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/",(req,res)=>{
  res.json("hello")
})

app.use('/api/auth',authRoutes)
app.use('/api/jobs', jobRoutes);

//! Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'production' ? {} : err.message 
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connect();
});