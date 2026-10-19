import type {
  User,
  Port,
  Shipment,
  ShipmentEvent,
  Schedule,
  CarrierScheduleOption,
  Notification,
  StatsData,
} from '../types';

const STORAGE_KEY = 'compass_voyage_data_v7';
const CURRENT_SESSION_KEY = 'compass_voyage_active_session_v7';

interface StorageSchema {
  users: User[];
  ports: Port[];
  shipments: Shipment[];
  events: ShipmentEvent[];
  schedules: Schedule[];
  carrierOptions: CarrierScheduleOption[];
  notifications: Notification[];
  version: number;
}

// 20 Canonical World Ports
export const INITIAL_PORTS: Port[] = [
  { id: 'port-1', name: 'Shanghai Port', code: 'CNSHA', country: 'China', region: 'East Asia', created_at: '2026-01-01T00:00:00Z' },
  { id: 'port-2', name: 'Port of Singapore', code: 'SGSIN', country: 'Singapore', region: 'Southeast Asia', created_at: '2026-01-01T00:00:00Z' },
  { id: 'port-3', name: 'Ningbo-Zhoushan', code: 'CNNGB', country: 'China', region: 'East Asia', created_at: '2026-01-01T00:00:00Z' },
  { id: 'port-4', name: 'Shenzhen Port', code: 'CNSZX', country: 'China', region: 'East Asia', created_at: '2026-01-01T00:00:00Z' },
  { id: 'port-5', name: 'Port of Busan', code: 'KRPUS', country: 'South Korea', region: 'East Asia', created_at: '2026-01-01T00:00:00Z' },
  { id: 'port-6', name: 'Port of Rotterdam', code: 'NLRTM', country: 'Netherlands', region: 'Europe', created_at: '2026-01-01T00:00:00Z' },
  { id: 'port-7', name: 'Port of Antwerp-Bruges', code: 'BEANR', country: 'Belgium', region: 'Europe', created_at: '2026-01-01T00:00:00Z' },
  { id: 'port-8', name: 'Port of Hamburg', code: 'DEHAM', country: 'Germany', region: 'Europe', created_at: '2026-01-01T00:00:00Z' },
  { id: 'port-9', name: 'Port of Los Angeles', code: 'USLAX', country: 'United States', region: 'North America', created_at: '2026-01-01T00:00:00Z' },
  { id: 'port-10', name: 'Port of Long Beach', code: 'USLGB', country: 'United States', region: 'North America', created_at: '2026-01-01T00:00:00Z' },
  { id: 'port-11', name: 'Port of New York & New Jersey', code: 'USNYC', country: 'United States', region: 'North America', created_at: '2026-01-01T00:00:00Z' },
  { id: 'port-12', name: 'Port of Savannah', code: 'USSAV', country: 'United States', region: 'North America', created_at: '2026-01-01T00:00:00Z' },
  { id: 'port-13', name: 'Jebel Ali Port (Dubai)', code: 'AEJEA', country: 'United Arab Emirates', region: 'Middle East', created_at: '2026-01-01T00:00:00Z' },
  { id: 'port-14', name: 'Port of Tokyo', code: 'JPTYO', country: 'Japan', region: 'East Asia', created_at: '2026-01-01T00:00:00Z' },
  { id: 'port-15', name: 'Port of Felixstowe', code: 'GBFXT', country: 'United Kingdom', region: 'Europe', created_at: '2026-01-01T00:00:00Z' },
  { id: 'port-16', name: 'Port of Santos', code: 'BRSSZ', country: 'Brazil', region: 'South America', created_at: '2026-01-01T00:00:00Z' },
  { id: 'port-17', name: 'Port of Sydney (Botany)', code: 'AUMYD', country: 'Australia', region: 'Oceania', created_at: '2026-01-01T00:00:00Z' },
  { id: 'port-18', name: 'Port of Valencia', code: 'ESVLC', country: 'Spain', region: 'Europe', created_at: '2026-01-01T00:00:00Z' },
  { id: 'port-19', name: 'Port of Colombo', code: 'LKCMB', country: 'Sri Lanka', region: 'South Asia', created_at: '2026-01-01T00:00:00Z' },
  { id: 'port-20', name: 'Jawaharlal Nehru Port (Mumbai)', code: 'INBOM', country: 'India', region: 'South Asia', created_at: '2026-01-01T00:00:00Z' },
];

// Initial Users: Operations Admin + Operations Staff + 3 Primary Customer Demo Logins + Additional Customer Accounts
export const INITIAL_USERS: User[] = [
  // 1 Operations Admin (Requested)
  {
    id: 'usr-admin',
    name: 'Elena Rostova',
    email: 'admin@compassvoyage.com',
    company: 'Compass Global Logistics International',
    role: 'operations',
    permissions: 'admin',
    contact_number: '+1 (415) 555-0100',
    is_active: true,
    created_at: '2026-01-10T08:00:00Z',
  },
  // Operations Lead
  {
    id: 'usr-ops1',
    name: 'Marcus Vance',
    email: 'ops@compassvoyage.com',
    company: 'Compass Global Logistics International',
    role: 'operations',
    permissions: 'full',
    contact_number: '+1 (415) 555-0101',
    is_active: true,
    created_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'usr-ops2',
    name: 'Sarah Chen',
    email: 'ops2@compassvoyage.com',
    company: 'Compass Global Logistics International',
    role: 'operations',
    permissions: 'view_only',
    contact_number: '+1 (415) 555-0102',
    is_active: true,
    created_at: '2026-01-12T08:00:00Z',
  },
  // 3 Primary Customer Demo Logins (Requested: 1 assigned shipment per customer):
  // Customer 1: Jordan Miller (NorthStar Home Living Ltd. - On Schedule In Transit)
  {
    id: 'usr-cust-jordan',
    name: 'Jordan Miller',
    email: 'jordan@northstarhome.com',
    company: 'NorthStar Home Living Ltd.',
    role: 'customer',
    permissions: 'standard',
    contact_number: '+1 (206) 555-4819',
    is_active: true,
    shipment_count: 1,
    created_at: '2026-02-10T09:00:00Z',
  },
  // Customer 2: Tariq Hassan (Apex Electronics - Delayed consignment)
  {
    id: 'usr-cust-apex',
    name: 'Tariq Hassan',
    email: 'tariq@apextechnologies.io',
    company: 'Apex Electronics & Semiconductors',
    role: 'customer',
    permissions: 'standard',
    contact_number: '+1 (408) 555-7832',
    is_active: true,
    shipment_count: 1,
    created_at: '2026-02-14T09:00:00Z',
  },
  // Customer 3: Mei-Ling Zhou (Pacific Rim Specialty Imports - Arriving Soon)
  {
    id: 'usr-cust-pacific',
    name: 'Mei-Ling Zhou',
    email: 'ml.zhou@pacificrimimports.com',
    company: 'Pacific Rim Specialty Imports',
    role: 'customer',
    permissions: 'standard',
    contact_number: '+1 (604) 555-9011',
    is_active: true,
    shipment_count: 1,
    created_at: '2026-02-15T09:00:00Z',
  },
  // Additional customers each with 1 assigned shipment:
  {
    id: 'usr-cust-horizon',
    name: 'Carlos Mendez',
    email: 'carlos@horizonretail.com',
    company: 'Horizon Retail Global Group',
    role: 'customer',
    permissions: 'standard',
    contact_number: '+1 (312) 555-2349',
    is_active: true,
    shipment_count: 1,
    created_at: '2026-02-18T09:00:00Z',
  },
  {
    id: 'usr-cust-bluewave',
    name: 'Dr. Evelyn Ward',
    email: 'eward@bluewavepharma.com',
    company: 'BlueWave Pharmaceuticals',
    role: 'customer',
    permissions: 'standard',
    contact_number: '+1 (617) 555-6620',
    is_active: true,
    shipment_count: 1,
    created_at: '2026-02-20T09:00:00Z',
  },
  {
    id: 'usr-cust-atlas',
    name: 'Klaus Mueller',
    email: 'klaus.m@atlasheavyindustries.de',
    company: 'Atlas Heavy Machinery GmbH',
    role: 'customer',
    permissions: 'standard',
    contact_number: '+49 89 555-3210',
    is_active: true,
    shipment_count: 1,
    created_at: '2026-02-22T09:00:00Z',
  },
  {
    id: 'usr-cust-nordic',
    name: 'Astrid Lind',
    email: 'astrid@nordictimberltd.se',
    company: 'Nordic Timber & Pulp Ltd',
    role: 'customer',
    permissions: 'standard',
    contact_number: '+46 8 555-9821',
    is_active: true,
    shipment_count: 1,
    created_at: '2026-02-25T09:00:00Z',
  },
  {
    id: 'usr-cust-solis',
    name: 'Mateo Rossi',
    email: 'mateo@solissolarenergy.it',
    company: 'Solis Renewable Solar Systems',
    role: 'customer',
    permissions: 'standard',
    contact_number: '+39 02 555-8910',
    is_active: true,
    shipment_count: 1,
    created_at: '2026-03-01T09:00:00Z',
  },
  {
    id: 'usr-cust-zenith',
    name: 'Priya Sharma',
    email: 'psharma@zenithapparel.in',
    company: 'Zenith Organic Textiles Ltd',
    role: 'customer',
    permissions: 'standard',
    contact_number: '+91 22 555-4300',
    is_active: true,
    shipment_count: 1,
    created_at: '2026-03-05T09:00:00Z',
  },
  // Inactive unassigned customer
  {
    id: 'usr-cust-inactive',
    name: 'Arthur Pendelton',
    email: 'arthur.p@vintagegoods.co',
    company: 'Pendelton Vintage Antiquities',
    role: 'customer',
    permissions: 'standard',
    contact_number: '+1 (212) 555-7788',
    is_active: false,
    shipment_count: 0,
    created_at: '2026-03-10T09:00:00Z',
  },
];

// Seed generator enforcing: STRICTLY ONE SHIPMENT PER CUSTOMER
function buildInitialData(): StorageSchema {
  const shipments: Shipment[] = [];
  const events: ShipmentEvent[] = [];
  const schedules: Schedule[] = [];
  const notifications: Notification[] = [];

  // Exact 1-to-1 Customer Shipments:
  const customerShipments: Array<{ customerId: string; shipment: Shipment }> = [
    {
      customerId: 'usr-cust-jordan',
      shipment: {
        id: 'ship-cust-1',
        booking_id: 'CV-900001',
        customer_id: 'usr-cust-jordan',
        assigned_operations_user_id: 'usr-ops1',
        origin: 'Shanghai Port',
        origin_code: 'CNSHA',
        destination: 'Port of Los Angeles',
        destination_code: 'USLAX',
        carrier: 'Maersk Line',
        vessel: 'Madrid Maersk',
        voyage_number: '2412E',
        container_count: 8,
        container_type: "40' High Cube",
        cargo_description: 'Modular Hardwood Living Room Furniture & Scandinavian Desks',
        status: 'In Transit',
        progress: 65,
        estimated_departure_date: '2026-10-04T08:00:00Z',
        estimated_arrival_date: '2026-10-23T18:00:00Z',
        revised_estimated_arrival_date: null,
        delay_days: 0,
        delay_reason: null,
        operational_notes: 'Priority showroom consignment for West Coast retail distribution.',
        customer_name: 'Jordan Miller',
        customer_company: 'NorthStar Home Living Ltd.',
        customer_email: 'jordan@northstarhome.com',
        assigned_ops_name: 'Marcus Vance',
        created_at: '2026-09-28T10:00:00Z',
        updated_at: '2026-10-15T14:00:00Z',
      },
    },
    {
      customerId: 'usr-cust-apex',
      shipment: {
        id: 'ship-cust-2',
        booking_id: 'CV-900002',
        customer_id: 'usr-cust-apex',
        assigned_operations_user_id: 'usr-ops1',
        origin: 'Ningbo-Zhoushan',
        origin_code: 'CNNGB',
        destination: 'Port of Long Beach',
        destination_code: 'USLGB',
        carrier: 'MSC Mediterranean Shipping Co',
        vessel: 'MSC Oscar',
        voyage_number: 'MS904W',
        container_count: 5,
        container_type: "40' High Cube",
        cargo_description: 'Precision Microcontroller Chips & Semiconductor Assemblies',
        status: 'Delayed',
        progress: 48,
        estimated_departure_date: '2026-10-01T12:00:00Z',
        estimated_arrival_date: '2026-10-19T20:00:00Z',
        revised_estimated_arrival_date: '2026-10-24T14:00:00Z',
        delay_days: 5,
        delay_reason: 'Berth congestion and fog advisory at intermediate transshipment hub.',
        operational_notes: 'Consignee notified of +5 days schedule delay. Revised ETA tracked daily.',
        customer_name: 'Tariq Hassan',
        customer_company: 'Apex Electronics & Semiconductors',
        customer_email: 'tariq@apextechnologies.io',
        assigned_ops_name: 'Marcus Vance',
        created_at: '2026-09-25T11:00:00Z',
        updated_at: '2026-10-16T09:00:00Z',
      },
    },
    {
      customerId: 'usr-cust-pacific',
      shipment: {
        id: 'ship-cust-3',
        booking_id: 'CV-900003',
        customer_id: 'usr-cust-pacific',
        assigned_operations_user_id: 'usr-ops3',
        origin: 'Shenzhen Port',
        origin_code: 'CNSZX',
        destination: 'Port of Felixstowe',
        destination_code: 'GBFXT',
        carrier: 'CMA CGM Group',
        vessel: 'CMA CGM Concorde',
        voyage_number: 'FR8810',
        container_count: 10,
        container_type: "40' Standard Dry",
        cargo_description: 'Cold-Pressed Organic Teas & Hand-Glazed Ceramic Tableware',
        status: 'Arriving Soon',
        progress: 92,
        estimated_departure_date: '2026-09-28T06:00:00Z',
        estimated_arrival_date: '2026-10-20T10:00:00Z',
        revised_estimated_arrival_date: null,
        delay_days: 0,
        delay_reason: null,
        operational_notes: 'Harbor pilotage ordered for Felixstowe Trinity terminal berthing.',
        customer_name: 'Mei-Ling Zhou',
        customer_company: 'Pacific Rim Specialty Imports',
        customer_email: 'ml.zhou@pacificrimimports.com',
        assigned_ops_name: 'Devon Kross',
        created_at: '2026-09-20T14:00:00Z',
        updated_at: '2026-10-18T08:00:00Z',
      },
    },
    {
      customerId: 'usr-cust-horizon',
      shipment: {
        id: 'ship-cust-4',
        booking_id: 'CV-900004',
        customer_id: 'usr-cust-horizon',
        assigned_operations_user_id: 'usr-ops2',
        origin: 'Shanghai Port',
        origin_code: 'CNSHA',
        destination: 'Port of New York & New Jersey',
        destination_code: 'USNYC',
        carrier: 'COSCO Shipping Lines',
        vessel: 'COSCO Shipping Universe',
        voyage_number: 'CS0144',
        container_count: 6,
        container_type: "40' High Cube",
        cargo_description: 'High-Density Wool Area Rugs & Woven Jute Floor Runners',
        status: 'Delivered',
        progress: 100,
        estimated_departure_date: '2026-09-02T14:00:00Z',
        estimated_arrival_date: '2026-09-28T16:00:00Z',
        revised_estimated_arrival_date: null,
        delay_days: 0,
        delay_reason: null,
        operational_notes: 'Final physical delivery receipt signed by warehouse dock manager.',
        customer_name: 'Carlos Mendez',
        customer_company: 'Horizon Retail Global Group',
        customer_email: 'carlos@horizonretail.com',
        assigned_ops_name: 'Sarah Chen',
        created_at: '2026-08-25T16:00:00Z',
        updated_at: '2026-09-29T10:00:00Z',
      },
    },
    {
      customerId: 'usr-cust-bluewave',
      shipment: {
        id: 'ship-cust-5',
        booking_id: 'CV-900005',
        customer_id: 'usr-cust-bluewave',
        assigned_operations_user_id: 'usr-ops1',
        origin: 'Port of Singapore',
        origin_code: 'SGSIN',
        destination: 'Port of Rotterdam',
        destination_code: 'NLRTM',
        carrier: 'Ocean Network Express (ONE)',
        vessel: 'ONE Triumph',
        voyage_number: 'ON3321',
        container_count: 4,
        container_type: "40' Reefer",
        cargo_description: 'Cold-Chain Temperature Controlled Biological Vaccines (-20C)',
        status: 'In Transit',
        progress: 40,
        estimated_departure_date: '2026-10-10T10:00:00Z',
        estimated_arrival_date: '2026-10-29T18:00:00Z',
        revised_estimated_arrival_date: null,
        delay_days: 0,
        delay_reason: null,
        operational_notes: 'Continuous data logger active. Temperature maintained at -20C.',
        customer_name: 'Dr. Evelyn Ward',
        customer_company: 'BlueWave Pharmaceuticals',
        customer_email: 'eward@bluewavepharma.com',
        assigned_ops_name: 'Marcus Vance',
        created_at: '2026-10-02T09:00:00Z',
        updated_at: '2026-10-14T09:00:00Z',
      },
    },
    {
      customerId: 'usr-cust-atlas',
      shipment: {
        id: 'ship-cust-6',
        booking_id: 'CV-900006',
        customer_id: 'usr-cust-atlas',
        assigned_operations_user_id: 'usr-ops1',
        origin: 'Port of Hamburg',
        origin_code: 'DEHAM',
        destination: 'Jebel Ali Port (Dubai)',
        destination_code: 'AEJEA',
        carrier: 'Hapag-Lloyd',
        vessel: 'Berlin Express',
        voyage_number: 'HL7732',
        container_count: 7,
        container_type: "40' High Cube",
        cargo_description: 'Hydraulic Excavator Rotary Actuators & Industrial Gantry Parts',
        status: 'In Transit',
        progress: 58,
        estimated_departure_date: '2026-10-06T09:00:00Z',
        estimated_arrival_date: '2026-10-25T12:00:00Z',
        revised_estimated_arrival_date: null,
        delay_days: 0,
        delay_reason: null,
        operational_notes: 'Suez canal transit completed successfully on planned timetable.',
        customer_name: 'Klaus Mueller',
        customer_company: 'Atlas Heavy Machinery GmbH',
        customer_email: 'klaus.m@atlasheavyindustries.de',
        assigned_ops_name: 'Marcus Vance',
        created_at: '2026-10-01T12:00:00Z',
        updated_at: '2026-10-14T11:00:00Z',
      },
    },
    {
      customerId: 'usr-cust-nordic',
      shipment: {
        id: 'ship-cust-7',
        booking_id: 'CV-900007',
        customer_id: 'usr-cust-nordic',
        assigned_operations_user_id: 'usr-ops4',
        origin: 'Port of Antwerp-Bruges',
        origin_code: 'BEANR',
        destination: 'Port of Savannah',
        destination_code: 'USSAV',
        carrier: 'Evergreen Marine Corp',
        vessel: 'Ever Given',
        voyage_number: 'EG1020',
        container_count: 6,
        container_type: "40' High Cube",
        cargo_description: 'FSC-Certified Northern Pine Sawn Lumber & Kraft Pulp Bales',
        status: 'Booking Confirmed',
        progress: 15,
        estimated_departure_date: '2026-10-25T10:00:00Z',
        estimated_arrival_date: '2026-11-10T16:00:00Z',
        revised_estimated_arrival_date: null,
        delay_days: 0,
        delay_reason: null,
        operational_notes: 'Origin terminal container gate-in scheduled for Friday.',
        customer_name: 'Astrid Lind',
        customer_company: 'Nordic Timber & Pulp Ltd',
        customer_email: 'astrid@nordictimberltd.se',
        assigned_ops_name: 'Aisha Al-Mansoor',
        created_at: '2026-10-16T10:00:00Z',
        updated_at: '2026-10-16T10:00:00Z',
      },
    },
    {
      customerId: 'usr-cust-solis',
      shipment: {
        id: 'ship-cust-8',
        booking_id: 'CV-900008',
        customer_id: 'usr-cust-solis',
        assigned_operations_user_id: 'usr-ops3',
        origin: 'Port of Busan',
        origin_code: 'KRPUS',
        destination: 'Port of Los Angeles',
        destination_code: 'USLAX',
        carrier: 'Yang Ming Marine Transport',
        vessel: 'YM Wellhead',
        voyage_number: 'YM4411',
        container_count: 9,
        container_type: "40' High Cube",
        cargo_description: 'Monocrystalline Bifacial Solar Modules & Power Inverters',
        status: 'In Transit',
        progress: 72,
        estimated_departure_date: '2026-10-02T14:00:00Z',
        estimated_arrival_date: '2026-10-21T16:00:00Z',
        revised_estimated_arrival_date: null,
        delay_days: 0,
        delay_reason: null,
        operational_notes: 'Customs electronic pre-arrival manifest verified.',
        customer_name: 'Mateo Rossi',
        customer_company: 'Solis Renewable Solar Systems',
        customer_email: 'mateo@solissolarenergy.it',
        assigned_ops_name: 'Devon Kross',
        created_at: '2026-09-28T09:00:00Z',
        updated_at: '2026-10-17T11:00:00Z',
      },
    },
    {
      customerId: 'usr-cust-zenith',
      shipment: {
        id: 'ship-cust-9',
        booking_id: 'CV-900009',
        customer_id: 'usr-cust-zenith',
        assigned_operations_user_id: 'usr-ops4',
        origin: 'Jawaharlal Nehru Port (Mumbai)',
        origin_code: 'INBOM',
        destination: 'Port of Valencia',
        destination_code: 'ESVLC',
        carrier: 'MSC Mediterranean Shipping Co',
        vessel: 'MSC Gulsun',
        voyage_number: 'MS308E',
        container_count: 8,
        container_type: "20' Standard Dry",
        cargo_description: 'Organic Combed Cotton Spinning Yarn & Loom Woven Linens',
        status: 'Delivered',
        progress: 100,
        estimated_departure_date: '2026-09-12T10:00:00Z',
        estimated_arrival_date: '2026-10-04T18:00:00Z',
        revised_estimated_arrival_date: null,
        delay_days: 0,
        delay_reason: null,
        operational_notes: 'All containers unloaded and delivered to Valencia central warehouse.',
        customer_name: 'Priya Sharma',
        customer_company: 'Zenith Organic Textiles Ltd',
        customer_email: 'psharma@zenithapparel.in',
        assigned_ops_name: 'Aisha Al-Mansoor',
        created_at: '2026-09-05T10:00:00Z',
        updated_at: '2026-10-05T12:00:00Z',
      },
    },
  ];

  for (const cs of customerShipments) {
    shipments.push(cs.shipment);
  }

  // Additional fleet shipments for Operations testing of multi-carrier routes
  const additionalOperationsShipments: Shipment[] = [
    {
      id: 'ship-ops-10',
      booking_id: 'CV-900010',
      customer_id: 'usr-ops-pool',
      assigned_operations_user_id: 'usr-ops1',
      origin: 'Shanghai Port',
      origin_code: 'CNSHA',
      destination: 'Port of Los Angeles',
      destination_code: 'USLAX',
      carrier: 'CMA CGM Group',
      vessel: 'CMA CGM Jacques Saad',
      voyage_number: 'FR9200',
      container_count: 14,
      container_type: "40' High Cube",
      cargo_description: 'Consumer Electronics & Smart Household Appliances',
      status: 'In Transit',
      progress: 50,
      estimated_departure_date: '2026-10-08T08:00:00Z',
      estimated_arrival_date: '2026-10-24T18:00:00Z',
      revised_estimated_arrival_date: null,
      delay_days: 0,
      delay_reason: null,
      operational_notes: 'Consignment allocated under Compass Global master agreement.',
      customer_name: 'Enterprise Pool Client A',
      customer_company: 'Pacific Trans-Ocean Logistics Ltd.',
      customer_email: 'fleet@pacificocean.com',
      assigned_ops_name: 'Marcus Vance',
      created_at: '2026-10-02T10:00:00Z',
      updated_at: '2026-10-15T10:00:00Z',
    },
    {
      id: 'ship-ops-11',
      booking_id: 'CV-900011',
      customer_id: 'usr-ops-pool',
      assigned_operations_user_id: 'usr-ops2',
      origin: 'Shanghai Port',
      origin_code: 'CNSHA',
      destination: 'Port of Los Angeles',
      destination_code: 'USLAX',
      carrier: 'COSCO Shipping Lines',
      vessel: 'COSCO Shipping Nebula',
      voyage_number: 'CS8810',
      container_count: 12,
      container_type: "40' Standard Dry",
      cargo_description: 'Industrial Fasteners & Stainless Steel Hardware',
      status: 'In Transit',
      progress: 55,
      estimated_departure_date: '2026-10-05T08:00:00Z',
      estimated_arrival_date: '2026-10-22T18:00:00Z',
      revised_estimated_arrival_date: null,
      delay_days: 0,
      delay_reason: null,
      operational_notes: 'Heavy weight container permit granted by Port of LA.',
      customer_name: 'Enterprise Pool Client B',
      customer_company: 'Global Industrial Hardware Corp',
      customer_email: 'logistics@globalhardware.com',
      assigned_ops_name: 'Sarah Chen',
      created_at: '2026-10-01T10:00:00Z',
      updated_at: '2026-10-15T10:00:00Z',
    },
    {
      id: 'ship-ops-12',
      booking_id: 'CV-900012',
      customer_id: 'usr-ops-pool',
      assigned_operations_user_id: 'usr-ops3',
      origin: 'Shanghai Port',
      origin_code: 'CNSHA',
      destination: 'Port of Los Angeles',
      destination_code: 'USLAX',
      carrier: 'Hapag-Lloyd',
      vessel: 'Al Jmeliyah',
      voyage_number: 'HL3310',
      container_count: 6,
      container_type: "40' High Cube",
      cargo_description: 'Precision Medical Equipment & Imaging Sensors',
      status: 'Arriving Soon',
      progress: 88,
      estimated_departure_date: '2026-09-30T08:00:00Z',
      estimated_arrival_date: '2026-10-20T14:00:00Z',
      revised_estimated_arrival_date: null,
      delay_days: 0,
      delay_reason: null,
      operational_notes: 'Berth allocation confirmed at Pier 400.',
      customer_name: 'Enterprise Pool Client C',
      customer_company: 'BioTech Precision Instruments',
      customer_email: 'supply@biotechprecision.com',
      assigned_ops_name: 'Devon Kross',
      created_at: '2026-09-24T10:00:00Z',
      updated_at: '2026-10-18T10:00:00Z',
    },
    {
      id: 'ship-ops-13',
      booking_id: 'CV-900013',
      customer_id: 'usr-ops-pool',
      assigned_operations_user_id: 'usr-ops1',
      origin: 'Port of Singapore',
      origin_code: 'SGSIN',
      destination: 'Port of Rotterdam',
      destination_code: 'NLRTM',
      carrier: 'Maersk Line',
      vessel: 'Munich Maersk',
      voyage_number: '2418W',
      container_count: 10,
      container_type: "40' High Cube",
      cargo_description: 'Electronics & Advanced Telecommunications Gear',
      status: 'In Transit',
      progress: 60,
      estimated_departure_date: '2026-10-03T10:00:00Z',
      estimated_arrival_date: '2026-10-22T18:00:00Z',
      revised_estimated_arrival_date: null,
      delay_days: 0,
      delay_reason: null,
      operational_notes: 'Direct Asia-Europe express service line.',
      customer_name: 'Enterprise Pool Client D',
      customer_company: 'EuroAsia Distribution NV',
      customer_email: 'ops@euroasiadist.com',
      assigned_ops_name: 'Marcus Vance',
      created_at: '2026-09-27T10:00:00Z',
      updated_at: '2026-10-16T10:00:00Z',
    },
    {
      id: 'ship-ops-14',
      booking_id: 'CV-900014',
      customer_id: 'usr-ops-pool',
      assigned_operations_user_id: 'usr-ops2',
      origin: 'Port of Singapore',
      origin_code: 'SGSIN',
      destination: 'Port of Rotterdam',
      destination_code: 'NLRTM',
      carrier: 'CMA CGM Group',
      vessel: 'CMA CGM Jacques Saad',
      voyage_number: 'FR4400',
      container_count: 8,
      container_type: "40' Standard Dry",
      cargo_description: 'Automotive Sub-Assemblies & Braking Systems',
      status: 'In Transit',
      progress: 52,
      estimated_departure_date: '2026-10-06T10:00:00Z',
      estimated_arrival_date: '2026-10-26T18:00:00Z',
      revised_estimated_arrival_date: null,
      delay_days: 0,
      delay_reason: null,
      operational_notes: 'Bunker refueling completed at Colombo anchorage.',
      customer_name: 'Enterprise Pool Client E',
      customer_company: 'Rotterdam Auto Importers BV',
      customer_email: 'shipping@rotterdambv.nl',
      assigned_ops_name: 'Sarah Chen',
      created_at: '2026-09-30T10:00:00Z',
      updated_at: '2026-10-15T10:00:00Z',
    },
    {
      id: 'ship-ops-15',
      booking_id: 'CV-900015',
      customer_id: 'usr-ops-pool',
      assigned_operations_user_id: 'usr-ops1',
      origin: 'Ningbo-Zhoushan',
      origin_code: 'CNNGB',
      destination: 'Port of New York & New Jersey',
      destination_code: 'USNYC',
      carrier: 'Hapag-Lloyd',
      vessel: 'Berlin Express',
      voyage_number: 'HL9910',
      container_count: 15,
      container_type: "40' High Cube",
      cargo_description: 'Apparel & Autumn Footwear Retail Consignments',
      status: 'In Transit',
      progress: 45,
      estimated_departure_date: '2026-10-04T12:00:00Z',
      estimated_arrival_date: '2026-10-28T18:00:00Z',
      revised_estimated_arrival_date: null,
      delay_days: 0,
      delay_reason: null,
      operational_notes: 'All-water Panama route with trans-Panama clearance verified.',
      customer_name: 'Enterprise Pool Client F',
      customer_company: 'Atlantic Retail Distribution LLC',
      customer_email: 'logistics@atlanticretail.com',
      assigned_ops_name: 'Marcus Vance',
      created_at: '2026-09-29T10:00:00Z',
      updated_at: '2026-10-15T10:00:00Z',
    },
  ];

  for (const s of additionalOperationsShipments) {
    shipments.push(s);
  }

  // Generate milestone events and schedules for all shipments
  let eventIdCounter = 1;
  let scheduleIdCounter = 1;
  let notifIdCounter = 1;

  for (const s of shipments) {
    // 1. Booking Confirmed
    events.push({
      id: `ev-${eventIdCounter++}`,
      shipment_id: s.id,
      title: 'Booking Confirmed & Allocation Issued',
      description: `Carrier booking approved by ${s.carrier} for voyage ${s.voyage_number}. Equipment release order generated.`,
      location: s.origin,
      event_date: new Date(new Date(s.estimated_departure_date).getTime() - 86400000 * 5).toISOString(),
      event_type: 'booking_confirmed',
      confirmed: 1,
      created_at: new Date().toISOString(),
    });

    if (s.status !== 'Booking Confirmed') {
      events.push({
        id: `ev-${eventIdCounter++}`,
        shipment_id: s.id,
        title: 'Cargo Received & Terminal Gate-In',
        description: `${s.container_count}x ${s.container_type} containers gated in at ${s.origin} terminal facility. Export seal verified.`,
        location: s.origin,
        event_date: new Date(new Date(s.estimated_departure_date).getTime() - 86400000 * 2).toISOString(),
        event_type: 'gate_in',
        confirmed: 1,
        created_at: new Date().toISOString(),
      });

      events.push({
        id: `ev-${eventIdCounter++}`,
        shipment_id: s.id,
        title: 'Export Customs Clearance Passed',
        description: 'Electronic customs manifest released and verified by national port authority.',
        location: s.origin,
        event_date: new Date(new Date(s.estimated_departure_date).getTime() - 86400000 * 1).toISOString(),
        event_type: 'customs_cleared',
        confirmed: 1,
        created_at: new Date().toISOString(),
      });

      events.push({
        id: `ev-${eventIdCounter++}`,
        shipment_id: s.id,
        title: 'Vessel Loaded & Departed POL',
        description: `Containers loaded aboard MV ${s.vessel} (Voyage ${s.voyage_number}). Ocean passage commenced toward ${s.destination_code}.`,
        location: s.origin,
        event_date: s.estimated_departure_date,
        event_type: 'departed',
        confirmed: 1,
        created_at: new Date().toISOString(),
      });
    }

    if (s.delay_days > 0) {
      events.push({
        id: `ev-${eventIdCounter++}`,
        shipment_id: s.id,
        title: `Operational Delay Advisory: +${s.delay_days} Days`,
        description: `${s.delay_reason} Updated arrival ETA recalculated to ${new Date(s.revised_estimated_arrival_date || s.estimated_arrival_date).toLocaleDateString()}.`,
        location: 'Mid-Ocean Passage / Anchorage Zone',
        event_date: '2026-10-14T15:30:00Z',
        event_type: 'delay',
        confirmed: 1,
        created_at: new Date().toISOString(),
      });

      // Notification
      notifications.push({
        id: `notif-${notifIdCounter++}`,
        user_id: s.customer_id,
        shipment_id: s.id,
        booking_id: s.booking_id,
        origin_code: s.origin_code,
        destination_code: s.destination_code,
        title: `Schedule Delay Notice: ${s.booking_id}`,
        message: `Booking ${s.booking_id} (${s.origin_code} → ${s.destination_code}) has incurred a ${s.delay_days}-day delay. Reason: ${s.delay_reason}`,
        type: 'delay',
        is_read: false,
        created_at: new Date().toISOString(),
      });
    }

    if (s.status === 'Arriving Soon' || s.status === 'Delivered') {
      events.push({
        id: `ev-${eventIdCounter++}`,
        shipment_id: s.id,
        title: 'Arrival at Destination Outer Anchorage',
        description: `MV ${s.vessel} arrived at destination waters of ${s.destination}. Harbor pilotage dispatched.`,
        location: s.destination,
        event_date: s.estimated_arrival_date,
        event_type: 'arrived',
        confirmed: 1,
        created_at: new Date().toISOString(),
      });
    }

    if (s.status === 'Delivered') {
      events.push({
        id: `ev-${eventIdCounter++}`,
        shipment_id: s.id,
        title: 'Import Clearance & Container Delivery Complete',
        description: `Consignee dock acknowledged physical delivery receipt with no exceptions. Equipment returned empty.`,
        location: s.destination,
        event_date: new Date(new Date(s.estimated_arrival_date).getTime() + 86400000 * 2).toISOString(),
        event_type: 'delivered',
        confirmed: 1,
        created_at: new Date().toISOString(),
      });
    }

    // Associated transportation schedules
    const milestones = [
      { name: 'Equipment Release & Origin Gate-In', offsetDays: -2 },
      { name: 'Vessel Departure (POL)', offsetDays: 0 },
      { name: 'Destination Port Berthing (POD)', offsetDays: 14 },
      { name: 'Final Consignee Delivery', offsetDays: 17 },
    ];

    for (const m of milestones) {
      const plannedDate = new Date(new Date(s.estimated_departure_date).getTime() + 86400000 * m.offsetDays).toISOString();
      let status: 'Pending' | 'In Progress' | 'Completed' | 'Delayed' = 'Pending';
      let actualDate: string | null = null;

      if (s.status === 'Delivered') {
        status = 'Completed';
        actualDate = plannedDate;
      } else if (s.status === 'In Transit') {
        if (m.offsetDays <= 0) {
          status = 'Completed';
          actualDate = plannedDate;
        } else if (m.offsetDays === 14) {
          status = s.delay_days > 0 ? 'Delayed' : 'In Progress';
        }
      } else if (s.status === 'Delayed') {
        if (m.offsetDays <= 0) {
          status = 'Completed';
          actualDate = plannedDate;
        } else {
          status = 'Delayed';
        }
      }

      schedules.push({
        id: `sch-${scheduleIdCounter++}`,
        shipment_id: s.id,
        assigned_operations_user_id: s.assigned_operations_user_id,
        milestone: m.name,
        planned_date: plannedDate,
        revised_date: s.revised_estimated_arrival_date && m.offsetDays >= 14 ? s.revised_estimated_arrival_date : null,
        actual_date: actualDate,
        status,
        notes: `Carrier rotation line: ${s.carrier}`,
        carrier: s.carrier,
      });
    }
  }

  // Carrier Schedule Options Dataset (for Carrier Comparison & Recommendation)
  const carrierOptions: CarrierScheduleOption[] = [
    // Shanghai (CNSHA) -> Los Angeles (USLAX)
    {
      id: 'opt-sha-lax-1',
      carrier: 'Maersk Line',
      origin_code: 'CNSHA',
      origin_name: 'Shanghai Port',
      destination_code: 'USLAX',
      destination_name: 'Port of Los Angeles',
      vessel: 'Madrid Maersk',
      voyage_number: '2412E',
      etd: '2026-10-25T08:00:00Z',
      eta: '2026-11-08T18:00:00Z',
      transit_days: 14,
      frequency: '2x Weekly Direct',
      service_type: 'Direct Express',
      reliability_score: 96,
      quoted_cost_usd: 2450,
      delay_risk: 'Low',
      notes: 'Dedicated Pacific Express loop with priority berth reservation at Pier 400.',
    },
    {
      id: 'opt-sha-lax-2',
      carrier: 'CMA CGM Group',
      origin_code: 'CNSHA',
      origin_name: 'Shanghai Port',
      destination_code: 'USLAX',
      destination_name: 'Port of Los Angeles',
      vessel: 'CMA CGM Jacques Saad',
      voyage_number: 'FR9200',
      etd: '2026-10-27T08:00:00Z',
      eta: '2026-11-12T18:00:00Z',
      transit_days: 16,
      frequency: 'Weekly Direct',
      service_type: 'Standard Direct',
      reliability_score: 91,
      quoted_cost_usd: 2280,
      delay_risk: 'Low',
      notes: 'LNG dual-fuel ultra large container vessel with modern emission rating.',
    },
    {
      id: 'opt-sha-lax-3',
      carrier: 'COSCO Shipping Lines',
      origin_code: 'CNSHA',
      origin_name: 'Shanghai Port',
      destination_code: 'USLAX',
      destination_name: 'Port of Los Angeles',
      vessel: 'COSCO Shipping Nebula',
      voyage_number: 'CS8810',
      etd: '2026-10-24T08:00:00Z',
      eta: '2026-11-11T18:00:00Z',
      transit_days: 18,
      frequency: 'Weekly Direct',
      service_type: 'Standard Direct',
      reliability_score: 87,
      quoted_cost_usd: 2150,
      delay_risk: 'Moderate',
      notes: 'Economic rate option with intermediate bunkering stop.',
    },
    {
      id: 'opt-sha-lax-4',
      carrier: 'Hapag-Lloyd',
      origin_code: 'CNSHA',
      origin_name: 'Shanghai Port',
      destination_code: 'USLAX',
      destination_name: 'Port of Los Angeles',
      vessel: 'Al Jmeliyah',
      voyage_number: 'HL3310',
      etd: '2026-10-26T08:00:00Z',
      eta: '2026-11-15T18:00:00Z',
      transit_days: 20,
      frequency: 'Weekly via Busan',
      service_type: 'Transshipment Hub',
      reliability_score: 84,
      quoted_cost_usd: null,
      delay_risk: 'Moderate',
      notes: 'Transshipment through Busan terminal. Pricing quote upon spot request.',
    },
    // Singapore (SGSIN) -> Rotterdam (NLRTM)
    {
      id: 'opt-sg-rtm-1',
      carrier: 'Maersk Line',
      origin_code: 'SGSIN',
      origin_name: 'Port of Singapore',
      destination_code: 'NLRTM',
      destination_name: 'Port of Rotterdam',
      vessel: 'Munich Maersk',
      voyage_number: '2418W',
      etd: '2026-10-28T10:00:00Z',
      eta: '2026-11-16T18:00:00Z',
      transit_days: 19,
      frequency: '2x Weekly Direct',
      service_type: 'Direct Express',
      reliability_score: 94,
      quoted_cost_usd: 3100,
      delay_risk: 'Low',
      notes: 'Fastest direct rotation on Asia-Europe loop via Suez Canal.',
    },
    {
      id: 'opt-sg-rtm-2',
      carrier: 'Ocean Network Express (ONE)',
      origin_code: 'SGSIN',
      origin_name: 'Port of Singapore',
      destination_code: 'NLRTM',
      destination_name: 'Port of Rotterdam',
      vessel: 'ONE Triumph',
      voyage_number: 'ON3321',
      etd: '2026-10-26T10:00:00Z',
      eta: '2026-11-16T18:00:00Z',
      transit_days: 21,
      frequency: 'Weekly Direct',
      service_type: 'Standard Direct',
      reliability_score: 89,
      quoted_cost_usd: 2850,
      delay_risk: 'Low',
      notes: 'Specialized reefer monitoring infrastructure with active smart sensors.',
    },
    {
      id: 'opt-sg-rtm-3',
      carrier: 'CMA CGM Group',
      origin_code: 'SGSIN',
      origin_name: 'Port of Singapore',
      destination_code: 'NLRTM',
      destination_name: 'Port of Rotterdam',
      vessel: 'CMA CGM Concorde',
      voyage_number: 'FR4400',
      etd: '2026-10-30T10:00:00Z',
      eta: '2026-11-23T18:00:00Z',
      transit_days: 24,
      frequency: 'Weekly with Colombo stop',
      service_type: 'Standard Rotation',
      reliability_score: null,
      quoted_cost_usd: 2700,
      delay_risk: 'Moderate',
      notes: 'Historical reliability metrics undergoing port performance audit.',
    },
    // Ningbo-Zhoushan (CNNGB) -> New York (USNYC)
    {
      id: 'opt-ngb-nyc-1',
      carrier: 'Hapag-Lloyd',
      origin_code: 'CNNGB',
      origin_name: 'Ningbo-Zhoushan',
      destination_code: 'USNYC',
      destination_name: 'Port of New York & New Jersey',
      vessel: 'Berlin Express',
      voyage_number: 'HL9910',
      etd: '2026-10-25T12:00:00Z',
      eta: '2026-11-18T18:00:00Z',
      transit_days: 24,
      frequency: 'Weekly Direct',
      service_type: 'All-Water Direct',
      reliability_score: 93,
      quoted_cost_usd: 3600,
      delay_risk: 'Low',
      notes: 'All-water direct transit through Panama Canal locks to Maher Terminal.',
    },
    {
      id: 'opt-ngb-nyc-2',
      carrier: 'COSCO Shipping Lines',
      origin_code: 'CNNGB',
      origin_name: 'Ningbo-Zhoushan',
      destination_code: 'USNYC',
      destination_name: 'Port of New York & New Jersey',
      vessel: 'COSCO Shipping Universe',
      voyage_number: 'CS0144',
      etd: '2026-10-27T12:00:00Z',
      eta: '2026-11-23T18:00:00Z',
      transit_days: 27,
      frequency: 'Weekly',
      service_type: 'Standard Service',
      reliability_score: 86,
      quoted_cost_usd: 3350,
      delay_risk: 'Moderate',
      notes: 'High capacity carrier rotation with flexible container positioning.',
    },
    // Shenzhen (CNSZX) -> Felixstowe (GBFXT)
    {
      id: 'opt-szx-fxt-1',
      carrier: 'CMA CGM Group',
      origin_code: 'CNSZX',
      origin_name: 'Shenzhen Port',
      destination_code: 'GBFXT',
      destination_name: 'Port of Felixstowe',
      vessel: 'CMA CGM Concorde',
      voyage_number: 'FR8810',
      etd: '2026-10-26T06:00:00Z',
      eta: '2026-11-17T12:00:00Z',
      transit_days: 22,
      frequency: 'Weekly Direct',
      service_type: 'Direct Express',
      reliability_score: 92,
      quoted_cost_usd: 2950,
      delay_risk: 'Low',
      notes: 'Direct UK call with pre-cleared Trinity Terminal berthing window.',
    },
    {
      id: 'opt-szx-fxt-2',
      carrier: 'Evergreen Marine Corp',
      origin_code: 'CNSZX',
      origin_name: 'Shenzhen Port',
      destination_code: 'GBFXT',
      destination_name: 'Port of Felixstowe',
      vessel: 'Ever Given',
      voyage_number: 'EG1020',
      etd: '2026-10-29T06:00:00Z',
      eta: '2026-11-24T12:00:00Z',
      transit_days: 26,
      frequency: 'Weekly',
      service_type: 'Standard Direct',
      reliability_score: 88,
      quoted_cost_usd: 2750,
      delay_risk: 'Moderate',
      notes: 'Ocean Alliance joint rotation line.',
    },
  ];

  return {
    users: INITIAL_USERS,
    ports: INITIAL_PORTS,
    shipments,
    events,
    schedules,
    carrierOptions,
    notifications,
    version: 7,
  };
}

class LocalRepository {
  private data: StorageSchema;

  constructor() {
    this.data = this.loadOrSeed();
  }

  private loadOrSeed(): StorageSchema {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StorageSchema;
        if (parsed.version === 7 && parsed.shipments?.length > 0 && parsed.carrierOptions?.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('LocalStorage error or old version, re-seeding demo store:', e);
    }
    const initial = buildInitialData();
    this.saveData(initial);
    return initial;
  }

  private saveData(data: StorageSchema): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      this.data = data;
    } catch (e) {
      console.error('Failed to save data to localStorage:', e);
    }
  }

  public resetToCleanDemo(): void {
    const fresh = buildInitialData();
    this.saveData(fresh);
  }

  // Session Management
  public getActiveUser(): User | null {
    try {
      const stored = localStorage.getItem(CURRENT_SESSION_KEY);
      if (stored) {
        const user = JSON.parse(stored) as User;
        const found = this.data.users.find((u) => u.id === user.id);
        if (found && found.is_active) {
          return found;
        }
      }
    } catch (e) {}
    // Default to Jordan Miller (Customer 1: NorthStar Home Living Ltd.)
    const defaultUser = this.data.users.find((u) => u.id === 'usr-cust-jordan') || this.data.users[0];
    this.setActiveUser(defaultUser);
    return defaultUser;
  }

  public setActiveUser(user: User | null): void {
    if (user) {
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_SESSION_KEY);
    }
  }

  public authenticate(email: string, pass: string): { success: boolean; user?: User; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const user = this.data.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return { success: false, error: 'Invalid email address or account not found.' };
    }
    if (!user.is_active) {
      return { success: false, error: 'This account has been deactivated. Contact Operations administrator.' };
    }
    if (pass !== 'compassvoyage2024') {
      return { success: false, error: 'Invalid password. (Hint: use demo password compassvoyage2024)' };
    }
    this.setActiveUser(user);
    return { success: true, user };
  }

  // Data Queries
  public getPorts(): Port[] {
    return this.data.ports;
  }

  public getUsers(filters?: { role?: string; active?: string; search?: string }): User[] {
    return this.data.users
      .filter((u) => {
        if (filters?.role && filters.role !== 'all' && u.role !== filters.role) return false;
        if (filters?.active !== undefined && filters.active !== 'all') {
          const isActive = filters.active === 'true';
          if (u.is_active !== isActive) return false;
        }
        if (filters?.search?.trim()) {
          const q = filters.search.toLowerCase().trim();
          return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.company.toLowerCase().includes(q);
        }
        return true;
      })
      .map((u) => {
        const count = this.data.shipments.filter((s) => s.customer_id === u.id).length;
        return { ...u, shipment_count: count };
      });
  }

  public createUser(user: Omit<User, 'id' | 'created_at'>): User {
    const id = `usr-${Date.now()}`;
    const newUser: User = {
      ...user,
      id,
      created_at: new Date().toISOString(),
    };
    const updatedUsers = [newUser, ...this.data.users];
    this.saveData({ ...this.data, users: updatedUsers });
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>): void {
    const updatedUsers = this.data.users.map((u) => (u.id === id ? { ...u, ...updates } : u));
    this.saveData({ ...this.data, users: updatedUsers });
  }

  // STRICT SINGLE-CUSTOMER SHIPMENT RETRIEVAL
  public getCustomerAssignedShipment(customerId: string): Shipment | null {
    return this.data.shipments.find((s) => s.customer_id === customerId) || null;
  }

  // Shipments List
  public getShipments(params: {
    customerId?: string;
    role?: 'operations' | 'customer';
    status?: string;
    originCode?: string;
    destinationCode?: string;
    carrier?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): { shipments: Shipment[]; total: number } {
    let filtered = [...this.data.shipments];

    // STRICT CUSTOMER ISOLATION: A customer only sees their single assigned shipment!
    if (params.role === 'customer' || params.customerId) {
      const targetId = params.customerId;
      filtered = filtered.filter((s) => s.customer_id === targetId);
    }
    if (params.status && params.status !== 'all') {
      filtered = filtered.filter((s) => s.status === params.status);
    }
    if (params.originCode && params.originCode !== 'all') {
      filtered = filtered.filter((s) => s.origin_code === params.originCode);
    }
    if (params.destinationCode && params.destinationCode !== 'all') {
      filtered = filtered.filter((s) => s.destination_code === params.destinationCode);
    }
    if (params.carrier && params.carrier !== 'all') {
      filtered = filtered.filter((s) => s.carrier === params.carrier);
    }
    if (params.search?.trim()) {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(
        (s) =>
          s.booking_id.toLowerCase().includes(q) ||
          s.vessel.toLowerCase().includes(q) ||
          s.voyage_number.toLowerCase().includes(q) ||
          s.cargo_description.toLowerCase().includes(q)
      );
    }

    const total = filtered.length;
    const offset = params.offset || 0;
    const limit = params.limit || 50;
    const paginated = filtered.slice(offset, offset + limit);
    return { shipments: paginated, total };
  }

  public getShipmentById(idOrBooking: string, currentUser?: User | null): { shipment: Shipment; events: ShipmentEvent[]; schedules: Schedule[] } | null {
    const shipment = this.data.shipments.find(
      (s) => s.id === idOrBooking || s.booking_id.toLowerCase() === idOrBooking.toLowerCase()
    );
    if (!shipment) return null;

    // Strict customer isolation check
    if (currentUser?.role === 'customer' && shipment.customer_id !== currentUser.id) {
      return null;
    }

    const events = this.data.events
      .filter((e) => e.shipment_id === shipment.id)
      .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
    const schedules = this.data.schedules
      .filter((sch) => sch.shipment_id === shipment.id)
      .sort((a, b) => new Date(a.planned_date).getTime() - new Date(b.planned_date).getTime());
    return { shipment, events, schedules };
  }

  public createShipment(data: Partial<Shipment>): Shipment {
    const id = `ship-${Date.now()}`;
    const booking_id = data.booking_id || `CV-${Math.floor(900000 + Math.random() * 90000)}`;
    const newShipment: Shipment = {
      id,
      booking_id,
      customer_id: data.customer_id || 'usr-cust-jordan',
      assigned_operations_user_id: data.assigned_operations_user_id || 'usr-ops1',
      origin: data.origin || 'Shanghai Port',
      origin_code: data.origin_code || 'CNSHA',
      destination: data.destination || 'Port of Los Angeles',
      destination_code: data.destination_code || 'USLAX',
      carrier: data.carrier || 'Maersk Line',
      vessel: data.vessel || 'Madrid Maersk',
      voyage_number: data.voyage_number || '2450E',
      container_count: data.container_count || 1,
      container_type: data.container_type || "40' High Cube",
      cargo_description: data.cargo_description || 'Commercial Freight Cargo',
      status: 'Booking Confirmed',
      progress: 15,
      estimated_departure_date: data.estimated_departure_date || new Date().toISOString(),
      estimated_arrival_date: data.estimated_arrival_date || new Date(Date.now() + 86400000 * 18).toISOString(),
      revised_estimated_arrival_date: null,
      delay_days: 0,
      delay_reason: null,
      operational_notes: data.operational_notes || null,
      customer_name: data.customer_name || 'Jordan Miller',
      customer_company: data.customer_company || 'NorthStar Home Living Ltd.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const initialEvent: ShipmentEvent = {
      id: `ev-${Date.now()}`,
      shipment_id: id,
      title: 'Booking Confirmed & Equipment Allocated',
      description: `Compass Voyage operations confirmed allocation aboard ${newShipment.vessel} (${newShipment.carrier}).`,
      location: newShipment.origin,
      event_date: new Date().toISOString(),
      event_type: 'booking_confirmed',
      confirmed: 1,
      created_at: new Date().toISOString(),
    };

    const initialNotification: Notification = {
      id: `notif-${Date.now()}`,
      user_id: newShipment.customer_id,
      shipment_id: id,
      booking_id: newShipment.booking_id,
      origin_code: newShipment.origin_code,
      destination_code: newShipment.destination_code,
      title: `Booking Confirmed: ${newShipment.booking_id}`,
      message: `Your consignment ${newShipment.booking_id} from ${newShipment.origin_code} to ${newShipment.destination_code} has been registered.`,
      type: 'booking',
      is_read: false,
      created_at: new Date().toISOString(),
    };

    this.saveData({
      ...this.data,
      shipments: [newShipment, ...this.data.shipments],
      events: [...this.data.events, initialEvent],
      notifications: [initialNotification, ...this.data.notifications],
    });
    return newShipment;
  }

  public updateShipment(id: string, updates: Partial<Shipment>): void {
    const current = this.data.shipments.find((s) => s.id === id);
    if (!current) return;
    const newShipments = this.data.shipments.map((s) => (s.id === id ? { ...s, ...updates, updated_at: new Date().toISOString() } : s));
    const newEvents = [...this.data.events];
    const newNotifications = [...this.data.notifications];

    if (updates.status && updates.status !== current.status) {
      newEvents.push({
        id: `ev-${Date.now()}`,
        shipment_id: id,
        title: `Status Updated to ${updates.status}`,
        description: `Operations updated status from ${current.status} to ${updates.status}.`,
        location: updates.status === 'Delivered' ? current.destination : current.origin,
        event_date: new Date().toISOString(),
        event_type: updates.status.toLowerCase().replace(/\s+/g, '_'),
        confirmed: 1,
        created_at: new Date().toISOString(),
      });
      newNotifications.push({
        id: `notif-${Date.now()}`,
        user_id: current.customer_id,
        shipment_id: id,
        booking_id: current.booking_id,
        origin_code: current.origin_code,
        destination_code: current.destination_code,
        title: `Status Update: ${current.booking_id}`,
        message: `Shipment ${current.booking_id} status has been updated to ${updates.status}.`,
        type: 'status_update',
        is_read: false,
        created_at: new Date().toISOString(),
      });
    }

    if (updates.delay_days && updates.delay_days > 0 && updates.delay_days !== current.delay_days) {
      newEvents.push({
        id: `ev-${Date.now() + 1}`,
        shipment_id: id,
        title: `Delay Advisory: +${updates.delay_days} Days`,
        description: updates.delay_reason || 'Maritime delay recorded along transit route.',
        location: 'Ocean Transit Corridor',
        event_date: new Date().toISOString(),
        event_type: 'delay',
        confirmed: 1,
        created_at: new Date().toISOString(),
      });
      newNotifications.push({
        id: `notif-${Date.now() + 1}`,
        user_id: current.customer_id,
        shipment_id: id,
        booking_id: current.booking_id,
        origin_code: current.origin_code,
        destination_code: current.destination_code,
        title: `Delay Notice: ${current.booking_id}`,
        message: `A delay of ${updates.delay_days} day(s) was noted for ${current.booking_id}. Reason: ${updates.delay_reason || 'Operational delay'}`,
        type: 'delay',
        is_read: false,
        created_at: new Date().toISOString(),
      });
    }

    this.saveData({
      ...this.data,
      shipments: newShipments,
      events: newEvents,
      notifications: newNotifications,
    });
  }

  public addShipmentEvent(shipmentId: string, event: Omit<ShipmentEvent, 'id' | 'shipment_id' | 'created_at'>): ShipmentEvent {
    const newEv: ShipmentEvent = {
      ...event,
      id: `ev-${Date.now()}`,
      shipment_id: shipmentId,
      created_at: new Date().toISOString(),
    };
    this.saveData({
      ...this.data,
      events: [...this.data.events, newEv],
    });
    return newEv;
  }

  // -------------------------------------------------------------
  // OPERATIONS: 4-DROPDOWN DEPENDENT CASCADING LOOKUP HELPERS
  // -------------------------------------------------------------
  public getValidPodsForPol(polCode: string): Port[] {
    if (!polCode) return [];
    const destCodes = new Set<string>();
    this.data.shipments
      .filter((s) => s.origin_code.toUpperCase() === polCode.toUpperCase())
      .forEach((s) => destCodes.add(s.destination_code));
    this.data.carrierOptions
      .filter((o) => o.origin_code.toUpperCase() === polCode.toUpperCase())
      .forEach((o) => destCodes.add(o.destination_code));
    return this.data.ports.filter((p) => destCodes.has(p.code));
  }

  public getCarriersForRoute(polCode: string, podCode: string): string[] {
    if (!polCode || !podCode) return [];
    const carriers = new Set<string>();
    this.data.shipments
      .filter((s) => s.origin_code.toUpperCase() === polCode.toUpperCase() && s.destination_code.toUpperCase() === podCode.toUpperCase())
      .forEach((s) => carriers.add(s.carrier));
    this.data.carrierOptions
      .filter((o) => o.origin_code.toUpperCase() === polCode.toUpperCase() && o.destination_code.toUpperCase() === podCode.toUpperCase())
      .forEach((o) => carriers.add(o.carrier));
    return Array.from(carriers).sort();
  }

  public getBookingsForRouteAndCarrier(polCode: string, podCode: string, carrierName: string): string[] {
    if (!polCode || !podCode || !carrierName) return [];
    return this.data.shipments
      .filter(
        (s) =>
          s.origin_code.toUpperCase() === polCode.toUpperCase() &&
          s.destination_code.toUpperCase() === podCode.toUpperCase() &&
          s.carrier.toLowerCase() === carrierName.toLowerCase()
      )
      .map((s) => s.booking_id)
      .sort();
  }

  public lookupExactShipment(
    polCode: string,
    podCode: string,
    carrierName: string,
    bookingNumber: string
  ): { shipment: Shipment; schedules: Schedule[]; events: ShipmentEvent[] } | null {
    if (!polCode || !podCode || !carrierName || !bookingNumber) return null;
    const matched = this.data.shipments.find(
      (s) =>
        s.origin_code.toUpperCase() === polCode.toUpperCase() &&
        s.destination_code.toUpperCase() === podCode.toUpperCase() &&
        s.carrier.toLowerCase() === carrierName.toLowerCase() &&
        s.booking_id.toUpperCase() === bookingNumber.toUpperCase()
    );
    if (!matched) return null;
    const schedules = this.data.schedules.filter((sch) => sch.shipment_id === matched.id);
    const events = this.data.events.filter((ev) => ev.shipment_id === matched.id);
    return { shipment: matched, schedules, events };
  }

  // -------------------------------------------------------------
  // OPERATIONS: CARRIER COMPARISON & RECOMMENDATION ENGINE
  // -------------------------------------------------------------
  public getCarrierComparison(polCode: string, podCode: string, targetBookingId?: string): {
    carrierOptions: CarrierScheduleOption[];
    recommendedCarrierId: string | null;
    recommendationReason: string;
    targetShipment?: Shipment | null;
  } {
    let targetShipment: Shipment | null = null;
    if (targetBookingId) {
      targetShipment = this.data.shipments.find((s) => s.booking_id === targetBookingId) || null;
    }
    const matches = this.data.carrierOptions.filter(
      (opt) =>
        opt.origin_code.toUpperCase() === polCode.toUpperCase() &&
        opt.destination_code.toUpperCase() === podCode.toUpperCase()
    );
    if (matches.length === 0) {
      return {
        carrierOptions: [],
        recommendedCarrierId: null,
        recommendationReason: 'No scheduled carrier services found for the selected port pair in the active schedule database.',
        targetShipment,
      };
    }

    let bestOption: CarrierScheduleOption = matches[0];
    let bestScore = -Infinity;
    for (const opt of matches) {
      let score = 0;
      score += Math.max(0, 30 - opt.transit_days) * 2;
      const rel = opt.reliability_score ?? 80;
      score += (rel / 100) * 30;
      if (opt.service_type === 'Direct Express') score += 15;
      else if (opt.service_type === 'Standard Direct') score += 10;
      if (opt.quoted_cost_usd) {
        score += Math.max(0, (4000 - opt.quoted_cost_usd) / 100);
      }
      if (score > bestScore) {
        bestScore = score;
        bestOption = opt;
      }
    }

    const transitText = `${bestOption.transit_days} days transit time`;
    const relText = bestOption.reliability_score
      ? `${bestOption.reliability_score}% recorded on-time reliability`
      : 'historical reliability rating currently pending audit';
    const costText = bestOption.quoted_cost_usd
      ? `quoted at $${bestOption.quoted_cost_usd.toLocaleString()} / FEU`
      : 'pricing available upon spot cargo quotation';

    const reason = `Recommended because ${bestOption.carrier} provides ${bestOption.service_type.toLowerCase()} service on this corridor with the shortest recorded transit duration (${transitText}), ${bestOption.frequency.toLowerCase()}, and ${relText}. Cargo rates are ${costText}.`;

    return {
      carrierOptions: matches,
      recommendedCarrierId: bestOption.id,
      recommendationReason: reason,
      targetShipment,
    };
  }

  // Notifications
  public getNotifications(userId: string): { notifications: Notification[]; unread_count: number } {
    const list = this.data.notifications
      .filter((n) => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const unread_count = list.filter((n) => !n.is_read).length;
    return { notifications: list, unread_count };
  }

  public markNotificationRead(id: string): void {
    const updated = this.data.notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n));
    this.saveData({ ...this.data, notifications: updated });
  }

  public markAllNotificationsRead(userId: string): void {
    const updated = this.data.notifications.map((n) => (n.user_id === userId ? { ...n, is_read: true } : n));
    this.saveData({ ...this.data, notifications: updated });
  }

  // Stats
  public getStats(user: User): StatsData {
    if (user.role === 'customer') {
      const assigned = this.getCustomerAssignedShipment(user.id);
      return {
        role: 'customer',
        stats: {
          total_shipments: assigned ? 1 : 0,
          in_transit: assigned && assigned.status === 'In Transit' ? 1 : 0,
          delayed: assigned && (assigned.status === 'Delayed' || assigned.delay_days > 0) ? 1 : 0,
          delivered: assigned && assigned.status === 'Delivered' ? 1 : 0,
          arriving_soon: assigned && assigned.status === 'Arriving Soon' ? 1 : 0,
        },
        assigned_shipment: assigned,
        delayed_shipments: assigned && (assigned.status === 'Delayed' || assigned.delay_days > 0) ? [assigned] : [],
      };
    }

    const total = this.data.shipments.length;
    const in_transit = this.data.shipments.filter((s) => s.status === 'In Transit').length;
    const delayed = this.data.shipments.filter((s) => s.status === 'Delayed' || s.delay_days > 0).length;
    const delivered = this.data.shipments.filter((s) => s.status === 'Delivered').length;
    const awaiting_confirmation = this.data.shipments.filter((s) => s.status === 'Booking Confirmed').length;
    const arriving_soon = this.data.shipments.filter((s) => s.status === 'Arriving Soon').length;
    const total_customers = this.data.users.filter((u) => u.role === 'customer' && u.is_active).length;

    return {
      role: 'operations',
      stats: {
        total_shipments: total,
        in_transit,
        delayed,
        delivered,
        awaiting_confirmation,
        arriving_soon,
        total_customers,
      },
      delayed_shipments: this.data.shipments.filter((s) => s.status === 'Delayed' || s.delay_days > 0).slice(0, 6),
      upcoming_arrivals: this.data.shipments.filter((s) => s.status === 'In Transit' || s.status === 'Arriving Soon').slice(0, 5),
      recent_events: this.data.events.slice(-6).reverse(),
      recent_shipments: this.data.shipments.slice(0, 8),
    };
  }

  // Compass Agent
  public queryCompassAgent(queryText: string, user: User): { answer: string; shipments: any[]; intent: string } {
    const clean = queryText.toLowerCase().trim();

    // Specific booking inquiry
    const bookingMatch = clean.match(/cv[-\s]?([0-9a-z]+)|cmdu[-\s]?([0-9a-z]+)/i);
    if (bookingMatch) {
      const raw = (bookingMatch[0]).toUpperCase().replace(/\s+/g, '-');
      const found = this.data.shipments.find((s) => s.booking_id.toUpperCase().includes(raw));
      if (!found) {
        return {
          answer: `No shipment record found in Compass Voyage matching booking number ${raw}. Please verify the booking identifier.`,
          shipments: [],
          intent: 'booking_status',
        };
      }
      if (user.role === 'customer' && found.customer_id !== user.id) {
        return {
          answer: `Booking ${found.booking_id} is registered to another commercial customer account. Under Compass Voyage security protocols, you can only access consignments assigned to ${user.company}.`,
          shipments: [],
          intent: 'booking_status',
        };
      }
      let delayInfo = '';
      if (found.delay_days > 0) {
        delayInfo = ` Current delay: +${found.delay_days} day(s) due to "${found.delay_reason}". Revised ETA: ${new Date(found.revised_estimated_arrival_date || found.estimated_arrival_date).toLocaleDateString()}.`;
      }
      return {
        answer: `Booking ${found.booking_id} is currently ${found.status} (${found.progress}% complete). Vessel "${found.vessel}" (${found.carrier}) on voyage ${found.voyage_number} from ${found.origin_code} (${found.origin}) to ${found.destination_code} (${found.destination}). Estimated arrival: ${new Date(found.estimated_arrival_date).toLocaleDateString()}.${delayInfo}`,
        shipments: [found],
        intent: 'booking_status',
      };
    }

    // Customer asking for "my shipment"
    if (user.role === 'customer' && (clean.includes('my shipment') || clean.includes('status') || clean.includes('track'))) {
      const assigned = this.getCustomerAssignedShipment(user.id);
      if (!assigned) {
        return {
          answer: `No consignment has been assigned to ${user.company} yet. Please reach out to your Operations specialist to allocate container equipment.`,
          shipments: [],
          intent: 'customer_shipment',
        };
      }
      return {
        answer: `Your assigned consignment is booking ${assigned.booking_id} (${assigned.status}, ${assigned.progress}%). Routing from ${assigned.origin_code} (${assigned.origin}) to ${assigned.destination_code} (${assigned.destination}) aboard ${assigned.vessel} (${assigned.carrier}). Estimated arrival is ${new Date(assigned.revised_estimated_arrival_date || assigned.estimated_arrival_date).toLocaleDateString()}.`,
        shipments: [assigned],
        intent: 'customer_shipment',
      };
    }

    // Delays
    if (clean.includes('delay') || clean.includes('late') || clean.includes('behind')) {
      let delayed = this.data.shipments.filter((s) => s.status === 'Delayed' || s.delay_days > 0);
      if (user.role === 'customer') {
        delayed = delayed.filter((s) => s.customer_id === user.id);
      }
      if (delayed.length === 0) {
        return {
          answer: `All monitored voyages ${user.role === 'customer' ? `for ${user.company}` : 'across the fleet'} are currently navigating strictly on schedule with 0 reported delays.`,
          shipments: [],
          intent: 'delayed_shipments',
        };
      }
      return {
        answer: `Found ${delayed.length} delayed consignment(s) ${user.role === 'customer' ? `for ${user.company}` : 'requiring operations oversight'}. Delays are attributable to berth congestion, severe weather detours, and customs inspections.`,
        shipments: delayed.slice(0, 8),
        intent: 'delayed_shipments',
      };
    }

    // Arrivals
    if (clean.includes('arriv') || clean.includes('approaching')) {
      let arriving = this.data.shipments.filter((s) => s.status === 'Arriving Soon' || s.status === 'In Transit');
      if (user.role === 'customer') {
        arriving = arriving.filter((s) => s.customer_id === user.id);
      }
      return {
        answer: `Identified ${arriving.length} vessel(s) approaching destination gateway terminals within scheduled rotation windows.`,
        shipments: arriving.slice(0, 8),
        intent: 'upcoming_arrivals',
      };
    }

    // Default
    return {
      answer: `Compass Agent is grounded directly in live Compass Voyage logistics database records for Compass Global Logistics International. Supported questions: • "What is the status of booking CV-900001?" • "Show delayed shipments" • "Which shipments are arriving this week?" ${user.role === 'operations' ? '• "Show shipments for NorthStar"' : '• "Where is my assigned shipment?"'}`,
      shipments: [],
      intent: 'unsupported',
    };
  }
}

export const localDb = new LocalRepository();
