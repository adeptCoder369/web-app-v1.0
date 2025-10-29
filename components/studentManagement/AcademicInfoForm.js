import React from 'react';
import { School, FileText, Calendar, Hash, MapPin, User2 } from 'lucide-react';

const AcademicInfoForm = ({ formData, setFormData }) => {

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto p-4">

        {/* Name of Previous School */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <School className="h-4 w-4 text-gray-500" />
            Previous School
          </label>
          <input
            type="text"
            value={formData.previousSchool || ''}
            onChange={(e) => handleChange('previousSchool', e.target.value)}
            placeholder="Enter name of previous school"
 className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          />
        </div>

        {/* Scholarship */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <FileText className="h-4 w-4 text-gray-500" />
            Scholarship
          </label>
          <input
            type="text"
            value={formData.scholarship || ''}
            onChange={(e) => handleChange('scholarship', e.target.value)}
            placeholder="Enter scholarship details"
 className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          />
        </div>

        {/* Year of Passing */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Calendar className="h-4 w-4 text-gray-500" />
            Year of Passing
          </label>
          <input
            type="number"
            value={formData.yearOfPassing || ''}
            onChange={(e) => handleChange('yearOfPassing', e.target.value)}
            placeholder="Enter year of passing"
 className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          />
        </div>

        {/* Previous Board (X) Roll No */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Hash className="h-4 w-4 text-gray-500" />
            Previous Board Roll No
          </label>
          <input
            type="text"
            value={formData.previousRollNo || ''}
            onChange={(e) => handleChange('previousRollNo', e.target.value)}
            placeholder="Enter previous board roll number"
 className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          />
        </div>

        {/* Previous Board */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <School className="h-4 w-4 text-gray-500" />
            Previous Board
          </label>
          <input
            type="text"
            value={formData.previousBoard || ''}
            onChange={(e) => handleChange('previousBoard', e.target.value)}
            placeholder="Enter previous board name"
 className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          />
        </div>

        {/* Board Registration Number */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Hash className="h-4 w-4 text-gray-500" />
            Board Registration No
          </label>
          <input
            type="text"
            value={formData.boardRegNo || ''}
            onChange={(e) => handleChange('boardRegNo', e.target.value)}
            placeholder="Enter registration number"
 className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          />
        </div>

        {/* Previous Percentage */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <FileText className="h-4 w-4 text-gray-500" />
            Previous Percentage
          </label>
          <input
            type="number"
            value={formData.previousPercentage || ''}
            onChange={(e) => handleChange('previousPercentage', e.target.value)}
            placeholder="Enter percentage"
 className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          />
        </div>

        {/* Previous Working Days */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Calendar className="h-4 w-4 text-gray-500" />
            Previous Working Days
          </label>
          <input
            type="number"
            value={formData.previousWorkingDays || ''}
            onChange={(e) => handleChange('previousWorkingDays', e.target.value)}
            placeholder="Enter number of days"
 className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          />
        </div>

        {/* Permanent Education Number */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <User2 className="h-4 w-4 text-gray-500" />
            Permanent Education No
          </label>
          <input
            type="text"
            value={formData.permanentEduNo || ''}
            onChange={(e) => handleChange('permanentEduNo', e.target.value)}
            placeholder="Enter permanent education number"
 className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          />
        </div>

        {/* Student Remarks */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <FileText className="h-4 w-4 text-gray-500" />
            Student Remarks
          </label>
          <textarea
            value={formData.studentRemarks || ''}
            onChange={(e) => handleChange('studentRemarks', e.target.value)}
            placeholder="Enter remarks"
            rows={2}
 className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          />
        </div>

        {/* Distance to School */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <MapPin className="h-4 w-4 text-gray-500" />
            Distance to School (km)
          </label>
          <input
            type="number"
            value={formData.distanceToSchool || ''}
            onChange={(e) => handleChange('distanceToSchool', e.target.value)}
            placeholder="Enter distance in km"
 className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          />
        </div>
      </form>
    </div>
  );
};

export default AcademicInfoForm;
