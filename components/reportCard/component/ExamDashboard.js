import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Users,
  Award,
  MoreVertical,
  Eye,
  Edit,
  Info,
  FileText,
  Clock,
  Monitor,
  BarChart3,
  Trash2,
  CheckCircle,
  XCircle,
  Calendar,
  Layers,
  Settings,
  Zap,
  Target,
  AwardIcon,
  Search,
  Plus
} from 'lucide-react';
import { getExamList } from '../../../api/exam';
import { useParams } from 'next/navigation';
import LoaderWIthoutBgBlurr from '../../../components/ui/status/LoaderWIthoutBgBlurr';

const ExamManagement = ({
  classes,
  subjects,
  selectedStandard,
  setSelectedStandard,
  cookyGuid,
  cookyId
}) => {
  const { profile, session } = useParams()



  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table"); // table or grid
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false); // New loading state

  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Use useEffect to handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  // Mock exam data for demonstration (will be used if exams prop is empty)


  const displayExams = exams.length > 0 ? exams : [];

  const getActionIcon = (action) => {
    const iconMap = {
      view: Eye,
      edit: Edit,
      examInfo: Info,
      examSyllabus: FileText,
      viewExamSchedule: Clock,
      viewOnlineExams: Monitor,
      viewMarksEntryReport: BarChart3,
      delete: Trash2
    };
    return iconMap[action] || Eye;
  };

  const handleActionClick = (exam, option) => {
    if (option.alert) {
      const confirmed = window.confirm(option.alert.message || 'Are you sure?');
      if (!confirmed) return;
    }

    console.log(`Action: ${option.action}`, {
      examId: exam.id,
      examName: exam.name,
      api: option.api,
      redirectUrl: option.redirect_url
    });

    setActiveDropdown(null);
  };

  const toggleDropdown = (examId) => {
    setActiveDropdown(activeDropdown === examId ? null : examId);
  };

  const MetricBadge = ({ metric, icon: Icon }) => {
    if (!metric || !metric.text) return null;

    return (
      <div
        className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
        style={{
          backgroundColor: metric.background_color,
          color: metric.text_color
        }}
      >
        {Icon && <Icon className="h-3 w-3" />}
        <span>{metric.key}:</span> <span className="font-bold">{metric.text}</span>
      </div>
    );
  };




  const fetchData = async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      // console.log(selectedStandard, cookyGuid, profile, session, cookyId);

      // setSubjectsOptions(subjectRes?.results?.items[0].options)

      const examRes = await getExamList(selectedStandard, profile, session, cookyGuid, cookyId);

      console.log('examRes', examRes);

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










  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">Exam Management</h1>
        <p className="text-sm text-gray-500">Manage and monitor all examinations</p>
      </div>





      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 mb-8">
        <div className="grid grid-cols-12 gap-6 items-end">
          <div className="col-span-3">
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

          <div className="col-span-4">
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

          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by Type</label>
            <select
              // value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-medium"
            >
              <option value="all">All Subjects</option>
              <option value="mandatory">Mandatory Only</option>
              <option value="optional">Optional Only</option>
            </select>
          </div>

          <div className="col-span-2">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                {viewMode === 'cards' ? '📋' : '🎴'}
                {viewMode === 'cards' ? 'Table' : 'Cards'}
              </button>
            </div>
          </div>

          <div className="col-span-1">
            <button
              onClick={() => setShowSubjectModal(true)}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>
        </div>
      </div>







      {loading ? (
        <LoaderWIthoutBgBlurr />
      ) : (
        <>
          {displayExams.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-white">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No exams found</h3>
              <p className="text-sm text-gray-500">Start by creating your first exam.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayExams.map((exam) => (
                <div key={exam.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-t-xl" />

                  {/* Header */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-5 w-5 text-gray-500" />
                          <h3 className="text-xl font-bold text-gray-900 leading-tight">{exam.name}</h3>
                        </div>
                        <p className="text-xs text-gray-400 font-medium mb-3">ID: {exam.id}</p>

                        <div className="flex items-center text-sm font-medium text-gray-600 mb-3">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          <span>Standard: {exam.standard?.name}</span>
                        </div>

                        <div className="flex items-center flex-wrap gap-2">
                          <MetricBadge metric={exam.max_marks} icon={AwardIcon} />
                          <MetricBadge metric={exam.pass_marks} icon={Target} />
                          <MetricBadge metric={exam.no_of_working_days} icon={Clock} />
                        </div>
                      </div>

                      {/* Actions Dropdown */}
                      <div className="relative z-10" ref={activeDropdown === exam.id ? dropdownRef : null}>
                        <button
                          onClick={() => toggleDropdown(exam.id)}
                          className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="h-5 w-5 text-gray-500" />
                        </button>

                        {activeDropdown === exam.id && (
                          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 divide-y divide-gray-100 origin-top-right animate-fade-in-up">
                            <div className="py-1">
                              {exam.options?.map((option, index) => {
                                const IconComponent = getActionIcon(option.action);
                                return (
                                  <button
                                    key={index}
                                    onClick={() => handleActionClick(exam, option)}
                                    className={`w-full px-4 py-2 text-left flex items-center gap-3 text-sm transition-colors ${option.action === 'delete' ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'}`}
                                  >
                                    <IconComponent className="h-4 w-4 flex-shrink-0" />
                                    {option.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 sm:p-5 bg-gray-50 rounded-b-2xl border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        {exam.round_off_marks === "1" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                        <span>Round Off</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {exam.take_best_average === "1" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                        <span>Best Average</span>
                      </div>
                    </div>
                    {exam.display_native_ad && (
                      <div className="flex items-center gap-1.5 text-blue-500 font-bold" title="Native Ad Enabled">
                        <Zap className="h-4 w-4" />
                        <span>Ad Enabled</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExamManagement;