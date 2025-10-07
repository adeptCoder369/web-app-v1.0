'use client';
import React, { useEffect, useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarDays, MapPin, Clock, Filter, TrendingUp, Sparkles, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getEvents } from '../../../api/event';
import ChartLoadingSkeleton from '../../../components/ui/status/ChartLoadingSkeleton';
import { getSessionCache } from '../../../utils/sessionCache';
import Layout from '../../../layouts/Layout';
import { Breadcrumbs } from '../../../components/ui/Breadcrumb/breadcrumb';


const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Shcool Calendar" },
];

const statusConfig = {
  Upcoming: {
    gradient: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50',
    text: 'text-emerald-700',
    border: 'border-l-4 border-emerald-500',
    badge: 'bg-emerald-500 text-white',
    dot: 'bg-emerald-500',
    shadow: 'hover:shadow-emerald-100',
    calColor: '#10B981',
    calBorder: '#059669'
  },
  Ongoing: {
    gradient: 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50',
    text: 'text-amber-700',
    border: 'border-l-4 border-amber-500',
    badge: 'bg-amber-500 text-white',
    dot: 'bg-amber-500',
    shadow: 'hover:shadow-amber-100',
    calColor: '#F59E0B',
    calBorder: '#F97316'
  },
  Passed: {
    gradient: 'bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50',
    text: 'text-slate-600',
    border: 'border-l-4 border-slate-400',
    badge: 'bg-slate-400 text-white',
    dot: 'bg-slate-400',
    shadow: 'hover:shadow-slate-100',
    calColor: '#94A3B8',
    calBorder: '#CBD5E1'
  }
};

const EventInsightsDashboard = () => {
  const context = getSessionCache('dashboardContext');
  const profileId = context?.profileId;
  const session = context?.session;

  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const today = new Date();

  useEffect(() => {
    if (!profileId || !session) return;
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const resp = await getEvents(profileId, session);
        const fetchedEvents = resp?.data?.results?.events || [];
        setEvents(fetchedEvents);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [profileId, session]);

  const enrichedEvents = useMemo(() => {
    return events.map((ev) => {
      const start = new Date(ev.start_date + 'T' + (ev.start_time || '00:00:00'));
      const end = new Date(ev.end_date + 'T' + (ev.end_time || '23:59:59'));

      let status = 'Upcoming';
      if (end < today) status = 'Passed';
      else if (start <= today && today <= end) status = 'Ongoing';

      return { ...ev, start, end, status };
    });
  }, [events, today]);

  const filteredEvents = useMemo(() => {
    if (filterType === 'All') return enrichedEvents;
    return enrichedEvents.filter((ev) => ev.event_type?.name === filterType);
  }, [enrichedEvents, filterType]);

  const stats = useMemo(() => {
    const total = enrichedEvents.length;
    const upcoming = enrichedEvents.filter((ev) => ev.status === 'Upcoming').length;
    const ongoing = enrichedEvents.filter((ev) => ev.status === 'Ongoing').length;
    const passed = enrichedEvents.filter((ev) => ev.status === 'Passed').length;
    return { total, upcoming, ongoing, passed };
  }, [enrichedEvents]);

  const calendarEvents = useMemo(() => {
    return enrichedEvents.map((ev) => ({
      id: ev.id,
      title: ev.title || 'Untitled Event',
      start: ev.start.toISOString(),
      end: ev.end.toISOString(),
      backgroundColor: statusConfig[ev.status].calColor,
      borderColor: statusConfig[ev.status].calBorder,
      extendedProps: {
        description: ev.description || 'No description',
        venue: ev.venue || 'Main Campus Grounds',
        type: ev.event_type?.name || 'General',
        status: ev.status,
      },
    }));
  }, [enrichedEvents]);

  const handleEventClick = (info) => {
    const { title, extendedProps, start, end } = info.event;
    alert(
      `${title}\n\n${extendedProps.description}\n\n📍 Venue: ${extendedProps.venue}\n🗓 ${start.toDateString()}${end ? ` - ${end.toDateString()}` : ''
      }\nStatus: ${extendedProps.status}`
    );
  };

  const renderEventContent = (info) => {
    const { type, status } = info.event.extendedProps;
    return (
      <div className="p-1 text-[11px] leading-tight">
        <p className="font-semibold text-white drop-shadow">{info.event.title}</p>
        <p className="text-white/90 text-[10px]">{type}</p>
      </div>
    );
  };

  const eventTypes = Array.from(new Set(enrichedEvents.map((ev) => ev.event_type?.name).filter(Boolean)));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <ChartLoadingSkeleton count={6} />
      </div>
    );
  }

  return (


    <>
      <Layout>


        <div
          className="min-h-[calc(100vh-100px)] p-6 space-y-6"
          style={{
            backgroundImage: "url('/bg/appbackground@2x.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >


          <Breadcrumbs items={breadcrumbs} />
          <div className="space-y-6">
            {/* Compact Header with Stats */}
            <div className="m-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-xl shadow-xl p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <CalendarDays className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">Event Insights</h2>
                    <p className="text-blue-100 text-sm md:text-xs">Track and manage all school events</p>
                  </div>
                </div>

                {/* Filter */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-3 py-2 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                >
                  <option value="All" className="text-gray-900">All Types</option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type} className="text-gray-900">{type}</option>
                  ))}
                </select>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Total Events', value: stats.total, bg: 'bg-white/20', border: 'border-white/30' },
                  { label: 'Upcoming', value: stats.upcoming, bg: 'bg-emerald-500/30', border: 'border-emerald-400/50' },
                  { label: 'Ongoing', value: stats.ongoing, bg: 'bg-amber-500/30', border: 'border-amber-400/50' },
                  { label: 'Passed', value: stats.passed, bg: 'bg-slate-500/30', border: 'border-slate-400/50' },
                ].map((stat) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ scale: 1.05 }}
                    className={`${stat.bg} backdrop-blur-sm rounded-xl p-3 border ${stat.border} flex flex-col items-start`}
                  >
                    <p className="text-white/80 text-xs font-medium">{stat.label}</p>
                    <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>


            {/* Compact Event Cards */}
            <AnimatePresence mode="wait">
              {['Ongoing', 'Upcoming', 'Passed'].map((status) => {
                const eventsByStatus = filteredEvents.filter(ev => ev.status === status);
                if (!eventsByStatus.length) return null;

                return (
                  <motion.div
                    key={status}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="m-4 flex items-center gap-2 mb-3">
                      <div className={`w-2 h-2 rounded-full ${statusConfig[status].dot} animate-pulse`} />
                      <h3 className="text-lg font-bold text-gray-800">{status} Events</h3>
                      <span className="text-sm text-gray-500">({eventsByStatus.length})</span>
                    </div>

                    <div className="m-2 grid md:grid-cols-2 lg:grid-cols-3 gap-3 shadow-md  rounded bg-blue-50 p-4">
                      {eventsByStatus.map((ev, idx) => (
                        <motion.div
                          key={ev.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          className={`${statusConfig[status].gradient} ${statusConfig[status].border} rounded-lg p-3 shadow-sm ${statusConfig[status].shadow} transition-all duration-200 cursor-pointer`}
                        >
                          {/* Title + Type */}
                          <div className="flex items-center  justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 text-base line-clamp-1">{ev.title}</h4>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${statusConfig[status].badge}`}>
                              {ev.event_type?.name || 'General'}
                            </span>
                          </div>

                          {/* Date + Venue */}
                          <div className="flex flex-col gap-1 text-sm text-gray-700 mb-2">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="font-medium">{ev.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                              {ev.start.toDateString() !== ev.end.toDateString() && (
                                <span>- {ev.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="line-clamp-1">{ev.venue || 'Main Campus Grounds'}</span>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-gray-600 line-clamp-3 leading-snug">
                            {ev.description || 'No description available'}
                          </p>
                        </motion.div>
                      ))}
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Compact Calendar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-indigo-500" />
                <h3 className="text-lg font-bold text-gray-800">Calendar View</h3>
              </div>

              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek',
                }}
                events={calendarEvents}
                eventContent={renderEventContent}
                eventClick={handleEventClick}
                height="auto"
                dayMaxEvents={3}
                eventDisplay="block"
                eventTimeFormat={{
                  hour: '2-digit',
                  minute: '2-digit',
                  meridiem: false
                }}
              />
            </motion.div>
          </div>
        </div>
      </Layout>

    </>
  );
};

export default EventInsightsDashboard;