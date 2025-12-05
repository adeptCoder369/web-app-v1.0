import React, { useState } from 'react';
import { LocateIcon, LucideMapPinned, Transgender, User } from 'lucide-react';
import { RiUserStarFill } from 'react-icons/ri';
import { TiSortAlphabeticallyOutline } from "react-icons/ti";
import { PiListNumbersFill } from 'react-icons/pi';
import { SiGoogleclassroom } from 'react-icons/si';
import { MdEmail } from 'react-icons/md';

const BasicInfoForm = ({
  setFormData,
  formData,
  designations,
  titles,
  genderStaffs,
  school,
  classes,
  genderOptions
}) => {




  const [errors, setErrors] = useState({});

  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    let newErrors = {};
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    if (!formData.designation) {
      newErrors.designation = 'Designation is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <form
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto p-4"
      >

        {/* Name */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Name</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <TiSortAlphabeticallyOutline className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
              placeholder="Full Name"

            />
          </div>
        </div>


        {/* Gender */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Gender
          </label>
          <div className="relative">
            <Transgender className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

            <select
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"              >
              <option value="">Select Gender</option>
              {genderOptions.map((g, i) => (
                <option key={i} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Email
          </label>
          <div className="relative">
            <MdEmail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
              placeholder="Enter email (like @gmail.com)"
            />
          </div>
        </div>



        {/* Roll Number */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Roll Number</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <PiListNumbersFill className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.rollNo || ''}
              onChange={(e) => handleChange('rollNo', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"              placeholder="Roll Number"
            />
          </div>
        </div>


        {/* Registration Number */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Registration Number</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <PiListNumbersFill className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.registrationNumber || ''}
              onChange={(e) => handleChange('registrationNumber', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
              placeholder="Registration Number"
            />
          </div>
        </div>


        {/* Admission Number */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Admission Number</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <PiListNumbersFill className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.admissionNumber || ''}
              onChange={(e) => handleChange('admissionNumber', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"              placeholder="Admission Number"
            />
          </div>
        </div>

        {/* Class */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Class</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SiGoogleclassroom className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={formData.class || ''}
              onChange={(e) => handleChange('class', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"            >
              <option value="">Select Class</option>
              {classes?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Address (spans 2 columns) */}
        <div className="relative sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Address
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LucideMapPinned className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"              placeholder="Full Address"
            />
          </div>
        </div>





        {/* Address (spans 2 columns) */}
        <div className="relative sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Address</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LucideMapPinned className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"              placeholder="Full Address"
            />
          </div>
        </div>

      </form>


    </div >
  );
};

export default BasicInfoForm;
