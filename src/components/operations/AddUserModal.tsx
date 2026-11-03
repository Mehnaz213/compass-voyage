import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { X, UserPlus, ShieldCheck, Building2, Mail, User, Briefcase, Globe, Ship } from 'lucide-react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
  const { shipments, getPortByCode, getCarrierById, addCustomerUser } = useLogistics();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('Logistics Operations Lead');
  const [industry, setIndustry] = useState('Electronics & Technology');
  const [country, setCountry] = useState('Germany');
  const [selectedShipmentId, setSelectedShipmentId] = useState(shipments[0]?.id || '');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !companyName.trim() || !selectedShipmentId) return;

    addCustomerUser({
      name: name.trim(),
      email: email.trim(),
      companyName: companyName.trim(),
      jobTitle: jobTitle.trim(),
      industry: industry.trim(),
      country: country.trim(),
      shipmentId: selectedShipmentId
    });

    const targetShipment = shipments.find(s => s.id === selectedShipmentId);
    setSuccessNotice(`User ${name} successfully registered and assigned to Booking ${targetShipment ? targetShipment.bookingNumber : selectedShipmentId}. Account is ready for login.`);

    setTimeout(() => {
      setSuccessNotice(null);
      setName('');
      setEmail('');
      setCompanyName('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-[#132B4F] text-slate-100 rounded-2xl max-w-xl w-full shadow-2xl border border-slate-700/80 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#0A1A30] border-b border-slate-800 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#B7F500] text-[#0D2240] flex items-center justify-center font-bold shadow-xs">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Add New Customer User</h2>
              <p className="text-[11px] text-slate-300">
                Create customer login account & enforce strict 1:1 booking assignment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1:1 Rule Banner */}
        <div className="bg-[#0D2240] px-5 py-3 border-b border-slate-700/70 flex items-center gap-2.5 text-xs text-slate-300 shrink-0">
          <ShieldCheck className="w-4 h-4 text-[#B7F500] shrink-0" />
          <span>
            Strict 1:1 Data Scoping: The customer will only be granted access to the selected consignment.
          </span>
        </div>

        {/* Success Alert */}
        {successNotice && (
          <div className="m-5 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-semibold">
            {successNotice}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs flex-1 bg-[#132B4F]">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* User Full Name */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Henrik Lindqvist"
                className="w-full p-2.5 rounded-lg border border-slate-700 bg-[#0D2240] text-white focus:outline-none focus:ring-1 focus:ring-[#B7F500]"
                required
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Customer Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. h.lindqvist@company.com"
                className="w-full p-2.5 rounded-lg border border-slate-700 bg-[#0D2240] text-white focus:outline-none focus:ring-1 focus:ring-[#B7F500]"
                required
              />
            </div>

            {/* Company Name */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Customer Company</span>
              </label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="e.g. Nordic Timber International"
                className="w-full p-2.5 rounded-lg border border-slate-700 bg-[#0D2240] text-white focus:outline-none focus:ring-1 focus:ring-[#B7F500]"
                required
              />
            </div>

            {/* Job Title */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>Job Title</span>
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                placeholder="e.g. Procurement Specialist"
                className="w-full p-2.5 rounded-lg border border-slate-700 bg-[#0D2240] text-white focus:outline-none focus:ring-1 focus:ring-[#B7F500]"
              />
            </div>

            {/* Industry */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Industry Sector</label>
              <select
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-700 bg-[#0D2240] text-white focus:outline-none focus:ring-1 focus:ring-[#B7F500]"
              >
                <option value="Electronics & Technology">Electronics & Technology</option>
                <option value="Automotive & Mobility">Automotive & Mobility</option>
                <option value="Heavy Machinery & Energy">Heavy Machinery & Energy</option>
                <option value="Pharmaceuticals & Health">Pharmaceuticals & Health</option>
                <option value="Retail & Consumer Goods">Retail & Consumer Goods</option>
                <option value="Raw Materials & Chemicals">Raw Materials & Chemicals</option>
              </select>
            </div>

            {/* Country */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>Country</span>
              </label>
              <input
                type="text"
                value={country}
                onChange={e => setCountry(e.target.value)}
                placeholder="e.g. Germany"
                className="w-full p-2.5 rounded-lg border border-slate-700 bg-[#0D2240] text-white focus:outline-none focus:ring-1 focus:ring-[#B7F500]"
              />
            </div>

            {/* Mandatory 1:1 Assigned Booking */}
            <div className="sm:col-span-2 space-y-1 pt-1">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Ship className="w-3.5 h-3.5 text-[#B7F500]" />
                <span>Assign to Ocean Booking (1:1 Consignment)</span>
              </label>
              <select
                value={selectedShipmentId}
                onChange={e => setSelectedShipmentId(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-700 bg-[#0D2240] text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#B7F500]"
                required
              >
                {shipments.map(s => {
                  const pol = getPortByCode(s.polCode);
                  const pod = getPortByCode(s.podCode);
                  const carrier = getCarrierById(s.carrierId);
                  return (
                    <option key={s.id} value={s.id}>
                      {s.bookingNumber} — {pol?.city || s.polCode} to {pod?.city || s.podCode} ({carrier?.name || 'Carrier'}, {s.vesselName})
                    </option>
                  );
                })}
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                Upon logging in, this customer account will exclusively view telemetry and tracking for this consignment.
              </p>
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
              Create Customer Account
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
