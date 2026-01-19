import SchoolBadgeCard from "./ui/card/SchoolBadgeCard";
import { TbLayoutSidebarRightExpand } from "react-icons/tb";
import { ChevronDown, ChevronRight, Star, } from 'lucide-react';
import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { getSessionCache } from "../utils/sessionCache";
// ===============================================================
const context = getSessionCache("dashboardContext");

const menuItems = [
  {
    name: "DASHBOARD",
    icon: <Image
      src="/icons/online_fee.png"
      alt="Standards Icon"
      width={20}
      height={20}
      className="w-8 h-8"
    />,
    url: "/dashboard",
    active: true
  },

  {
    name: "STANDARD MANAGEMENT",
    icon: <Image
      src="/icons/standard_managment.png"
      alt="Standards Icon"
      width={20}
      height={20}
      className="w-8 h-8"
    />,
    subMenu: [
      {
        name: "All Standards & Classes",
        url: "/dashboard/standard-management",

      },
      // {
      //   name: "All Classes",
      //   url: "/dashboard/standard-management",


      // },
      {
        name: "Class Details",
        subMenu: [
          {
            name: "All",
            url: "/class-details",
            onClick: (item) => handleDownload(item, 'classDetailsAll')

          },
          // {
          //   name: "With App Users",
          //   url: "/class-details",
          //   onClick: (item) => handleDownload(item, 'classDetailsWithAppUsers')

          // },

          // {
          //   name: "More Levels",
          //   subMenu: [
          //     { name: "Level 3 Item A", url: "/l3/a" },
          //     {
          //       name: "Level 3 deeper",
          //       subMenu: [
          //         { name: "Level 4 Item A", url: "/l4/a" }
          //       ]
          //     }
          //   ]
          // }
        ]
      },


      {
        name: "Class Change",
        subMenu: [
          {
            name: ".xls",

            url: "/class-details",
            onClick: (item) => handleDownload(item, 'classCHangeXls')

          },
          {
            name: "Student Renew",
            url: "/dashboard/standard-management",
          },

        ]
      },
      {
        name: "Shuffle Sections",
        url: "/dashboard/standard-management",


      },

    ]
  },
  {
    name: "STUDENT MANAGEMENT",
    icon: <Image
      src="/icons/student_managment.png"
      alt="Standards Icon"
      width={20}
      height={20}
      className="w-8 h-8"
    />,
    subMenu: [
      {
        name: "All Students",
        url: "/dashboard/student-management?tab=list",
      },
      {
        name: "Add Student",
        url: "/dashboard/student-management?tab=add",
        quickLink: true
      },

      {
        name: "Houses",
        url: "/dashboard/student-management?tab=houses"
      },
      // {
      //   name: "Uploads",
      //   url: "/dashboard/student-management?tab=birthdays"
      // },
      {
        name: "Download Student Data",
        url: "/dashboard/student-management/downloads"
      },
      // {
      //   name: "Verify Image",
      //   url: "/dashboard/student-management?tab=birthdays"
      // },
      {
        name: "Proof Reading",
        url: "/dashboard/student-management/proof-reading"
      },
      {
        name: "Parents",
        url: "/dashboard/student-management?tab=parents"
      },
      {
        name: "Siblings",
        url: "/dashboard/student-management?tab=siblings"
      },
      {
        name: "Birthdays",
        url: "/dashboard/student-management?tab=birthdays"
      },


    ]
  },
  {
    name: "STAFF MANAGEMENT",
    icon: <Image
      src="/icons/staff_management.png"
      alt="Standards Icon"
      width={20}
      height={20}
      className="w-8 h-8"
    />, subMenu: [
      {
        name: "All Staff",
        url: "/dashboard/staff-management?tab=list",
      },
      {
        name: "Add Staff",
        url: "/dashboard/staff-management?tab=add",
        quickLink: true
      },

      {
        name: "Departments",
        url: "/dashboard/staff-management?tab=departments",
        quickLink: false
      },

      {
        name: "School Roles",
        url: "/dashboard/staff-management?tab=schoolRoles",
        quickLink: false
      },

      {
        name: "School Designations",
        url: "/dashboard/staff-management?tab=schoolDesignation",
        quickLink: false
      },
      {
        name: "Titles",
        url: "/dashboard/staff-management?tab=schoolTitles",
        quickLink: false
      },

      {
        name: "Subject Class Mapping",
        url: "/dashboard/staff-management?tab=subjectClassMapping",
        quickLink: true
      },
      {
        name: "Revoke School Designation Permission",
        url: "/dashboard/staff-management?tab=designationPermission",
        quickLink: false
      },

    ]
  },

  {
    name: "MOBITENDANCE",
    icon: <Image
      src="/icons/mobiTENDANCE.png"
      alt="Standards Icon"
      width={20}
      height={20}
      className="w-8 h-8"
    />, subMenu: [
      {
        name: "Take Attendance",
        url: "/dashboard/attendance-management",
        quickLink: true
      },

    ]
  },

  {
    name: "ONLINE FEE",
    icon: <Image
      src="/icons/online_fee.png"
      alt="Standards Icon"
      width={20}
      height={20}
      className="w-8 h-8"
    />, subMenu: [
      { name: "View Fees", url: "/dashboard/view-fee", quickLink: true, },
      { name: "Mark Student Fees", url: "/dashboard/mark-student-fee", quickLink: true },
      { name: "Fee Summary", url: "/dashboard/fee-summary", quickLink: true },
      { name: "Datewise Fee Collection Summary", url: "/dashboard/datewise-fee-summary", quickLink: true },
      { name: "Sessionwise Fee Collection Summary", url: "/dashboard/datewise-fee-summary", quickLink: true },
      { name: "Standardwise Fee Collection Summary", url: "/dashboard/fee-summary", quickLink: true },
      { name: "Periodwise Fee Collection Summary", url: "/dashboard/fee-summary", quickLink: true },
      { name: "Payouts", url: "/dashboard/payouts", quickLink: true },
      { name: "Concession/Optional Fees", url: "/dashboard/fee-concession", quickLink: true },
      { name: "Variable Fees Students", url: "/dashboard/variable-fee", quickLink: true },
      { name: "Late Fees ", url: "/dashboard/late-fee", quickLink: true },
      { name: "Wave Off Late Fees", url: "/dashboard/waive-off-late-fee", quickLink: true },
      { name: "Fee Defaulter", url: "/dashboard/fee-defaulter", quickLink: true },
      { name: "View School Buses", url: "/dashboard/school-buses", quickLink: true },
      { name: "Transport Location", url: "/dashboard/transport-location", quickLink: true },
      { name: "Fee Types ", url: "/dashboard/fee-types", quickLink: true },
      { name: "Fee Type Students ", url: "/dashboard/fee-type-students", quickLink: true },
      { name: "Fee Category Concession", url: "/dashboard/fee-category-concession", quickLink: true },

      {
        name: "Student Ledger",
        subMenu: [
          {
            name: "Soft Copy (.xls)",

            url: "/class-details",
            onClick: (item) => handleDownload(item, 'classCHangeXls')

          }

        ]
      },
    ]
  },

];

const downloadRoutes = {
  classDetailsAll: classId => {
    const portal = getPortalParams();

    return `https://portal.infoeight.com/class/folder`
      + `?client_id=${portal.client_id}`
      + `&guid=${portal.guid}`
      + `&logged_in_user_account_id=${portal.logged_in_user_account_id}`
      + `&user_account_id=${portal.user_account_id}`
      + `&id=${classId}`;
  },

  classDetailsWithAppUsers: classId => {
    const portal = getPortalParams();

    return `https://portal.infoeight.com`

      + `/client/classes?&app_users=1`
      ;
  },

  classCHangeXl: classId => {
    const portal = getPortalParams();

    return `https://portal.infoeight.com`

      + `/client/class-change?id=${portal.client_id}&format=SOFT COPY`
      ;
  },


  classCHangeXls: classId => {
    const portal = getPortalParams();

    return `https://portal.infoeight.com`

      + `/client/download-students-image?id=${portal.client_id}`
      ;
  },




};
const getPortalParams = () => {
  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");


  return {
    client_id: context?.session,
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: context?.profileId,
  };
};

const handleDownload = (classData, action) => {

  console.log('classData, action=======', classData, action);


  const classId = classData.id;

  const routeFn = downloadRoutes[action];
  if (!routeFn) {
    console.warn("Unknown download action:", action);
    return;
  }

  const url = routeFn(classId);
  window.open(url, "_blank");
};
// ===============================================================

export default function Sidebar(props) {
  const router = useRouter();
  const pathname = usePathname(); // Get current URL path
  const [expandedMenus, setExpandedMenus] = useState({});

  // Helper to check if a menu or any of its children are active
  const isItemActive = (item) => {
    if (item.url === pathname) return true;
    if (item.subMenu) {
      return item.subMenu.some(sub => isItemActive(sub));
    }
    return false;
  };

  // Automatically expand parent menus if a child is active on initial load
  useEffect(() => {
    const newExpanded = { ...expandedMenus };
    menuItems.forEach(item => {
      if (item.subMenu && isItemActive(item)) {
        newExpanded[`${item.name}-0`] = true;
        // Check second level
        item.subMenu.forEach(sub => {
          if (sub.subMenu && isItemActive(sub)) {
            newExpanded[`${sub.name}-1`] = true;
          }
        });
      }
    });
    setExpandedMenus(newExpanded);
  }, [pathname]); // Runs when route changes

  const toggleMenu = (key) => {
    setExpandedMenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderMenu = (item, level = 0) => {
    const key = `${item.name}-${level}`;
    const isExpanded = expandedMenus[key];
    const hasChildren = item.subMenu && item.subMenu.length > 0;

    // HIGHLIGHT LOGIC:
    // Direct match for child items, or "contains active child" for parent items
    const isActive = item.url === pathname;
    const containsActiveChild = hasChildren && isItemActive(item);

    const padding = 12 + level * 12;

    return (
      <div key={key} className="mb-1">
        <div
          className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200
                    ${(isActive || (containsActiveChild && !isExpanded))
              ? "bg-blue-600 text-white shadow-md shadow-blue-200" // Active style
              : isActive
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100" // Inactive style
            }`}
          style={{ paddingLeft: padding }}
          onClick={() => {
            if (hasChildren) {
              toggleMenu(key);
            } else if (item.onClick) {
              item.onClick(item);
            } else {
              router.push(item.url);
            }
          }}
        >
          <div className="flex items-center space-x-3">
            {/* Only show original icon for top level, or smaller dot for sub-levels */}
            {level === 0 ? (
              <div className={`${(isActive || containsActiveChild) ? "brightness-0 invert" : ""}`}>
                {item.icon}
              </div>
            ) : (
              <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-white" : "bg-gray-400"}`} />
            )}
            <span className={`text-sm font-medium ${isActive ? "font-bold" : ""}`}>
              {item.name}
            </span>
          </div>

          {hasChildren && (
            isExpanded
              ? <ChevronDown className="w-4 h-4 opacity-70" />
              : <ChevronRight className="w-4 h-4 opacity-70" />
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.subMenu.map((sub, idx) => (
              <div key={idx}>
                {renderMenu(sub, level + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
     <div
      className={`text-[#ffff] w-64 sm:w-74 h-full bg-[#f3f9ff] p-4 flex flex-col justify-between
            transition-transform duration-300 transform fixed top-0 left-0 z-50 lg:relative
            ${props?.sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="flex flex-col h-full">
        <button
          className="cursor-pointer p-2 rounded-full bg-[#007aff] text-white hover:bg-blue-700 transition-all w-10 h-10 mb-4 flex items-center justify-center"
          onClick={() => props?.setSidebarOpen(!props?.sidebarOpen)}
        >
          {props?.sidebarOpen && <TbLayoutSidebarRightExpand className="w-6 h-6" />}
        </button>

        <SchoolBadgeCard
          schoolName={props?.config?.school?.full_name}
          schoolBranch={props?.config?.school?.board?.name}
          schoolImage={props?.config?.school?.img_logo}
          smsBalance={props?.config?.sms_balance?.count}
        />

        <nav className="mt-6 px-1 overflow-y-auto h-full pb-20 custom-scrollbar">
          {menuItems.map((item) => renderMenu(item))}
        </nav>
        <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f3f9ff;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #007aff;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #0056b3;
                }
            `}</style>
      </div>
    </div>
  );
}
// ===============================================================
