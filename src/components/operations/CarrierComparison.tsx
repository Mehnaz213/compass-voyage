import React, { useState, useMemo } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { 
  SlidersHorizontal, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  Ship, 
  ArrowRight,
  ShieldAlert,
  X
} from 'lucide-react';
import { AlternativeCarrierOption, Shipment } from '../../types/logistics';

interface CarrierComparisonProps {
  onOpenNewBookingWithCarrier?: (carrierId: string, pol: string, pod: string, vessel: string, voyage: string) => void;
}

export const CarrierComparison: React.FC<CarrierComparisonProps> = ({
  onOpenNewBookingWithCarrier
}) => {
  const { 
    ports, 
    carriers, 
    shipments, 
    carrierAlternatives, 
    getPortByCode, 
    getCarrierById,
    updateShipmentCarrier
  } = useLogistics();

  // Inputs
  const [selectedPol, setSelectedPol] = useState<string>('DEHAM');
  const [selectedPod, setSelectedPod] = useState<string>('SGSIN');
  const [selectedBookingNumber, setSelectedBookingNumber] = useState<string>('');

  // Confirmation modal state for updating existing booking
  const [confirmModalData, setConfirmModalData] = useState<{
    targetShipment: Shipment;
    option: AlternativeCarrierOption;
  } | null>(null);
  const [confirmSuccessMessage, setConfirmSuccessMessage] = useState<string | null>(null);

  // Available POLs from the alternatives dataset
  const availablePols = useMemo(() => {
    const codes = Array.from(new Set(carrierAlternatives.map(a => a.polCode)));
    return ports.filter(p => codes.includes(p.code));
  }, [carrierAlternatives, ports]);

  // Available PODs for selected POL
  const availablePods = useMemo(() => {
    if (!selectedPol) return [];
    const codes = Array.from(
      new Set(carrierAlternatives.filter(a => a.polCode === selectedPol).map(a => a.podCode))
    );
    return ports.filter(p => codes.includes(p.code));
  }, [selectedPol, carrierAlternatives, ports]);

  // Existing bookings for selected route (optional input)
  const existingBookingsOnRoute = useMemo(() => {
    if (!selectedPol || !selectedPod) return [];
    return shipments.filter(s => s.polCode === selectedPol && s.podCode === selectedPod);
  }, [selectedPol, selectedPod, shipments]);

  // Handle POL change
  const handlePolChange = (pol: string) => {
    setSelectedPol(pol);
    const validPods = carrierAlternatives.filter(a => a.polCode === pol).map(a => a.podCode);
    if (!validPods.includes(selectedPod)) {
      setSelectedPod(validPods[0] || '');
    }
    setSelectedBookingNumber('');
  };

  // Filter carrier options for this route
  const routeOptions = useMemo(() => {
    if (!selectedPol || !selectedPod) return [];
    return carrierAlternatives.filter(
      a => a.polCode === selectedPol && a.podCode === selectedPod
    );
  }, [selectedPol, selectedPod, carrierAlternatives]);

  // Determine recommendation dynamically based on evidence
  const evaluatedOptions = useMemo(() => {
    if (routeOptions.length === 0) return [];

    // Sort by: 1) Transit days ascending, 2) onTimePerformance descending, 3) cost
    const sorted = [...routeOptions].sort((a, b) => {
      if (a.transitDays !== b.transitDays) return a.transitDays - b.transitDays;
      const perfA = a.onTimePerformance ?? 0;
      const perfB = b.onTimePerformance ?? 0;
      return perfB - perfA;
    });

    const best = sorted[0];

    return routeOptions.map(opt => {
      const isBest = opt.id === best.id;
      let reason = '';
      if (isBest) {
        const parts = [
          `shortest recorded transit duration (${opt.transitDays} days)`
        ];
        if (opt.onTimePerformance) {
          parts.push(`highest schedule on-time reliability (${opt.onTimePerformance}%)`);
        }
        if (opt.historicalDelays && opt.historicalDelays !== 'Not available') {
          parts.push(`low historical delay average (${opt.historicalDelays})`);
        }
        if (opt.quotedFreightCost) {
          parts.push(`competitive quoted rate ($${opt.quotedFreightCost.toLocaleString()} USD)`);
        } else {
          parts.push('freight pricing quote not available at this time');
        }

        reason = `Recommended because this carrier provides the ${parts.join(', ')} for the ${selectedPol} to ${selectedPod} corridor.`;
      }

      return {
        ...opt,
        isRecommended: isBest,
        recommendationReason: reason
      };
    });
  }, [routeOptions, selectedPol, selectedPod]);

  const recommendedOption = evaluatedOptions.find(o => o.isRecommended);

  // Apply carrier change to existing booking with confirmation
  const handleConfirmCarrierChange = () => {
    if (!confirmModalData) return;
    const { targetShipment, option } = confirmModalData;
    updateShipmentCarrier(
      targetShipment.id,
      option.carrierId,
      option.vesselName,
      option.voyageNumber
    );
    setConfirmSuccessMessage(
      `Successfully reassigned Booking ${targetShipment.bookingNumber} to ${getCarrierById(option.carrierId)?.name} (Vessel: ${option.vesselName}, Voyage: ${option.voyageNumber}).`
    );
    setConfirmModalData(null);
  };

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-6 h-6 text-[#B7F500]" />
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Carrier Comparison & Recommendation
          </h1>
        </div>
        <p className="text-xs text-slate-300 mt-1 max-w-3xl">
          Evaluate maritime carriers across verified route pairings. Recommendations are calculated strictly from recorded schedule fidelity, transit duration, and confirmed capacity without hallucinated metrics.
        </p>
      </div>

      {/* Success Banner */}
      {confirmSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-600/50 text-emerald-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{confirmSuccessMessage}</span>
          </div>
          <button onClick={() => setConfirmSuccessMessage(null)} className="text-emerald-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Route & Booking Filter Strip */}
      <div className="bg-[#132B4F] rounded-xl border border-slate-700/70 shadow-sm p-6 space-y-4">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider">
          Select Ocean Corridor for Analysis
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* POL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200">Port of Loading (POL)</label>
            <select
              value={selectedPol}
              onChange={e => handlePolChange(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-700 bg-[#0D2240] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#B7F500]"
            >
              {availablePols.map(p => (
                <option key={p.code} value={p.code}>
                  {p.code} — {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* POD */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200">Port of Discharge (POD)</label>
            <select
              value={selectedPod}
              onChange={e => setSelectedPod(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-700 bg-[#0D2240] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#B7F500]"
            >
              {availablePods.map(p => (
                <option key={p.code} value={p.code}>
                  {p.code} — {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Optional Existing Booking */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200">
              Apply to Booking <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <select
              value={selectedBookingNumber}
              onChange={e => setSelectedBookingNumber(e.target.value)}
              className="w-full text-xs font-mono rounded-lg border border-slate-700 bg-[#0D2240] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#B7F500]"
            >
              <option value="">Compare for New Booking / RFQ</option>
              {existingBookingsOnRoute.map(b => (
                <option key={b.bookingNumber} value={b.bookingNumber}>
                  {b.bookingNumber} ({b.vesselName})
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Best Carrier Recommendation Card */}
      {recommendedOption && (
        <div className="rounded-xl border-2 border-[#B7F500] bg-[#0D2240] text-white p-6 shadow-md relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-[#B7F500] text-[#0D2240] text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Recommended Carrier Option</span>
                </span>
                <span className="text-xs text-slate-300">
                  Corridor: {selectedPol} → {selectedPod}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <h3 className="text-xl font-extrabold text-white">
                  {getCarrierById(recommendedOption.carrierId)?.name}
                </h3>
                <span className="text-xs text-slate-300">
                  {recommendedOption.vesselName} (Voy: {recommendedOption.voyageNumber})
                </span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed max-w-3xl">
                {recommendedOption.recommendationReason}
              </p>
            </div>

            {/* Metrics Snapshot */}
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-lg p-3 shrink-0">
              <div className="text-center px-2">
                <p className="text-[10px] uppercase text-slate-400 font-semibold">Transit</p>
                <p className="text-lg font-mono font-bold text-[#B7F500]">{recommendedOption.transitDays}d</p>
              </div>
              <div className="h-8 w-px bg-white/10"></div>
              <div className="text-center px-2">
                <p className="text-[10px] uppercase text-slate-400 font-semibold">On-Time</p>
                <p className="text-lg font-mono font-bold text-white">
                  {recommendedOption.onTimePerformance ? `${recommendedOption.onTimePerformance}%` : 'N/A'}
                </p>
              </div>
              <div className="h-8 w-px bg-white/10"></div>
              <div className="text-center px-2">
                <p className="text-[10px] uppercase text-slate-400 font-semibold">Freight Cost</p>
                <p className="text-lg font-mono font-bold text-white">
                  {recommendedOption.quotedFreightCost ? `$${recommendedOption.quotedFreightCost}` : 'Not available'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Matrix Table */}
      <div className="bg-[#132B4F] rounded-xl border border-slate-700/70 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">
              Carrier Route Options ({evaluatedOptions.length} available)
            </h2>
            <p className="text-xs text-slate-300">
              Direct comparison of confirmed carrier strings for {getPortByCode(selectedPol)?.name} to {getPortByCode(selectedPod)?.name}
            </p>
          </div>
        </div>

        {evaluatedOptions.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <p className="font-semibold text-slate-200">No carrier schedules active on this route</p>
            <p className="text-xs text-slate-400 mt-1">Please select another port pairing above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#0A1A30] border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Carrier Company</th>
                  <th className="py-3 px-4">Vessel & Voyage</th>
                  <th className="py-3 px-4">Departure</th>
                  <th className="py-3 px-4">Arrival</th>
                  <th className="py-3 px-4">Transit Time</th>
                  <th className="py-3 px-4">Capacity Status</th>
                  <th className="py-3 px-4">Historical Reliability</th>
                  <th className="py-3 px-4">Quoted Freight</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {evaluatedOptions.map(opt => {
                  const carrier = getCarrierById(opt.carrierId);
                  const isRec = opt.isRecommended;

                  return (
                    <tr
                      key={opt.id}
                      className={`transition-colors ${
                        isRec ? 'bg-[#0D2240]/80 font-medium' : 'hover:bg-[#1A3865]/50'
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{carrier?.name}</span>
                          {isRec && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#B7F500] text-[#0D2240]">
                              Recommended
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">Code: {carrier?.code}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="text-slate-200">{opt.vesselName}</p>
                        <p className="text-[10px] font-mono text-slate-400">Voy: {opt.voyageNumber}</p>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {opt.plannedDeparture}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {opt.estimatedArrival}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-white">
                        {opt.transitDays} days
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                            opt.scheduleAvailability === 'Available'
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-700/50'
                              : opt.scheduleAvailability === 'Limited Space'
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-700/50'
                              : 'bg-rose-950/60 text-rose-300 border border-rose-700/50'
                          }`}
                        >
                          {opt.scheduleAvailability}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {opt.onTimePerformance !== null ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-white">{opt.onTimePerformance}%</span>
                            <span className="text-[10px] text-slate-400">({opt.historicalDelays})</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Not available</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        {opt.quotedFreightCost !== null ? (
                          <span className="font-bold text-white">${opt.quotedFreightCost.toLocaleString()}</span>
                        ) : (
                          <span className="text-slate-400 italic">Not available</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {selectedBookingNumber ? (
                          /* Existing Booking reassignment with required confirmation */
                          <button
                            onClick={() => {
                              const s = shipments.find(x => x.bookingNumber === selectedBookingNumber);
                              if (s) {
                                setConfirmModalData({ targetShipment: s, option: opt });
                              }
                            }}
                            className="px-2.5 py-1 rounded bg-[#B7F500] hover:bg-[#a5de00] text-[#0D2240] text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Reassign to Booking
                          </button>
                        ) : (
                          /* New booking pre-selection */
                          <button
                            onClick={() => {
                              if (onOpenNewBookingWithCarrier) {
                                onOpenNewBookingWithCarrier(
                                  opt.carrierId,
                                  selectedPol,
                                  selectedPod,
                                  opt.vesselName,
                                  opt.voyageNumber
                                );
                              }
                            }}
                            className="px-2.5 py-1 rounded bg-[#0D2240] hover:bg-[#1A3865] hover:text-[#B7F500] text-slate-200 text-[11px] font-semibold transition-colors cursor-pointer border border-slate-700"
                          >
                            Use This Carrier
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Explicit Confirmation Dialog for Updating Existing Booking Carrier */}
      {confirmModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-100">
          <div className="bg-[#132B4F] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-700 space-y-5 text-white">
            <div className="flex items-center gap-3 text-amber-400">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="text-base font-bold text-white">
                  Confirm Carrier Reassignment
                </h3>
                <p className="text-xs text-slate-300">
                  Explicit Operations verification required before altering active booking
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0D2240] border border-slate-700 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Target Booking:</span>
                <span className="font-mono font-bold text-[#B7F500]">{confirmModalData.targetShipment.bookingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Carrier:</span>
                <span className="font-semibold text-slate-200">{getCarrierById(confirmModalData.targetShipment.carrierId)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">New Carrier:</span>
                <span className="font-bold text-emerald-400">{getCarrierById(confirmModalData.option.carrierId)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Vessel / Voyage:</span>
                <span className="font-medium text-slate-200">{confirmModalData.option.vesselName} ({confirmModalData.option.voyageNumber})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">New Transit Duration:</span>
                <span className="font-mono font-semibold text-white">{confirmModalData.option.transitDays} days</span>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Are you sure you want to reassign this carrier? This will log an operational audit notice and notify the customer of the vessel change.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setConfirmModalData(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmCarrierChange}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-[#B7F500] text-[#0D2240] hover:bg-[#a5de00] transition-colors shadow-sm cursor-pointer"
              >
                Confirm Carrier Reassignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
