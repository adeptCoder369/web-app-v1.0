'use client'

import Navbar from '../components/Navbar';
import ConfirmationDialogueBox from '../components/ui/status/Confirmation';
import IdleTimeContainer from '../autoLogout';
import Sidebar from '../components/Sidebar';
import React, { useEffect, useState, useRef } from 'react';
import { getSessionCache, setSessionCache } from '../utils/sessionCache';
import { getUserDashboardData } from '../api/dashboard';
import Loader from '../components/ui/status/Loader';

// ==============================================================================

export default function Layout({ children, dashboardData, stateChanged }) {

  const initialConfig = getSessionCache("dashboardConfig");
  // console.log('---- stateChanged', initialConfig);
  const initialContext = getSessionCache("dashboardContext");

  const [dashboardConfig, setDashboardConfig] = useState(initialConfig);
  const [userProfile, setUserProfile] = useState(initialConfig?.profile || null);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showIdleDialogue, setShowIdleDialogue] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSession, setSelectedSession] = useState(initialContext?.session || "");

  // const mounted = useRef(true);
  const ctx = getSessionCache("dashboardContext");
  // console.log('--------selectedSession==== ', selectedSession);

  // --------------------------------------------------------------------------
  async function load(sessionOverride) {
    setLoadingDashboard(true);
    setError(null);

    try {
      const activeSession = sessionOverride || ctx?.session;
      // console.log('data ____________', activeSession);

      const data = await getUserDashboardData(ctx?.profileId, activeSession);
      // console.log('data ____________', data?.success);

      if (data?.results) {
        setSessionCache("dashboardConfig", data.results);
        setDashboardConfig(data.results); // reactive update
      }
    } catch (err) {
      if (mounted.current) setError(err);
      console.error("Failed to load dashboard data", err);
    } finally {
      // if (mounted.current) 
      setLoadingDashboard(false); // ✅ always end loader
    }
  }

  // --------------------------------------------------------------------------
  // First load on mount
  // useEffect(() => {
  //   // const ctx = getSessionCache("dashboardContext");
  //   console.log('--------- again ===== ',selectedSession?.clientId,ctx?.session);

  //   if (ctx?.session !==selectedSession?.clientId) {
  //     load(ctx.session); // ✅ initial load only
  //   }
  // }, []); // empty dependency array!


  // --------------------------------------------------------------------------
  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      // ✅ skip the very first render
      didMount.current = true;
      return;
    }

    const currentContext = getSessionCache("dashboardContext");
    const newSession = selectedSession?.clientId || currentContext?.session;
    if (!newSession) return;

    if (currentContext?.session !== newSession) {
      console.log('changed on session chaned --------------');

      setSessionCache("dashboardContext", { ...currentContext, session: newSession });
      load(newSession);
    } else if (stateChanged) {
      console.log('changed on stateChanged  --------------');
      load(newSession);   // ✅ reload only after updates
    }
  }, [selectedSession?.clientId, stateChanged]);


  const reloadDashboard = async () => {
    await load(selectedSession); // your existing load function
  };
  // console.log('====== stateChanged ...  --------------', stateChanged);
  // --------------------------------------------------------------------------
  return (
    <div className="flex w-full h-screen overflow-hidden">
      <IdleTimeContainer
        onIdle={() => {
          localStorage.removeItem('token');
          setShowIdleDialogue(true);
        }}
      />

      {showIdleDialogue && (
        <ConfirmationDialogueBox
          title="Hey, You Still There?"
          description="You have been idle for a while. Do you want to log out?"
          onCancel={() => setShowIdleDialogue(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`bg-primary text-white transition-all duration-300`}>
        {sidebarOpen && (
          <Sidebar
            dashboardData={dashboardData}
            sidebarOpen={sidebarOpen}
            config={dashboardConfig} // ✅ use live config
            setSidebarOpen={setSidebarOpen}
          />
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <Navbar
          currentSession={dashboardConfig?.year}
          schoolSessions={dashboardConfig?.school?.sessions}
          setSelectedSession={setSelectedSession}
          userProfile={userProfile}
          loading={loadingDashboard}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 bg-muted overflow-y-auto">
          {loadingDashboard ? (
            <Loader />
          ) : (
            React.Children.map(children, child =>
              React.isValidElement(child)
    ? React.cloneElement(child, { dashboardConfig, reloadDashboard })
                : child
            )
          )}
        </main>
      </div>
    </div>
  );
}
