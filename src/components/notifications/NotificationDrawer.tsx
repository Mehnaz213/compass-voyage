import React from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { 
  X, 
  Bell, 
  CheckCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Ship, 
  ArrowRight 
} from 'lucide-react';
import { AppNotification, Shipment } from '../../types/logistics';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectShipment: (shipment: Shipment) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onSelectShipment
}) => {
  const { 
    currentUser, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead,
    shipments 
  } = useLogistics();

  if (!isOpen) return null;

  // Filter scoped notifications
  const scopedNotifications = notifications.filter(n => {
    if (currentUser.role === 'customer') {
      return n.customerId === currentUser.customerId;
    }
    return true; // Operations sees all
  });

  const getNotifIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'delay_alert':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'delivered':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'eta_revision':
        return <Calendar className="w-4 h-4 text-sky-600" />;
      case 'booking_confirmed':
        return <Ship className="w-4 h-4 text-[#0D2240]" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  const handleNotificationClick = (n: AppNotification) => {
    markNotificationRead(n.id);
    const targetShipment = shipments.find(s => s.id === n.shipmentId || s.bookingNumber === n.bookingNumber);
    if (targetShipment) {
      onSelectShipment(targetShipment);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-100">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#132B4F] shadow-2xl border-l border-slate-700/80 flex flex-col text-slate-100">
          
          {/* Header */}
          <div className="p-4 sm:p-5 bg-[#0A1A30] border-b border-slate-800 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <Bell className="w-5 h-5 text-[#B7F500]" />
              <div>
                <h2 className="text-sm font-bold text-white">Logistics Notifications</h2>
                <p className="text-[10px] text-slate-300">
                  {currentUser.role === 'operations' ? 'System-wide operational feed' : 'Your consignment updates'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={markAllNotificationsRead}
                className="text-[11px] text-[#B7F500] hover:text-white flex items-center gap-1 font-semibold cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark All Read</span>
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80 p-2 bg-[#0D2240]">
            {scopedNotifications.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs">
                <p className="font-semibold text-slate-300">No notifications</p>
                <p className="mt-1">You are all caught up!</p>
              </div>
            ) : (
              scopedNotifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3.5 rounded-xl my-1 transition-all cursor-pointer flex items-start gap-3 ${
                    !n.read 
                      ? 'bg-[#132B4F] hover:bg-[#1A3865] border border-slate-700/80 shadow-xs' 
                      : 'hover:bg-[#132B4F]/50 text-slate-400'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-[#0A1A30] border border-slate-700 shrink-0 mt-0.5">
                    {getNotifIcon(n.type)}
                  </div>

                  <div className="space-y-1 flex-1 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`font-semibold ${!n.read ? 'text-white' : 'text-slate-300'}`}>
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#B7F500] shrink-0"></span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {n.message}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-mono">
                      <span>Booking: <strong className="text-[#B7F500]">{n.bookingNumber}</strong></span>
                      <span>{new Date(n.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-[#0A1A30] border-t border-slate-800 text-center text-[11px] text-slate-400 shrink-0">
            Click any notice to view its associated journey timeline
          </div>

        </div>
      </div>
    </div>
  );
};
