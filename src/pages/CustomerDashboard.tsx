import React, { useState, useEffect } from 'react';
import {
  Ship,
  AlertTriangle,
  Clock,
  ArrowRight,
  Building2,
  Calendar,
  ShieldCheck,
  Anchor,
  Box,
  MapPin,
  Bot,
  Copy,
  Check,
  UserCheck,
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { localDb } from '../services/storage';
import type { Shipment, ShipmentEvent, Schedule } from '../types';

interface CustomerDashboardProps {
  onSelectShipment: (shipmentId: string) => void;
  onNavigateToTab: (tab: any) => void;
  onOpenAgent: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onSelectShipment,
  onNavigateToTab,
  onOpenAgent,
}) => {
  const { user } = useAuth();
  const [assignedShipment, setAssignedShipment] = useState<Shipment | null>(null);
  const [milestones, setMilestones] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    try {
      // STRICT ONE SHIPMENT PER CUSTOMER: Fetch the strictly assigned shipment
      const shipment = localDb.getCustomerAssignedShipment(user.id);
      setAssignedShipment(shipment);
      if (shipment) {
        const details = localDb.getShipmentById(shipment.id, user);
        if (details) {
          setMilestones(details.schedules || []);
        }
      } else {
        setMilestones([]);
      }
    } catch (e) {
      console.error('Failed to load customer shipment record:', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleCopyBooking = (bookingId: string) => {
    navigator.clipboard.writeText(bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDelayed = assignedShipment && (assignedShipment.status === 'Delayed' || assignedShipment.delay_days > 0);

  return (
    <div className="space-y-6 relative">
      {/* Background radial glow */}
      <div className="absolute -top-10 left-1/3 w-96 h-96 bg-[#B7F500]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Banner */}
      <div className="bg-[#0D2240] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#081426] border border-slate-700/80 text-xs font-semibold text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-[#B7F500]" />
              <span className="font-bold text-white">{user?.company || 'Commercial Consignee'}</span>
              <span className="text-slate-500">•</span>
              <span className="text-[#B7F500] font-mono text-[11px]">Consignee ID: {user?.id}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome, {user?.name}
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Consignment management portal for <strong className="text-white">{user?.company}</strong>. Verified ocean milestones, real-time vessel telemetry, and authenticated arrival schedules.
            </p>
          </div>

          {/* Quick Support / Agent button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAgent}
              className="px-4 py-2.5 rounded-xl bg-[#081426] hover:bg-[#122440] border border-[#B7F500]/50 text-xs font-bold text-[#B7F500] flex items-center gap-2 transition shadow-md shadow-[#B7F500]/5"
            >
              <Bot className="w-4 h-4 text-[#B7F500]" />
              <span>Ask Compass Agent</span>
            </button>
          </div>
        </div>
      </div>

      {/* Consistent Summary Cards (Strictly 1 Shipment) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="My Assigned Shipment"
          value={loading ? '...' : assignedShipment ? '1 Consignment' : '0 Assigned'}
          icon={<Ship className="w-5 h-5" />}
          subtitle={assignedShipment ? `Booking ${assignedShipment.booking_id}` : 'No active booking'}
          variant="default"
        />
        <MetricCard
          label="Current Status"
          value={loading ? '...' : assignedShipment ? assignedShipment.status : 'None'}
          icon={<Clock className="w-5 h-5" />}
          subtitle={assignedShipment ? `${assignedShipment.progress}% journey completed` : 'Awaiting assignment'}
          variant={assignedShipment?.status === 'Delivered' ? 'success' : assignedShipment?.status === 'Delayed' ? 'warning' : 'neon'}
        />
        <MetricCard
          label="Ocean Corridor"
          value={loading ? '...' : assignedShipment ? `${assignedShipment.origin_code} → ${assignedShipment.destination_code}` : 'N/A'}
          icon={<Anchor className="w-5 h-5" />}
          subtitle={assignedShipment ? `${assignedShipment.origin.split(' ')[0]} to ${assignedShipment.destination.split(' ')[0]}` : 'No active route'}
          variant="default"
        />
        <MetricCard
          label="Arrival Schedule"
          value={
            loading
              ? '...'
              : assignedShipment
              ? new Date(assignedShipment.revised_estimated_arrival_date || assignedShipment.estimated_arrival_date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })
              : 'N/A'
          }
          icon={<Calendar className="w-5 h-5" />}
          subtitle={
            assignedShipment?.delay_days && assignedShipment.delay_days > 0
              ? `Revised (+${assignedShipment.delay_days}d delayed)`
              : 'On-schedule delivery'
          }
          variant={isDelayed ? 'warning' : 'success'}
        />
      </div>

      {/* Scenario A: Customer has NO shipment assigned */}
      {!loading && !assignedShipment && (
        <div className="bg-[#0D2240] border border-slate-800 rounded-2xl p-8 md:p-12 text-center shadow-2xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-extrabold text-white">No Shipment Currently Assigned</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your customer account for <strong className="text-white">{user?.company}</strong> is registered, but does not currently have an active ocean freight booking assigned in the system.
            </p>
            <p className="text-xs text-slate-400">
              Compass Voyage assigns exactly one verified container consignment per commercial client. Please contact your dedicated Operations specialist to allocate your booking:
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#081426] border border-slate-800 max-w-sm mx-auto text-left text-xs space-y-2 text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Operations Desk:</span>
              <span className="font-semibold text-white">Compass Fleet Control</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Email:</span>
              <span className="font-mono text-[#B7F500]">ops@compassvoyage.com</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Phone Support:</span>
              <span className="text-slate-200">+1 (415) 555-0100</span>
            </div>
          </div>
        </div>
      )}

      {/* Scenario B: Customer has their single assigned shipment */}
      {!loading && assignedShipment && (
        <div className="space-y-6">
          {/* Delay Advisory Alert Banner if Delayed */}
          {isDelayed && (
            <div className="p-5 rounded-2xl bg-rose-950/60 border border-rose-500/40 shadow-xl backdrop-blur-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-rose-900/60 text-rose-300 border border-rose-500/40 shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-white text-sm">
                        Schedule Delay Notice: +{assignedShipment.delay_days} Days
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-rose-900/80 text-rose-200 border border-rose-500/30 uppercase">
                        Adjusted ETA
                      </span>
                    </div>
                    <p className="text-xs text-rose-200 mt-1 leading-relaxed">
                      {assignedShipment.delay_reason || 'Vessel operations delayed due to terminal congestion and weather advisory.'}
                    </p>
                    <div className="text-[11px] text-slate-300 mt-1.5 flex items-center gap-4 flex-wrap">
                      <span>Original ETA: <strong className="text-white">{new Date(assignedShipment.estimated_arrival_date).toLocaleDateString()}</strong></span>
                      <span>Revised Port Berth: <strong className="text-amber-300">{new Date(assignedShipment.revised_estimated_arrival_date!).toLocaleDateString()}</strong></span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onSelectShipment(assignedShipment.id)}
                  className="px-4 py-2 rounded-xl bg-rose-900/40 hover:bg-rose-900/70 border border-rose-500/40 text-xs font-bold text-rose-200 transition shrink-0"
                >
                  Review Impacted Milestones
                </button>
              </div>
            </div>
          )}

          {/* Main Dedicated Consignment Card */}
          <div className="bg-[#0D2240] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-5 md:p-6 bg-[#081426] border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#B7F500]/15 text-[#B7F500] border border-[#B7F500]/30 shadow-md">
                  <Ship className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-black text-white tracking-wide">
                      {assignedShipment.booking_id}
                    </span>
                    <button
                      onClick={() => handleCopyBooking(assignedShipment.booking_id)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
                      title="Copy booking ID"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-[#B7F500]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <StatusBadge status={assignedShipment.status} delayDays={assignedShipment.delay_days} size="md" />
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-200">{assignedShipment.carrier}</span>
                    <span className="text-slate-600">•</span>
                    <span className="italic text-slate-300">Vessel: {assignedShipment.vessel}</span>
                    <span className="text-slate-600">•</span>
                    <span className="font-mono text-slate-400">Voyage: {assignedShipment.voyage_number}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => onSelectShipment(assignedShipment.id)}
                  className="px-5 py-2.5 rounded-xl bg-[#B7F500] hover:bg-[#a3dc00] text-[#0D2240] font-extrabold text-xs transition flex items-center gap-2 shadow-lg shadow-[#B7F500]/10"
                >
                  <span>View Complete Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Ocean Corridor & Live Progress */}
            <div className="p-6 md:p-8 space-y-6">
              {/* Route corridor visualization */}
              <div className="bg-[#081426] border border-slate-800/80 rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  {/* Origin Port (POL) */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#B7F500] flex items-center gap-1.5">
                      <Anchor className="w-3.5 h-3.5" /> Port of Loading (POL)
                    </div>
                    <div className="text-lg font-black text-white">{assignedShipment.origin_code}</div>
                    <div className="text-xs font-semibold text-slate-200">{assignedShipment.origin}</div>
                    <div className="text-[11px] text-slate-400 pt-1">
                      Departed (ETD): <strong className="text-white">{new Date(assignedShipment.estimated_departure_date).toLocaleDateString()}</strong>
                    </div>
                  </div>

                  {/* Ocean Transit Progress Graphic */}
                  <div className="space-y-2 text-center px-4">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Ocean Transit</span>
                      <span className="text-[#B7F500] font-bold">{assignedShipment.progress}% Completed</span>
                    </div>
                    <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 relative">
                      <div
                        className="h-full bg-gradient-to-r from-[#12315E] via-[#B7F500] to-[#B7F500] rounded-full transition-all duration-700"
                        style={{ width: `${assignedShipment.progress}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                      <Ship className="w-3.5 h-3.5 text-[#B7F500] animate-pulse" />
                      <span>{assignedShipment.status} aboard {assignedShipment.vessel}</span>
                    </div>
                  </div>

                  {/* Destination Port (POD) */}
                  <div className="space-y-1 md:text-right">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center md:justify-end gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> Port of Discharge (POD)
                    </div>
                    <div className="text-lg font-black text-white">{assignedShipment.destination_code}</div>
                    <div className="text-xs font-semibold text-slate-200">{assignedShipment.destination}</div>
                    <div className="text-[11px] text-slate-400 pt-1">
                      Arrival (ETA): <strong className={isDelayed ? 'text-amber-300 font-bold' : 'text-white font-bold'}>
                        {new Date(assignedShipment.revised_estimated_arrival_date || assignedShipment.estimated_arrival_date).toLocaleDateString()}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cargo & Equipment Specs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#081426] border border-slate-800/80 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Box className="w-3.5 h-3.5 text-[#B7F500]" /> Container Equipment
                  </div>
                  <div className="text-sm font-bold text-white">
                    {assignedShipment.container_count}x {assignedShipment.container_type}
                  </div>
                  <div className="text-[11px] text-slate-400">Standard ISO Freight Allocations</div>
                </div>

                <div className="p-4 rounded-xl bg-[#081426] border border-slate-800/80 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Ship className="w-3.5 h-3.5 text-[#B7F500]" /> Cargo Description
                  </div>
                  <div className="text-xs font-semibold text-slate-200 line-clamp-2">
                    {assignedShipment.cargo_description}
                  </div>
                  <div className="text-[11px] text-slate-400">Customs Declared Commodity</div>
                </div>

                <div className="p-4 rounded-xl bg-[#081426] border border-slate-800/80 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#B7F500]" /> Assigned Operations Lead
                  </div>
                  <div className="text-sm font-bold text-white">
                    {assignedShipment.assigned_ops_name || 'Marcus Vance'}
                  </div>
                  <div className="text-[11px] text-[#B7F500]">Compass Logistics International</div>
                </div>
              </div>

              {/* Verified Milestone Timeline right on Customer Dashboard */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#B7F500]" />
                    <span>Voyage Schedule Milestones</span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {milestones.filter((m) => m.status === 'Completed').length} of {milestones.length} Milestones Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {milestones.map((m) => {
                    const isCompleted = m.status === 'Completed';
                    const isCurrent = m.status === 'In Progress';
                    const isDelay = m.status === 'Delayed';
                    return (
                      <div
                        key={m.id}
                        className={`p-3.5 rounded-xl border transition ${
                          isCompleted
                            ? 'bg-[#081426] border-emerald-500/30 text-slate-200'
                            : isDelay
                            ? 'bg-rose-950/30 border-rose-500/40 text-slate-200'
                            : isCurrent
                            ? 'bg-[#081426] border-[#B7F500]/40 text-white shadow-md shadow-[#B7F500]/5'
                            : 'bg-[#081426]/50 border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              isCompleted
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                : isDelay
                                ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                                : isCurrent
                                ? 'bg-[#B7F500]/20 text-[#B7F500] border border-[#B7F500]/40'
                                : 'bg-slate-900 text-slate-500 border border-slate-800'
                            }`}
                          >
                            {m.status}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(m.revised_date || m.actual_date || m.planned_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="font-bold text-xs text-white leading-snug">{m.milestone}</div>
                        <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                          {m.notes || `Carrier milestone: ${assignedShipment.carrier}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-400">
                  Operational Notes: <span className="text-slate-200">{assignedShipment.operational_notes || 'All export documents and seals validated.'}</span>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={onOpenAgent}
                    className="px-4 py-2 rounded-xl bg-[#081426] hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition w-full sm:w-auto justify-center"
                  >
                    <Bot className="w-3.5 h-3.5 text-[#B7F500]" />
                    <span>Inquire with Agent</span>
                  </button>
                  <button
                    onClick={() => onSelectShipment(assignedShipment.id)}
                    className="px-5 py-2 rounded-xl bg-[#B7F500] hover:bg-[#a3dc00] text-[#0D2240] font-extrabold text-xs transition flex items-center gap-1.5 w-full sm:w-auto justify-center shadow-md shadow-[#B7F500]/10"
                  >
                    <span>Full Journey Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
