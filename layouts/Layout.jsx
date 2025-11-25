'use client';

import Navbar from '../components/Navbar';
import ConfirmationDialogueBox from '../components/ui/status/Confirmation';
import IdleTimeContainer from '../autoLogout';
import Sidebar from '../components/Sidebar';
import React, { useEffect, useState, useRef } from 'react';
import { getSessionCache, setSessionCache } from '../utils/sessionCache';
import { getUserDashboardData } from '../api/dashboard';
import Loader from '../components/ui/status/Loader';

export default function Layout({ children, dashboardData, stateChanged }) {

  const initialConfig = getSessionCache("dashboardConfig");
  const initialContext = getSessionCache("dashboardContext");

  const [dashboardConfig, setDashboardConfig] = useState(initialConfig);
  const [userProfile, setUserProfile] = useState(initialConfig?.profile || null);

  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showIdleDialogue, setShowIdleDialogue] = useState(false);
  const [selectedSession, setSelectedSession] = useState(initialContext?.session || "");

  const didMount = useRef(false);

  async function load(sessionOverride) {
    setLoadingDashboard(true);

    try {
      const activeSession = sessionOverride || initialContext?.session;
      const data = await getUserDashboardData(initialContext?.profileId, activeSession);

      if (data?.results) {
        setSessionCache("dashboardConfig", data.results);
        setDashboardConfig(data.results);
      }

    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoadingDashboard(false);
    }
  }

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    const context = getSessionCache("dashboardContext");
    const newSession = selectedSession?.clientId || context?.session;

    if (!newSession) return;

    if (context?.session !== newSession) {
      setSessionCache("dashboardContext", { ...context, session: newSession });
      load(newSession);
    } else if (stateChanged) {
      load(newSession);
    }
  }, [selectedSession?.clientId, stateChanged]);

  return (
    <div className="flex w-full min-h-screen bg-gray-50">

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
      <div
        className={`
          ${sidebarOpen ? "w-64" : "w-0"}
          bg-primary text-white transition-all duration-300
          flex-shrink-0 overflow-hidden
        `}
      >
        <Sidebar
          dashboardData={dashboardData}
          sidebarOpen={sidebarOpen}
          config={dashboardConfig}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen">

        <Navbar
          currentSession={dashboardConfig?.year}
          schoolSessions={dashboardConfig?.school?.sessions}
          setSelectedSession={setSelectedSession}
          userProfile={userProfile}
          loading={loadingDashboard}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted">
          {loadingDashboard ? (
            <Loader />
          ) : (
            React.Children.map(children, child =>
              React.isValidElement(child)
                ? React.cloneElement(child, { dashboardConfig })
                : child
            )
          )}
        </main>

      </div>
    </div>
  );
}
