import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getFeeCollectionSummary } from '../../api/fees';
import { getSessionCache } from '../../utils/sessionCache';
import Loader from '../ui/status/Loader';
import ChartLoadingSkeleton from '../ui/status/ChartLoadingSkeleton';

const UpcomingEvent = () => {




  const upcomingEvents = [
    { title: "Annual Sports Day", date: "Dec 15", type: "event" },
    { title: "Parent-Teacher Meeting", date: "Dec 18", type: "meeting" },
    { title: "Science Exhibition", date: "Dec 22", type: "academic" },
    { title: "Winter Break Starts", date: "Dec 25", type: "holiday" }
  ];


  return (
    <>

      {/* Upcoming Events */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Upcoming Events</h2>
        <div className="space-y-3">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{event.title}</p>
                  <p className="text-xs text-gray-500">{event.type}</p>
                </div>
              </div>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {event.date}
              </span>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
          View calendar →
        </button>
      </div>
    </>
  );
};

export default UpcomingEvent;