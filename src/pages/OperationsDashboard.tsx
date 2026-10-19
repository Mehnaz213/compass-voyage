import React, { useState, useEffect } from 'react';
import {
  Ship,
  AlertTriangle,
  CheckCircle2,
  Clock,
  CalendarCheck,
  Users,
  Anchor,
  ArrowRight,
  PlusCircle,
  Search,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { localDb } from '../services/storage';
import type { StatsData } from '../types';

interface OperationsDashboardProps {
  onSelectShipment: (shipmentId: string) => void;
  onNavigateToTab: (tab: any) => void;
  onOpenCreateBooking: () => void;
  onOpenCreateCustomer: () => void;
}

export const OperationsDashboard: React.FC<OperationsDashboardProps> = ({
  onSelectShipment,
  onNavigateToTab,
  onOpenCreateBooking,
  onOpenCreateCustomer,
}) => {
  const { user } = useAuth();
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = () => {
    if (!user) return;
    setLoading(true);
    try {
      const statsData = localDb.getStats(user);
      setData(statsData);
    } catch (e) {
      console.error('Failed to load operations dashboard statistics:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [user]);

  const stats = data?.stats;

  return (
    <div className="space-y-6 relative">
      {/* Background radial glow */}
      <div className="absolute -top-10 left-1/4 w-96 h-96 bg-[#B7F500]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>Operations Command Center</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#B7F500]/15 text-[#B7F500] border border-[#B7F500]/30">
              Live Fleet Metrics
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global shipment visibility, schedule milestones, carrier tracking, and fleet exception management.
          </p>
        </div>

        {/* Quick Action buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => onNavigateToTab('schedules')}
            className="px-3.5 py-2 rounded-xl bg-[#081426] hover:bg-[#122440] border border-[#B7F500]/40 text-xs font-bold text-[#B7F500] flex items-center gap-2 transition shadow-sm"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Schedule Lookup</span>
          </button>
          <button
            onClick={onOpenCreateCustomer}
            className="px-3.5 py-2 rounded-xl bg-[#081426] hover:bg-[#122440] border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition"
          >
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>New Customer</span>
          </button>
          <button
            onClick={onOpenCreateBooking}
            className="px-4 py-2 rounded-xl bg-[#B7F500] hover:bg-[#a3dc00] text-[#0D2240] text-xs font-extrabold flex items-center gap-1.5 transition shadow-lg shadow-[#B7F500]/10"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Booking</span>
          </button>
        </div>
      </div>

      {/* Live Computed Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Total Shipments"
          value={loading ? '...' : stats?.total_shipments || 0}
          icon={<Ship className="w-5 h-5" />}
          subtitle="All recorded bookings"
          variant="default"
        />
        <MetricCard
          label="In Transit"
          value={loading ? '...' : stats?.in_transit || 0}
          icon={<Anchor className="w-5 h-5" />}
          subtitle="Actively navigating ocean routes"
          variant="neon"
        />
        <MetricCard
          label="Delayed Shipments"
          value={loading ? '...' : stats?.delayed || 0}
          icon={<AlertTriangle className="w-5 h-5" />}
          subtitle="Exceptions requiring attention"
          variant="warning"
        />
        <MetricCard
          label="Delivered"
          value={loading ? '...' : stats?.delivered || 0}
          icon={<CheckCircle2 className="w-5 h-5" />}
          subtitle="Completed consignee receipts"
          variant="success"
        />
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#0D2240] border border-slate-800 flex items-center justify-between shadow-md">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Awaiting Confirmation</div>
            <div className="text-2xl font-bold text-white mt-1">{loading ? '...' : stats?.awaiting_confirmation || 0}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Bookings pending equipment gate-in</div>
          </div>
          <div className="p-2.5 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-500/20">
            <CalendarCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D2240] border border-slate-800 flex items-center justify-between shadow-md">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Arriving Soon</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{loading ? '...' : stats?.arriving_soon || 0}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Dest. harbor pilotage approaching</div>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-950 text-amber-400 border border-amber-500/20">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D2240] border border-slate-800 flex items-center justify-between col-span-2 md:col-span-1 shadow-md">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Customers</div>
            <div className="text-2xl font-bold text-[#B7F500] mt-1">{loading ? '...' : stats?.total_customers || 0}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Commercial consignee accounts</div>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/20">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Operations Feature Spotlight: Transportation Schedule Lookup */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0D2240] via-[#0A1A30] to-[#081426] border border-[#B7F500]/30 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#B7F500] text-[#0D2240] uppercase">
                Operations Feature
              </span>
              <h2 className="text-base font-extrabold text-white">
                Transportation Schedule Lookup & Carrier Comparison
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Identify any active shipment via 4 cascading dropdowns: <strong>Port of Loading (POL)</strong>, <strong>Port of Discharge (POD)</strong>, <strong>Carrier Company</strong>, and <strong>Booking Number</strong>. Includes automated carrier performance comparison and recommendation engine.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateToTab('schedules')}
              className="px-5 py-2.5 rounded-xl bg-[#B7F500] hover:bg-[#a3dc00] text-[#0D2240] font-extrabold text-xs transition flex items-center gap-2 shadow-lg shadow-[#B7F500]/10"
            >
              <Search className="w-4 h-4" />
              <span>Launch 4-Dropdown Lookup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Delayed Shipments & Approaching Arrivals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delayed Shipments Requiring Attention */}
        <div className="bg-[#0D2240] border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl">
          <div className="p-4 border-b border-slate-800 bg-[#081426] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-950/80 text-rose-400 border border-rose-500/30">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm">Delayed Shipments Requiring Attention</h3>
            </div>
            <button
              onClick={() => onNavigateToTab('shipments')}
              className="text-xs text-[#B7F500] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 flex-1 divide-y divide-slate-800/80 space-y-3">
            {loading ? (
              <div className="p-6 text-center text-slate-400 text-xs">Loading delayed shipments...</div>
            ) : !data?.delayed_shipments || data.delayed_shipments.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">No delayed shipments currently flagged.</div>
            ) : (
              data.delayed_shipments.map((s: any) => (
                <div
                  key={s.id}
                  onClick={() => onSelectShipment(s.id)}
                  className="pt-3 first:pt-0 cursor-pointer group flex items-start justify-between hover:bg-slate-800/30 p-2.5 rounded-xl transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-sm group-hover:text-[#B7F500] transition">
                        {s.booking_id}
                      </span>
                      <StatusBadge status={s.status} delayDays={s.delay_days} size="sm" />
                    </div>
                    <div className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                      <span className="font-semibold text-slate-200">{s.customer_company}</span>
                      <span className="text-slate-600">•</span>
                      <span>{s.origin_code} → {s.destination_code}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400 italic">{s.carrier}</span>
                    </div>
                    {s.delay_reason && (
                      <div className="text-xs text-rose-300 mt-1 font-medium bg-rose-950/40 px-2 py-1 rounded border border-rose-500/20">
                        Reason: {s.delay_reason}
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[11px] text-slate-400">Revised ETA</div>
                    <div className="text-xs font-semibold text-amber-300">
                      {new Date(s.revised_estimated_arrival_date || s.estimated_arrival_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Approaching Arrivals */}
        <div className="bg-[#0D2240] border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl">
          <div className="p-4 border-b border-slate-800 bg-[#081426] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-950/80 text-amber-400 border border-amber-500/30">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm">Upcoming Arrivals</h3>
            </div>
            <button
              onClick={() => onNavigateToTab('shipments')}
              className="text-xs text-[#B7F500] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 flex-1 divide-y divide-slate-800/80 space-y-3">
            {loading ? (
              <div className="p-6 text-center text-slate-400 text-xs">Loading approaching arrivals...</div>
            ) : !data?.upcoming_arrivals || data.upcoming_arrivals.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">No imminent vessel arrivals scheduled.</div>
            ) : (
              data.upcoming_arrivals.map((s: any) => (
                <div
                  key={s.id}
                  onClick={() => onSelectShipment(s.id)}
                  className="pt-3 first:pt-0 cursor-pointer group flex items-start justify-between hover:bg-slate-800/30 p-2.5 rounded-xl transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-sm group-hover:text-[#B7F500] transition">
                        {s.booking_id}
                      </span>
                      <StatusBadge status={s.status} size="sm" />
                    </div>
                    <div className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                      <span className="font-semibold text-slate-200">{s.customer_company}</span>
                      <span className="text-slate-600">•</span>
                      <span>Destination: {s.destination} ({s.destination_code})</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Vessel: <span className="text-slate-300">{s.vessel}</span> ({s.carrier})
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[11px] text-slate-400">Scheduled Port Berth</div>
                    <div className="text-xs font-bold text-white">
                      {new Date(s.revised_estimated_arrival_date || s.estimated_arrival_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Fleet Shipment Events Timeline */}
      <div className="bg-[#0D2240] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 bg-[#081426] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#B7F500]/15 text-[#B7F500] border border-[#B7F500]/30">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">Recent Shipment Journey Milestones</h3>
          </div>
          <span className="text-xs text-slate-400">Live operational event feed</span>
        </div>
        <div className="p-5">
          {loading ? (
            <div className="p-6 text-center text-slate-400 text-xs">Loading operational events...</div>
          ) : !data?.recent_events || data.recent_events.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">No recent events logged.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {data.recent_events.map((ev: any) => (
                <div
                  key={ev.id}
                  onClick={() => onSelectShipment(ev.shipment_id)}
                  className="p-3.5 rounded-xl bg-[#081426] border border-slate-800 hover:border-[#B7F500]/40 cursor-pointer transition group"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono font-bold text-[#B7F500] group-hover:underline">
                      {ev.title}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(ev.event_date).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white leading-snug line-clamp-1">{ev.title}</h4>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">{ev.description}</p>
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                    <span className="truncate">📍 {ev.location}</span>
                    <span className="text-slate-500 font-mono text-[10px]">Confirmed Milestone</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
