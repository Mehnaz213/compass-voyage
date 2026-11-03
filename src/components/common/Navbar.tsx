import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { CompassLogo } from './CompassLogo';
import { Bell, Bot, LogOut, ChevronDown, User, Shield, Building2, Package, RotateCcw } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNotifications: () => void;
  onOpenAgent: () => void;
  onOpenResetModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNotifications,
  onOpenAgent,
  onOpenResetModal,
  onLogout
}) => {
  const { currentUser, customers, notifications, customerShipment } = useLogistics();
  const [profileOpen, setProfileOpen] = useState(false);

  // Scoped notifications count
  const unreadCount = notifications.filter(n => {
    if (n.read) return false;
    if (currentUser.role === 'customer') {
      return n.customerId === currentUser.customerId;
    }
    return true; // Operations sees all
  }).length;

  // Active customer details if role === 'customer'
  const currentCustomer = currentUser.customerId 
    ? customers.find(c => c.id === currentUser.customerId) 
    : null;

  return (
    <header className="sticky top-0 z-40 bg-[#0D2240] border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        
        {/* Zone 1: Brand & Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <CompassLogo size="sm" showCardBorder={true} />
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5 whitespace-nowrap">
              Compass Voyage
              <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                currentUser.role === 'operations' 
                  ? 'bg-[#B7F500] text-[#0D2240]' 
                  : 'bg-sky-400 text-[#0D2240]'
              }`}>
                {currentUser.role === 'operations' ? 'Operations' : 'Customer'}
              </span>
            </span>
            <span className="text-[10px] text-slate-300 tracking-wider">Compass Logistics International</span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {currentUser.role === 'operations' ? (
            <>
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-white/10 text-[#B7F500] font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Operations Overview
              </button>
              <button
                onClick={() => setActiveTab('schedule-lookup')}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'schedule-lookup'
                    ? 'bg-white/10 text-[#B7F500] font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Schedule Lookup
              </button>
              <button
                onClick={() => setActiveTab('carrier-comparison')}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'carrier-comparison'
                    ? 'bg-white/10 text-[#B7F500] font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Carrier Comparison
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('my-shipment')}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'my-shipment'
                    ? 'bg-white/10 text-[#B7F500] font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                My Shipment & Tracking
              </button>
              {customerShipment && (
                <button
                  onClick={() => setActiveTab('my-milestones')}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === 'my-milestones'
                      ? 'bg-white/10 text-[#B7F500] font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Journey Milestones
                </button>
              )}
            </>
          )}

          {/* Compass Agent Trigger in Nav */}
          <button
            onClick={onOpenAgent}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[#B7F500] hover:bg-[#B7F500]/10 transition-colors whitespace-nowrap font-medium cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span>Compass Agent</span>
          </button>
        </nav>

        {/* Zone 3: Header Actions & User Profile & Logout */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            title="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#B7F500] text-[10px] font-bold text-[#0D2240]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile Menu (Account Details & Role Session Info) */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs transition-colors cursor-pointer"
              title="View active profile details"
            >
              <div className={`w-2 h-2 rounded-full ${currentUser.role === 'operations' ? 'bg-[#B7F500]' : 'bg-sky-400'}`}></div>
              <div className="text-left hidden sm:block max-w-[130px] truncate">
                <p className="font-semibold text-white leading-tight truncate">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 capitalize">{currentUser.role === 'operations' ? 'Operations' : 'Client 1:1'}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {profileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#132B4F] text-slate-100 shadow-2xl border border-slate-700/90 py-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                  
                  {/* Profile Header */}
                  <div className="px-4 pb-3 border-b border-slate-700/80">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#0D2240] border border-slate-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-white text-sm truncate">{currentUser.name}</p>
                        <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                      </div>
                    </div>
                    
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        currentUser.role === 'operations'
                          ? 'bg-[#B7F500]/15 text-[#B7F500] border border-[#B7F500]/30'
                          : 'bg-sky-400/15 text-sky-300 border border-sky-400/30'
                      }`}>
                        <Shield className="w-3 h-3" />
                        <span>{currentUser.role === 'operations' ? 'Operations Specialist' : 'Customer Account (1:1)'}</span>
                      </span>
                      <span className="text-[10px] text-slate-400">Fixed Session</span>
                    </div>
                  </div>

                  {/* Profile Details List */}
                  <div className="px-4 py-3 space-y-2 text-xs border-b border-slate-700/80">
                    {currentUser.role === 'customer' ? (
                      <>
                        <div className="flex items-start gap-2 text-slate-300">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase block">Company</span>
                            <span className="font-semibold text-white">{currentCustomer?.companyName || 'Enterprise Client'}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 text-slate-300">
                          <Package className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase block">Assigned Booking</span>
                            <span className="font-mono font-bold text-[#B7F500]">{customerShipment?.bookingNumber || 'Isolated 1:1'}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start gap-2 text-slate-300">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase block">Job Title</span>
                            <span className="font-semibold text-white">{currentUser.jobTitle || 'Operations Specialist'}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 text-slate-300">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase block">Department</span>
                            <span className="font-semibold text-white">{currentUser.department || 'Global Fleet Operations'}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Security Notice */}
                  <div className="px-4 py-2 text-[11px] text-slate-400 bg-[#0A1A30]/50 border-b border-slate-700/80">
                    <p>
                      Role-based authorization is locked to this authenticated account. To switch accounts, log out and sign in with the target credentials.
                    </p>
                  </div>

                  {/* Actions & Prominent Logout */}
                  <div className="px-4 pt-3 pb-1 space-y-2">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        onOpenResetModal();
                      }}
                      className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-white py-1 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                        <span>Reset POC Demo Data</span>
                      </span>
                      <span className="text-[10px] text-slate-500">Restore Seed</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>

                </div>
              </>
            )}
          </div>

          {/* Primary Header Logout Button (Clearly Visible) */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            title="Log out of Compass Voyage"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>

        </div>

      </div>

      {/* Mobile nav links */}
      <div className="md:hidden border-t border-slate-800 px-4 py-2 flex items-center justify-between overflow-x-auto text-xs gap-1">
        {currentUser.role === 'operations' ? (
          <>
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-2.5 py-1 rounded whitespace-nowrap ${
                activeTab === 'overview' ? 'bg-[#B7F500] text-[#0D2240] font-bold' : 'text-slate-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('schedule-lookup')}
              className={`px-2.5 py-1 rounded whitespace-nowrap ${
                activeTab === 'schedule-lookup' ? 'bg-[#B7F500] text-[#0D2240] font-bold' : 'text-slate-300'
              }`}
            >
              Lookup
            </button>
            <button
              onClick={() => setActiveTab('carrier-comparison')}
              className={`px-2.5 py-1 rounded whitespace-nowrap ${
                activeTab === 'carrier-comparison' ? 'bg-[#B7F500] text-[#0D2240] font-bold' : 'text-slate-300'
              }`}
            >
              Carriers
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('my-shipment')}
              className={`px-2.5 py-1 rounded whitespace-nowrap ${
                activeTab === 'my-shipment' ? 'bg-[#B7F500] text-[#0D2240] font-bold' : 'text-slate-300'
              }`}
            >
              My Shipment
            </button>
            {customerShipment && (
              <button
                onClick={() => setActiveTab('my-milestones')}
                className={`px-2.5 py-1 rounded whitespace-nowrap ${
                  activeTab === 'my-milestones' ? 'bg-[#B7F500] text-[#0D2240] font-bold' : 'text-slate-300'
                }`}
              >
                Milestones
              </button>
            )}
          </>
        )}
        <button
          onClick={onOpenAgent}
          className="flex items-center gap-1 px-2.5 py-1 rounded text-[#B7F500] font-semibold whitespace-nowrap"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Agent</span>
        </button>
        <button
          onClick={onLogout}
          className="flex items-center gap-1 px-2 py-1 rounded text-rose-300 font-semibold whitespace-nowrap bg-rose-950/40 border border-rose-800/50"
        >
          <LogOut className="w-3 h-3" />
          <span>Exit</span>
        </button>
      </div>
    </header>
  );
};
