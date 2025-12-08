'use client';

import { List, User, MoreVertical, GraduationCap, School } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Loader from '../../components/ui/status/LoaderWIthoutBgBlurr';
import StudentFilterPanel from './StudentFilterPanel';
import { getSessionCache } from "../../utils/sessionCache";
import { FaFilter } from "react-icons/fa";

export const StudentList = ({
  students,
  setSelectedStudent,
  setActiveTab,
  loading,
  filters,
  setFilters,
  isFilterPanelOpen,
  setIsFilterPanelOpen

}) => {

  const config = getSessionCache("dashboardConfig");



  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);




  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



  const toggleFilter = (filterType, value, event) => {
    // console.log('---- values ----', filterType, value, event);

    if (event) {
      event.stopPropagation();
    }
    setFilters(prev => {

      const current = prev[filterType];
      // If current is an array (multi-select), toggle value in the array
      if (Array.isArray(current)) {
        if (current.includes(value)) {
          return { ...prev, [filterType]: current.filter(item => item !== value) };
        } else {
          return { ...prev, [filterType]: [...current, value] };
        }
      }
      // If scalar (string/date), toggle between value and empty
      return { ...prev, [filterType]: current === value ? '' : value };


    });

  };



  const getFilterCount = () => (

    (filters?.classId ? 1 : 0) +
    (filters?.name ? 1 : 0) +
    (filters?.status ? 1 : 0) +
    (filters?.gender ? 1 : 0) +
    (filters?.phone ? 1 : 0) +
    (filters?.admission_number ? 1 : 0) +
    (filters?.father_name ? 1 : 0) +
    (filters?.mother_name ? 1 : 0) +
    (filters?.date_of_birth ? 1 : 0) +
    (filters?.registration_number ? 1 : 0) +
    (filters?.registered_phone_for_sms ? 1 : 0) +
    (filters?.optional_subject ? 1 : 0) +
    (filters?.email ? 1 : 0) +
    (filters?.renewal_status ? 1 : 0) +
    (filters?.non_app_user ? 1 : 0) +
    (filters?.is_registered ? 1 : 0) +
    (filters?.with_out_any_phone_number ? 1 : 0) +
    (filters?.appUsed ? 1 : 0)
  )





  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        {/* <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      <span className="ml-4 text-blue-600 font-semibold">Loading students...</span> */}
        <Loader />
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-xl">
            <GraduationCap className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Student Directory</h2>
        </div>

        {/* Clear Filters */}
        <button
          onClick={() => setFilters({})}
          className="cursor-pointer flex items-center px-4 py-2 mb-6 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FaFilter size={16} className="mr-2" />
          <span>Clear Filters</span>
        </button>

        {/* Empty State */}
        <div className="text-center py-10">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-xl opacity-30"></div>
            <div className="relative p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full">
              <List className="h-16 w-16 text-gray-500" />
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">
            No Students Found
          </h3>

          <p className="text-gray-500 max-w-md mx-auto">
            No students match the current filters. Try adjusting your filter options.
          </p>
        </div>

      </div>
    );
  }


  const handleOptionClick = (studentId, option) => {
    if (option.alert) {
      alert(option.alert);
    }
    if (option.redirect_url) {
      window.location.href = option.redirect_url;
    }
    if (option.api) {
      console.log(`Call API: ${option.api} for student ${studentId}`);
      // you can integrate your API call here
    }
    setOpenMenu(null);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const getGradientFromColor = (color) => {
    if (!color || color === "#FFFFFF") {
      return "bg-gradient-to-br from-white to-gray-50";
    }

    // Convert hex to RGB and create a gradient
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Create a lighter version for gradient
    const lighterR = Math.min(255, r + 30);
    const lighterG = Math.min(255, g + 30);
    const lighterB = Math.min(255, b + 30);

    return {
      background: `linear-gradient(135deg, rgb(${r}, ${g}, ${b}) 0%, rgb(${lighterR}, ${lighterG}, ${lighterB}) 100%)`
    };
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-xl">
            <GraduationCap className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Student Directory</h2>
            <p className="text-sm text-gray-600 mt-1">{students.length} {students.length === 1 ? 'student' : 'students'} enrolled</p>
          </div>
        </div>
        <button
          onClick={() => {
            setIsFilterPanelOpen((prev) => !prev)
          }}
          className="cursor-pointer flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FaFilter size={16} className="mr-2" />
          <span>Filters</span>
          {getFilterCount() > 0 && (
            <span className="ml-2 bg-blue-500 text-white text-xs font-medium w-5 h-5 rounded-full flex items-center justify-center">
              {getFilterCount()}
            </span>
          )}
        </button>
      </div>

      <StudentFilterPanel

        setFilters={setFilters}
        filters={filters}
        config={config}
        isFilterPanelOpen={isFilterPanelOpen}
        setIsFilterPanelOpen={setIsFilterPanelOpen}
        // staffStatus={staffStatus}
        // accountStatus={accountStatus}
        toggleFilter={toggleFilter}

      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {students?.map((student, index) => (
          <div
            onClick={() => {
              setSelectedStudent(student)
              setActiveTab('view')
            }
            }
            key={student?.id}
            className="group relative transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
            style={{
              animationName: 'fadeInUp',
              animationDuration: '0.5s',
              animationTimingFunction: 'ease-out',
              animationDelay: `${index * 0.05}s`,
              animationFillMode: 'both'
            }}
          >
            <div className="relative flex flex-col p-5 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 h-full">

              {/* Header with avatar and menu */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {student?.image_url ? (
                    <div className="relative">
                      <img
                        src={student?.image_url}
                        alt={student?.name}
                        className="h-12 w-12 rounded-xl object-cover border-2 border-white shadow-sm"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                  ) : (
                    <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm border-2 border-white">
                      {/* <span className="text-white font-bold text-xs">{getInitials(student?.name ? student?.name : "")}</span> */}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                  )}

                  <div className="min-w-0">
                    {student?.name && (
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{student?.name}</h3>
                    )}
                    {student?.roll_number && (
                      <p className="text-sm text-gray-600 mt-0.5">Roll: {student?.roll_number}</p>
                    )}
                  </div>
                </div>

                {/* Options Menu */}
                {student?.options && student?.options.length > 0 && (
                  <div className="relative" ref={openMenu === student?.id ? menuRef : null}>
                    <button
                      onClick={() => setOpenMenu(openMenu === student?.id ? null : student?.id)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-all duration-200 opacity-70 group-hover:opacity-100"
                      aria-label="Student options"
                    >
                      <MoreVertical className="h-4 w-4 text-gray-600" />
                    </button>

                    {openMenu === student?.id && (
                      <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transform animate-in slide-in-from-top-2 duration-200 z-9999">
                        {student?.options.map((option, i) => (
                          <button
                            key={i}
                            onClick={() => handleOptionClick(student?.id, option)}
                            className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-150 border-b border-gray-100 last:border-b-0"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Student Info */}
              <div className="flex-1 mt-2">
                <div className="space-y-2.5">
                  {student?.class?.name && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <GraduationCap className="h-4 w-4 text-purple-500 flex-shrink-0" />
                      <span className="text-sm truncate">{student?.class.name}</span>
                    </div>
                  )}

                  {student?.school && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <School className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-xs truncate">{student?.school}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-b-xl opacity-80"></div>
            </div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(15px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `
      }} />
    </div>
  );
};