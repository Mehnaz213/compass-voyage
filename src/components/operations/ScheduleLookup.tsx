import React, { useState, useMemo } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { 
  Compass, 
  Search, 
  ArrowRight, 
  AlertCircle, 
  Ship, 
  Calendar, 
  Clock, 
  Building2, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { Shipment, ShipmentStatus } from '../../types/logistics';

interface ScheduleLookupProps {
  onSelectShipmentJourney: (shipment: Shipment) => void;
}

export const ScheduleLookup: React.FC<ScheduleLookupProps> = ({ onSelectShipmentJourney }) => {
  const { 
    ports, 
    carriers, 
    shipments, 
    getPortByCode, 
    getCarrierById, 
    getCustomerById,
    searchSchedules,
    getMilestonesForShipment
  } = useLogistics();

  // State for the 4 dependent dropdowns
  const [selectedPol, setSelectedPol] = useState<string>('');
  const [selectedPod, setSelectedPod] = useState<string>('');
  const [selectedCarrier, setSelectedCarrier] = useState<string>('');
  const [selectedBooking, setSelectedBooking] = useState<string>('');

  // Result state
  const [searchExecuted, setSearchExecuted] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<Shipment | null>(null);

  // 1. POL options: All ports that appear as Port of Loading in active shipments
  const polOptions = useMemo(() => {
    const activePolCodes = new Set(shipments.map(s => s.polCode));
    return ports.filter(p => activePolCodes.has(p.code));
  }, [ports, shipments]);

  // 2. POD options: Ports that have shipments departing from selected POL
  const podOptions = useMemo(() => {
    if (!selectedPol) return [];
    const validPodCodes = new Set(
      shipments.filter(s => s.polCode === selectedPol).map(s => s.podCode)
    );
    return ports.filter(p => validPodCodes.has(p.code));
  }, [selectedPol, ports, shipments]);

  // 3. Carrier options: Carriers with shipments matching selected POL + POD
  const carrierOptions = useMemo(() => {
    if (!selectedPol || !selectedPod) return [];
    const validCarrierIds = new Set(
      shipments
        .filter(s => s.polCode === selectedPol && s.podCode === selectedPod)
        .map(s => s.carrierId)
    );
    return carriers.filter(c => validCarrierIds.has(c.id));
  }, [selectedPol, selectedPod, carriers, shipments]);

  // 4. Booking Number options: Bookings matching selected POL + POD + Carrier
  const bookingOptions = useMemo(() => {
    if (!selectedPol || !selectedPod || !selectedCarrier) return [];
    return shipments
      .filter(
        s => s.polCode === selectedPol && 
             s.podCode === selectedPod && 
             s.carrierId === selectedCarrier
      )
      .map(s => s.bookingNumber)
      .sort();
  }, [selectedPol, selectedPod, selectedCarrier, shipments]);

  // Dependent cascading change handlers
  const handlePolChange = (newPol: string) => {
    setSelectedPol(newPol);
    // Invalidate downstream dependent selections
    setSelectedPod('');
    setSelectedCarrier('');
    setSelectedBooking('');
    setSearchExecuted(false);
    setSearchResult(null);
  };

  const handlePodChange = (newPod: string) => {
    setSelectedPod(newPod);
    // Invalidate downstream dependent selections
    setSelectedCarrier('');
    setSelectedBooking('');
    setSearchExecuted(false);
    setSearchResult(null);
  };

  const handleCarrierChange = (newCarrier: string) => {
    setSelectedCarrier(newCarrier);
    // Invalidate downstream booking
    setSelectedBooking('');
    setSearchExecuted(false);
    setSearchResult(null);
  };

  const handleBookingChange = (newBooking: string) => {
    setSelectedBooking(newBooking);
    setSearchExecuted(false);
    setSearchResult(null);
  };

  const handleReset = () => {
    setSelectedPol('');
    setSelectedPod('');
    setSelectedCarrier('');
    setSelectedBooking('');
    setSearchExecuted(false);
    setSearchResult(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPol || !selectedPod || !selectedCarrier || !selectedBooking) {
      return;
    }
    const match = searchSchedules(selectedPol, selectedPod, selectedCarrier, selectedBooking);
    setSearchResult(match);
    setSearchExecuted(true);
  };

  const polObj = getPortByCode(selectedPol);
  const podObj = getPortByCode(selectedPod);
  const carrierObj = getCarrierById(selectedCarrier);

  const getStatusBadge = (status: ShipmentStatus) => {
    switch (status) {
      case 'IN_TRANSIT':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">In Transit</span>;
      case 'DELAYED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">Delayed</span>;
      case 'ARRIVING_SOON':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Arriving Soon</span>;
      case 'BOOKING_CONFIRMED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">Booking Confirmed</span>;
      case 'DELIVERED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-800">Delivered</span>;
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2">
          <Compass className="w-6 h-6 text-[#B7F500]" />
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Transportation Schedule Lookup
          </h1>
        </div>
        <p className="text-xs text-slate-300 mt-1 max-w-3xl">
          Identify an exact shipment and verify its active maritime transport schedule. All four inputs (POL → POD → Carrier → Booking Number) are strictly validated in sequence to eliminate stale combinations.
        </p>
      </div>

      {/* The 4-Dropdown Dependent Form Card */}
      <div className="bg-[#132B4F] rounded-xl border border-slate-700/70 shadow-sm p-6 sm:p-7 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Cascading Schedule Filter
          </h2>
          {(selectedPol || selectedPod || selectedCarrier || selectedBooking) && (
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Selections</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Port of Loading (POL) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#B7F500] text-[#0D2240] flex items-center justify-center text-[10px] font-bold">1</span>
                <span>Port of Loading (POL)</span>
              </label>
              <select
                value={selectedPol}
                onChange={e => handlePolChange(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-700 bg-[#0D2240] px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#B7F500] focus:border-transparent transition-all"
              >
                <option value="">Select Port of Loading...</option>
                {polOptions.map(p => (
                  <option key={p.code} value={p.code}>
                    {p.code} — {p.name} ({p.country})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400">Origin port code & facility</p>
            </div>

            {/* 2. Port of Discharge (POD) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${selectedPol ? 'bg-[#B7F500] text-[#0D2240]' : 'bg-slate-700 text-slate-400'}`}>2</span>
                <span>Port of Discharge (POD)</span>
              </label>
              <select
                value={selectedPod}
                onChange={e => handlePodChange(e.target.value)}
                disabled={!selectedPol}
                className="w-full text-xs rounded-lg border border-slate-700 bg-[#0D2240] px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#B7F500] focus:border-transparent disabled:bg-[#09172A] disabled:text-slate-500 disabled:cursor-not-allowed transition-all"
              >
                <option value="">
                  {selectedPol ? 'Select Port of Discharge...' : 'Waiting for POL...'}
                </option>
                {podOptions.map(p => (
                  <option key={p.code} value={p.code}>
                    {p.code} — {p.name} ({p.country})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400">
                {selectedPol ? `${podOptions.length} destination ports available` : 'Requires POL first'}
              </p>
            </div>

            {/* 3. Carrier Company */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${selectedPod ? 'bg-[#B7F500] text-[#0D2240]' : 'bg-slate-700 text-slate-400'}`}>3</span>
                <span>Carrier Company</span>
              </label>
              <select
                value={selectedCarrier}
                onChange={e => handleCarrierChange(e.target.value)}
                disabled={!selectedPod}
                className="w-full text-xs rounded-lg border border-slate-700 bg-[#0D2240] px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#B7F500] focus:border-transparent disabled:bg-[#09172A] disabled:text-slate-500 disabled:cursor-not-allowed transition-all"
              >
                <option value="">
                  {selectedPod ? 'Select Carrier Company...' : 'Waiting for Route...'}
                </option>
                {carrierOptions.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400">
                {selectedPod ? `${carrierOptions.length} carriers active on route` : 'Requires POL & POD'}
              </p>
            </div>

            {/* 4. Booking Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${selectedCarrier ? 'bg-[#B7F500] text-[#0D2240]' : 'bg-slate-700 text-slate-400'}`}>4</span>
                <span>Booking Number</span>
              </label>
              <select
                value={selectedBooking}
                onChange={e => handleBookingChange(e.target.value)}
                disabled={!selectedCarrier}
                className="w-full text-xs font-mono rounded-lg border border-slate-700 bg-[#0D2240] px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#B7F500] focus:border-transparent disabled:bg-[#09172A] disabled:text-slate-500 disabled:cursor-not-allowed transition-all"
              >
                <option value="">
                  {selectedCarrier ? 'Select Booking Number...' : 'Waiting for Carrier...'}
                </option>
                {bookingOptions.map(b => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400">
                {selectedCarrier ? `${bookingOptions.length} bookings match route & carrier` : 'Requires Carrier first'}
              </p>
            </div>

          </div>

          {/* Search Button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={!selectedPol || !selectedPod || !selectedCarrier || !selectedBooking}
              className="py-2.5 px-6 rounded-lg bg-[#B7F500] hover:bg-[#a5de00] text-[#0D2240] font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#0D2240]" />
              <span>Search Shipment Schedule</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results View */}
      {searchExecuted && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {!searchResult ? (
            /* Mandatory No-Match Exact Warning Message */
            <div className="p-6 rounded-xl bg-amber-950/40 border border-amber-600/50 text-amber-200 flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm">No exact shipment schedule found</h3>
                <p className="text-xs text-amber-300 mt-1">
                  No shipment schedule matches all the selected criteria. Please review your selections.
                </p>
              </div>
            </div>
          ) : (
            /* Comprehensive Exact Shipment Details Display */
            <div className="bg-[#132B4F] rounded-xl border border-slate-700/70 shadow-md overflow-hidden">
              
              {/* Header Strip */}
              <div className="bg-[#0A1A30] text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-extrabold text-[#B7F500] tracking-wider">
                    {searchResult.bookingNumber}
                  </span>
                  <span className="text-slate-500">|</span>
                  <span className="text-xs font-semibold text-slate-200">
                    {carrierObj?.name}
                  </span>
                </div>
                <div>{getStatusBadge(searchResult.status)}</div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Route Header Banner */}
                <div className="p-4 rounded-xl bg-[#0D2240] border border-slate-700/60 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Origin (POL)</p>
                    <p className="text-base font-extrabold text-white">{searchResult.polCode}</p>
                    <p className="text-xs text-slate-300">{polObj?.name}</p>
                    <p className="text-[11px] text-slate-400">{polObj?.terminal}</p>
                  </div>

                  <div className="flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-mono font-medium text-slate-400">Direct Ocean Transit</span>
                    <div className="w-full flex items-center gap-2 my-1">
                      <div className="h-0.5 flex-1 bg-slate-700"></div>
                      <Ship className="w-4 h-4 text-[#B7F500]" />
                      <div className="h-0.5 flex-1 bg-slate-700"></div>
                    </div>
                    <span className="text-xs font-semibold text-slate-200">{searchResult.vesselName}</span>
                    <span className="text-[10px] font-mono text-slate-400">Voy: {searchResult.voyageNumber}</span>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Destination (POD)</p>
                    <p className="text-base font-extrabold text-white">{searchResult.podCode}</p>
                    <p className="text-xs text-slate-300">{podObj?.name}</p>
                    <p className="text-[11px] text-slate-400">{podObj?.terminal}</p>
                  </div>
                </div>

                {/* Key Details Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  
                  {/* Customer / Consignee */}
                  <div className="p-3.5 rounded-lg border border-slate-700/60 bg-[#0D2240]">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Consignee Account</span>
                    </span>
                    <p className="text-xs font-bold text-white mt-1">
                      {getCustomerById(searchResult.customerId)?.companyName || 'Operational Booking'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {getCustomerById(searchResult.customerId)?.name || 'Direct Freight Assignment'}
                    </p>
                  </div>

                  {/* Containers & Cargo */}
                  <div className="p-3.5 rounded-lg border border-slate-700/60 bg-[#0D2240]">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>Equipment & Cargo</span>
                    </span>
                    <p className="text-xs font-bold text-white mt-1">
                      {searchResult.containerCount}x {searchResult.containerType}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate" title={searchResult.cargoDescription}>
                      {searchResult.cargoDescription}
                    </p>
                  </div>

                  {/* Estimated Departure */}
                  <div className="p-3.5 rounded-lg border border-slate-700/60 bg-[#0D2240]">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Departure Date</span>
                    </span>
                    <p className="text-xs font-bold text-white mt-1 font-mono">
                      {searchResult.estimatedDeparture}
                    </p>
                    <p className="text-[10px] text-emerald-400 mt-0.5">
                      {searchResult.actualDeparture ? `Departed: ${searchResult.actualDeparture}` : 'Scheduled'}
                    </p>
                  </div>

                  {/* Estimated Arrival / Revised ETA */}
                  <div className="p-3.5 rounded-lg border border-slate-700/60 bg-[#0D2240]">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Estimated Arrival</span>
                    </span>
                    {searchResult.revisedEta ? (
                      <div>
                        <p className="text-xs font-bold text-amber-400 font-mono mt-1">
                          {searchResult.revisedEta} (Revised)
                        </p>
                        <p className="text-[10px] text-slate-400 line-through">
                          Orig: {searchResult.estimatedArrival}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs font-bold text-white mt-1 font-mono">
                        {searchResult.estimatedArrival}
                      </p>
                    )}
                  </div>

                </div>

                {/* Delay Notice Banner if Delayed */}
                {searchResult.status === 'DELAYED' && (
                  <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/50 text-xs text-amber-200 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-amber-300">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Active Delay Notice: +{searchResult.delayDurationDays || 3} Days Recorded</span>
                    </div>
                    <p className="text-amber-200">
                      Reason: {searchResult.delayReason || 'Weather disruption or terminal congestion'}
                    </p>
                  </div>
                )}

                {/* Milestones Preview */}
                <div className="border-t border-slate-700/80 pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Recorded Transportation Milestones ({getMilestonesForShipment(searchResult.id).length})
                    </h3>
                    <span className="text-[11px] text-slate-400">Live operational events</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {getMilestonesForShipment(searchResult.id).slice(0, 3).map(m => (
                      <div key={m.id} className="p-3 rounded-lg border border-slate-700/60 bg-[#0D2240] text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200">{m.title}</span>
                          {m.isConfirmed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <span className="text-[10px] text-slate-400">Planned</span>
                          )}
                        </div>
                        <p className="text-[11px] font-mono text-slate-400 mt-0.5">{m.eventDate} · {m.location}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Primary Action: View Full Journey Timeline */}
                <div className="pt-4 border-t border-slate-700/80 flex items-center justify-end">
                  <button
                    onClick={() => onSelectShipmentJourney(searchResult)}
                    className="py-2.5 px-5 rounded-lg bg-[#B7F500] hover:bg-[#a5de00] text-[#0D2240] text-xs font-bold transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <span>View Shipment Journey Timeline</span>
                    <ArrowRight className="w-4 h-4 text-[#0D2240]" />
                  </button>
                </div>

              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
};
