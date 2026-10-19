import React from 'react';
import {
  LayoutDashboard,
  Ship,
  CalendarDays,
  Users,
  Anchor,
  Bell,
  Bot,
  Search,
  Sparkles,
  Building2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';


export type NavTab =
  | 'dashboard'
  | 'shipments'
  | 'schedules'
  | 'tracking'
  | 'users'
  | 'ports'
  | 'notifications';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAgent: () => void;
  unreadCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenAgent,
  unreadCount,
}) => {
  const { user } = useAuth();
  const isOps = user?.role === 'operations';

  const opsNavItems: Array<{ id: NavTab; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: 'dashboard', label: 'Operations Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'shipments', label: 'Shipments & Bookings', icon: <Ship className="w-4 h-4" /> },
    {
      id: 'schedules',
      label: 'Transportation Schedules',
      icon: <CalendarDays className="w-4 h-4" />,
      badge: 'Lookup',
    },
    { id: 'users', label: 'Customers & Users', icon: <Users className="w-4 h-4" /> },
    { id: 'ports', label: 'Port Master Records', icon: <Anchor className="w-4 h-4" /> },
    {
      id: 'notifications',
      label: 'Fleet Notifications',
      icon: <Bell className="w-4 h-4" />,
      badge: unreadCount > 0 ? `${unreadCount}` : undefined,
    },
  ];

  const customerNavItems: Array<{ id: NavTab; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: 'dashboard', label: 'Customer Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'shipments', label: 'My Shipments', icon: <Ship className="w-4 h-4" /> },
    { id: 'tracking', label: 'Track Shipment', icon: <Search className="w-4 h-4" /> },
    {
      id: 'notifications',
      label: 'My Notifications',
      icon: <Bell className="w-4 h-4" />,
      badge: unreadCount > 0 ? `${unreadCount}` : undefined,
    },
  ];

  const navItems = isOps ? opsNavItems : customerNavItems;

  return (
    <aside className="w-64 bg-[#0D2240] border-r border-slate-800 flex flex-col justify-between shrink-0 select-none hidden md:flex">
      {/* Top Nav Section */}
      <div className="p-4 space-y-4">

        {/* User Company Context Pill */}
        <div className="p-3 rounded-xl bg-[#081426] border border-slate-800">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#B7F500]" /> Active Workspace
          </div>
          <div className="font-bold text-sm text-white mt-1 truncate" title={user?.company}>
            {user?.company}
          </div>
          <div className="text-xs text-slate-400 mt-0.5 capitalize flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#B7F500]" />
            {isOps ? `Operations • ${user?.permissions} access` : 'Authorized Customer Portal'}
          </div>
        </div>

        {/* Navigation items */}
        <div className="space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-2">
            Navigation Menu
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition duration-150 ${
                  isActive
                    ? 'bg-[#B7F500] text-[#0D2240] font-bold shadow-md shadow-[#B7F500]/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-[#0D2240]' : 'text-[#B7F500]'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      isActive
                        ? 'bg-[#0D2240] text-white'
                        : item.id === 'notifications'
                        ? 'bg-rose-500 text-white'
                        : 'bg-[#B7F500]/20 text-[#B7F500] border border-[#B7F500]/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Compass Agent Banner at Bottom */}
      <div className="p-4 border-t border-slate-800">
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#122A4E] to-[#0A1628] border border-[#B7F500]/30 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-[#B7F500]/20 text-[#B7F500]">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-white">Compass Agent</div>
              <div className="text-[10px] text-slate-300">Live Database Assistant</div>
            </div>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            Need fast status on delays, arrivals, or booking lookups?
          </p>
          <button
            onClick={onOpenAgent}
            className="mt-3 w-full py-1.5 px-3 rounded-lg bg-[#B7F500] hover:bg-[#a6dc00] text-[#0D2240] font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Query Assistant</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
