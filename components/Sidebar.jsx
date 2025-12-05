import SchoolBadgeCard from "./ui/card/SchoolBadgeCard";
import { TbLayoutSidebarRightExpand } from "react-icons/tb";
import { ChevronDown, ChevronRight, Star, } from 'lucide-react';
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
// ===============================================================

// Navigation menu structure based on your PHP code
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
    name: "ERP MANAGEMENT",
    icon: <Image
      src="/icons/erp.png"
      alt="Standards Icon"
      width={20}
      height={20}
      className="w-8 h-8"
    />,
    subMenu: [
      {
        name: "Setup",
        url: "/dashboard/erp-management",
        quickLink: true
      },
      { name: "Images", url: "/client/images" },
      { name: "Permissions", url: "/client/permissions", quickLink: true },
      { name: "Staff Usage Report", url: "/staff-report" }
    ]
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
        name: "All Standards",
        url: "/dashboard/standard-management",

      },
      { name: "All Classes", url: "/classes" },
      { name: "Class Details", url: "/class-details" },
      { name: "Bulk Promotion", url: "/bulk-promotion" }
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
    />, subMenu: [
      {
        name: "All Students",
        url: "/dashboard/student-management",

      },


      { name: "Add Student", url: "/add-student", quickLink: true },

      { name: "Houses", url: "/dashboard/student-management?tab=houses" },

      { name: "Download Student Data", url: "/student-downloads", quickLink: true },

      { name: "Parents", url: "/student-parents" },

      { name: "Birthdays", url: "/birthdays" }

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
        url: "/dashboard/staff-management",
      },
      { name: "Add Staff", url: "/add-staff", quickLink: true },
      { name: "Departments", url: "/departments", quickLink: true },
      { name: "School Roles", url: "/school-roles", quickLink: true },
      { name: "Subject Class Mapping", url: "/subject-mapping", quickLink: true }
    ]
  },
  // {
  //   name: "REPORT CARD",
  //   icon: <Image
  //     src="/icons/report_card.png"
  //     alt="Standards Icon"
  //     width={20}
  //     height={20}
  //     className="w-8 h-8"
  //   />, subMenu: [
  //     {
  //       name: "Subjects",
  //       url: "/dashboard/report-cards",
  //       quickLink: true
  //     },
  //     { name: "Grades", url: "/grades", quickLink: true },
  //     { name: "Exams", url: "/exams", quickLink: true },
  //     { name: "Enter Marks", url: "/enter-marks", quickLink: true },
  //     { name: "Report Card Formats", url: "/report-formats", quickLink: true }
  //   ]
  // },
  // {
  //   name: "ONLINE EXAM",
  //   icon: <Image
  //     src="/icons/online_exam.png"
  //     alt="Standards Icon"
  //     width={20}
  //     height={20}
  //     className="w-8 h-8"
  //   />, subMenu: [
  //     { name: "View Quizzes", url: "/quizzes", quickLink: true }
  //   ]
  // },
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
      { name: "Daily Report", url: "/attendance-report", quickLink: true },
      { name: "Download Report", url: "/download-attendance" },
      { name: "Monthly Average", url: "/monthly-attendance" }
    ]
  },
  // {
  //   name: "SMS CIRCULAR",
  //   icon: <Image
  //     src="/icons/sms_circular.png"
  //     alt="Standards Icon"
  //     width={20}
  //     height={20}
  //     className="w-8 h-8"
  //   />, subMenu: [
  //     { name: "View Notices", url: "/notices", quickLink: true },
  //     { name: "Send SMS Circular", url: "/send-notice", quickLink: true },
  //     { name: "Notice Types", url: "/notice-types" }
  //   ]
  // },
  // {
  //   name: "HOMEWORK MESSAGE",
  //   icon: <Image
  //     src="/icons/homework_message.png"
  //     alt="Standards Icon"
  //     width={20}
  //     height={20}
  //     className="w-8 h-8"
  //   />, subMenu: [
  //     { name: "View Homework", url: "/homework", quickLink: true },
  //     { name: "Send Homework", url: "/send-homework", quickLink: true }
  //   ]
  // },
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
      { name: "Mark Student Fees", url: "/dashboard/mark-fees", quickLink: true },
      { name: "Fee Summary", url: "/dashboard/fee-summary", quickLink: true },
      { name: "Fee Defaulters", url: "/fee-defaulters" },
      { name: "Variable Fees Students", url: "/dashboard/variable-fee", quickLink: true },
      { name: "Transport Locations", url: "/dashboard/locations" }
    ]
  },
  // {
  //   name: "TRANSPORT MANAGEMENT",
  //   icon: <Image
  //     src="/icons/gps.png"
  //     alt="Standards Icon"
  //     width={20}
  //     height={20}
  //     className="w-8 h-8"
  //   />, subMenu: [
  //     { name: "School Buses", url: "/school-buses" },
  //     { name: "Transport Locations", url: "/locations" },
  //     { name: "School Bus Attendance", url: "/bus-attendance" }
  //   ]
  // },
  // {
  //   name: "ID CARD",
  //   icon: <Image
  //     src="/icons/id_card.png"
  //     alt="Standards Icon"
  //     width={20}
  //     height={20}
  //     className="w-8 h-8"
  //   />, subMenu: [
  //     { name: "Download ID Card", url: "/id-card" },
  //     { name: "Upload ID Card", url: "/upload-id-card" },
  //     { name: "Staff ID Card", url: "/staff-id-cards" }
  //   ]
  // },
  // {
  //   name: "LIBRARY MANAGEMENT",
  //   icon: <Image
  //     src="/icons/online_exam.png"
  //     alt="Standards Icon"
  //     width={20}
  //     height={20}
  //     className="w-8 h-8"
  //   />, subMenu: [
  //     {
  //       name: "View Libraries",
  //       url: "/dashboard/online-library",

  //     },
  //     { name: "View Books", url: "/books" },
  //     { name: "Book Issues", url: "/book-issues" }
  //   ]
  // },
  // {
  //   name: "GALLERY",
  //   icon: <Image
  //     src="/icons/gallery.png"
  //     alt="Standards Icon"
  //     width={20}
  //     height={20}
  //     className="w-8 h-8"
  //   />, subMenu: [
  //     { name: "Album", url: "/album", quickLink: true },
  //     { name: "Photo", url: "/photo", quickLink: true }
  //   ]
  // }
];

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
  const toggleMenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
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
          {menuItems.map((item, index) => (
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
          ))}
        </nav>

        {/* <UserProfile /> */}
      </div>
    </div>
  );
}
// ===============================================================
