import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside aria-label="POC Demonstration Environment Notice" className="bg-[#0D2240] text-slate-200 border-b border-slate-700/60 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#B7F500] shrink-0" />
          <span>
            <strong className="text-white font-semibold">POC Demonstration Environment:</strong> Client-side role simulation and local browser storage are active for evaluation. In production, server-enforced authentication, session tokens, and row-level access control isolate customer records.
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white transition-colors p-1"
          title="Dismiss notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
