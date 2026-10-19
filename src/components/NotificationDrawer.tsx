import React, { useState, useEffect } from 'react';
import { X, Bell, Check, CheckCheck, Clock, AlertTriangle, Ship, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { localDb } from '../services/storage';
import type { Notification } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectShipment: (shipmentId: string) => void;
  onUnreadChange?: (count: number) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onSelectShipment,
  onUnreadChange,
}) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

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
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen, user]);

  const markAsRead = (id: string) => {
    localDb.markNotificationRead(id);
    loadNotifications();
  };

  const markAllRead = () => {
    if (!user) return;
    localDb.markAllNotificationsRead(user.id);
    loadNotifications();
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-[#0D2240] border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 text-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-[#081426] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#B7F500]/15 text-[#B7F500] border border-[#B7F500]/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Notifications</h3>
              <p className="text-xs text-slate-400">
                {unreadCount > 0 ? `${unreadCount} unread update(s)` : 'All caught up'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-[#B7F500] hover:underline flex items-center gap-1 font-semibold px-2 py-1"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-500" />
              No notifications recorded yet.
            </div>
          ) : (
            notifications.map((n) => {
              const isDelay = n.type === 'delay';
              const isArrival = n.type === 'arrival';
              return (
                <div
                  key={n.id}
                  className={`p-3.5 rounded-xl border transition ${
                    n.is_read
                      ? 'bg-[#081426]/60 border-slate-800/80 text-slate-300'
                      : 'bg-[#0F2A4F] border-[#B7F500]/40 text-white shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                          isDelay
                            ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                            : isArrival
                            ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-800 text-[#B7F500]'
                        }`}
                      >
                        {isDelay ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : isArrival ? (
                          <Clock className="w-4 h-4" />
                        ) : (
                          <Ship className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white leading-snug">{n.title}</h4>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                        <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-2">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{new Date(n.created_at).toLocaleString()}</span>
                          {n.booking_id && (
                            <span className="font-mono bg-slate-800/80 px-1.5 py-0.5 rounded text-slate-300 font-semibold">
                              {n.booking_id}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {!n.is_read && (
                      <button
                        onClick={() => markAsRead(n.id)}
                        title="Mark as read"
                        className="p-1 rounded text-slate-400 hover:text-[#B7F500] hover:bg-slate-800 shrink-0"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {n.shipment_id && (
                    <button
                      onClick={() => {
                        onSelectShipment(n.shipment_id!);
                        onClose();
                      }}
                      className="mt-2.5 pt-2 border-t border-slate-700/50 w-full text-xs font-semibold text-[#B7F500] hover:text-[#c4ff1a] flex items-center justify-between group"
                    >
                      <span>View shipment journey</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
