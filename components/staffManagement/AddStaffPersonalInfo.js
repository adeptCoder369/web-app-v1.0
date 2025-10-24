import React, { useState } from "react";
import {
  User,
  Calendar,
  Phone,
  Mail,
  Heart,
  Users,
  UserPlus,
  ShieldCheck,
} from "lucide-react";

const AddStaffPersonalInfo = ({
  setFormData,
  formData,
  categories,
  bloodGroups,

}) => {

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.dateOfBirth) newErrors.date_of_birth = "Required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone_no = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
      console.log("Personal Info Submitted:", formData);
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: DOB & DOJ */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <div className="mt-1 relative">
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={formData.dateOfBirth || ""}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            {errors.date_of_birth && (
              <p className="mt-1 text-sm text-red-600">
                {errors.date_of_birth}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Joining
            </label>
            <div className="mt-1 relative">
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={formData.joiningDate || ""}
                onChange={(e) => handleChange("joiningDate", e.target.value)}
                className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Notification + Coordinator */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.invoiceNotificationEnabled || false}
              onChange={(e) =>
                handleChange("invoiceNotificationEnabled", e.target.checked)
              }
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700">
              Enabled for Invoice Notification
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.classCoordinator || false}
              onChange={(e) =>
                handleChange("classCoordinator", e.target.checked)
              }
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700">Is Class Coordinator</label>
          </div>
        </div>

        {/* Row 3: Category + Blood Group */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={formData.category || ""}
              onChange={(e) => handleChange("category", e.target.value)}
              className="block w-full rounded-md border-gray-300 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select Category</option>
              {categories?.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Blood Group
            </label>
            <div className="mt-1 relative">
              <Heart className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <select
                value={formData.bloodGroup || ""}
                onChange={(e) => handleChange("bloodGroup", e.target.value)}
                className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Blood Group</option>
                {bloodGroups?.map((b, idx) => (
                  <option key={idx} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Row 4: Email + Phone */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Enter email"
                className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone No(s)
            </label>
            <div className="mt-1 relative">
              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={formData.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="e.g. 9876543210, 9123456789"
                className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone_no}</p>
            )}
          </div>
        </div>

        {/* Row 5: Emergency Contact */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Emergency Contact No.
          </label>
          <div className="mt-1 relative">
            <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={formData.emergencyPhone || ""}
              onChange={(e) =>
                handleChange("emergencyPhone", e.target.value)
              }
              placeholder="Enter emergency contact number"
              className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Row 6: Family Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Father’s Name
            </label>
            <input
              type="text"
              value={formData.fatherName || ""}
              onChange={(e) => handleChange("fatherName", e.target.value)}
              className="block w-full rounded-md border-gray-300 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mother’s Name
            </label>
            <input
              type="text"
              value={formData.motherName || ""}
              onChange={(e) => handleChange("motherName", e.target.value)}
              className="block w-full rounded-md border-gray-300 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Spouse’s Name
            </label>
            <input
              type="text"
              value={formData.spouseName || ""}
              onChange={(e) => handleChange("spouseName", e.target.value)}
              className="block w-full rounded-md border-gray-300 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name of Son
            </label>
            <input
              type="text"
              value={formData.sonName || ""}
              onChange={(e) => handleChange("sonName", e.target.value)}
              className="block w-full rounded-md border-gray-300 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name of Daughter
          </label>
          <input
            type="text"
            value={formData.daughterName || ""}
            onChange={(e) => handleChange("daughterName", e.target.value)}
            className="block w-full rounded-md border-gray-300 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Current Address
          </label>
          <input
            type="text"
            value={formData.currentAddress || ""}
            onChange={(e) => handleChange("currentAddress", e.target.value)}
            className="block w-full rounded-md border-gray-300 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700">
            Permanent Address
          </label>
          <input
            type="text"
            value={formData.permanentAddress || ""}
            onChange={(e) => handleChange("permanentAddress", e.target.value)}
            className="block w-full rounded-md border-gray-300 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>



      </form>
    </div>
  );
};

export default AddStaffPersonalInfo;
