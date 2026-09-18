'use client';
import React, { useEffect, useState } from 'react';
import { CalendarDays, MapPin, Clock, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { getEvents } from '../../api/event';
import ChartLoadingSkeleton from '../ui/status/ChartLoadingSkeleton';
import { useRouter } from 'next/navigation';

// =============================
// Utility: Format date + helpers
// =============================
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const getDayParts = (dateStr) => {
  if (!dateStr) return { day: '--', mon: '---' };
  const d = new Date(dateStr);
  if (isNaN(d)) return { day: '--', mon: '---' };
  return {
    day: d.toLocaleDateString('en-GB', { day: '2-digit' }),
    mon: d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase(),
    weekday: d.toLocaleDateString('en-GB', { weekday: 'short' }),
  };
};

const getDaysLeft = (dateStr) => {
  if (!dateStr) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr); d.setHours(0, 0, 0, 0);
  const diff = Math.round((d - today) / 86400000);
  if (diff < 0) return null;
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return `in ${diff} days`;
};

// =============================
// Component
// =============================
const UpcomingEvent = ({ context }) => {

  const router = useRouter();

  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const resp = await getEvents(context?.profileId, context?.session);
      const fetched = resp?.data?.results?.events || [];
      setEvents(fetched);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // =============================
  // Fallback dummy (for missing or empty data)
  // =============================
  const dummyEvents = [
    {
      id: '1',
      title: 'Annual Sports Day',
      description: 'A grand celebration of school sports and talent.',
      event_type: { name: 'Event', color: '#3B82F6' },
      start_date: '2025-12-15',
      end_date: '2025-12-15',
      display_time: '10:00 AM',
      venue: 'School Playground',
    },
    {
      id: '2',
      title: 'Parent-Teacher Meeting',
      description: 'Discussion on academic progress and upcoming exams.',
      event_type: { name: 'Meeting', color: '#F59E0B' },
      start_date: '2025-12-18',
      end_date: '2025-12-18',
      display_time: '02:00 PM',
      venue: 'Conference Hall',
    },
    {
      id: '3',
      title: 'Science Exhibition',
      description: 'Students showcase innovative scientific models.',
      event_type: { name: 'Academic', color: '#10B981' },
      start_date: '2025-12-22',
      end_date: '2025-12-22',
      display_time: '09:30 AM',
      venue: 'Main Auditorium',
    },
  ];

  const displayEvents =
    !isLoading && events.length > 0
      ? events.map((event) => ({
        id: event.id,
        title: event.title || 'Untitled Event',
        description:
          event.description || 'An engaging event with school participation.',
        event_type: event.event_type || {
          name: 'General',
          color: '#6366F1',
        },
        start_date: event.start_date,
        end_date: event.end_date,
        display_time:
          event.display_time?.trim() || '10:00 AM - 12:00 PM',
        venue: event.venue || 'Main Campus Grounds',
      }))
      : dummyEvents;

  // =============================
  // Render
  // =============================
  return (
    <div className="relative overflow-hidden bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100">
      {/* Accent top bar */}
      <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500" />
      {/* Soft glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-indigo-100/60 blur-3xl" />

      <div className="p-5 sm:p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="flex items-center gap-2.5">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20">
              <CalendarDays className="w-[18px] h-[18px]" />
            </span>
            <span>
              <span className="block text-[15px] font-bold text-slate-900 leading-tight tracking-tight">
                Upcoming Events
              </span>
              <span className="block text-[11px] font-medium text-slate-400">
                {isLoading ? 'Fetching schedule…' : `${displayEvents.length} scheduled`}
              </span>
            </span>
          </h2>
          <span className="hidden sm:inline-flex items-center text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse mr-1.5" />
            Live
          </span>
        </div>

        {isLoading ? (
          <ChartLoadingSkeleton count={4} />
        ) : displayEvents.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/60">
            <span className="mx-auto mb-3 grid place-items-center w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100">
              <CalendarDays className="w-6 h-6 text-slate-300" />
            </span>
            <p className="text-sm font-semibold text-slate-700">No upcoming events</p>
            <p className="text-xs text-slate-400 mt-1">New events will appear here once scheduled.</p>
          </div>
        ) : (
          <div className="relative">
            {/* vertical timeline line */}
            <div className="absolute left-[26px] top-2 bottom-2 w-px bg-gradient-to-b from-blue-100 via-indigo-100 to-transparent" />
            <div className="space-y-3">
              {displayEvents.map((event, index) => {
                const dp = getDayParts(event.start_date);
                const daysLeft = getDaysLeft(event.start_date);
                const accent = event.event_type?.color || '#3B82F6';
                return (
                  <motion.div
                    key={event.id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.3 }}
                    whileHover={{ x: 3 }}
                    className="group relative flex gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-[0_8px_24px_rgb(79,70,229,0.10)] transition-all duration-200 cursor-default"
                  >
                    {/* Date badge */}
                    <div className="relative z-10 flex flex-col items-center justify-center w-[52px] h-[60px] flex-shrink-0 rounded-xl text-white shadow-md overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${accent}, ${accent}CC)` }}>
                      <span className="text-[10px] font-bold tracking-widest opacity-90 leading-none mt-1.5">{dp.mon}</span>
                      <span className="text-xl font-extrabold leading-none my-0.5">{dp.day}</span>
                      <span className="text-[10px] font-medium opacity-80 leading-none mb-1.5">{dp.weekday || ''}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[13px] font-bold text-slate-900 leading-snug truncate group-hover:text-indigo-700 transition-colors">
                          {event.title}
                        </p>
                        {daysLeft && (
                          <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${daysLeft === 'Today' ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 'text-indigo-600 bg-indigo-50 border border-indigo-100'}`}>
                            {daysLeft}
                          </span>
                        )}
                      </div>

                      <span
                        className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md"
                        style={{ color: accent, backgroundColor: `${accent}14` }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
                        {event.event_type?.name}
                      </span>

                      {event.description && (
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 flex items-center gap-1">
                          <FileText className="w-3 h-3 flex-shrink-0 text-slate-300" />
                          <span className="truncate">{event.description}</span>
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                          <Clock className="w-3 h-3 text-indigo-400" />
                          {event.display_time}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 max-w-full">
                          <MapPin className="w-3 h-3 text-rose-400 flex-shrink-0" />
                          <span className="truncate">{event.venue || 'Main School Campus'}</span>
                        </span>
                      </div>

                      {(event.end_date && event.start_date !== event.end_date) && (
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">
                          {formatDate(event.start_date)} → {formatDate(event.end_date)}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        <button
          onClick={() => router.push(`/dashboard/calendar`)}
          className="group cursor-pointer w-full mt-5 inline-flex items-center justify-center gap-1.5 text-[13px] font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl py-2.5 shadow-md shadow-blue-600/20 hover:shadow-lg transition-all active:scale-[0.99]"
        >
          <CalendarDays className="w-4 h-4 opacity-80 group-hover:rotate-6 transition-transform" />
          View Full Calendar
          <span aria-hidden className="group-hover:translate-x-0.5 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
};

export default UpcomingEvent;
