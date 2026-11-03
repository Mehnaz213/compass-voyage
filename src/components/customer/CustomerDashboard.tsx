import React from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { 
  Ship, 
  Calendar, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Package, 
  Bell, 
  Bot,
  ShieldCheck
} from 'lucide-react';
import { Shipment, ShipmentStatus } from '../../types/logistics';

interface CustomerDashboardProps {
  onSelectShipmentJourney: (shipment: Shipment) => void;
  onOpenAgent: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onSelectShipmentJourney,
  onOpenAgent
}) => {
  const { 
    currentUser, 
    selectedCustomer, 
    customerShipment, 
    getPortByCode, 
    getCarrierById, 
    getMilestonesForShipment,
    notifications
  } = useLogistics();

  // If customer has no shipment
  if (!customerShipment) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <Ship className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">No Active Shipment Assigned</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Welcome, {currentUser.name}. Your account ({selectedCustomer?.companyName}) does not currently have an active ocean consignment assigned. Please contact Compass Logistics International operations to initiate a booking.
        </p>
      </div>
    );
  }

  const s = customerShipment;
  const pol = getPortByCode(s.polCode);
  const pod = getPortByCode(s.podCode);
  const carrier = getCarrierById(s.carrierId);
  const milestones = getMilestonesForShipment(s.id);
  const customerNotifs = notifications.filter(n => n.customerId === currentUser.customerId);

  // Calculate journey progress percentage
  const confirmedCount = milestones.filter(m => m.isConfirmed).length;
  const progressPercent = Math.min(100, Math.round((confirmedCount / Math.max(milestones.length, 1)) * 100));

  const getStatusBadge = (status: ShipmentStatus) => {
    switch (status) {
      case 'IN_TRANSIT':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800">In Transit</span>;
      case 'DELAYED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">Delayed (+{s.delayDurationDays || 3}d)</span>;
      case 'ARRIVING_SOON':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Arriving Soon</span>;
      case 'BOOKING_CONFIRMED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">Booking Confirmed</span>;
      case 'DELIVERED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800">Delivered</span>;
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-white">My Shipment & Tracking</h1>
            <span className="px-2.5 py-0.5 rounded bg-[#132B4F] border border-slate-700 text-[#B7F500] text-[10px] font-bold uppercase tracking-wider">
              1:1 Dedicated Portal
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Real-time milestone visibility for {selectedCustomer?.companyName} ({currentUser.name})
          </p>
        </div>

        {/* Quick Assistant Ask Button */}
        <button
          onClick={onOpenAgent}
          className="px-3.5 py-2 rounded-lg bg-[#132B4F] hover:bg-[#1A3865] border border-slate-700 text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Bot className="w-4 h-4 text-[#B7F500]" />
          <span>Ask Compass Agent</span>
        </button>
      </div>

      {/* Main Consignment Card */}
      <div className="bg-[#132B4F] rounded-2xl border border-slate-700/70 shadow-xl overflow-hidden">
        
        {/* Top Navy Banner */}
        <div className="bg-[#0A1A30] border-b border-slate-800 text-white p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#B7F500]">Consignment Reference</span>
              <span>·</span>
              <span>Account: {selectedCustomer?.companyName}</span>
            </div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black font-mono tracking-wider text-white">
                {s.bookingNumber}
              </h2>
              {getStatusBadge(s.status)}
            </div>
          </div>

          <div className="text-left md:text-right text-xs text-slate-300 space-y-0.5">
            <p className="font-semibold text-white">{carrier?.name}</p>
            <p className="font-mono text-slate-400">Vessel: {s.vesselName} (Voy: {s.voyageNumber})</p>
          </div>
        </div>

        {/* Schedule Adjustment Notice Banner */}
        {(s.status === 'DELAYED' || s.revisedEta) && (
          <div className="p-4 bg-amber-950/40 border-b border-amber-500/40 text-xs text-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-300">
                Schedule Adjustment Notice: {s.delayDurationDays ? `+${s.delayDurationDays} Days Recorded` : 'Revised Arrival Estimate'}
              </p>
              <div className="text-amber-200/90 mt-1 leading-relaxed space-y-1">
                <p>
                  <strong className="text-white">Delay Reason:</strong> {s.delayReason || 'Operational schedule adjustment / maritime delay'}.
                </p>
                {s.operationalRemarks && (
                  <p className="text-slate-300">
                    <strong className="text-slate-200">Operations Remarks:</strong> {s.operationalRemarks}
                  </p>
                )}
                <p>
                  Your revised estimated arrival at {pod?.name || s.podCode} is now <strong className="text-amber-300">{s.revisedEta || s.estimatedArrival}</strong> (Original contract ETA: <span className="line-through text-slate-400">{s.estimatedArrival}</span>).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Route Visualizer */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="p-6 rounded-xl bg-[#0D2240] border border-slate-700/60 shadow-inner">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              
              {/* Origin */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Port of Loading (POL)</span>
                </span>
                <p className="text-xl font-extrabold text-white">{s.polCode}</p>
                <p className="text-xs font-semibold text-slate-200">{pol?.name}</p>
                <p className="text-[11px] text-slate-400">{pol?.terminal}</p>
                <div className="pt-2 text-[11px] font-mono text-slate-300">
                  Departure: <strong className="text-white">{s.actualDeparture || s.estimatedDeparture}</strong>
                </div>
              </div>

              {/* Transit Pathway */}
              <div className="flex flex-col items-center justify-center text-center px-4">
                <span className="text-[10px] font-mono font-medium text-slate-400">Direct Ocean Passage</span>
                <div className="w-full flex items-center gap-2 my-2">
                  <div className="h-0.5 flex-1 bg-slate-700"></div>
                  <div className="p-2.5 rounded-full bg-[#132B4F] border border-slate-700 text-[#B7F500] shadow-sm">
                    <Ship className="w-5 h-5" />
                  </div>
                  <div className="h-0.5 flex-1 bg-slate-700"></div>
                </div>
                <span className="text-xs font-bold text-white">{s.vesselName}</span>
                <span className="text-[10px] font-mono text-slate-400">Voyage: {s.voyageNumber}</span>
              </div>

              {/* Destination */}
              <div className="space-y-1 text-left md:text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center md:justify-end gap-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Port of Discharge (POD)</span>
                </span>
                <p className="text-xl font-extrabold text-white">{s.podCode}</p>
                <p className="text-xs font-semibold text-slate-200">{pod?.name}</p>
                <p className="text-[11px] text-slate-400">{pod?.terminal}</p>
                <div className="pt-2 text-[11px] font-mono">
                  {s.revisedEta ? (
                    <div>
                      <span className="text-amber-400 font-bold">Revised: {s.revisedEta}</span>
                      <span className="text-[10px] text-slate-400 line-through block">Orig: {s.estimatedArrival}</span>
                    </div>
                  ) : (
                    <span className="text-white font-semibold">Estimated: {s.estimatedArrival}</span>
                  )}
                </div>
              </div>

            </div>

            {/* Overall Progress Bar */}
            <div className="mt-6 pt-5 border-t border-slate-700/60">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                <span className="font-semibold text-slate-200">Journey Progression</span>
                <span className="font-mono font-bold text-[#B7F500]">{progressPercent}% Completed</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#B7F500] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Shipment Characteristics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-700/60 bg-[#0D2240] text-slate-200">
              <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-slate-400" />
                <span>Cargo Description</span>
              </span>
              <p className="text-xs font-bold text-white mt-1">{s.cargoDescription}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Commercial Weight: {s.cargoWeightKg.toLocaleString()} kg</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-700/60 bg-[#0D2240] text-slate-200">
              <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1.5">
                <Ship className="w-3.5 h-3.5 text-slate-400" />
                <span>Container Equipment</span>
              </span>
              <p className="text-xs font-bold text-white mt-1">{s.containerCount}x {s.containerType}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Sealed & GPS Monitored</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-700/60 bg-[#0D2240] text-slate-200">
              <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Departure Status</span>
              </span>
              <p className="text-xs font-bold text-white mt-1 font-mono">
                {s.actualDeparture || s.estimatedDeparture}
              </p>
              <p className="text-[10px] text-emerald-400 mt-0.5">
                {s.actualDeparture ? 'Vessel Underway' : 'Scheduled at Berth'}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-700/60 bg-[#0D2240] text-slate-200">
              <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Arrival at Destination</span>
              </span>
              <p className="text-xs font-bold text-white mt-1 font-mono">
                {s.revisedEta || s.estimatedArrival}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Inbound Pilot Scheduled</p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-700/60">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-[#B7F500]" />
              <span>Direct carrier EDI telemetry updated 4 hours ago.</span>
            </div>

            <button
              onClick={() => onSelectShipmentJourney(s)}
              className="py-2.5 px-6 rounded-lg bg-[#B7F500] hover:bg-[#a5de00] text-[#0D2240] text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Detailed Journey Milestones</span>
              <ArrowRight className="w-4 h-4 text-[#0D2240]" />
            </button>
          </div>
        </div>

      </div>

      {/* Scoped Customer Notifications Section */}
      <div className="bg-[#132B4F] rounded-xl border border-slate-700/70 shadow-lg p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#B7F500]" />
            <h3 className="text-sm font-bold text-white">
              Shipment Alerts for Booking {s.bookingNumber} ({customerNotifs.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400">Strictly isolated to your account</span>
        </div>

        {customerNotifs.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2">No active notifications for this consignment.</p>
        ) : (
          <div className="space-y-2.5">
            {customerNotifs.map(n => (
              <div
                key={n.id}
                className="p-3 rounded-lg border border-slate-700/60 bg-[#0D2240] text-xs flex items-start gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-[#B7F500] mt-1.5 shrink-0" />
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-white">{n.title}</p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
