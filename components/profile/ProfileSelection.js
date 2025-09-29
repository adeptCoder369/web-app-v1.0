"use client"
//============================================================================




import { useEffect, useState } from "react";
import { Search, Calendar, ChevronDown, ChevronRight, Check, Eye, User, BookOpen, School } from "lucide-react";
import Footer from "../Footer";
import { useProfile } from "../../controllers/profile";
import { useRouter } from "next/navigation";
import Loader from "../ui/status/Loader";
import { setSessionCache } from "../../utils/sessionCache";


// ===============================================================

export default function ProfileSelection() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const { getUserProfile, profileData } = useProfile();

  useEffect(() => {
    getUserProfile();
  }, []);



  useEffect(() => {

    if (profileData?.name) setUserName(profileData?.name);

  }, [profileData]);





  const [expandedProfiles, setExpandedProfiles] = useState({});

  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");


  // Assuming profileData is your API response's results object
  const profileData_ = (profileData?.profiles || []).map(profile => ({
    id: profile.id,
    name: profile.name,
    image: profile.image_url,
    avatar: profile.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase(), // e.g., "AS"
    schoolsAlloted: profile.schools.length,
    role: profile.meta_data || '', // or profile.profile?.type if you want "parent"/"student"
    schools: profile.schools.map(school => ({
      id: school.id,
      name: `${school.name}${school.city ? ', ' + school.city.name : ''}`,
      logo: school.logo_url,
      sessions: (school.sessions || []).map(session => ({
        sessionDuration: session.session,
        clientId: session.client_id
      }))
    }))
  }));
  const toggleProfile = (profileName) => {
    setExpandedProfiles({
      ...expandedProfiles,
      [profileName]: !expandedProfiles[profileName]
    });
  };

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
    // Auto expand the selected profile
    // setExpandedProfiles({
    //   ...expandedProfiles,
    //   [profile.name]: trueI. Offer of 5th do order even Punjagaer Mr Lekki. Back in. This is another base. You have a. They sing among you. Are you? No, don't get past your mind. Beautiful. Are we watching? You order Onedrive if you order. Use session token session. I. Hey. Hey, Cortana. But. Is absolutely worse than I was. There. Mediocre. These have any other matter? Women who want to watch Vidya Balan. Bone by Jay Denalis. Immediately. Easily pushed along. When did I do suggested in Lehi Sang? The Medicine scheme and. Vendor ID visibility card item. Model Player. Take a wow way to get a. Order order. CallApi.inventory. Vendor not get by ID. Well proceed order and. Yeah. But in Vintage Valley Vendor. By vendor by. Vendor. A window item. Let's let's Madam. descriptive. Your price only done by the little. 
    // });
  };

  const handleSchoolSelect = (school) => {
    setSelectedSchool(school);
    setSelectedSession(null); // Reset session when school changes
  };

  const handleSessionSelect = (session, profile, school) => {
    setSelectedSession(session);
    
    console.log('----------- aaya ---------', session);


    setLoading(true); // Show loader
    setSessionCache("dashboardContext", {
      schoolId: school?.id,
      session: session?.clientId,
      profileId: profile?.id,
      schoolSessions: school?.sessions,
    },
      // { encrypt: true }
    );


    // router.push(`/dashboard/${profile?.id}/${session?.clientId}/${school?.id}`);
    router.push(`/dashboard`);


  };

  // safe, robust filter

  const q = (searchQuery ?? '').toString().trim().toLowerCase();

  const filteredProfiles = (profileData_ ?? []).filter(profile => {
    if (!q) return true;

    const schools = Array.isArray(profile?.schools)
      ? profile.schools
      : profile?.schools
        ? Object.values(profile.schools)
        : [];

    // check in profile.name also
    const profileName = (profile?.name ?? '').toString().toLowerCase();

    return (
      profileName.includes(q) ||
      schools.some(school => (school?.name ?? '').toLowerCase().includes(q))
    );
  });



  return (
    <>
      {loading && (
        <Loader />
      )}

      <div className="bg-gray-100 min-h-screen"
        style={{
          backgroundImage: "url('/bg/appbackground@2x.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Header */}
        <header className="bg-white shadow-md relative z-10">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* <BookOpen className="h-8 w-8 text-indigo-600" /> */}
                <h1 className="text-4xl font-extrabold tracking-tight text-[color:var(--color-blue-text)]">
                  info<span className="text-[color:var(--color-navy-blue)]">EIGHT</span>
                </h1>
              </div>
              <div className="flex items-center space-x-4 text-gray-600 font-bold ">
                {userName ? userName : 'Guest'}
                <button className="text-gray-600 hover:text-gray-900">
                  <User className="h-6 w-6 ml-2" />

                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Page Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Profile Selection</h2>
            <p className="mt-2 text-gray-600">Select a profile, school, and session to access your dashboard</p>
          </div>

          {/* Search and filters */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-1/2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search schools or profiles ..."
                className="w-full pl-10 pr-4 py-3 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-md text-gray-700"
              />
              <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>

            {/* <div className="flex gap-3">
            <button
              className="bg-white hover:bg-gray-50 text-indigo-600 font-medium px-5 py-3 rounded-full shadow-md flex items-center gap-2 transition-colors border border-gray-100"
            >
              <Calendar size={18} />
              Filter
            </button>
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-3 rounded-full shadow-md flex items-center gap-2 transition-colors"
            >
              <Eye size={18} />
              View All
            </button>
          </div> */}
          </div>

          {/* Selection Progress */}
          {/* <div className="bg-white rounded-xl shadow-md p-5 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${selectedProfile ? 'bg-green-500' : 'bg-gray-200'} text-white`}>
                {selectedProfile ? <Check size={16} /> : '1'}
              </div>
              <div className="ml-3">
                <p className="font-medium">Select Profile</p>
                <p className="text-sm text-gray-500">{selectedProfile?.name || 'Not selected'}</p>
              </div>
            </div>

            <div className="hidden sm:block w-8 h-0.5 bg-gray-200"></div>

            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${selectedSchool ? 'bg-green-500' : 'bg-gray-200'} text-white`}>
                {selectedSchool ? <Check size={16} /> : '2'}
              </div>
              <div className="ml-3">
                <p className="font-medium">Select School</p>
                <p className="text-sm text-gray-500">{selectedSchool?.name || 'Not selected'}</p>
              </div>
            </div>

            <div className="hidden sm:block w-8 h-0.5 bg-gray-200"></div>

            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${selectedSession ? 'bg-green-500' : 'bg-gray-200'} text-white`}>
                {selectedSession ? <Check size={16} /> : '3'}
              </div>
              <div className="ml-3">
                <p className="font-medium">Select Session</p>
                <p className="text-sm text-gray-500">{selectedSession || 'Not selected'}</p>
              </div>
            </div>
          </div>
        </div> */}

          {/* Profiles Grid */}
          <div className="grid grid-cols-1 gap-6">
            {filteredProfiles?.map((profile) => {



              return (
                <div
                  key={profile?.name}
                  className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 ${selectedProfile?.name === profile.name ? 'ring-2 ring-indigo-500 ring-offset-2' : 'hover:shadow-lg'}`}
                >
                  {/* Profile header */}
                  <div
                    onClick={() => {
                      toggleProfile(profile.name);
                      handleProfileSelect(profile);
                    }}
                    className="cursor-pointer p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold shadow-md overflow-hidden">
                          {profile.image ? (
                            <img
                              src={profile.image}
                              alt={profile.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            profile.avatar
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-800">{profile.name}</h3>
                        <div className="flex items-center mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${profile.role === 'Student' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                            {profile.role}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">{profile.schoolsAlloted} school{profile.schoolsAlloted !== 1 ? 's' : ''} allotted</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button
                        className={`p-2 rounded-full ${expandedProfiles[profile.name] ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}
                      >
                        {expandedProfiles[profile.name] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Schools list */}
                  {expandedProfiles[profile.name] && (
                    <div className="bg-gray-50 p-4 border-t border-gray-100 space-y-4">
                      {profile?.schools?.map((school, schoolIndex) => {



                        return (
                          <div
                            key={schoolIndex}
                            className={`p-4 rounded-lg transition-all duration-200 ${selectedSchool?.name === school.name ? 'bg-indigo-50 border border-indigo-100' : 'bg-white border border-gray-100 hover:border-indigo-200'}`}
                          >
                            <div className="flex items-start">
                              {/* <div
                          className={`h-5 w-5 rounded-full border-2 mr-3 mt-0.5 flex-shrink-0 cursor-pointer ${selectedSchool?.name === school.name ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'}`}
                          onClick={() => handleSchoolSelect(school)}
                        >
                          {selectedSchool?.name === school.name && (
                            <Check size={12} className="text-white m-auto" />
                          )}
                        </div> */}
                              <div className="flex-1">
                                <div className="flex items-center cursor-pointer" onClick={() => handleSchoolSelect(school)}>
                                  {school?.logo ? (
                                    <img
                                      src={school?.logo}
                                      alt={school.name}
                                      className="h-10 w-10 rounded-full object-cover mr-2 flex-shrink-0"
                                    />
                                  ) : (
                                    <School className="h-10 w-10 text-gray-500 mr-2 flex-shrink-0" />
                                  )}

                                  {/* <img
                                src={{ uri: school?.logo_url }}
                                // src={'https://infoeight-s3-new.s3.ap-south-1.amazonaws.com/schools/logo/thumbnail-1687416160.5367school_logo_upload6493ed608309a6.10353660.png'}
                                alt={school.name}
                                className="h-8 w-8 rounded-full object-cover mr-2 flex-shrink-0"
                              /> */}
                                  <h4 className="font-medium text-gray-800">{school.name}</h4>
                                </div>
                                {/* Sessions */}
                                <div className="mt-4">
                                  <p className="text-xs uppercase font-semibold text-gray-500 mb-2">Available Sessions</p>
                                  <div className="flex flex-wrap gap-2">
                                    {school?.sessions?.map((session) => (
                                      <button
                                        // key={`${profile.name}-${school.name}-${session}`}
                                        key={`${session?.id}`}
                                        onClick={() => {

                                          handleSessionSelect(session, profile, school)

                                        }}
                                        className={`cursor-pointer text-sm px-4 py-2 rounded-lg font-medium transition-all duration-200 ${selectedSession === session && selectedSchool?.name === school.name
                                          ? 'bg-indigo-600 text-white'
                                          : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200'
                                          }`}
                                      >
                                        {session?.sessionDuration}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Action Button */}
          {selectedProfile && selectedSchool && selectedSession && (
            <div className="mt-8 flex justify-center">
              <button
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-8 py-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Continue to Dashboard
              </button>
            </div>
          )}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}


// ===============================================================
