'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { useFees } from '../../controllers/fees';
import { getSessionCache } from '../../utils/sessionCache';
import CreateFee from '../ui/drawer/CreateFee';
import FeeTypeDetail from '../ui/drawer/FeeTypeDetail';
import FeePermissionManager from './FeePermissionManager';
import MarkFeeForStudents from './MarkFeeForStudents';
import Loader from '../ui/status/Loader';
import HeaderViewFee from './HeaderViewFee';
import ViewFeeFiltersSummary from './ViewFeeFiltersSummary';
import ViewFeeFilterPanel from './ViewFeeFilterPanel';
import { ArrowRight, BarChart3, Calendar, Clock, Receipt, ReceiptIndianRupee, Sparkles, User2 } from 'lucide-react';

const reportTypes = [
  {
    key: "datewise",
    label: "Datewise Collection",
    icon: <Calendar className="w-5 h-5" />,
    gradient: "from-blue-500 to-cyan-500",
    hoverGradient: "hover:from-blue-600 hover:to-cyan-600",
    link: "/reports/datewise"
  },
  {
    key: "standardwise",
    label: "Standardwise",
    icon: <BarChart3 className="w-5 h-5" />,
    gradient: "from-purple-500 to-pink-500",
    hoverGradient: "hover:from-purple-600 hover:to-pink-600",
    link: "/reports/standardwise"
  },
  {
    key: "periodwise",
    label: "Periodwise",
    icon: <Clock className="w-5 h-5" />,
    gradient: "from-emerald-500 to-teal-500",
    hoverGradient: "hover:from-emerald-600 hover:to-teal-600",
    link: "/reports/periodwise"
  },
];
const ViewFee = ({ }) => {
  const [activeReport, setActiveReport] = useState('datewise');

  const [staffStatus, setStudentStatus] = useState([
    {
      name: "Receive Daily Notification",

    },
    {
      name: "Has Account",
    },
    {

      name: "Allowed for Admin Accesss",
    },

  ]);



  const [accountStatus, setAccountStatus] = useState([
    {
      name: "Active",

    },
    {
      name: "Disabled",
    },


  ]);
  const [viewMode, setViewMode] = useState('overview');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const [filters, setFilters] = useState({
    feeType: "",
    joinedDate: "",
    status: [],
    accountStatus: [],
    designations: [],
    title: "",
    name: "",
    motherName: "",
    fatherName: "",
    mobile: "",
    emergencyContact: "",
    isSearch: false,
  });


  const config = getSessionCache("dashboardConfig");
  const context = getSessionCache("dashboardContext");
  const [permissionDrawer, setPermissionDrawer] = useState(false);
  const [markFeeForStudents, setMarkFeeForStudents] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStandard, setSelectedStandard] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const feesPerPage = 10;


  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);


  // const { setAuthStates, id, setGuid, guid } = useAuthContext();
  const { getFees, feesData: fees, feesResponse, totalCount, limit, isLoading } = useFees(
    context?.profileId,
    context?.session,


  );


  // ==================================================================================================
  const fetchFees = async () => {
    const pageSize = feesResponse?.limit || feesPerPage;

    try {
      const re = await getFees(
        context.profileId,
        context.session,
        currentPage,
        pageSize,
        {
          feeType: filters?.feeType || "",
          standards: filters?.standards || [],
          enabled: filters?.enabled ?? "",
          hostelFee: filters?.hostelFee ?? "",
          startDate: filters?.startDate || "",
          endDate: filters?.endDate || "",
          dueDate: filters?.dueDate || "",
        }
      );

    } catch (error) {
      console.error("Error fetching fees:", error);
    }
  };

  useEffect(() => {
    if (!context?.profileId || !context?.session) return;


    fetchFees();
    setFilters((prev) => ({ ...prev, type: config?.fee_frequency[0]?.value || "" }));

    setIsFilterPanelOpen(false)
  }, [
    context?.profileId,
    context?.session,
    currentPage,
    filters?.type,
    filters?.standards,
    filters?.dueDate,
    filters?.startDate,
    filters?.endDate,
    filters?.hostelFee,
    filters?.enabled,


  ]);



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
      const matchesSearch = !searchTerm || fee?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStandard && matchesType && matchesSearch;
    });
  }, [fees, selectedStandard, selectedType, searchTerm]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedStandard, selectedType, searchTerm]);

  // if (!fees || isLoading || fees.length === 0) {
  //   return <p className="text-center text-gray-500">No fee data available</p>;
  // }
  const serverLimit = feesResponse?.limit || feesPerPage;
  const totalPages = Math.ceil((totalCount || 0) / serverLimit);

  // Calculate pagination
  const indexOfLastFee = currentPage * feesPerPage;
  const indexOfFirstFee = indexOfLastFee - feesPerPage;
  const currentFees = filteredFees; // fees is already server-limited; filteredFees applies any lightweight client filtering

  // Pagination handlers
  const goToPage = (pageNumber) => {
    if (pageNumber < 1) return;
    setCurrentPage(pageNumber); // effect will fetch that page
  };

  const goToPrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({})
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








  const handleActionClick = (option, fee) => {
    if (option.action === 'view') {
      setSelectedFee(fee);
      setDrawerOpen(true);
      return;
    }
    if (option.action === 'edit') {
      setMarkFeeForStudents(true)
      console.log('edit fee:', fee.id);
      return;
    }
    if (option.action === 'delete') {
      console.log('delete fee:', fee.id);
      return;

    }
    console.log(`${option.action} fee:`, fee.id);
  };




  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };


  const getFilterCount = () => {
    return (filters?.type ? 1 : 0) + (filters?.name ? 1 : 0) + (filters?.standards?.length) + (filters?.enabled ? 1 : 0) + (filters?.hostelFee ? 1 : 0) + (filters?.dueDate ? 1 : 0) + (filters?.startDate ? 1 : 0) + (filters?.endDate ? 1 : 0);
  };


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


  if (isLoading) {
    return (
      <Loader />
    )
  }







  // console.log('filter s ', filters);



  return (


    <>
      {/* ================== Drawer ======================================== */}

      <FeePermissionManager
        open={permissionDrawer}
        onClose={() => setPermissionDrawer(false)}
        feeTypes={currentFees}
        context={context}

      />

      <MarkFeeForStudents
        open={markFeeForStudents}
        onClose={() => setPermissionDrawer(false)}
        feeTypes={currentFees}
        context={context}

      />



      <button
        onClick={() => setPermissionDrawer(true)}
        className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        ⚙️ Set Fee Type Permissions
      </button>
      <FeeTypeDetail
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedFee={selectedFee}
        context={context}
      />

      {/* backdrop */}
      {drawerOpen && <div onClick={() => setDrawerOpen(false)} className="fixed inset-0 bg-black-50 bg-opacity-30 z-40"></div>}


      {/* ======================================================================= */}



      <div className="space-y-6">

        {/* Search and Filters */}

        <div className="bg-white rounded-lg shadow p-6">
          {/* Header Section */}


          <HeaderViewFee
            headerTitle={"View Fee"}
            headerIcon={<ReceiptIndianRupee />}
            toggleFilterPanel={toggleFilterPanel}
            getFilterCount={getFilterCount}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />


          <ViewFeeFiltersSummary
            filters={filters}
            toggleFilter={toggleFilter}
            clearFilters={clearFilters}
          />

          <ViewFeeFilterPanel
            setFilters={setFilters}
            filters={filters}
            config={config}
            isFilterPanelOpen={isFilterPanelOpen}
            staffStatus={staffStatus}
            accountStatus={accountStatus}
            toggleFilter={toggleFilter}

          />







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
                              className={`cursor-pointer px-3 py-1 rounded transition ${option.action === 'delete'
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : option.action === 'edit'
                                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              onClick={() => handleActionClick(option, fee)} // <-- changed
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
              className="cursor-pointer mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
      {/* Fancy Card Container */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportTypes.map((item) => {
            const isActive = activeReport === item.key;

            return (
              <button
                key={item.key}
                onClick={() => handleNavigation(item.key, item.link)}
                className={`group relative p-6 rounded-xl font-semibold text-sm
                    transition-all duration-300 transform hover:scale-105 hover:-translate-y-1
                    ${isActive
                    ? `bg-gradient-to-br ${item.gradient} text-white shadow-xl`
                    : `bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 hover:shadow-xl border-2 border-gray-200 hover:border-transparent`
                  }`}
              >
                {/* Glow Effect */}
                {isActive && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-xl blur-xl opacity-60 -z-10 animate-pulse`}></div>
                )}

                {/* Content */}
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`p-3 rounded-lg transition-all duration-300 ${isActive
                    ? 'bg-white/20 backdrop-blur-sm'
                    : 'bg-white border border-gray-200 group-hover:border-transparent'
                    } ${!isActive && `group-hover:bg-gradient-to-br ${item.gradient}`}`}>
                    <span className={`transition-all duration-300 ${isActive
                      ? 'text-white'
                      : 'text-gray-600 group-hover:text-white'
                      }`}>
                      {item.icon}
                    </span>
                  </div>

                  <div>
                    <span className="block font-bold text-base mb-1">{item.label}</span>
                    <span className={`text-xs flex items-center justify-center space-x-1 ${isActive ? 'text-white/80' : 'text-gray-500 group-hover:text-gray-700'
                      }`}>
                      <span>View Report</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white shadow-lg">
                    <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping"></div>
                  </div>
                )}

                {/* Hover Arrow */}
                {!isActive && (
                  <div className={`absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Description Text */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500 flex items-center space-x-2">
            <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></span>
            <span>Click on any report type to view detailed analytics and insights</span>
          </p>
        </div>
      </div>
    </>

  );
};

export default ViewFee;