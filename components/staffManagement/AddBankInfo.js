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
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Bank Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Bank</label>
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
              className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          {errors.bank && (
            <p className="mt-1 text-sm text-red-600">{errors.bank}</p>
          )}
        </div>

        {/* Account Holder Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
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
              className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
          <label className="block text-sm font-medium text-gray-700">
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
              className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          {errors.accountNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>
          )}
        </div>

        {/* IFSC Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
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
              className="uppercase block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          {errors.ifscCode && (
            <p className="mt-1 text-sm text-red-600">{errors.ifscCode}</p>
          )}
        </div>

        {/* Branch Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
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
              className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
