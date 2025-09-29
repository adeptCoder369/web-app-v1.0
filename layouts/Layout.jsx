'use client'

import Navbar from '../components/Navbar';
import ConfirmationDialogueBox from '../components/ui/status/Confirmation';
import IdleTimeContainer from '../autoLogout';
import Sidebar from '../components/Sidebar';
import { useEffect, useState, useRef } from 'react';
import { getSessionCache, setSessionCache } from '../utils/sessionCache';
import { getUserDashboardData } from '../api/dashboard';
import Loader from '../components/ui/status/Loader';
// ==============================================================================


export default function Layout({ children, dashboardData }) {
  // ==============================================================================
  const config = getSessionCache("dashboardConfig");
  const Context = getSessionCache("dashboardContext");

  const schoolSessions = config?.school?.sessions
  const currentSession = config?.year

  const [userProfile, setUserProfile] = useState(config?.profile || null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showIdleDialogue, setShowIdleDialogue] = useState(false);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedSession, setSelectedSession] = useState('')

  console.log('--------- selectedSession ---------', selectedSession);


  const mounted = useRef(true);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      // session/context from client cache
      // const context = getSessionCache('dashboardContext') || {};

      // call API (adjust args/order if getStudentList signature differs)
      const data = await getUserDashboardData(Context?.profileId, selectedSession?.clientId || Context?.session);

      console.log('-------- data---------', data?.success);

      setSessionCache("dashboardConfig", data.results);
      if (mounted.current && data?.results) {
        setSessionCache("dashboardConfig", data.results);
      }
      // if (mounted && data) {
      //   setDashboardData(data?.results)

      // }
    } catch (err) {
      if (mounted.current) setError(err);
      console.error('Failed to load student list', err);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }
  useEffect(() => {
    mounted.current = true;
    load();
    return () => {
      mounted.current = false;
    };
  }, [
    Context?.profileId,
    Context?.session,
    // cookyGuid,
    // cookyId,
    // selectedSession?.clientId
  ]);











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


  // ==============================================================================
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

      {!loading ? <div className="flex-1 flex flex-col">
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
      </div> : <Loader />}
    </div>
  );
}
// ==============================================================================