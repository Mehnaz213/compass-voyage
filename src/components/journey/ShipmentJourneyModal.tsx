import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  Plus, 
  Ship, 
  FileText, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { Shipment, MilestoneEvent, MilestoneType, ShipmentStatus } from '../../types/logistics';

interface ShipmentJourneyModalProps {
  shipment: Shipment | null;
  onClose: () => void;
}

export const ShipmentJourneyModal: React.FC<ShipmentJourneyModalProps> = ({
  shipment,
  onClose
}) => {
  const { 
    currentUser, 
    shipments,
    getMilestonesForShipment, 
    addMilestoneEvent, 
    updateShipmentStatus,
    updateShipmentEta,
    getPortByCode, 
    getCarrierById, 
    getCustomerById 
  } = useLogistics();

  // Always bind to latest shipment record in state
  const currentShipment = shipments.find(s => s.id === shipment?.id) || shipment;

  // New Milestone Form State (for Operations)
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMilestoneType, setNewMilestoneType] = useState<MilestoneType>('TRANSSHIPMENT');
  const [newTitle, setNewTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [newLocation, setNewLocation] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newIsConfirmed, setNewIsConfirmed] = useState(true);

  // Status Update state
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState<ShipmentStatus>(currentShipment?.status || 'IN_TRANSIT');
  const [updatedDelayReason, setUpdatedDelayReason] = useState(currentShipment?.delayReason || '');
  const [updatedRevisedEta, setUpdatedRevisedEta] = useState(currentShipment?.revisedEta || '');

  // Revised ETA Form State
  const [showEtaUpdate, setShowEtaUpdate] = useState(false);
  const [newEtaDateTime, setNewEtaDateTime] = useState(() => {
    if (!currentShipment) return '';
    const initial = currentShipment.revisedEta || currentShipment.estimatedArrival;
    return initial.includes('T') ? initial.slice(0, 16) : `${initial}T14:00`;
  });
  const [etaDelayReason, setEtaDelayReason] = useState(currentShipment?.delayReason || '');
  const [etaRemarks, setEtaRemarks] = useState(currentShipment?.operationalRemarks || '');
  const [etaFeedback, setEtaFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  if (!currentShipment) return null;

  const milestones = getMilestonesForShipment(currentShipment.id);
  const pol = getPortByCode(currentShipment.polCode);
  const pod = getPortByCode(currentShipment.podCode);
  const carrier = getCarrierById(currentShipment.carrierId);
  const customer = getCustomerById(currentShipment.customerId);
  const isOperations = currentUser.role === 'operations';

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newEventDate || !newLocation.trim()) return;

    addMilestoneEvent(currentShipment.id, {
      milestone: newMilestoneType,
      title: newTitle.trim(),
      eventDate: newEventDate,
      location: newLocation.trim(),
      description: newDescription.trim() || 'Recorded by Operations Specialist.',
      isConfirmed: newIsConfirmed,
      category: newIsConfirmed ? 'actual' : 'planned'
    });

    // Reset
    setNewTitle('');
    setNewLocation('');
    setNewDescription('');
    setShowAddForm(false);
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    updateShipmentStatus(
      currentShipment.id, 
      updatedStatus, 
      updatedStatus === 'DELAYED' ? updatedDelayReason : undefined,
      updatedStatus === 'DELAYED' ? updatedRevisedEta : undefined
    );
    setShowStatusUpdate(false);
  };

  const handleSaveRevisedEta = (e: React.FormEvent) => {
    e.preventDefault();
    setEtaFeedback(null);

    if (!newEtaDateTime.trim()) {
      setEtaFeedback({ type: 'error', text: 'Please specify a valid Revised ETA date and time.' });
      return;
    }
    if (!etaDelayReason.trim()) {
      setEtaFeedback({ type: 'error', text: 'Please enter a reason for the revised ETA / schedule adjustment.' });
      return;
    }

    const formattedEta = newEtaDateTime.includes('T') ? newEtaDateTime.replace('T', ' ') : newEtaDateTime;

    updateShipmentEta(
      currentShipment.id,
      formattedEta,
      etaDelayReason.trim(),
      etaRemarks.trim() || undefined
    );

    setEtaFeedback({
      type: 'success',
      text: `Revised ETA successfully saved as ${formattedEta}. Timeline and notifications updated.`
    });

    setTimeout(() => {
      setShowEtaUpdate(false);
      setEtaFeedback(null);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-[#132B4F] rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-700/80 overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-100">
        
        {/* Modal Top Header */}
        <div className="bg-[#0A1A30] border-b border-slate-800 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-black text-[#B7F500]">
                {currentShipment.bookingNumber}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white">
                {currentShipment.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {pol?.name} ({currentShipment.polCode}) → {pod?.name} ({currentShipment.podCode}) · {carrier?.name} · {currentShipment.vesselName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar for Operations */}
        {isOperations && (
          <div className="bg-[#0D2240] px-6 py-2.5 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
            <span className="text-slate-300 font-medium">Operations Controls:</span>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  setShowStatusUpdate(!showStatusUpdate);
                  setShowEtaUpdate(false);
                  setShowAddForm(false);
                }}
                className={`px-3 py-1 rounded border font-semibold shadow-xs cursor-pointer transition-colors ${
                  showStatusUpdate
                    ? 'bg-[#1A3865] text-white border-slate-500'
                    : 'bg-[#132B4F] hover:bg-[#1A3865] border-slate-700 text-slate-200'
                }`}
              >
                Update Shipment Status
              </button>
              <button
                onClick={() => {
                  setShowEtaUpdate(!showEtaUpdate);
                  setShowStatusUpdate(false);
                  setShowAddForm(false);
                  setEtaFeedback(null);
                }}
                className={`px-3 py-1 rounded border font-semibold shadow-xs flex items-center gap-1 cursor-pointer transition-colors ${
                  showEtaUpdate
                    ? 'bg-amber-400 text-[#0D2240] border-amber-300 font-bold'
                    : 'bg-[#132B4F] hover:bg-[#1A3865] border-amber-500/50 text-amber-300'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Update Revised ETA</span>
              </button>
              <button
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  setShowStatusUpdate(false);
                  setShowEtaUpdate(false);
                }}
                className="px-3 py-1 rounded bg-[#B7F500] hover:bg-[#a5de00] font-bold text-[#0D2240] shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#0D2240]" />
                <span>Add Milestone Event</span>
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          
          {/* Operations Update Status Dropdown Form */}
          {showStatusUpdate && isOperations && (
            <form onSubmit={handleSaveStatus} className="p-4 rounded-xl bg-[#0D2240] border border-slate-700 space-y-4 text-xs animate-in fade-in duration-100 text-white">
              <h3 className="font-bold text-white">Modify Shipment Operational Status</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">New Status</label>
                  <select
                    value={updatedStatus}
                    onChange={e => setUpdatedStatus(e.target.value as ShipmentStatus)}
                    className="w-full p-2 rounded border border-slate-700 bg-[#132B4F] text-white focus:outline-none focus:ring-1 focus:ring-[#B7F500]"
                  >
                    <option value="BOOKING_CONFIRMED">BOOKING CONFIRMED</option>
                    <option value="IN_TRANSIT">IN TRANSIT</option>
                    <option value="ARRIVING_SOON">ARRIVING SOON</option>
                    <option value="DELAYED">DELAYED</option>
                    <option value="DELIVERED">DELIVERED</option>
                  </select>
                </div>

                {updatedStatus === 'DELAYED' && (
                  <>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-300">Delay Reason</label>
                      <input
                        type="text"
                        value={updatedDelayReason}
                        onChange={e => setUpdatedDelayReason(e.target.value)}
                        placeholder="e.g. Port berth backlog, weather evasion"
                        className="w-full p-2 rounded border border-slate-700 bg-[#132B4F] text-white focus:outline-none focus:ring-1 focus:ring-[#B7F500]"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-300">Revised ETA Date</label>
                      <input
                        type="date"
                        value={updatedRevisedEta}
                        onChange={e => setUpdatedRevisedEta(e.target.value)}
                        className="w-full p-2 rounded border border-slate-700 bg-[#132B4F] text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#B7F500]"
                        required
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStatusUpdate(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#B7F500] hover:bg-[#a5de00] text-[#0D2240] font-bold rounded cursor-pointer"
                >
                  Save Status Update
                </button>
              </div>
            </form>
          )}

          {/* Operations Update Revised ETA Form */}
          {showEtaUpdate && isOperations && (
            <form onSubmit={handleSaveRevisedEta} className="p-5 rounded-xl bg-[#0D2240] border border-amber-500/50 space-y-4 text-xs animate-in fade-in duration-100 text-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Update Revised ETA</h3>
                    <p className="text-[11px] text-slate-300">
                      Record an updated arrival estimate and delay reason. Original contract ETA is preserved.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold text-amber-300 px-2.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/40">
                  Operations Exception
                </span>
              </div>

              {etaFeedback && (
                <div className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
                  etaFeedback.type === 'error'
                    ? 'bg-rose-950/60 border border-rose-500/50 text-rose-200'
                    : 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-200'
                }`}>
                  {etaFeedback.type === 'error' ? (
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  <span>{etaFeedback.text}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* 1. Original ETA (Read-Only) */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300 flex items-center justify-between">
                    <span>Original Contract ETA</span>
                    <span className="text-[10px] text-slate-400 font-normal uppercase">(Read-Only)</span>
                  </label>
                  <input
                    type="text"
                    value={currentShipment.estimatedArrival}
                    readOnly
                    className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-900/80 text-slate-300 font-mono text-xs cursor-not-allowed select-none"
                    title="Original ETA cannot be modified"
                  />
                  <p className="text-[10px] text-slate-400">Baseline arrival date agreed in original ocean booking.</p>
                </div>

                {/* 2. Current Revised ETA (Read-Only) */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300 flex items-center justify-between">
                    <span>Current Revised ETA</span>
                    <span className="text-[10px] text-amber-400 font-normal uppercase">Active Record</span>
                  </label>
                  <input
                    type="text"
                    value={currentShipment.revisedEta || 'None on record (On Schedule)'}
                    readOnly
                    className={`w-full p-2.5 rounded-lg border text-xs font-mono select-none ${
                      currentShipment.revisedEta
                        ? 'border-amber-500/50 bg-amber-950/40 text-amber-300 font-bold'
                        : 'border-slate-700 bg-slate-900/60 text-slate-400'
                    }`}
                  />
                  <p className="text-[10px] text-slate-400">Currently published arrival date exception.</p>
                </div>

                {/* 3. New Revised ETA Date and Time Picker */}
                <div className="space-y-1">
                  <label className="font-semibold text-white flex items-center justify-between">
                    <span>New Revised ETA</span>
                    <span className="text-amber-400 font-bold">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={newEtaDateTime}
                    onChange={e => setNewEtaDateTime(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-lg border border-amber-400/80 bg-[#132B4F] text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <p className="text-[10px] text-slate-300">Set new anticipated date and berthing time.</p>
                </div>
              </div>

              {/* Delay Reason Input */}
              <div className="space-y-1.5">
                <label className="font-semibold text-white flex items-center justify-between">
                  <span>Delay Reason</span>
                  <span className="text-amber-400 font-bold">*</span>
                </label>
                <input
                  type="text"
                  list="eta-delay-reasons"
                  value={etaDelayReason}
                  onChange={e => setEtaDelayReason(e.target.value)}
                  placeholder="e.g. Typhoon weather evasion route, Port berth backlog, Transshipment rollover"
                  required
                  className="w-full p-2.5 rounded-lg border border-slate-700 bg-[#132B4F] text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#B7F500] placeholder:text-slate-400"
                />
                <datalist id="eta-delay-reasons">
                  <option value="Typhoon weather evasion route in Western Pacific" />
                  <option value="Destination port berth congestion & waiting time" />
                  <option value="Transshipment hub terminal rollover due to high yard density" />
                  <option value="Customs inspection hold & container quarantine verification" />
                  <option value="Main engine RPM restriction for fuel conservation and safety" />
                  <option value="Adverse maritime swell conditions at approach channel" />
                </datalist>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Weather Evasion', 'Port Berth Congestion', 'Transshipment Rollover', 'Customs Inspection Hold'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setEtaDelayReason(tag)}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Operational Remarks */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 flex items-center justify-between">
                  <span>Optional Operational Remarks</span>
                  <span className="text-[10px] text-slate-400 font-normal">Internal & customer advisory notes</span>
                </label>
                <textarea
                  rows={2}
                  value={etaRemarks}
                  onChange={e => setEtaRemarks(e.target.value)}
                  placeholder="e.g. In direct contact with vessel master. Terminal gate release pre-cleared for post-discharge delivery."
                  className="w-full p-2.5 rounded-lg border border-slate-700 bg-[#132B4F] text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#B7F500] placeholder:text-slate-400"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-700/80">
                <p className="text-[11px] text-slate-400">
                  Note: Updating ETA does not change the shipment status.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEtaUpdate(false);
                      setEtaFeedback(null);
                    }}
                    className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-[#0D2240] font-extrabold rounded-lg shadow-sm cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Save ETA Update</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Operations Add Milestone Form */}
          {showAddForm && isOperations && (
            <form onSubmit={handleAddMilestone} className="p-4 rounded-xl bg-[#0D2240] border border-slate-700 space-y-4 text-xs animate-in fade-in duration-100 text-white">
              <h3 className="font-bold text-white">Record New Journey Event / Milestone</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Milestone Stage</label>
                  <select
                    value={newMilestoneType}
                    onChange={e => setNewMilestoneType(e.target.value as MilestoneType)}
                    className="w-full p-2 rounded border border-slate-700 bg-[#132B4F] text-white focus:outline-none focus:ring-1 focus:ring-[#B7F500]"
                  >
                    <option value="BOOKING_CONFIRMED">Booking Confirmed</option>
                    <option value="CARGO_RECEIVED">Cargo Received</option>
                    <option value="GATE_IN">Gate-In Terminal</option>
                    <option value="LOADED_ON_VESSEL">Loaded on Vessel</option>
                    <option value="VESSEL_DEPARTED">Vessel Departed</option>
                    <option value="TRANSSHIPMENT">Transshipment / Waypoint</option>
                    <option value="ARRIVAL_AT_DESTINATION">Arrival at Destination</option>
                    <option value="CUSTOMS_CLEARANCE">Customs Clearance</option>
                    <option value="CARGO_AVAILABLE">Cargo Available</option>
                    <option value="DELIVERED">Delivered</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Event Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. Customs Release Verified"
                    className="w-full p-2 rounded border border-slate-700 bg-[#132B4F] text-white focus:outline-none focus:ring-1 focus:ring-[#B7F500]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Event Date</label>
                  <input
                    type="date"
                    value={newEventDate}
                    onChange={e => setNewEventDate(e.target.value)}
                    className="w-full p-2 rounded border border-slate-700 bg-[#132B4F] text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#B7F500]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    placeholder="e.g. Rotterdam Customs Inspection Gate"
                    className="w-full p-2 rounded border border-slate-700 bg-[#132B4F] text-white focus:outline-none focus:ring-1 focus:ring-[#B7F500]"
                    required
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-slate-300">Description / Log Notes</label>
                  <input
                    type="text"
                    value={newDescription}
                    onChange={e => setNewDescription(e.target.value)}
                    placeholder="e.g. Cargo cleared regulatory hold without exception."
                    className="w-full p-2 rounded border border-slate-700 bg-[#132B4F] text-white focus:outline-none focus:ring-1 focus:ring-[#B7F500]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-300">
                  <input
                    type="checkbox"
                    checked={newIsConfirmed}
                    onChange={e => setNewIsConfirmed(e.target.checked)}
                    className="rounded text-[#0D2240]"
                  />
                  <span>Mark as Confirmed Actual Event (not planned)</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#B7F500] hover:bg-[#a5de00] text-[#0D2240] font-bold rounded cursor-pointer"
                  >
                    Add Event
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Key Consignment Summary Header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#0D2240] border border-slate-700/60 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Consignee</span>
              <p className="font-bold text-white mt-0.5 truncate">{customer?.companyName || 'Operational Line'}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Cargo & Equipment</span>
              <p className="font-bold text-white mt-0.5">{currentShipment.containerCount}x {currentShipment.containerType}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Departure</span>
              <p className="font-bold font-mono text-white mt-0.5">{currentShipment.actualDeparture || currentShipment.estimatedDeparture}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Arrival Schedule</span>
              <p className="font-bold font-mono text-white mt-0.5">
                {currentShipment.revisedEta ? (
                  <span className="text-amber-400">{currentShipment.revisedEta} <span className="text-[10px] font-normal text-amber-300">(Revised)</span></span>
                ) : (
                  <span>{currentShipment.estimatedArrival}</span>
                )}
              </p>
            </div>
          </div>

          {/* Active Schedule Revision banner if revised */}
          {currentShipment.revisedEta && (
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-bold text-amber-300">
                    Schedule Revision Active: Revised ETA {currentShipment.revisedEta}
                  </span>
                  <span className="text-[10px] font-mono text-amber-400/80">
                    Original Contract ETA: {currentShipment.estimatedArrival}
                  </span>
                </div>
                {currentShipment.delayReason && (
                  <p className="text-amber-200/90 leading-relaxed">
                    <strong className="text-white">Reason:</strong> {currentShipment.delayReason}
                  </p>
                )}
                {currentShipment.operationalRemarks && (
                  <p className="text-slate-300 text-[11px] leading-relaxed pt-0.5">
                    <strong className="text-slate-200">Operations Remarks:</strong> {currentShipment.operationalRemarks}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Timeline Milestones Legend */}
          <div className="flex items-center gap-6 text-[11px] text-slate-400 border-b border-slate-700/80 pb-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Confirmed Actual Event</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span>Revised / Delay Schedule</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
              <span>Planned Upcoming Milestone</span>
            </span>
          </div>

          {/* Chronological Vertical Timeline */}
          <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-700 space-y-8 my-4">
            {milestones.map((m) => {
              const isActual = m.isConfirmed && m.category === 'actual';
              const isRevised = m.category === 'revised';

              return (
                <div key={m.id} className="relative group">
                  
                  {/* Timeline Node Icon */}
                  <div className={`absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-[#132B4F] ${
                    isActual
                      ? 'bg-emerald-500 text-[#0D2240]'
                      : isRevised
                      ? 'bg-amber-400 text-[#0D2240]'
                      : 'bg-slate-700 text-slate-300'
                  }`}>
                    {isActual ? (
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : isRevised ? (
                      <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                    )}
                  </div>

                  {/* Milestone Card */}
                  <div className={`p-4 rounded-xl border text-xs space-y-1.5 transition-all ${
                    isActual 
                      ? 'bg-[#0D2240] border-slate-700 shadow-sm text-slate-200' 
                      : isRevised 
                      ? 'bg-amber-950/30 border-amber-500/40 shadow-sm text-amber-200' 
                      : 'bg-[#0A1A30]/60 border-slate-800 text-slate-400'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">{m.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          isActual 
                            ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300' 
                            : isRevised 
                            ? 'bg-amber-950/60 border border-amber-500/50 text-amber-300' 
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {isActual ? 'Confirmed Actual' : isRevised ? 'Schedule Revision' : 'Planned Milestone'}
                        </span>
                      </div>
                      <span className="font-mono text-xs font-semibold text-slate-300">
                        {m.eventDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span>{m.location}</span>
                    </div>

                    <p className="text-slate-300 leading-relaxed pt-1">
                      {m.description}
                    </p>

                    {m.originalDate && (
                      <p className="text-[11px] font-mono text-amber-300">
                        Original Planned Date: <span className="line-through text-slate-400">{m.originalDate}</span>
                      </p>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="bg-[#0A1A30] border-t border-slate-800 p-4 px-6 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>{milestones.length} logged journey events recorded for {currentShipment.bookingNumber}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#132B4F] hover:bg-[#1A3865] border border-slate-700 text-white font-medium transition-colors cursor-pointer"
          >
            Close Timeline
          </button>
        </div>

      </div>
    </div>
  );
};
