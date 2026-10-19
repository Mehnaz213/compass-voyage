export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  role: 'operations' | 'customer';
  permissions: 'admin' | 'full' | 'view_only' | 'standard';
  contact_number?: string;
  is_active: boolean;
  shipment_count?: number;
  created_at: string;
}

export interface Port {
  id: string;
  name: string;
  code: string;
  country: string;
  region: string;
  active_shipments?: number;
  created_at: string;
}

export interface Shipment {
  id: string;
  booking_id: string;
  customer_id: string;
  assigned_operations_user_id?: string | null;
  origin: string;
  origin_code: string;
  destination: string;
  destination_code: string;
  carrier: string;
  vessel: string;
  voyage_number: string;
  container_count: number;
  container_type: string;
  cargo_description: string;
  status: 'Booking Confirmed' | 'In Transit' | 'Arriving Soon' | 'Delayed' | 'Delivered';
  progress: number;
  estimated_departure_date: string;
  estimated_arrival_date: string;
  revised_estimated_arrival_date?: string | null;
  actual_departure_date?: string | null;
  actual_arrival_date?: string | null;
  delay_days: number;
  delay_reason?: string | null;
  operational_notes?: string | null;
  customer_name?: string;
  customer_company?: string;
  customer_email?: string;
  assigned_ops_name?: string;
  created_at: string;
  updated_at: string;
}

export interface ShipmentEvent {
  id: string;
  shipment_id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  event_type: string;
  confirmed: number;
  created_at: string;
}

export interface Schedule {
  id: string;
  shipment_id: string;
  assigned_operations_user_id?: string | null;
  milestone: string;
  planned_date: string;
  revised_date?: string | null;
  actual_date?: string | null;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Delayed';
  notes?: string | null;
  carrier: string;
}

export interface CarrierScheduleOption {
  id: string;
  carrier: string;
  origin_code: string;
  origin_name: string;
  destination_code: string;
  destination_name: string;
  vessel: string;
  voyage_number: string;
  etd: string;
  eta: string;
  transit_days: number;
  frequency: string;
  service_type: string;
  reliability_score?: number | null;
  quoted_cost_usd?: number | null;
  delay_risk: 'Low' | 'Moderate' | 'High';
  notes?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  shipment_id?: string | null;
  booking_id?: string | null;
  origin_code?: string | null;
  destination_code?: string | null;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export interface StatsData {
  role: 'operations' | 'customer';
  stats: {
    total_shipments: number;
    in_transit: number;
    delayed: number;
    delivered: number;
    awaiting_confirmation?: number;
    arriving_soon?: number;
    total_customers?: number;
  };
  assigned_shipment?: Shipment | null;
  delayed_shipments?: any[];
  upcoming_arrivals?: any[];
  recent_events?: any[];
  recent_shipments?: any[];
}
