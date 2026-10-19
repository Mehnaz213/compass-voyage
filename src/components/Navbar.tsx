import React from 'react';
import { Bell, Bot, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CompassLogo } from './CompassLogo';

interface NavbarProps {
  onOpenAgent: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAgent,
  onOpenNotifications,
  unreadNotificationsCount,
}) => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-[#0D2240] border-b border-slate-800 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <CompassLogo size="sm" />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base md:text-lg text-white tracking-tight">Compass Voyage</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-[#B7F500]/15 text-[#B7F500] border border-[#B7F500]/30">
              v2.4
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium tracking-wide hidden sm:block">
            Compass Logistics International
          </p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">

        {/* Compass Agent Trigger */}
        <button
          onClick={onOpenAgent}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#081426] hover:bg-[#112440] border border-[#B7F500]/30 hover:border-[#B7F500] text-xs font-semibold text-[#B7F500] transition shadow-sm"
          title="Open Compass Agent"
        >
          <Bot className="w-4 h-4" />
          <span className="hidden md:inline">Compass Agent</span>
        </button>

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg bg-[#081426] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition"
          title="View Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold rounded-full bg-rose-500 text-white px-1 shadow-sm">
              {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* User Role Badge & Logout */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-white truncate max-w-[130px]">{user?.name}</span>
            <div className="flex items-center justify-end gap-1">
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                  user?.role === 'operations'
                    ? 'bg-[#B7F500]/20 text-[#B7F500]'
                    : 'bg-emerald-500/20 text-emerald-300'
                }`}
              >
                {user?.role === 'operations' ? `Ops (${user.permissions})` : 'Customer'}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg bg-[#081426] hover:bg-rose-950/50 hover:text-rose-400 text-slate-400 border border-slate-700/80 transition"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
