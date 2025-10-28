"use client";
import React, { useState } from "react";
import { X, Save, Image as ImageIcon } from "lucide-react";

const HouseCreate = ({ isModalOpen, setIsModalOpen }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        logo: file,
        previewUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted data:", formData);
    setIsModalOpen(false);
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-300 border border-gray-100">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-xl font-bold text-gray-800">Create House</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  House Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter house name"
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              {/* Upload Icon Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon Image
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-lg border border-indigo-200 transition">
                    <ImageIcon className="w-4 h-4" />
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {formData.previewUrl && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <img
                        src={formData.previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            logo: null,
                            previewUrl: null,
                          }))
                        }
                        className="absolute top-0 right-0 bg-black/40 text-white rounded-bl px-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter short description or motto"
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="cursor-pointer w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  <Save className="w-5 h-5" />
                  Save House
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default HouseCreate;
