'use client'
import React, { useState, useEffect } from 'react';
import { CalendarDays, Users, CheckCircle, XCircle, MinusCircle, Send, TrendingUp, Clock, UserCheck, AlertCircle, School, ChevronDown, Plus, ReceiptTextIcon } from 'lucide-react';
import Layout from '../../layouts/Layout';
import { useAttendance, useAttendanceReport, } from '../../controllers/attendance';
import { markAttendance } from '../../api/attendance';
import Loader from '../ui/status/Loader';
import { useAuthContext } from '../../context/auth';
import { getSessionCache } from '../../utils/sessionCache';
import { Breadcrumbs } from '../ui/Breadcrumb/breadcrumb';
import { FaDownload, FaFileExcel } from 'react-icons/fa';

import AttendanceReportSection from './ReportSection';

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Manage Attendance" },
];
// ==================================================================================================

export default function AttendanceReport({
  profile,
  session,
  cookyGuid,
  cookyId,
  attendance

}) {


  const config = getSessionCache("dashboardConfig");
  const context = getSessionCache("dashboardContext");

  // console.log(config?.config?.classes,'--- config');






  // ==================================================================================================
  // State for selected class and date
  const [selectedClassId, setSelectedClassId] = useState(config?.classes[0]?.id);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for student attendance
  const [studentAttendance, setStudentAttendance] = useState({});

  // State for attendance summary
  const [attendanceSummary, setAttendanceSummary] = useState({
    present: 0,
    absent: 0,
    leave: 0,
    total: 0,
  });



  // ==================================================================================================
  // const { setAuthStates, id, setGuid, guid } = useAuthContext();
  const { getAttendanceReport, attendanceReportData } = useAttendanceReport(
    profile = context?.profileId,
    session = context?.session,
    selectedDate,
    cookyGuid,
    selectedClassId,
    cookyId,
  );


  const { getAttendance, attendanceData } = useAttendance(
    profile = context?.profileId,
    session = context?.session,
    selectedDate,
    cookyGuid,
    selectedClassId,
    cookyId,
  );

  // console.log('guid== -----------',  guid);

  // ==================================================================================================

  useEffect(() => {
    getAttendance(
      profile,
      session,
      selectedDate,
      cookyGuid,
      selectedClassId,
      cookyId,
    );
    getAttendanceReport(
      profile,
      session,
      selectedDate,
      cookyGuid,
      selectedClassId,
      cookyId,
    );
  }, [selectedDate, selectedClassId]);


  const note = attendanceData?.note ?? [];
  const staff = attendanceData?.staff ?? [];
  const presentStudents = attendanceData?.attendance?.PRESENT ?? []; // Use ?? [] to default to an empty array
  const absentStudents = attendanceData?.attendance?.ABSENT ?? [];   // Use ?? [] to default to an empty array
  const leavesStudents = attendanceData?.attendance?.LEAVE ?? []; // Use ?? [] to default to an empty array


  const allStudents = [...presentStudents, ...absentStudents, ...leavesStudents];
  // console.log('presentStudents ==========', presentStudents);
  // console.log('absentStudents ==========', absentStudents);

  // You can then get the total count from this combined array:
  const totalMarkedStudentsCount = allStudents?.length;


  // Calculate total students who are either present or absent
  // Ensure both are arrays before attempting to get their length
  // const totalStudents = (presentStudents?.length ?? 0) + (absentStudents?.length ?? 0);




  // Filter students based on selected class
  // const allStudents = mockStudents?.filter(student => student.classId === selectedClassId);
  // const allStudents = allMarkedStudents

  // Initialize attendance for filtered students when class or date changes
  // console.log('studentAttendance==========', studentAttendance);
  // useEffect(() => {
  //   const initialAttendanceState = {};
  //   allStudents?.forEach(student => {
  //     // Corrected logic: Use the 'initialAttendance' field already determined
  //     // in the 'allStudents' array.
  //     initialAttendanceState[student.id] = student.initialAttendance || 'absent'; // Default to 'absent' if initialAttendance isn't set
  //   });

  //   setStudentAttendance(initialAttendanceState);
  // }, [selectedDate]);

  // Use this useEffect to initialize studentAttendance state
  useEffect(() => {
    const initialAttendanceState = {};

    // Iterate over the students relevant to the currently selected class
    allStudents.forEach(student => {
      let status = 'absent'; // Default to 'absent'

      if (presentStudents.some(s => s.id === student.id)) {
        status = 'present';
      } else if (leavesStudents.some(s => s.id === student.id)) {
        status = 'leave';
      }
      // No 'else if (absentStudents.some(...))' needed here, as 'absent' is the default
      // if not found in present or leave. If absentStudents is specifically
      // for *marked* absences, and you want to ensure students not explicitly
      // present/leave but *not* in absentStudents are treated differently (e.g., 'unmarked'),
      // then you'd adjust the default and add another condition.
      // But for typical P/A/L, this order (P > L > A(default)) is common.

      initialAttendanceState[student.id] = status; // CORRECT: Assign status to student.id as key
    });

    setStudentAttendance(initialAttendanceState);
  }, [
    selectedClassId, // Important: Changes filteredStudents
    selectedDate,    // Important: Changes attendanceData
    attendanceData,  // Important: `presentStudents`, `absentStudents`, `leavesStudents` change when this updates
  ]);
  // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // CRITICAL: Added missing dependencies that are used inside this effect
  // Dependencies:
  // - selectedClassId: When the class changes, we need to re-initialize for the new set of students.
  // - selectedDate: When the date changes, attendanceData will change, requiring re-initialization.
  // - attendanceData: This is crucial as it contains the present, absent, and leave lists.
  // - filteredStudents: Ensures the effect re-runs if the list of students for the class changes (though
  //                     selectedClassId usually covers this, being explicit doesn't hurt).

  // console.log('attendanceSummary==========', attendanceSummary,studentAttendance);
  // console.log('presentStudents==========', studentAttendance);


  // Added allStudents to dependencies
  // Calculate attendance summary whenever studentAttendance changes
  useEffect(() => {
    // let present = 0;
    // let absent = 0;
    // let leave = 0;
    // const total = allStudents.length;

    // allStudents.forEach(student => {
    //   const status = studentAttendance[student.id];
    //   if (status === 'present') {
    //     present++;
    //   } else if (status === 'absent') {
    //     absent++;
    //   } else if (status === 'leave') {
    //     leave++;
    //   }
    // });

    setAttendanceSummary({
      present: presentStudents?.length,
      absent: absentStudents?.length,
      leave: leavesStudents?.length,
      total: presentStudents?.length + absentStudents?.length,
    });



    // setAttendanceSummary({ present, absent, leave, total });
  }, [selectedDate, attendanceData]);
  // }, [studentAttendance, allStudents]);

  // Handle attendance status change for a student
  const handleAttendanceChange = (studentId, status) => {
    setStudentAttendance(prev => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // Format date for display
  const formatDateDisplay = (dateString) => {
    const options = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const handleTakeAttendanceAndSendSMS = async () => {
    console.log("Taking attendance and sending SMS to parents...");

    setIsSubmitting(true);

    const repsonse = await markAttendance(
      profile,
      session,
      selectedDate,
      cookyGuid,
      selectedClassId,
      cookyId,

    )
    console.log(repsonse.data);

    setIsSubmitting(false);

  };


  // console.log("Initializing allStudents:", attendanceData); // Debugging

  // Calculate attendance percentage
  const attendancePercentage = attendanceSummary.total > 0 ? Math.round((attendanceSummary.present / attendanceSummary.total) * 100) : 0;
  // ==================================================================================================

  return (
    <Layout>


      <div

        style={{
          backgroundImage: "url('/bg/appbackground@2x.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="min-h-[calc(100vh-100px)] p-6 space-y-6"
      >
        <Breadcrumbs items={breadcrumbs} />

        <div className="min-h-screen bg-gray-50 p-6 shadow-md rounded">
          {/* Header Section */}
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <ReceiptTextIcon className="w-8 h-8 text-blue-600" />
                    Daily Attendance Report

                  </h1>
                  <p className="text-gray-600">
                    View and Manage AttendanceReports
                  </p>

                </div>
                {/* <div className="flex gap-3">



                  <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Upload className="w-4 h-4" />
                    Import Data
                  </button>
                  <button
                    onClick={() => {
                      setModalType('standard');
                      setShowAddModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Standard
                  </button>
                </div> */}
              </div>
            </div>





          </div>


          <AttendanceReportSection

            reports={attendanceReportData?.attendance}
          />

        </div>
      </div>



    </Layout>
  );
};

// ==================================================================================================


