import React from 'react';
import {
  HiOutlineBell,
} from 'react-icons/hi';
import {
  AiOutlineMessage,
  AiOutlineCheckCircle,
  AiOutlineWarning,
  AiOutlineUserAdd,
} from 'react-icons/ai';
import { motion } from 'framer-motion';
import { AiOutlineCheck } from 'react-icons/ai';

// Helper to convert ISO date to relative time
const formatRelativeTime = (dateString) => {
  const now = new Date();
  const then = new Date(dateString);
  const seconds = Math.floor((now - then) / 1000);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (seconds < 60) return rtf.format(-seconds, 'second');
  if (seconds < 3600) return rtf.format(-Math.floor(seconds / 60), 'minute');
  if (seconds < 86400) return rtf.format(-Math.floor(seconds / 3600), 'hour');
  return rtf.format(-Math.floor(seconds / 86400), 'day');
};

const getIcon = (type) => {
  switch (type) {
    case 'message':
      return <AiOutlineMessage className="text-blue-500 text-lg" />;
    case 'success':
      return <AiOutlineCheckCircle className="text-green-500 text-lg" />;
    case 'warning':
      return <AiOutlineWarning className="text-yellow-500 text-lg" />;
    case 'alert':
      return <HiOutlineBell className="text-red-500 text-lg" />;
    case 'lead.created':
      return <AiOutlineUserAdd className="text-purple-500 text-lg" />;
    default:
      return <HiOutlineBell className="text-accent text-lg" />;
  }
};

const NotificationPanel = ({ notifications, isOpen, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : 50 }}
      transition={{ duration: 0.3 }}
      className={`absolute top-20 right-6 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden ${isOpen ? 'block' : 'hidden'}`}
    >
      <div className="px-6 py-3 flex items-center justify-between bg-accent text-white rounded-t-xl">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <button
          onClick={onClose}
          className="text-sm bg-background text-primary px-3 py-1 rounded-md hover:bg-gray-200 transition-colors"
        >
          Close
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {(!notifications || notifications.length === 0) ? (
          <div className="p-6 text-center text-gray-500">No new notifications</div>
        ) : (
          notifications.map((note, index) => (
            <div
              key={note._id || index}
              className="flex items-start gap-4 px-6 py-4 border-b hover:bg-accent-muted transition-all duration-200"
            >
              <div className="p-3 bg-accent/10 rounded-full">
                {getIcon(note.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{note.message}</p>
                <p className="text-xs text-gray-500">
                  {note.createdAt ? formatRelativeTime(note.createdAt) : 'Just now'}
                </p>
              </div>
              <div className="flex sm:flex-row sm:items-center justify-between text-xs text-gray-500 mt-2">
                {!note.isRead && (  
                 <button
                 onClick={() => onMarkRead(note._id)}
                 className="px-2 py-1 text-xs rounded-md text-gray-500 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 transition-colors"
               >
                 Mark as Read
               </button>
               
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default NotificationPanel;
