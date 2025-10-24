import React, { useState } from "react";
import { FileText, IdCard, BadgeCheck, CalendarDays } from "lucide-react";

const AddDocumentInfo = ({ setFormData, formData }) => {
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    let newErrors= {};
    if (!formData.aadhaar) newErrors.aadhaar = "Aadhaar number is required";
    if (!formData.pan) newErrors.pan = "PAN number is required";
    if (!formData.employeeId) newErrors.employeeId = "Employee ID is required";
    if (!formData.appointmentType)
      newErrors.appointmentType = "Type of appointment is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
      console.log("Document info submitted:", formData);
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Aadhaar Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Aadhaar Card Number
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IdCard className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="aadhaar"
              value={formData.aadhaar || ""}
              onChange={(e) => handleChange("aadhaar", e.target.value)}
              placeholder="Enter Aadhaar number"
              className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          {errors.aadhaar && (
            <p className="mt-1 text-sm text-red-600">{errors.aadhaar}</p>
          )}
        </div>

        {/* PAN Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            PAN Number
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="pan"
              value={formData.pan || ""}
              onChange={(e) => handleChange("pan", e.target.value)}
              placeholder="Enter PAN number"
              className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          {errors.pan && (
            <p className="mt-1 text-sm text-red-600">{errors.pan}</p>
          )}
        </div>

        {/* Employee ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Employee ID
          </label>
          <input
            type="text"
            name="employeeId"
            value={formData.employeeId || ""}
            onChange={(e) => handleChange("employeeId", e.target.value)}
            placeholder="Enter employee ID"
            className="block w-full rounded-md border-gray-300 py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.employeeId && (
            <p className="mt-1 text-sm text-red-600">{errors.employeeId}</p>
          )}
        </div>

        {/* Special Designation */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Special Designation
          </label>
          <input
            type="text"
            name="specialDesignation"
            value={formData.specialDesignation || ""}
            onChange={(e) => handleChange("specialDesignation", e.target.value)}
            placeholder="Enter special designation (if any)"
            className="block w-full rounded-md border-gray-300 py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Date of Retirement */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date of Retirement
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarDays className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              name="retirementDate"
              value={formData.retirementDate || ""}
              onChange={(e) => handleChange("retirementDate", e.target.value)}
              className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Type of Appointment */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type of Appointment
          </label>
          <select
            name="appointmentType"
            value={formData.appointmentType || ""}
            onChange={(e) => handleChange("appointmentType", e.target.value)}
            className="block w-full rounded-md border-gray-300 py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select Type</option>
            <option value="permanent">Permanent</option>
            <option value="contract">Contract</option>
            <option value="temporary">Temporary</option>
          </select>
          {errors.appointmentType && (
            <p className="mt-1 text-sm text-red-600">
              {errors.appointmentType}
            </p>
          )}
        </div>

      </form>
    </div>
  );
};

export default AddDocumentInfo;
