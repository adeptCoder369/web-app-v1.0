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
import { getSessionCache, setSessionCache, } from '../../utils/sessionCache';
import { BiMobile } from 'react-icons/bi';
import Layout from '../../layouts/Layout';
import Image from "next/image";
import Loader from '../../components/ui/status/Loader';
import FeeCollectionChart from './FeeCollectionChart';
import UpcomingEvent from './events';
import TodaySummary from './todaySummary';
import { getFeeCollectionSummary, getFeeNameWiseSummary } from '../../api/fees';

// ===================================================================
// ===================================================================



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
        name: "Configuration",
        url: "/dashboard/view-fee",
      },
      {
        name: "Summary",
        url: "/dashboard/fee-summary",
      },
      {
        name: "Period Wise",
        url: "/dashboard/period-wise-fee",
      },
    ]

  }
];


// ===================================================================
// ===================================================================


const DashboardMenus = () => {

  const router = useRouter();
  const Context = getSessionCache("dashboardContext");


  const [loading, setLoading] = useState(false)
  const [selectedSession, setSelectedSession] = useState('')
  const [dashboardData, setDashboardData] = useState([])


  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});


  const [expandedSections, setExpandedSections] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeChart, setActiveChart] = useState("overview");



  useEffect(() => {
    if (typeof window !== "undefined") {
      const guid = localStorage.getItem('guid');
      if (!guid || Context == null) {
        router.replace('/login');
      }
    }
  }, [router]);





  const fetchFeeNameWise = async () => {
    try {
      console.log('resp ---------??');
      const resp = await getFeeNameWiseSummary(Context?.profileId, Context?.session);


      console.log('resp ---------', resp?.data);

      const fetched = resp?.data || [];

      if (fetched) {
        setSessionCache("feeConfig", fetched?.results);

      }



    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const fetchFeeCollection = async () => {
    try {
      const data = await getFeeCollectionSummary(
        Context?.profileId,
        Context?.session,
      );


      console.log('resp ---------', data?.data);

      const fetched = data?.data || [];

      if (fetched) {
        
      }
    } catch (err) {
      setSessionCache("feeCollectionConfig", fetched?.results);
      console.error("Failed to fetch fee collection summary:", err);
    }
  };



  useEffect(() => {
    fetchFeeNameWise();
    fetchFeeCollection()
  }, []);








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





  return (

    <Layout
      setSelectedSession={setSelectedSession}
    >
      {!loading ? <div className="flex h-screen bg-gray-50">

        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">

          <main className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

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
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                    <Plus className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {quickActions?.map((action, index) => (
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