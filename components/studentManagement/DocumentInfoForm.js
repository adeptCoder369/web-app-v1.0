import React, { useState } from 'react';
import { X, Upload, FileText, Image } from 'lucide-react';
import { PiListNumbersFill } from 'react-icons/pi';
import { FcDocument } from 'react-icons/fc';
import { GrDocumentVerified } from "react-icons/gr";

const DocumentInfoForm = ({ formData, setFormData }) => {
  const documentFields = [
    { key: 'profileImage', label: 'Profile Image', icon: Image },
    { key: 'birthCertificate', label: 'Birth Certificate', icon: FileText },
    { key: 'aadhar', label: 'Aadhaar', icon: FileText },
    { key: 'familyPhoto', label: 'Family Photo', icon: Image }
  ];

  const handleFileChange = (key, file) => {
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [key]: { file, preview: previewUrl }
      }
    }));
  };

  const removeFile = (key) => {
    setFormData(prev => {
      const newDocs = { ...prev.documents };
      if (newDocs[key]?.preview) URL.revokeObjectURL(newDocs[key].preview);
      delete newDocs[key];
      return {
        ...prev,
        documents: newDocs
      };
    });
  };

  return (
    <div className="w-full  mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Document Upload</h2>
        <p className="text-sm text-gray-500">Please upload the required documents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 m-4">
        {documentFields.map((doc) => {
          const Icon = doc.icon;
          const hasFile = formData.documents?.[doc.key]?.file;

          return (
            <div key={doc.key} className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Icon className="h-4 w-4 text-gray-400" />
                {doc.label}
              </label>

              {!hasFile ? (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-10 w-10 text-gray-400 group-hover:text-gray-500 mb-3" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG or PDF</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => e.target.files[0] && handleFileChange(doc.key, e.target.files[0])}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative w-full h-48 border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50 group">
                  <img
                    src={formData.documents[doc.key].preview}
                    alt={doc.label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200" />
                  <button
                    type="button"
                    onClick={() => removeFile(doc.key)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <p className="text-white text-xs font-medium truncate">
                      {formData.documents[doc.key].file.name}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Previous Board (X) Roll No */}
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
          Aadhar Card Number
        </label>
        <div className="relative">
          <PiListNumbersFill className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

          <input
            type="text"
            value={formData.previousRollNo || ''}
            onChange={(e) => handleChange('previousRollNo', e.target.value)}
            placeholder="Enter Aadhar Card Number"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          />
        </div>
      </div>


      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <GrDocumentVerified className="text-indigo-500 h-5 w-5" />
          Documents Verification
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       


          <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Name Matches With Aadhaar
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <GrDocumentVerified className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={formData.isHyperActive || ''}
              onChange={(e) => handleChange('isHyperActive', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"            >
              <option value="">Select options</option>
              {['Yes', 'No']?.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>


        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Date Of Birth Matches With Aadhaar
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <GrDocumentVerified className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={formData.isHyperActive || ''}
              onChange={(e) => handleChange('isHyperActive', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"            >
              <option value="">Select options</option>
              {['Yes', 'No']?.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>


        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Father Name Matches With Aadhaar
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <GrDocumentVerified className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={formData.isHyperActive || ''}
              onChange={(e) => handleChange('isHyperActive', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"            >
              <option value="">Select options</option>
              {['Yes', 'No']?.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Address Matches With Aadhaar
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <GrDocumentVerified  className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={formData.isHyperActive || ''}
              onChange={(e) => handleChange('isHyperActive', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"            >
              <option value="">Select options</option>
              {['Yes', 'No']?.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>
        </div>


      </div>






    </div>
  );
};


export default DocumentInfoForm;