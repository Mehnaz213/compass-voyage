import React, { useState, useMemo } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { 
  Ship, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Users, 
  Search, 
  Calendar, 
  Eye, 
  PlusCircle, 
  Compass, 
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  UserPlus
} from 'lucide-react';
import { Shipment, ShipmentStatus } from '../../types/logistics';
import { ShipmentStatusChartCard } from './ShipmentStatusChartCard';

interface OperationsDashboardProps {
  onSelectShipmentJourney: (shipment: Shipment) => void;
  onNavigateTab: (tab: string) => void;
  onOpenNewBookingModal: () => void;
  onOpenAddUserModal?: () => void;
}

export const OperationsDashboard: React.FC<OperationsDashboardProps> = ({
  onSelectShipmentJourney,
  onNavigateTab,
  onOpenNewBookingModal,
  onOpenAddUserModal
}) => {
  const { 
    shipments, 
    dashboardStats, 
    getPortByCode, 
    getCarrierById, 
    getCustomerById 
  } = useLogistics();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedCarrierFilter, setSelectedCarrierFilter] = useState<string>('ALL');

  // Filtered shipments
  const filteredShipments = useMemo(() => {
    return shipments.filter(s => {
      // Status filter
      if (selectedStatusFilter !== 'ALL' && s.status !== selectedStatusFilter) {
        return false;
      }
      // Carrier filter
      if (selectedCarrierFilter !== 'ALL' && s.carrierId !== selectedCarrierFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const pol = getPortByCode(s.polCode)?.name.toLowerCase() || '';
        const pod = getPortByCode(s.podCode)?.name.toLowerCase() || '';
        const customer = getCustomerById(s.customerId)?.companyName.toLowerCase() || '';
        const carrier = getCarrierById(s.carrierId)?.name.toLowerCase() || '';
        
        return (
          s.bookingNumber.toLowerCase().includes(query) ||
          s.vesselName.toLowerCase().includes(query) ||
          s.polCode.toLowerCase().includes(query) ||
          s.podCode.toLowerCase().includes(query) ||
          s.cargoDescription.toLowerCase().includes(query) ||
          pol.includes(query) ||
          pod.includes(query) ||
          customer.includes(query) ||
          carrier.includes(query)
        );
      }
      return true;
    });
  }, [shipments, selectedStatusFilter, selectedCarrierFilter, searchQuery, getPortByCode, getCarrierById, getCustomerById]);

  // Delayed shipments requiring active ops attention
  const delayedShipments = useMemo(() => {
    return shipments.filter(s => s.status === 'DELAYED' || (s.revisedEta && s.revisedEta > s.estimatedArrival && s.status !== 'DELIVERED'));
  }, [shipments]);

  // Upcoming arrivals
  const upcomingArrivals = useMemo(() => {
    const today = new Date('2026-10-19T00:00:00Z');
    return shipments
      .filter(s => s.status !== 'DELIVERED')
      .sort((a, b) => {
        const dateA = new Date(a.revisedEta || a.estimatedArrival).getTime();
        const dateB = new Date(b.revisedEta || b.estimatedArrival).getTime();
        return dateA - dateB;
      })
      .slice(0, 5);
  }, [shipments]);

  const getStatusBadge = (status: ShipmentStatus) => {
    switch (status) {
      case 'IN_TRANSIT':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-100 text-sky-800">In Transit</span>;
      case 'DELAYED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">Delayed</span>;
      case 'ARRIVING_SOON':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">Arriving Soon</span>;
      case 'BOOKING_CONFIRMED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-100 text-indigo-800">Booking Confirmed</span>;
      case 'DELIVERED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-200 text-slate-700">Delivered</span>;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-white">Operations Dashboard</h1>
            <span className="px-2 py-0.5 rounded bg-[#132B4F] border border-[#B7F500]/40 text-[#B7F500] text-[10px] font-bold uppercase tracking-wider">
              Live Fleet Feed
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Global shipment visibility, vessel tracking schedule management, and exception control for Compass Logistics International.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNavigateTab('schedule-lookup')}
            className="px-3.5 py-2 rounded-lg bg-[#132B4F] border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-[#1A3865] hover:text-white transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-[#B7F500]" />
            <span>Schedule Lookup</span>
          </button>

          <button
            onClick={() => onNavigateTab('carrier-comparison')}
            className="px-3.5 py-2 rounded-lg bg-[#132B4F] border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-[#1A3865] hover:text-white transition-colors shadow-sm flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#B7F500]" />
            <span>Compare Carriers</span>
          </button>

          <button
            onClick={onOpenNewBookingModal}
            className="px-3.5 py-2 rounded-lg bg-[#B7F500] hover:bg-[#a5de00] text-[#0D2240] text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#0D2240]" />
            <span>New Booking</span>
          </button>

          {onOpenAddUserModal && (
            <button
              onClick={onOpenAddUserModal}
              className="px-3.5 py-2 rounded-lg bg-[#132B4F] hover:bg-[#1A3865] border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
              title="Create a new customer login account with 1:1 booking assignment"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#B7F500]" />
              <span>Add New User</span>
            </button>
          )}
        </div>
      </div>

      {/* 8 Data-Derived Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* 1. Total Shipments */}
        <div className="bg-[#132B4F] p-3.5 rounded-xl border border-slate-700/70 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-300">Total</span>
            <Ship className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2">
            <p className="text-2xl font-extrabold text-white font-mono-nums">{dashboardStats.totalShipments}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Active catalog</p>
          </div>
        </div>

        {/* 2. In Transit */}
        <div className="bg-[#132B4F] p-3.5 rounded-xl border border-slate-700/70 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-sky-400">
            <span className="text-[11px] font-medium uppercase tracking-wider text-sky-300">In Transit</span>
            <ArrowUpRight className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2">
            <p className="text-2xl font-extrabold text-sky-300 font-mono-nums">{dashboardStats.inTransitCount}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Underway ocean</p>
          </div>
        </div>

        {/* 3. Delayed */}
        <div className="bg-amber-950/40 p-3.5 rounded-xl border border-amber-600/50 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">Delayed</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <p className="text-2xl font-extrabold text-amber-300 font-mono-nums">{dashboardStats.delayedCount}</p>
            <p className="text-[10px] text-amber-400/90 mt-0.5">Action required</p>
          </div>
        </div>

        {/* 4. Delivered */}
        <div className="bg-[#132B4F] p-3.5 rounded-xl border border-emerald-700/50 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[11px] font-medium uppercase tracking-wider text-emerald-300">Delivered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <p className="text-2xl font-extrabold text-emerald-300 font-mono-nums">{dashboardStats.deliveredCount}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">POD verified</p>
          </div>
        </div>

        {/* 5. Upcoming Arrivals */}
        <div className="bg-[#132B4F] p-3.5 rounded-xl border border-slate-700/70 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-300">Arrivals</span>
            <ArrowDownLeft className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2">
            <p className="text-2xl font-extrabold text-white font-mono-nums">{dashboardStats.upcomingArrivalsCount}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Next 7 days</p>
          </div>
        </div>

        {/* 6. Upcoming Departures */}
        <div className="bg-[#132B4F] p-3.5 rounded-xl border border-slate-700/70 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-300">Departures</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2">
            <p className="text-2xl font-extrabold text-white font-mono-nums">{dashboardStats.upcomingDeparturesCount}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Next 7 days</p>
          </div>
        </div>

        {/* 7. Booking Confirmations */}
        <div className="bg-[#132B4F] p-3.5 rounded-xl border border-slate-700/70 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-300">Confirmed</span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2">
            <p className="text-2xl font-extrabold text-white font-mono-nums">{dashboardStats.bookingConfirmationsCount}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Staged for gate</p>
          </div>
        </div>

        {/* 8. Total Customers */}
        <div className="bg-[#132B4F] p-3.5 rounded-xl border border-slate-700/70 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-300">Customers</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2">
            <p className="text-2xl font-extrabold text-white font-mono-nums">{dashboardStats.totalCustomersCount}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">1:1 Assigned</p>
          </div>
        </div>
      </div>

      {/* Recharts Analytics Summary Card: Shipments per Transit Status */}
      <ShipmentStatusChartCard
        shipments={shipments}
        selectedStatusFilter={selectedStatusFilter}
        onSelectStatusFilter={setSelectedStatusFilter}
      />

      {/* Exception Management: Delayed Shipments Section */}
      {delayedShipments.length > 0 && (
        <div className="bg-[#132B4F] rounded-xl border border-amber-500/50 shadow-xs overflow-hidden">
          <div className="bg-amber-950/70 px-5 py-3.5 border-b border-amber-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-amber-200">
                Active Schedule Exceptions & Delays ({delayedShipments.length})
              </h2>
            </div>
            <span className="text-xs text-amber-300 font-medium">Revised ETAs recorded</span>
          </div>

          <div className="divide-y divide-slate-800/70">
            {delayedShipments.map(s => {
              const carrier = getCarrierById(s.carrierId);
              const pol = getPortByCode(s.polCode);
              const pod = getPortByCode(s.podCode);
              const customer = getCustomerById(s.customerId);

              return (
                <div key={s.id} className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[#1A3865]/60 transition-colors">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-xs font-bold text-[#B7F500] bg-[#0D2240] border border-slate-700 px-2 py-0.5 rounded">
                        {s.bookingNumber}
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {carrier?.name} · {s.vesselName} (Voy: {s.voyageNumber})
                      </span>
                      {customer && (
                        <span className="text-xs text-slate-300">
                          Consignee: <strong className="text-white">{customer.companyName}</strong>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <span>{pol?.name || s.polCode}</span>
                      <span className="text-slate-400">→</span>
                      <span>{pod?.name || s.podCode}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-amber-300 font-semibold">Delay: +{s.delayDurationDays || 3} days</span>
                      <span className="text-slate-500">·</span>
                      <span>Revised ETA: <strong className="font-mono text-white">{s.revisedEta || s.estimatedArrival}</strong></span>
                    </div>

                    <p className="text-xs text-amber-200 italic bg-amber-950/40 p-2 rounded-md border border-amber-800/50">
                      Reason: {s.delayReason || 'Weather divergence or maritime terminal congestion'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onSelectShipmentJourney(s)}
                      className="px-3 py-1.5 rounded-lg bg-[#0D2240] hover:bg-[#1A3865] text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs border border-slate-700"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#B7F500]" />
                      <span>Inspect Journey</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Section: Complete Searchable & Filterable Shipments Grid */}
      <div className="bg-[#132B4F] rounded-xl border border-slate-700/70 shadow-xs overflow-hidden">
        
        {/* Table Filter Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white">All Active Shipments ({filteredShipments.length})</h2>
              <p className="text-xs text-slate-300">Filter, search by booking, vessel, port code, or consignee</p>
            </div>

            {/* Live Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search booking, vessel, customer, cargo..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-700 bg-[#0D2240] text-white placeholder-slate-400 focus:bg-[#0A1A30] focus:outline-none focus:ring-2 focus:ring-[#B7F500] focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Filter Chips Bar */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-300 font-medium">Status:</span>
            {['ALL', 'IN_TRANSIT', 'DELAYED', 'ARRIVING_SOON', 'BOOKING_CONFIRMED', 'DELIVERED'].map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatusFilter(status)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedStatusFilter === status
                    ? 'bg-[#B7F500] text-[#0D2240] font-bold shadow-sm'
                    : 'bg-[#0D2240] text-slate-300 hover:bg-[#1A3865] border border-slate-700/60'
                }`}
              >
                {status === 'ALL' ? 'All Statuses' : status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Shipments Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0A1A30] border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Booking Number</th>
                <th className="py-3 px-4">Route (POL → POD)</th>
                <th className="py-3 px-4">Carrier & Vessel</th>
                <th className="py-3 px-4">Customer / Consignee</th>
                <th className="py-3 px-4">Cargo & Containers</th>
                <th className="py-3 px-4">Departure</th>
                <th className="py-3 px-4">Est. Arrival</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-slate-200">No shipments found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or clear status filters.</p>
                  </td>
                </tr>
              ) : (
                filteredShipments.map(s => {
                  const pol = getPortByCode(s.polCode);
                  const pod = getPortByCode(s.podCode);
                  const carrier = getCarrierById(s.carrierId);
                  const customer = getCustomerById(s.customerId);

                  return (
                    <tr key={s.id} className="hover:bg-[#1A3865]/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#B7F500]">
                        {s.bookingNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-white">
                          {s.polCode} → {s.podCode}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                          {pol?.city} to {pod?.city}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-200">{carrier?.name}</div>
                        <div className="text-[11px] text-slate-400">{s.vesselName}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {customer ? (
                          <div>
                            <p className="font-semibold text-white">{customer.companyName}</p>
                            <p className="text-[10px] text-slate-400">{customer.name}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Operational Line</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-200">{s.containerCount}x {s.containerType}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{s.cargoDescription}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {s.estimatedDeparture}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {s.revisedEta ? (
                          <div>
                            <span className="text-amber-400 font-bold">{s.revisedEta}</span>
                            <span className="text-[10px] line-through text-slate-400 block">{s.estimatedArrival}</span>
                          </div>
                        ) : (
                          <span className="text-slate-200 font-medium">{s.estimatedArrival}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(s.status)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onSelectShipmentJourney(s)}
                          className="px-2.5 py-1 rounded bg-[#0D2240] hover:bg-[#1A3865] hover:text-[#B7F500] text-slate-200 text-xs font-medium transition-colors inline-flex items-center gap-1 cursor-pointer border border-slate-700"
                          title="View Journey Timeline"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Journey</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer */}
        <div className="p-3 bg-[#0A1A30] border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Showing {filteredShipments.length} of {shipments.length} total operational shipments</span>
          <span>Dates verified against Compass Voyage central schedule register</span>
        </div>
      </div>

    </div>
  );
};
