import React, { useEffect, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Target,
  Search,
  Filter,
  Download,
  Upload,
  Settings,
  ChevronDown,
  X,
  Save,
  AlertCircle,
  Check,
  Book,
  FileText,
  Video,
  Home,
  Users,
  GraduationCap,
  Star,
  Eye,
  MoreHorizontal,
  Calendar,
  Award,
  MessageSquareText,
  PenTool,
  AlignVerticalJustifyEndIcon,
  ChevronRight,
  MonitorCog,
  BookOpen,
  Calculator,
  FlaskConical,
  Flag,
  Globe,
  ScrollText,
  Map,
  IndianRupee,
  CaseUpper,
} from 'lucide-react';
import { getSubjectsList } from '../../../api/subjects';
import { getExamList } from '../../../api/exam';
import Loader from '../../../components/ui/status/Loader';
import { useParams } from 'next/navigation';
import Tabs from './Tabs';
import SubjectsTabs from './SubjectsTabs';
// ===================================================================================================
const SubjectsManagement = ({
  classes,
  subjects,
  selectedStandard,
  setSelectedStandard,
  cookyGuid,
  cookyId

}) => {


  // ===================================================================================================
  const { profile, session } = useParams()
  // ===================================================================================================

  const [subjects_, setSubjects] = useState();
  // const [subjectsOptions, setSubjectsOptions] = useState();
  const [exams_, setExams] = useState([]);
  const [loading, setLoading] = useState(false); // New loading state
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

  // ===================================================================================================

  const fetchData = async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      console.log(selectedStandard, cookyGuid, profile, session, cookyId);

      const subjectRes = await getSubjectsList(selectedStandard, profile, session, cookyGuid, cookyId);
      // setSubjectsOptions(subjectRes?.results?.items[0].options)

      const examRes = await getExamList(selectedStandard);
      setSubjects(subjectRes?.results?.items || []);
      setExams(examRes?.results?.items || []);
    } catch (error) {
      setLoading(false); // Set loading to true before fetching data

      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  useEffect(() => {
    if (!selectedStandard) return;
    fetchData();
  }, [selectedStandard]);
  // console.log(' ----- currentSubjects -------', subjects_)


  const currentSubjects = (subjects_)
    // .filter(subject => subject?.id === selectedStandard)
    ?.filter(subject => {
      const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' ||
        // (filterType === 'mandatory' && !subject.is_optional) ||
        (filterType === 'mandatory') ||
        // (filterType === 'optional' && subject.is_optional);
        (filterType === 'optional');
      return matchesSearch && matchesFilter;
    });
  // ===================================================================================================
  const actionConfig = {
    edit: {
      icon: Edit2,
      styles: 'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 focus:bg-emerald-50',
      iconColor: 'text-emerald-600 group-hover:text-emerald-700',
      description: 'Edit this item'
    },
    delete: {
      icon: Trash2,
      styles: 'text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50',
      iconColor: 'text-red-600 group-hover:text-red-700',
      description: 'Delete this item'
    },
    view: {
      icon: Eye,
      styles: 'text-slate-700 hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100',
      iconColor: 'text-slate-500 group-hover:text-slate-600',
      description: 'View details'
    },
    examInfo: {
      icon: FileText,
      styles: 'text-blue-600 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50',
      iconColor: 'text-blue-600 group-hover:text-blue-700',
      description: 'View exam information'
    },
    viewHomework: {
      icon: PenTool,
      styles: 'text-purple-600 hover:bg-purple-50 hover:text-purple-700 focus:bg-purple-50',
      iconColor: 'text-purple-600 group-hover:text-purple-700',
      description: 'View homework assignments'
    },
    viewOnlineClasses: {
      icon: Video,
      styles: 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 focus:bg-indigo-50',
      iconColor: 'text-indigo-600 group-hover:text-indigo-700',
      description: 'View online classes'
    },
    viewOnlineExams: {
      icon: BookOpen,
      styles: 'text-orange-600 hover:bg-orange-50 hover:text-orange-700 focus:bg-orange-50',
      iconColor: 'text-orange-600 group-hover:text-orange-700',
      description: 'View online exams'
    },
  };

  // Enhanced ActionMenuItem with better animations and accessibility
  const ActionMenuItem = ({ data, onAction }) => {
    const config = actionConfig[data?.action];

    if (!config) {
      return null;
    }

    const IconComponent = config.icon;
    const styles = config.styles;
    const iconColor = config.iconColor;

    const handleClick = () => {
      if (onAction) {
        onAction(data);
      }
      if (data?.redirect_url) {
        console.log(`Navigating to: ${data.redirect_url}`);
      }
    };

    return (
      <button
        onClick={handleClick}
        className={`group flex items-center gap-3 w-full px-4 py-3 text-sm font-medium 
        transition-all duration-200 ease-in-out rounded-lg border border-transparent
        hover:scale-[1.02] hover:shadow-sm active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-200
        ${styles} text-left`}
        title={config.description}
      >
        <div className="flex-shrink-0">
          <IconComponent className={`w-4 h-4 transition-colors duration-200 ${iconColor}`} />
        </div>
        <span className="flex-1 truncate">{data.label}</span>
        <div className="w-1 h-1 rounded-full bg-current opacity-0 group-hover:opacity-30 transition-opacity duration-200" />
      </button>
    );
  };

  // Enhanced ActionMenu with better styling and animations
  const ActionMenu = ({ actions, onAction, title }) => {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200/60 p-2 min-w-[200px] backdrop-blur-sm">
        {title && (
          <div className="px-4 py-2 border-b border-gray-100 mb-2">
            <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
          </div>
        )}
        <div className="space-y-1">
          {actions.map((action, index) => (
            <ActionMenuItem
              key={`${action.action}-${index}`}
              data={action}
              onAction={onAction}
            />
          ))}
        </div>
      </div>
    );
  };


  const getSubjectIcon = (name) => {
    const iconMap = {
      'ENGLISH': CaseUpper,
      'MATHEMATICS': Calculator,
      'SCIENCE': FlaskConical,
      'HINDI': IndianRupee,
      'SOCIAL': Globe,
      'HISTORY': ScrollText,
      'GEOGRAPHY': Map,
    };
    return iconMap[name.toUpperCase()] || BookOpen;
  };

  const getGradientClass = (index) => {
    const gradients = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-teal-600',
      'from-orange-500 to-red-600',
      'from-pink-500 to-rose-600',
      'from-indigo-500 to-blue-600',
      'from-yellow-500 to-orange-600'
    ];
    return gradients[index % gradients.length];
  };

  const SubjectModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add New Subject</h2>
              <p className="text-gray-500">Configure a new subject for this standard</p>
            </div>
          </div>
          <button
            onClick={() => setShowSubjectModal(false)}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Subject Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter subject name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Subject Code</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g., MATH, ENG"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Priority</label>
              <input
                type="number"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="1"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Entry Parameter</label>
              <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                <option value="MARKS">Marks</option>
                <option value="GRADE">Grade</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <input type="checkbox" id="optional" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
              <label htmlFor="optional" className="text-sm font-medium text-gray-700">
                Optional Subject
              </label>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <input type="checkbox" id="acceptsAverage" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
              <label htmlFor="acceptsAverage" className="text-sm font-medium text-gray-700">
                Accepts Average
              </label>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <input type="checkbox" id="acceptsRemarks" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
              <label htmlFor="acceptsRemarks" className="text-sm font-medium text-gray-700">
                Accepts Remarks
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => setShowSubjectModal(false)}
              className="px-6 py-3 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 font-medium"
            >
              <Save className="w-5 h-5" />
              Save Subject
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const TestModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Test Configuration</h2>
              <p className="text-gray-500">{selectedSubject?.name} - Configure all tests and weightages</p>
            </div>
          </div>
          <button
            onClick={() => setShowTestModal(false)}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-900">Test Structure Overview</span>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{selectedSubject?.tests?.length || 0}</div>
              <div className="text-sm text-blue-800">Total Tests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {selectedSubject?.tests?.reduce((sum, test) => sum + test.weightage, 0)}%
              </div>
              <div className="text-sm text-purple-800">Total Weightage</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {selectedSubject?.tests?.reduce((sum, test) => sum + test.maxMarks, 0)}
              </div>
              <div className="text-sm text-green-800">Total Marks</div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Test Details</h3>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 font-medium">
            <Plus className="w-5 h-5" />
            Add New Test
          </button>
        </div>

        <div className="grid gap-6">
          {selectedSubject?.tests?.map((test, index) => (
            <div key={test.id} className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${getGradientClass(index)} rounded-xl flex items-center justify-center text-white text-lg font-bold`}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{test.name}</h4>
                    <p className="text-gray-500">Assessment Configuration</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="text-blue-600 text-sm font-semibold mb-2">Max Marks</div>
                  <div className="text-2xl font-bold text-blue-900">{test.maxMarks}</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                  <div className="text-green-600 text-sm font-semibold mb-2">Pass Marks</div>
                  <div className="text-2xl font-bold text-green-900">{test.passMarks}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                  <div className="text-purple-600 text-sm font-semibold mb-2">Weightage</div>
                  <div className="text-2xl font-bold text-purple-900">{test.weightage}%</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                  <div className="text-emerald-600 text-sm font-semibold mb-2">Status</div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-900">Active</span>
                  </div>
                </div>
              </div>

              {/* Progress bar for weightage */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Contribution to Total</span>
                  <span className="font-semibold">{test.weightage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r ${getGradientClass(index)} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${test.weightage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 pt-8 border-t mt-8">
          <button
            onClick={() => setShowTestModal(false)}
            className="px-6 py-3 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 font-medium transition-colors"
          >
            Close
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 font-medium">
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
  // ===================================================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      {/* --------------------------------------------------------------------------------------------------- */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20 sticky top-0 z-40">
        <div className="mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Subjects Management
              </h1>
              <p className="text-gray-600 mt-1">Configure subjects, tests, and marking schemes for each standard</p>
            </div>
            {/* This container now uses `flex-col` for small screens and `sm:flex-row` for larger screens. */}
            {/* This is the key change to make the buttons stack. */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center sm:justify-start gap-2 font-medium">
                <Upload className="w-5 h-5" />
                Import
              </button>
              <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center sm:justify-start gap-2 font-medium">
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* --------------------------------------------------------------------------------------------------- */}

      <div className=" mx-auto px-6 py-8">
        {/* Controls Section */}

    
      {/* Filter and Controls Section */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 mb-8 mt-8 mx-auto">
        {/* The grid layout is now responsive. On small screens, it uses a single column (`grid-cols-1`),
            and on medium screens and up, it reverts to the 12-column layout. */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          {/* Select Standard Dropdown */}
          <div className="col-span-full md:col-span-3">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Select Standard</label>
            <select
              value={selectedStandard}
              onChange={(e) => setSelectedStandard(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-medium"
            >
              {classes?.map(standard => (
                <option key={standard?.id} value={standard?.id}>
                  {standard?.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Subjects Input */}
          <div className="col-span-full md:col-span-4">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Search Subjects</label>
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by subject name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Filter by Type Dropdown */}
          <div className="col-span-full md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-medium"
            >
              <option value="all">All Subjects</option>
              <option value="mandatory">Mandatory Only</option>
              <option value="optional">Optional Only</option>
            </select>
          </div>

          {/* View Mode and Add Buttons */}
          <div className="col-span-full md:col-span-3 flex flex-col md:flex-row gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              {viewMode === 'cards' ? '📋' : '🎴'}
              {viewMode === 'cards' ? 'Table' : 'Cards'}
            </button>
            <button
              onClick={() => setShowSubjectModal(true)}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>
        </div>
      </div>
        {/* --------------------------------------------------------------------------------------------------- */}

        {/* Stats Cards */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Subjects</p>
                <p className="text-3xl font-bold text-gray-900">{currentSubjects?.length}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Mandatory</p>
                <p className="text-3xl font-bold text-green-600">{currentSubjects?.filter(s => !s?.is_optional)?.length}</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-teal-600 p-3 rounded-xl">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Optional</p>
                <p className="text-3xl font-bold text-orange-600">{currentSubjects?.filter(s => s?.is_optional)?.length}</p>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-xl">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Chapters</p>
                <p className="text-3xl font-bold text-purple-600">
                  {currentSubjects?.reduce((sum, s) => sum + parseInt(s?.chapters?.count || 0), 0)}
                </p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl">
                <Book className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
        {/* --------------------------------------------------------------------------------------------------- */}

        {/* Subjects Display */}
        {!loading ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Subjects for {classes?.find(s => s?.id === selectedStandard)?.name}
                </h2>
                <div className="text-sm text-gray-500">
                  {currentSubjects?.length} subjects found
                </div>
              </div>
            </div>



            {/* ==================================================== */}

            <SubjectsTabs subjects={currentSubjects} />
            {/* ============================================================= */}




            {viewMode === 'cards' ? (
              // Cards View
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {currentSubjects?.map((subject, index) => {
                    const SubjectIcon = getSubjectIcon(subject.name);

                    return (
                      <div key={subject?.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden">
                        {/* Card Header */}
                        <div className={`h-2 bg-gradient-to-r ${getGradientClass(index)}`}></div>

                        <div className="p-6">
                          {/* Subject Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 bg-gradient-to-r ${getGradientClass(index)} rounded-xl flex items-center justify-center text-2xl`}>
                                <SubjectIcon className="w-7 h-7 text-gray-200" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-900">{subject?.name}</h3>
                                <p className="text-gray-500 font-mono text-sm">{subject?.code}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${subject?.is_optional
                                ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                : 'bg-green-100 text-green-700 border border-green-200'
                                }`}>
                                {subject?.is_optional ? 'Optional' : 'Mandatory'}
                              </div>
                              <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                                {subject?.priority}
                              </div>
                            </div>
                          </div>

                          {/* Stats Grid */}
                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-100">
                              <div className="text-lg font-bold text-blue-600">{subject?.chapters.count}</div>
                              <div className="text-xs text-blue-700 font-medium">Chapters</div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-xl border border-purple-100">
                              <div className="text-lg font-bold text-purple-600">{subject?.topics.count}</div>
                              <div className="text-xs text-purple-700 font-medium">Topics</div>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-xl border border-green-100">
                              <div className="text-lg font-bold text-green-600">{subject?.study_materials.count}</div>
                              <div className="text-xs text-green-700 font-medium">Materials</div>
                            </div>
                          </div>

                          {/* Features */}
                          <div className="flex flex-wrap gap-2 mb-6">
                            {subject.accepts_average_for_child_subjects && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1">
                                <Target className="w-3 h-3" />
                                Accepts Average : {subject.accepts_average_for_child_subjects}
                              </span>
                            )}
                            {subject.accepts_remarks && (
                              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                Remarks
                              </span>
                            )}
                            {subject.take_average_in_parent_exam && (
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                Parent Avg
                              </span>
                            )}
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                              {subject.entry_parameter}
                            </span>
                          </div>

                          {/* Parent Subject */}
                          {subject.parent_subject && (
                            <div className="mb-4">
                              <div className="text-sm font-medium text-gray-700 mb-2">Parent Subject:</div>
                              <div className="px-3 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm border border-orange-200">
                                {subject.parent_subject.name}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Card Actions */}
                        <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => {
                                setSelectedSubject(subject);
                                setShowTestModal(true);
                              }}
                              className="cursor-pointer px-4 py-2 bg-purple-100  border border-black-200 ring-1 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors flex items-center gap-2"
                            >
                              <Target className="w-4 h-4" />
                              Exam Info
                            </button>

                            {/* =================== Actions ==================================== */}
                            {/* <button
                            onClick={() => {
                              setSelectedSubject(subject);
                              setShowActions((prevState) => !prevState);
                            }}
                            className="cursor-pointer px-4 py-2 bg-white border border-black-200 ring-1 text-black-700 rounded-lg text-sm font-medium hover:bg-black-200 transition-colors flex items-center gap-2"
                          >
                            <MonitorCog className="w-4 h-4" />
                            Actions
                          </button> */}
                            {/* ====================================================== */}
                          </div>
                        </div>


                        {showActions && subject?.id === selectedSubject.id && < ActionMenu
                          actions={subject?.options}
                          showActions={showActions}
                        />}

                        {/* ====================================================== */}
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              // Table View
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Subject Details
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Content
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Tests
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Features
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentSubjects.map((subject, index) => {
                      const SubjectIcon = getSubjectIcon(subject.name);

                      return (
                        <tr key={subject.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${getGradientClass(index)} rounded-xl flex items-center justify-center text-xl`}>
                                <SubjectIcon className="w-7 h-7 text-gray-200" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-bold text-gray-900">{subject.name}</div>
                                <div className="text-sm text-gray-500 font-mono">{subject.code}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                              {subject.priority}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${subject.is_optional
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-green-100 text-green-800 border border-green-200'
                              }`}>
                              {subject.is_optional ? 'Optional' : 'Mandatory'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex justify-center gap-3 text-sm">
                              <div className="text-blue-600 font-semibold">{subject.chapters.count}C</div>
                              <div className="text-purple-600 font-semibold">{subject.topics.count}T</div>
                              <div className="text-green-600 font-semibold">{subject.study_materials.count}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button
                              onClick={() => {
                                setSelectedSubject(subject);
                                setShowTestModal(true);
                              }}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                            >
                              <Target className="w-4 h-4" />
                              {subject.tests?.length || 0} Tests
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-2">
                              {subject.accepts_average_for_child_subjects === "1" && (
                                <div className="w-2 h-2 bg-blue-400 rounded-full" title="Accepts Average"></div>
                              )}
                              {subject.accepts_remarks === "1" && (
                                <div className="w-2 h-2 bg-purple-400 rounded-full" title="Accepts Remarks"></div>
                              )}
                              {subject.take_average_in_parent_exam === "1" && (
                                <div className="w-2 h-2 bg-green-400 rounded-full" title="Takes Average in Parent"></div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                                <Settings className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Empty State */}
            {currentSubjects?.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No subjects found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding subjects for this standard'}
                </p>
                <button
                  onClick={() => setShowSubjectModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Add First Subject
                </button>
              </div>
            )}
          </div>
        ) : <Loader />}
      </div >
      {/* --------------------------------------------------------------------------------------------------- */}

      {/* Modals */}
      {showSubjectModal && <SubjectModal />}
      {showTestModal && <TestModal />}
    </div >
  );
};
// ===================================================================================================

export default SubjectsManagement;