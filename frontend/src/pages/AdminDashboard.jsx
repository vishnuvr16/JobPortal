import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  X,
  Download,
  Check,
  AlertTriangle
} from 'lucide-react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import summaryApi from '../common';

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const {user} = useSelector(state => state.auth)

  useEffect(() => {
    const getJobs = async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    getJobs();
  }, []);

  const filteredJobs = jobs?.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === '' || job.status === statusFilter)
  );

  const handleDeleteJob = async (id) => {
    const res = await fetch(`${summaryApi.deleteJob.url}/${id}`,{
      method: summaryApi.deleteJob.method,
      credentials: "include",
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log("res",res)
    setJobs(jobs.filter(job => job._id !== id));
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center space-x-4">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Welcome {user?.name.split(" ")[0]}
            </h1>
          </div>
          
          <Link 
            to="add"
            className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <Plus className="mr-2" /> Add New Job
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 flex space-x-4">
          <div className="relative flex-grow">
            <input 
              type="text" 
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Job Listings */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <h2 className="text-2xl font-semibold text-gray-800">Job Listings</h2>
          </div>
          
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                {['Job Title', 'Company', 'Location', 'Status', 'Actions','Job link'].map((header) => (
                  <th 
                    key={header} 
                    className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr 
                  key={job.id} 
                  className="border-b hover:bg-blue-50 transition-colors duration-200"
                >
                  <td className="p-4 font-medium text-gray-900">{job.title}</td>
                  <td className="p-4 text-gray-600">{job.company}</td>
                  <td className="p-4 text-gray-600 flex items-center">
                    <MapPin size={16} className="mr-2 text-blue-500" /> {job.location}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="p-4 space-x-2 flex">
                    <Link 
                      to={`/jobs/${job._id}/applicants`}
                      className="text-blue-500 hover:bg-blue-100 p-2 rounded-md transition-all duration-300 hover:scale-110"
                      title="View Applications"
                    >
                      <Eye size={20} />
                    </Link>
                    <Link 
                      to={`/jobs/${job._id}/edit`}
                      className="text-green-500 hover:bg-green-100 p-2 rounded-md transition-all duration-300 hover:scale-110"
                      title="Edit Job"
                    >
                      <Edit size={20} />
                    </Link>
                    <button 
                      onClick={() => handleDeleteJob(job._id)}
                      className="text-red-500 hover:bg-red-100 p-2 rounded-md transition-all duration-300 hover:scale-110"
                      title="Delete Job"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                  <td className="p-4 text-gray-600">
                    <Link to={`/jobs/${job._id}`}><u>View Job</u></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredJobs.length === 0 && (
            <div className="text-center p-10 text-gray-500">
              <AlertTriangle className="mx-auto mb-4 text-yellow-500" size={40} />
              No jobs found matching your search criteria
            </div>
          )}
        </div>

        {/* Applications Modal */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50 flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Applications for {jobs.find(j => j.id === selectedJob).title}
                </h2>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-500 hover:text-gray-700 hover:bg-red-100 p-2 rounded-full transition-all duration-300"
                >
                  <X size={24} />
                </button>
              </div>
              
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    {['Name', 'Email', 'Applied Date', 'Resume', 'Actions'].map((header) => (
                      <th 
                        key={header} 
                        className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {applications?.filter(app => app.jobId === selectedJob)
                    .map((application) => (
                      <tr 
                        key={application.id} 
                        className="border-b hover:bg-blue-50 transition-colors duration-200"
                      >
                        <td className="p-4 font-medium text-gray-900">{application.name}</td>
                        <td className="p-4 text-gray-600">{application.email}</td>
                        <td className="p-4 text-gray-600">{application.appliedDate}</td>
                        <td className="p-4">
                          <a 
                            href="#" 
                            className="text-blue-600 hover:underline flex items-center"
                          >
                            <Download size={16} className="mr-2" /> 
                            View Resume
                          </a>
                        </td>
                        <td className="p-4 space-x-2">
                          <button 
                            className="text-green-500 hover:bg-green-100 p-2 rounded-md transition-all duration-300 hover:scale-110"
                            title="Accept Application"
                          >
                            <Check size={20} />
                          </button>
                          <button 
                            className="text-red-500 hover:bg-red-100 p-2 rounded-md transition-all duration-300 hover:scale-110"
                            title="Reject Application"
                          >
                            <X size={20} />
                          </button>
                        </td>
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;