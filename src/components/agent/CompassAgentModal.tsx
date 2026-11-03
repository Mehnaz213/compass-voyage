import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  Ship, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { Shipment } from '../../types/logistics';

interface CompassAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectShipment: (shipment: Shipment) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  actionableShipments?: Shipment[];
  isSecurityWarning?: boolean;
}

export const CompassAgentModal: React.FC<CompassAgentModalProps> = ({
  isOpen,
  onClose,
  onSelectShipment
}) => {
  const { 
    currentUser, 
    selectedCustomer, 
    customerShipment, 
    shipments, 
    getPortByCode, 
    getCarrierById, 
    carrierAlternatives,
    getMilestonesForShipment 
  } = useLogistics();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome_1',
      sender: 'agent',
      text: currentUser.role === 'operations'
        ? `Hello ${currentUser.name}! I am Compass Agent, your operational intelligence assistant for Compass Voyage. You can ask me to find delayed consignments, list upcoming arrivals/departures, lookup specific bookings, or evaluate route carriers.`
        : `Hello ${currentUser.name}! I am Compass Agent. I am authorized to assist you exclusively with your assigned shipment (${customerShipment?.bookingNumber || 'No active shipment'}). You can ask about your departure, current vessel status, estimated arrival, or delay reasons.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  if (!isOpen) return null;

  const isCustomer = currentUser.role === 'customer';

  // Suggested queries based on user role
  const suggestedQueries = isCustomer
    ? [
        `What is the status of my shipment?`,
        `When will my vessel arrive?`,
        `Is there any recorded delay?`,
        `Show my journey milestones`,
        `Can I view booking CV-900003?` // Security test query!
      ]
    : [
        `Show all delayed shipments`,
        `Which shipments are arriving this week?`,
        `Show upcoming departures`,
        `Find shipments from Hamburg to Singapore`,
        `What carrier options are available for DEHAM to SGSIN?`,
        `Status of CV-900002`
      ];

  const handleSend = (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Process deterministic answer
    setTimeout(() => {
      const response = processQuery(q);
      setMessages(prev => [...prev, response]);
    }, 150);
  };

  const processQuery = (rawQuery: string): ChatMessage => {
    const q = rawQuery.toLowerCase();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Customer Scoping and Cross-Tenant Violation Check
    if (isCustomer) {
      // Check if user is asking about another customer's booking
      const foreignBookingMatch = q.match(/cv-9000\d{2}/i);
      if (foreignBookingMatch) {
        const requestedBooking = foreignBookingMatch[0].toUpperCase();
        if (customerShipment && requestedBooking !== customerShipment.bookingNumber) {
          return {
            id: `resp_${Date.now()}`,
            sender: 'agent',
            text: `ACCESS RESTRICTED: As an authenticated Customer for ${selectedCustomer?.companyName || 'your organization'}, you are authorized to access ONLY your assigned consignment (${customerShipment.bookingNumber}). Queries for external booking ${requestedBooking} are blocked to guarantee tenant confidentiality.`,
            timestamp: timeStr,
            isSecurityWarning: true
          };
        }
      }

      if (!customerShipment) {
        return {
          id: `resp_${Date.now()}`,
          sender: 'agent',
          text: `Your account currently does not have an assigned shipment. Please contact Compass Logistics International Operations.`,
          timestamp: timeStr
        };
      }

      const s = customerShipment;
      const carrier = getCarrierById(s.carrierId)?.name || 'Assigned carrier';
      const pol = getPortByCode(s.polCode)?.name || s.polCode;
      const pod = getPortByCode(s.podCode)?.name || s.podCode;

      if (q.includes('status') || q.includes('where is') || q.includes('my shipment')) {
        return {
          id: `resp_${Date.now()}`,
          sender: 'agent',
          text: `Booking ${s.bookingNumber} is currently ${s.status.replace('_', ' ')}. It is loaded aboard ${s.vesselName} (Voyage ${s.voyageNumber}, operated by ${carrier}) en route from ${pol} to ${pod}. Current departure: ${s.actualDeparture || s.estimatedDeparture}.`,
          timestamp: timeStr,
          actionableShipments: [s]
        };
      }

      if (q.includes('arrive') || q.includes('arrival') || q.includes('when')) {
        return {
          id: `resp_${Date.now()}`,
          sender: 'agent',
          text: s.revisedEta
            ? `Your shipment is currently scheduled to arrive at ${pod} on ${s.revisedEta} (Revised ETA). Original schedule was ${s.estimatedArrival}. Delay note: ${s.delayReason || 'Navigation adjustment'}.`
            : `Your shipment is scheduled to arrive at ${pod} on ${s.estimatedArrival}. No schedule delays are currently recorded.`,
          timestamp: timeStr,
          actionableShipments: [s]
        };
      }

      if (q.includes('delay')) {
        return {
          id: `resp_${Date.now()}`,
          sender: 'agent',
          text: s.status === 'DELAYED'
            ? `Yes, a delay of ${s.delayDurationDays || 3} days is recorded. Reason: "${s.delayReason}". The revised estimated arrival is ${s.revisedEta}.`
            : `No delays are recorded for your consignment (${s.bookingNumber}). Passage is proceeding on schedule.`,
          timestamp: timeStr,
          actionableShipments: [s]
        };
      }

      if (q.includes('milestone') || q.includes('journey')) {
        const milestones = getMilestonesForShipment(s.id);
        const lastConfirmed = milestones.filter(m => m.isConfirmed).slice(-1)[0];
        return {
          id: `resp_${Date.now()}`,
          sender: 'agent',
          text: `There are ${milestones.length} logged milestones for ${s.bookingNumber}. Most recent confirmed milestone: "${lastConfirmed?.title}" at ${lastConfirmed?.location} on ${lastConfirmed?.eventDate}. Click below to inspect the full timeline.`,
          timestamp: timeStr,
          actionableShipments: [s]
        };
      }

      return {
        id: `resp_${Date.now()}`,
        sender: 'agent',
        text: `Regarding your shipment ${s.bookingNumber}: It is ${s.status.replace('_', ' ')} with ${carrier} (${s.vesselName}). Estimated arrival at ${pod} is ${s.revisedEta || s.estimatedArrival}. Feel free to ask about delays, milestones, or key transit dates.`,
        timestamp: timeStr,
        actionableShipments: [s]
      };
    }

    // 2. Operations Global Queries
    // Booking specific lookup
    const bookingMatch = q.match(/cv-9000\d{2}/i);
    if (bookingMatch) {
      const bNumber = bookingMatch[0].toUpperCase();
      const s = shipments.find(x => x.bookingNumber === bNumber);
      if (s) {
        const pol = getPortByCode(s.polCode)?.name || s.polCode;
        const pod = getPortByCode(s.podCode)?.name || s.podCode;
        const carrier = getCarrierById(s.carrierId)?.name || 'Unknown Carrier';
        return {
          id: `resp_${Date.now()}`,
          sender: 'agent',
          text: `Found booking ${s.bookingNumber}: Status is ${s.status.replace('_', ' ')}. Route: ${pol} (${s.polCode}) to ${pod} (${s.podCode}). Vessel: ${s.vesselName} (Voy: ${s.voyageNumber}) with ${carrier}. Cargo: ${s.containerCount}x ${s.containerType}. Departure: ${s.estimatedDeparture}. Arrival: ${s.revisedEta || s.estimatedArrival}.`,
          timestamp: timeStr,
          actionableShipments: [s]
        };
      } else {
        return {
          id: `resp_${Date.now()}`,
          sender: 'agent',
          text: `Booking number ${bNumber} was not found in the active shipment catalog. Please check the reference number.`,
          timestamp: timeStr
        };
      }
    }

    // Delayed shipments
    if (q.includes('delayed') || q.includes('delay')) {
      const delayed = shipments.filter(s => s.status === 'DELAYED');
      return {
        id: `resp_${Date.now()}`,
        sender: 'agent',
        text: `There are currently ${delayed.length} delayed shipments requiring operational monitoring. Summary of active exceptions:`,
        timestamp: timeStr,
        actionableShipments: delayed.slice(0, 5)
      };
    }

    // Upcoming arrivals (within 7 days)
    if (q.includes('arriving') || q.includes('arrival')) {
      const today = new Date('2026-10-19T00:00:00Z');
      const in7Days = new Date(today);
      in7Days.setDate(in7Days.getDate() + 7);
      const arrivals = shipments
        .filter(s => {
          const arr = new Date(s.revisedEta || s.estimatedArrival);
          return arr >= today && arr <= in7Days && s.status !== 'DELIVERED';
        })
        .slice(0, 5);

      return {
        id: `resp_${Date.now()}`,
        sender: 'agent',
        text: `Found ${arrivals.length} upcoming vessel arrivals scheduled within the next 7 days:`,
        timestamp: timeStr,
        actionableShipments: arrivals
      };
    }

    // Upcoming departures
    if (q.includes('departure') || q.includes('departing')) {
      const today = new Date('2026-10-19T00:00:00Z');
      const in7Days = new Date(today);
      in7Days.setDate(in7Days.getDate() + 7);
      const departures = shipments
        .filter(s => {
          const dep = new Date(s.estimatedDeparture);
          return dep >= today && dep <= in7Days && !s.actualDeparture;
        })
        .slice(0, 5);

      return {
        id: `resp_${Date.now()}`,
        sender: 'agent',
        text: `Found ${departures.length} upcoming vessel departures scheduled within the next 7 days:`,
        timestamp: timeStr,
        actionableShipments: departures
      };
    }

    // Route search (e.g. Hamburg to Singapore, or DEHAM to SGSIN)
    if (q.includes('hamburg') || q.includes('deham') || q.includes('singapore') || q.includes('sgsin')) {
      const routeShipments = shipments.filter(s => s.polCode === 'DEHAM' && s.podCode === 'SGSIN');
      return {
        id: `resp_${Date.now()}`,
        sender: 'agent',
        text: `Found ${routeShipments.length} consignments on the Hamburg (DEHAM) to Singapore (SGSIN) corridor:`,
        timestamp: timeStr,
        actionableShipments: routeShipments.slice(0, 4)
      };
    }

    // Carrier options recommendation query
    if (q.includes('carrier') || q.includes('option') || q.includes('compare')) {
      const alts = carrierAlternatives.filter(a => a.polCode === 'DEHAM' && a.podCode === 'SGSIN');
      const rec = alts.find(a => a.isRecommended);
      return {
        id: `resp_${Date.now()}`,
        sender: 'agent',
        text: `For the Hamburg (DEHAM) to Singapore (SGSIN) route, ${alts.length} carrier options are active. The top recommendation is ${getCarrierById(rec?.carrierId || '')?.name} (${rec?.vesselName}) offering ${rec?.transitDays} days transit duration and ${rec?.onTimePerformance}% on-time performance.`,
        timestamp: timeStr
      };
    }

    // Fallback response with helpful hints
    return {
      id: `resp_${Date.now()}`,
      sender: 'agent',
      text: `I can assist with specific logistics queries against our active database. Try asking:\n• "Show all delayed shipments"\n• "Which shipments are arriving this week?"\n• "Lookup booking CV-900001"\n• "Find shipments from Hamburg to Singapore"`,
      timestamp: timeStr
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-[#132B4F] rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="bg-[#0A1A30] border-b border-slate-800 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#B7F500] text-[#0D2240] flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">Compass Agent</h2>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-[#B7F500]">
                  Deterministic Logistics Assistant
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Authorized for: {currentUser.role === 'operations' ? 'Global Operations Scope' : `Customer (${selectedCustomer?.companyName})`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#0D2240]">
          {messages.map(m => {
            const isUser = m.sender === 'user';

            return (
              <div
                key={m.id}
                className={`flex gap-3 text-xs ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-[#132B4F] border border-slate-700 text-[#B7F500] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`space-y-2 max-w-[85%] ${
                  isUser 
                    ? 'bg-[#B7F500] text-[#0D2240] font-medium p-3 rounded-2xl rounded-tr-xs shadow-xs' 
                    : m.isSecurityWarning
                    ? 'bg-rose-950/40 border border-rose-500/50 text-rose-200 p-3.5 rounded-2xl rounded-tl-xs shadow-xs'
                    : 'bg-[#132B4F] border border-slate-700/80 text-slate-100 p-3.5 rounded-2xl rounded-tl-xs shadow-xs'
                }`}>
                  {m.isSecurityWarning && (
                    <div className="flex items-center gap-1.5 font-bold text-rose-300 mb-1">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>Security & Data Isolation Rule</span>
                    </div>
                  )}

                  <p className="leading-relaxed whitespace-pre-line">{m.text}</p>

                  {/* Actionable Shipments Cards */}
                  {m.actionableShipments && m.actionableShipments.length > 0 && (
                    <div className="pt-2 space-y-2">
                      {m.actionableShipments.map(s => (
                        <div
                          key={s.id}
                          className="p-2.5 rounded-lg bg-[#0A1A30] border border-slate-700 flex items-center justify-between gap-2 text-[11px]"
                        >
                          <div>
                            <span className="font-mono font-bold text-[#B7F500]">{s.bookingNumber}</span>
                            <span className="text-slate-300 ml-2">
                              {s.polCode} → {s.podCode} ({s.vesselName})
                            </span>
                            <div className="text-[10px] text-slate-400">
                              Status: <strong className="text-slate-200">{s.status.replace('_', ' ')}</strong> · ETA: {s.revisedEta || s.estimatedArrival}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              onSelectShipment(s);
                              onClose();
                            }}
                            className="px-2.5 py-1 rounded bg-[#B7F500] text-[#0D2240] font-bold text-[10px] flex items-center gap-1 hover:bg-[#a5de00] transition-colors shrink-0 cursor-pointer"
                          >
                            <span>Inspect</span>
                            <ArrowRight className="w-3 h-3 text-[#0D2240]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <span className={`block text-[10px] ${isUser ? 'text-[#0D2240]/70 text-right' : 'text-slate-400'}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Suggestion Chips */}
        <div className="p-3 bg-[#0A1A30] border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0">
          <span className="text-slate-400 shrink-0 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#B7F500]" />
            Suggestions:
          </span>
          {suggestedQueries.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleSend(sq)}
              className="px-2.5 py-1 rounded-full bg-[#132B4F] hover:bg-[#1A3865] border border-slate-700 text-slate-200 font-medium whitespace-nowrap transition-colors cursor-pointer"
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputQuery);
          }}
          className="p-3 sm:p-4 bg-[#0A1A30] border-t border-slate-800 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            placeholder={
              isCustomer
                ? "Ask about your consignment (arrival, delays, milestones)..."
                : "Ask Compass Agent (e.g. show delayed shipments, booking status)..."
            }
            className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-[#B7F500] bg-[#132B4F] text-white placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="p-2 rounded-lg bg-[#B7F500] text-[#0D2240] hover:bg-[#a5de00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer font-bold"
            title="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
