# Job Portal

A MERN stack application that enables users to browse and apply for jobs while providing admins the ability to manage job listings and view applications.

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
  - [Jobs API](#jobs-api)
  - [Applications API](#applications-api)
- [Deployment](#deployment)
- [Acknowledgements](#acknowledgements)
---

## Overview
This job portal application demonstrates full-stack development capabilities by combining a React-based frontend, a Node.js/Express.js backend, and MongoDB as the database. It provides a seamless experience for users and admins, featuring job listing management, application submission, and more.

---

## Features

### User Features
- View available job listings.
- Apply for jobs by filling out a simple form.
- View and update their profile.
- Search jobs by terms , category.

### Admin Features
- Add, edit, or delete job listings.
- View applications submitted by users.
- View and update their profile.

---

## Tech Stack
- **Frontend:** React, Fetch (for communication)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Deployment:** Vercel (Frontend & Backend)

---

## Setup Instructions

### Prerequisites
- Node.js (v18 or later)
- MongoDB instance (local or cloud-based like MongoDB Atlas)
- Git

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vishnuvr16/JobPortal.git
   cd JobPortal
2. **Install Dependencies:**
     - For Frontend
       
     ```env
     cd frontend
     npm install
     ```
      - For Backend
        
     ```env
     cd backend
     npm install
     ```
3. **Set up environment variables:**
   - Create a `.env` file in the `backend` directory with the following:
     ```env
     PORT=8000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET = give_any_secret_key
     FRONTEND_URL = http://localhost:3000
     ```
   - Create a `.env` file in the `frontend` directory with the following:
     ```env
     REACT_APP_API_URL=http://localhost:8000
     ```

4. **Run the application locally:**
   - Start the backend:
     ```bash
     cd backend
     npm start
     ```
   - Start the frontend:
     ```bash
     cd frontend
     npm start
     ```

5. **Access the application:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:8000](http://localhost:8000)

---

## API Documentation

### Jobs API

#### Fetch All Jobs
- **Endpoint:** `GET /api/jobs`
- **Description:** Retrieve all job listings.
- **Response:**
  ```json
  [
    {
      "_id": "job_id",
      "title": "Job Title",
      "company": "Company Name",
      "location": "Location",
      "description": "Job Description",
    },
  ]
#### Get Job by Id
- **Endpoint:** `GET /api/jobs/:id`
- **Description:** Fetch particular job
- **Response:**
  ```json
  [
    {
      "_id": "job_id",
      "title": "Job Title",
      "company": "Company Name",
      "location": "Location",
      "description": "Job Description",
    }
  ]
#### Add a Job (Admin)
- **Endpoint:** `POST /api/jobs`
- **Description:** Create a new job listing.
- **Headers:**
  ```json
  {
     "title": " ",
      "company": " ",
      "description": " ",
      "location" : " ",
  }
#### Edit a Job (Admin)
- **Endpoint:** `PUT /api/jobs/:id`
- **Description:** Edit a job.
- **Body:**
  ```json
  {
  "title": "Job Title",
  "company": "Company Name",
  "location": "Location",
  "description": "Job Description"
  }

#### Delete a Job (Admin)
- **Endpoint:** `Delete /api/jobs/:id`

### Applications API

#### Submit an Application
- **Endpoint:** `POST /api/jobs/:id/apply`
- **Description:** Apply for a job.
- **Body:**
  ```json
  {
  "name": "Applicant Name",
  "email": "applicant@example.com",
  "resume_url": "http://resume-link.com",
  "job_id": "job_id"
  }

#### View Applications
- **Endpoint:** `Get /api/jobs/:id/applicants`
- **Description:** Get all applicants of a job.
- **Body:**
  ```json
  [
    {
    "_id": "application_id",
    "name": "Applicant Name",
    "email": "applicant@example.com",
    "resume_url": "http://resume-link.com",
    "job_id": "job_id"
    }
  ]

---

## Deployment
   - Frontend: [Vercel-frontend Deployment Link](https://job-portal-client-eosin.vercel.app/)
   - Backend: [Vercel-backend Deployment Link](https://job-portal-five-sage.vercel.app/)

---

## Acknowledgements

- **React** - JavaScript library for building user interfaces.
- **Node.js** - JavaScript runtime used for backend development.
- **Fetch API** - For handling HTTP requests in the frontend.
  

