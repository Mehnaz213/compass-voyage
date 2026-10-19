import React, { useState } from 'react';
import { Bot, Send, Sparkles, X, ArrowRight, ShieldCheck, Ship, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { localDb } from '../services/storage';
import { StatusBadge } from './StatusBadge';

interface CompassAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectShipment: (shipmentId: string) => void;
}

export const CompassAgentModal: React.FC<CompassAgentModalProps> = ({
  isOpen,
  onClose,
  onSelectShipment,
}) => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<
    Array<{
      role: 'user' | 'agent';
      text: string;
      shipments?: any[];
      intent?: string;
    }>
  >([
    {
      role: 'agent',
      text: `Hello ${user?.name || 'there'}! I am Compass Agent, grounded directly in the live Compass Voyage database. You can ask me about delayed voyages, approaching vessel arrivals, departure schedules, or specific booking numbers.`,
    },
  ]);

  if (!isOpen || !user) return null;

  const quickPrompts = [
    'Show delayed shipments',
    'Which shipments are arriving this week?',
    'What is the status of booking CV-900001?',
    user?.role === 'operations' ? 'Show shipments for NorthStar' : 'Where is my assigned shipment?',
  ];

  const handleSend = (questionText: string) => {
    const q = questionText.trim();
    if (!q) return;

    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setQuery('');

    const result = localDb.queryCompassAgent(q, user);
    setMessages((prev) => [
      ...prev,
      {
        role: 'agent',
        text: result.answer,
        shipments: result.shipments,
        intent: result.intent,
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-[#0D2240] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#081426]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#B7F500]/15 border border-[#B7F500]/40 flex items-center justify-center text-[#B7F500]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Compass Agent</h3>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#B7F500]/20 text-[#B7F500] rounded-full border border-[#B7F500]/30 flex items-center gap-1">
                  <ShieldCheck className="w-2.5 h-2.5" /> Database-Grounded
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Live query assistant for Compass Logistics International
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat message body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[#B7F500] text-[#0D2240] font-bold rounded-tr-none shadow-md shadow-[#B7F500]/10'
                    : 'bg-[#081426] border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-line'
                }`}
              >
                {m.text}
              </div>

              {/* Structured Shipment Chips if present */}
              {m.shipments && m.shipments.length > 0 && (
                <div className="w-full mt-3 space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
                    Related Records ({m.shipments.length})
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {m.shipments.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          onSelectShipment(s.id);
                          onClose();
                        }}
                        className="p-3 bg-[#081426] hover:bg-[#122849] border border-slate-700/60 hover:border-[#B7F500]/50 rounded-xl cursor-pointer transition flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-slate-800 text-[#B7F500]">
                            <Ship className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-white text-sm">
                                {s.booking_id}
                              </span>
                              <StatusBadge status={s.status} delayDays={s.delay_days} size="sm" />
                            </div>
                            <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <span>{s.origin_code}</span>
                              <ArrowRight className="w-3 h-3 text-slate-500" />
                              <span>{s.destination_code}</span>
                              <span className="text-slate-600">•</span>
                              <span className="text-slate-300 font-medium">{s.carrier}</span>
                              {s.vessel && (
                                <>
                                  <span className="text-slate-600">•</span>
                                  <span className="italic text-slate-400">{s.vessel}</span>
                                </>
                              )}
                            </div>
                            {s.delay_reason && (
                              <p className="text-[11px] text-rose-300 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 shrink-0" /> {s.delay_reason}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#B7F500] group-hover:translate-x-1 transition-transform">
                          <span>View Journey</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick prompt suggestions */}
        <div className="px-5 py-2.5 bg-[#081426]/70 border-t border-slate-800/80 overflow-x-auto flex items-center gap-2 no-scrollbar">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3 text-[#B7F500]" /> Suggestions:
          </span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(p)}
              className="text-xs bg-slate-800/80 hover:bg-slate-700 hover:border-[#B7F500]/40 text-slate-300 hover:text-white px-2.5 py-1 rounded-full border border-slate-700 shrink-0 transition"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(query);
          }}
          className="p-4 bg-[#081426] border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about delayed shipments, schedules, or enter booking ID..."
            className="flex-1 bg-slate-900 border border-slate-700 focus:border-[#B7F500] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition"
          />
          <button
            type="submit"
            disabled={!query.trim()}
            className="px-4 py-2.5 rounded-xl bg-[#B7F500] hover:bg-[#a3dc00] text-[#0D2240] font-extrabold text-sm flex items-center gap-1.5 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#B7F500]/10"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
