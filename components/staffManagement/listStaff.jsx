'use client';

import { List, User, MoreVertical, GraduationCap, School, User2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import StaffTable from "./StaffTable";
import StaffFilterPanel from "./FilterPanel";
import StaffFiltersSummary from "./filtersSummary";
import Header from "./Header";
import { getSessionCache } from "../../utils/sessionCache";
import { useStaff } from "../../controllers/staff";

export const StaffList = ({
  setActiveTab,
  setSelectedStaff

}) => { 


  const Context = getSessionCache("dashboardContext");


  const [staff, setStaff] = useState([]);

  const [selectedData, setSelectedData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [openMenu, setOpenMenu] = useState(null);
  const [viewMode, setViewMode] = useState('overview');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
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



  // console.log(Context,'Context');
  const [filters, setFilters] = useState({
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
    appType: ""
  });

  const { getStaff, stadffData, isLoading } = useStaff()


  const fetchData = async () => {
    try {
      const rawParams = {
        user_title_id: filters?.title || undefined,
        is_allowed_for_admin_access: filters.status.includes("Allowed for Admin Accesss") ? true : undefined,
        has_account: filters.status.includes("Has Account") ? true : undefined,
        receive_daily_attendance_notification: filters.status.includes("Receive Daily Notification") ? true : undefined,
        join_time: filters.joinedDate || undefined,
        name: filters.name || undefined,
        mother_name: filters.motherName || undefined,
        father_name: filters.fatherName || undefined,
        phone: filters.mobile || undefined,
        gender: filters.gender || undefined,
        emergency_contact_number: filters.emergencyContact || undefined,
        school_designation_ids: filters.designations?.length > 0 ? filters.designations : undefined,
      };

      // ✅ Remove undefined, null, empty string, or empty array values
      const params = Object.fromEntries(
        Object.entries(rawParams).filter(
          ([_, v]) =>
            v !== undefined &&
            v !== null &&
            v !== "" &&
            !(Array.isArray(v) && v.length === 0)
        )
      );

      // 🔹 Call API with only valid params
      const data = await getStaff(Context?.profileId, Context?.session, params);

      setStaff(data?.data?.data?.results?.users || []);
      setIsFilterPanelOpen(false)
    } catch (err) {
      console.error("❌ Failed to fetch staff data:", err);
    }
  };




  // console.log(filters);

  useEffect(() => {
    fetchData();
    // if (filters.depositStartDate && filters.depositEndDate) {
    // }
  }, [
    filters.joinedDate,
    filters.status,
    filters?.title,
    filters?.name,
    filters?.isSearch,
    filters?.designations?.length,
    filters?.gender,
    filters?.appType,
  ]);


  // console.log('filters =============', filters?.gender);




  const [sort, setSort] = useState({
    field: "name",
    direction: "asc"
  });
  const [filteredData, setFilteredData] = useState([]);



  const config = getSessionCache("dashboardConfig");


  const menuRef = useRef(null);

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
    return filters?.status?.length +filters?.designations?.length + (filters?.appType ? 1 : 0) + (filters?.gender ? 1 : 0) + (filters?.joinedDate ? 1 : 0) + (filters?.name ? 1 : 0) + (filters?.title ? 1 : 0) + (filters?.motherName ? 1 : 0) + (filters?.fatherName ? 1 : 0) + (filters?.mobile ? 1 : 0) + (filters?.emergencyContact ? 1 : 0);
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


  // console.log('---- staff ----', staff);

  return (
    <>



      <Header
        headerTitle={"Staff Management"}
        headerIcon={<User2 />}
        toggleFilterPanel={toggleFilterPanel}
        getFilterCount={getFilterCount}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <StaffFiltersSummary
        filters={filters}
        toggleFilter={toggleFilter}
        clearFilters={clearFilters}
      />

      <StaffFilterPanel
        setFilters={setFilters}
        filters={filters}
        config={config}
        isFilterPanelOpen={isFilterPanelOpen}
        staffStatus={staffStatus}
        accountStatus={accountStatus}
        toggleFilter={toggleFilter}

      />



      <StaffTable
        columns={['Created By', 'Designation', 'Class & Admin Access', ' Phone', 'Action']}
        staffs={staff}
        handleClassClick={handleRowClick}
        isLoading={isLoading}


        setFilters={setFilters}
        filters={filters}

      />

    </>
  );
};