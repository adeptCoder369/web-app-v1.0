'use client';
import React, { useEffect, useState, useRef } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, Book, Users, Heart, BadgePlus,
  Award, Shield, Bus, Globe, List, Save, X, Plus, Trash2,
  GraduationCap,
  School,
  ScrollText,
  FileMinus,
  FileInput,
  Church,
  Languages,
  Flag,
  HeartPulse,
  MapPinHouse,
  Transgender,
  FileUser
} from 'lucide-react';
import Layout from '../../layouts/Layout';
import { StudentList } from './listStudent';
import StudentProfile from './studentProfile';
import { getSessionCache } from '../../utils/sessionCache';
import { getStudentList } from '../../api/student';
import { Breadcrumbs } from '../ui/Breadcrumb/breadcrumb';



const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Manage Students" },
];

const tabs = [
  { id: 'list', label: 'List Students', icon: List },
  { id: 'add', label: 'Add Student', icon: BadgePlus },
  { id: 'view', label: 'View Profile', icon: User }
];

const StudentMangementDashboard = ({

  cookyGuid,
  cookyId,


}) => {


  const [studentListData, setStudentListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const config = getSessionCache("dashboardConfig");
  const Context = getSessionCache("dashboardContext");


  const context = getSessionCache('dashboardContext') || {};

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await getStudentList(context?.profileId, context?.session, cookyGuid, cookyId);
      if (mounted.current) setStudentListData(data?.results?.items);
    } catch (err) {
      if (mounted.current) setError(err);
      console.error('Failed to load student list', err);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }

  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    load();
    return () => { mounted.current = false; };
  }, [cookyGuid, cookyId]);



  const classesOptions = config?.classes || [];
  const schoolOptions = config?.school || [];
  const genderOptions = config?.gender_students || [];
  const religionsOptions = config?.religions || [];
  const motherTonguesOptions = config?.mother_tongues || [];
  const nationalitiesOptions = config?.nationalities || [];
  const bloodGroupsOptions = config?.blood_groups || [];
  const categoriesOptions = config?.caste_categories || [];






  const [activeTab, setActiveTab] = useState('list');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentFormStep, setCurrentFormStep] = useState('basic');
  // console.log(selectedStudent,"selectedStudent");



  // Form state
  const [formData, setFormData] = useState({
    // Basic Information
    school: '',
    class: '',
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
    schoolBus: '',
    smsNumber: '',

    // Parents Information
    parents: [
      { name: '', gender: '', relation: 'FATHER', phone: '', email: '', occupation: '', address: '' },
      { name: '', gender: '', relation: 'MOTHER', phone: '', email: '', occupation: '', address: '' }
    ]
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

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Add your API call here
    alert('Student data saved successfully!');
  };

  const InputField = ({ label, value, onChange, type = "text", required = false, placeholder = "", options = null, icon: Icon = null }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 text-gray-600" />
          </div>
        )}
        {options ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required={required}
          >
            <option value="">Select {label}</option>
            {options.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required={required}
          />
        )}
      </div>
    </div>
  );
  const BasicInfoForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputField
        icon={School}
        label="School"
        value={formData.school}
        onChange={(value) => handleInputChange("school", value)}
        required
        options={schoolOptions ? [schoolOptions.full_name] : []}
      />

      <InputField
        icon={School}

        label="Class"
        value={formData.class}
        onChange={(value) => handleInputChange('class', value)}
        required={true}
        //  options={['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']}
        options={classesOptions?.map((x) => x.name) || []}
      />
      <InputField
        icon={User}

        label="Student Name"
        value={formData.name}
        onChange={(value) => handleInputChange('name', value)}
        required={true}
        placeholder="Enter full name"
      />
      <InputField
        icon={ScrollText}

        label="Roll Number"
        value={formData.rollNo}
        onChange={(value) => handleInputChange('rollNo', value)}
        required={true}
        placeholder="Enter roll number"
      />
      <InputField
        icon={Phone}

        label="Phone Number"
        value={formData.phone}
        onChange={(value) => handleInputChange('phone', value)}
        required={true}
        type="tel"
        placeholder="Enter phone number"
      />
      <InputField
        icon={Phone}

        label="Alternate Phone"
        value={formData.alternatePhone}
        onChange={(value) => handleInputChange('alternatePhone', value)}
        type="tel"
        placeholder="Enter alternate phone"
      />
      <InputField
        icon={Mail}

        label="Email Address"
        value={formData.email}
        onChange={(value) => handleInputChange('email', value)}
        required={true}
        type="email"
        placeholder="Enter email address"
      />
      <InputField
        icon={Calendar}

        label="Date of Birth"
        value={formData.dateOfBirth}
        onChange={(value) => handleInputChange('dateOfBirth', value)}
        type="date"
        required={true}
      />
    </div>
  );

  const PersonalDetailsForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputField
        icon={FileInput}

        label="Aadhaar Card Number"
        value={formData.aadharCard}
        onChange={(value) => handleInputChange('aadharCard', value)}
        placeholder="Enter Aadhaar number"
      />
      <InputField
        icon={Church}

        label="Religion"
        value={formData.religion}
        onChange={(value) => handleInputChange('religion', value)}
        options={religionsOptions}
      />
      <InputField
        icon={Languages}

        label="Mother Tongue"
        value={formData.motherTongue}
        onChange={(value) => handleInputChange('motherTongue', value)}
        options={motherTonguesOptions}
      />
      <InputField
        icon={Flag}

        label="Nationality"
        value={formData.nationality}
        onChange={(value) => handleInputChange('nationality', value)}
        options={nationalitiesOptions}
      />
      <InputField
        icon={HeartPulse}

        label="Blood Group"
        value={formData.bloodGroup}
        onChange={(value) => handleInputChange('bloodGroup', value)}
        options={bloodGroupsOptions}
      />
      <InputField
        icon={FileUser}

        label="Category"
        value={formData.schoolBus}
        onChange={(value) => handleInputChange('FileUser', value)}
        options={categoriesOptions}
      />
      <div className="md:col-span-2">
        <InputField
          icon={MapPinHouse}

          label="Address"
          value={formData.address}
          onChange={(value) => handleInputChange('address', value)}
          placeholder="Enter complete address"
        />
      </div>
    </div>
  );

  const ParentsInfoForm = () => (
    <div className="space-y-6">
      {formData.parents.map((parent, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Parent {index + 1}</h4>
            {formData.parents.length > 1 && (
              <button
                onClick={() => removeParent(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              icon={User}

              label="Name"
              value={parent.name}
              onChange={(value) => handleParentChange(index, 'name', value)}
              required={true}
              placeholder="Enter parent name"
            />
            <InputField
              icon={Transgender}

              label="Gender"
              value={parent.gender}
              onChange={(value) => handleParentChange(index, 'gender', value)}
              options={genderOptions}
              required={true}
            />
            <InputField
              icon={Shield}

              label="Relation"
              value={parent.relation}
              onChange={(value) => handleParentChange(index, 'relation', value)}
              options={['FATHER', 'MOTHER', 'GUARDIAN', 'OTHER']}
              required={true}
            />
            <InputField
              icon={Phone}

              label="Phone"
              value={parent.phone}
              onChange={(value) => handleParentChange(index, 'phone', value)}
              type="tel"
              required={true}
              placeholder="Enter phone number"
            />
            <InputField
              icon={Mail}

              label="Email"
              value={parent.email}
              onChange={(value) => handleParentChange(index, 'email', value)}
              type="email"
              placeholder="Enter email address"
            />
            <InputField

              label="Occupation"
              value={parent.occupation}
              onChange={(value) => handleParentChange(index, 'occupation', value)}
              placeholder="Enter occupation"
            />
            <div className="md:col-span-2">
              <InputField
                icon={MapPinHouse}

                label="Address"
                value={parent.address}
                onChange={(value) => handleParentChange(index, 'address', value)}
                placeholder="Enter address"
              />
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={addParent}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        <Plus className="h-4 w-4" />
        <span>Add Parent/Guardian</span>
      </button>
    </div>
  );

  const AcademicInfoForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputField
        icon={Phone}

        label="Registration Number"
        value={formData.registrationNumber}
        onChange={(value) => handleInputChange('registrationNumber', value)}
        placeholder="Enter registration number"
      />
      <InputField
        icon={Phone}

        label="SMS Number"
        value={formData.smsNumber}
        onChange={(value) => handleInputChange('smsNumber', value)}
        type="tel"
        placeholder="Enter SMS number"
      />
    </div>
  );



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
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === tab.id
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
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors flex-1 justify-center ${currentFormStep === step.id
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
                {currentFormStep === 'basic' && <BasicInfoForm />}
                {currentFormStep === 'personal' && <PersonalDetailsForm />}
                {currentFormStep === 'parents' && <ParentsInfoForm />}
                {currentFormStep === 'academic' && <AcademicInfoForm />}
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
                      className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="flex items-center space-x-2 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Student</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* List Students */}
          {activeTab === 'list' && (
            <>
              <StudentList
                loading={loading}
                setActiveTab={setActiveTab}
                students={studentListData}
                setSelectedStudent={setSelectedStudent}

              />
            </>
          )}

          {/* View Profile */}
          {activeTab === 'view' && (
            // <StudentProfile

            <>
              {selectedStudent ? <StudentProfile
                bloodGroupsOptions={bloodGroupsOptions}
                religionsOptions={religionsOptions}
                school={Context?.schoolId}
                profile={Context?.profileId}
                session={Context?.session}
                cookyGuid={cookyGuid}
                cookyId={cookyId}
                studentData={selectedStudent}
                studentId={selectedStudent?.id}
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
        </div>
      </div>
    </Layout>
  );
};

export default StudentMangementDashboard;