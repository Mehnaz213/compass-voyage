import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie, 
  CartesianGrid 
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  Ship, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Filter,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { Shipment, ShipmentStatus } from '../../types/logistics';

interface ShipmentStatusChartCardProps {
  shipments: Shipment[];
  selectedStatusFilter: string;
  onSelectStatusFilter: (status: string) => void;
}

interface StatusDataPoint {
  status: ShipmentStatus;
  label: string;
  shortLabel: string;
  count: number;
  percentage: number;
  containers: number;
  color: string;
  secondaryColor: string;
  icon: React.ReactNode;
}

const STATUS_CONFIG: Record<ShipmentStatus, {
  label: string;
  shortLabel: string;
  color: string;
  secondaryColor: string;
  icon: (className?: string) => React.ReactNode;
}> = {
  BOOKING_CONFIRMED: {
    label: 'Booked / Confirmed',
    shortLabel: 'Booked',
    color: '#818CF8', // Indigo
    secondaryColor: '#4F46E5',
    icon: (cls) => <Calendar className={cls} />
  },
  IN_TRANSIT: {
    label: 'In Transit',
    shortLabel: 'In Transit',
    color: '#38BDF8', // Sky Blue
    secondaryColor: '#0284C7',
    icon: (cls) => <Ship className={cls} />
  },
  ARRIVING_SOON: {
    label: 'Arriving Soon',
    shortLabel: 'Arriving',
    color: '#34D399', // Emerald
    secondaryColor: '#059669',
    icon: (cls) => <Clock className={cls} />
  },
  DELAYED: {
    label: 'Delayed / Exception',
    shortLabel: 'Delayed',
    color: '#F59E0B', // Amber
    secondaryColor: '#D97706',
    icon: (cls) => <AlertTriangle className={cls} />
  },
  DELIVERED: {
    label: 'Delivered (POD)',
    shortLabel: 'Delivered',
    color: '#B7F500', // Compass Neon Green
    secondaryColor: '#84CC16',
    icon: (cls) => <CheckCircle2 className={cls} />
  }
};

export const ShipmentStatusChartCard: React.FC<ShipmentStatusChartCardProps> = ({
  shipments,
  selectedStatusFilter,
  onSelectStatusFilter
}) => {
  const [chartType, setChartType] = useState<'bar' | 'donut'>('bar');
  const [hoveredStatus, setHoveredStatus] = useState<string | null>(null);

  const totalCount = shipments.length;

  const chartData: StatusDataPoint[] = useMemo(() => {
    const statuses: ShipmentStatus[] = [
      'BOOKING_CONFIRMED',
      'IN_TRANSIT',
      'ARRIVING_SOON',
      'DELAYED',
      'DELIVERED'
    ];

    return statuses.map(status => {
      const filtered = shipments.filter(s => s.status === status);
      const count = filtered.length;
      const containers = filtered.reduce((acc, curr) => acc + (curr.containerCount || 0), 0);
      const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
      const config = STATUS_CONFIG[status];

      return {
        status,
        label: config.label,
        shortLabel: config.shortLabel,
        count,
        percentage,
        containers,
        color: config.color,
        secondaryColor: config.secondaryColor,
        icon: config.icon('w-3.5 h-3.5')
      };
    });
  }, [shipments, totalCount]);

  // Operational On-Track health calculation (Non-delayed / Total)
  const delayedItem = chartData.find(d => d.status === 'DELAYED');
  const delayedCount = delayedItem ? delayedItem.count : 0;
  const onTrackPercent = totalCount > 0 ? Math.round(((totalCount - delayedCount) / totalCount) * 100) : 100;

  // Custom Bar Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: StatusDataPoint = payload[0].payload;
      return (
        <div className="bg-[#0A1A30] border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1.5 min-w-[200px]">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
              {data.label}
            </span>
            <span className="font-mono font-bold text-[#B7F500]">{data.percentage}%</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Shipments:</span>
            <span className="font-mono font-bold text-white">{data.count} units</span>
          </div>
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Container Equipment:</span>
            <span className="font-mono text-slate-200">{data.containers} TEU / Boxes</span>
          </div>
          <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-800/80">
            Click to filter catalog below
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#132B4F] rounded-2xl border border-slate-700/70 shadow-lg p-5 sm:p-6 space-y-5">
      {/* Header with Title and Mode Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#B7F500]" />
            <h2 className="text-base font-extrabold text-white">
              Fleet Transit Status Distribution
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0D2240] border border-slate-700 text-[#B7F500] uppercase font-mono">
              Recharts Analytics
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Real-time consignment volumes per transportation status ({totalCount} active shipments tracked)
          </p>
        </div>

        {/* Action Controls & Chart View Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {selectedStatusFilter !== 'ALL' && (
            <button
              onClick={() => onSelectStatusFilter('ALL')}
              className="px-2.5 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-500/50 text-rose-300 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Clear active status filter"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filter ({selectedStatusFilter.replace('_', ' ')})</span>
            </button>
          )}

          <div className="inline-flex rounded-lg bg-[#0D2240] p-1 border border-slate-700 text-xs">
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                chartType === 'bar'
                  ? 'bg-[#B7F500] text-[#0D2240] shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Bar Chart visualization"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Bar</span>
            </button>
            <button
              onClick={() => setChartType('donut')}
              className={`px-3 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                chartType === 'donut'
                  ? 'bg-[#B7F500] text-[#0D2240] shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Donut Chart distribution"
            >
              <PieIcon className="w-3.5 h-3.5" />
              <span>Donut</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Analytics Content: Chart + Right Summary Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Side: Chart Visualization */}
        <div className="lg:col-span-8 h-[260px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart
                data={chartData}
                margin={{ top: 15, right: 15, left: -10, bottom: 5 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload.length) {
                    const status = e.activePayload[0].payload.status;
                    onSelectStatusFilter(selectedStatusFilter === status ? 'ALL' : status);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1E3A63" vertical={false} />
                <XAxis 
                  dataKey="shortLabel" 
                  stroke="#94A3B8" 
                  tick={{ fill: '#CBD5E1', fontSize: 11 }}
                  axisLine={{ stroke: '#334155' }}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#94A3B8" 
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  axisLine={{ stroke: '#334155' }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                <Bar 
                  dataKey="count" 
                  radius={[6, 6, 0, 0]}
                  cursor="pointer"
                  animationDuration={800}
                >
                  {chartData.map((entry) => {
                    const isSelected = selectedStatusFilter === entry.status;
                    const isMuted = selectedStatusFilter !== 'ALL' && !isSelected;
                    return (
                      <Cell 
                        key={entry.status} 
                        fill={entry.color} 
                        opacity={isMuted ? 0.35 : 1}
                        stroke={isSelected ? '#FFFFFF' : 'none'}
                        strokeWidth={isSelected ? 2 : 0}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            ) : (
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="count"
                  cursor="pointer"
                  animationDuration={800}
                  onClick={(entry: any) => {
                    if (entry && entry.status) {
                      onSelectStatusFilter(selectedStatusFilter === entry.status ? 'ALL' : entry.status);
                    }
                  }}
                  onMouseEnter={(_, index) => setHoveredStatus(chartData[index]?.status || null)}
                  onMouseLeave={() => setHoveredStatus(null)}
                >
                  {chartData.map((entry) => {
                    const isSelected = selectedStatusFilter === entry.status;
                    const isMuted = selectedStatusFilter !== 'ALL' && !isSelected;
                    return (
                      <Cell 
                        key={entry.status} 
                        fill={entry.color} 
                        opacity={isMuted ? 0.35 : 1}
                        stroke={isSelected ? '#FFFFFF' : '#0D2240'}
                        strokeWidth={isSelected ? 3 : 1.5}
                      />
                    );
                  })}
                </Pie>
                {/* Center text in Donut */}
                <text
                  x="50%"
                  y="47%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-white font-extrabold text-2xl font-mono"
                >
                  {totalCount}
                </text>
                <text
                  x="50%"
                  y="59%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-slate-400 font-medium text-[11px] uppercase tracking-wider"
                >
                  Total Units
                </text>
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Right Side: Status Legend & Interactive Filter Buttons */}
        <div className="lg:col-span-4 space-y-3">
          
          {/* Fleet Health Meter Callout */}
          <div className="p-3.5 rounded-xl bg-[#0D2240] border border-slate-700/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-[#B7F500]" />
                Fleet Schedule Health
              </span>
              <p className="text-xs text-slate-300">
                <strong className="text-white font-mono">{onTrackPercent}%</strong> of active fleet operating on-time
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-amber-400">
                {delayedCount} Delayed
              </span>
              <p className="text-[10px] text-slate-400">
                {totalCount - delayedCount} On Track
              </p>
            </div>
          </div>

          {/* Interactive Status List */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block px-1">
              Select status to filter table below:
            </span>
            {chartData.map((item) => {
              const isSelected = selectedStatusFilter === item.status;
              return (
                <button
                  key={item.status}
                  onClick={() => onSelectStatusFilter(isSelected ? 'ALL' : item.status)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#0D2240] border-[#B7F500] ring-1 ring-[#B7F500] shadow-sm'
                      : 'bg-[#0D2240]/60 hover:bg-[#0D2240] border-slate-700/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-3 h-3 rounded-full shrink-0 shadow-xs" 
                      style={{ backgroundColor: item.color }} 
                    />
                    <div>
                      <span className={`text-xs font-semibold block ${isSelected ? 'text-[#B7F500]' : 'text-white'}`}>
                        {item.label}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {item.containers} total containers
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-white block">
                      {item.count}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {item.percentage}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
