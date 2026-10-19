import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, Ship, CalendarCheck } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  delayDays?: number;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, delayDays = 0, size = 'md' }) => {
  const isSmall = size === 'sm';
  const padding = isSmall ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  if (status === 'Delivered') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 ${padding}`}>
        <CheckCircle2 className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        Delivered
      </span>
    );
  }

  if (status === 'Delayed' || delayDays > 0) {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-rose-950/70 text-rose-300 border border-rose-500/40 ${padding}`}>
        <AlertTriangle className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        <span>Delayed {delayDays > 0 ? `(+${delayDays}d)` : ''}</span>
      </span>
    );
  }

  if (status === 'Arriving Soon') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/40 ${padding}`}>
        <Clock className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        Arriving Soon
      </span>
    );
  }

  if (status === 'In Transit') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-[#0D2240] text-[#B7F500] border border-[#B7F500]/40 ${padding}`}>
        <Ship className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        In Transit
      </span>
    );
  }

  // Booking Confirmed / Default
  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700 ${padding}`}>
      <CalendarCheck className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {status || 'Confirmed'}
    </span>
  );
};
