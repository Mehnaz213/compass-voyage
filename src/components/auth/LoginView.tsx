import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { CompassLogo } from '../common/CompassLogo';
import { ShieldCheck, ArrowRight, UserCheck, Lock, Anchor } from 'lucide-react';
import { User } from '../../types/logistics';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { users, customers, setCurrentUser } = useLogistics();
  const [selectedRoleTab, setSelectedRoleTab] = useState<'operations' | 'customer'>('operations');
  const [selectedUser, setSelectedUser] = useState<User>(() => {
    return users.find(u => u.role === 'operations') || users[0];
  });
  const [customEmail, setCustomEmail] = useState('');
  const [customPassword, setCustomPassword] = useState('••••••••••••');

  const operationsUsers = users.filter(u => u.role === 'operations');
  const customerUsers = users.filter(u => u.role === 'customer');

  const handleQuickSelect = (u: User) => {
    setSelectedUser(u);
    setCustomEmail(u.email);
  };

  const handleRoleTabChange = (role: 'operations' | 'customer') => {
    setSelectedRoleTab(role);
    const firstForRole = users.find(u => u.role === role);
    if (firstForRole) {
      setSelectedUser(firstForRole);
      setCustomEmail(firstForRole.email);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser(selectedUser);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-[#0D2240] flex flex-col justify-between text-slate-100 antialiased selection:bg-[#B7F500] selection:text-[#0D2240]">
      {/* Background ambient pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#163663_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      {/* Top micro bar */}
      <header className="relative z-10 w-full border-b border-slate-800/80 bg-[#0D2240]/80 backdrop-blur-md px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CompassLogo size="sm" showCardBorder={true} />
          <div>
            <p className="text-sm font-extrabold text-white tracking-tight">Compass Voyage</p>
            <p className="text-[10px] text-slate-300">Compass Logistics International</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-[#B7F500]"></span>
          <span>Global Fleet & Schedule Portal</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-5xl w-full mx-auto px-4 py-8 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Brand Context & Presentation Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-slate-700/60 text-xs text-slate-300">
              <Anchor className="w-3.5 h-3.5 text-[#B7F500]" />
              <span>Ocean Freight Visibility Platform</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white text-balance leading-tight">
                Real-Time Voyage Visibility & Schedules
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Log in to Compass Voyage to monitor end-to-end container journeys, search verified schedules across global carrier strings, and evaluate operational transit performance.
              </p>
            </div>

            {/* POC Transparency Callout */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-2 text-slate-300">
              <div className="flex items-center gap-2 text-[#B7F500] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>POC Demonstration Environment</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                This demonstration initializes realistic synthetic container logistics datasets (ports, carrier strings, real-time milestones, and transparent carrier comparisons). Select any profile below to preview authorization controls.
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Customer Rule:</span>
                <span className="font-semibold text-white">Strictly 1:1 Shipment Isolation</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Login Box & Role Switcher */}
          <div className="lg:col-span-7">
            <div className="bg-[#0D2240] rounded-2xl border border-slate-700/80 shadow-2xl p-6 sm:p-8 space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Portal Access</h2>
                  <p className="text-xs text-slate-400">Select an operational or client account</p>
                </div>
                <CompassLogo size="sm" />
              </div>

              {/* Role Selection Tabs */}
              <div className="grid grid-cols-2 p-1 bg-slate-900/90 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => handleRoleTabChange('operations')}
                  className={`py-2 px-3 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${
                    selectedRoleTab === 'operations'
                      ? 'bg-[#B7F500] text-[#0D2240] shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Operations Team (3)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleTabChange('customer')}
                  className={`py-2 px-3 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${
                    selectedRoleTab === 'customer'
                      ? 'bg-[#B7F500] text-[#0D2240] shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Customers (12 demo)</span>
                </button>
              </div>

              {/* Profile Picker List */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                  <span>{selectedRoleTab === 'operations' ? 'Select Operations Specialist:' : 'Select Customer Account (1:1 isolated shipment):'}</span>
                  <span className="text-[10px] text-slate-400">Click to switch</span>
                </label>

                <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
                  {(selectedRoleTab === 'operations' ? operationsUsers : customerUsers).map(u => {
                    const isSelected = selectedUser.id === u.id;
                    const cust = customers.find(c => c.id === u.customerId);

                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleQuickSelect(u)}
                        className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-slate-800/90 border-[#B7F500] text-white shadow-sm ring-1 ring-[#B7F500]/50'
                            : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <p className="font-semibold text-white flex items-center gap-2">
                            {cust ? cust.companyName : u.name}
                            {isSelected && (
                              <span className="text-[10px] px-1.5 py-0.2 bg-[#B7F500] text-[#0D2240] font-bold rounded">
                                Selected
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {u.name} · {u.jobTitle || cust?.industry}
                          </p>
                        </div>
                        <div className="text-right text-[10px] text-slate-400">
                          {selectedRoleTab === 'customer' ? (
                            <span className="font-mono text-[#B7F500] font-medium">Booking CV-9000{String(Number(u.customerId?.replace('cust_', ''))).padStart(2, '0')}</span>
                          ) : (
                            <span className="text-slate-400">Full Operational Scope</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Login Action Form */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-800">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Authorized Email</label>
                  <input
                    type="email"
                    value={selectedUser.email || customEmail}
                    readOnly
                    className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-medium text-slate-300">Security Credential</label>
                    <span className="text-[10px] text-[#B7F500]">Pre-authorized session</span>
                  </div>
                  <input
                    type="password"
                    value={customPassword}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-[#B7F500] hover:bg-[#a5de00] text-[#0D2240] font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Launch Compass Voyage as {selectedRoleTab === 'operations' ? 'Operations' : 'Customer'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </form>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-300">
        <p>© 2026 Compass Logistics International. All rights reserved. Compass Voyage Visibility System.</p>
      </footer>
    </div>
  );
};
