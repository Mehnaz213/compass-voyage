import React from 'react';

interface MetricCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  subtitle?: string;
  variant?: 'default' | 'neon' | 'warning' | 'success';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon,
  subtitle,
  variant = 'default',
}) => {
  let borderClass = 'border-slate-800 bg-[#0B1526]';
  let valueColor = 'text-white';
  let iconBg = 'bg-slate-800/80 text-slate-300';

  if (variant === 'neon') {
    borderClass = 'border-[#B7F500]/30 bg-gradient-to-br from-[#0D2240] to-[#081426] shadow-lg shadow-[#B7F500]/5';
    valueColor = 'text-[#B7F500]';
    iconBg = 'bg-[#B7F500]/15 text-[#B7F500] border border-[#B7F500]/30';
  } else if (variant === 'warning') {
    borderClass = 'border-rose-500/30 bg-[#1A0D15]';
    valueColor = 'text-rose-400';
    iconBg = 'bg-rose-500/15 text-rose-400 border border-rose-500/30';
  } else if (variant === 'success') {
    borderClass = 'border-emerald-500/30 bg-[#0D1A16]';
    valueColor = 'text-emerald-400';
    iconBg = 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
  }

  return (
    <div className={`p-5 rounded-xl border ${borderClass} transition-all duration-200 hover:translate-y-[-2px]`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">{label}</span>
        <div className={`p-2.5 rounded-lg ${iconBg}`}>{icon}</div>
      </div>
      <div className={`text-3xl font-extrabold tracking-tight ${valueColor}`}>{value}</div>
      {subtitle && <p className="mt-1 text-xs text-slate-400 font-medium">{subtitle}</p>}
    </div>
  );
};
