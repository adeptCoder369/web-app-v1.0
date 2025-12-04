'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { getSessionCache } from '../../utils/sessionCache';
import FeeTypeDetail from '../ui/drawer/FeeTypeDetail';
import Loader from '../ui/status/Loader';
import HeaderViewFee from './HeaderViewFee';
import ViewFeeFiltersSummary from './ViewFeeFiltersSummary';
import VariableFeeFilterPanel from './VariableFeeFilterPanel';
import { ArrowRight, BarChart3, Calendar, Clock, Receipt, ReceiptIndianRupee, Sparkles, User2 } from 'lucide-react';
import { getFee, getFeeTypes, getFeeTypeStudents, removeStudentFromFeeApi } from '../../api/fees';
import AddFeeTypeStudents from './AddFeeTypeStudents';
import { FaTrash } from 'react-icons/fa';
import ConfirmationDialogueBox from '../ui/status/Confirmation';


const VariableFee = ({ }) => {
  const [removeVariableFee, setRemoveVariableFee] = useState(false);

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
  const [markFeeForStudents, setMarkFeeForStudents] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStandard, setSelectedStandard] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const feesPerPage = 10;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [variableFee, setVariableFee] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [fees, setFees] = useState([]);
  const [feeTypes_, setFeeTypes_] = useState([]);

  // ==================================================================================================
  const fetchFee = async () => {


    const pageSize = 1
    try {
      const res = await getFee(
        context.profileId,
        context.session,
        currentPage,
        pageSize,
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
      // console.log('res -------', res);
      setFees(res?.data?.results?.fees || []);
    } catch (error) {
      console.error("Error fetching variableFee:", error);
    }
  };


  const fetchFeeTypes = async () => {


    const pageSize = 1
    const limit = 20
    try {
      const res = await getFeeTypes(
        context?.profileId,
        context?.session,
        pageSize,
        limit
      );
      console.log('res____------', res);

      setFeeTypes_(res?.data?.results?.fee_types || []);
    } catch (error) {
      console.error("Error fetching variableFee:", error);
    }
  };

  const fetchStudentVariableFeeTypes = async () => {


    const pageSize = 1
    try {
      const res = await getFeeTypeStudents(
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
      setVariableFee(res?.data?.results?.students)
    } catch (error) {
      console.error("Error fetching variableFee:", error);
    }
  };


  useEffect(() => {
    if (!context?.profileId || !context?.session) return;


    fetchStudentVariableFeeTypes();
    // fetchFee()
    // fetchFeeTypes()
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


  useEffect(() => {


    fetchFeeTypes()
    fetchFee()

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
  // Extract unique standards from variableFee
  const standards = useMemo(() => {
    if (!variableFee) return [];
    const uniqueStandards = [...new Set(variableFee.map(fee => fee?.standard?.name))];
    return uniqueStandards.filter(Boolean).sort();
  }, [variableFee]);

  // Extract unique fee types
  const feeTypes = useMemo(() => {
    if (!variableFee) return [];
    const types = [...new Set(variableFee.map(fee => fee?.type))];
    return types.filter(Boolean);
  }, [variableFee]);

  // Filter variableFee based on selected criteria
  const filteredFees = useMemo(() => {
    if (!variableFee) return [];
    return variableFee.filter(fee => {
      const matchesStandard = !selectedStandard || fee?.standard?.name === selectedStandard;
      const matchesType = !selectedType || fee?.type === selectedType;
      const matchesSearch = !searchTerm || fee?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStandard && matchesType && matchesSearch;
    });
  }, [variableFee, selectedStandard, selectedType, searchTerm]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedStandard, selectedType, searchTerm]);

  // if (!variableFee || isLoading || variableFee.length === 0) {
  //   return <p className="text-center text-gray-500">No fee data available</p>;
  // }
  // const serverLimit = feesResponse?.limit || feesPerPage;
  const serverLimit = 1
  const totalPages = Math.ceil((0) / serverLimit);

  // Calculate pagination
  const indexOfLastFee = currentPage * feesPerPage;
  const indexOfFirstFee = indexOfLastFee - feesPerPage;
  const currentFees = filteredFees; // variableFee is already server-limited; filteredFees applies any lightweight client filtering

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


  const handleRemoveStudent = async () => {
    setLoading(true);
    setError(false);
    setShowSuccess(false);
    setApiResponse("");

    try {
      const payload = {
        studentId: selectedFee?.id,
        feeId: selectedFee?.fee?.id,
        feeTypeId: selectedFee?.fee_type?.id
      };

      const result = await removeStudentFromFeeApi(
        context.profileId,
        context.session,
        payload
      );

      if (result?.data?.success) {
        setShowSuccess(true);
        setApiResponse({
          message: result.data?.results?.message
        });

        setRemoveVariableFee(false);

        setTimeout(() => {
          setShowSuccess(false);
          setApiResponse("");
          // reload the whole window after success
          window.location.reload();
        }, 1500);

      } else {
        setRemoveVariableFee(false);
        setError(true);
        setApiResponse({
          status: "error",
          message: result.data?.results?.message
        });

        setTimeout(() => {
          setError(false);
          setApiResponse("");
        }, 3000);
      }

    } catch (err) {
      setError(true);
      setRemoveVariableFee(false);
      setApiResponse({
        message: "Request failed."
      });

      setTimeout(() => {
        setError(false);
        setApiResponse("");
      }, 3000);

    } finally {
      setLoading(false);
    }
  };





  if (isLoading) {
    return (<Loader />)
  }

  // ======================================================================

  return (
    <>
      {/* ================== Drawer ======================================== */}

      <button
        onClick={() => setMarkFeeForStudents(true)}
        className="cursor-pointer group relative px-6 py-2.5 bg-gradient-to-r from-accent to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 font-medium"
      >
        ⚙️ Add Fee Type Student
      </button>


      <FeeTypeDetail
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedFee={selectedFee}
        context={context}
      />

      {drawerOpen && <div onClick={() => setDrawerOpen(false)} className="fixed inset-0 bg-black-50 bg-opacity-30 z-40"></div>}


      {/* ======================================================================= */}



      <div className="space-y-6">

        {/* Search and Filters */}

        <div className="bg-white rounded-lg shadow p-6">
          {/* Header Section */}


          <HeaderViewFee
            headerTitle={"Variable Fee Type Students"}
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

          <VariableFeeFilterPanel

            setFilters={setFilters}
            filters={filters}
            config={config}
            isFilterPanelOpen={isFilterPanelOpen}
            staffStatus={staffStatus}
            accountStatus={accountStatus}
            toggleFilter={toggleFilter}
            fees={fees}
            feeTypes_={feeTypes_}
          />

        </div>


        {/* Student Fee Table */}
        {currentFees.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roll No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Standard / Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fee Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {currentFees.map((item) => (
                    <tr key={item?.id} className="hover:bg-gray-50 transition">

                      {/* Student Name */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item?.name}
                        </div>
                      </td>

                      {/* Roll No */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item?.roll_number || "N/A"}
                        </div>
                      </td>

                      {/* Standard + Class */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item?.standard?.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item?.standard?.class?.name}
                        </div>
                      </td>

                      {/* Fee */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item?.fee?.name}
                        </div>
                      </td>

                      {/* Fee Type */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item?.fee_type?.name}
                        </div>
                        <span className="text-xs text-gray-500">
                          {item?.fee_type?.category}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm font-semibold ${Number(item?.fee_type_amount) < 0
                            ? "text-red-600"
                            : "text-gray-900"
                            }`}
                        >
                          ₹{item?.fee_type_amount}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          className="cursor-pointer px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                          onClick={() => {
                            setSelectedFee(item)
                            setRemoveVariableFee(item)
                          }}
                        >
                          <FaTrash />
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No data found</p>
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
            Showing {indexOfFirstFee + 1}-{Math.min(indexOfLastFee, filteredFees.length)} of {filteredFees.length} variableFee
          </p>
        )}
      </div>


      <AddFeeTypeStudents
        open={markFeeForStudents}
        onClose={() => setMarkFeeForStudents(false)}
        config={config}
        context={context}
        selectedStudent={selectedStudent}
        setSelectedStudent={setSelectedStudent}
      />


      {removeVariableFee && (
        <ConfirmationDialogueBox
          title="Remove Student?"
          description={`Are you sure you want to remove student by "${removeVariableFee.name}"?`}
          onConfirm={handleRemoveStudent}
          onCancel={() => setRemoveVariableFee(null)}
        />
      )}
      <div className="fixed right-0 top-0 w-full sm:w-[420px] z-[60] p-4 space-y-3">

        {showSuccess && (
          <div className="relative bg-green-100 border border-green-300 text-green-800 rounded-lg px-4 py-3 shadow-md">
            <span className="font-medium">{apiResponse.message}</span>
          </div>
        )}

        {error && (
          <div className="relative bg-red-100 border border-red-300 text-red-800 rounded-lg px-4 py-3 shadow-md">
            <span className="font-medium">{apiResponse.message}</span>
          </div>
        )}

      </div>


    </>

  );
};
// ================================================================

export default VariableFee;
// ================================================================
