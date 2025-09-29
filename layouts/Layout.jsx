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
  const config = getSessionCache("dashboardConfig");
  const Context = getSessionCache("dashboardContext");

  const schoolSessions = config?.school?.sessions;
  const currentSession = config?.year;

  const [userProfile, setUserProfile] = useState(config?.profile || null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingDashboard, setLoadingDashboard] = useState(false); // ✅ new
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showIdleDialogue, setShowIdleDialogue] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSession, setSelectedSession] = useState(Context?.session || "");
  console.log('selectedSession -------', selectedSession);

  const mounted = useRef(true);

  async function load(sessionOverride) {
    setLoadingDashboard(true); // ✅ instead of generic loading
    setError(null);

    try {
      const ctx = getSessionCache("dashboardContext"); // always latest context
      const activeSession = sessionOverride || ctx?.session;

      const data = await getUserDashboardData(
        ctx?.profileId,
        activeSession
      );

      if (mounted.current && data?.results) {
        setSessionCache("dashboardConfig", data.results);
      }
    } catch (err) {
      if (mounted.current) setError(err);
      console.error("Failed to load dashboard data", err);
    } finally {
      if (mounted.current) setLoadingDashboard(false);
    }
  }

  useEffect(() => {
    if (!selectedSession?.clientId) return;

    const newSession = selectedSession?.clientId;
    const currentContext = getSessionCache("dashboardContext");

    if (currentContext?.session !== newSession) {
      setSessionCache("dashboardContext", {
        ...currentContext,
        session: newSession,
      });

      load(newSession); // ✅ use the new session directly
    }
  }, [selectedSession?.clientId]);


  // Initial profile load
  useEffect(() => {
    if (config?.profile) {
      setUserProfile(config.profile);
      setLoadingProfile(false);
    } else {
      setLoadingProfile(false); // or fetch if API is ready
    }
  }, []);

  // Sync profile if dashboardConfig updates in another tab
  // useEffect(() => {
  //   const onStorage = (e) => {
  //     if (e.key === "dashboardConfig") {
  //       const config = getSessionCache("dashboardConfig");
  //       setUserProfile(config?.profile || null);
  //     }
  //   };
  //   window.addEventListener("storage", onStorage);
  //   return () => window.removeEventListener("storage", onStorage);
  // }, []);

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

      <div className="flex-1 flex flex-col">
        <Navbar
          currentSession={currentSession}
          schoolSessions={schoolSessions}
          setSelectedSession={setSelectedSession}
          userProfile={userProfile}
          loading={loadingProfile}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 bg-muted overflow-y-auto">
          {loadingDashboard ? <Loader /> : children}
        </main>
      </div>

    </div>
  );
}
// ==============================================================================