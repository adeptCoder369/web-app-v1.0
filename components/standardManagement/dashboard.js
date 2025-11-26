'use client'
import React, { useState, useMemo, useEffect } from 'react';

import {
    Users,
    Plus,
    Edit2,
    Trash2,
    MoreVertical,
    BookOpen,
    GraduationCap,
    ChevronDown,
    ChevronRight,
    UserPlus,
    Eye,
    PieChart,
    School,
    Download,


} from 'lucide-react';

import { getSessionCache } from '../../utils/sessionCache';
import StudentsModal from '../ui/tables/modernTable/component/StudentsModal';
import { FaDownload, FaFileExcel, FaSortAlphaDown } from 'react-icons/fa';
import { addClass, arrangeRollNosApi, editClass, removeAllStudentApi } from '../../api/classes';
import TooltipInfo from '../ui/tooltip/TooltipInfo';
import { Breadcrumbs } from '../ui/Breadcrumb/breadcrumb';
import { AddStandardModal } from './AddStandardClassModal'
import { EditClassModal } from './EditClassModal'
import { QuickStats } from './QuickStats'
import ConfirmationDialogueBox from '../ui/status/Confirmation';
import { useRouter } from 'next/navigation';
import { useStudent } from '../../context/studentContext';
import SuccessStatus from '../ui/status/Success';
import { getCookie } from "cookies-next";

// ==========================================================================================
const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Manage Standards & Classes" },
];

// ==========================================================================================
const StandardsClassesManagementDashboard = ({ dashboardConfig, reloadDashboard, setReloadKey }) => {
    // ---------------------------------------------------------
    const router = useRouter()
    const { selectedStudent, setSelectedStudent } = useStudent()
    const context = getSessionCache("dashboardContext");
    const config = getSessionCache("dashboardConfig");
    // ---------------------------------------------------------
    const [showModal, setShowModal] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [confirmArrangeRole, setConfirmArrangeRole] = useState(false)
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [subOpenId, setSubOpenId] = useState(null);

    useEffect(() => {
        if (!dashboardConfig) {
            reloadDashboard()
        }
    }, []);
    // ==================================================================
    const [stateChanged, setStateChanged] = useState(false);
    const [loading, setLoading] = useState(false);
    const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
    const [selectedStandard, setSelectedStandard] = useState('all');
    const [selectedStandardId, setSelectedStandardId] = useState('all');
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [expandedStandards, setExpandedStandards] = useState(new Set([]));
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [modalType, setModalType] = useState('standard'); // 'standard' or 'class'
    const [selectedItem, setSelectedItem] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [section, setSection] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [apiResponse, setApiResponse] = useState('');
    const [removeAllStudent, setRemoveAllStudent] = useState('');

    const standards = config?.standards || []
    const teachers = config?.users?.filter(
        (user) => user?.designation?.role?.is_teaching_staff === '1'
    );


    useEffect(() => {
        if (showEditModal && selectedItem?.data) {
            setSection(selectedItem.data.section || '');
            setSelectedTeacher(selectedItem.data.class_teacher?.id || '');
        }
    }, [showEditModal, selectedItem]);






    // ==================================================================


    const toggleStandardExpansion = (standardId) => {

        setExpandedStandards(prev => {
            const newExpanded = new Set(prev);
            if (newExpanded.has(standardId)) {
                newExpanded.delete(standardId);
            } else {
                newExpanded.add(standardId);
            }
            return newExpanded;


        });


    };
    // console.log('=====standards====', standards);

    const totalStudents = standards?.reduce(
        (sum, std) =>
            sum +
            (std.classes?.reduce(
                (classSum, cls) => classSum + (cls?.students?.length || 0),
                0
            ) || 0),
        0
    );



    const getOverallStats = () => {
        let totalStudents = 0, totalClasses = 0, totalCapacity = 0;
        Object.values(standards)?.forEach(standard => {
            totalStudents += standard.totalStudents;
            totalClasses += standard.totalClasses;
            Object.values(standard.classes).forEach(cls => {
                totalCapacity += cls.capacity;
            });
        });
        return { totalStudents, totalClasses, totalCapacity, occupancyRate: ((totalStudents / totalCapacity) * 100).toFixed(1) };
    };

    const filteredData = useMemo(() => {
        if (selectedStandard === 'all') return standards;
        return { selectedStandard };
    }, [selectedStandard]);

    const stats = getOverallStats();

    const getPerformanceColor = (performance) => {
        if (performance >= 90) return 'text-green-600 bg-green-50';
        if (performance >= 80) return 'text-blue-600 bg-blue-50';
        if (performance >= 70) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    const getOccupancyColor = (students, capacity) => {
        const rate = (students / capacity) * 100;
        if (rate >= 95) return 'text-red-600';
        if (rate >= 85) return 'text-yellow-600';
        return 'text-green-600';
    };





    // === Function(s) ========================================
    const downloadExcel = () => {
        // For Excel export, we'll create a simple HTML table format that Excel can read
        const headers = ['Name', 'Subject', 'Description', 'Date', 'Time', 'Total Students', 'Platform'];
        let htmlContent = '<table><tr>';
        headers.forEach(header => {
            htmlContent += `<th>${header}</th>`;
        });
        htmlContent += '</tr>';

        filteredData.forEach(row => {
            htmlContent += '<tr>';
            htmlContent += `<td>${row.name || 'N/A'}</td>`;
            htmlContent += `<td>${row.subject?.name || 'N/A'}</td>`;
            htmlContent += `<td>${row.description || 'N/A'}</td>`;
            htmlContent += `<td>${row.date || 'N/A'}</td>`;
            htmlContent += `<td>${row.time || 'N/A'}</td>`;
            htmlContent += `<td>${row.students?.length || 0}</td>`;
            htmlContent += `<td>${row.info?.platform || 'N/A'}</td>`;
            htmlContent += '</tr>';
        });
        htmlContent += '</table>';

        const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `staff_data_${new Date().toISOString().split('T')[0]}.xlsx`;
        link.click();
        setExportDropdownOpen(false);
    };





    // After class add
    const handleAddClass = async () => {
        setLoading(true);
        const res = await addClass(
            context?.profileId,
            context?.session,
            selectedStandardId,
            selectedTeacher,
            section
        );
        setLoading(false);
        setShowEditModal(false);
        setSelectedItem(null);

        if (res?.success) {
            setReloadKey(k => k + 1); // reliable signal
        }
    };

    // After class edit
    const handleEditClass = async () => {
        setLoading(true);
        const res = await editClass(
            context?.profileId,
            context?.session,
            selectedStandardId,
            selectedTeacher,
            section,
            selectedClassId?.id
        );

        setLoading(false);
        setShowEditModal(false);
        setSelectedItem(null);

        if (res?.success) {
            setReloadKey(k => k + 1); // reliable signal

        }
    };




    const handleConfirmation = async (classData) => {
        setSelectedClass(classData)
        if (!selectedStandard) return;
        setConfirmDelete(true)


    };


    const handleConfirmationArrangeRole = async (classData) => {
        setSelectedClass(classData)

        setConfirmArrangeRole(true)


    };


    const handleSelectStudent = async (data) => {
        setSelectedStudent(data)
        // Current page
        router.push('/dashboard/student-management');
    };

    const handleArrangeRollNoByName = async () => {
        setLoading(true);

        try {
            const res = await arrangeRollNosApi(
                context?.profileId,
                context?.session,
                selectedClass?.id,
            );

            if (res?.success) {
                setConfirmArrangeRole(false);
                setShowSuccess(true);
                setApiResponse({
                    userName: selectedClass?.name,
                    message: res?.results?.message
                });
                setShowEditModal(false);
                setSelectedItem(null);
                setStateChanged(prev => !prev);
            }
        } catch (err) {
            console.error("arrangeRollNosApi failed:", err);
        } finally {
            // the cleanup crew
            setLoading(false);

            // fade out success indicator after a moment
            setTimeout(() => {
                setShowSuccess(false);
            }, 1500);
        }
    };



    const handleRemoveAllStudent = async () => {
        // setLoading(true);

        try {
            const res = await removeAllStudentApi(
                context?.profileId,
                context?.session,
                selectedClass?.id,
            );
            console.log('---- res ----', res);

            if (res?.success) {
                setRemoveAllStudent(res?.results?.message)
                setApiResponse({ message: res?.results?.message })
            }
        } catch (err) {
            console.error("arrangeRollNosApi failed:", err);
        } finally {
            // the cleanup crew
            setLoading(false);
            setConfirmDelete(false)
            // fade out success indicator after a moment
            setTimeout(() => {
                setShowSuccess(false);
            }, 1500);
        }
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



    const downloadRoutes = {
        folder: classId => {
            const portal = getPortalParams();

            return `https://portal.infoeight.com/class/folder`
                + `?client_id=${portal.client_id}`
                + `&guid=${portal.guid}`
                + `&logged_in_user_account_id=${portal.logged_in_user_account_id}`
                + `&user_account_id=${portal.user_account_id}`
                + `&id=${classId}`;
        },

        idCard: classId => {
            const portal = getPortalParams();

            return `https://portal.infoeight.com/class/id-card`
                + `?client_id=${portal.client_id}`
                + `&guid=${portal.guid}`
                + `&logged_in_user_account_id=${portal.logged_in_user_account_id}`
                + `&user_account_id=${portal.user_account_id}`
                + `&id=${classId}`;
        },

        admitCard: classId => {
            const portal = getPortalParams();

            return `https://portal.infoeight.com/class/id-card`
                + `?client_id=${portal.client_id}`
                + `&guid=${portal.guid}`
                + `&logged_in_user_account_id=${portal.logged_in_user_account_id}`
                + `&user_account_id=${portal.user_account_id}`
                + `&id=${classId}`;
        },



        studentData: classId => {
            const portal = getPortalParams();

            return `https://portal.infoeight.com/class/student-data`
                + `?client_id=${portal.client_id}`
                + `&guid=${portal.guid}`
                + `&logged_in_user_account_id=${portal.logged_in_user_account_id}`
                + `&user_account_id=${portal.user_account_id}`
                + `&id=${classId}`;
        },


        ptmSheet: classId => {
            const portal = getPortalParams();

            return `https://portal.infoeight.com/class/download-ptm-sheet`
                + `?client_id=${portal.client_id}`
                + `&guid=${portal.guid}`
                + `&logged_in_user_account_id=${portal.logged_in_user_account_id}`
                + `&user_account_id=${portal.user_account_id}`
                + `&class_id=${classId}`;
        },


        studentDetails: classId => {
            const portal = getPortalParams();

            return `https://portal.infoeight.com/class/student-data`
                + `?client_id=${portal.client_id}`
                + `&guid=${portal.guid}`
                + `&logged_in_user_account_id=${portal.logged_in_user_account_id}`
                + `&user_account_id=${portal.user_account_id}`
                + `&id=${classId}`;
        },



        proofReadingSoft: classId => {
            const p = getPortalParams();
            return `https://portal.infoeight.com/class/proof-reading`
                + `?client_id=${p.client_id}`
                + `&guid=${p.guid}`
                + `&logged_in_user_account_id=${p.logged_in_user_account_id}`
                + `&user_account_id=${p.user_account_id}`
                + `&id=${classId}`
                + `&format=SOFT COPY`;
        },

        proofReadingHard: classId => {
            const p = getPortalParams();
            return `https://portal.infoeight.com/class/proof-reading`
                + `?client_id=${p.client_id}`
                + `&guid=${p.guid}`
                + `&logged_in_user_account_id=${p.logged_in_user_account_id}`
                + `&user_account_id=${p.user_account_id}`
                + `&id=${classId}`
                + `&format=HARD COPY`;
        }
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

    // ==================================================================
    return (
        <>

            <div
                className="min-h-[calc(100vh-100px)] p-6 space-y-6"
                style={{
                    backgroundImage: "url('/bg/appbackground@2x.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >


                <Breadcrumbs items={breadcrumbs} />


                <div className="min-h-screen bg-gray-50 p-6 shadow-md rounded">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                                        <School className="w-8 h-8 text-blue-600" />
                                        Standards & Classes Management
                                    </h1>
                                    <p className="text-gray-600">Academic Structure Overview - Academic Year {config?.year?.session}</p>
                                </div>
                                <div className="flex gap-3">

                                    {/* Export Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                                            className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                                        >
                                            <FaDownload className="text-sm" />
                                            <span className="font-medium">Export</span>
                                            <ChevronDown className={`w-4 h-4 transition-transform ${exportDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {exportDropdownOpen && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setExportDropdownOpen(false)} />
                                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">

                                                    <button
                                                        onClick={downloadExcel}
                                                        className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <FaFileExcel className="text-green-700" />
                                                        <span>Export Class-wise</span>
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>


                                    <button
                                        onClick={() => {
                                            setModalType('standard');
                                            setShowAddModal(true);
                                        }}
                                        className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Standard
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ============================ Stats Cards ============================  */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow  border border-blue-100 p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                                {/* Glow / Accent Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-indigo-500/10 opacity-0 group-hover:opacity-100 transition duration-500" />

                                <div className="relative flex items-center gap-4">
                                    {/* Icon Wrapper */}
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 shadow-inner ring-1 ring-white/40">
                                        <School className="w-7 h-7 text-blue-600" />
                                    </div>

                                    {/* Text Content */}
                                    <div>
                                        <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                            <div className="text-2xl font-bold text-gray-900">{standards?.length}</div>
                                        </div>
                                        <div className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition">
                                            Total Standards
                                        </div>
                                    </div>
                                </div>
                            </div>








                            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow  border border-blue-100 p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                                {/* Glow / Accent Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-indigo-500/10 opacity-0 group-hover:opacity-100 transition duration-500" />

                                <div className="relative flex items-center gap-4">
                                    {/* Icon Wrapper */}
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-green-200 shadow-inner ring-1 ring-white/40">
                                        <GraduationCap className="w-6 h-6 text-green-600" />
                                    </div>

                                    {/* Text Content */}
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">{standards.reduce((sum, std) => sum + (std?.classes?.length || 0), 0)}</div>

                                        <div className="text-sm text-gray-600">Total Classes</div>

                                    </div>
                                </div>
                            </div>















                            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow  border border-blue-100 p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                                {/* Glow / Accent Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-indigo-500/10 opacity-0 group-hover:opacity-100 transition duration-500" />

                                <div className="relative flex items-center gap-4">
                                    {/* Icon Wrapper */}
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 shadow-inner ring-1 ring-white/40">
                                        <Users className="w-6 h-6 text-purple-600" />
                                    </div>

                                    {/* Text Content */}
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">{totalStudents}</div>

                                        <div className="text-sm text-gray-600">Total Students</div>

                                    </div>
                                </div>
                            </div>





                            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow  border border-blue-100 p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                                {/* Glow / Accent Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-indigo-500/10 opacity-0 group-hover:opacity-100 transition duration-500" />

                                <div className="relative flex items-center gap-4">
                                    {/* Icon Wrapper */}
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-200 shadow-inner ring-1 ring-white/40">
                                        <PieChart className="w-6 h-6 text-yellow-600" />
                                    </div>

                                    {/* Text Content */}
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">{stats.occupancyRate}%</div>

                                        <div className="text-sm text-gray-600">Occupancy Rate</div>

                                    </div>
                                </div>
                            </div>












                        </div>


                        {/* Main Content */}
                        {viewMode === 'list' ? (
                            /* List View */
                            <div className="space-y-4">
                                {Object.entries(filteredData).map(([standardKey, standardData]) => {


                                    return (
                                        <div

                                            key={standardKey.id}
                                            onClick={() => setSelectedStandardId(standardData?.id)}
                                            className="  bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden">
                                            {/* Standard Header */}
                                            <div className="bg-accent px-6 py-4 bg-gray-50 border-b border-gray-200">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            onClick={() => toggleStandardExpansion(standardData?.id)}

                                                            className="cursor-pointer flex items-center gap-2 text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"

                                                        >
                                                            {expandedStandards?.has(standardData?.id) ?
                                                                <ChevronDown className="w-5 h-5" /> :
                                                                <ChevronRight className="w-5 h-5" />
                                                            }
                                                            <GraduationCap className="w-5 h-5" />
                                                            {standardData.name}
                                                        </button>

                                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                                            <span className="flex items-center gap-1">
                                                                <BookOpen className="w-4 h-4" />
                                                                {standardData?.classes?.length} Classes
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Users className="w-4 h-4" />
                                                                {standardData.classes?.reduce((sum, cls) => sum + (cls.students?.length || 0), 0)} Students
                                                            </span>
                                                            <span className="text-gray-800">|</span>

                                                        </div>
                                                    </div>
                                                    {/* 
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-gray-600">Exams: {standardData?.fees?.length}</span>
                                                        </div>

                                                        <div className="relative">
                                                            <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div> */}
                                                </div>
                                            </div>

                                            {/* Classes Table */}
                                            {expandedStandards?.has(standardData.id) && (
                                                <div className="bg-accent overflow-x-auto">
                                                    <table className="min-w-full divide-y divide-gray-200">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Class Name
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Class Teacher
                                                                </th>

                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Actions
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white divide-y divide-gray-200">
                                                            {standardData.classes?.map((classData) => (
                                                                <tr

                                                                    key={classData.id} className="hover:bg-gray-50">
                                                                    <td className="px-6 py-4 whitespace-nowrap">

                                                                        <div className="flex items-center">
                                                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                                                                <BookOpen className="w-4 h-4 text-blue-600" />
                                                                            </div>
                                                                            <div
                                                                                className='bg-white'

                                                                            >
                                                                                <div className="text-sm font-medium text-gray-900">{classData.section}</div>
                                                                                <div className=" text-sm text-gray-500">{classData?.students?.length} Students</div>


                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                        {classData.class_teacher?.name}
                                                                    </td>

                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                        <div className="flex items-center gap-2">

                                                                            {/* View Students */}
                                                                            <TooltipInfo text="View Students">
                                                                                <button
                                                                                    onClick={() => {
                                                                                        setShowModal(true);
                                                                                        setSelectedClass(classData);
                                                                                    }}
                                                                                    className="cursor-pointer text-blue-600 hover:text-blue-900"
                                                                                >
                                                                                    <Eye className="w-4 h-4" />
                                                                                </button>
                                                                            </TooltipInfo>

                                                                            {/* Edit Class */}
                                                                            <TooltipInfo text="Edit Class">
                                                                                <button
                                                                                    onClick={() => {
                                                                                        setSelectedItem({ type: "class", standardKey, data: classData });
                                                                                        setModalType("class");
                                                                                        setShowEditModal(true);
                                                                                        setSelectedClassId(classData);
                                                                                    }}
                                                                                    className="cursor-pointer text-gray-600 hover:text-gray-900"
                                                                                >
                                                                                    <Edit2 className="w-4 h-4" />
                                                                                </button>
                                                                            </TooltipInfo>

                                                                            {/* Arrange Roll No. */}
                                                                            <TooltipInfo text="Arrange Roll No. by Name">
                                                                                <button
                                                                                    onClick={() => handleConfirmationArrangeRole(classData)}
                                                                                    className="cursor-pointer text-green-600 hover:text-green-800"
                                                                                >
                                                                                    <FaSortAlphaDown className="w-4 h-4" />
                                                                                </button>
                                                                            </TooltipInfo>

                                                                            {/* Remove All Students */}
                                                                            <TooltipInfo text="Remove All Students">
                                                                                <button
                                                                                    onClick={() => handleConfirmation(classData)}
                                                                                    className="cursor-pointer text-red-600 hover:text-red-800"
                                                                                >
                                                                                    <Trash2 className="w-4 h-4" />
                                                                                </button>
                                                                            </TooltipInfo>

                                                                            {/* Downloads Dropdown */}
                                                                            <div className="relative inline-block text-left">
                                                                                {/* Main Button */}
                                                                                <button
                                                                                    onClick={() =>
                                                                                        setOpenDropdownId(openDropdownId === classData.id ? null : classData.id)
                                                                                    }
                                                                                    className="cursor-pointer text-gray-600 hover:text-gray-900 flex items-center gap-1 px-2 py-1 border rounded-md text-sm md:text-base"
                                                                                >
                                                                                    <Download className="w-4 h-4 md:w-5 md:h-5" />
                                                                                </button>

                                                                                {/* Dropdown List */}
                                                                                {openDropdownId === classData.id && (
                                                                                    <div className="absolute right-0 mt-2 w-48 md:w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-auto max-h-60">
                                                                                        <ul className="flex flex-col">
                                                                                            {/* PDF */}
                                                                                            <li>
                                                                                                <button
                                                                                                    onClick={() => handleDownload(classData, "folder")}

                                                                                                    className="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                                                >
                                                                                                    Folder
                                                                                                </button>
                                                                                            </li>

                                                                                            {/* Excel */}
                                                                                            <li>
                                                                                                <button
                                                                                                    onClick={() => handleDownload(classData, "idCard")}
                                                                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                                                >
                                                                                                    Id Card
                                                                                                </button>
                                                                                            </li>

                                                                                            {/* CSV */}
                                                                                            <li>
                                                                                                <button
                                                                                                    onClick={() => handleDownload(classData, "admitCard")}
                                                                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                                                >
                                                                                                    Admit Card
                                                                                                </button>
                                                                                            </li>
                                                                                            <li>
                                                                                                <button
                                                                                                    onClick={() => handleDownload(classData, "ptmSheet")}
                                                                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                                                >
                                                                                                    PTM Sheet
                                                                                                </button>
                                                                                            </li>
                                                                                            <li>
                                                                                                <button
                                                                                                    onClick={() => handleDownload(classData, "studentDetails")}
                                                                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                                                >
                                                                                                    Student Details
                                                                                                </button>
                                                                                            </li>
                                                                                            <li>
                                                                                                <button
                                                                                                    onClick={() => handleDownload(classData, "studentData")}
                                                                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                                                >
                                                                                                    Download Student Data
                                                                                                </button>
                                                                                            </li>
                                                                                            <li>
                                                                                                <button
                                                                                                    onClick={() => handleDownload(classData, "proofReadingSoft")}
                                                                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                                                >
                                                                                                    Soft Copy(.xlsx)
                                                                                                </button>
                                                                                            </li>
                                                                                            <li>
                                                                                                <button
                                                                                                    onClick={() => handleDownload(classData, "proofReadingHard")}
                                                                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                                                >
                                                                                                    Hard Copy(.pdf)

                                                                                                </button>
                                                                                            </li>
                                                                                            {/* Nested Example */}
                                                                                            {/* <li className="relative">
                                                                                                <button
                                                                                                    onClick={() =>
                                                                                                        setSubOpenId(subOpenId === classData.id ? null : classData.id)
                                                                                                    }
                                                                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex justify-between items-center"
                                                                                                >
                                                                                                    Proof Reading
                                                                                                    <span
                                                                                                        className={`ml-2 transition-transform ${subOpenId === classData.id ? "rotate-90" : ""
                                                                                                            }`}
                                                                                                    >
                                                                                                        ▶
                                                                                                    </span>
                                                                                                </button>
                                                                                            </li> */}




































                                                                                        </ul>
                                                                                    </div>
                                                                                )}
                                                                            </div>


                                                                        </div>
                                                                    </td>

                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>

                                                    {/* Add Class Button */}
                                                    <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50/10 hover:from-blue-50 hover:to-blue-100/20 transition-colors duration-300">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedItem({ standardKey });
                                                                setModalType('class');
                                                                setShowAddModal(true);
                                                            }}
                                                            className="cursor-pointer flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:scale-[1.02] transition-all duration-200"
                                                        >
                                                            <span className="p-1.5 bg-blue-100/70 rounded-full shadow-sm">
                                                                <Plus className="w-4 h-4 text-blue-600" />
                                                            </span>
                                                            Add New Class to {standardData.name}
                                                        </button>
                                                    </div>

                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            /* Grid View */
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {Object.entries(filteredData).flatMap(([standardKey, standardData]) =>
                                    Object.entries(standardData.classes).map(([classKey, classData]) => {

                                        return (
                                            <div key={`${standardKey}-${classKey}`} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                            <BookOpen className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900">{classData.className}</h3>
                                                            <p className="text-sm text-gray-500">{standardData.standardName}</p>
                                                        </div>
                                                    </div>
                                                    <div className="relative">
                                                        <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-600">Class Teacher</span>
                                                        <span className="text-sm font-medium text-gray-900">{classData.classTeacher}</span>
                                                    </div>

                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-600">Students</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-sm font-medium ${getOccupancyColor(classData.students, classData.capacity)}`}>
                                                                {classData.students}/{classData.capacity}
                                                            </span>
                                                            <div className="w-12 bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className={`h-2 rounded-full ${(classData.students / classData.capacity) >= 0.95 ? 'bg-red-500' :
                                                                        (classData.students / classData.capacity) >= 0.85 ? 'bg-yellow-500' : 'bg-green-500'
                                                                        }`}
                                                                    style={{ width: `${(classData.students / classData.capacity) * 100}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-600">Room</span>
                                                        <span className="text-sm font-medium text-gray-900">Room {classData.room}</span>
                                                    </div>

                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-600">Performance</span>
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(classData.performance)}`}>
                                                            {classData.performance}%
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                                    <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
                                                        <Eye className="w-4 h-4" />
                                                        View Details
                                                    </button>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedItem({ type: 'class', standardKey, classKey, data: classData });
                                                                setModalType('class');
                                                                setShowEditModal(true);
                                                            }}
                                                            className="p-1 text-gray-400 hover:text-gray-600"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-1 text-green-600 hover:text-green-800">
                                                            <UserPlus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        )}

                        {/* Add Modal */}
                        {showAddModal && (
                            <AddStandardModal
                                setSelectedTeacher={setSelectedTeacher}
                                setSection={setSection}
                                modalType={modalType}
                                teachers={teachers}
                                handleAddClass={handleAddClass}
                                loading={loading}
                                setShowAddModal={setShowAddModal}
                            />
                        )}

                        {/* Edit Modal */}
                        {showEditModal && selectedItem && (
                            <EditClassModal
                                setShowEditModal={setShowEditModal}
                                selectedItem={selectedItem}
                                section={section}
                                teachers={teachers}
                                handleEditClass={handleEditClass}
                                selectedTeacher={selectedTeacher}
                                loading={loading}
                                setSection={setSection}
                                setSelectedTeacher={setSelectedTeacher}
                            />
                        )}

                        {/* Quick Stats Summary */}
                        <QuickStats
                            standards={standards}
                            stats={stats}
                        />
                    </div >
                </div >

            </div>



            {showModal && (
                <StudentsModal
                    selectedData={selectedClass}
                    onSelectStudent={handleSelectStudent}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedClass(null);
                    }} />)}




            {confirmDelete && (
                <ConfirmationDialogueBox
                    title="Remove All Students?"
                    description={`Are you sure you want to delete all students from the ${selectedClass?.name}?`}
                    onConfirm={handleRemoveAllStudent}
                    onCancel={() => setConfirmDelete(false)} // Close modal if canceled
                />
            )}
            {confirmArrangeRole && (
                <ConfirmationDialogueBox
                    title="Arrange Roll No. By Names?"
                    description={`Are you sure you want to arrange the roll number by name ?`}
                    onConfirm={handleArrangeRollNoByName}
                    onCancel={() => setConfirmArrangeRole(false)} // Close modal if canceled
                />
            )}










            {/* Status notifications */}
            {showSuccess && (
                <SuccessStatus message={apiResponse?.message} />
            )}




            {removeAllStudent && (
                <SuccessStatus message={apiResponse?.message} />
            )}






        </>
    );
};
// ================================================
export default StandardsClassesManagementDashboard;
// ================================================