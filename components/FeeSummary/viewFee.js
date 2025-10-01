'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { useFees } from '../../controllers/fees';
import { getSessionCache } from '../../utils/sessionCache';

const ViewFee = ({ }) => {




  const config = getSessionCache("dashboardConfig");
  const context = getSessionCache("dashboardContext");

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStandard, setSelectedStandard] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const feesPerPage = 10;



  // const { setAuthStates, id, setGuid, guid } = useAuthContext();
  const { getFees, feesData: fees } = useFees(
    context?.profileId,
    context?.session,


  );


  // ==================================================================================================

  useEffect(() => {
    getFees(
      context?.profileId,
      context?.session,

      // selectedDate,
      // cookyGuid,
      // selectedClassId,
      // cookyId,
    );
  }, [context?.session]);

  console.log(fees, 'feeData=-=');

  // Extract unique standards from fees
  const standards = useMemo(() => {
    if (!fees) return [];
    const uniqueStandards = [...new Set(fees.map(fee => fee?.standard?.name))];
    return uniqueStandards.filter(Boolean).sort();
  }, [fees]);

  // Extract unique fee types
  const feeTypes = useMemo(() => {
    if (!fees) return [];
    const types = [...new Set(fees.map(fee => fee?.type))];
    return types.filter(Boolean);
  }, [fees]);

  // Filter fees based on selected criteria
  const filteredFees = useMemo(() => {
    if (!fees) return [];

    return fees.filter(fee => {
      const matchesStandard = !selectedStandard || fee?.standard?.name === selectedStandard;
      const matchesType = !selectedType || fee?.type === selectedType;
      const matchesSearch = !searchTerm ||
        fee?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStandard && matchesType && matchesSearch;
    });
  }, [fees, selectedStandard, selectedType, searchTerm]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedStandard, selectedType, searchTerm]);

  if (!fees || fees.length === 0) {
    return <p className="text-center text-gray-500">No fee data available</p>;
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredFees.length / feesPerPage);
  const indexOfLastFee = currentPage * feesPerPage;
  const indexOfFirstFee = indexOfLastFee - feesPerPage;
  const currentFees = filteredFees.slice(indexOfFirstFee, indexOfLastFee);

  // Pagination handlers
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToPrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Clear filters
  const clearFilters = () => {
    setSelectedStandard('');
    setSelectedType('');
    setSearchTerm('');
  };

  // Get badge color based on fee type
  const getTypeBadgeColor = (type) => {
    const colors = {
      'MONTHLY': 'bg-blue-100 text-blue-800',
      'YEARLY': 'bg-green-100 text-green-800',
      'ONE_TIME': 'bg-purple-100 text-purple-800',
      'QUARTERLY': 'bg-yellow-100 text-yellow-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Fee Management</h2>

        <div className="grid md:grid-cols-4 gap-4">
          {/* Search Box */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Fee Name
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Standard Dropdown */}
          <div>
            <label htmlFor="standard" className="block text-sm font-medium text-gray-700 mb-2">
              Standard/Class
            </label>
            <select
              id="standard"
              value={selectedStandard}
              onChange={(e) => setSelectedStandard(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">All Standards</option>
              {standards.map((standard) => (
                <option key={standard} value={standard}>
                  {standard}
                </option>
              ))}
            </select>
          </div>

          {/* Fee Type Dropdown */}
          <div>
            <label htmlFor="feeType" className="block text-sm font-medium text-gray-700 mb-2">
              Fee Type
            </label>
            <select
              id="feeType"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">All Types</option>
              {feeTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedStandard || selectedType || searchTerm) && (
          <div className="mt-4 text-sm text-gray-600">
            Active filters:
            {searchTerm && <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded">Search: {searchTerm}</span>}
            {selectedStandard && <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded">Standard: {selectedStandard}</span>}
            {selectedType && <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded">Type: {selectedType}</span>}
          </div>
        )}
      </div>

      {/* Fee Table */}
      {currentFees.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fee Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Standard
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentFees.map((fee) => (
                  <tr key={fee?.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{fee?.name}</div>
                      {fee?.is_miscellaneous && (
                        <span className="text-xs text-gray-500">Miscellaneous</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{fee?.standard?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeColor(fee?.type)}`}>
                        {fee?.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">₹{fee?.amount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{fee?.due_date?.text || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${fee?.is_disabled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                        {fee?.is_disabled ? 'Disabled' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        {fee?.options?.map((option, idx) => (
                          <button
                            key={idx}
                            className={`px-3 py-1 rounded transition ${option.action === 'delete'
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : option.action === 'edit'
                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            onClick={() => console.log(`${option.action} fee:`, fee.id)}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 text-lg">No fees found matching your filters</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && currentFees.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={goToPrevious}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-10 h-10 rounded-lg transition ${currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={goToNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Results Info */}
      {filteredFees.length > 0 && (
        <p className="text-center text-sm text-gray-600">
          Showing {indexOfFirstFee + 1}-{Math.min(indexOfLastFee, filteredFees.length)} of {filteredFees.length} fees
        </p>
      )}
    </div>
  );
};

export default ViewFee;