import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { X, PlusCircle, Ship, Calendar, Building2, Package } from 'lucide-react';

interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCarrierId?: string;
  initialPol?: string;
  initialPod?: string;
  initialVessel?: string;
  initialVoyage?: string;
}

export const NewBookingModal: React.FC<NewBookingModalProps> = ({
  isOpen,
  onClose,
  initialCarrierId,
  initialPol,
  initialPod,
  initialVessel,
  initialVoyage
}) => {
  const { ports, carriers, customers, shipments, createBooking } = useLogistics();

  // Next booking number sequence
  const nextSeq = 900000 + shipments.length + 1;
  const autoBookingNumber = `CV-${nextSeq}`;

  const [bookingNumber, setBookingNumber] = useState(autoBookingNumber);
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || 'cust_1');
  const [selectedCarrierId, setSelectedCarrierId] = useState(initialCarrierId || carriers[0]?.id || 'carr_1');
  const [polCode, setPolCode] = useState(initialPol || 'DEHAM');
  const [podCode, setPodCode] = useState(initialPod || 'SGSIN');
  const [vesselName, setVesselName] = useState(initialVessel || 'Compass Voyager');
  const [voyageNumber, setVoyageNumber] = useState(initialVoyage || 'CV-2645E');
  const [containerCount, setContainerCount] = useState<number>(4);
  const [containerType, setContainerType] = useState('40\' High Cube Dry');
  const [cargoDescription, setCargoDescription] = useState('Automotive Electronic Sensors & Components');
  const [cargoWeightKg, setCargoWeightKg] = useState<number>(45000);
  
  const today = new Date('2026-10-19T00:00:00Z');
  const depDate = new Date(today);
  depDate.setDate(depDate.getDate() + 3);
  const arrDate = new Date(today);
  arrDate.setDate(arrDate.getDate() + 24);

  const [estimatedDeparture, setEstimatedDeparture] = useState(depDate.toISOString().split('T')[0]);
  const [estimatedArrival, setEstimatedArrival] = useState(arrDate.toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBooking({
      bookingNumber,
      customerId: selectedCustomerId,
      carrierId: selectedCarrierId,
      polCode,
      podCode,
      vesselName,
      voyageNumber,
      containerCount,
      containerType,
      cargoDescription,
      cargoWeightKg,
      estimatedDeparture,
      estimatedArrival,
      status: 'BOOKING_CONFIRMED'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-[#132B4F] text-slate-100 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-700/80 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#0A1A30] border-b border-slate-800 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#B7F500]" />
            <div>
              <h2 className="text-base font-extrabold text-white">Create New Ocean Booking</h2>
              <p className="text-[11px] text-slate-300">Register new consignment with customer assignment and carrier schedule</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs flex-1 bg-[#132B4F]">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Booking Number */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Booking Reference Number</label>
              <input
                type="text"
                value={bookingNumber}
                onChange={e => setBookingNumber(e.target.value.toUpperCase())}
                className="w-full p-2.5 rounded-lg border border-slate-700 bg-[#0D2240] font-mono font-bold text-[#B7F500] focus:outline-none focus:ring-1 focus:ring-[#B7F500]"
                required
              />
            </div>

            {/* Customer Assignment */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Assign to Customer Account</label>
              <select
                value={selectedCustomerId}
                onChange={e => setSelectedCustomerId(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-700 bg-[#0D2240] text-white focus:outline-none focus:ring-1 focus:ring-[#B7F500]"
                required
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.companyName} ({c.name})
                  </option>
                ))}
              </select>
            </div>

            {/* POL */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Port of Loading (POL)</label>
              <select
                value={polCode}
                onChange={e => setPolCode(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-700 bg-[#0D2240] text-white focus:outline-none focus:ring-1 focus:ring-[#B7F500]"
                required
              >
                {ports.map(p => (
                  <option key={p.code} value={p.code}>
                    {p.code} — {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* POD */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Port of Discharge (POD)</label>
              <select
                value={podCode}
                onChange={e => setPodCode(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-700 bg-[#0D2240] text-white focus:outline-none focus:ring-1 focus:ring-[#B7F500]"
                required
              >
                {ports.map(p => (
                  <option key={p.code} value={p.code}>
                    {p.code} — {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Carrier */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Ocean Carrier Line</label>
              <select
                value={selectedCarrierId}
                onChange={e => setSelectedCarrierId(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-700 bg-[#0D2240] text-white focus:outline-none focus:ring-1 focus:ring-[#B7F500]"
                required
              >
                {carriers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Vessel Name */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Assigned Vessel</label>
              <input
                type="text"
                value={vesselName}
                onChange={e => setVesselName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-700 bg-[#0D2240] text-white focus:outline-none focus:ring-1 focus:ring-[#B7F500]"
                required
              />
            </div>

            {/* Voyage Number */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Voyage Reference</label>
              <input
                type="text"
                value={voyageNumber}
                onChange={e => setVoyageNumber(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-700 bg-[#0D2240] text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#B7F500]"
                required
              />
            </div>

            {/* Containers Count & Type */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Container Quantity & Type</label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={containerCount}
                  onChange={e => setContainerCount(Number(e.target.value))}
                  className="p-2.5 rounded-lg border border-slate-700 bg-[#0D2240] text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#B7F500]"
                  required
                />
                <select
                  value={containerType}
                  onChange={e => setContainerType(e.target.value)}
                  className="col-span-2 p-2.5 rounded-lg border border-slate-700 bg-[#0D2240] text-white focus:outline-none focus:ring-1 focus:ring-[#B7F500]"
                >
                  <option value="40' High Cube Dry">40' High Cube Dry</option>
                  <option value="20' Standard Dry">20' Standard Dry</option>
                  <option value="40' Reefer">40' Reefer</option>
                  <option value="45' High Cube">45' High Cube</option>
                </select>
              </div>
            </div>

            {/* Cargo Description */}
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-slate-300">Cargo Manifest Description</label>
              <input
                type="text"
                value={cargoDescription}
                onChange={e => setCargoDescription(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-700 bg-[#0D2240] text-white focus:outline-none focus:ring-1 focus:ring-[#B7F500]"
                required
              />
            </div>

            {/* Departure Date */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Estimated Departure</label>
              <input
                type="date"
                value={estimatedDeparture}
                onChange={e => setEstimatedDeparture(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-700 bg-[#0D2240] text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#B7F500]"
                required
              />
            </div>

            {/* Arrival Date */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Estimated Arrival</label>
              <input
                type="date"
                value={estimatedArrival}
                onChange={e => setEstimatedArrival(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-700 bg-[#0D2240] text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#B7F500]"
                required
              />
            </div>

          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white cursor-pointer font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#B7F500] hover:bg-[#a5de00] text-[#0D2240] font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
            >
              Confirm & Book Shipment
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
