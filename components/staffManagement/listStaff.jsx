'use client';

import { List, User, MoreVertical, GraduationCap, School, User2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import StaffTable from "./StaffTable";
// import FeeSummaryFilterPanel from "./FilterPanel";
import StaffFilterPanel from "./FilterPanel";
import StaffFiltersSummary from "./filtersSummary";
import Header from "./Header";
import SearchBar from "./searchBar";
import StaffSummary from "./Summary";
import { getSessionCache } from "../../utils/sessionCache";

export const StaffList = ({ staff, setSelectedStaff, setActiveTab }) => {
  const [selectedData, setSelectedData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [openMenu, setOpenMenu] = useState(null);
  const [viewMode, setViewMode] = useState('overview');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [studentStatus, setStudentStatus] = useState([
    {
      name: "Promoted",

    },
    {
      name: "New",
    },
    {

      name: "Deposited",
    },

  ]);

  const [sort, setSort] = useState({
    field: "name",
    direction: "asc"
  });
  const [filteredData, setFilteredData] = useState([]);

  const [filters, setFilters] = useState({
    // modules: [
    //   {
    //     moduleName: "Meetsdings",
    //     categories: [
    //       "Upcoming",
    //       "All",

    //     ]
    //   },

    // ],

    status: [],
    paymentMode: ""
  });


  const config = getSessionCache("dashboardConfig");


  const menuRef = useRef(null);
  const toggleFilter = (filterType, value, event) => {
    // console.log('---- values ----', filterType, value, event);

    if (event) {
      event.stopPropagation();
    }

    setFilters(prev => {
      if (prev[filterType].includes(value)) {
        return {
          ...prev,
          [filterType]: prev[filterType].filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [filterType]: [...prev[filterType], value]
        };
      }
    });
  };
  const clearFilters = () => {
    setFilters({
      modules: [],
      categories: [],
      status: []
    });
    setSearchTerm("");
  };
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

  const handleSort = (field, toggleDirection = false) => {
    setSort(prev => ({
      field,
      direction: toggleDirection && prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };






  if (!staff || staff.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-100 rounded-xl">
            <GraduationCap className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Staff Directory</h2>
        </div>

        <div className="text-center py-12">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-xl opacity-30"></div>
            <div className="relative p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full">
              <List className="h-16 w-16 text-gray-500" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">No Students Found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Your student directory is empty. Students will appear here once they're added to the system.
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
  // Handle product click to show details
  const handleRowClick = (product) => {
    // console.log(product)
    setSelectedStaff(product)
    setActiveTab('view')
    setSelectedData(product);
    // setShowModal(true)
    setSelectedData(null); // Reset first
    setTimeout(() => setSelectedData(product), 0); // Allow state to change

  };







  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };
  const getFilterCount = () => {
    return  filters.status.length;
  };

  const handleStandardChange = (e) => {

    const stdId = e.target.value;
    setSelectedStandardId(stdId);

    if (stdId === "all") {
      setSelectedStandardFees([]); // or merge all fees across standards
    } else {
      const selectedStd = config?.standards?.find((s) => s.id === stdId);
      setSelectedStandardDetails(selectedStd)

      setSelectedStandardFees(selectedStd?.fees || []);


      // if (feeCollectionData?.fee_collections.length > 0) {
      //   feeCollectionData?.fee_collections.find((x => {

      //     return (
      //       x?.student?.class?.id ===
      //     )
      //   }))
      // }


      setSelectedClass(selectedStd?.classes || []);

    }
  };
  return (
    <>

      {/* <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <GraduationCap className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Staff Directory</h2>
              <p className="text-sm text-gray-600 mt-1">{staff.length} Staff Members</p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {staff?.map((student, index) => (
            <div
              onClick={() => {
                setSelectedStaff(student)
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
                        <span className="text-white font-bold text-xs">{getInitials(student?.name ? student?.name : "")}</span>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                      </div>
                    )}

                    <div className="min-w-0">
                      {student?.name && (
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{student?.name}</h3>
                      )}
                      {student?.designation && (
                        <p className="text-sm text-gray-600 mt-0.5">{student?.designation?.name}</p>
                      )}
                    </div>
                  </div>

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
      </div> */}


      <Header
        headerTitle={"Staff Management"}
        headerIcon={<User2 />}
        toggleFilterPanel={toggleFilterPanel}
        getFilterCount={getFilterCount}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      {/* <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      /> */}
      <StaffFiltersSummary
        filters={filters}
        toggleFilter={toggleFilter}
        clearFilters={clearFilters}
      />

      <StaffFilterPanel
        setFilters={setFilters}
        config={config}

        isFilterPanelOpen={isFilterPanelOpen}
        // modules={modules} // <-- use the dummy modules state, not []
        filters={filters}
        studentStatus={studentStatus}
        toggleFilter={toggleFilter}
      />


      {/* <StaffSummary
        filteredCount={filteredData.length}
        totalCount={staff.length}
        sort={sort}
        handleSort={handleSort}
      /> */}
      <StaffTable
        columns={['Created By', 'Subject', 'Title & Description', 'Timings', 'Info', 'Start/join', 'Action']}
        staffs={staff}
        handleClassClick={handleRowClick}
      />

    </>
  );
};