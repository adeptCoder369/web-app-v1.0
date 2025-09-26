import React, { useState, useMemo } from "react";
import { 
  FaBook, 
  FaExternalLinkAlt, 
  FaDownload, 
  FaFileExcel, 
  FaFileCsv,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaSearch
} from "react-icons/fa";
import { ChevronDown, MoreHorizontal } from "lucide-react";

const StaffTable = ({
  staffs = [],
  handleClassClick = () => { },
  columns = ['Created By', 'Subject', 'Title & Description', 'Timings', 'Info', 'Start/join', 'Action'],
}) => {
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  // Helper functions
  function formatDateTime(dateStr, timeStr) {
    if (!dateStr || !timeStr) return "N/A";

    try {
      const dateTimeString = `${dateStr}T${timeStr.split(' ')[0]}:00Z`;
      const date = new Date(dateTimeString);

      if (isNaN(date.getTime())) {
        return "Invalid Date/Time";
      }

      const day = date.getDate();
      const month = date.toLocaleString("en-US", { month: "short" }).toLowerCase();
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");

      return `${day}${getDaySuffix(day)} ${month}, ${year} @ ${hours}:${minutes}`;
    } catch (error) {
      console.error("Error formatting date/time:", error);
      return "N/A";
    }
  }

  function getDaySuffix(day) {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.split(" ");
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // Filter and paginate data
  const filteredData = useMemo(() => {
    return staffs.filter(staff => 
      staff.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.subject?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [staffs, searchTerm]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Export functions
  const convertToCSV = (data) => {
    const headers = ['Name', 'Subject', 'Description', 'Date', 'Time', 'Total Students', 'Platform'];
    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        `"${row.name || 'N/A'}"`,
        `"${row.subject?.name || 'N/A'}"`,
        `"${row.description || 'N/A'}"`,
        `"${row.date || 'N/A'}"`,
        `"${row.time || 'N/A'}"`,
        `"${row.students?.length || 0}"`,
        `"${row.info?.platform || 'N/A'}"`
      ].join(','))
    ].join('\n');
    
    return csvContent;
  };

  const downloadCSV = () => {
    const csvContent = convertToCSV(filteredData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `staff_data_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    setExportDropdownOpen(false);
  };

  const downloadExcel = () => {
    // For Excel export, we'll create a simple HTML table format that Excel can read
    const headers = ['Name', 'Subject', 'Description', 'Date', 'Time', 'Total Students', 'Platform'];
    let htmlContent = '<table><tr>';
    headers.forEach(header => {
      htmlContent += `<th>${header}</th>`;
    });
    htmlContent += '</tr>';
    
    filteredData.forEach(row => {
      htmlContent += '<tr>';
      htmlContent += `<td>${row.name || 'N/A'}</td>`;
      htmlContent += `<td>${row.subject?.name || 'N/A'}</td>`;
      htmlContent += `<td>${row.description || 'N/A'}</td>`;
      htmlContent += `<td>${row.date || 'N/A'}</td>`;
      htmlContent += `<td>${row.time || 'N/A'}</td>`;
      htmlContent += `<td>${row.students?.length || 0}</td>`;
      htmlContent += `<td>${row.info?.platform || 'N/A'}</td>`;
      htmlContent += '</tr>';
    });
    htmlContent += '</table>';
    
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `staff_data_${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
    setExportDropdownOpen(false);
  };

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header with Search and Export */}
      <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            {/* <h3 className="text-xl font-bold text-gray-900">Staff Management</h3> */}
            <p className="text-sm text-gray-600 mt-1">
              Showing {paginatedData.length} of {filteredData.length} records
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search staff, subjects..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2.5 w-full sm:w-64 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <FaDownload className="text-sm" />
                <span className="font-medium">Export</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${exportDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {exportDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setExportDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                    <button
                      onClick={downloadCSV}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FaFileCsv className="text-green-600" />
                      <span>Export as CSV</span>
                    </button>
                    <button
                      onClick={downloadExcel}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FaFileExcel className="text-green-700" />
                      <span>Export as Excel</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((head, i) => (
                <th
                  key={i}
                  className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <FaSearch className="text-3xl text-gray-300" />
                    <p className="text-lg font-medium">No records found</p>
                    <p className="text-sm">Try adjusting your search criteria</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((staff, index) => (
                <tr
                  key={staff.id || index}
                  className="hover:bg-gray-50 transition-colors cursor-pointer group"
                  onClick={() => handleClassClick(staff)}
                >
                  {/* Created By */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      {staff.image_url ? (
                        <img
                          src={staff.image_url}
                          alt={staff.user?.name || staff.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://placehold.co/40x40/E0E0E0/757575?text=${getInitials(staff.user?.name || staff.name)}`;
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-gray-100">
                          {getInitials(staff.user?.name || staff.name)}
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {staff.user?.name || staff.name || "N/A"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {staff.user?.email || "No email"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Subject */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <FaBook className="text-blue-600 text-sm" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {staff.subject?.name || "N/A"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {staff.subject?.code || "No code"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Title & Description */}
                  <td className="px-6 py-4 max-w-xs">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {staff.description || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-2">
                      {staff.info?.text || "No additional details"}
                    </div>
                  </td>

                  {/* Timings */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {staff.date || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      {staff.time || "N/A"}
                    </div>
                  </td>

                  {/* Info */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="text-xs text-gray-700">
                        <span className="font-medium">Students:</span> {staff.students?.length || 0}
                      </div>
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Platform:</span> {staff.info?.platform || "N/A"}
                      </div>
                    </div>
                  </td>

                  {/* Start/Join */}
                  <td className="whitespace-nowrap px-6 py-4">
                    {staff.startJoinLink ? (
                      <a
                        href={staff.startJoinLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg group-hover:scale-105"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Join Class
                        <FaExternalLinkAlt className="text-xs" />
                      </a>
                    ) : (
                      <span className="inline-flex items-center bg-gray-100 text-gray-500 text-sm font-medium py-2 px-4 rounded-lg">
                        No Link
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-medium hover:bg-indigo-200 transition-colors">
                      {staff.action === "view_details" && "Details"}
                      {staff.action === "edit_class" && "Edit"}
                      {staff.action === "manage_class" && "Manage"}
                      {staff.action === "view_recording" && "Recording"}
                      {!staff.action && "Action"}
                      <MoreHorizontal className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Items per page */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries</span>
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' ? goToPage(page) : null}
                    disabled={page === '...'}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      page === currentPage
                        ? 'bg-blue-600 text-white shadow-md'
                        : page === '...'
                        ? 'text-gray-400 cursor-default'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Page info */}
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffTable;