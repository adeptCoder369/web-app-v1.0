import React, { useState } from 'react';
import { X, Upload, FileText, Image } from 'lucide-react';

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
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Document Upload</h2>
        <p className="text-sm text-gray-500">Please upload the required documents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  );
};


export default DocumentInfoForm;