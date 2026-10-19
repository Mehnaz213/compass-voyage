import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  RotateCcw,
  Ship,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Anchor,
  Filter,
  Check,
  MapPin,
  TrendingUp,
  Award,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { localDb } from '../services/storage';
import type { Port, Shipment, Schedule, CarrierScheduleOption } from '../types';

interface ScheduleLookupPageProps {
  onSelectShipment: (shipmentId: string) => void;
}

export const ScheduleLookupPage: React.FC<ScheduleLookupPageProps> = ({ onSelectShipment }) => {
  const [ports, setPorts] = useState<Port[]>([]);

  // 4 STRICT REQUIRED DROPDOWNS:
  // 1. Port of Loading (POL)
  // 2. Port of Discharge (POD)
  // 3. Carrier company
  // 4. Booking number
  const [pol, setPol] = useState('CNSHA');
  const [pod, setPod] = useState('USLAX');
  const [selectedCarrier, setSelectedCarrier] = useState('Maersk Line');
  const [selectedBooking, setSelectedBooking] = useState('CV-900001');

  // Dynamic Options for Cascading Dropdowns
  const [availablePods, setAvailablePods] = useState<Port[]>([]);
  const [availableCarriers, setAvailableCarriers] = useState<string[]>([]);
  const [availableBookings, setAvailableBookings] = useState<string[]>([]);

  // Identified Shipment Data
  const [identifiedShipment, setIdentifiedShipment] = useState<Shipment | null>(null);
  const [shipmentSchedules, setShipmentSchedules] = useState<Schedule[]>([]);

  // Carrier Comparison Data
  const [carrierOptions, setCarrierOptions] = useState<CarrierScheduleOption[]>([]);
  const [recommendedCarrierId, setRecommendedCarrierId] = useState<string | null>(null);
  const [recommendationReason, setRecommendationReason] = useState<string>('');
  const [comparisonSort, setComparisonSort] = useState<'all' | 'transit' | 'reliability' | 'cost' | 'direct'>('all');

  // Initialize Ports on mount
  useEffect(() => {
    const loadedPorts = localDb.getPorts();
    setPorts(loadedPorts);
  }, []);

  // Update POD options whenever POL changes
  useEffect(() => {
    if (!pol) {
      setAvailablePods([]);
      setPod('');
      setSelectedCarrier('');
      setSelectedBooking('');
      return;
    }
    const pods = localDb.getValidPodsForPol(pol);
    const validPods = pods.length > 0 ? pods : ports.filter((p) => p.code !== pol);
    setAvailablePods(validPods);

    if (pod && !validPods.some((p) => p.code === pod)) {
      if (validPods.length > 0) {
        setPod(validPods[0].code);
      } else {
        setPod('');
      }
    }
  }, [pol, ports]);

  // Update Carrier options & Carrier Comparison whenever POL or POD changes
  useEffect(() => {
    if (!pol || !pod) {
      setAvailableCarriers([]);
      setSelectedCarrier('');
      setSelectedBooking('');
      setCarrierOptions([]);
      setRecommendedCarrierId(null);
      setRecommendationReason('');
      return;
    }

    const carriersOnRoute = localDb.getCarriersForRoute(pol, pod);
    setAvailableCarriers(carriersOnRoute);

    if (selectedCarrier && !carriersOnRoute.includes(selectedCarrier)) {
      setSelectedCarrier(carriersOnRoute[0] || '');
    }

    const comparison = localDb.getCarrierComparison(pol, pod, selectedBooking);
    setCarrierOptions(comparison.carrierOptions);
    setRecommendedCarrierId(comparison.recommendedCarrierId);
    setRecommendationReason(comparison.recommendationReason);
  }, [pol, pod]);

  // Update Booking Number dropdown whenever POL, POD, or Carrier changes
  useEffect(() => {
    if (!pol || !pod || !selectedCarrier) {
      setAvailableBookings([]);
      setSelectedBooking('');
      setIdentifiedShipment(null);
      setShipmentSchedules([]);
      return;
    }
    const bookings = localDb.getBookingsForRouteAndCarrier(pol, pod, selectedCarrier);
    setAvailableBookings(bookings);

    if (selectedBooking && !bookings.includes(selectedBooking)) {
      if (bookings.length > 0) {
        setSelectedBooking(bookings[0]);
      } else {
        setSelectedBooking('');
      }
    } else if (!selectedBooking && bookings.length > 0) {
      setSelectedBooking(bookings[0]);
    }
  }, [pol, pod, selectedCarrier]);

  // Identify shipment whenever selectedBooking changes
  useEffect(() => {
    if (!selectedBooking) {
      setIdentifiedShipment(null);
      setShipmentSchedules([]);
      return;
    }
    const matched = localDb.lookupExactShipment(pol, pod, selectedCarrier, selectedBooking);
    if (matched) {
      setIdentifiedShipment(matched.shipment);
      setShipmentSchedules(matched.schedules);
    } else {
      const byId = localDb.getShipmentById(selectedBooking);
      if (byId) {
        setIdentifiedShipment(byId.shipment);
        setShipmentSchedules(byId.schedules);
      } else {
        setIdentifiedShipment(null);
        setShipmentSchedules([]);
      }
    }
  }, [selectedBooking, pol, pod, selectedCarrier]);

  const handleApplyPreset = (presetPol: string, presetPod: string, presetCarrier?: string, presetBooking?: string) => {
    setPol(presetPol);
    setPod(presetPod);
    if (presetCarrier) {
      setSelectedCarrier(presetCarrier);
    }
    if (presetBooking) {
      setSelectedBooking(presetBooking);
    }
  };

  const handleClear = () => {
    setPol('');
    setPod('');
    setSelectedCarrier('');
    setSelectedBooking('');
    setIdentifiedShipment(null);
    setShipmentSchedules([]);
    setCarrierOptions([]);
  };

  const getSortedCarrierOptions = () => {
    const list = [...carrierOptions];
    if (comparisonSort === 'transit') {
      return list.sort((a, b) => a.transit_days - b.transit_days);
    }
    if (comparisonSort === 'reliability') {
      return list.sort((a, b) => (b.reliability_score ?? 0) - (a.reliability_score ?? 0));
    }
    if (comparisonSort === 'cost') {
      return list.sort((a, b) => (a.quoted_cost_usd ?? Infinity) - (b.quoted_cost_usd ?? Infinity));
    }
    if (comparisonSort === 'direct') {
      return list.filter((o) => o.service_type.includes('Direct'));
    }
    return list;
  };

  const sortedCarriers = getSortedCarrierOptions();

  return (
    <div className="space-y-6 relative">
      {/* Background radial glow */}
      <div className="absolute -top-10 left-1/3 w-96 h-96 bg-[#B7F500]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Title */}
      <div className="pb-2 border-b border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#B7F500]/15 text-[#B7F500] border border-[#B7F500]/30 shadow-md">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Transportation Schedule Lookup</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#B7F500] text-[#0D2240]">
                  Essential Feature
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Operations multi-variable schedule finder & comparative ocean carrier intelligence matrix.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="px-3.5 py-2 rounded-xl bg-[#081426] hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition self-start md:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Dropdowns</span>
          </button>
        </div>
      </div>

      {/* Lookup Control Panel with 4 STRICT DROPDOWNS */}
      <div className="p-6 bg-[#0D2240] border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md space-y-5">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 mb-1">
            <Filter className="w-3.5 h-3.5 text-[#B7F500]" />
            <span>Identify Shipment Via 4 Cascading Dropdowns</span>
          </h2>
          <p className="text-xs text-slate-400">
            Select Port of Loading (POL), Port of Discharge (POD), Carrier Company, and Booking Number to pinpoint verified vessel schedules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Port of Loading (POL) Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Anchor className="w-3.5 h-3.5 text-[#B7F500]" />
              <span>1. Port of Loading (POL) *</span>
            </label>
            <select
              value={pol}
              onChange={(e) => setPol(e.target.value)}
              className="w-full bg-[#081426] border border-slate-700 focus:border-[#B7F500] text-white rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none transition"
            >
              <option value="">-- Select Origin Port (POL) --</option>
              {ports.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.code} - {p.name} ({p.country})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Port of Discharge (POD) Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>2. Port of Discharge (POD) *</span>
            </label>
            <select
              value={pod}
              onChange={(e) => setPod(e.target.value)}
              disabled={!pol}
              className={`w-full border rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none transition ${
                !pol
                  ? 'bg-[#060e1b] border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-[#081426] border-slate-700 focus:border-[#B7F500] text-white'
              }`}
            >
              <option value="">
                {!pol ? '-- Select POL First --' : '-- Select Destination Port (POD) --'}
              </option>
              {availablePods.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.code} - {p.name} ({p.country})
                </option>
              ))}
            </select>
          </div>

          {/* 3. Carrier Company Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Ship className="w-3.5 h-3.5 text-[#B7F500]" />
              <span>3. Carrier Company *</span>
            </label>
            <select
              value={selectedCarrier}
              onChange={(e) => setSelectedCarrier(e.target.value)}
              disabled={!pol || !pod}
              className={`w-full border rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none transition ${
                !pol || !pod
                  ? 'bg-[#060e1b] border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-[#081426] border-slate-700 focus:border-[#B7F500] text-white'
              }`}
            >
              <option value="">
                {!pol || !pod
                  ? '-- Select POL & POD First --'
                  : availableCarriers.length === 0
                  ? '-- No Carriers Found on Route --'
                  : '-- Select Carrier Company --'}
              </option>
              {availableCarriers.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Booking Number Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#B7F500]" />
              <span>4. Booking Number *</span>
            </label>
            <select
              value={selectedBooking}
              onChange={(e) => setSelectedBooking(e.target.value)}
              disabled={!selectedCarrier}
              className={`w-full border rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-none transition ${
                !selectedCarrier
                  ? 'bg-[#060e1b] border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-[#081426] border-slate-700 focus:border-[#B7F500] text-[#B7F500]'
              }`}
            >
              <option value="">
                {!selectedCarrier
                  ? '-- Select Carrier First --'
                  : availableBookings.length === 0
                  ? '-- No Active Bookings for Carrier --'
                  : '-- Select Booking Number --'}
              </option>
              {availableBookings.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Corridor Quick Presets */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 flex-wrap text-xs text-slate-400">
          <span className="font-semibold text-slate-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-[#B7F500]" /> Quick Corridors:
          </span>
          <button
            type="button"
            onClick={() => handleApplyPreset('CNSHA', 'USLAX', 'Maersk Line', 'CV-900001')}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition ${
              pol === 'CNSHA' && pod === 'USLAX'
                ? 'bg-[#B7F500]/20 text-[#B7F500] border-[#B7F500]/40 font-bold'
                : 'bg-[#081426] hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            Shanghai (CNSHA) → Los Angeles (USLAX)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('SGSIN', 'NLRTM', 'Maersk Line', 'CV-900013')}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition ${
              pol === 'SGSIN' && pod === 'NLRTM'
                ? 'bg-[#B7F500]/20 text-[#B7F500] border-[#B7F500]/40 font-bold'
                : 'bg-[#081426] hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            Singapore (SGSIN) → Rotterdam (NLRTM)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('CNNGB', 'USNYC', 'Hapag-Lloyd', 'CV-900015')}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition ${
              pol === 'CNNGB' && pod === 'USNYC'
                ? 'bg-[#B7F500]/20 text-[#B7F500] border-[#B7F500]/40 font-bold'
                : 'bg-[#081426] hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            Ningbo (CNNGB) → New York (USNYC)
          </button>
        </div>
      </div>

      {/* SECTION 1: IDENTIFIED SHIPMENT SCHEDULE MANIFEST */}
      {identifiedShipment && (
        <div className="bg-[#0D2240] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="p-5 md:p-6 bg-[#081426] border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#B7F500]/15 text-[#B7F500] border border-[#B7F500]/30 shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs uppercase font-bold text-slate-400">Identified Shipment:</span>
                  <span className="font-mono text-xl font-black text-white tracking-wide">
                    {identifiedShipment.booking_id}
                  </span>
                  <StatusBadge status={identifiedShipment.status} delayDays={identifiedShipment.delay_days} size="md" />
                </div>
                <div className="text-xs text-slate-300 mt-1 flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-white">{identifiedShipment.carrier}</span>
                  <span className="text-slate-600">•</span>
                  <span className="italic text-slate-300">Vessel: {identifiedShipment.vessel}</span>
                  <span className="text-slate-600">•</span>
                  <span className="font-mono text-slate-400">Voyage: {identifiedShipment.voyage_number}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onSelectShipment(identifiedShipment.id)}
              className="px-5 py-2.5 rounded-xl bg-[#B7F500] hover:bg-[#a3dc00] text-[#0D2240] font-extrabold text-xs transition flex items-center gap-2 shadow-lg shadow-[#B7F500]/10 shrink-0"
            >
              <span>Open Full Shipment Journey</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Delay advisory if delay exists */}
            {identifiedShipment.delay_days > 0 && (
              <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <span className="font-bold text-white">Operational Schedule Delay (+{identifiedShipment.delay_days} Days): </span>
                  <span>{identifiedShipment.delay_reason || 'Berth congestion and transshipment port advisory.'}</span>
                  <span className="ml-2 font-mono text-amber-300 font-bold">
                    Revised ETA: {new Date(identifiedShipment.revised_estimated_arrival_date!).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            {/* Corridor & Specs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#081426] border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B7F500]">Origin (POL)</span>
                <div className="text-base font-bold text-white">{identifiedShipment.origin_code}</div>
                <div className="text-slate-300">{identifiedShipment.origin}</div>
                <div className="text-[11px] text-slate-400 pt-1">
                  ETD: <strong className="text-white">{new Date(identifiedShipment.estimated_departure_date).toLocaleDateString()}</strong>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#081426] border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Destination (POD)</span>
                <div className="text-base font-bold text-white">{identifiedShipment.destination_code}</div>
                <div className="text-slate-300">{identifiedShipment.destination}</div>
                <div className="text-[11px] text-slate-400 pt-1">
                  ETA: <strong className="text-white">
                    {new Date(identifiedShipment.revised_estimated_arrival_date || identifiedShipment.estimated_arrival_date).toLocaleDateString()}
                  </strong>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#081426] border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Consignee Client</span>
                <div className="text-sm font-bold text-white truncate">{identifiedShipment.customer_company}</div>
                <div className="text-slate-300 truncate">{identifiedShipment.customer_name}</div>
                <div className="text-[11px] text-slate-400 truncate">{identifiedShipment.customer_email}</div>
              </div>

              <div className="p-4 rounded-xl bg-[#081426] border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Containers & Cargo</span>
                <div className="text-sm font-bold text-white">{identifiedShipment.container_count}x {identifiedShipment.container_type}</div>
                <div className="text-slate-300 truncate">{identifiedShipment.cargo_description}</div>
                <div className="text-[11px] text-[#B7F500]">Progress: {identifiedShipment.progress}% complete</div>
              </div>
            </div>

            {/* Complete Milestone Schedule Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-[#B7F500]" />
                  <span>Voyage Milestone Schedule Timeline</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  {shipmentSchedules.length} Milestones Logged
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#081426]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#060e1b] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Milestone</th>
                      <th className="py-3 px-4">Planned Date</th>
                      <th className="py-3 px-4">Revised Date</th>
                      <th className="py-3 px-4">Actual / Verified</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Notes / Vessel Rotation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-200">
                    {shipmentSchedules.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-6 text-slate-400">
                          No milestone records found for this shipment.
                        </td>
                      </tr>
                    ) : (
                      shipmentSchedules.map((sch) => (
                        <tr key={sch.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#B7F500]" />
                            <span>{sch.milestone}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                            {new Date(sch.planned_date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px]">
                            {sch.revised_date ? (
                              <span className="text-amber-300 font-semibold">
                                {new Date(sch.revised_date).toLocaleDateString()}
                              </span>
                            ) : (
                              <span className="text-slate-500">—</span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px]">
                            {sch.actual_date ? (
                              <span className="text-emerald-400 font-semibold">
                                {new Date(sch.actual_date).toLocaleDateString()}
                              </span>
                            ) : (
                              <span className="text-slate-500">Pending</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                sch.status === 'Completed'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                  : sch.status === 'Delayed'
                                  ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                                  : sch.status === 'In Progress'
                                  ? 'bg-[#B7F500]/20 text-[#B7F500] border border-[#B7F500]/40'
                                  : 'bg-slate-900 text-slate-500 border border-slate-800'
                              }`}
                            >
                              {sch.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-300 truncate max-w-[220px]">
                            {sch.notes || `${identifiedShipment.carrier} rotation`}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: CARRIER CORRIDOR COMPARISON & RECOMMENDATION MATRIX */}
      {pol && pod && (
        <div className="bg-[#0D2240] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl space-y-6 p-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#B7F500]/15 text-[#B7F500]">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-white text-base">
                  Carrier Corridor Comparison & Recommendation Matrix: {pol} → {pod}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Comparative transit times, schedule reliability percentages, sailing frequencies, and quoted freight rates for {carrierOptions.length} carrier services.
              </p>
            </div>

            {/* Sort/Filter Tabs */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <button
                type="button"
                onClick={() => setComparisonSort('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition border ${
                  comparisonSort === 'all'
                    ? 'bg-[#B7F500] text-[#0D2240] border-[#B7F500]'
                    : 'bg-[#081426] text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                All Carriers ({carrierOptions.length})
              </button>
              <button
                type="button"
                onClick={() => setComparisonSort('transit')}
                className={`px-3 py-1.5 rounded-xl font-bold transition border ${
                  comparisonSort === 'transit'
                    ? 'bg-[#B7F500] text-[#0D2240] border-[#B7F500]'
                    : 'bg-[#081426] text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                Fastest Transit
              </button>
              <button
                type="button"
                onClick={() => setComparisonSort('reliability')}
                className={`px-3 py-1.5 rounded-xl font-bold transition border ${
                  comparisonSort === 'reliability'
                    ? 'bg-[#B7F500] text-[#0D2240] border-[#B7F500]'
                    : 'bg-[#081426] text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                Highest Reliability
              </button>
              <button
                type="button"
                onClick={() => setComparisonSort('cost')}
                className={`px-3 py-1.5 rounded-xl font-bold transition border ${
                  comparisonSort === 'cost'
                    ? 'bg-[#B7F500] text-[#0D2240] border-[#B7F500]'
                    : 'bg-[#081426] text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                Best Freight Rate
              </button>
            </div>
          </div>

          {/* Algorithm Recommended Choice Banner */}
          {recommendedCarrierId && recommendationReason && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#12315E] to-[#0A1A30] border border-[#B7F500]/40 shadow-xl flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#B7F500] text-[#0D2240] shrink-0 mt-0.5">
                <Award className="w-5 h-5 font-bold" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#B7F500]">
                    ★ Recommended Carrier Choice
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#B7F500]/20 text-[#B7F500] border border-[#B7F500]/40">
                    Optimal Performance Matrix
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {recommendationReason}
                </p>
              </div>
            </div>
          )}

          {/* Carrier Options Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedCarriers.map((opt) => {
              const isRecommended = opt.id === recommendedCarrierId;
              const isSelected = selectedCarrier.toLowerCase() === opt.carrier.toLowerCase();

              return (
                <div
                  key={opt.id}
                  className={`p-5 rounded-2xl border transition relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#081426] border-[#B7F500] shadow-xl shadow-[#B7F500]/10'
                      : isRecommended
                      ? 'bg-[#081426] border-[#B7F500]/50 hover:border-[#B7F500]'
                      : 'bg-[#081426]/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-sm text-white">{opt.carrier}</h4>
                          {isRecommended && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-[#B7F500] text-[#0D2240] uppercase">
                              Top Pick
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 italic">
                          {opt.vessel} ({opt.voyage_number})
                        </div>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          opt.service_type === 'Direct Express'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {opt.service_type}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Transit Time</span>
                        <div className="text-base font-extrabold text-white mt-0.5">
                          {opt.transit_days} <span className="text-xs font-normal text-slate-400">Days</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">On-Time Reliability</span>
                        <div className="text-base font-extrabold text-emerald-400 mt-0.5">
                          {opt.reliability_score ? `${opt.reliability_score}%` : 'Pending'}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Quoted Freight Rate</span>
                        <div className="text-sm font-bold text-white mt-0.5">
                          {opt.quoted_cost_usd ? `$${opt.quoted_cost_usd.toLocaleString()}` : 'Upon Quotation'}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Frequency</span>
                        <div className="text-xs font-semibold text-slate-200 mt-0.5 truncate">{opt.frequency}</div>
                      </div>
                    </div>

                    {/* Notes */}
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {opt.notes}
                    </p>
                  </div>

                  {/* Action button to select this carrier */}
                  <div className="pt-4 mt-3 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCarrier(opt.carrier);
                      }}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#B7F500] text-[#0D2240] shadow-md shadow-[#B7F500]/10'
                          : 'bg-[#060e1b] hover:bg-[#B7F500]/20 text-slate-200 hover:text-white border border-slate-700'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Selected in Dropdown 3</span>
                        </>
                      ) : (
                        <>
                          <span>Select {opt.carrier}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
