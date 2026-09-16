import { useEffect, useState, useRef } from 'react';
import { Bell, Check } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { notificationsService, type Notification } from '../../features/notifications/notificationsService';

export function NotificationBell() {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    if (profile) {
      try {
        const data = await notificationsService.getMyNotifications(profile.id);
        setNotifications(data);
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Auto refresh every 30s as a fallback for realtime
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [profile]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAsRead = async (id: string) => {
    await notificationsService.markAsRead(id);
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const handleMarkAllAsRead = async () => {
    if (!profile) return;
    await notificationsService.markAllAsRead(profile.id);
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-primary transition-colors rounded-full hover:bg-gray-100 focus:outline-none"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
          <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs text-primary hover:underline flex items-center"
              >
                <Check className="w-3 h-3 mr-1" /> Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                You're all caught up!
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {notifications.map(n => (
                  <li 
                    key={n.id} 
                    className={`p-4 hover:bg-gray-50 transition-colors ${!n.is_read ? 'bg-blue-50/50' : ''}`}
                    onClick={() => { if (!n.is_read) handleMarkAsRead(n.id); }}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm font-medium ${!n.is_read ? 'text-gray-900' : 'text-gray-700'}`}>{n.title}</h4>
                      {!n.is_read && <span className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></span>}
                    </div>
                    <p className={`text-sm ${!n.is_read ? 'text-gray-700' : 'text-gray-500'}`}>{n.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(n.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
