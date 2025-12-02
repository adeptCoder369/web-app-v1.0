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
import { getFeeTypes } from '../../api/fees';
import HeaderFeeTypes from './HeaderFeeTypes';

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
const FeeTpes = ({ }) => {
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

  // ================================================================
  const config = getSessionCache("dashboardConfig");
  const context = getSessionCache("dashboardContext");
  // ================================================================

  const [permissionDrawer, setPermissionDrawer] = useState(false);
  const [markFeeForStudents, setMarkFeeForStudents] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStandard, setSelectedStandard] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const feesPerPage = 10;


  const [drawerOpen, setDrawerOpen] = useState(false);
  const [fees, setFees] = useState([]);
  const [selectedFee, setSelectedFee] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  console.log('-=---fee =======>>', fees);




  // ==================================================================================================
  const fetchFeesTypes = async () => {
    // const pageSize = feesResponse?.limit || feesPerPage;

    try {
      const re = await getFeeTypes(
        context.profileId,
        context.session,
        // currentPage,
        // pageSize,
        // {
        //   feeType: filters?.feeType || "",
        //   standards: filters?.standards || [],
        //   enabled: filters?.enabled ?? "",
        //   hostelFee: filters?.hostelFee ?? "",
        //   startDate: filters?.startDate || "",
        //   endDate: filters?.endDate || "",
        //   dueDate: filters?.dueDate || "",
        // }
      );
      console.log('fee =======>>', re?.data?.results?.fee_types);

      if (re.status) {
        setFees(re?.data?.results?.fee_types || []);
      }

    } catch (error) {
      console.error("Error fetching fees:", error);
    }
  };




  useEffect(() => {
    if (!context?.profileId || !context?.session) return;


    fetchFeesTypes();
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
  let totalCount = fees?.total_count || 0;
  const serverLimit = fees?.limit || feesPerPage;
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

const getCountColor = (count) => {
  if (count == 0) return "bg-gray-100 text-gray-700";
  if (count <= 2) return "bg-green-100 text-green-700";
  if (count <= 5) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};





  const handleActionClick = (option, fee) => {
    if (option.action === 'view') {
      setSelectedFee(fee);
      setDrawerOpen(true);
      return;
    }
    if (option.action === 'edit') {
      // setMarkFeeForStudents(true)
      console.log('edit fee:', fee.id);
      return;
    }
    if (option.action === 'delete') {
      console.log('delete fee:', fee.id);
      return;

    }
    console.log(`${option.action} fee:`, fee.id);
  };



  const handlePayFee = (option, fee) => {
    // console.log(`${option.action} fee:`, fee);

    if (option.action === 'pay') {
      setSelectedFee(fee);
      setMarkFeeForStudents(true);
      return;
    }

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
        onClose={() => setMarkFeeForStudents(false)}
        feeTypes={currentFees}
        config={config}
        selectedFee={selectedFee}

      />



      <button
        onClick={() => setPermissionDrawer(true)}
        className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        ⚙️ Set Fee Type Permissions
      </button>

      <button
        onClick={() => setMarkFeeForStudents(true)}
        className="ml-4 cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        Mark Fee For Students
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


          <HeaderFeeTypes
            headerTitle={"Fee Types"}
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
                      Category
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Types
                    </th>


                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Counts
                    </th>     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentFees.map((fee) => (
                    <tr key={fee?.id} className="hover:bg-gray-50 transition">

                      {/* Fee Name */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{fee?.name}</div>
                        {fee?.code && (
                          <span className="text-xs text-gray-500">{fee?.code}</span>
                        )}
                      </td>



                      {/* Type - USING category */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-700">
                          {fee?.category || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-2">

                          {[
                            { key: "is_variable", label: "Variable" },
                            { key: "is_applicable_for_new_students", label: "New Students" },
                            { key: "is_applicable_for_promoted_students", label: "Promoted Students" },
                            { key: "is_optional", label: "Optional" },
                            { key: "is_applicable_for_concession", label: "Concession" },
                            { key: "is_miscellaneous", label: "Miscellaneous" }
                          ].map((item) => (
                            <label key={item.key} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={fee?.[item.key] === "1"}
                                onChange={() => handleToggle(fee, item.key)}
                                className="h-4 w-4 text-blue-600 rounded border-gray-300"
                              />
                              <span className="text-sm text-gray-700">{item.label}</span>
                            </label>
                          ))}

                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                   <span className={`
  inline-flex items-center justify-center 
  h-8 w-8 rounded-full text-sm font-semibold
  ${getCountColor(Number(fee?.fee_count))}
`}>
  {fee?.fee_count}
</span>

                      </td>


                    
                

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          {[
                            ...fee?.options,
                            // { label: "Pay Fee", action: "pay" },
                            // { label: "Download Structure", action: "download" }
                          ].map((option, idx) => (
                            <button
                              key={idx}
                              className={`cursor-pointer px-3 py-1 rounded transition
                ${option.action === "delete"
                                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                                  : option.action === "edit"
                                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                    : option.action === "pay"
                                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                                      : option.action === "download"
                                        ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              onClick={() => {
                                if (option.action === "pay") return handlePayFee(option, fee);
                                if (option.action === "download") return handleDownloadStructure(fee);
                                return handleActionClick(option, fee);
                              }}
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
      </div >

    </>

  );
};

export default FeeTpes;