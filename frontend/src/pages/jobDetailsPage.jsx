import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign, 
  FileText, 
  Send, 
  ArrowLeft,
  CheckCircle,
  Calendar,
  Users
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import {format} from "timeago.js"
import { useSelector } from 'react-redux';
import summaryApi from '../common';

const JobDetailsPage = () => {
  const [job, setJob] = useState(null);
  const {id} = useParams();
  const [isApplying, setIsApplying] = useState(false);
  const {user} = useSelector(state => state.auth)
  const [applicationForm, setApplicationForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    resumeUrl: '',
    coverLetter: ''
  });

  //! get job details
  useEffect(() => {
    const getJob = async () => {
      try {
        const response = await fetch(`${summaryApi.getJobById.url}/${id}`, {
          method: summaryApi.getJobById.method,
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch jobs: ${response.statusText}`);
        }

        const res = await response.json(); // Parse the JSON response
        setJob(res); 
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    getJob();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitApplication = async(e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${summaryApi.submitJobApplication.url}/${job._id}/apply`,{
        method: summaryApi.submitJobApplication.method,
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(applicationForm)
      })

      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
    alert('Application submitted successfully!');
    setIsApplying(false);
  };

  if (!job) return <div>Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Job Header */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-blue-800 mb-2">
                {job.title}
              </h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <Briefcase className="mr-2 text-blue-500" size={20} />
                  {job.company}
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 text-blue-500" size={20} />
                  {job.location}
                </div>
              </div>
            </div>
            {/* check if user is admin */}
            {user?.role === 'admin' ? 
             <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mt-4">
                <Link
                  to={`/jobs/${job._id}/applicants`}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center text-sm md:text-base"
                >
                  <Send className="mr-2 text-lg" /> View Applicants
                </Link>
                <Link
                  to={`/jobs/${job._id}/edit`}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center text-sm md:text-base"
                 >
                  <Send className="mr-2 text-lg" /> Edit Job
                </Link>
              </div>
              :
              (
                // check if user is already applied to the job
                job.applicants.some(applicant => applicant.user === user?.id) ? (
              <button
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition mt-4 md:mt-0 flex items-center" >
                <Send className="mr-2" /> Already Applied
              </button>
              ) : (
              <button
                onClick={() => setIsApplying(true)}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition mt-4 md:mt-0 flex items-center"
              >
                <Send className="mr-2" /> Apply Now
              </button>
              )
              )
            }

          </div>
        </div>

        {/* Job Details Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Job Description Column */}
          <div className="md:col-span-2 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Job Description</h2>
            <p className="text-gray-700 mb-6">{job.description}</p>

            {/* Responsibilities */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Responsibilities</h3>
              <ul className="list-disc pl-5 space-y-2">
                {job.responsibilities.map((resp, index) => (
                  <li key={index} className="text-gray-700">{resp}</li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Requirements</h3>
              <ul className="list-disc pl-5 space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="text-gray-700">{req}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Job Summary Sidebar */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Job Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <DollarSign className="mr-3 text-green-500" size={24} />
                <div>
                  <span className="font-semibold">Salary</span>
                  <p className="text-gray-700">{job?.salaryRange?.min} - {job?.salaryRange?.max}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="mr-3 text-blue-500" size={24} />
                <div>
                  <span className="font-semibold">Job Type</span>
                  <p className="text-gray-700">{job.type}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-3 text-purple-500" size={24} />
                <div>
                  <span className="font-semibold">Posted Time</span>
                  <p className="text-gray-700">{format(job.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="mr-3 text-red-500" size={24} />
                <div>
                  <span className="font-semibold">Application Deadline</span>
                  <p className="text-gray-700">{job?.applicationDeadline?.split("T")[0]}</p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3">Benefits</h3>
              <ul className="space-y-2">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="mr-2 text-green-500" size={20} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Application Modal */}
        {isApplying && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Apply for {job.title}</h2>
                <button 
                  onClick={() => setIsApplying(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft />
                </button>
              </div>

              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      readOnly
                      value={applicationForm.fullName}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={applicationForm.email}
                      readOnly
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={user?.phone || applicationForm.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Resume</label>
                    <input
                      type="text"
                      name="resumeUrl"
                      placeholder='Enter your resume url'
                      required
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2">Cover Letter</label>
                  <textarea
                    name="coverLetter"
                    value={applicationForm.coverLetter}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg h-32"
                    placeholder="Optional: Write a brief cover letter"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
                >
                  <Send className="mr-2" /> Submit Application
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailsPage;