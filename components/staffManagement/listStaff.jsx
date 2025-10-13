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

}) => {


  const Context = getSessionCache("dashboardContext");


  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);

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






  // console.log(Context,'Context');
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
    title: "",
    depositStartDate: "",
    depositEndDate: "",
  });

  const { getStaff, stadffData, isLoading } = useStaff()


  const fetchData = async () => {
    try {
      const params = {
        // mode: filters?.paymentMode || undefined, 
        // standardId: selectedStandard !== "all" ? selectedStandard : undefined,
        // class_ids: selectedClass?.length > 0 ? selectedClass.join(",") : undefined, // ✅ fix
        // status: filterStatus !== "all" ? filterStatus : undefined,
        user_title_id: filters?.title || undefined,
        // is_promoted_student: filters.status.includes("Promoted") ? true : undefined,
        is_allowed_for_admin_access: filters.status.includes("Allowed for Admin Accesss") ? true : undefined,
        has_account: filters.status.includes("Has Account") ? true : undefined,
        receive_daily_attendance_notification: filters.status.includes("Receive Daily Notification") ? true : undefined,
        // only_deposited: filters.status.includes("Deposited") ? true : undefined,
        // depositStartDate: filters.depositStartDate,
        // depositEndDate: filters.depositEndDate
      };

      // 🔹 Call API with all filters as params
      const data = await getStaff(
        Context?.profileId,
        Context?.session,

        params
      );
      // console.log(data?.data?.data?.results, 'data');

      // let result = data?.data?.data?.results?.fee_collections || [];
      setStaff(data?.data?.data?.results?.users || []);
    } catch (err) {
      console.error("Failed to fetch fee collection data", err);
      // setFilteredData([]); // fallback
    }
  };





  useEffect(() => {
    fetchData();
    // if (filters.depositStartDate && filters.depositEndDate) {
    // }
  }, [
    filters.paymentMode,
    filters.status,
    filters?.title,
  ]);


  console.log('selectedStaff', selectedStaff);




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
    return filters.status.length;
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
        config={config}
        isFilterPanelOpen={isFilterPanelOpen}
        filters={filters}
        staffStatus={staffStatus}
        toggleFilter={toggleFilter}

      />


      {/* <StaffFiltersSummary
        filteredCount={filteredData.length}
        totalCount={staff.length}
        sort={sort}
        handleSort={handleSort}
      /> */}
      <StaffTable
        columns={['Created By', 'Subject', 'Title & Description', 'Timings', 'Info', 'Start/join', 'Action']}
        staffs={staff}
        handleClassClick={handleRowClick}
        isLoading={isLoading}

      />

    </>
  );
};