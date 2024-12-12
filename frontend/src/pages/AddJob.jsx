import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
  PlusCircle, 
  Trash2, 
  ArrowRight, 
  Check, 
  Building, 
  MapPin, 
  DollarSign, 
  BookOpen, 
  Briefcase, 
  Calendar 
} from 'lucide-react';
import summaryApi from '../common';

const AddJobPage = () => {
  const { control, register, handleSubmit, formState: { errors }, reset } = useForm();
  const [requirements, setRequirements] = useState(['']);
  const [responsibilities, setResponsibilities] = useState(['']);
  const [benefits, setBenefits] = useState(['']);
  const [currentStep, setCurrentStep] = useState(1);

  const addField = (setter) => {
    setter(prev => [...prev, '']);
  };

  const updateField = (setter, index, value) => {
    setter(prev => {
      const newFields = [...prev];
      newFields[index] = value;
      return newFields;
    });
  };

  const removeField = (setter, index) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    const jobData = {
      ...data,
      requirements,
      responsibilities,
      benefits
    };

    try {
      console.log(jobData);
      const jobToAdd = await fetch(summaryApi.addJob.url,{
        credentials: 'include',
        method: summaryApi.addJob.method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jobData)
      })
  
      alert('Job added successfully!');
      reset();
      setRequirements(['']);
      setResponsibilities(['']);
      setBenefits(['']);
      setCurrentStep(1);
    } catch (error) {
      alert('Failed to add job. Please try again.');
    }
  };

  const renderStep1 = () => (
    <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center">
        <Briefcase className="mr-3 text-blue-600" /> Job Basics
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-gray-700 font-semibold">Job Title</label>
          <div className="relative">
            <input 
              type="text" 
              {...register('title', { required: 'Job title is required' })}
              className="w-full p-3 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300" 
              placeholder="e.g., Senior Software Engineer" 
            />
            <BookOpen className="absolute left-3 top-3 text-gray-400" />
          </div>
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block mb-2 text-gray-700 font-semibold">Company Name</label>
          <div className="relative">
            <input 
              type="text" 
              {...register('company', { required: 'Company name is required' })}
              className="w-full p-3 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300" 
              placeholder="Company Name" 
            />
            <Building className="absolute left-3 top-3 text-gray-400" />
          </div>
          {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>}
        </div>
      </div>
      <div>
        <label className="block mb-2 text-gray-700 font-semibold">Job Description</label>
        <textarea 
          {...register('description', { required: 'Job description is required' })}
          className="w-full p-3 border-2 border-gray-300 rounded-lg h-40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300" 
          placeholder="Provide a detailed job description..."
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>
      <div className="flex justify-end">
        <button 
          type="button" 
          onClick={() => setCurrentStep(2)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center"
        >
          Next Step <ArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center">
        <MapPin className="mr-3 text-green-600" /> Job Details
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-gray-700 font-semibold">Location</label>
          <div className="relative">
            <input 
              type="text" 
              {...register('location', { required: 'Location is required' })}
              className="w-full p-3 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300" 
              placeholder="City, State/Country" 
            />
            <MapPin className="absolute left-3 top-3 text-gray-400" />
          </div>
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
        </div>
        <div>
          <label className="block mb-2 text-gray-700 font-semibold">Job Type</label>
          <select 
            {...register('type', { required: 'Job type is required' })}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
          >
            <option value="">Select Job Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
          </select>
          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-gray-700 font-semibold">Minimum Salary</label>
          <div className="relative">
            <input 
              type="number" 
              {...register('salaryMin', { 
                required: 'Minimum salary is required',
                min: { value: 0, message: 'Salary must be a positive number' }
              })}
              className="w-full p-3 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300" 
              placeholder="Minimum salary" 
            />
            <DollarSign className="absolute left-3 top-3 text-gray-400" />
          </div>
          {errors.salaryMin && <p className="text-red-500 text-sm mt-1">{errors.salaryMin.message}</p>}
        </div>
        <div>
          <label className="block mb-2 text-gray-700 font-semibold">Maximum Salary</label>
          <div className="relative">
            <input 
              type="number" 
              {...register('salaryMax', { 
                required: 'Maximum salary is required',
                min: { value: 0, message: 'Salary must be a positive number' }
              })}
              className="w-full p-3 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300" 
              placeholder="Maximum salary" 
            />
            <DollarSign className="absolute left-3 top-3 text-gray-400" />
          </div>
          {errors.salaryMax && <p className="text-red-500 text-sm mt-1">{errors.salaryMax.message}</p>}
        </div>
        <div>
          <label className="block mb-2 text-gray-700 font-semibold">Application Deadline</label>
          <div className="relative">
            <input 
              type="date" 
              {...register('applicationDeadline', { 
                required: 'Application Deadline must enter',
              })}
              className="w-full p-3 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300" 
              placeholder="Deadline" 
            />
            <DollarSign className="absolute left-3 top-3 text-gray-400" />
          </div>
          {errors.applicationDeadline && <p className="text-red-500 text-sm mt-1">{errors.applicationDeadline.message}</p>}
        </div>
      </div>
      <div className="flex justify-between">
        <button 
          type="button" 
          onClick={() => setCurrentStep(1)}
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition flex items-center"
        >
          Previous Step
        </button>
        <button 
          type="button" 
          onClick={() => setCurrentStep(3)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center"
        >
          Next Step <ArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center">
        <Check className="mr-3 text-purple-600" /> Job Specifics
      </h2>
      {/* Requirements Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="text-gray-700 font-semibold">Job Requirements</label>
          <button 
            type="button" 
            onClick={() => addField(setRequirements)}
            className="bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition flex items-center"
          >
            <PlusCircle className="mr-2" /> Add Requirement
          </button>
        </div>
        {requirements.map((req, index) => (
          <div key={index} className="flex mb-3">
            <input 
              type="text" 
              value={req}
              onChange={(e) => updateField(setRequirements, index, e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg mr-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition" 
              placeholder="Enter requirement" 
            />
            {requirements.length > 1 && (
              <button 
                type="button" 
                onClick={() => removeField(setRequirements, index)}
                className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition"
              >
                <Trash2 />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Responsibilities Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="text-gray-700 font-semibold">Job Responsibilities</label>
          <button 
            type="button" 
            onClick={() => addField(setResponsibilities)}
            className="bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition flex items-center"
          >
            <PlusCircle className="mr-2" /> Add Responsibility
          </button>
        </div>
        {responsibilities.map((resp, index) => (
          <div key={index} className="flex mb-3">
            <input 
              type="text" 
              value={resp}
              onChange={(e) => updateField(setResponsibilities, index, e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg mr-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition" 
              placeholder="Enter responsibility" 
            />
            {responsibilities.length > 1 && (
              <button 
                type="button" 
                onClick={() => removeField(setResponsibilities, index)}
                className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition"
              >
                <Trash2 />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Benefits Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="text-gray-700 font-semibold">Job Benefits</label>
          <button 
            type="button" 
            onClick={() => addField(setBenefits)}
            className="bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition flex items-center"
          >
            <PlusCircle className="mr-2" /> Add Benefit
          </button>
        </div>
        {benefits.map((benefit, index) => (
          <div key={index} className="flex mb-3">
            <input 
              type="text" 
              value={benefit}
              onChange={(e) => updateField(setBenefits, index, e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg mr-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition" 
              placeholder="Enter benefit" 
            />
            {benefits.length > 1 && (
              <button 
                type="button" 
                onClick={() => removeField(setBenefits, index)}
                className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition"
              >
                <Trash2 />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button 
          type="button" 
          onClick={() => setCurrentStep(2)}
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition flex items-center"
        >
          Previous Step
        </button>
        <button 
          type="submit" 
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center"
        >
          Post Job <Check className="ml-2" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </form>
      </div>
    </div>
  );
};

export default AddJobPage;