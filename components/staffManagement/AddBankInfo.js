import React, { useState } from "react";
import { Landmark, User, Hash, Building2, KeyRound } from "lucide-react";

const AddBankInfo = ({ setFormData, formData }) => {
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    let newErrors = {};
    if (!formData.bank) newErrors.bank = "Bank name is required";
    if (!formData.accountHolderName)
      newErrors.accountHolderName = "Account holder name is required";
    if (!formData.accountNumber)
      newErrors.accountNumber = "Account number is required";
    if (!formData.ifscCode) newErrors.ifscCode = "IFSC code is required";
    if (!formData.branchName) newErrors.branchName = "Branch name is required";

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
      console.log("Bank info submitted:", formData);
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto p-4"
      >

        {/* Bank Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Bank</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Landmark className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="bank"
              value={formData.bank || ""}
              onChange={(e) => handleChange("bank", e.target.value)}
              placeholder="Enter bank name"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
            />
          </div>
          {errors.bank && (
            <p className="mt-1 text-sm text-red-600">{errors.bank}</p>
          )}
        </div>

        {/* Account Holder Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Account Holder Name
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="accountHolderName"
              value={formData.accountHolderName || ""}
              onChange={(e) => handleChange("accountHolderName", e.target.value)}
              placeholder="Enter account holder name"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
            />
          </div>
          {errors.accountHolderName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.accountHolderName}
            </p>
          )}
        </div>

        {/* Account Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Account Number
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Hash className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber || ""}
              onChange={(e) => handleChange("accountNumber", e.target.value)}
              placeholder="Enter account number"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
            />
          </div>
          {errors.accountNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>
          )}
        </div>

        {/* IFSC Code */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            IFSC Code
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <KeyRound className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="ifscCode"
              value={formData.ifscCode || ""}
              onChange={(e) => handleChange("ifscCode", e.target.value.toUpperCase())}
              placeholder="Enter IFSC code"
              maxLength={11}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
            />
          </div>
          {errors.ifscCode && (
            <p className="mt-1 text-sm text-red-600">{errors.ifscCode}</p>
          )}
        </div>

        {/* Branch Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Branch Name
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="branchName"
              value={formData.branchName || ""}
              onChange={(e) => handleChange("branchName", e.target.value)}
              placeholder="Enter branch name"
      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
            />
          </div>
          {errors.branchName && (
            <p className="mt-1 text-sm text-red-600">{errors.branchName}</p>
          )}
        </div>

        {/* Submit */}

      </form>
    </div>
  );
};

export default AddBankInfo;
