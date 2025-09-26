'use client'
import React, { useState, useMemo, useEffect } from 'react';
import {
    Users,
    Plus,
    Edit2,
    Trash2,
    Search,
    Filter,
    MoreVertical,
    BookOpen,
    GraduationCap,
    ChevronDown,
    ChevronRight,
    UserPlus,
    Settings,
    Download,
    Upload,
    Eye,
    PieChart,
    BarChart3,
    School,
    Mars,
    Venus
} from 'lucide-react';
import Layout from '../../layouts/Layout';
import { getSessionCache } from '../../utils/sessionCache';
import StudentsModal from '../../components/ui/tables/modernTable/component/StudentsModal';


// ==================================================================


const StandardsClassesManagement = ({ }) => {
    const [showModal, setShowModal] = useState(false);


    const config = getSessionCache("dashboardConfig");
    const standards = config?.standards
    console.log('**********************', config);

    // const totalClasses = standard.reduce((sum, std) => sum + (std.classes?.length || 0), 0);
    // ==================================================================
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStandard, setSelectedStandard] = useState('all');
    const [expandedStandards, setExpandedStandards] = useState(new Set([]));
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [modalType, setModalType] = useState('standard'); // 'standard' or 'class'
    const [selectedItem, setSelectedItem] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'


    const [selectedClass, setSelectedClass] = useState([]);

    // ==================================================================
    // Mock data structure
    const [academicData, setAcademicData] = useState({
        '6th': {
            standardName: '6th Standard',
            totalStudents: 180,
            totalClasses: 4,
            subjects: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies'],
            classTeacher: 'Mrs. Priya Sharma',
            classes: {
                'VI-A': {
                    className: 'VI-A',
                    students: 45,
                    capacity: 50,
                    classTeacher: 'Mrs. Sunita Kumar',
                    room: '201',
                    schedule: 'Morning',
                    subjects: 6,
                    performance: 85
                },
                'VI-B': {
                    className: 'VI-B',
                    students: 48,
                    capacity: 50,
                    classTeacher: 'Mr. Rajesh Gupta',
                    room: '202',
                    schedule: 'Morning',
                    subjects: 6,
                    performance: 82
                },
                'VI-C': {
                    className: 'VI-C',
                    students: 42,
                    capacity: 50,
                    classTeacher: 'Mrs. Kavita Singh',
                    room: '203',
                    schedule: 'Morning',
                    subjects: 6,
                    performance: 88
                },
                'VI-D': {
                    className: 'VI-D',
                    students: 45,
                    capacity: 50,
                    classTeacher: 'Mr. Amit Verma',
                    room: '204',
                    schedule: 'Morning',
                    subjects: 6,
                    performance: 79
                }
            }
        },
        '7th': {
            standardName: '7th Standard',
            totalStudents: 195,
            totalClasses: 4,
            subjects: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Computer'],
            classTeacher: 'Mr. Vikram Joshi',
            classes: {
                'VII-A': {
                    className: 'VII-A',
                    students: 50,
                    capacity: 50,
                    classTeacher: 'Mrs. Meera Patel',
                    room: '301',
                    schedule: 'Morning',
                    subjects: 7,
                    performance: 87
                },
                'VII-B': {
                    className: 'VII-B',
                    students: 49,
                    capacity: 50,
                    classTeacher: 'Mr. Suresh Reddy',
                    room: '302',
                    schedule: 'Morning',
                    subjects: 7,
                    performance: 84
                },
                'VII-C': {
                    className: 'VII-C',
                    students: 46,
                    capacity: 50,
                    classTeacher: 'Mrs. Anjali Mehta',
                    room: '303',
                    schedule: 'Morning',
                    subjects: 7,
                    performance: 91
                },
                'VII-D': {
                    className: 'VII-D',
                    students: 50,
                    capacity: 50,
                    classTeacher: 'Mr. Ravi Kumar',
                    room: '304',
                    schedule: 'Morning',
                    subjects: 7,
                    performance: 86
                }
            }
        },
        '8th': {
            standardName: '8th Standard',
            totalStudents: 168,
            totalClasses: 4,
            subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Social Studies'],
            classTeacher: 'Mrs. Deepika Nair',
            classes: {
                'VIII-A': {
                    className: 'VIII-A',
                    students: 42,
                    capacity: 45,
                    classTeacher: 'Mr. Arun Sinha',
                    room: '401',
                    schedule: 'Morning',
                    subjects: 8,
                    performance: 89
                },
                'VIII-B': {
                    className: 'VIII-B',
                    students: 44,
                    capacity: 45,
                    classTeacher: 'Mrs. Pooja Agarwal',
                    room: '402',
                    schedule: 'Morning',
                    subjects: 8,
                    performance: 85
                },
                'VIII-C': {
                    className: 'VIII-C',
                    students: 41,
                    capacity: 45,
                    classTeacher: 'Mr. Manoj Tiwari',
                    room: '403',
                    schedule: 'Morning',
                    subjects: 8,
                    performance: 92
                },
                'VIII-D': {
                    className: 'VIII-D',
                    students: 41,
                    capacity: 45,
                    classTeacher: 'Mrs. Shalini Jain',
                    room: '404',
                    schedule: 'Morning',
                    subjects: 8,
                    performance: 87
                }
            }
        },
        '9th': {
            standardName: '9th Standard',
            totalStudents: 160,
            totalClasses: 4,
            subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Social Studies', 'Computer'],
            classTeacher: 'Mr. Sandeep Joshi',
            classes: {
                'IX-A': {
                    className: 'IX-A',
                    students: 40,
                    capacity: 42,
                    classTeacher: 'Mrs. Nisha Kapoor',
                    room: '501',
                    schedule: 'Morning',
                    subjects: 9,
                    performance: 88
                },
                'IX-B': {
                    className: 'IX-B',
                    students: 41,
                    capacity: 42,
                    classTeacher: 'Mr. Prakash Singh',
                    room: '502',
                    schedule: 'Morning',
                    subjects: 9,
                    performance: 86
                },
                'IX-C': {
                    className: 'IX-C',
                    students: 39,
                    capacity: 42,
                    classTeacher: 'Mrs. Ritu Sharma',
                    room: '503',
                    schedule: 'Morning',
                    subjects: 9,
                    performance: 90
                },
                'IX-D': {
                    className: 'IX-D',
                    students: 40,
                    capacity: 42,
                    classTeacher: 'Mr. Ashok Kumar',
                    room: '504',
                    schedule: 'Morning',
                    subjects: 9,
                    performance: 84
                }
            }
        },
        '10th': {
            standardName: '10th Standard',
            totalStudents: 150,
            totalClasses: 4,
            subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Social Studies', 'Computer'],
            classTeacher: 'Mrs. Rekha Gupta',
            classes: {
                'X-A': {
                    className: 'X-A',
                    students: 38,
                    capacity: 40,
                    classTeacher: 'Mr. Dinesh Yadav',
                    room: '601',
                    schedule: 'Morning',
                    subjects: 9,
                    performance: 91
                },
                'X-B': {
                    className: 'X-B',
                    students: 37,
                    capacity: 40,
                    classTeacher: 'Mrs. Geeta Kumari',
                    room: '602',
                    schedule: 'Morning',
                    subjects: 9,
                    performance: 89
                },
                'X-C': {
                    className: 'X-C',
                    students: 38,
                    capacity: 40,
                    classTeacher: 'Mr. Ramesh Pandey',
                    room: '603',
                    schedule: 'Morning',
                    subjects: 9,
                    performance: 93
                },
                'X-D': {
                    className: 'X-D',
                    students: 37,
                    capacity: 40,
                    classTeacher: 'Mrs. Usha Srivastava',
                    room: '604',
                    schedule: 'Morning',
                    subjects: 9,
                    performance: 88
                }
            }
        }
    });



    // useEffect(() => {
    //     setAcademicData(standards)
    // }, [standards?.length]);


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

    const totalStudents = standards?.reduce(
        (sum, std) =>
            sum +
            (std.classes?.reduce(
                (classSum, cls) => classSum + (cls.number_of_students || 0),
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
        // if (selectedStandard === 'all') return academicData;
        if (selectedStandard === 'all') return standards;
        return { selectedStandard };
    }, [selectedStandard, academicData]);

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



    // ==================================================================
    return (
        <>
                <div className="min-h-screen bg-gray-50 p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                                        <School className="w-8 h-8 text-blue-600" />
                                        Standards & Classes Management
                                    </h1>
                                    <p className="text-gray-600">Academic Structure Overview - Academic Year 2024-25</p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        <Download className="w-4 h-4" />
                                        Export Data
                                    </button>
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
                                        <GraduationCap className="w-7 h-7 text-blue-600" />
                                    </div>

                                    {/* Text Content */}
                                    <div>
                                        <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                            {Object.keys(academicData).length}
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
                                        <BookOpen className="w-6 h-6 text-green-600" />
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

                        {/* ============================  Controls ============================  */}
                        {/* <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                            <div className="flex flex-wrap gap-4 items-center justify-between">
                                <div className="flex flex-wrap gap-4 items-center">
                                    <div className="relative">
                                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search standards or classes..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-gray-500" />
                                    <select
                                        value={selectedStandard}
                                        onChange={(e) => setSelectedStandard(e.target.value)}
                                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">All Standards</option>
                                        {Object.entries(standards).map(([key, standard]) => (
                                            <option key={key.id} value={key.id}>{standard.name}</option>
                                        ))}
                                    </select>
                                </div>

                                    <div className="flex bg-gray-100 rounded-lg p-1">
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`px-3 py-1 rounded-md text-sm transition-colors ${viewMode === 'list'
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                        >
                                            List View
                                        </button>
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`px-3 py-1 rounded-md text-sm transition-colors ${viewMode === 'grid'
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                        >
                                            Grid View
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                                        <BarChart3 className="w-4 h-4" />
                                        Analytics
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                                        <Settings className="w-4 h-4" />
                                        Settings
                                    </button>
                                </div>
                            </div>
                        </div> */}

                        {/* Main Content */}
                        {viewMode === 'list' ? (
                            /* List View */
                            <div className="space-y-4">
                                {Object.entries(filteredData).map(([standardKey, standardData]) => {

                                    // console.log('===== standardData=====', standardData);

                                    return (
                                        <div

                                            key={standardKey.id}
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
                                                            {/* <div className='flex items-center gap-1'>
                                                            <Mars size={14} /> {standardData.student_count?.MALE}
                                                        </div>
                                                        <div className='flex items-center gap-1'>
                                                            <Venus size={14} /> {standardData.student_count?.FEMALE}
                                                        </div> */}
                                                            {/* <span><Mars size={14}/> {standardData.student_count?.MALE}</span>
                                                    <span>Female: {standardData.student_count?.FEMALE}</span> */}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-2">
                                                            {/* <span className="text-sm text-gray-600">Subjects: {standardData.subjects.length}</span> */}
                                                            <span className="text-sm text-gray-600">Exams: {standardData?.fees?.length}</span>
                                                        </div>

                                                        <div className="relative">
                                                            <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Classes Table */}
                                            {expandedStandards.has(standardData.id) && (
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-full divide-y divide-gray-200">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Class Name
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Class Teacher
                                                                </th>
                                                                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Students
                                                            </th> */}
                                                                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Room
                                                        </th> */}
                                                                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Performance
                                                            </th> */}
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Actions
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white divide-y divide-gray-200">
                                                            {standardData.classes?.map((classData) => (
                                                                <tr key={classData.id} className="hover:bg-gray-50">
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <div className="flex items-center">
                                                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                                                                <BookOpen className="w-4 h-4 text-blue-600" />
                                                                            </div>
                                                                            <div
                                                                                className='bg-white'
                                                                                onClick={() => {
                                                                                    setSelectedClass(classData);  // store the clicked class
                                                                                    setShowModal(true);           // open modal
                                                                                }}
                                                                            >
                                                                                <div className="text-sm font-medium text-gray-900">{classData.section}</div>
                                                                                <div className="cursor-pointer text-sm text-gray-500">{classData?.students?.length} Students</div>



                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                        {classData.class_teacher?.name}
                                                                    </td>
                                                                    {/* <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="flex items-center">
                                                                        <span className={`text-sm font-medium ${getOccupancyColor(classData.students.length, classData.capacity)}`}>
                                                                            {classData.total_number_of_students}/{120}
                                                                        </span>
                                                                        <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                                                                            <div
                                                                                className={`h-2 rounded-full ${(classData.students / classData.capacity) >= 0.95 ? 'bg-red-500' :
                                                                                    (classData.students / classData.capacity) >= 0.85 ? 'bg-yellow-500' : 'bg-green-500'
                                                                                    }`}
                                                                                style={{ width: `${(classData.students / classData.capacity) * 100}%` }}
                                                                            ></div>
                                                                        </div>
                                                                    </div>
                                                                </td> */}
                                                                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                Room {classData.room}
                                                            </td> */}
                                                                    {/* <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(classData.performance)}`}>
                                                                        {classData.performance}%
                                                                    </span>
                                                                </td> */}
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                        <div className="flex items-center gap-2">
                                                                            <button className="text-blue-600 hover:text-blue-900">
                                                                                <Eye className="w-4 h-4" />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => {
                                                                                    setSelectedItem({ type: 'class', standardKey, classKey, data: classData });
                                                                                    setModalType('class');
                                                                                    setShowEditModal(true);
                                                                                }}
                                                                                className="text-gray-600 hover:text-gray-900"
                                                                            >
                                                                                <Edit2 className="w-4 h-4" />
                                                                            </button>
                                                                            <button className="text-green-600 hover:text-green-900">
                                                                                <UserPlus className="w-4 h-4" />
                                                                            </button>
                                                                            <button className="text-red-600 hover:text-red-900">
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>

                                                    {/* Add Class Button */}
                                                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedItem({ standardKey });
                                                                setModalType('class');
                                                                setShowAddModal(true);
                                                            }}
                                                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                            Add New Class to {standardData.standardName}
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
                            <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
                                <div className="bg-white border border-accent ring-2 rounded-lg p-6 w-full max-w-md">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                        Add New {modalType === 'standard' ? 'Standard' : 'Class'}
                                    </h2>

                                    <form className="space-y-4">
                                        {modalType === 'standard' ? (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Standard Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g., 11th Standard"
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Class Teacher
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g., Mrs. Priya Sharma"
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Number of Classes
                                                    </label>
                                                    <input
                                                        type="number"
                                                        placeholder="4"
                                                        min="1"
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Class Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g., VI-E"
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Class Teacher
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g., Mrs. Sunita Kumar"
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Room Number
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="205"
                                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Capacity
                                                        </label>
                                                        <input
                                                            type="number"
                                                            placeholder="50"
                                                            min="1"
                                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Schedule
                                                    </label>
                                                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                        <option value="Morning">Morning Shift</option>
                                                        <option value="Afternoon">Afternoon Shift</option>
                                                    </select>
                                                </div>
                                            </>
                                        )}
                                    </form>

                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            onClick={() => setShowAddModal(false)}
                                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => setShowAddModal(false)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            Add {modalType === 'standard' ? 'Standard' : 'Class'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Edit Modal */}
                        {showEditModal && selectedItem && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                        Edit {selectedItem.type === 'standard' ? 'Standard' : 'Class'}
                                    </h2>

                                    <form className="space-y-4">
                                        {selectedItem.type === 'class' && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Class Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        defaultValue={selectedItem.data.className}
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Class Teacher
                                                    </label>
                                                    <input
                                                        type="text"
                                                        defaultValue={selectedItem.data.classTeacher}
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Room Number
                                                        </label>
                                                        <input
                                                            type="text"
                                                            defaultValue={selectedItem.data.room}
                                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Capacity
                                                        </label>
                                                        <input
                                                            type="number"
                                                            defaultValue={selectedItem.data.capacity}
                                                            min="1"
                                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Current Students
                                                    </label>
                                                    <input
                                                        type="number"
                                                        defaultValue={selectedItem.data.students}
                                                        min="0"
                                                        max={selectedItem.data.capacity}
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Schedule
                                                    </label>
                                                    <select
                                                        defaultValue={selectedItem.data.schedule}
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="Morning">Morning Shift</option>
                                                        <option value="Afternoon">Afternoon Shift</option>
                                                    </select>
                                                </div>
                                            </>
                                        )}
                                    </form>

                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            onClick={() => {
                                                setShowEditModal(false);
                                                setSelectedItem(null);
                                            }}
                                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowEditModal(false);
                                                setSelectedItem(null);
                                            }}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Quick Stats Summary */}
                        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Summary</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{standards.reduce((sum, std) => sum + (std?.classes?.length || 0), 0)}</div>
                                    <div className="text-sm text-gray-600">Total Classes</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">{stats.totalStudents}</div>
                                    <div className="text-sm text-gray-600">Total Enrollment</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">{stats.totalCapacity}</div>
                                    <div className="text-sm text-gray-600">Total Capacity</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-yellow-600">{stats.occupancyRate}%</div>
                                    <div className="text-sm text-gray-600">Occupancy Rate</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>




            {
                showModal ? (
                    <StudentsModal
                        selectedData={selectedClass}
                    // onClose={() => setShowModal(false)}
                    />
                ) : null
            }
        </>
    );
};
// ==================================================================
export default StandardsClassesManagement;
// ==================================================================