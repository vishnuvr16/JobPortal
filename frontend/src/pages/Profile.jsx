import React, { useState, useEffect } from 'react';
import { 
  User, 
  Edit, 
  Mail, 
  Phone, 
  Briefcase, 
  Calendar, 
  MapPin, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  UploadCloud,
  Save
} from 'lucide-react';
import { Link } from 'react-router-dom';
import summaryApi from '../common';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
  });

  useEffect(() => {
    // Fetch user profile and applications
    const fetchProfileData = async () => {
      try {
        // Fetch user profile
        const profileResponse = await fetch(summaryApi.getProfile.url, {
          method: summaryApi.getProfile.method,
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Fetch user applications
        const applicationsResponse = await fetch(summaryApi.getUserApplications.url, {
          method: summaryApi.getUserApplications.method,
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!profileResponse.ok || !applicationsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const profileData = await profileResponse.json();
        const applicationsData = await applicationsResponse.json();

        setUser(profileData);
        setApplications(applicationsData);
        console.log("applicationsData",applicationsData)
        // Initialize profile data for editing
        setProfileData({
          fullName: profileData.fullName,
          email: profileData.email,
          phone: profileData.phone || '',
          location: profileData.location || '',
          bio: profileData.bio || '',
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {

      const response = await fetch(summaryApi.updateProfile.url, {
        method: summaryApi.updateProfile.method,
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });
      console.log(response)

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      setUser(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  console.log(applications)

  if (!user) return <div>Loading...</div>;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="md:col-span-1 bg-white shadow-2xl rounded-2xl p-8 h-fit">
            <div className="relative group">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-blue-100 shadow-lg">
                
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                    <User className="text-blue-500" size={64} />
                  </div>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleProfileUpdate} className="mt-6 space-y-4">
                <input 
                  type="text"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Full Name"
                />
                <input 
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Email"
                />
                <input 
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Phone Number"
                />
                <input 
                  type="text"
                  name="location"
                  value={profileData.location}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Location"
                />
                <textarea 
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg h-32"
                  placeholder="About Me"
                ></textarea>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
                  >
                    <Save className="mr-2" /> Save Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="w-full bg-gray-200 text-gray-700 p-3 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-center mt-4 text-blue-900">{user.fullName}</h2>
                <div className="text-center text-gray-600 mb-6">{user.bio}</div>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-center">
                    <Mail className="mr-3 text-blue-500" size={20} />
                    {user.email}
                  </div>
                  {user.phone && (
                    <div className="flex items-center">
                      <Phone className="mr-3 text-green-500" size={20} />
                      {user.phone}
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center">
                      <MapPin className="mr-3 text-red-500" size={20} />
                      {user.location}
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full mt-6 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
                >
                  <Edit className="mr-2" /> Edit Profile
                </button>
              </>
            )}
          </div>

          {/* Job Applications Section */}
          <div className="md:col-span-2 bg-white shadow-2xl rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-blue-900">My Applications</h2>
            {applications.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No job applications found
              </div>
            ) : (
              <div className="space-y-6">
                {applications?.map((application) => (
                  <div 
                    key={application._id} 
                    className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow border-l-4 border-blue-500"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-blue-800">
                        {application.title}
                      </h3>
                      <span 
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(application.status)}`}
                      >
                        {application.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Briefcase className="mr-2 text-blue-500" size={20} />
                        {application.company}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-2 text-green-500" size={20} />
                        {application.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-2 text-red-500" size={20} />
                        {new Date(application.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className='flex space-x-4 mb-4'>
                      {application.description}
                    </div>
                    <div className="flex space-x-4">
                      <Link 
                        className="flex items-center text-blue-600 hover:text-blue-800"
                        to={`/jobs/${application._id}`}
                      >
                        <FileText className="mr-2" size={20} /> View Job Details
                      </Link>
                      {application.resume && (
                        <button 
                          className="flex items-center text-green-600 hover:text-green-800"
                          onClick={() => {/* Download Resume */}}
                        >
                          <Clock className="mr-2" size={20} /> View Submitted Resume
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;