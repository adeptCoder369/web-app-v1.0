'use client'
import React, { useState, useEffect } from 'react';
import { CalendarDays, Users, CheckCircle, XCircle, MinusCircle, Send, TrendingUp, Clock, UserCheck, AlertCircle, School, ChevronDown, Plus, ReceiptTextIcon } from 'lucide-react';
import Layout from '../../layouts/Layout';
import { useAttendance } from '../../controllers/attendance';
import { markAttendance } from '../../api/attendance';
import Loader from '../ui/status/Loader';
import { useAuthContext } from '../../context/auth';
import { getSessionCache } from '../../utils/sessionCache';
import { Breadcrumbs } from '../ui/Breadcrumb/breadcrumb';
import { FaDownload, FaFileExcel } from 'react-icons/fa';


const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Manage Attendance" },
];
// ==================================================================================================

export default function AttendanceDashboard({
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
                    Daily Attendance Management
                  </h1>
                  <p className="text-gray-600">              Mark attendance and notify parents instantly</p>

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

          <div className="max-w-6xl mx-auto">
            {/* Controls Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Class Selection Card */}
              <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  Select Class
                </label>
                <div className="relative">
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-200 font-medium appearance-none cursor-pointer"
                  >
                    {config?.classes?.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Date Selection Card */}
              <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <CalendarDays className="h-4 w-4 mr-2 text-purple-500" />
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white focus:outline-none transition-all duration-200 font-medium"
                />
              </div>

              {/* Quick Stats Card */}
              <div className="bg-gradient-to-r from-[#15487d] to-[#007aff] rounded-2xl shadow p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold opacity-90">Attendance Rate</span>
                  <TrendingUp className="h-4 w-4 opacity-90" />
                </div>
                <div className="text-3xl font-bold mb-1">{attendancePercentage}%</div>
                <div className="text-sm opacity-75">
                  {attendanceSummary.present} of {attendanceSummary.total} present
                </div>
              </div>
            </div>


            {/* -------- Notes ----------*/}

            <div className="text-sm mt-4 flex items-center justify-center">
              {/* You might want an icon here, e.g., <Info className="h-4 w-4 mr-2" /> from lucide-react */}
              <span style={{ color: `${note?.text}`, fontWeight: 'bold' }}>
                Important Note:
              </span>
              <span className="ml-2" style={{ color: `${note?.text}` }}>
                {note?.text}
              </span>
            </div>

            {/* Date Display & Summary */}
            <div className="bg-white rounded-2xl shadow p-6 mb-8 border border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center">
                  <Clock className="h-6 w-6 text-indigo-500 mr-3" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {formatDateDisplay(selectedDate)}
                    </h3>
                    <p className="text-gray-600 font-medium">
                      {config?.classes?.find(c => c.id === selectedClassId)?.name}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center bg-green-50 px-4 py-2 rounded-xl border border-green-200">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-semibold text-green-800">
                      Present: {attendanceSummary.present}
                    </span>
                  </div>
                  <div className="flex items-center bg-red-50 px-4 py-2 rounded-xl border border-red-200">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-sm font-semibold text-red-800">
                      Absent: {attendanceSummary.absent}
                    </span>
                  </div>
                  <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-200">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-sm font-semibold text-yellow-800">
                      Leave: {attendanceSummary.leave}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Student List */}
            <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-gray-600" />
                  Student Attendance ({allStudents?.length ?? 0})

                </h3>
              </div>



              <div className="p-6">
                {allStudents?.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">No students found for this class.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {allStudents?.map((student, index) => (
                      <div
                        key={student.id}
                        className="group relative bg-gray-50 rounded-2xl p-6 border-2 border-transparent hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-300"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-gradient-to-r from-[#15487d] to-[#007aff] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {student.roll_number}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-900 transition-colors">
                                {student.name}
                              </h4>
                              <p className="text-sm text-gray-600 font-medium">Roll No: {student.roll_number}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleAttendanceChange(student.id, 'present')}
                              className={`group/btn flex items-center px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-105 ${studentAttendance[student.id] === 'present'
                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                                : 'bg-white text-green-600 border-2 border-green-200 hover:bg-green-50 hover:border-green-300'
                                }`}
                            >
                              <CheckCircle className="h-4 w-4 mr-1.5" />
                              Present
                            </button>

                            <button
                              onClick={() => handleAttendanceChange(student.id, 'absent')}
                              className={`group/btn flex items-center px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-105 ${studentAttendance[student.id] === 'absent'
                                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                                : 'bg-white text-red-600 border-2 border-red-200 hover:bg-red-50 hover:border-red-300'
                                }`}
                            >
                              <XCircle className="h-4 w-4 mr-1.5" />
                              Absent
                            </button>

                            <button
                              onClick={() => handleAttendanceChange(student.id, 'leave')}
                              className={`group/btn flex items-center px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-105 ${studentAttendance[student.id] === 'leave'
                                ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/30'
                                : 'bg-white text-yellow-600 border-2 border-yellow-200 hover:bg-yellow-50 hover:border-yellow-300'
                                }`}
                            >
                              <MinusCircle className="h-4 w-4 mr-1.5" />
                              Leave
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>



            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                onClick={handleTakeAttendanceAndSendSMS}
                disabled={isSubmitting}
                className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#15487d] to-[#007aff] text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#15487d] to-[#007aff] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="h-6 w-6 mr-3 group-hover:translate-x-1 transition-transform duration-200" />
                      Take Attendance & Send SMS
                    </>
                  )}
                </div>
              </button>
              <p className="text-sm text-gray-600 mt-3 font-medium">
                SMS notifications will be sent to all parents instantly
              </p>
            </div>
          </div>
        </div>
      </div>



    </Layout>
  );
};

// ==================================================================================================


