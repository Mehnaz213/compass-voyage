import React from 'react';
import { RotateCcw, AlertTriangle, X } from 'lucide-react';

interface ResetDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
}

export const ResetDataModal: React.FC<ResetDataModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-100">
      <div className="bg-[#132B4F] text-slate-100 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-700/80 space-y-4">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-rose-400">
            <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Reset Demo Logistics Data</h3>
              <p className="text-xs text-slate-400">Restore factory demonstration records</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Confirm Reset Action</span>
          </div>
          <p className="leading-relaxed">
            This will reset browser storage back to the initial 20 ports, 15 users, 60 shipments, 250+ journey milestones, and restore all default carrier schedules and notifications.
          </p>
        </div>

        <p className="text-xs text-slate-300">
          Any newly created bookings or status updates added during this demo session will be reset to factory baseline.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-700/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmReset();
              onClose();
            }}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-rose-600 text-white hover:bg-rose-500 shadow-sm transition-colors cursor-pointer"
          >
            Reset All Demo Data
          </button>
        </div>

      </div>
    </div>
  );
};
