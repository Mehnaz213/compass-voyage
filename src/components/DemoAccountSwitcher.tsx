import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ChevronDown, Check, RotateCcw } from 'lucide-react';

export const DemoAccountSwitcher: React.FC = () => {
  const { user, switchDemoUser, resetDemoData } = useAuth();
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const demoAccounts = [
    {
      email: 'admin@compassvoyage.com',
      name: 'Elena Rostova',
      role: 'Operations',
      badge: 'Admin',
      company: 'Compass Global Logistics International',
    },
    {
      email: 'ops@compassvoyage.com',
      name: 'Marcus Vance',
      role: 'Operations',
      badge: 'Lead',
      company: 'Compass Global Logistics International',
    },
    {
      email: 'jordan@northstarhome.com',
      name: 'Jordan Miller',
      role: 'Customer',
      badge: 'Customer 1 (On Schedule)',
      company: 'NorthStar Home Living Ltd.',
    },
    {
      email: 'tariq@apextechnologies.io',
      name: 'Tariq Hassan',
      role: 'Customer',
      badge: 'Customer 2 (Delayed)',
      company: 'Apex Electronics & Semiconductors',
    },
    {
      email: 'ml.zhou@pacificrimimports.com',
      name: 'Mei-Ling Zhou',
      role: 'Customer',
      badge: 'Customer 3 (Arriving Soon)',
      company: 'Pacific Rim Specialty Imports',
    },
  ];

  const handleSwitch = async (email: string) => {
    setSwitching(true);
    await switchDemoUser(email);
    setSwitching(false);
    setOpen(false);
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo data back to original seeded state?')) {
      resetDemoData();
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#081426] border border-amber-500/40 hover:border-amber-400 text-xs text-amber-300 font-medium transition shadow-sm"
        title="Development Sandbox Role Switcher"
      >
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
        <span className="hidden sm:inline">Role Switcher:</span>
        <span className="font-bold text-white truncate max-w-[130px]">{user?.name}</span>
        <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-amber-500/20 text-amber-300 uppercase">
          {user?.role}
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-84 bg-[#0D2240] border border-slate-700 rounded-2xl shadow-2xl p-2.5 z-50 text-slate-100 backdrop-blur-md">
            <div className="px-3 py-2 border-b border-slate-800">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" /> Demo Account Selector
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                One Operations Admin & 3 Customer Demo Accounts (1 assigned shipment each).
              </p>
            </div>

            <div className="mt-1 space-y-1">
              {demoAccounts.map((acc) => {
                const isCurrent = user?.email.toLowerCase() === acc.email.toLowerCase();
                return (
                  <button
                    key={acc.email}
                    disabled={switching || isCurrent}
                    onClick={() => handleSwitch(acc.email)}
                    className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between ${
                      isCurrent
                        ? 'bg-[#B7F500]/15 border border-[#B7F500]/40 text-white'
                        : 'hover:bg-[#081426] text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{acc.name}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                            acc.role === 'Operations'
                              ? 'bg-blue-900/60 text-blue-300 border border-blue-600/30'
                              : 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {acc.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#B7F500] font-semibold mt-0.5 truncate">{acc.company}</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">{acc.email}</div>
                    </div>
                    {isCurrent && <Check className="w-4 h-4 text-[#B7F500] shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 mt-2 border-t border-slate-800 flex justify-between items-center px-1">
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 font-medium transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Demo Records</span>
              </button>
              <span className="text-[10px] text-slate-500 font-mono">v2.4 Demo</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
