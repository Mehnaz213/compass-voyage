import React, { useState, useEffect } from 'react';
import {
  Search,
  Ship,
  ArrowRight,
  Anchor,
  Calendar,
  RefreshCw,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { localDb } from '../services/storage';
import type { Shipment, Schedule } from '../types';

interface CustomerTrackingPageProps {
  onSelectShipment: (shipmentId: string) => void;
}

export const CustomerTrackingPage: React.FC<CustomerTrackingPageProps> = ({ onSelectShipment }) => {
  const { user } = useAuth();
  const isOps = user?.role === 'operations';

  const [assignedShipment, setAssignedShipment] = useState<Shipment | null>(null);
  const [milestones, setMilestones] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  // Operations-only search fields
  const [opsSearch, setOpsSearch] = useState('');
  const [opsResults, setOpsResults] = useState<Shipment[]>([]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    try {
      if (!isOps) {
        // STRICT CUSTOMER 1-TO-1 MAPPING
        const shipment = localDb.getCustomerAssignedShipment(user.id);
        setAssignedShipment(shipment);
        if (shipment) {
          const details = localDb.getShipmentById(shipment.id, user);
          setMilestones(details?.schedules || []);
        }
      } else {
        const { shipments } = localDb.getShipments({ limit: 50 });
        setOpsResults(shipments);
      }
    } catch (e) {
      console.error('Failed to load tracking data:', e);
    } finally {
      setLoading(false);
    }
  }, [user, isOps]);

  const handleOpsSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOps) return;
    const { shipments } = localDb.getShipments({ search: opsSearch, limit: 50 });
    setOpsResults(shipments);
  };

  return (
    <div className="space-y-6 relative">
      {/* Background radial glow */}
      <div className="absolute -top-10 left-1/3 w-96 h-96 bg-[#B7F500]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="pb-2 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Shipment Tracking</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#B7F500]/15 text-[#B7F500] border border-[#B7F500]/30">
              {isOps ? 'Operations Global View' : 'Dedicated Consignment Tracker'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {!isOps
              ? `Real-time voyage tracking and verified milestone progression for ${user?.company}.`
              : 'Fleet-wide container tracking and transit exception monitoring.'}
          </p>
        </div>
      </div>

      {/* Customer Mode: Single Assigned Shipment Display */}
      {!isOps && (
        <>
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs bg-[#0D2240] rounded-2xl border border-slate-800">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#B7F500] mb-2" />
              <span>Retrieving authenticated consignment tracking telemetry...</span>
            </div>
          ) : !assignedShipment ? (
            <div className="bg-[#0D2240] border border-slate-800 rounded-2xl p-10 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">No Consignment Allocated to This Account</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Your account ({user?.company}) currently has no active ocean freight shipments assigned. Please contact Operations at <span className="font-mono text-[#B7F500]">ops@compassvoyage.com</span> to issue your container booking.
              </p>
            </div>
          ) : (
            <div className="bg-[#0D2240] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-6 md:p-8 space-y-6">
              {/* Shipment Header Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-white font-mono">{assignedShipment.booking_id}</span>
                    <StatusBadge status={assignedShipment.status} delayDays={assignedShipment.delay_days} size="md" />
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {assignedShipment.carrier} • Vessel: <span className="text-slate-200">{assignedShipment.vessel}</span> (Voyage {assignedShipment.voyage_number})
                  </div>
                </div>
                <button
                  onClick={() => onSelectShipment(assignedShipment.id)}
                  className="px-5 py-2.5 rounded-xl bg-[#B7F500] hover:bg-[#a3dc00] text-[#0D2240] font-extrabold text-xs transition flex items-center gap-2 shadow-lg shadow-[#B7F500]/10 shrink-0"
                >
                  <span>Full Journey Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Transit Corridor */}
              <div className="p-6 rounded-2xl bg-[#081426] border border-slate-800/80">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#B7F500] flex items-center gap-1.5">
                      <Anchor className="w-3.5 h-3.5" /> Origin (POL)
                    </div>
                    <div className="text-lg font-black text-white">{assignedShipment.origin_code}</div>
                    <div className="text-xs font-semibold text-slate-300">{assignedShipment.origin}</div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Departed: {new Date(assignedShipment.estimated_departure_date).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="space-y-2 text-center">
                    <div className="text-xs font-mono text-[#B7F500] font-bold">
                      {assignedShipment.progress}% Route Complete
                    </div>
                    <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-[#12315E] to-[#B7F500] rounded-full"
                        style={{ width: `${assignedShipment.progress}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-400">{assignedShipment.status}</div>
                  </div>

                  <div className="md:text-right">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center md:justify-end gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> Destination (POD)
                    </div>
                    <div className="text-lg font-black text-white">{assignedShipment.destination_code}</div>
                    <div className="text-xs font-semibold text-slate-300">{assignedShipment.destination}</div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Estimated Arrival: {new Date(assignedShipment.revised_estimated_arrival_date || assignedShipment.estimated_arrival_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Milestones */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#B7F500]" />
                  <span>Tracking Milestones</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {milestones.map((m) => (
                    <div
                      key={m.id}
                      className={`p-3.5 rounded-xl border ${
                        m.status === 'Completed'
                          ? 'bg-[#081426] border-emerald-500/30 text-slate-200'
                          : m.status === 'Delayed'
                          ? 'bg-rose-950/30 border-rose-500/40 text-slate-200'
                          : m.status === 'In Progress'
                          ? 'bg-[#081426] border-[#B7F500]/40 text-white'
                          : 'bg-[#081426]/50 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="font-bold">{m.status}</span>
                        <span className="font-mono text-slate-400">
                          {new Date(m.revised_date || m.actual_date || m.planned_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="font-bold text-xs text-white">{m.milestone}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Operations Mode: Multi-Shipment Search and Table */}
      {isOps && (
        <div className="space-y-4">
          <form onSubmit={handleOpsSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by booking #, vessel, origin, destination..."
                value={opsSearch}
                onChange={(e) => setOpsSearch(e.target.value)}
                className="w-full bg-[#081426] border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#B7F500]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#B7F500] hover:bg-[#a3dc00] text-[#0D2240] font-extrabold text-xs rounded-xl transition"
            >
              Search
            </button>
          </form>

          <div className="bg-[#0D2240] border border-slate-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#081426] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Booking #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Corridor</th>
                    <th className="py-3 px-4">Carrier & Vessel</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {opsResults.map((s) => (
                    <tr
                      key={s.id}
                      onClick={() => onSelectShipment(s.id)}
                      className="hover:bg-slate-800/40 cursor-pointer transition"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-white">{s.booking_id}</td>
                      <td className="py-3 px-4">{s.customer_company}</td>
                      <td className="py-3 px-4">{s.origin_code} → {s.destination_code}</td>
                      <td className="py-3 px-4">{s.carrier} ({s.vessel})</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={s.status} delayDays={s.delay_days} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectShipment(s.id);
                          }}
                          className="px-3 py-1 rounded-lg bg-[#081426] hover:bg-[#B7F500] text-[#B7F500] hover:text-[#0D2240] font-bold text-xs transition border border-[#B7F500]/30"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
