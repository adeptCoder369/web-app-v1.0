import SchoolBadgeCard from "./ui/card/SchoolBadgeCard";
import { TbLayoutSidebarRightExpand } from "react-icons/tb";
import { ChevronDown, ChevronRight, Star, } from 'lucide-react';
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
          { name: "Student Renew", url: "/class-details" },

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
        url: "/dashboard/student-management?tab=birthdays"
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
      {
        name: "View Fees",
        url: "/dashboard/fee-summary",
        quickLink: true,

      },
      { name: "Fee Summary", url: "/dashboard/fee-summary", quickLink: true },
      { name: "Variable Fees Students", url: "/dashboard/variable-fee", quickLink: true },
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
  const router = useRouter()


  const [expandedMenus, setExpandedMenus] = useState({});

  // console.log("dashboardData ========================:", props?.config?.sms_balance);

  const mapMenusToSideNav = (menus) => {
    if (!menus) return [];

    return menus.map((menu) => {
      const hasChildren = menu.children && menu.children.length > 0;
      const menuPath = `/${menu.slug}`; // Assuming top-level paths match slugs

      return {
        title: menu.name,
        _url: menu.icon_url, // Directly use the icon_url
        active:
          pathname === menuPath ||
          (hasChildren &&
            menu.children.some((child) => pathname === `/${child.slug}`)),
        path: menuPath,
        children: hasChildren
          ? menu.children.map((child) => ({
            title: child.name,
            path: `/${child.slug}`, // Assuming sub-menu paths match child slugs
          }))
          : undefined,
      };
    });
  };

  const sideNavItems = mapMenusToSideNav(props?.dashboardData?.menus);
  const toggleMenu_og = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

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
    const padding = 12 + level * 12;

    return (
      <div key={key} className="mb-1">
        <div
          className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200
        ${item.active
              ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border-r-2 border-blue-600"
              : "text-gray-700 hover:bg-gray-50"
            }`}
          style={{ paddingLeft: padding }}
          onClick={() => {
            if (hasChildren) toggleMenu(key);
            else if (item.onClick) item.onClick(item);  // Add this: call custom onClick if defined

            else router.push(item.url);
          }}
        >
          <div className="flex items-center space-x-3">
            {level === 0 && item.icon}
            <span className="text-sm">{item.name}</span>
          </div>

          {hasChildren && (
            isExpanded
              ? <ChevronDown className="w-4 h-4" />
              : <ChevronRight className="w-4 h-4" />
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1">
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
        transition-transform duration-300 transform
        fixed top-0 left-0 z-50
        lg:relative lg:translate-x-0
        ${props?.sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      <div className="flex flex-col h-full">
        <button
          className="cursor-pointer p-2 rounded-full bg-[#007aff] text-primary-text-inverse hover:bg-accent/80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent/50 w-10 h-10 mb-4"
          onClick={() => {
            props?.setSidebarOpen(!props?.sidebarOpen);
          }}
          aria-label="Toggle Sidebar"
        >
          {props?.sidebarOpen ? <TbLayoutSidebarRightExpand className="w-6 h-6" /> : null}
        </button>

        <SchoolBadgeCard
          schoolName={props?.config?.school?.full_name}
          schoolBranch={props?.config?.school?.board?.name}
          schoolImage={props?.config?.school?.img_logo}
          smsBalance={props?.config?.sms_balance?.count}
        />


        <nav className="mt-6 px-3 overflow-y-auto h-full pb-20">
          {/* {menuItems.map((item, index) => (
            <div key={index} className="mb-1">
              <div
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${item.active
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
                onClick={() => {
                  if (item.subMenu) {
                    toggleMenu(item.name)
                  } else {
                    router.push(item.url)
                  }
                }}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span className=" text-sm">{item.name}</span>
                </div>
                {item.subMenu && (
                  expandedMenus[item.name]
                    ? <ChevronDown className="w-4 h-4" />
                    : <ChevronRight className="w-4 h-4" />
                )}
              </div>

              {item.subMenu && expandedMenus[item.name] && (
                <div className="mt-2 ml-6 space-y-1">
                  {item.subMenu.map((subItem, subIndex) => (
                    <div
                      key={subIndex}
                      className="flex items-center justify-between px-3 py-2 rounded-md cursor-pointer text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                      onClick={() => {
                        router.push(subItem.url)

                      }}
                    >
                      <span className="text-sm">{subItem.name}</span>
                      {subItem.quickLink && (
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))} */}
          {menuItems.map((item, i) => renderMenu(item))}

        </nav>

        {/* <UserProfile /> */}
      </div>
    </div>
  );
}
// ===============================================================
