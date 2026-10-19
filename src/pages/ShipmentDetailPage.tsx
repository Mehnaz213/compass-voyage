import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Ship,
  Clock,
  AlertTriangle,
  PlusCircle,
  Edit,
  X,
  MapPin,
  Check,
  ShieldCheck,
  CalendarCheck,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { localDb } from '../services/storage';
import type { Shipment, ShipmentEvent, Schedule } from '../types';

interface ShipmentDetailPageProps {
  shipmentId: string;
  onBack: () => void;
}

export const ShipmentDetailPage: React.FC<ShipmentDetailPageProps> = ({ shipmentId, onBack }) => {
  const { user } = useAuth();
  const isOps = user?.role === 'operations';

  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [events, setEvents] = useState<ShipmentEvent[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Operations Modals
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);

  // New Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventDate, setNewEventDate] = useState(new Date().toISOString().slice(0, 16));
  const [newEventConfirmed, setNewEventConfirmed] = useState(true);

  // Edit Status / Delay Form State
  const [editStatus, setEditStatus] = useState<any>('');
  const [editProgress, setEditProgress] = useState<number>(0);
  const [editDelayDays, setEditDelayDays] = useState<number>(0);
  const [editDelayReason, setEditDelayReason] = useState<string>('');
  const [editRevisedEta, setEditRevisedEta] = useState<string>('');
  const [editOperationalNotes, setEditOperationalNotes] = useState<string>('');

  const loadDetails = () => {
    setLoading(true);
    setError(null);
    try {
      const result = localDb.getShipmentById(shipmentId, user);
      if (!result) {
        setError('You do not have authorization to view this consignment or the booking identifier does not exist.');
        setShipment(null);
      } else {
        setShipment(result.shipment);
        setEvents(result.events);
        setSchedules(result.schedules);
        setEditStatus(result.shipment.status);
        setEditProgress(result.shipment.progress);
        setEditDelayDays(result.shipment.delay_days);
        setEditDelayReason(result.shipment.delay_reason || '');
        setEditRevisedEta(
          result.shipment.revised_estimated_arrival_date
            ? result.shipment.revised_estimated_arrival_date.slice(0, 10)
            : ''
        );
        setEditOperationalNotes(result.shipment.operational_notes || '');
      }
    } catch (e: any) {
      setError(e.message || 'Error loading shipment details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [shipmentId, user]);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle || !newEventDesc || !newEventLocation || !shipment) return;

    localDb.addShipmentEvent(shipment.id, {
      title: newEventTitle,
      description: newEventDesc,
      location: newEventLocation,
      event_date: new Date(newEventDate).toISOString(),
      event_type: 'milestone',
      confirmed: newEventConfirmed ? 1 : 0,
    });

    setShowAddEventModal(false);
    setNewEventTitle('');
    setNewEventDesc('');
    setNewEventLocation('');
    loadDetails();
  };

  const handleUpdateStatusAndDelay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipment) return;

    localDb.updateShipment(shipment.id, {
      status: editStatus,
      progress: editProgress,
      delay_days: editDelayDays,
      delay_reason: editDelayDays > 0 ? editDelayReason : null,
      revised_estimated_arrival_date: editRevisedEta ? new Date(editRevisedEta).toISOString() : null,
      operational_notes: editOperationalNotes,
    });

    setShowEditStatusModal(false);
    loadDetails();
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-400">
        <Ship className="w-8 h-8 animate-bounce mx-auto text-[#B7F500] mb-3" />
        <p className="text-sm">Loading verified shipment journey...</p>
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="p-8 max-w-xl mx-auto bg-[#0D2240] border border-rose-500/40 rounded-2xl text-center space-y-4">
        <AlertTriangle className="w-10 h-10 mx-auto text-rose-400" />
        <h3 className="font-bold text-lg text-white">Access Denied or Record Not Found</h3>
        <p className="text-xs text-rose-300 leading-relaxed">
          {error || 'You do not have permission to view this shipment.'}
        </p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
        >
          Return to Previous Screen
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Background radial glow */}
      <div className="absolute -top-10 left-1/3 w-96 h-96 bg-[#B7F500]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#B7F500] transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Shipments</span>
      </button>

      {/* Main Shipment Overview Header */}
      <div className="bg-[#0D2240] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-2xl font-black text-white">{shipment.booking_id}</span>
              <StatusBadge status={shipment.status} delayDays={shipment.delay_days} />
              {shipment.delay_days > 0 && (
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-950 text-rose-300 border border-rose-500/30">
                  +{shipment.delay_days}d Adjusted
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-2 text-sm text-slate-200 flex-wrap">
              <span className="font-extrabold text-white">
                {shipment.origin_code} ({shipment.origin})
              </span>
              <span className="text-[#B7F500] font-bold">→</span>
              <span className="font-extrabold text-white">
                {shipment.destination_code} ({shipment.destination})
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">Carrier: <strong className="text-white">{shipment.carrier}</strong></span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">Vessel: <strong className="text-white">{shipment.vessel}</strong> ({shipment.voyage_number})</span>
            </div>
            <div className="text-xs text-slate-400 mt-2 flex items-center gap-3">
              <span>Customer: <strong className="text-slate-200">{shipment.customer_company}</strong> ({shipment.customer_name})</span>
              {shipment.assigned_ops_name && (
                <span>• Operations Lead: <strong className="text-slate-200">{shipment.assigned_ops_name}</strong></span>
              )}
            </div>
          </div>

          {/* Operations Controls */}
          {isOps && (
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setShowAddEventModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#081426] hover:bg-[#122849] border border-[#B7F500]/40 text-xs font-bold text-[#B7F500] flex items-center gap-1.5 transition shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Event</span>
              </button>
              <button
                onClick={() => setShowEditStatusModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#B7F500] hover:bg-[#a3dc00] text-[#0D2240] text-xs font-extrabold flex items-center gap-1.5 transition shadow-md shadow-[#B7F500]/10"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Update Status / Delays</span>
              </button>
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 text-xs">
          <div className="p-3.5 bg-[#081426] rounded-xl border border-slate-800">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Cargo & Equipment</span>
            <div className="font-bold text-white text-sm mt-0.5">{shipment.container_count}x {shipment.container_type}</div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5" title={shipment.cargo_description}>
              {shipment.cargo_description}
            </div>
          </div>
          <div className="p-3.5 bg-[#081426] rounded-xl border border-slate-800">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">ETD Departure</span>
            <div className="font-bold text-white text-sm mt-0.5">
              {new Date(shipment.estimated_departure_date).toLocaleDateString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">POL: {shipment.origin_code}</div>
          </div>
          <div className="p-3.5 bg-[#081426] rounded-xl border border-slate-800">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {shipment.delay_days > 0 ? 'Revised Arrival (ETA)' : 'Planned Arrival (ETA)'}
            </span>
            <div className={`font-bold text-sm mt-0.5 ${shipment.delay_days > 0 ? 'text-amber-300' : 'text-white'}`}>
              {new Date(shipment.revised_estimated_arrival_date || shipment.estimated_arrival_date).toLocaleDateString()}
            </div>
            {shipment.delay_days > 0 && (
              <div className="text-[10px] text-rose-400 font-semibold mt-0.5">
                Original: {new Date(shipment.estimated_arrival_date).toLocaleDateString()}
              </div>
            )}
          </div>
          <div className="p-3.5 bg-[#081426] rounded-xl border border-slate-800">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Voyage Progress</span>
            <div className="font-bold text-[#B7F500] text-sm mt-0.5">{shipment.progress}% Complete</div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-[#B7F500] h-full rounded-full" style={{ width: `${shipment.progress}%` }} />
            </div>
          </div>
        </div>

        {/* Delay banner if applicable */}
        {shipment.delay_days > 0 && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Delay Advisory Notice: </span>
              <span>{shipment.delay_reason || 'Operational delay noted along maritime corridor.'}</span>
            </div>
          </div>
        )}

        {/* Operational Notes if present */}
        {shipment.operational_notes && (
          <div className="mt-3 p-3 rounded-xl bg-[#081426]/70 border border-slate-800 text-xs text-slate-300">
            <strong className="text-slate-200">Operational Notes: </strong> {shipment.operational_notes}
          </div>
        )}
      </div>

      {/* Two Column Layout: Journey Timeline & Schedule Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Full Shipment Journey Timeline (2 cols) */}
        <div className="lg:col-span-2 bg-[#0D2240] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#B7F500]/15 text-[#B7F500]">
                <Ship className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-base">Recorded Shipment Journey</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {events.length} Recorded Milestone{events.length === 1 ? '' : 's'}
            </span>
          </div>

          {events.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No milestone events currently recorded for this shipment.
            </div>
          ) : (
            <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
              {events.map((ev) => {
                const isConfirmed = Number(ev.confirmed) === 1;
                const isDelay = ev.event_type === 'delay';
                const isDelivered = ev.event_type === 'delivered';

                return (
                  <div key={ev.id} className="relative group">
                    {/* Timeline Node Icon */}
                    <div
                      className={`absolute -left-[30px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                        isDelay
                          ? 'bg-rose-950 border-rose-500 text-rose-300'
                          : isDelivered
                          ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                          : isConfirmed
                          ? 'bg-[#0D2240] border-[#B7F500] text-[#B7F500]'
                          : 'bg-slate-800 border-slate-600 text-slate-400'
                      }`}
                    >
                      {isDelay ? (
                        <AlertTriangle className="w-3 h-3" />
                      ) : isDelivered ? (
                        <Check className="w-3 h-3" />
                      ) : isConfirmed ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                    </div>

                    {/* Event Content Card */}
                    <div className="p-4 rounded-xl bg-[#081426] border border-slate-800/90 hover:border-slate-700 transition">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                        <h4 className="font-bold text-white text-sm">{ev.title}</h4>
                        <div className="flex items-center gap-2">
                          {isConfirmed ? (
                            <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                              <ShieldCheck className="w-2.5 h-2.5" /> Confirmed Actual
                            </span>
                          ) : (
                            <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                              Estimated
                            </span>
                          )}
                          <span className="text-xs text-slate-400 font-mono">
                            {new Date(ev.event_date).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{ev.description}</p>
                      <div className="mt-2.5 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-[#B7F500]" />
                        <span>Location: <strong className="text-slate-300">{ev.location}</strong></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Transportation Schedule Milestones (1 col) */}
        <div className="bg-[#0D2240] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-4 border-b border-slate-800 mb-4">
              <div className="p-1.5 rounded-lg bg-[#B7F500]/15 text-[#B7F500]">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-base">Schedule Milestones</h3>
            </div>
            <div className="space-y-3.5">
              {schedules.map((sch) => {
                const isCompleted = sch.status === 'Completed';
                const isDelayed = sch.status === 'Delayed';
                const isInProgress = sch.status === 'In Progress';

                return (
                  <div key={sch.id} className="p-3.5 rounded-xl bg-[#081426] border border-slate-800">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-white">{sch.milestone}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                            : isDelayed
                            ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                            : isInProgress
                            ? 'bg-blue-950 text-blue-300 border border-blue-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {sch.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 space-y-0.5">
                      <div>Planned: {new Date(sch.planned_date).toLocaleDateString()}</div>
                      {sch.actual_date && (
                        <div className="text-emerald-400 font-medium">
                          Actual: {new Date(sch.actual_date).toLocaleDateString()}
                        </div>
                      )}
                      {sch.revised_date && !sch.actual_date && (
                        <div className="text-amber-400 font-medium">
                          Revised: {new Date(sch.revised_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-6 p-3 rounded-xl bg-[#081426] border border-slate-800 text-[11px] text-slate-400">
            Carrier Line: <strong className="text-white">{shipment.carrier}</strong>
          </div>
        </div>
      </div>

      {/* OPERATIONS MODAL: Add Event */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#0D2240] border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-white text-base">Add Verified Shipment Event</h3>
              <button onClick={() => setShowAddEventModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddEvent} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Transshipment Berthing & Container Discharge"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full bg-[#081426] border border-slate-700 focus:border-[#B7F500] rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Port of Singapore (SGSIN) Terminal 4"
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  className="w-full bg-[#081426] border border-slate-700 focus:border-[#B7F500] rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Event Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="w-full bg-[#081426] border border-slate-700 focus:border-[#B7F500] rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Detailed Operational Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide precise milestone description verified by port or carrier..."
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  className="w-full bg-[#081426] border border-slate-700 focus:border-[#B7F500] rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="confirmedCheck"
                  checked={newEventConfirmed}
                  onChange={(e) => setNewEventConfirmed(e.target.checked)}
                  className="rounded text-[#B7F500] focus:ring-0 bg-[#081426] border-slate-700"
                />
                <label htmlFor="confirmedCheck" className="text-slate-300">
                  Mark as Confirmed Actual Milestone
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#B7F500] text-[#0D2240] font-bold hover:bg-[#a3dc00]"
                >
                  Save Milestone Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OPERATIONS MODAL: Update Status / Delays */}
      {showEditStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#0D2240] border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-white text-base">Update Status & Record Delays</h3>
              <button onClick={() => setShowEditStatusModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateStatusAndDelay} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Shipment Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-[#081426] border border-slate-700 focus:border-[#B7F500] rounded-xl px-3 py-2 text-white"
                >
                  <option value="Booking Confirmed">Booking Confirmed</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Arriving Soon">Arriving Soon</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Voyage Progress (0 - 100%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editProgress}
                  onChange={(e) => setEditProgress(Number(e.target.value))}
                  className="w-full bg-[#081426] border border-slate-700 focus:border-[#B7F500] rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Delay Days
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editDelayDays}
                    onChange={(e) => setEditDelayDays(Number(e.target.value))}
                    className="w-full bg-[#081426] border border-slate-700 focus:border-[#B7F500] rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Revised ETA
                  </label>
                  <input
                    type="date"
                    value={editRevisedEta}
                    onChange={(e) => setEditRevisedEta(e.target.value)}
                    className="w-full bg-[#081426] border border-slate-700 focus:border-[#B7F500] rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Delay Reason (if delayed)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Port berth congestion and heavy fog at transshipment hub."
                  value={editDelayReason}
                  onChange={(e) => setEditDelayReason(e.target.value)}
                  className="w-full bg-[#081426] border border-slate-700 focus:border-[#B7F500] rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Operational Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Internal notes for operations team..."
                  value={editOperationalNotes}
                  onChange={(e) => setEditOperationalNotes(e.target.value)}
                  className="w-full bg-[#081426] border border-slate-700 focus:border-[#B7F500] rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditStatusModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#B7F500] text-[#0D2240] font-bold hover:bg-[#a3dc00]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
