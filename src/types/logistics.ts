export type UserRole = 'operations' | 'customer';

export interface Port {
  id: string;
  code: string; // e.g. DEHAM
  name: string; // e.g. Port of Hamburg
  city: string;
  country: string;
  terminal: string;
  coordinates: [number, number]; // [lat, lng]
}

export interface Carrier {
  id: string;
  name: string; // e.g. Maersk Line
  code: string; // e.g. MSK
  fleetSize: number;
  headquarters: string;
  reliabilityRate: number | null; // e.g. 88.5 (%) or null if missing
  avgDelayDays: number | null; // e.g. 0.9 or null
}

export interface Customer {
  id: string;
  name: string;
  companyName: string;
  industry: string;
  country: string;
  contactEmail: string;
  contactPhone: string;
  assignedShipmentId: string; // Mandatory 1-to-1 relationship in demo dataset
  accountTier: 'Enterprise' | 'Standard' | 'Priority';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  customerId?: string; // Defined if role === 'customer'
  jobTitle?: string;
  department?: string;
}

export type ShipmentStatus = 
  | 'BOOKING_CONFIRMED'
  | 'IN_TRANSIT'
  | 'ARRIVING_SOON'
  | 'DELAYED'
  | 'DELIVERED';

export type MilestoneType =
  | 'BOOKING_CONFIRMED'
  | 'CARGO_RECEIVED'
  | 'GATE_IN'
  | 'LOADED_ON_VESSEL'
  | 'VESSEL_DEPARTED'
  | 'TRANSSHIPMENT'
  | 'ARRIVAL_AT_DESTINATION'
  | 'CUSTOMS_CLEARANCE'
  | 'CARGO_AVAILABLE'
  | 'DELIVERED';

export interface MilestoneEvent {
  id: string;
  shipmentId: string;
  milestone: MilestoneType;
  title: string;
  eventDate: string; // ISO date string
  location: string;
  description: string;
  isConfirmed: boolean; // Confirmed actual vs planned
  category: 'actual' | 'planned' | 'revised';
  originalDate?: string;
}

export interface Shipment {
  id: string;
  bookingNumber: string; // e.g. CV-900001
  customerId: string; // Belongs to exactly 1 customer
  carrierId: string; // Belongs to 1 carrier
  polCode: string; // Port of Loading code
  podCode: string; // Port of Discharge code
  vesselName: string;
  voyageNumber: string;
  containerCount: number;
  containerType: string; // e.g. 40' High Cube Dry
  cargoDescription: string;
  cargoWeightKg: number;
  estimatedDeparture: string; // ISO date
  actualDeparture?: string;
  estimatedArrival: string; // ISO date
  revisedEta?: string; // ISO date if delayed
  actualArrival?: string;
  status: ShipmentStatus;
  delayDurationDays?: number;
  delayReason?: string;
  operationalRemarks?: string;
  createdAt: string;
}

export interface AlternativeCarrierOption {
  id: string;
  polCode: string;
  podCode: string;
  carrierId: string;
  vesselName: string;
  voyageNumber: string;
  plannedDeparture: string;
  estimatedArrival: string;
  transitDays: number;
  scheduleAvailability: 'Available' | 'Limited Space' | 'Waitlist';
  historicalDelays: string; // e.g. "0.6 avg days" or "Not available"
  onTimePerformance: number | null; // e.g. 91% or null
  quotedFreightCost: number | null; // e.g. 2150 USD or null
  isRecommended?: boolean;
  recommendationReason?: string;
}

export interface AppNotification {
  id: string;
  userId?: string;
  customerId?: string; // For customer scoping
  shipmentId: string;
  bookingNumber: string;
  title: string;
  message: string;
  type: 'status_change' | 'eta_revision' | 'delay_alert' | 'delivered' | 'booking_confirmed';
  timestamp: string;
  read: boolean;
}
