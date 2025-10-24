'use client';
import React, { useEffect, useState } from 'react';
import { User, BadgePlus, List, Save, Users, Heart, Book, FileInput, File, Banknote, } from 'lucide-react';
import { StaffList } from './listStaff';
import StaffProfile from './staffProfile';
import AddStaff from './addStaffForm';
import { getSessionCache } from '../../utils/sessionCache';
import { useStaff } from '../../controllers/staff';

import Loader from '../../components/ui/status/Loader';
import { addStaff } from '../../api/staff';
import AddStaffPersonalInfo from './AddStaffPersonalInfo';
import AddDocumentInfo from './AddDocumentInfo';
import AddAcademicInfo from './AddAcademicInfo';
import AddBankInfo from './AddBankInfo';
import { set } from 'date-fns';

// ===================================================================



const tabs = [
  { id: 'list', label: 'List Staff', icon: List },
  { id: 'add', label: 'Add Staff', icon: BadgePlus },
  { id: 'view', label: 'View Profile', icon: User }
];

const StaffMangementDashboard = ({
  students,
  profile,
  session,
  cookyGuid,
  cookyId,
  school

}) => {

  const config = getSessionCache("dashboardConfig");
  const Context = getSessionCache("dashboardContext");
  // console.log('Context : ', Context);
  const designations = config?.designations
  const titles = config?.titles
  const gender_staffs = config?.gender_staffs
  const classes = config?.classes


  const [activeTab, setActiveTab] = useState('list');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentFormStep, setCurrentFormStep] = useState('basic');


  const [selectedTitle, setSelectedTitle] = useState('');



  const classesOptions = config?.classes || [];
  const schoolOptions = config?.school || [];
  const genderOptions = config?.gender_students || [];
  const religionsOptions = config?.religions || [];
  const motherTonguesOptions = config?.mother_tongues || [];
  const nationalitiesOptions = config?.nationalities || [];
  const bloodGroupsOptions = config?.blood_groups || [];
  const categoriesOptions = config?.caste_categories || [];







  // console.log('------------- $ stadffData--------', stadffData?.users);






  // console.log(selectedStaff,"selectedStaff");


  const [selectedStaff, setSelectedStaff] = useState('')
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    gender: "",
    designation: "",
    class: "",

    dateOfBirth: "",
    joiningDate: "",
    invoiceNotificationEnabled: false,
    classCoordinator: false,
    category: "",
    bloodGroup: "",
    email: "",
    phone: "",
    emergencyPhone: "",
    fatherName: "",
    motherName: "",
    spouseName: "",
    sonName: "",
    daughterName: "",
    currentAddress: "",
    permanentAddress: "",

    aadhaar: "",
    pan: "",
    employeeId: "",
    specialDesignation: "",
    dateOfRetirement: "",
    appointmentType: "",


    academicQualification: "",
    professionalQualification: "",
    experience: "",
    yearOfPassing: "",

    bank: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    branchName: "",





    rollNo: "",
    religion: "",
    motherTongue: "",
    nationality: "Indian",

    registrationNumber: "",
    schoolBus: "",
    smsNumber: "",

    school: "",
    parents: [
      { name: "", gender: "", relation: "FATHER", phone: "", email: "", occupation: "", address: "" },
      { name: "", gender: "", relation: "MOTHER", phone: "", email: "", occupation: "", address: "" }
    ]
  });

  const formSteps = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'personal', label: 'Personal Details', icon: Heart },
    { id: 'documents', label: 'Documents Info', icon: File },
    { id: 'academic', label: 'Academic Info', icon: Book },
    { id: 'bank', label: 'Bank Details', icon: Banknote }
  ];

  // console.log('formData ==========', formData)

  const handleInputChange = (e) => {

    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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


      console.log('====== payload : ', payload)

      // Example: Call your addStaff API or controller function
      let res = await addStaff(
        profile = Context?.profileId,
        session = Context?.session,
        cookyGuid,
        cookyId,

        payload
      );
      if (!res?.data?.success) {
        console.log('====== resaxxx : ', res?.data?.results?.message)
        setError(res?.data?.results?.message || 'Failed to save staff data. Please try again.');

      }
      // Optionally, reset the form or go back to the list tab
      if (res?.data?.success) {
        console.log('====== res sddddssssssssssss: ', res?.data)

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
        setActiveTab('list');
        alert(res?.data?.results?.message);
      }



    } catch (error) {
      setError(error || 'Failed to save staff data. Please try again.');

      alert('Failed to save staff data. Please try again.');
      console.error('Error saving staff:', error);
    } finally {
      setIsSaving(false);
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };

  // ===================================================================



  return (
    <>
      <div
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 "

      >
        <div className=" mx-auto px-4 py-4 shadow-lg">
          {/* =====================     Navigation Tabs =================================================================== */}

          <div className="bg-white rounded-xl shadow-md mb-4">
            <div className="flex space-x-1 p-1">
              {tabs?.map((tab) => (
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


          {activeTab === "add" && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Add New Staff</h2>
                <p className="text-gray-600">Fill in the staff information step by step</p>
              </div>

              {/* Form Steps Navigation */}
              <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg mb-8">
                {formSteps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentFormStep(step.id)}
                    className={`cursor-pointer  flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors flex-1 justify-center ${currentFormStep === step.id
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <step.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{step.label}</span>
                  </button>
                ))}
              </div>

              {/* Form Content */}
              <div className="mb-8">
                {currentFormStep === "basic" && (

                  <AddStaff
                    formData={formData}
                    setFormData={setFormData}
                    handleInputChange={handleInputChange}
                    designations={designations}
                    titles={titles}
                    genderStaffs={gender_staffs}
                    school={school}
                    classes={classes}
                  />
                )}

              </div>






              <div className="mb-8">
                {currentFormStep === "personal" && (

                  <AddStaffPersonalInfo
                    formData={formData}
                    setFormData={setFormData}
                    categories={categoriesOptions}
                    bloodGroups={bloodGroupsOptions}

                  />
                )}

              </div>

              <div className="mb-8">
                {currentFormStep === "documents" && (

                  <AddDocumentInfo
                    formData={formData}
                    setFormData={setFormData}
                    handleInputChange={handleInputChange}

                  />
                )}

              </div>



              <div className="mb-8">
                {currentFormStep === "academic" && (

                  <AddAcademicInfo
                    formData={formData}
                    setFormData={setFormData}
                    handleInputChange={handleInputChange}

                  />
                )}

              </div>

              <div className="mb-8">
                {currentFormStep === "bank" && (

                  <AddBankInfo
                    formData={formData}
                    setFormData={setFormData}
                    handleInputChange={handleInputChange}

                  />
                )}

              </div>




              {/* Form Actions */}
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    const currentIndex = formSteps.findIndex(
                      (step) => step.id === currentFormStep
                    );
                    if (currentIndex > 0) {
                      setCurrentFormStep(formSteps[currentIndex - 1].id);
                    }
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  disabled={formSteps.findIndex((step) => step.id === currentFormStep) === 0}
                >
                  Previous
                </button>

                <div className="space-x-4">
                  {formSteps.findIndex((step) => step.id === currentFormStep) <
                    formSteps.length - 1 ? (
                    <button
                      onClick={() => {
                        const currentIndex = formSteps.findIndex(
                          (step) => step.id === currentFormStep
                        );
                        if (currentIndex < formSteps.length - 1) {
                          setCurrentFormStep(formSteps[currentIndex + 1].id);
                        }
                      }}
                      className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="cursor-pointer flex items-center space-x-2 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                      disabled={isSaving}
                    >
                      <Save className="h-4 w-4" />
                      <span>{isSaving ? "Saving..." : "Save Staff"}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* List Students */}
          {activeTab === 'list' && (
            <>
              <StaffList
                setActiveTab={setActiveTab}
                setSelectedStaff={setSelectedStaff}


              />

            </>
          )}

          {/* View Profile */}
          {activeTab === 'view' && (
            // <StaffProfile

            <>
              {selectedStaff ? <StaffProfile
                bloodGroupsOptions={bloodGroupsOptions}
                religionsOptions={religionsOptions}
                school={school}
                profile={Context?.profileId}
                session={Context?.session}
                cookyGuid={cookyGuid}
                cookyId={cookyId}
                studentData={selectedStaff}
                studentId={selectedStaff?.id}
              /> : (
                <>
                  <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Staff Selected</h2>
                    <p className="text-gray-600 mb-4">Please select a student from the list to view their profile.</p>
                  </div>
                </>

              )}

            </>
          )}
          {/* ======================================================================================== */}


          {error && (
            <div className="fixed top-4 right-4 flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md shadow-md z-50">
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>


    </>
  );
};

{/* ======================================================================================== */ }
export default StaffMangementDashboard;
{/* ======================================================================================== */ }