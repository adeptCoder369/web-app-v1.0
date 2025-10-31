'use client'
import React, { useEffect, useState, useRef } from 'react';
import { GraduationCap, UserCheck, Plus, Building } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getSessionCache, setSessionCache, } from '../../utils/sessionCache';
import { BiMobile } from 'react-icons/bi';
import Layout from '../../layouts/Layout';
import Image from "next/image";
import Loader from '../../components/ui/status/Loader';
import FeeCollectionChart from './FeeCollectionChart';
import UpcomingEvent from './events';
import TodaySummary from './todaySummary';
import QuickActions from './QuickActions';
import { getFeeCollectionSummary, getFeeNameWiseSummary } from '../../api/fees';
// ====================================================================================
 
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


      console.log('feeConfig RESP ---------', resp?.data);

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

      console.log('feeCollectionConfig RESP ---------', data?.data);


      const fetched = data?.data || [];

      if (fetched) {

        setSessionCache("feeCollectionConfig", fetched?.results);
      }
    } catch (err) {
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




                <QuickActions />

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