import React, { useState, useEffect } from 'react';
import { X, Ship } from 'lucide-react';
import { localDb } from '../services/storage';
import type { Port, User } from '../types';

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newShipmentId: string) => void;
}

export const CreateBookingModal: React.FC<CreateBookingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [ports, setPorts] = useState<Port[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [bookingId, setBookingId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [originCode, setOriginCode] = useState('');
  const [destinationCode, setDestinationCode] = useState('');
  const [carrier, setCarrier] = useState('Maersk Line');
  const [vessel, setVessel] = useState('');
  const [voyageNumber, setVoyageNumber] = useState('');
  const [containerCount, setContainerCount] = useState(1);
  const [containerType, setContainerType] = useState("40' High Cube");
  const [cargoDescription, setCargoDescription] = useState('');
  const [etd, setEtd] = useState('');
  const [eta, setEta] = useState('');
  const [notes, setNotes] = useState('');

  const carriers = [
    'Maersk Line',
    'MSC Mediterranean Shipping Co',
    'CMA CGM Group',
    'Hapag-Lloyd',
    'COSCO Shipping Lines',
    'Ocean Network Express (ONE)',
    'Evergreen Marine Corp',
    'Yang Ming Marine Transport',
  ];

  const containerTypes = ["40' High Cube", "20' Standard Dry", "40' Standard Dry", "40' Reefer", "45' High Cube"];

  useEffect(() => {
    if (isOpen) {
      setBookingId(`CV-${Math.floor(900000 + Math.random() * 90000)}`);
      const d1 = new Date();
      d1.setDate(d1.getDate() + 3);
      setEtd(d1.toISOString().slice(0, 10));
      const d2 = new Date();
      d2.setDate(d2.getDate() + 21);
      setEta(d2.toISOString().slice(0, 10));

      const loadedPorts = localDb.getPorts();
      setPorts(loadedPorts);
      if (loadedPorts.length > 1) {
        setOriginCode(loadedPorts[0].code);
        setDestinationCode(loadedPorts[1].code);
      }
      const loadedCustomers = localDb.getUsers({ role: 'customer', active: 'true' });
      setCustomers(loadedCustomers);
      if (loadedCustomers.length > 0) {
        setCustomerId(loadedCustomers[0].id);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (originCode === destinationCode) {
      setError('Port of Loading (POL) and Port of Discharge (POD) cannot be identical.');
      return;
    }

    try {
      const selectedCust = customers.find((c) => c.id === customerId);
      const originPort = ports.find((p) => p.code === originCode);
      const destPort = ports.find((p) => p.code === destinationCode);

      const created = localDb.createShipment({
        booking_id: bookingId.trim(),
        customer_id: customerId,
        origin: originPort?.name || originCode,
        origin_code: originCode,
        destination: destPort?.name || destinationCode,
        destination_code: destinationCode,
        carrier,
        vessel: vessel || `${carrier.split(' ')[0]} Voyager`,
        voyage_number: voyageNumber || '2450E',
        container_count: containerCount,
        container_type: containerType,
        cargo_description: cargoDescription,
        estimated_departure_date: new Date(etd).toISOString(),
        estimated_arrival_date: new Date(eta).toISOString(),
        operational_notes: notes || null,
        customer_name: selectedCust?.name || 'Customer',
        customer_company: selectedCust?.company || 'Commercial Partner',
      });

      onSuccess(created.id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error creating booking.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#0D2240] border border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#B7F500]/15 text-[#B7F500]">
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Create Shipment Booking</h3>
              <p className="text-xs text-slate-400">Compass Logistics International Fleet Management</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Booking Number *
              </label>
              <input
                type="text"
                required
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                className="w-full bg-[#081426] border border-slate-700 focus:border-[#B7F500] rounded-xl px-3 py-2 text-white font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Customer Consignee *
              </label>
              <select
                required
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full bg-[#081426] border border-slate-700 focus:border-[#B7F500] rounded-xl px-3 py-2 text-white"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company} ({c.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Port of Loading (POL) *
              </label>
              <select
                required
                value={originCode}
                onChange={(e) => setOriginCode(e.target.value)}
                className="w-full bg-[#081426] border border-slate-700 focus:border-[#B7F500] rounded-xl px-3 py-2 text-white"
              >
                {ports.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.code} - {p.name} ({p.country})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Port of Discharge (POD) *
              </label>
              <select
                required
                value={destinationCode}
                onChange={(e) => setDestinationCode(e.target.value)}
                className="w-full bg-[#081426] border border-slate-700 focus:border-[#B7F500] rounded-xl px-3 py-2 text-white"
              >
                {ports.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.code} - {p.name} ({p.country})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Carrier Company *
              </label>
              <select
                required
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full bg-[#081426] border border-slate-700 focus:border-[#B7F500] rounded-xl px-3 py-2 text-white"
              >
                {carriers.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Vessel Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Madrid Maersk"
                value={vessel}
                onChange={(e) => setVessel(e.target.value)}
                className="w-full bg-[#081426] border border-slate-700 focus:border-[#B7F500] rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Voyage Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 2412E"
                value={voyageNumber}
                onChange={(e) => setVoyageNumber(e.target.value)}
                className="w-full bg-[#081426] border border-slate-700 focus:border-[#B7F500] rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Container Count
              </label>
              <input
                type="number"
                min="1"
                max="100"
                required
                value={containerCount}
                onChange={(e) => setContainerCount(Number(e.target.value))}
                className="w-full bg-[#081426] border border-slate-700 focus:border-[#B7F500] rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Container Type
              </label>
              <select
                value={containerType}
                onChange={(e) => setContainerType(e.target.value)}
                className="w-full bg-[#081426] border border-slate-700 focus:border-[#B7F500] rounded-xl px-3 py-2 text-white"
              >
                {containerTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Cargo Description *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Modular Hardwood Living Room Furniture & Scandinavian Desks"
              value={cargoDescription}
              onChange={(e) => setCargoDescription(e.target.value)}
              className="w-full bg-[#081426] border border-slate-700 focus:border-[#B7F500] rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Estimated Departure Date (ETD) *
              </label>
              <input
                type="date"
                required
                value={etd}
                onChange={(e) => setEtd(e.target.value)}
                className="w-full bg-[#081426] border border-slate-700 focus:border-[#B7F500] rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Estimated Arrival Date (ETA) *
              </label>
              <input
                type="date"
                required
                value={eta}
                onChange={(e) => setEta(e.target.value)}
                className="w-full bg-[#081426] border border-slate-700 focus:border-[#B7F500] rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Operational Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Internal instructions for terminal handling, customer priority, or equipment releases..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#081426] border border-slate-700 focus:border-[#B7F500] rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#B7F500] text-[#0D2240] font-extrabold hover:bg-[#a3dc00] transition shadow-md shadow-[#B7F500]/10"
            >
              Confirm & Save Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
