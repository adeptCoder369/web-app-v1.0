'use client'

import Navbar from '../components/Navbar';
import ContentArea from '../components/ContentArea';
import Footer from '../components/Footer';
import ConfirmationDialogueBox from '../components/ui/status/Confirmation';
import IdleTimeContainer from '../autoLogout';
import Sidebar from '../components/Sidebar';
import { useEffect, useState } from 'react';
import { getSessionCache } from '../utils/sessionCache';



export default function Layout({ children, setSelectedSession ,dashboardData}) {

  const config = getSessionCache("dashboardConfig");

  const schoolSessions = config?.school?.sessions
  const currentSession = config?.year

  // console.log(' ------------------ schoolSessions -------------------', config);


  const [userProfile, setUserProfile] = useState(config?.profile || null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const loadProfile = async () => {
    // if profile already in cache, no need to fetch again
    if (config?.profile) {
      setUserProfile(config.profile);
      setLoadingProfile(false);

    } else {
      try {
        // const profileData = await fetchProfile(); //  API call
        // setUserProfile(profileData);
        setLoadingProfile(false);

      } catch (err) {
        console.error("Failed to load profile", err);
      }
    }
  };
  useEffect(() => {

    loadProfile();
  }, []);


  // When dashboardConfig is updated elsewhere, listen for changes (optional)
  useEffect(() => {
    // Listen for storage events if cache is updated in another tab
    const onStorage = (e) => {
      if (e.key === "dashboardConfig") {
        const config = getSessionCache("dashboardConfig");
        setUserProfile(config?.profile || null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);



  const [sidebarOpen, setSidebarOpen] = useState(false);



  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [showIdleDialogue, setShowIdleDialogue] = useState(false);

  // console.log('sidebarOpen', sidebarOpen);

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <IdleTimeContainer
        onIdle={() => {
          localStorage.removeItem('token');
          setShowIdleDialogue(true)
          // window.location.href = '/login';
        }}
      />
      {showIdleDialogue ? <ConfirmationDialogueBox
        title='Hey, You Still There?'
        description='You have been idle for a while. Do you want to log out?'

        // onConfirm={handleLogout}
        onCancel={() => setShowIdleDialogue(false)}
      /> : null}



      {/* Sidebar */}
      <div className={`bg-primary text-white transition-all duration-300`}>
        {/* <button
          className="p-4 focus:outline-none"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X /> : null}
        </button> */}
        {sidebarOpen && (

          <Sidebar
            dashboardData={dashboardData}
            sidebarOpen={sidebarOpen}
            config={config}
            setSidebarOpen={setSidebarOpen}

          />
        )}
      </div>

      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        {/* <header className="bg-white shadow p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </header> */}
        <Navbar
          currentSession={currentSession}
          schoolSessions={schoolSessions}
          setSelectedSession={setSelectedSession}
          userProfile={userProfile}
          loading={loadingProfile}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen} />
        {/* Main Content Area */}
        <main className="flex-1  bg-muted overflow-y-auto ">
          {/* <ContentArea /> */}

          {children}
          {/* <p>Welcome to your dashboard!</p> */}
        </main>
        {/* <Footer /> */}
      </div>
    </div>
  );
}