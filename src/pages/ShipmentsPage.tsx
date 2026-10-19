import React, { useState, useEffect } from 'react';
import {
  Ship,
  Search,
  PlusCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { localDb } from '../services/storage';
import type { Shipment, Port } from '../types';

interface ShipmentsPageProps {
  onSelectShipment: (shipmentId: string) => void;
  onOpenCreateBooking?: () => void;
}

export const ShipmentsPage: React.FC<ShipmentsPageProps> = ({
  onSelectShipment,
  onOpenCreateBooking,
}) => {
  const { user } = useAuth();
  const isOps = user?.role === 'operations';

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [ports, setPorts] = useState<Port[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [originCode, setOriginCode] = useState('all');
  const [destinationCode, setDestinationCode] = useState('all');
  const [carrier, setCarrier] = useState('all');
  const [offset, setOffset] = useState(0);
  const limit = 15;

  const carriers = [
    'all',
    'Maersk Line',
    'MSC Mediterranean Shipping Co',
    'CMA CGM Group',
    'Hapag-Lloyd',
    'COSCO Shipping Lines',
    'Ocean Network Express (ONE)',
    'Evergreen Marine Corp',
    'Yang Ming Marine Transport',
  ];

  const statuses = ['all', 'Booking Confirmed', 'In Transit', 'Arriving Soon', 'Delayed', 'Delivered'];

  // Load Ports
  useEffect(() => {
    setPorts(localDb.getPorts());
  }, []);

  // Fetch Shipments
  const loadShipments = () => {
    setLoading(true);
    try {
      const res = localDb.getShipments({
        customerId: !isOps ? user?.id : undefined,
        role: user?.role,
        status,
        originCode,
        destinationCode,
        carrier,
        search,
        limit,
        offset,
      });
      setShipments(res.shipments);
      setTotal(res.total);
    } catch (e) {
      console.error('Failed to query shipments:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShipments();
  }, [user, status, originCode, destinationCode, carrier, offset]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOffset(0);
    loadShipments();
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatus('all');
    setOriginCode('all');
    setDestinationCode('all');
    setCarrier('all');
    setOffset(0);
  };

  const totalPages = Math.ceil(total / limit) || 1;
  const currentPage = Math.floor(offset / limit) + 1;

  // Customer view: strictly display their assigned shipment
  if (!isOps) {
    const single = shipments[0];
    return (
      <div className="space-y-6 relative">
        <div className="absolute -top-10 left-1/3 w-96 h-96 bg-[#B7F500]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="pb-2 border-b border-slate-800">
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Ship className="w-6 h-6 text-[#B7F500]" />
            <span>Consignments for {user?.company}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authenticated ocean freight consignment details for your commercial account.
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs bg-[#0D2240] rounded-2xl border border-slate-800">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#B7F500] mb-2" />
            <span>Loading authorized customer consignment...</span>
          </div>
        ) : !single ? (
          <div className="bg-[#0D2240] border border-slate-800 rounded-2xl p-10 text-center space-y-3">
            <Ship className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Consignment Allocated</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Your customer account ({user?.company}) currently has no ocean freight booking allocated.
              Please contact Operations at <span className="text-[#B7F500] font-mono">ops@compassvoyage.com</span> to issue your container booking.
            </p>
          </div>
        ) : (
          <div className="bg-[#0D2240] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xl font-bold text-white">{single.booking_id}</span>
                  <StatusBadge status={single.status} delayDays={single.delay_days} size="md" />
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {single.carrier} • Vessel: <span className="text-white">{single.vessel}</span> (Voyage {single.voyage_number})
                </div>
              </div>
              <button
                onClick={() => onSelectShipment(single.id)}
                className="px-5 py-2.5 rounded-xl bg-[#B7F500] hover:bg-[#a3dc00] text-[#0D2240] font-extrabold text-xs transition flex items-center gap-2 shadow-lg shadow-[#B7F500]/10 shrink-0"
              >
                <span>View Full Details & Milestone Timeline</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#081426] border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Port Corridor</span>
                <div className="text-sm font-bold text-white">{single.origin_code} → {single.destination_code}</div>
                <div className="text-slate-400">{single.origin} to {single.destination}</div>
              </div>
              <div className="p-4 rounded-xl bg-[#081426] border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Equipment & Cargo</span>
                <div className="text-sm font-bold text-white">{single.container_count}x {single.container_type}</div>
                <div className="text-slate-300 truncate">{single.cargo_description}</div>
              </div>
              <div className="p-4 rounded-xl bg-[#081426] border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Schedule Dates</span>
                <div className="text-sm font-bold text-white">
                  ETA: {new Date(single.revised_estimated_arrival_date || single.estimated_arrival_date).toLocaleDateString()}
                </div>
                <div className="text-slate-400">
                  ETD: {new Date(single.estimated_departure_date).toLocaleDateString()}
                  {single.delay_days > 0 && <span className="text-rose-400 ml-1 font-semibold">(+{single.delay_days}d delay)</span>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Background radial glow */}
      <div className="absolute -top-10 left-1/3 w-96 h-96 bg-[#B7F500]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Ship className="w-6 h-6 text-[#B7F500]" />
            <span>Fleet Shipments & Bookings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Central logistics control: filter by carrier, ports, booking numbers, or current transit status.
          </p>
        </div>
        {isOps && onOpenCreateBooking && (
          <button
            onClick={onOpenCreateBooking}
            className="px-4 py-2 rounded-xl bg-[#B7F500] hover:bg-[#a3dc00] text-[#0D2240] text-xs font-extrabold flex items-center gap-1.5 transition shadow-lg shadow-[#B7F500]/10 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Booking</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-[#0D2240] border border-slate-800 rounded-2xl space-y-3 shadow-xl backdrop-blur-md">
        <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row items-center gap-3">
          {/* Text Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Booking ID (e.g. CV-900001), vessel, voyage, or cargo..."
              className="w-full bg-[#081426] border border-slate-700 focus:border-[#B7F500] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none transition font-mono"
            />
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <button
              type="submit"
              className="px-4 py-2 bg-[#B7F500] hover:bg-[#a3dc00] text-[#0D2240] font-extrabold text-xs rounded-xl transition shadow-md shadow-[#B7F500]/10 shrink-0"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-3.5 py-2 bg-[#081426] hover:bg-slate-800 text-slate-300 text-xs rounded-xl border border-slate-700 transition shrink-0"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-2 border-t border-slate-800/80 text-xs">
          {/* Status */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setOffset(0);
              }}
              className="w-full bg-[#081426] border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-[#B7F500] focus:outline-none"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s === 'all' ? 'All Statuses' : s}
                </option>
              ))}
            </select>
          </div>

          {/* POL */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Port of Loading (POL)
            </label>
            <select
              value={originCode}
              onChange={(e) => {
                setOriginCode(e.target.value);
                setOffset(0);
              }}
              className="w-full bg-[#081426] border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-[#B7F500] focus:outline-none"
            >
              <option value="all">All POL Ports</option>
              {ports.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.code} - {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* POD */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Port of Discharge (POD)
            </label>
            <select
              value={destinationCode}
              onChange={(e) => {
                setDestinationCode(e.target.value);
                setOffset(0);
              }}
              className="w-full bg-[#081426] border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-[#B7F500] focus:outline-none"
            >
              <option value="all">All POD Ports</option>
              {ports.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.code} - {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Carrier */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Carrier Shipping Line
            </label>
            <select
              value={carrier}
              onChange={(e) => {
                setCarrier(e.target.value);
                setOffset(0);
              }}
              className="w-full bg-[#081426] border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-[#B7F500] focus:outline-none"
            >
              {carriers.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Shipping Lines' : c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-[#0D2240] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#081426] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Booking Number</th>
                {isOps && <th className="py-3.5 px-4">Customer Account</th>}
                <th className="py-3.5 px-4">Route (POL → POD)</th>
                <th className="py-3.5 px-4">Carrier & Vessel</th>
                <th className="py-3.5 px-4">Cargo / Containers</th>
                <th className="py-3.5 px-4">Arrival ETA</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={isOps ? 8 : 7} className="text-center py-12 text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#B7F500]" />
                      <span>Querying shipment database...</span>
                    </div>
                  </td>
                </tr>
              ) : shipments.length === 0 ? (
                <tr>
                  <td colSpan={isOps ? 8 : 7} className="text-center py-12 text-slate-400">
                    No shipments match the selected filters.
                  </td>
                </tr>
              ) : (
                shipments.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => onSelectShipment(s.id)}
                    className="hover:bg-slate-800/50 cursor-pointer transition group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-white group-hover:text-[#B7F500] transition">
                      {s.booking_id}
                    </td>
                    {isOps && (
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white truncate max-w-[150px]">
                          {s.customer_company}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                          {s.customer_name}
                        </div>
                      </td>
                    )}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">
                        {s.origin_code} → {s.destination_code}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                        {s.origin} to {s.destination}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200">{s.carrier}</div>
                      <div className="text-[11px] text-slate-400 italic">
                        {s.vessel} • {s.voyage_number}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-200">
                        <span className="font-semibold text-white">{s.container_count}x</span> {s.container_type}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                        {s.cargo_description}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-white">
                        {new Date(s.revised_estimated_arrival_date || s.estimated_arrival_date).toLocaleDateString()}
                      </div>
                      {s.delay_days > 0 && (
                        <div className="text-[10px] text-rose-400 font-semibold">
                          +{s.delay_days}d delayed
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={s.status} delayDays={s.delay_days} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectShipment(s.id);
                        }}
                        className="px-2.5 py-1 rounded-xl bg-[#081426] hover:bg-[#B7F500] text-[#B7F500] hover:text-[#0D2240] font-bold text-[11px] transition inline-flex items-center gap-1 border border-[#B7F500]/30 shadow-xs"
                      >
                        <span>Journey</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-[#081426] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <span className="font-bold text-white">{shipments.length}</span> of{' '}
            <span className="font-bold text-white">{total}</span> shipments
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={offset === 0 || loading}
              onClick={() => setOffset(Math.max(0, offset - limit))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages || loading}
              onClick={() => setOffset(offset + limit)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
