'use client';
import React, { useEffect, useState, useRef } from 'react';
import { User, Book, Users, Heart, BadgePlus, List, Save, FileInput, House, } from 'lucide-react';
import Layout from '../../layouts/Layout';
import { StudentList } from './listStudent';
import StudentProfile from './studentProfile';
import { getSessionCache } from '../../utils/sessionCache';
import { addStudent, getStudentList } from '../../api/student';
import { Breadcrumbs } from '../ui/Breadcrumb/breadcrumb';
import BasicInfoForm from './BasicInfoForm';
import PersonalInfoForm from './PersonalInfoForm';
import FamilyInfoForm from './FamilyInfoForm';
import AcademicInfoForm from './AcademicInfoForm';
import DocumentInfoForm from './DocumentInfoForm';
import { useStudent } from '../../context/studentContext';
import HouseManagement from './houseList';
import ParentManagement from './parents';
import Birthdays from './birthdays';
import { getHouseList } from '../../api/houses';
import { useSearchParams } from "next/navigation";
import { IoPeopleSharp } from 'react-icons/io5';
import { FaBirthdayCake } from 'react-icons/fa';


const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Manage Students" },
];

const tabs = [
  { id: 'list', label: 'List Students', icon: List },
  { id: 'add', label: 'Add Student', icon: BadgePlus },
  { id: 'view', label: 'View Profile', icon: User },
  { id: 'houses', label: 'Houses', icon: House },
  { id: 'parents', label: 'Parents', icon: IoPeopleSharp },
  { id: 'birthdays', label: 'Birthdays', icon: FaBirthdayCake }
];

const StudentMangementDashboard = ({ cookyGuid, cookyId, }) => {

  const searchParams = useSearchParams();
  const { selectedStudent, setSelectedStudent } = useStudent()
  const [studentListData, setStudentListData] = useState([]);
  const [houses_, setHouses] = useState([]);
  const [isHouseUpdatedOrCreated, setIsHouseUpdatedOrCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [studentUpdated, setStudentUpdated] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);



  const [filters, setFilters] = useState({
    class: "",
    name: '',
    admissionNumber: '',
    phoneNumber: '',
    fatherName: '',
    motherName: '',
    dob: '',
    appUsed: "",
    isSearch: false,
    gender: '',
    phone: '',
    admission_number: '',
    father_name: '',
    mother_name: '',
    date_of_birth: "",
    registration_number: "",
    registered_phone_for_sms: "",
    optional_subject: "",
    email: "",
    renewal_status: "",
    non_app_user: "",
    is_registered: "",
    with_out_any_phone_number: "",



  });





  const config = getSessionCache("dashboardConfig");
  const Context = getSessionCache("dashboardContext");


  const context = getSessionCache('dashboardContext') || {};

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await getStudentList(
        context?.profileId,
        context?.session,
        filters
      );
      // console.log('data', data?.data?.results);


      if (mounted.current) setStudentListData(data?.data?.results?.students);
    } catch (err) {
      if (mounted.current) setError(err);
      console.error('Failed to load student list', err);
    } finally {
      setIsFilterPanelOpen(false)
      if (mounted.current) setLoading(false);
    }
  }

  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    load();
    return () => { mounted.current = false; };
  }, [

    filters?.class,
    filters?.status,

    filters?.isSearch
  ]);


  const fetchHouses = async () => {
    const repso = await getHouseList(
      Context?.profileId,
      Context?.session,
    )

    setHouses(repso?.results?.items || []);
  }


  useEffect(() => {
    fetchHouses();
  }, [isHouseUpdatedOrCreated]);






  const classesOptions = config?.standards || [];
  const classes = config?.classes || [];
  const schoolOptions = config?.school || [];
  const houses = config?.houses || [];
  const genderOptions = config?.gender_students || [];
  const religionsOptions = config?.religions || [];
  const motherTonguesOptions = config?.mother_tongues || [];
  const nationalitiesOptions = config?.nationalities || [];
  const bloodGroupsOptions = config?.blood_groups || [];
  const categoriesOptions = config?.caste_categories || [];
  const renewalStatus = config?.renewal_status_list || [];






  const [activeTab, setActiveTab] = useState(selectedStudent?.id ? 'view' : 'list');
  // const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentFormStep, setCurrentFormStep] = useState('basic');
  // console.log(selectedStudent,"selectedStudent");



  // Form state
  const [formData, setFormData] = useState({
    // Basic Information
    school: '',
    class: '',
    gender: '',
    name: '',
    rollNo: '',
    phone: '',
    alternatePhone: '',
    email: '',
    dateOfBirth: '',
    aadharCard: '',

    // Personal Details
    religion: '',
    motherTongue: '',
    nationality: 'Indian',
    bloodGroup: '',
    address: '',

    // School Details
    registrationNumber: '',
    documents: {},


    // Parents Information
    parents: [
      { name: '', gender: 'MALE', relation: "FATHER", qualification: '', annualIncome: '', phones: [''] },
      { name: '', gender: 'FEMALE', relation: "MOTHER", qualification: '', annualIncome: '', phones: [''] },
      { name: '', gender: 'MALE', relation: "GUARDIAN", qualification: '', annualIncome: '', phones: [''] },
    ],
    siblings: [],


    previousSchool: "",
    scholarship: "",
    yearOfPassing: "",
    previousRollNo: "",
    previousBoard: "",
    boardRegNo: "",
    previousPercentage: "",
    previousWorkingDays: "",
    permanentEduNo: "",
    studentRemarks: "",
    permanent_address: "",
    distanceToSchool: "",




    smsRegisteredNumber: "",
    emergencyContactNumber: "",





    name_matches_with_aadhaar: "",
    date_of_birth_matches_with_aadhaar: "",
    father_name_matches_with_aadhaar: "",
    address_matches_with_aadhaar: "",







    optionalSubjects: []


  });

  const formSteps = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'personal', label: 'Personal Details', icon: Heart },
    { id: 'parents', label: 'Parents Info', icon: Users },
    { id: 'academic', label: 'Academic Info', icon: Book },
    { id: 'documents', label: 'Documents', icon: FileInput }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleParentChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      parents: prev.parents.map((parent, i) =>
        i === index ? { ...parent, [field]: value } : parent
      )
    }));
  };

  const addParent = () => {
    setFormData(prev => ({
      ...prev,
      parents: [...prev.parents, { name: '', gender: '', relation: '', phone: '', email: '', occupation: '', address: '' }]
    }));
  };

  const removeParent = (index) => {
    setFormData(prev => ({
      ...prev,
      parents: prev.parents.filter((_, i) => i !== index)
    }));
  };





  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      // Prepare the payload for your API
      const payload = {
        ...formData,
        school: Context?.schoolId
        // You can transform or validate fields here if needed
      };


      // Example: Call your addStaff API or controller function

      

      let res = await addStudent(
        Context?.profileId,
        Context?.session,
        cookyGuid,
        cookyId,

        payload
      );
      // console.log('====== ↪️↪️↪️↪️↪️↪️↪️↪️↪️↪️  ========s : ', res?.data)

      if (!res?.data?.success) {
        // console.log('====== resaxxx : ', res?.data?.results?.message)
        setError(res?.data?.results?.message || 'Failed to save student data. Please try again.');

      }
      // Optionally, reset the form or go back to the list tab
      if (res?.data?.success) {
        // console.log('====== res sddddssssssssssss: ', res?.data)

        setFormData({
          school: '',
          class: '',
          name: '',
          rollNo: '',
          phone: '',
          alternatePhone: '',
          email: '',
          dateOfBirth: '',
          aadharCard: '',
          religion: '',
          motherTongue: '',
          nationality: 'Indian',
          bloodGroup: '',
          address: '',
          registrationNumber: '',
          schoolBus: '',
          smsNumber: '',
          // parents: [
          //   { name: '', gender: '', relation: 'FATHER', phone: '', email: '', occupation: '', address: '' },
          //   { name: '', gender: '', relation: 'MOTHER', phone: '', email: '', occupation: '', address: '' }
          // ]
        });
        setCurrentFormStep('basic');
        setActiveTab('add');
        setSuccess(res?.data?.results?.message);

        setTimeout(() => {
          window.location.reload();
        }, 600);

      }



    } catch (error) {
      setError(error || 'Failed to save staff data. Please try again.');

      console.error('Error saving staff:', error);
    } finally {
      setIsSaving(false);
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };


  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);







  return (
    <Layout>

      <div
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
        style={{
          backgroundImage: "url('/bg/appbackground@2x.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >




        <div className=" mx-auto px-4 py-8">
          {/* Navigation Tabs */}
          <Breadcrumbs items={breadcrumbs} />
          <div className="bg-white rounded-xl shadow-md mb-8">
            <div className="flex space-x-1 p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`cursor-pointer flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <tab.icon className="h-4 w-4 hidden sm:inline" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Add Student Form */}
          {activeTab === 'add' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Add New Student</h2>
                <p className="text-gray-600">Fill in the student information in multiple steps</p>
              </div>

              {/* Form Steps Navigation */}
              <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg mb-8">
                {formSteps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentFormStep(step.id)}
                    className={`cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors flex-1 justify-center ${currentFormStep === step.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <step.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{step.label}</span>
                  </button>
                ))}
              </div>

              {/* Form Content */}
              <div className="mb-8">
                {currentFormStep === 'basic' &&
                  <BasicInfoForm
                    config={config}
                    context={context}
                    formData={formData}
                    setFormData={setFormData}
                    classes={classes}
                    genderOptions={genderOptions}
                  />}
                {currentFormStep === 'personal' &&
                  <PersonalInfoForm

                    formData={formData}
                    setFormData={setFormData}
                    houses={houses}
                    renewalStatus={renewalStatus}
                    nationality={nationalitiesOptions}
                    categories={categoriesOptions}
                    religions={religionsOptions}
                    motherTongues={motherTonguesOptions}
                    bloodGroups={bloodGroupsOptions}

                  />}
                {currentFormStep === 'parents' &&
                  <FamilyInfoForm

                    formData={formData}
                    setFormData={setFormData}

                    genderOptions={genderOptions}
                    classes={classesOptions}
                    handleChange={handleParentChange}

                  />}
                {/* } */}
                {currentFormStep === 'academic' &&
                  <AcademicInfoForm

                    formData={formData}
                    setFormData={setFormData}

                    genderOptions={genderOptions}

                  />
                }
                {currentFormStep === 'documents' &&
                  <>
                    <DocumentInfoForm

                      formData={formData}
                      setFormData={setFormData}

                      genderOptions={genderOptions}

                    />
                  </>
                }
              </div>

              {/* Form Actions */}
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    const currentIndex = formSteps.findIndex(step => step.id === currentFormStep);
                    if (currentIndex > 0) {
                      setCurrentFormStep(formSteps[currentIndex - 1].id);
                    }
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  disabled={formSteps.findIndex(step => step.id === currentFormStep) === 0}
                >
                  Previous
                </button>

                <div className="space-x-4">
                  {formSteps.findIndex(step => step.id === currentFormStep) < formSteps.length - 1 ? (
                    <button
                      onClick={() => {
                        const currentIndex = formSteps.findIndex(step => step.id === currentFormStep);
                        if (currentIndex < formSteps.length - 1) {
                          setCurrentFormStep(formSteps[currentIndex + 1].id);
                        }
                      }}
                      className="cursor-pointer px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="cursor-pointer flex items-center space-x-2 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                      <Save className="h-4 w-4" />
                      <span>{!isSaving ? "Save Student" : "saving ..."}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}



          {/* --------- List_Students ----------- */}
          {activeTab === 'list' && (
            <>
              <StudentList
                filters={filters}
                setFilters={setFilters}
                loading={loading}
                setActiveTab={setActiveTab}
                students={studentListData}
                setSelectedStudent={setSelectedStudent}
                isFilterPanelOpen={isFilterPanelOpen}
                setIsFilterPanelOpen={setIsFilterPanelOpen}
              />
            </>
          )}

          {/* View Profile */}
          {activeTab === 'view' && (
            // <StudentProfile

            <>
              {selectedStudent ?
                <StudentProfile
                  bloodGroupsOptions={bloodGroupsOptions}
                  religionsOptions={religionsOptions}
                  school={Context?.schoolId}
                  profile={Context?.profileId}
                  session={Context?.session}
                  cookyGuid={cookyGuid}
                  cookyId={cookyId}
                  studentData={selectedStudent}
                  studentId={selectedStudent?.id}
                  setStudentUpdated={setStudentUpdated}
                  config={config}
                /> : (
                  <>
                    <div className="bg-white rounded-xl shadow-md p-6 text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">No Student Selected</h2>
                      <p className="text-gray-600 mb-4">Please select a student from the list to view their profile.</p>
                    </div>
                  </>

                )}

            </>
          )}




          {activeTab === 'houses' && (
            <>
              <HouseManagement
                houses={houses_}
                setIsHouseUpdatedOrCreated={setIsHouseUpdatedOrCreated}
              />
            </>
          )}



          {activeTab === 'parents' && (
            <>
              <ParentManagement
                Context={Context}
                config={config}
              />
            </>
          )}


          {activeTab === 'birthdays' && (
            <>
              <Birthdays
                context={Context}
                config={config}
              />
            </>
          )}





        </div>
      </div>

      {error && (
        <div className="fixed top-4 right-4 flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md shadow-md z-50">
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="fixed top-4 right-4 flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md shadow-md z-50">
          <span>{success}</span>
        </div>
      )}
      {/* {success && (
        <ConfirmationSuccessDialogueBox 
        title={'Added Student .'}
        description={success}
        />
      )} */}

    </Layout>
  );
};

export default StudentMangementDashboard;