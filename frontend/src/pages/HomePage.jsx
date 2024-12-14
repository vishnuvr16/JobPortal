import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Briefcase, 
  MapPin, 
  Users,
  Rocket,
  CheckCircle,
  Zap,
  TrendingUp,
  Globe,
  Award
} from 'lucide-react';
import {Link} from "react-router-dom"
import {useSelector} from "react-redux"
import { motion, AnimatePresence } from 'framer-motion';
import summaryApi from '../common';


const JobPortalHome = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const {user} = useSelector(state => state.auth);
  const [jobs,setJobs] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories] = useState([
    { name: 'Technology', icon: <Rocket className="mr-2" /> },
    { name: 'Finance', icon: <TrendingUp className="mr-2" /> },
    { name: 'Marketing', icon: <Globe className="mr-2" /> },
    { name: 'Design', icon: <Award className="mr-2" /> },
    { name: 'Sales', icon: <Zap className="mr-2" /> }
  ]);

  // ! featured jobs
  useEffect(() => {
    const getFeaturedJobs = async () => {
      try {
        const response = await fetch(summaryApi.getFeaturedJobs.url, {
          method: summaryApi.getFeaturedJobs.method,
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch featured jobs: ${response.statusText}`);
        }

        const data = await response.json();
        setFeaturedJobs(data.jobs.slice(0, 3)); 
      } catch (error) {
        console.error("Error fetching featured jobs:", error);
      }
    };

    getFeaturedJobs();
  }, []);

  // ! get jobs by category
  useEffect(() => {
    const getJobs = async () => {
      setFilteredJobs([]);
      try {
        const url = `${summaryApi.defaultUrl}/jobs/category/${selectedCategory}`;
        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch jobs: ${response.statusText}`);
        }

        const allJobs = await response.json(); // Parse the JSON response
        setFilteredJobs(allJobs.jobs); 
        console.log("Jobs:", allJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    getJobs();
  }, [selectedCategory]);

  // Hero Section Animation Variants
  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Job Card Animation Variants
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeInOut"
      }
    },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        className="relative bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-4 overflow-hidden"
      >        
        <div className="container mx-auto px-4 py-6 relative z-10 grid md:grid-cols-2 items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-5xl font-extrabold leading-tight">
              Unlock Your Career Potential
            </h1>
            <p className="text-xl text-indigo-100 leading-relaxed">
              Discover personalized job opportunities, connect with top employers, and transform your professional journey with precision and passion.
            </p>
            <div className="flex space-x-6">
              <Link 
                to="/jobs" 
                className="bg-white text-purple-700 px-8 py-3 rounded-lg 
                           hover:bg-gray-100 transition duration-300 
                           font-semibold shadow-lg inline-flex items-center"
              >
                Explore Jobs
                <Briefcase className="ml-3" />
              </Link>
              
            </div>
          </motion.div>
          
          {/* image */}
          <motion.div 
            whileHover={{ rotate: 0 }}
            initial={{ rotate: 3 }}
            className="hidden md:flex justify-center items-center"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-full max-w-md bg-white/10 rounded-xl p-6 
                          transform shadow-2xl border border-white/20"
            >
              <div className="aspect-square bg-white/20 rounded-lg 
                              flex items-center justify-center text-white/50">
                <Rocket size={120} />
              </div>
              <div className="mt-6 space-y-3">
                <div className="h-4 bg-white/20 rounded w-3/4"></div>
                <div className="h-4 bg-white/20 rounded w-1/2"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Job Categories */}
      <div className="container mx-auto px-4 py-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-12 text-gray-800"
        >
          Explore Career Paths
        </motion.h2>
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { 
                staggerChildren: 0.1 
              }
            }
          }}
          className="grid md:grid-cols-5 gap-6 mb-6"
        >
          {categories.map((category) => (
            <motion.button 
              key={category.name}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.5 }
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.name)}
              className={`rounded-xl shadow-md p-6 text-center 
                         transition transform 
                         ${selectedCategory === category.name 
                          ? 'bg-blue-200 text-white' 
                          : 'bg-white text-gray-700 hover:bg-gray-300'
                        }`}
            >
              <div className="flex justify-center mb-4 text-purple-600">
                {category.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence>
        {/*  */}
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { 
                  staggerChildren: 0.1 
                }
              }
            }}
            className="grid md:grid-cols-3 gap-6"
          >
          {/* all jobs when search is not done */}
          {filteredJobs?.map((job) => (
            <motion.div 
            key={job._id}
            variants={cardVariants}
            whileHover="hover"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition"
          >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-blue-800">{job.title}</h3>
                  <p className="text-gray-600">{job.company}</p>
                </div>
                <Briefcase className="text-blue-500" />
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-500">
                  <MapPin className="mr-2" size={20} />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Users className="mr-2" size={20} />
                  <span>{job.category}</span>
                </div>
              </div>
              <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>
              <div className="flex justify-between items-center">
                {/* <span className="text-green-600 font-semibold">{job.salary}</span> */}
                <Link 
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  to={`/jobs/${job._id}`}
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
          {/* search results */}
          {searchTerm && filteredJobs?.map((job) => (
            <div 
              key={job._id} 
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-blue-800">{job.title}</h3>
                  <p className="text-gray-600">{job.company}</p>
                </div>
                <Briefcase className="text-blue-500" />
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-500">
                  <MapPin className="mr-2" size={20} />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Users className="mr-2" size={20} />
                  <span>{job.category}</span>
                </div>
              </div>
              <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>
              <div className="flex justify-between items-center">
                {/* <span className="text-green-600 font-semibold">{job.salary}</span> */}
                <Link 
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  to={`/jobs/${job._id}`}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </motion.div>
        </AnimatePresence>
      </div>
      

      {/* Featured Jobs */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Featured Opportunities</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredJobs.map((job) => (
              <div 
                key={job._id} 
                className="bg-white rounded-xl shadow-lg p-6 
                           transform transition hover:-translate-y-2 
                           hover:shadow-xl border border-gray-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-purple-800">{job.title}</h3>
                    <p className="text-gray-600 font-medium">{job.company}</p>
                  </div>
                  <Briefcase className="text-purple-500" size={32} />
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-500">
                    <MapPin className="mr-3" size={20} />
                    <span className="text-sm">{job.location}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Users className="mr-3" size={20} />
                    <span className="text-sm">{job.category}</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-6 line-clamp-3">{job.description}</p>
                <div className="flex justify-between items-center">
                  <Link 
                    className="bg-purple-500 text-white px-5 py-2.5 rounded-lg 
                               hover:bg-purple-600 transition duration-300 
                               shadow-md hover:shadow-lg"
                    to={`/jobs/${job._id}`}
                  >
                    View Details
                  </Link>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="mr-2" size={20} />
                    <span className="text-sm font-semibold">Featured</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link 
              to="/jobs" 
              className="bg-indigo-500 text-white px-8 py-3 rounded-lg 
                         hover:bg-indigo-600 transition duration-300 
                         shadow-md hover:shadow-xl inline-block"
            >
              View All Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4 py-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-12 text-gray-800"
        >
          Your Career Journey
        </motion.h2>
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { 
                staggerChildren: 0.2 
              }
            }
          }}
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            { 
              icon: <Search size={48} />, 
              title: "Discover", 
              description: "Explore thousands of job opportunities tailored to your skills and interests." 
            },
            { 
              icon: <Users size={48} />, 
              title: "Connect", 
              description: "Network with top employers and get insights into exciting career paths." 
            },
            { 
              icon: <Rocket size={48} />, 
              title: "Advance", 
              description: "Apply with confidence and take the next big step in your professional journey." 
            }
          ].map((step) => (
            <motion.div 
              key={step.title}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.6 }
                }
              }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-md p-8 text-center 
                         transform transition hover:shadow-xl 
                         border border-gray-100"
            >
              <div className="flex justify-center mb-6 text-purple-600">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-16"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-indigo-100">
            Create your profile, get personalized job recommendations, and connect with employers who are looking for talents like you.
          </p>
          {!user ? (
            <div className="flex justify-center space-x-6">
            <Link 
              to="/register" 
              className="bg-white text-purple-700 px-8 py-3 rounded-lg 
                         hover:bg-gray-100 transition duration-300 
                         font-semibold shadow-lg"
            >
              Sign Up
            </Link>
            <Link 
              to="/login" 
              className="bg-transparent border-2 border-white text-white px-8 py-3 
                         rounded-lg hover:bg-white hover:text-purple-700 
                         transition duration-300 font-semibold"
            >
              Login
            </Link>
          </div>
          ) : <div className="flex justify-center space-x-6">
                <Link 
                  to="/jobs" 
                  className="bg-white text-purple-700 px-8 py-3 rounded-lg 
                       hover:bg-gray-100 transition duration-300 
                       font-semibold shadow-lg"
                >
                  Get Started
                </Link>
              </div>
          }
        </div>
      </motion.div>
    </div>
  );
};

export default JobPortalHome;