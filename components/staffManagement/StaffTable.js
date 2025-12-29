import React, { useState, useMemo, useEffect, useRef } from "react";
import { UserMinus, Shield, FileSignature } from 'lucide-react';
import {
  FaDownload,
  FaFileExcel,
  FaFileCsv,
  FaChevronLeft,
  FaChevronRight,
  FaSearch
} from "react-icons/fa";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { RiAdminFill } from "react-icons/ri";
import ConfirmationDialogueBox from "../ui/status/Confirmation";
import EditClassPermissionsModal from "./EditClassPermissionsModal";
import SignatureUploadModal from "./UploadSignature";
import { editClassPermissionsApi, getPermittedClasses, removeFromClientApi } from "../../api/staff";

// ============================================================================
const StaffTable = ({
  staffs = [],
  handleClassClick = () => { },
  columns = ['Created By', 'Designation', 'Class & Access', 'Contact', 'Action'],
  isLoading,
  setFilters,
  context,
  setIsPermittedClassPermissionUpdated,

  currentPage,
  setCurrentPage,
  totalCount,
  itemsPerPage,

}) => {
  
  // const totalPa'[ges = Math.ceil(totalCount / itemsPerPage);
  // ============================================================================
  const menuItems = [
    {
      label: "Remove From Client",
      icon: UserMinus,
      variant: "danger"
    },
    {
      label: "Edit Class Permissions",
      icon: Shield,
      variant: "default"
    },
    {
      label: "Upload Signature",
      icon: FileSignature,
      variant: "default"
    }
  ];
  // ============================================================================
  // const [currentPage, setCurrentPage] = useState(1);
  const [signatureUrl, setSignatureUrl] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  // const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [openActionMenu, setOpenActionMenu] = useState(null);
  const [removeFromClient, setRemoveFromClient] = useState(null);
  const [editPermissionStaff, setEditPermissionStaff] = useState(null);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [userPermittedClassesLoader, setUserPermittedClassesLoader] = useState(false);
  const [userPermittedClasses, setUserPermittedClasses] = useState(null);

  // Ref to detect clicks outside the action menu
  const actionMenuRef = useRef(null);

  const getUserPermittedClasses = async () => {
    if (!selectedStaff?.id) return;
    setUserPermittedClassesLoader(true);
    try {
      const resp = await getPermittedClasses(context?.profileId, context?.session, selectedStaff?.id);
      const fetched = resp?.results?.classes || [];
      // Set the initial selected classes based on the fetched permitted classes
      setSelectedClasses(fetched.filter(cls => cls.is_permitted).map(cls => cls.id));
      setUserPermittedClasses(fetched);
    } catch (err) {
      console.error('Failed to fetch permitted classes:', err);
    } finally {
      setUserPermittedClassesLoader(false);
    }
  };

  useEffect(() => {
    getUserPermittedClasses();
  }, [selectedStaff]);

  // Click outside handler for the action menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target) && openActionMenu !== null) {
        setOpenActionMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openActionMenu]);


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
    return staffs?.filter(staff =>
      staff?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff?.designation?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff?.emails?.[0]?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
  }, [staffs, searchTerm]);

// Replace the top totalPages line with this:
const totalPages = totalCount > 0 ? Math.ceil(totalCount / itemsPerPage) : 0;
  // Export functions (kept for completeness, original logic remains)
  const convertToCSV = (data) => {
    // Simplified export headers to match staff data structure
    const headers = ['Full Name', 'Designation', 'Email', 'Phone', 'Admin Access'];
    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        `"${row.full_name || 'N/A'}"`,
        `"${row.designation?.name || 'N/A'}"`,
        `"${row.emails?.[0]?.email || 'N/A'}"`,
        `"${row.phones?.[0]?.phone || 'N/A'}"`,
        `"${row.designation?.is_allowed_for_admin_access === '1' ? 'Yes' : 'No'}"`
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
    // Simplified Excel export for demonstration
    const headers = ['Full Name', 'Designation', 'Email', 'Phone', 'Admin Access'];
    let htmlContent = '<table><tr>';
    headers.forEach(header => {
      htmlContent += `<th>${header}</th>`;
    });
    htmlContent += '</tr>';

    filteredData.forEach(row => {
      htmlContent += '<tr>';
      htmlContent += `<td>${row.full_name || 'N/A'}</td>`;
      htmlContent += `<td>${row.designation?.name || 'N/A'}</td>`;
      htmlContent += `<td>${row.emails?.[0]?.email || 'N/A'}</td>`;
      htmlContent += `<td>${row.phones?.[0]?.phone || 'N/A'}</td>`;
      htmlContent += `<td>${row.designation?.is_allowed_for_admin_access === '1' ? 'Yes' : 'No'}</td>`;
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

  // Simplified and fixed pagination logic
  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const handleMenuItemClick = (item, staff) => {
    // Close dropdown first
    setOpenActionMenu(null);
    setSelectedStaff(staff);

    switch (item.label) {
      case "Remove From Client":
        setRemoveFromClient(staff);
        break;

      case "Edit Class Permissions":
        setEditPermissionStaff(staff);
        // Getting permitted classes is handled by the useEffect after setSelectedStaff
        break;

      case "Upload Signature":
        setSignatureUrl(staff);
        break;

      default:
        console.log("Unhandled action:", item.label);
    }
  };


  const handleRemoveFromClient = async () => {
    setError(null);
    setSuccess(null);
    if (!removeFromClient) return;

    try {
      const finalPayload = {
        api: "user.removeFromClient",
        user_account_id: context?.profileId,
        client_id: context?.session,
        platform: "web",
        "id": removeFromClient?.id // Use removeFromClient for the ID
      };

      const response = await removeFromClientApi(finalPayload);

      if (response?.success) {
        setSuccess(`Removed ${removeFromClient.full_name} from client successfully.`);
        setRemoveFromClient(null);
        // You might want to refresh the staff list here
      } else {
        setError("Failed to remove from client.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    }
  };


  const handleUpdatePermittedClassePermissions = async (updatedClasses) => {
    setError(null);
    setSuccess(null);

    try {
      const permittedClassIds = updatedClasses?.map(cls => cls?.id)

      console.error(permittedClassIds);
      const response = await editClassPermissionsApi(
        context?.profileId,
        context?.session,
        selectedStaff?.id,
        permittedClassIds
      );

      console.error(response, 'response==================');
      if (response?.success) {
        setSuccess(`Permissions for ${selectedStaff.full_name} updated successfully.`);
      } else {
        setError("Failed to update class permissions.");
      }

    } catch (err) {
      console.error(err);
      setError("Something went wrong during update.");
    } finally {
      // Close the modal and trigger a refresh of the main table if needed
      // setEditPermissionStaff(null);
      setUserPermittedClasses(false);
      // setSelectedStaff(null);

      setIsPermittedClassPermissionUpdated(prev => !prev);
    }
  };

  // ============================================================================ 
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header with Search and Export */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-sm text-gray-600 mt-1">
              Showing **{staffs.length}** of **{filteredData.length}** records
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search by name, designation, or email"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setFilters(prev => ({ ...prev, name: e.target.value }));
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
              />
            </div>

            {/* Export Dropdown */}
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 w-full bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
              >
                <FaDownload className="text-sm" />
                <span className="font-medium">Export</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${exportDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {exportDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setExportDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden origin-top-right animate-in fade-in zoom-in-95">
                    <button
                      onClick={downloadCSV}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                    >
                      <FaFileCsv className="text-green-600" />
                      <span>Export as CSV</span>
                    </button>
                    <button
                      onClick={downloadExcel}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
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

      {/* Table - Added overflow-x-auto to the wrapper */}
      <div className="overflow-x-auto w-full">
  {isLoading ? (
    /* 1. Show only when API is fetching */
    <div className="flex justify-center items-center py-20">
      <div className="flex flex-col items-center gap-4">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-gray-500 text-sm font-medium animate-pulse">Fetching staff records...</span>
      </div>
    </div>
  ) : staffs.length === 0 ? (
    /* 2. Show only when loading is finished AND no data returned */
    <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50">
      <div className="p-4 bg-gray-100 rounded-full mb-4">
        <FaSearch className="text-4xl text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">No staff records found</h3>
      <p className="text-gray-500 text-sm max-w-xs text-center mt-1">
        We couldn't find any results matching your current filters or search term.
      </p>
      <button 
        onClick={() => {setSearchTerm(""); setFilters({});}}
        className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm"
      >
        Clear all filters
      </button>
    </div>
       
      ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((head, i) => (
                  <th
                    key={i}
                    className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider last:text-right"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {staffs.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <FaSearch className="text-3xl text-gray-300" />
                      <p className="text-lg font-medium">No staff records found</p>
                      <p className="text-sm">Try adjusting your search criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                staffs.map((staff, index) => (
                  <tr
                    key={staff.id || index}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    {/* Created By - Staff Name/Email */}
                    <td className="whitespace-nowrap px-4 py-4 min-w-[200px]">
                      <div
                        onClick={() => handleClassClick(staff)}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        {staff.image_url ? (
                          <img
                            src={staff.image_url}
                            alt={staff.full_name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://placehold.co/40x40/E0E0E0/757575?text=${getInitials(staff.full_name)}`;
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-gray-100">
                            {getInitials(staff.full_name)}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {staff.full_name || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {staff.emails?.[0]?.email || "No email"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Designation */}
                    <td className="px-4 py-4 min-w-[150px]">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <RiAdminFill className="text-blue-600 text-sm" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {staff.designation?.name || "N/A"}
                        </div>
                      </div>
                    </td>

                    {/* Class & Admin Access */}
                    <td className="px-4 py-4 max-w-xs min-w-[200px]">
                      <div className="text-sm font-semibold text-gray-900 truncate">
                        {staff.class?.name || "N/A Class"}
                      </div>
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                              ${staff.designation?.is_allowed_for_admin_access === '1'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {staff.designation?.is_allowed_for_admin_access === '1' ? 'Admin Access' : 'No Access'}
                        </span>
                      </div>
                    </td>

                    {/* Contact (Phone) */}
                    <td className="whitespace-nowrap px-4 py-4 min-w-[120px]">
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        {staff.phones?.[0]?.phone || "N/A"}
                      </div>
                    </td>

                    {/* Action Menu (Responsive Positioning) */}
                    <td className="relative whitespace-nowrap px-4 py-4 text-right min-w-[100px]">
                      <div ref={openActionMenu === staff.id ? actionMenuRef : null} className="inline-block">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Toggle the menu for the specific staff member
                            setOpenActionMenu(openActionMenu === staff.id ? null : staff.id);
                          }}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>

                        {openActionMenu === staff.id && (
                          <>
                            {/* Dropdown Menu - POSITIONED ABSOLUTELY AND RESPONSIVELY */}
                            <div
                              className="
                                absolute right-4 md:right-0 mt-2 
                                w-48 
                                bg-white border border-slate-200/60 
                                rounded-xl shadow-2xl z-20 py-2 
                                origin-top-right animate-in fade-in zoom-in-95
                                whitespace-normal
                              "
                            >
                              {menuItems.map((item, i) => {
                                const Icon = item.icon;
                                return (
                                  <button
                                    key={i}
                                    className={`
                                      text-left px-4 py-2.5 text-sm w-full flex items-center gap-2
                                      transition-colors duration-150
                                      ${item.variant === "danger"
                                        ? "text-red-600 hover:bg-red-50"
                                        : "text-slate-700 hover:bg-slate-100"
                                      }
                                  `}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMenuItemClick(item, staff);
                                    }}
                                  >
                                    <Icon className="w-4 h-4 opacity-70 flex-shrink-0" />
                                    <span className="whitespace-nowrap">{item.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

   {/* Pagination */}
{totalPages > 1 && (
  <div className="p-4 sm:px-6 sm:py-4 bg-gray-50 border-t border-gray-200">
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      
     
      {/* 2. Main Navigation Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <FaChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && setCurrentPage(page)}
              disabled={page === '...'}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                page === currentPage
                  ? 'bg-blue-600 text-white shadow-md'
                  : page === '...'
                  ? 'text-gray-400 cursor-default'
                  : 'text-gray-600 hover:bg-gray-100 border border-transparent'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <FaChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3. Page Info Display */}
      <div className="text-sm text-gray-600">
        Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages || 1}</span>
      </div>

    </div>
  </div>
)}


      {/* Modals/Dialogs */}
      {removeFromClient && (
        <ConfirmationDialogueBox
          title="Remove Staff From Client"
          description={`Are you sure you want to remove **${removeFromClient.full_name}**? This action cannot be undone.`}
          onCancel={() => setRemoveFromClient(null)}
          onConfirm={handleRemoveFromClient}
        />
      )}

      {/* Conditional rendering for EditClassPermissionsModal to prevent unnecessary re-renders */}
      {editPermissionStaff && userPermittedClasses ? (
        <EditClassPermissionsModal
          isOpen={!!editPermissionStaff}
          staff={editPermissionStaff}
          permittedClasses={userPermittedClasses}
          classes={[]} // Supply your list of all available classes here
          selectedClasses={selectedClasses}
          onToggleClass={setSelectedClasses} // Simplified setter for selected classes
          onClose={() => setEditPermissionStaff(null)}
          onSave={handleUpdatePermittedClassePermissions}
          isLoading={isLoading}
        />
      ) : null}

      <SignatureUploadModal
        selectedStaff={selectedStaff}
        open={!!signatureUrl}
        onClose={() => setSignatureUrl(false)}
        label={`Upload Signature for ${selectedStaff?.full_name || 'Staff'}`}
        // Removed `key="dfjk"` and `uploadingKey` as they were unused or not standard
        // fileUrl={signatureUrl} // Pass staff's current signature URL here if available
        onUpload={async (file) => {
          console.log("Simulating signature upload for:", selectedStaff.full_name, file);
          // Actual upload logic goes here
        }}
      />


      {/* Success/Error Notifications */}
      {success && (
        <div className="fixed top-4 right-4 flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl shadow-lg z-50 transition-all duration-300 animate-in fade-in slide-in-from-right-1">
          <span className="text-sm font-medium">{success}</span>
        </div>
      )}

      {error && (
        <div className="fixed top-4 right-4 flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-lg z-50 transition-all duration-300 animate-in fade-in slide-in-from-right-1">
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};

export default StaffTable;