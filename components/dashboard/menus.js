'use client'
import React, { useEffect, useState, useRef } from 'react';
import {
  LayoutDashboard,
  Settings,
  GraduationCap,
  Users,
  UserCheck,
  FileText,
  Calculator,
  MessageSquare,
  BookOpen,
  CreditCard,
  Bus,
  CreditCard as IdCardIcon,
  Smartphone,
  Calendar,
  Library,
  FileImage,
  School,
  Album,
  Headphones,
  Video,
  Bell,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Search,
  Plus,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Star,
  Building
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SiGoogleclassroom, SiWeightsandbiases } from 'react-icons/si';
import { getSessionCache, setSessionCache } from '../../utils/sessionCache';
import { BiMobile } from 'react-icons/bi';
import SchoolBadgeCard from '../ui/card/SchoolBadgeCard';
import { getUserDashboardData } from '../../api/dashboard';
import Layout from '../../layouts/Layout';
import Image from "next/image";
import Loader from '../../components/ui/status/Loader';
import FeeCollectionChart from './FeeCollectionChart';
import UpcomingEvent from './events';
import TodaySummary from './todaySummary';



const DashboardMenus = ({
  cookyGuid,
  cookyId,

}) => {

  const router = useRouter();
  const Context = getSessionCache("dashboardContext");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const guid = localStorage.getItem('guid');
      if (!guid || Context == null) {
        router.replace('/login');
      }
    }
  }, [router]);


  // console.log("✅dashboardData", dashboardData);
  const [loading, setLoading] = useState(false)
  const [selectedSession, setSelectedSession] = useState('')
  const [dashboardData, setDashboardData] = useState([])


  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  // console.log('dashboardData', dashboardData);
  // useEffect(() => {
  //   setSessionCache("dashboardConfig", dashboardData?.results);
  //   console.log("✅ Cached dashboardConfig in sessionStorage");

  // }, []);





  // console.log('====dashboar f config =====', config);

  const getDashboardStats = (standards, staffCount, todayAttendance) => {
    if (!standards || standards.length === 0) return [];

    // 🔹 Total students across all standards & classes
    const totalStudents = standards.reduce((sum, std) => {
      return (
        sum +
        std.classes.reduce((clsSum, cls) => clsSum + (cls.students?.length || 0), 0)
      );
    }, 0);


    const totalStaff = standards.reduce((sum, std) => {
      return (
        sum +
        std.classes.length
      );
    }, 0);



    // 🔹 Active classes (all sections combined)
    const activeClasses = standards.reduce(
      (sum, std) => sum + (std.classes?.length || 0),
      0
    );

    return [
      {
        label: "Total Students",
        value: totalStudents.toLocaleString(),
        icon: <GraduationCap className="w-9 h-9" />,
        color: "text-blue-600",
      },
      {
        label: "Staff Members",
        value: totalStaff.toLocaleString(),
        icon: <UserCheck className="w-9 h-9" />,
        color: "text-green-600",
      },
      {
        label: "Active Classes",
        value: activeClasses.toLocaleString(),
        icon: <Building className="w-9 h-9" />,
        color: "text-purple-600",
      },
      {
        label: "App Users ",
        value: `${dashboardData?.results?.percentage_of_app_users}%`,
        icon: <BiMobile className="w-9 h-9" />,
        color: "text-orange-600",
      },
    ];
  };

  const stats = getDashboardStats(dashboardData?.results?.standards, 89, 94);

  const toggleMenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };





  const quickActions = [
    {
      title: "Standards Management",
      icon: (
        <Image
          src="/icons/standard_managment.png"
          alt="Standards Icon"
          width={20}
          height={20}
          className="w-16 h-16"
        />
      ),
      color: "bg-yellow-100",
      url: "/dashboard/standard-management",
      features: [
        {
          name: "All  Standard",
          url: "/dashboard/standard-management",
        },
        {
          name: "All  Classes",
          url: "/dashboard/standard-management",
        },
      ]




      // features: ["Add Staff", "View Departments"]
    },
    {
      title: "Student Management",
      icon: (
        <Image
          src="/icons/student_managment.png"
          alt="Students Icon"
          width={20}
          height={20}
          className="w-16 h-16"
        />
      ),
      color: "bg-yellow-100",
      url: "/dashboard/student-management",
      features: [
        {
          name: "All Student",
          url: "/dashboard/student-management",
        },
        {
          name: "Add Students",
          url: "/dashboard/student-management",
        },
      ]






    },
    {
      title: "Attendance Management",
      icon: (
        <Image
          src="/icons/mobiTENDANCE.png"
          alt="Attendance Icon"
          width={20}
          height={20}
          className="w-16 h-16"
        />
      ),
      color: "bg-yellow-100",
      url: "/dashboard/attendance-management",
      features: [
        {
          name: "Mark Attendance",
          url: "/dashboard/attendance-management",
        },
        {
          name: "Attendance Reports",
          url: "/dashboard/attendance-report",
        },
      ]
    },
    {
      title: "Staff Management",
      icon: (
        <Image
          src="/icons/staff_management.png"
          alt="Staff Icon"
          width={20}
          height={20}
          className="w-16 h-16"
        />
      ),
      color: "bg-yellow-100",
      url: "/dashboard/staff-management",

      features: [
        {
          name: "Add Staff",
          url: "/dashboard/staff-management",
        },
        {
          name: "View All Staff",
          url: "/dashboard/staff-management",
        },
      ]




    },
    {
      title: "Report Cards",
      icon: (
        <Image
          src="/icons/report_card.png"
          alt="Reports Icon"
          width={20}
          height={20}
          className="w-16 h-16"
        />
      ),
      color: "bg-yellow-100",
      url: "/dashboard/report-cards",
      features: [
        {
          name: "Design Reports",
          url: "/dashboard/report-cards",
        },
        {
          name: "View Reports",
          url: "/dashboard/report-cards",
        },
      ]



    },
    {
      title: "Fee Management",
      icon: (
        <Image
          src="/icons/online_fee.png"
          alt="Fee Icon"
          width={20}
          height={20}
          className="w-16 h-16"
        />
      ),
      color: "bg-yellow-100",
      url: "/dashboard/fee-summary",

      features: [
        {
          name: "View Fees",
          url: "/dashboard/view-fee",
        },
        {
          name: "View Summary",
          url: "/dashboard/fee-summary",
        },
      ]

    }
  ];

  const recentActivities = [
    { title: "New student admission completed", time: "2 hours ago", type: "student", icon: <Users className="w-4 h-4" /> },
    { title: "Monthly attendance report generated", time: "4 hours ago", type: "report", icon: <FileText className="w-4 h-4" /> },
    { title: "Fee payment of ₹15,000 received", time: "6 hours ago", type: "fee", icon: <DollarSign className="w-4 h-4" /> },
    { title: "Parent-teacher meeting scheduled", time: "1 day ago", type: "meeting", icon: <Calendar className="w-4 h-4" /> },
    { title: "Report cards published for Class 10", time: "2 days ago", type: "report", icon: <GraduationCap className="w-4 h-4" /> }
  ];

  // if (loading) (< Loader />)
  return (

    <Layout
      setSelectedSession={setSelectedSession}
    >
      {!loading ? <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        {/* <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
       




        <div className='p-4'>

          <SchoolBadgeCard
            schoolName={'Demo School'}
            schoolBranch={'ankiura'}
            schoolImage={'props?.config?.school?.img_logo'}
            smsBalance={1}
          />
        </div>
        <nav className="mt-6 px-3 overflow-y-auto h-full pb-20">
          {menuItems.map((item, index) => (
            <div key={index} className="mb-1">
              <div
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${item.active
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
                onClick={() => item.subMenu && toggleMenu(item.name)}
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
      </div> */}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          {/* Header */}
          {/* <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                className="lg:hidden text-gray-600"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, Admin</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </header> */}
          {/* <Navbar /> */}

          {/* Dashboard Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* {dashboardStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))} */}
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`${stat.color}`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick Actions */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                    <Plus className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {quickActions.map((action, index) => (
                      <button
                        // onClick={() => router.push(action.url)}
                        key={index}
                        className="cursor-pointer flex flex-col items-center p-6 rounded-2xl border border-yellow-100 bg-white hover:shadow-md hover:border-blue-200 transition-all duration-300 group"
                      >
                        {/* Icon container */}
                        <div
                          className={`bg-gradient-to-br from-yellow-100 to-yellow-300 flex items-center justify-center w-20 h-20 rounded-2xl mb-4 group-hover:scale-110 group-hover:shadow-md shadow-[#d4b850] transition-all duration-300`}
                        >
                          {action.icon}
                        </div>

                        {/* Title */}
                        <span className="text-sm font-semibold text-gray-800 text-center group-hover:text-blue-600 transition-colors">
                          {action.title}
                        </span>

                        {/* Features List */}
                        {action.features && (
                          <div className="mt-4 flex flex-wrap gap-2 justify-center">
                            {action.features.map((feature, fIdx) => (
                              <span
                                onClick={() => router.push(feature.url)}

                                key={fIdx}
                                className="px-3 py-1.5 rounded-full text-xs font-medium
                   bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100
                   text-blue-700 shadow-sm
                   hover:from-blue-200 hover:via-indigo-200 hover:to-purple-200
                   hover:shadow-md transition-all duration-300 cursor-pointer"
                              >
                                {feature?.name}
                              </span>
                            ))}
                          </div>
                        )}

                      </button>
                    ))}
                  </div>


                </div>

                {/* -================= Chart/Analytics -========================= */}



                <FeeCollectionChart />



              </div>

              {/* Sidebar Content */}
              <div className="space-y-6">



                <UpcomingEvent
                  context={Context}
                />






                <TodaySummary />


              </div>
            </div>
          </main>
        </div>

        {/* Mobile Overlay */}
        {
          sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )
        }
      </div > : <Loader />}
    </Layout>
  );
};

export default DashboardMenus;