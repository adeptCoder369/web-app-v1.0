import React, { useState } from 'react';
import { User } from 'lucide-react';
import { RiUserStarFill } from 'react-icons/ri';

const BasicInfoForm = ({
  setFormData,
  formData,
  designations,
  titles,
  genderStaffs,
  school,
  classes
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
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto p-4">

        {/* Name */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Full Name"
            />
          </div>
        </div>

        {/* Roll Number */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">Roll Number</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiUserStarFill className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.rollNo || ''}
              onChange={(e) => handleChange('rollNo', e.target.value)}
              className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Roll Number"
            />
          </div>
        </div>

        {/* Admission Number */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">Admission Number</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiUserStarFill className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.admissionNumber || ''}
              onChange={(e) => handleChange('admissionNumber', e.target.value)}
              className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Admission Number"
            />
          </div>
        </div>

        {/* Class */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">Class</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiUserStarFill className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={formData.class || ''}
              onChange={(e) => handleChange('class', e.target.value)}
              className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Class</option>
              {classes?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Address (spans 2 columns) */}
        <div className="relative sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Full Address"
            />
          </div>
        </div>

      </form>


    </div >
  );
};

export default BasicInfoForm;
