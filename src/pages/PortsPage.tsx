import React, { useState, useEffect } from 'react';
import { Anchor, Search, Globe, Ship, MapPin } from 'lucide-react';
import { localDb } from '../services/storage';
import type { Port } from '../types';

export const PortsPage: React.FC = () => {
  const [ports, setPorts] = useState<Port[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const rawPorts = localDb.getPorts();
    const { shipments } = localDb.getShipments({ limit: 500 });
    const enriched = rawPorts.map((p) => {
      const activeCount = shipments.filter(
        (s) => s.origin_code === p.code || s.destination_code === p.code
      ).length;
      return { ...p, active_shipments: activeCount };
    });
    setPorts(enriched);
  }, []);

  const filteredPorts = ports.filter((p) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.country.toLowerCase().includes(q) ||
      p.region.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 relative">
      {/* Background radial glow */}
      <div className="absolute -top-10 left-1/3 w-96 h-96 bg-[#B7F500]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="pb-2 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Anchor className="w-6 h-6 text-[#B7F500]" />
            <span>Canonical Port Master Records</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Database-backed international gateway ports utilized uniformly across booking, schedule lookups, and vessel milestones.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search port code, name, or country..."
            className="w-full bg-[#081426] border border-slate-700 focus:border-[#B7F500] text-white rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none transition"
          />
        </div>
      </div>

      {/* Grid of Canonical Ports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPorts.map((p) => (
          <div
            key={p.id}
            className="p-5 bg-[#0D2240] border border-slate-800 hover:border-[#B7F500]/40 rounded-2xl shadow-xl transition space-y-3 backdrop-blur-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-base font-extrabold text-[#B7F500]">{p.code}</span>
                <h3 className="font-bold text-white text-sm mt-0.5">{p.name}</h3>
              </div>
              <div className="p-2 rounded-xl bg-[#081426] text-slate-400 border border-slate-800">
                <Globe className="w-4 h-4 text-[#B7F500]" />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>
                {p.country} • <strong className="text-slate-400 font-medium">{p.region}</strong>
              </span>
            </div>

            <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Ship className="w-3.5 h-3.5 text-[#B7F500]" />
                <span className="text-slate-200">{p.active_shipments || 0} Connected Voyage(s)</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#081426] border border-slate-700 text-slate-300">
                POL / POD
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
