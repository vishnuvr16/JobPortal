import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Briefcase, 
  MapPin, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Star,
  Clock,
  DollarSign,
  LoaderCircle
} from 'lucide-react';
import {Link} from "react-router-dom"
import summaryApi from '../common';

// Main Job Portal Component
const JobPortal = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(6);
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    const getJobs = async () => {
      try {
        setLoading(true)
        const response = await fetch(summaryApi.getJobs.url, {
          method: summaryApi.getJobs.method,
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch jobs: ${response.statusText}`);
        }

        const allJobs = await response.json();
        setJobs(allJobs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    getJobs();
  }, []);

  // Filtering and Search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setCurrentPage(1);

    const filtered = jobs.filter(job => 
      job.title.toLowerCase().includes(term) || 
      job.company.toLowerCase().includes(term)
    );
    setFilteredJobs(filtered);
  };

  // Pagination Logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = (searchTerm ? filteredJobs : jobs).slice(indexOfFirstJob, indexOfLastJob);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
            Job Discovery Platform
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Discover your next career opportunity with our curated job listings
          </p>
        </header>

        {/* Search and Filters */}
        
        <div className="mb-8 flex space-x-4">
          <div className="relative flex-grow">
          <input 
              type="text" 
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search dream jobs, companies, skills..." 
              className="w-full p-4 rounded-xl text-gray-800 
                         focus:outline-none focus:ring-4 focus:ring-purple-300 
                         transition duration-300 ease-in-out 
                         shadow-lg group-hover:shadow-xl"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 
                               bg-purple-500 text-white p-3 rounded-full 
                               hover:bg-purple-600 transition duration-300 
                               shadow-md hover:shadow-lg">
              <Search size={24} />
            </button>
          </div>

        </div>

        {loading && <LoaderCircle className='flex items-center justify-center'/>}

        {/* Job Listings */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentJobs.map(job => (
            <JobCard 
              key={job._id} 
              job={job} 
              onApply={() => setSelectedJob(job)} 
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 space-x-2">
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
            className="bg-white p-3 rounded-lg shadow-md hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
          >
            <ChevronLeft />
          </button>
          {Array.from({ 
            length: Math.ceil((searchTerm ? filteredJobs : jobs).length / jobsPerPage) 
          }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === index + 1 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-600'
              } shadow-md hover:bg-blue-50 hover:text-black`}
            >
              {index + 1}
            </button>
          ))}
          <button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === Math.ceil((searchTerm ? filteredJobs : jobs).length / jobsPerPage)}
            className="bg-white p-3 rounded-lg shadow-md hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
          >
            <ChevronRight />
          </button>
        </div>

      </div>
    </div>
  );
};

// Job Card Component
const JobCard = ({ job, onApply }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-blue-800 mb-1">{job.title}</h2>
            <p className="text-gray-500 text-sm">{job.company}</p>
          </div>
          <Briefcase className="text-blue-500" size={28} />
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <MapPin size={16} className="mr-1 text-blue-500" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-1 text-green-500" />
            <span>{job.type}</span>
          </div>
          <div className="flex items-center">
            <DollarSign size={16} className="mr-1 text-purple-500" />
            <span>{job?.salaryRange?.min} - {job?.salaryRange?.max}</span>
          </div>
        </div>

        <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>

        <div className="flex justify-between items-center">
          <div className="flex items-center text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} fill={i < 4 ? 'currentColor' : 'none'} />
            ))}
          </div>
          <Link 
            to={`/jobs/${job._id}`}
            // onClick={onApply}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};


export default JobPortal;