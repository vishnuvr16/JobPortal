import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  UserCheck, 
  UserX, 
  Filter, 
  ArrowUpDown, 
  Search,
  FileDown,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import summaryApi from '../common';

const JobApplicantsPage = () => {
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [filterStatus, setFilterStatus] = useState('all');
  const { jobId } = useParams();

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetch(`${summaryApi.defaultUrl}/jobs/${jobId}/applicants`, {
          method: "GET",
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch applicants: ${response.statusText}`);
        }

        const data = await response.json();
        setApplicants(data);
        setFilteredApplicants(data);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    fetchApplicants();
  }, [jobId]);

  // Search and filter handlers
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterApplicants(term, filterStatus);
  };

  const handleFilterStatus = (status) => {
    setFilterStatus(status);
    filterApplicants(searchTerm, status);
  };

  const filterApplicants = (term, status) => {
    let result = applicants.filter(applicant => 
      applicant.user.fullName.toLowerCase().includes(term)
    );

    if (status !== 'all') {
      result = result.filter(applicant => applicant.status === status);
    }

    setFilteredApplicants(result);
  };

  // Sorting handler
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedApplicants = [...filteredApplicants].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });

    setFilteredApplicants(sortedApplicants);
  };

  // Status update handler
  const handleStatusUpdate = async (applicantId, newStatus) => {
    try {
      const response = await fetch(`${summaryApi.defaultUrl}/jobs/${jobId}/applicants/${applicantId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error(`Failed to update applicant status: ${response.statusText}`);
      }

      // Update local state
      const updatedApplicants = applicants.map(applicant => 
        applicant._id === applicantId 
          ? { ...applicant, status: newStatus } 
          : applicant
      );

      setApplicants(updatedApplicants);
      filterApplicants(searchTerm, filterStatus);
    } catch (error) {
      console.error("Error updating applicant status:", error);
    }
  };

  // Download resume handler
  const handleDownloadResume = async (resumeUrl) => {
    try {
      const response = await fetch(resumeUrl, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to download resume: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error downloading resume:", error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-blue-900">Job Applicants</h1>
            <div className="flex space-x-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search applicants..." 
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleFilterStatus('all')}
                  className={`px-4 py-2 rounded-lg ${filterStatus === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => handleFilterStatus('pending')}
                  className={`px-4 py-2 rounded-lg ${filterStatus === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Pending
                </button>
                <button 
                  onClick={() => handleFilterStatus('accepted')}
                  className={`px-4 py-2 rounded-lg ${filterStatus === 'accepted' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Accepted
                </button>
                <button 
                  onClick={() => handleFilterStatus('rejected')}
                  className={`px-4 py-2 rounded-lg ${filterStatus === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Rejected
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg overflow-hidden shadow-md">
              <thead className="bg-blue-50">
                <tr>
                  <th 
                    className="px-6 py-4 text-left cursor-pointer hover:bg-blue-100"
                    onClick={() => handleSort('fullName')}
                  >
                    <div className="flex items-center">
                      Name 
                      <ArrowUpDown className="ml-2 text-gray-400" size={16} />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left cursor-pointer hover:bg-blue-100"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      Email 
                      <ArrowUpDown className="ml-2 text-gray-400" size={16} />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left cursor-pointer hover:bg-blue-100"
                    onClick={() => handleSort('phone')}
                  >
                    <div className="flex items-center">
                      Phone 
                      <ArrowUpDown className="ml-2 text-gray-400" size={16} />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">Resume</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.map((applicant) => (
                  <tr key={applicant._id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {applicant.user.fullName}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{applicant.user.email}</td>
                    <td className="px-6 py-4 text-gray-600">{applicant.user.phone}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleDownloadResume(applicant.user.resumeUrl)}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <FileDown className="mr-2" size={20} /> 
                        Download Resume
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className={`px-3 py-1 rounded-full text-sm font-semibold 
                          ${applicant.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            applicant.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                            'bg-red-100 text-red-800'}`}
                      >
                        {applicant.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex space-x-2">
                      {applicant.status === 'accepted' || 'rejected' ? "" : (
                        <>
                            <button 
                                onClick={() => handleStatusUpdate(applicant._id, 'accepted')}
                                className="text-green-500 hover:text-green-700"
                                title="Accept Applicant"
                            >
                                <UserCheck size={24} />
                            </button>
                            <button 
                                onClick={() => handleStatusUpdate(applicant._id, 'rejected')}
                                className="text-red-500 hover:text-red-700"
                                title="Reject Applicant"
                            >
                                <UserX size={24} />
                            </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredApplicants.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No applicants found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobApplicantsPage;