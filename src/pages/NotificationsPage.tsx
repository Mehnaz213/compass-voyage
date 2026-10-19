import React, { useState, useEffect } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  AlertTriangle,
  Ship,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { localDb } from '../services/storage';
import type { Notification } from '../types';

interface NotificationsPageProps {
  onSelectShipment: (shipmentId: string) => void;
  onUnreadChange?: (count: number) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  onSelectShipment,
  onUnreadChange,
}) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const loadNotifications = () => {
    if (!user) return;
    try {
      const { notifications: list, unread_count } = localDb.getNotifications(user.id);
      setNotifications(list);
      if (onUnreadChange) onUnreadChange(unread_count);
    } catch (e) {
      console.error('Failed to load notifications:', e);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const markAsRead = (id: string) => {
    localDb.markNotificationRead(id);
    loadNotifications();
  };

  const markAllRead = () => {
    if (!user) return;
    localDb.markAllNotificationsRead(user.id);
    loadNotifications();
  };

  const filtered = notifications.filter((n) => (filter === 'unread' ? !n.is_read : true));
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="space-y-6 relative">
      {/* Background radial glow */}
      <div className="absolute -top-10 left-1/3 w-96 h-96 bg-[#B7F500]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="pb-2 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#B7F500]" />
            <span>Operational & Shipment Notifications</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Database-backed alerts for bookings, transit delays, harbor arrivals, and schedule revisions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-[#081426] border border-slate-700 p-1 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                filter === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                filter === 'unread' ? 'bg-[#B7F500] text-[#0D2240]' : 'text-slate-400 hover:text-white'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="px-3.5 py-1.5 rounded-xl bg-[#081426] hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-[#B7F500] flex items-center gap-1.5 transition"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-[#0D2240] border border-slate-800 rounded-2xl shadow-xl">
            <Bell className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <h4 className="font-bold text-white text-sm">No notifications found</h4>
            <p className="text-xs text-slate-400 mt-1">
              {filter === 'unread'
                ? 'All notifications have been marked as read.'
                : 'No notification records exist for your account.'}
            </p>
          </div>
        ) : (
          filtered.map((n) => {
            const isDelay = n.type === 'delay';
            const isArrival = n.type === 'arrival';

            return (
              <div
                key={n.id}
                className={`p-4 rounded-2xl border transition flex items-start justify-between gap-4 ${
                  n.is_read
                    ? 'bg-[#0D2240]/60 border-slate-800 text-slate-300'
                    : 'bg-[#0D2240] border-[#B7F500]/40 text-white shadow-xl shadow-[#B7F500]/5'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      isDelay
                        ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                        : isArrival
                        ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                        : 'bg-[#081426] text-[#B7F500] border border-slate-700'
                    }`}
                  >
                    {isDelay ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : isArrival ? (
                      <Clock className="w-5 h-5" />
                    ) : (
                      <Ship className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm">{n.title}</h4>
                      {!n.is_read && (
                        <span className="w-2 h-2 rounded-full bg-[#B7F500] animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
                      {n.message}
                    </p>
                    <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-2">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{new Date(n.created_at).toLocaleString()}</span>
                      {n.booking_id && (
                        <span className="font-mono bg-slate-800/80 px-2 py-0.5 rounded text-slate-200 font-bold">
                          {n.booking_id}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {n.shipment_id && (
                    <button
                      onClick={() => onSelectShipment(n.shipment_id!)}
                      className="px-3 py-1.5 rounded-xl bg-[#081426] hover:bg-[#B7F500] text-[#B7F500] hover:text-[#0D2240] text-xs font-bold transition flex items-center gap-1 border border-[#B7F500]/30 shadow-xs"
                    >
                      <span>Journey</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {!n.is_read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      title="Mark as Read"
                      className="p-1.5 rounded-lg bg-[#081426] hover:bg-slate-800 text-slate-400 hover:text-[#B7F500] border border-slate-700 transition"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
