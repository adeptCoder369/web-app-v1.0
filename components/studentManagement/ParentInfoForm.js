import React from 'react';
import { Trash2, Phone, Mail, Shield, Plus, MapPinHouse, Transgender, User2 } from 'lucide-react';

const ParentsInfoForm = ({ formData, setFormData, genderOptions }) => {
  const handleParentChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      parents: prev.parents.map((parent, i) =>
        i === index ? { ...parent, [field]: value } : parent
      )
    }));
  };

  const handlePhoneChange = (parentIndex, phoneIndex, value) => {
    setFormData(prev => ({
      ...prev,
      parents: prev.parents.map((parent, i) =>
        i === parentIndex
          ? {
            ...parent,
            phones: parent.phones.map((phone, j) => (j === phoneIndex ? value : phone))
          }
          : parent
      )
    }));
  };

  const addPhoneField = (parentIndex) => {
    setFormData(prev => ({
      ...prev,
      parents: prev.parents.map((parent, i) =>
        i === parentIndex && parent.phones.length < 3
          ? { ...parent, phones: [...parent.phones, ''] }
          : parent
      )
    }));
  };

  const removePhoneField = (parentIndex, phoneIndex) => {
    setFormData(prev => ({
      ...prev,
      parents: prev.parents.map((parent, i) =>
        i === parentIndex
          ? { ...parent, phones: parent.phones.filter((_, j) => j !== phoneIndex) }
          : parent
      )
    }));
  };

  const removeParent = index => {
    setFormData(prev => ({
      ...prev,
      parents: prev.parents.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      {formData.parents.map((parent, index) => (
        <div
          key={index}
          className="bg-white/90 dark:bg-bg-white/90 p-6 rounded-xl border border-gray-200  dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex justify-between items-center mb-5">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-800">
              {parent.relation.charAt(0).toUpperCase() + parent.relation.slice(1)}
            </h4>
            {formData.parents.length > 1 && (
              <button
                type="button"
                onClick={() => removeParent(index)}
                className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <User2 className="h-4 w-4 text-gray-500" />
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={parent.name}
                onChange={(e) => handleParentChange(index, 'name', e.target.value)}
                placeholder="Enter parent name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Transgender className="h-4 w-4 text-gray-500" />
                Gender
              </label>
              <select
                value={parent.gender}
                onChange={(e) => handleParentChange(index, 'gender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                {genderOptions.map((g, i) => (
                  <option key={i} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Relation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Shield className="h-4 w-4 text-gray-500" />
                Qualification
              </label>
              <input
                type="text"
                value={parent.qualification}
                onChange={(e) => handleParentChange(index, 'qualification', e.target.value)}
                placeholder="Mention qualification"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

          

            {/*     Annual Income */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Annual Income
              </label>
              <input
                type="text"
                value={parent.annualIncome}
                onChange={(e) => handleParentChange(index, 'annualIncome', e.target.value)}
                placeholder="Enter annual income"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

     

            {/* Multiple Phones */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Phone className="h-4 w-4 text-gray-500" />
                Phone Numbers
              </label>
              <div className="space-y-2">
                {parent.phones.map((phone, pIndex) => (
                  <div key={pIndex} className="flex gap-2 items-center">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => handlePhoneChange(index, pIndex, e.target.value)}
                      placeholder={`Phone ${pIndex + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    {parent.phones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePhoneField(index, pIndex)}
                        className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}

                {parent.phones.length < 3 && (
                  <button
                    type="button"
                    onClick={() => addPhoneField(index)}
                    className="text-blue-500 text-sm mt-1 hover:underline"
                  >
                    + Add another phone
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ParentsInfoForm;
