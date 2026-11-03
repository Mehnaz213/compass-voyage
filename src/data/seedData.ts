import {
  Port,
  Carrier,
  Customer,
  User,
  Shipment,
  ShipmentStatus,
  MilestoneEvent,
  AlternativeCarrierOption,
  AppNotification
} from '../types/logistics';

export const SEED_PORTS: Port[] = [
  { id: 'port_1', code: 'DEHAM', name: 'Port of Hamburg', city: 'Hamburg', country: 'Germany', terminal: 'Burchardkai (CTB)', coordinates: [53.5353, 9.9675] },
  { id: 'port_2', code: 'NLRTM', name: 'Port of Rotterdam', city: 'Rotterdam', country: 'Netherlands', terminal: 'Maasvlakte II', coordinates: [51.9244, 4.4777] },
  { id: 'port_3', code: 'BEANR', name: 'Port of Antwerp-Bruges', city: 'Antwerp', country: 'Belgium', terminal: 'Deurganck Dock', coordinates: [51.2194, 4.4025] },
  { id: 'port_4', code: 'GBLGP', name: 'London Gateway Port', city: 'London', country: 'United Kingdom', terminal: 'Berth 1-4 Terminal', coordinates: [51.5128, 0.4578] },
  { id: 'port_5', code: 'SGSIN', name: 'Port of Singapore', city: 'Singapore', country: 'Singapore', terminal: 'Tuas Mega Terminal', coordinates: [1.2903, 103.8519] },
  { id: 'port_6', code: 'USLAX', name: 'Port of Los Angeles', city: 'Los Angeles', country: 'United States', terminal: 'Pier 400 APM', coordinates: [33.7432, -118.2673] },
  { id: 'port_7', code: 'USNYC', name: 'Port of New York & New Jersey', city: 'New York', country: 'United States', terminal: 'Maher Terminals', coordinates: [40.6720, -74.1378] },
  { id: 'port_8', code: 'USSAV', name: 'Port of Savannah', city: 'Savannah', country: 'United States', terminal: 'Garden City Terminal', coordinates: [32.1322, -81.1444] },
  { id: 'port_9', code: 'CNYAT', name: 'Port of Yantian (Shenzhen)', city: 'Shenzhen', country: 'China', terminal: 'Yantian International (YICT)', coordinates: [22.5756, 114.2692] },
  { id: 'port_10', code: 'CNSHA', name: 'Port of Shanghai', city: 'Shanghai', country: 'China', terminal: 'Yangshan Deepwater Port', coordinates: [30.6278, 122.0628] },
  { id: 'port_11', code: 'CNNGB', name: 'Port of Ningbo-Zhoushan', city: 'Ningbo', country: 'China', terminal: 'Beilun Container Port', coordinates: [29.8683, 121.5440] },
  { id: 'port_12', code: 'HKHKG', name: 'Port of Hong Kong', city: 'Hong Kong', country: 'Hong Kong SAR', terminal: 'Kwai Tsing Terminal 9', coordinates: [22.3524, 114.1206] },
  { id: 'port_13', code: 'JPTYO', name: 'Port of Tokyo', city: 'Tokyo', country: 'Japan', terminal: 'Oi Container Terminal', coordinates: [35.6186, 139.7744] },
  { id: 'port_14', code: 'KRPUS', name: 'Port of Busan', city: 'Busan', country: 'South Korea', terminal: 'Busan New Port (PNC)', coordinates: [35.0805, 128.8257] },
  { id: 'port_15', code: 'AEJEA', name: 'Jebel Ali Port', city: 'Dubai', country: 'United Arab Emirates', terminal: 'DP World Terminal 3', coordinates: [24.9857, 55.0273] },
  { id: 'port_16', code: 'MYPKG', name: 'Port Klang', city: 'Klang', country: 'Malaysia', terminal: 'Westports Terminal', coordinates: [2.9999, 101.3928] },
  { id: 'port_17', code: 'INNSA', name: 'Nhava Sheva (JNPT)', city: 'Navi Mumbai', country: 'India', terminal: 'Gateway Terminals India (GTI)', coordinates: [18.9497, 72.9515] },
  { id: 'port_18', code: 'ESBCN', name: 'Port of Barcelona', city: 'Barcelona', country: 'Spain', terminal: 'BEST Hutchison Ports', coordinates: [41.3461, 2.1648] },
  { id: 'port_19', code: 'BRSSZ', name: 'Port of Santos', city: 'Santos', country: 'Brazil', terminal: 'Brasil Terminal Portuário', coordinates: [-23.9535, -46.3090] },
  { id: 'port_20', code: 'AUPEA', name: 'Port of Melbourne', city: 'Melbourne', country: 'Australia', terminal: 'Webb Dock East', coordinates: [-37.8466, 144.9124] }
];

export const SEED_CARRIERS: Carrier[] = [
  { id: 'carr_1', name: 'Maersk Line', code: 'MSK', fleetSize: 730, headquarters: 'Copenhagen, Denmark', reliabilityRate: 88.4, avgDelayDays: 0.8 },
  { id: 'carr_2', name: 'MSC Mediterranean Shipping', code: 'MSC', fleetSize: 760, headquarters: 'Geneva, Switzerland', reliabilityRate: 86.2, avgDelayDays: 1.1 },
  { id: 'carr_3', name: 'CMA CGM Group', code: 'CMA', fleetSize: 593, headquarters: 'Marseille, France', reliabilityRate: 83.7, avgDelayDays: 1.4 },
  { id: 'carr_4', name: 'Hapag-Lloyd', code: 'HLC', fleetSize: 253, headquarters: 'Hamburg, Germany', reliabilityRate: 91.5, avgDelayDays: 0.5 },
  { id: 'carr_5', name: 'Ocean Network Express (ONE)', code: 'ONE', fleetSize: 210, headquarters: 'Singapore / Tokyo', reliabilityRate: 89.1, avgDelayDays: 0.7 },
  { id: 'carr_6', name: 'Evergreen Marine', code: 'EGL', fleetSize: 215, headquarters: 'Taoyuan, Taiwan', reliabilityRate: 84.8, avgDelayDays: 1.2 },
  { id: 'carr_7', name: 'COSCO Shipping Lines', code: 'COS', fleetSize: 490, headquarters: 'Shanghai, China', reliabilityRate: 82.0, avgDelayDays: 1.6 },
  { id: 'carr_8', name: 'Yang Ming Marine', code: 'YML', fleetSize: 94, headquarters: 'Keelung, Taiwan', reliabilityRate: 85.0, avgDelayDays: 1.3 }
];

// 12 Demo Customers - strictly assigned to 1 shipment each!
export const SEED_CUSTOMERS: Customer[] = [
  {
    id: 'cust_1',
    name: 'Thomas Weber',
    companyName: 'Nordex Engineering GmbH',
    industry: 'Industrial Turbines & Heavy Machinery',
    country: 'Germany',
    contactEmail: 't.weber@nordex-eng.de',
    contactPhone: '+49 40 5543 2100',
    assignedShipmentId: 'ship_1', // CV-900001
    accountTier: 'Enterprise'
  },
  {
    id: 'cust_2',
    name: 'Akiko Tanaka',
    companyName: 'Pacific Rim Electronics',
    industry: 'Consumer Semiconductor & Display Modules',
    country: 'Japan',
    contactEmail: 'a.tanaka@pacificrim-tech.jp',
    contactPhone: '+81 3 5550 9821',
    assignedShipmentId: 'ship_2', // CV-900002
    accountTier: 'Enterprise'
  },
  {
    id: 'cust_3',
    name: 'Arthur Pendelton',
    companyName: 'Apex Industrial Tools Ltd',
    industry: 'Precision Tooling & CNC Hardware',
    country: 'United Kingdom',
    contactEmail: 'a.pendelton@apextools.co.uk',
    contactPhone: '+44 20 7946 0834',
    assignedShipmentId: 'ship_3', // CV-900003
    accountTier: 'Priority'
  },
  {
    id: 'cust_4',
    name: 'Dr. Sarah Lindqvist',
    companyName: 'Horizon Medical Supplies AB',
    industry: 'Cold-Chain Diagnostic Medical Devices',
    country: 'Sweden',
    contactEmail: 's.lindqvist@horizonmed.se',
    contactPhone: '+46 8 123 4567',
    assignedShipmentId: 'ship_4', // CV-900004
    accountTier: 'Enterprise'
  },
  {
    id: 'cust_5',
    name: 'Marc Dupond',
    companyName: 'BioVenture Pharma SA',
    industry: 'Active Pharmaceutical Ingredients (API)',
    country: 'Switzerland',
    contactEmail: 'm.dupond@bioventure.ch',
    contactPhone: '+41 22 710 4321',
    assignedShipmentId: 'ship_5', // CV-900005
    accountTier: 'Priority'
  },
  {
    id: 'cust_6',
    name: 'Carlos Mendez',
    companyName: 'Atlas Solar Energy SL',
    industry: 'Photovoltaic Panels & Inverters',
    country: 'Spain',
    contactEmail: 'c.mendez@atlassolar.es',
    contactPhone: '+34 93 456 7890',
    assignedShipmentId: 'ship_6', // CV-900006
    accountTier: 'Standard'
  },
  {
    id: 'cust_7',
    name: 'Henrik Lindholm',
    companyName: 'Scandinavian Timber Export AS',
    industry: 'Kiln-Dried Structural Softwood',
    country: 'Norway',
    contactEmail: 'h.lindholm@scandtimber.no',
    contactPhone: '+47 22 99 88 77',
    assignedShipmentId: 'ship_7', // CV-900007
    accountTier: 'Standard'
  },
  {
    id: 'cust_8',
    name: 'Kenji Sato',
    companyName: 'Kyoto Precision Optics Corp',
    industry: 'Optical Sensor Glass & Laser Lenses',
    country: 'Japan',
    contactEmail: 'k.sato@kyotoptics.co.jp',
    contactPhone: '+81 75 321 4455',
    assignedShipmentId: 'ship_8', // CV-900008
    accountTier: 'Enterprise'
  },
  {
    id: 'cust_9',
    name: 'Liam O\'Connor',
    companyName: 'Silverstone Automotive Spares',
    industry: 'OEM Transmission Castings & Brake Assemblies',
    country: 'United Kingdom',
    contactEmail: 'l.oconnor@silverstoneauto.co.uk',
    contactPhone: '+44 1327 850 200',
    assignedShipmentId: 'ship_9', // CV-900009
    accountTier: 'Priority'
  },
  {
    id: 'cust_10',
    name: 'Sofia Alvarez',
    companyName: 'Iberian Foods Export S.A.',
    industry: 'Extra Virgin Olive Oil & Gourmet Preserves',
    country: 'Spain',
    contactEmail: 's.alvarez@iberianfoods.es',
    contactPhone: '+34 91 789 0123',
    assignedShipmentId: 'ship_10', // CV-900010
    accountTier: 'Standard'
  },
  {
    id: 'cust_11',
    name: 'Rachel Green',
    companyName: 'Nova Consumer Goods Inc',
    industry: 'Eco-Friendly Kitchenware & Small Appliances',
    country: 'United States',
    contactEmail: 'r.green@novagoods.com',
    contactPhone: '+1 415 555 0192',
    assignedShipmentId: 'ship_11', // CV-900011
    accountTier: 'Priority'
  },
  {
    id: 'cust_12',
    name: 'David Miller',
    companyName: 'Cascade Apparel Ltd',
    industry: 'Technical Outdoor Jackets & Footwear',
    country: 'Canada',
    contactEmail: 'd.miller@cascadeapparel.ca',
    contactPhone: '+1 604 555 8832',
    assignedShipmentId: 'ship_12', // CV-900012
    accountTier: 'Standard'
  }
];

// 15 System Users: 3 Operations + 12 Customers
export const SEED_USERS: User[] = [
  // Operations Users
  {
    id: 'user_ops_1',
    name: 'Elena Rostova',
    email: 'elena.rostova@compasslogistics.com',
    role: 'operations',
    jobTitle: 'Global Operations Director',
    department: 'Ocean Freight Operations'
  },
  {
    id: 'user_ops_2',
    name: 'Marcus Vance',
    email: 'marcus.vance@compasslogistics.com',
    role: 'operations',
    jobTitle: 'Senior Ocean Freight Dispatcher',
    department: 'Vessel Scheduling & Allocation'
  },
  {
    id: 'user_ops_3',
    name: 'Chloe Chen',
    email: 'chloe.chen@compasslogistics.com',
    role: 'operations',
    jobTitle: 'Logistics Visibility Specialist',
    department: 'Carrier Management'
  },
  // Customer Users (one account per demo customer)
  { id: 'user_cust_1', name: 'Thomas Weber', email: 't.weber@nordex-eng.de', role: 'customer', customerId: 'cust_1', jobTitle: 'Head of Global Procurement' },
  { id: 'user_cust_2', name: 'Akiko Tanaka', email: 'a.tanaka@pacificrim-tech.jp', role: 'customer', customerId: 'cust_2', jobTitle: 'Supply Chain Director' },
  { id: 'user_cust_3', name: 'Arthur Pendelton', email: 'a.pendelton@apextools.co.uk', role: 'customer', customerId: 'cust_3', jobTitle: 'Import Operations Manager' },
  { id: 'user_cust_4', name: 'Dr. Sarah Lindqvist', email: 's.lindqvist@horizonmed.se', role: 'customer', customerId: 'cust_4', jobTitle: 'Quality & Logistics Director' },
  { id: 'user_cust_5', name: 'Marc Dupond', email: 'm.dupond@bioventure.ch', role: 'customer', customerId: 'cust_5', jobTitle: 'Active Ingredients Lead' },
  { id: 'user_cust_6', name: 'Carlos Mendez', email: 'c.mendez@atlassolar.es', role: 'customer', customerId: 'cust_6', jobTitle: 'Materials Procurement Officer' },
  { id: 'user_cust_7', name: 'Henrik Lindholm', email: 'h.lindholm@scandtimber.no', role: 'customer', customerId: 'cust_7', jobTitle: 'Trade & Logistics Lead' },
  { id: 'user_cust_8', name: 'Kenji Sato', email: 'k.sato@kyotoptics.co.jp', role: 'customer', customerId: 'cust_8', jobTitle: 'VP Global Operations' },
  { id: 'user_cust_9', name: 'Liam O\'Connor', email: 'l.oconnor@silverstoneauto.co.uk', role: 'customer', customerId: 'cust_9', jobTitle: 'Component Sourcing Manager' },
  { id: 'user_cust_10', name: 'Sofia Alvarez', email: 's.alvarez@iberianfoods.es', role: 'customer', customerId: 'cust_10', jobTitle: 'Export Compliance Director' },
  { id: 'user_cust_11', name: 'Rachel Green', email: 'r.green@novagoods.com', role: 'customer', customerId: 'cust_11', jobTitle: 'Inventory Operations Manager' },
  { id: 'user_cust_12', name: 'David Miller', email: 'd.miller@cascadeapparel.ca', role: 'customer', customerId: 'cust_12', jobTitle: 'Logistics Coordinator' }
];

// Helper to generate consistent dates relative to October 2026
const D = (offsetDays: number): string => {
  const base = new Date('2026-10-19T08:00:00Z');
  base.setDate(base.getDate() + offsetDays);
  return base.toISOString().split('T')[0];
};

// 12 Primary Shipments for the 12 Demo Customers (Exactly 1:1)
const CUSTOMER_SHIPMENTS: Shipment[] = [
  {
    id: 'ship_1',
    bookingNumber: 'CV-900001',
    customerId: 'cust_1', // Nordex Engineering GmbH
    carrierId: 'carr_4', // Hapag-Lloyd
    polCode: 'DEHAM',
    podCode: 'SGSIN',
    vesselName: 'Hamburg Express',
    voyageNumber: 'HE-2641E',
    containerCount: 6,
    containerType: '40\' High Cube Dry',
    cargoDescription: 'Heavy-Duty Gas Turbine Rotors & Hydraulic Actuators',
    cargoWeightKg: 84500,
    estimatedDeparture: D(-12),
    actualDeparture: D(-12),
    estimatedArrival: D(10),
    revisedEta: undefined,
    status: 'IN_TRANSIT',
    createdAt: D(-25)
  },
  {
    id: 'ship_2',
    bookingNumber: 'CV-900002',
    customerId: 'cust_2', // Pacific Rim Electronics
    carrierId: 'carr_5', // ONE
    polCode: 'JPTYO',
    podCode: 'USLAX',
    vesselName: 'ONE Commitment',
    voyageNumber: 'OC-094W',
    containerCount: 4,
    containerType: '40\' High Cube Dry',
    cargoDescription: 'OLED Display Modules & Microcontroller ASICs',
    cargoWeightKg: 42300,
    estimatedDeparture: D(-8),
    actualDeparture: D(-8),
    estimatedArrival: D(4),
    revisedEta: D(7), // Delayed by 3 days due to typhoon evasive route
    status: 'DELAYED',
    delayDurationDays: 3,
    delayReason: 'Typhoon Talim weather evasion route in Western Pacific',
    createdAt: D(-20)
  },
  {
    id: 'ship_3',
    bookingNumber: 'CV-900003',
    customerId: 'cust_3', // Apex Industrial Tools
    carrierId: 'carr_1', // Maersk Line
    polCode: 'GBLGP',
    podCode: 'CNYAT',
    vesselName: 'Madrid Maersk',
    voyageNumber: 'MM-2603S',
    containerCount: 2,
    containerType: '20\' Standard Dry',
    cargoDescription: 'Solid Carbide End Mills & CNC Tool Holders',
    cargoWeightKg: 21800,
    estimatedDeparture: D(-18),
    actualDeparture: D(-18),
    estimatedArrival: D(14),
    revisedEta: undefined,
    status: 'IN_TRANSIT',
    createdAt: D(-30)
  },
  {
    id: 'ship_4',
    bookingNumber: 'CV-900004',
    customerId: 'cust_4', // Horizon Medical Supplies
    carrierId: 'carr_1', // Maersk Line
    polCode: 'NLRTM',
    podCode: 'USNYC',
    vesselName: 'Maersk Mc-Kinney Moller',
    voyageNumber: 'MM-2619W',
    containerCount: 2,
    containerType: '40\' Reefer (-20°C monitored)',
    cargoDescription: 'Cold-Chain Diagnostic Reagents & Blood Analyzers',
    cargoWeightKg: 19400,
    estimatedDeparture: D(-6),
    actualDeparture: D(-6),
    estimatedArrival: D(2),
    revisedEta: undefined,
    status: 'ARRIVING_SOON',
    createdAt: D(-18)
  },
  {
    id: 'ship_5',
    bookingNumber: 'CV-900005',
    customerId: 'cust_5', // BioVenture Pharma
    carrierId: 'carr_2', // MSC
    polCode: 'BEANR',
    podCode: 'AEJEA',
    vesselName: 'MSC Isabella',
    voyageNumber: 'MI-1048E',
    containerCount: 3,
    containerType: '40\' High Cube Reefer (2-8°C)',
    cargoDescription: 'Sterile Biopharmaceutical Solutions & Vaccines',
    cargoWeightKg: 28600,
    estimatedDeparture: D(3),
    estimatedArrival: D(18),
    status: 'BOOKING_CONFIRMED',
    createdAt: D(-5)
  },
  {
    id: 'ship_6',
    bookingNumber: 'CV-900006',
    customerId: 'cust_6', // Atlas Solar Energy
    carrierId: 'carr_7', // COSCO
    polCode: 'CNSHA',
    podCode: 'ESBCN',
    vesselName: 'COSCO Shipping Universe',
    voyageNumber: 'CU-4402W',
    containerCount: 12,
    containerType: '40\' High Cube Dry',
    cargoDescription: 'Monocrystalline Silicon Solar Panels & 1500V Inverters',
    cargoWeightKg: 198000,
    estimatedDeparture: D(-22),
    actualDeparture: D(-22),
    estimatedArrival: D(-2),
    actualArrival: D(-1),
    status: 'DELIVERED',
    createdAt: D(-40)
  },
  {
    id: 'ship_7',
    bookingNumber: 'CV-900007',
    customerId: 'cust_7', // Scandinavian Timber Export
    carrierId: 'carr_4', // Hapag-Lloyd
    polCode: 'DEHAM',
    podCode: 'CNNGB',
    vesselName: 'Al Jmeliyah',
    voyageNumber: 'AJ-8812E',
    containerCount: 8,
    containerType: '40\' High Cube Dry',
    cargoDescription: 'Kiln-Dried Nordic Spruce Planks (FSC Certified)',
    cargoWeightKg: 164000,
    estimatedDeparture: D(-15),
    actualDeparture: D(-15),
    estimatedArrival: D(12),
    revisedEta: undefined,
    status: 'IN_TRANSIT',
    createdAt: D(-28)
  },
  {
    id: 'ship_8',
    bookingNumber: 'CV-900008',
    customerId: 'cust_8', // Kyoto Precision Optics
    carrierId: 'carr_5', // ONE
    polCode: 'JPTYO',
    podCode: 'NLRTM',
    vesselName: 'ONE Continuity',
    voyageNumber: 'OC-1102W',
    containerCount: 2,
    containerType: '20\' Standard Shock-Absorbing',
    cargoDescription: 'Synthetic Quartz Photomask Blanks & Laser Prism Lenses',
    cargoWeightKg: 14200,
    estimatedDeparture: D(-10),
    actualDeparture: D(-10),
    estimatedArrival: D(16),
    revisedEta: undefined,
    status: 'IN_TRANSIT',
    createdAt: D(-22)
  },
  {
    id: 'ship_9',
    bookingNumber: 'CV-900009',
    customerId: 'cust_9', // Silverstone Automotive Spares
    carrierId: 'carr_3', // CMA CGM
    polCode: 'GBLGP',
    podCode: 'KRPUS',
    vesselName: 'CMA CGM Antoine de Saint Exupery',
    voyageNumber: 'AS-9021E',
    containerCount: 5,
    containerType: '40\' High Cube Dry',
    cargoDescription: 'Forged Aluminum Alloy Wheels & Caliper Kits',
    cargoWeightKg: 68500,
    estimatedDeparture: D(-9),
    actualDeparture: D(-9),
    estimatedArrival: D(15),
    revisedEta: D(20), // 5 day delay
    status: 'DELAYED',
    delayDurationDays: 5,
    delayReason: 'Suez Canal convoy scheduling congestion & bunkering delay',
    createdAt: D(-21)
  },
  {
    id: 'ship_10',
    bookingNumber: 'CV-900010',
    customerId: 'cust_10', // Iberian Foods Export
    carrierId: 'carr_2', // MSC
    polCode: 'ESBCN',
    podCode: 'USSAV',
    vesselName: 'MSC Gülsün',
    voyageNumber: 'MG-304W',
    containerCount: 3,
    containerType: '40\' Food-Grade Thermal Insulated',
    cargoDescription: 'Extra Virgin Spanish Olive Oil & Organic Canned Olives',
    cargoWeightKg: 46200,
    estimatedDeparture: D(-4),
    actualDeparture: D(-4),
    estimatedArrival: D(6),
    revisedEta: undefined,
    status: 'IN_TRANSIT',
    createdAt: D(-14)
  },
  {
    id: 'ship_11',
    bookingNumber: 'CV-900011',
    customerId: 'cust_11', // Nova Consumer Goods
    carrierId: 'carr_6', // Evergreen
    polCode: 'CNYAT',
    podCode: 'USLAX',
    vesselName: 'Ever Ace',
    voyageNumber: 'EA-7731E',
    containerCount: 7,
    containerType: '40\' High Cube Dry',
    cargoDescription: 'Biodegradable Bamboo Fiber Kitchenware & Storage Sets',
    cargoWeightKg: 91400,
    estimatedDeparture: D(-7),
    actualDeparture: D(-7),
    estimatedArrival: D(3),
    revisedEta: undefined,
    status: 'ARRIVING_SOON',
    createdAt: D(-19)
  },
  {
    id: 'ship_12',
    bookingNumber: 'CV-900012',
    customerId: 'cust_12', // Cascade Apparel Ltd
    carrierId: 'carr_1', // Maersk Line
    polCode: 'MYPKG',
    podCode: 'AUPEA',
    vesselName: 'Maersk Camden',
    voyageNumber: 'MC-502S',
    containerCount: 4,
    containerType: '40\' High Cube Garment-on-Hanger (GOH)',
    cargoDescription: 'Waterproof Breathable GORE-TEX Mountain Shells',
    cargoWeightKg: 34200,
    estimatedDeparture: D(-3),
    actualDeparture: D(-3),
    estimatedArrival: D(8),
    revisedEta: undefined,
    status: 'IN_TRANSIT',
    createdAt: D(-15)
  }
];

// Generate 48 additional operational shipments (so total is 60) for rich operations view
const ADDITIONAL_OPERATIONAL_SHIPMENTS: Shipment[] = [
  // 13: Delayed
  {
    id: 'ship_13',
    bookingNumber: 'CV-900013',
    customerId: 'ops_internal_1',
    carrierId: 'carr_3',
    polCode: 'CNSHA',
    podCode: 'BEANR',
    vesselName: 'CMA CGM Jacques Saadé',
    voyageNumber: 'JS-401W',
    containerCount: 14,
    containerType: '40\' High Cube Dry',
    cargoDescription: 'Electric Vehicle Lithium Battery Packs (UN3480 HazMat)',
    cargoWeightKg: 210000,
    estimatedDeparture: D(-14),
    actualDeparture: D(-14),
    estimatedArrival: D(8),
    revisedEta: D(13),
    status: 'DELAYED',
    delayDurationDays: 5,
    delayReason: 'Hazmat safety inspection hold at transshipment port (Port Klang)',
    createdAt: D(-28)
  },
  // 14: Delayed
  {
    id: 'ship_14',
    bookingNumber: 'CV-900014',
    customerId: 'ops_internal_2',
    carrierId: 'carr_2',
    polCode: 'INNSA',
    podCode: 'GBLGP',
    vesselName: 'MSC Mina',
    voyageNumber: 'MM-772N',
    containerCount: 6,
    containerType: '20\' Standard Dry',
    cargoDescription: 'Organic Cotton Yarns & Textile Rolls',
    cargoWeightKg: 78000,
    estimatedDeparture: D(-11),
    actualDeparture: D(-11),
    estimatedArrival: D(5),
    revisedEta: D(9),
    status: 'DELAYED',
    delayDurationDays: 4,
    delayReason: 'Severe monsoon terminal backlog and berth congestion in Nhava Sheva',
    createdAt: D(-24)
  },
  // 15: Delayed
  {
    id: 'ship_15',
    bookingNumber: 'CV-900015',
    customerId: 'ops_internal_3',
    carrierId: 'carr_7',
    polCode: 'CNNGB',
    podCode: 'USNYC',
    vesselName: 'COSCO Faith',
    voyageNumber: 'CF-1209E',
    containerCount: 9,
    containerType: '40\' High Cube Dry',
    cargoDescription: 'Residential Air Conditioning Heat Pumps',
    cargoWeightKg: 135000,
    estimatedDeparture: D(-16),
    actualDeparture: D(-16),
    estimatedArrival: D(6),
    revisedEta: D(11),
    status: 'DELAYED',
    delayDurationDays: 5,
    delayReason: 'Panama Canal draft restriction slot rationing backlog',
    createdAt: D(-32)
  },
  // 16: Arriving soon
  {
    id: 'ship_16',
    bookingNumber: 'CV-900016',
    customerId: 'ops_internal_4',
    carrierId: 'carr_4',
    polCode: 'DEHAM',
    podCode: 'USLAX',
    vesselName: 'Berlin Express',
    voyageNumber: 'BE-2601W',
    containerCount: 4,
    containerType: '40\' High Cube Dry',
    cargoDescription: 'Industrial Automation PLCs & Sensors',
    cargoWeightKg: 49000,
    estimatedDeparture: D(-17),
    actualDeparture: D(-17),
    estimatedArrival: D(1),
    status: 'ARRIVING_SOON',
    createdAt: D(-26)
  },
  // 17: Arriving soon
  {
    id: 'ship_17',
    bookingNumber: 'CV-900017',
    customerId: 'ops_internal_5',
    carrierId: 'carr_1',
    polCode: 'CNSHA',
    podCode: 'SGSIN',
    vesselName: 'Marit Maersk',
    voyageNumber: 'MM-5511S',
    containerCount: 10,
    containerType: '40\' Standard Dry',
    cargoDescription: 'Finished Smartphone Assemblies & Battery Chargers',
    cargoWeightKg: 95000,
    estimatedDeparture: D(-6),
    actualDeparture: D(-6),
    estimatedArrival: D(2),
    status: 'ARRIVING_SOON',
    createdAt: D(-16)
  },
  // 18: Arriving soon
  {
    id: 'ship_18',
    bookingNumber: 'CV-900018',
    customerId: 'ops_internal_6',
    carrierId: 'carr_5',
    polCode: 'KRPUS',
    podCode: 'USSAV',
    vesselName: 'ONE Marvel',
    voyageNumber: 'OM-883E',
    containerCount: 8,
    containerType: '40\' High Cube Dry',
    cargoDescription: 'Automotive Steel Sheet Coils',
    cargoWeightKg: 172000,
    estimatedDeparture: D(-19),
    actualDeparture: D(-19),
    estimatedArrival: D(3),
    status: 'ARRIVING_SOON',
    createdAt: D(-30)
  },
  // 19: Booking Confirmed (upcoming departure)
  {
    id: 'ship_19',
    bookingNumber: 'CV-900019',
    customerId: 'ops_internal_7',
    carrierId: 'carr_1',
    polCode: 'DEHAM',
    podCode: 'NLRTM',
    vesselName: 'Vistula Maersk',
    voyageNumber: 'VM-1102N',
    containerCount: 3,
    containerType: '20\' Standard Dry',
    cargoDescription: 'High-Purity Silicon Wafers for Solar Labs',
    cargoWeightKg: 28000,
    estimatedDeparture: D(2),
    estimatedArrival: D(5),
    status: 'BOOKING_CONFIRMED',
    createdAt: D(-4)
  },
  // 20: Booking Confirmed (upcoming departure)
  {
    id: 'ship_20',
    bookingNumber: 'CV-900020',
    customerId: 'ops_internal_8',
    carrierId: 'carr_2',
    polCode: 'USLAX',
    podCode: 'JPTYO',
    vesselName: 'MSC Bellissima',
    voyageNumber: 'MB-441W',
    containerCount: 6,
    containerType: '40\' High Cube Dry',
    cargoDescription: 'Aerospace Fasteners & Titanium Rods',
    cargoWeightKg: 64000,
    estimatedDeparture: D(4),
    estimatedArrival: D(16),
    status: 'BOOKING_CONFIRMED',
    createdAt: D(-3)
  },
  // 21: Booking Confirmed
  {
    id: 'ship_21',
    bookingNumber: 'CV-900021',
    customerId: 'ops_internal_9',
    carrierId: 'carr_6',
    polCode: 'CNYAT',
    podCode: 'BEANR',
    vesselName: 'Ever Given',
    voyageNumber: 'EG-2291W',
    containerCount: 16,
    containerType: '40\' High Cube Dry',
    cargoDescription: 'Retail Sporting Goods & Outdoor Tents',
    cargoWeightKg: 184000,
    estimatedDeparture: D(5),
    estimatedArrival: D(32),
    status: 'BOOKING_CONFIRMED',
    createdAt: D(-2)
  },
  // 22: Delivered
  {
    id: 'ship_22',
    bookingNumber: 'CV-900022',
    customerId: 'ops_internal_10',
    carrierId: 'carr_4',
    polCode: 'NLRTM',
    podCode: 'SGSIN',
    vesselName: 'Barzan Express',
    voyageNumber: 'BX-9041E',
    containerCount: 5,
    containerType: '40\' High Cube Dry',
    cargoDescription: 'Specialty Chemical Catalysts in Steel Drums',
    cargoWeightKg: 72000,
    estimatedDeparture: D(-28),
    actualDeparture: D(-28),
    estimatedArrival: D(-5),
    actualArrival: D(-5),
    status: 'DELIVERED',
    createdAt: D(-45)
  },
  // 23: Delivered
  {
    id: 'ship_23',
    bookingNumber: 'CV-900023',
    customerId: 'ops_internal_11',
    carrierId: 'carr_1',
    polCode: 'JPTYO',
    podCode: 'USNYC',
    vesselName: 'Monaco Maersk',
    voyageNumber: 'MM-7822E',
    containerCount: 3,
    containerType: '40\' High Cube Dry',
    cargoDescription: 'Laboratory Spectrometers & Optical Sensors',
    cargoWeightKg: 31000,
    estimatedDeparture: D(-26),
    actualDeparture: D(-26),
    estimatedArrival: D(-3),
    actualArrival: D(-2),
    status: 'DELIVERED',
    createdAt: D(-42)
  },
  // 24: Delivered
  {
    id: 'ship_24',
    bookingNumber: 'CV-900024',
    customerId: 'ops_internal_12',
    carrierId: 'carr_3',
    polCode: 'ESBCN',
    podCode: 'AEJEA',
    vesselName: 'CMA CGM Palais Royal',
    voyageNumber: 'PR-3312E',
    containerCount: 4,
    containerType: '40\' Standard Reefer',
    cargoDescription: 'Artisan Cheeses & Mediterranean Specialty Delicacies',
    cargoWeightKg: 38000,
    estimatedDeparture: D(-20),
    actualDeparture: D(-20),
    estimatedArrival: D(-6),
    actualArrival: D(-6),
    status: 'DELIVERED',
    createdAt: D(-38)
  }
];

// Dynamically generate the remaining 36 shipments (from 25 to 60) for rich operational metrics
const ROUTE_PAIRS: [string, string][] = [
  ['DEHAM', 'SGSIN'], ['DEHAM', 'USNYC'], ['NLRTM', 'USLAX'], ['NLRTM', 'CNSHA'],
  ['BEANR', 'USLAX'], ['BEANR', 'AEJEA'], ['GBLGP', 'CNYAT'], ['GBLGP', 'KRPUS'],
  ['SGSIN', 'BEANR'], ['SGSIN', 'USLAX'], ['USLAX', 'JPTYO'], ['USLAX', 'CNSHA'],
  ['USNYC', 'DEHAM'], ['USSAV', 'NLRTM'], ['CNYAT', 'USLAX'], ['CNYAT', 'GBLGP'],
  ['CNSHA', 'DEHAM'], ['CNSHA', 'ESBCN'], ['CNNGB', 'USLAX'], ['CNNGB', 'NLRTM'],
  ['HKHKG', 'USNYC'], ['JPTYO', 'DEHAM'], ['KRPUS', 'USLAX'], ['AEJEA', 'DEHAM'],
  ['MYPKG', 'SGSIN'], ['INNSA', 'BEANR'], ['ESBCN', 'USNYC'], ['BRSSZ', 'NLRTM'],
  ['AUPEA', 'SGSIN'], ['DEHAM', 'JPTYO'], ['NLRTM', 'AEJEA'], ['SGSIN', 'DEHAM'],
  ['USLAX', 'SGSIN'], ['CNSHA', 'USLAX'], ['BEANR', 'USSAV'], ['GBLGP', 'USLAX']
];

const CARRIER_VESSELS: Record<string, string[]> = {
  carr_1: ['Maersk Mc-Kinney Moller', 'Madrid Maersk', 'Munich Maersk', 'Manchester Maersk', 'Milan Maersk'],
  carr_2: ['MSC Gülsün', 'MSC Isabella', 'MSC Mia', 'MSC Febe', 'MSC Ambra'],
  carr_3: ['CMA CGM Jacques Saadé', 'CMA CGM Champs Elysées', 'CMA CGM Concorde', 'CMA CGM Sorbonne'],
  carr_4: ['Hamburg Express', 'Berlin Express', 'Al Jmeliyah', 'Barzan Express', 'Tsingtao Express'],
  carr_5: ['ONE Apus', 'ONE Commitment', 'ONE Continuity', 'ONE Marvel', 'ONE Triumph'],
  carr_6: ['Ever Given', 'Ever Ace', 'Ever Arm', 'Ever Max', 'Ever Golden'],
  carr_7: ['COSCO Shipping Universe', 'COSCO Faith', 'COSCO Hope', 'COSCO Pride'],
  carr_8: ['YM Wellbeing', 'YM Wonderland', 'YM Wisdom', 'YM Wind']
};

const CARGO_SAMPLES = [
  'Industrial Hydraulic Valves & Seals',
  'Automotive Electronics & Wire Harnesses',
  'Medical Endoscopes & Surgical Instruments',
  'Monocrystalline Solar Cell Modules',
  'High-Grade Stainless Steel Flanges',
  'Eco-Friendly Kraft Packaging Rolls',
  'Telecommunication Fiber Optic Cables',
  'Electronic Diagnostic Test Equipment',
  'Specialty Beverage Processing Valves',
  'Robotic Welder Spare Parts & Motors'
];

for (let i = 25; i <= 60; i++) {
  const pad = String(i).padStart(2, '0');
  const route = ROUTE_PAIRS[(i - 25) % ROUTE_PAIRS.length];
  const carrierId = `carr_${((i - 25) % 8) + 1}`;
  const vesselList = CARRIER_VESSELS[carrierId] || ['Compass Voyager'];
  const vesselName = vesselList[i % vesselList.length];
  const voyageNumber = `${vesselName.substring(0, 2).toUpperCase()}-${2600 + i}`;
  const cargoDescription = CARGO_SAMPLES[(i - 25) % CARGO_SAMPLES.length];

  let status: ShipmentStatus = 'IN_TRANSIT';
  let departureOffset = -(i % 15 + 2);
  let arrivalOffset = (i % 18 + 3);
  let revisedEta: string | undefined = undefined;
  let delayDurationDays: number | undefined = undefined;
  let delayReason: string | undefined = undefined;
  let actualArrival: string | undefined = undefined;

  if (i % 7 === 0) {
    status = 'DELAYED';
    delayDurationDays = (i % 4) + 2;
    arrivalOffset += delayDurationDays;
    revisedEta = D(arrivalOffset);
    delayReason = i % 2 === 0 ? 'Severe marine weather storm divergence' : 'Terminal crane maintenance hold at transshipment port';
  } else if (i % 6 === 0) {
    status = 'ARRIVING_SOON';
    arrivalOffset = (i % 3) + 1;
  } else if (i % 8 === 0) {
    status = 'BOOKING_CONFIRMED';
    departureOffset = (i % 5) + 1;
    arrivalOffset = departureOffset + 24;
  } else if (i % 9 === 0) {
    status = 'DELIVERED';
    departureOffset = -30;
    arrivalOffset = -4;
    actualArrival = D(-4);
  }

  ADDITIONAL_OPERATIONAL_SHIPMENTS.push({
    id: `ship_${i}`,
    bookingNumber: `CV-9000${pad}`,
    customerId: `ops_gen_${i}`,
    carrierId,
    polCode: route[0],
    podCode: route[1],
    vesselName,
    voyageNumber,
    containerCount: ((i * 3) % 12) + 2,
    containerType: i % 4 === 0 ? '40\' Reefer' : (i % 3 === 0 ? '20\' Standard Dry' : '40\' High Cube Dry'),
    cargoDescription,
    cargoWeightKg: 18000 + (i * 2400),
    estimatedDeparture: D(departureOffset),
    actualDeparture: departureOffset <= 0 ? D(departureOffset) : undefined,
    estimatedArrival: D(arrivalOffset),
    revisedEta,
    actualArrival,
    status,
    delayDurationDays,
    delayReason,
    createdAt: D(departureOffset - 12)
  });
}

export const SEED_SHIPMENTS: Shipment[] = [
  ...CUSTOMER_SHIPMENTS,
  ...ADDITIONAL_OPERATIONAL_SHIPMENTS
];

// Helper to generate chronological milestones for any shipment
export function generateMilestonesForShipment(shipment: Shipment): MilestoneEvent[] {
  const events: MilestoneEvent[] = [];
  const pol = SEED_PORTS.find(p => p.code === shipment.polCode)?.name || shipment.polCode;
  const pod = SEED_PORTS.find(p => p.code === shipment.podCode)?.name || shipment.podCode;
  const estDep = new Date(shipment.estimatedDeparture);
  const estArr = new Date(shipment.revisedEta || shipment.estimatedArrival);

  // Helper date offset
  const addDays = (d: Date, days: number) => {
    const copy = new Date(d);
    copy.setDate(copy.getDate() + days);
    return copy.toISOString().split('T')[0];
  };

  const isDelivered = shipment.status === 'DELIVERED';
  const isArrivingSoon = shipment.status === 'ARRIVING_SOON';
  const isInTransit = shipment.status === 'IN_TRANSIT' || shipment.status === 'DELAYED' || isArrivingSoon || isDelivered;
  const isBooked = true;

  // 1. Booking Confirmed
  events.push({
    id: `ev_${shipment.id}_1`,
    shipmentId: shipment.id,
    milestone: 'BOOKING_CONFIRMED',
    title: 'Booking Confirmed & Equipment Allocated',
    eventDate: addDays(estDep, -7),
    location: `${pol} Export Office`,
    description: `Booking confirmed for ${shipment.containerCount}x ${shipment.containerType}. Carrier space allocated on vessel ${shipment.vesselName}.`,
    isConfirmed: isBooked,
    category: 'actual'
  });

  // 2. Cargo Received
  events.push({
    id: `ev_${shipment.id}_2`,
    shipmentId: shipment.id,
    milestone: 'CARGO_RECEIVED',
    title: 'Cargo Received at Consolidation Depot',
    eventDate: addDays(estDep, -4),
    location: `${pol} Freight Station`,
    description: `Cargo inspected, weighed, and verified against manifest (${shipment.cargoWeightKg.toLocaleString()} kg).`,
    isConfirmed: isInTransit || isDelivered,
    category: 'actual'
  });

  // 3. Gate-In
  events.push({
    id: `ev_${shipment.id}_3`,
    shipmentId: shipment.id,
    milestone: 'GATE_IN',
    title: 'Container Gate-In at Terminal',
    eventDate: addDays(estDep, -2),
    location: `${pol} Container Terminal`,
    description: 'Containers passed terminal security scan, customs seal intact, staged in loading yard.',
    isConfirmed: isInTransit || isDelivered,
    category: 'actual'
  });

  // 4. Loaded on Vessel
  events.push({
    id: `ev_${shipment.id}_4`,
    shipmentId: shipment.id,
    milestone: 'LOADED_ON_VESSEL',
    title: `Loaded Aboard Vessel ${shipment.vesselName}`,
    eventDate: addDays(estDep, -1),
    location: `${pol} Berth Area`,
    description: `Gantry crane loading completed. Stowage position confirmed on Voyage ${shipment.voyageNumber}.`,
    isConfirmed: isInTransit || isDelivered,
    category: 'actual'
  });

  // 5. Vessel Departed
  events.push({
    id: `ev_${shipment.id}_5`,
    shipmentId: shipment.id,
    milestone: 'VESSEL_DEPARTED',
    title: `Vessel Departed from ${pol}`,
    eventDate: shipment.actualDeparture || shipment.estimatedDeparture,
    location: `${pol} Harbor Channel`,
    description: `Vessel underway on oceanic transit route towards ${pod}. Navigation coordinates logged.`,
    isConfirmed: isInTransit || isDelivered,
    category: 'actual'
  });

  // 6. Transshipment (if applicable or mid-ocean transit waypoint)
  const midDate = addDays(estDep, Math.floor((estArr.getTime() - estDep.getTime()) / (1000 * 60 * 60 * 24 * 2)));
  if (shipment.status === 'DELAYED') {
    events.push({
      id: `ev_${shipment.id}_6`,
      shipmentId: shipment.id,
      milestone: 'TRANSSHIPMENT',
      title: 'Voyage Schedule Revision / Route Delay Alert',
      eventDate: midDate,
      location: 'International Maritime Corridor',
      description: `Schedule adjustment recorded. Delay: ${shipment.delayDurationDays} days. Reason: ${shipment.delayReason}. Revised ETA: ${shipment.revisedEta}.`,
      isConfirmed: true,
      category: 'revised',
      originalDate: shipment.estimatedArrival
    });
  } else {
    events.push({
      id: `ev_${shipment.id}_6`,
      shipmentId: shipment.id,
      milestone: 'TRANSSHIPMENT',
      title: 'Mid-Ocean Passage Waypoint Logged',
      eventDate: midDate,
      location: 'Open Ocean Corridor',
      description: 'Satellite automated AIS positioning check confirmed normal transit speed and weather conditions.',
      isConfirmed: isInTransit || isDelivered,
      category: isInTransit ? 'actual' : 'planned'
    });
  }

  // 7. Arrival at Destination
  events.push({
    id: `ev_${shipment.id}_7`,
    shipmentId: shipment.id,
    milestone: 'ARRIVAL_AT_DESTINATION',
    title: `Arrival at ${pod}`,
    eventDate: shipment.actualArrival || shipment.revisedEta || shipment.estimatedArrival,
    location: `${pod} Inbound Anchorage`,
    description: isDelivered 
      ? `Vessel berthed safely at ${pod}. Discharge operations completed.` 
      : `Estimated arrival and pilot boarding scheduled at ${pod}.`,
    isConfirmed: isDelivered,
    category: isDelivered ? 'actual' : (shipment.revisedEta ? 'revised' : 'planned')
  });

  // 8. Customs Clearance
  events.push({
    id: `ev_${shipment.id}_8`,
    shipmentId: shipment.id,
    milestone: 'CUSTOMS_CLEARANCE',
    title: 'Import Customs Clearance & Documentation',
    eventDate: addDays(new Date(shipment.revisedEta || shipment.estimatedArrival), 1),
    location: `${pod} Customs Inspection Zone`,
    description: isDelivered 
      ? 'Import declaration approved, duties verified, regulatory release granted.'
      : 'Documentation submitted for automated electronic customs pre-clearance.',
    isConfirmed: isDelivered,
    category: isDelivered ? 'actual' : 'planned'
  });

  // 9. Cargo Available
  events.push({
    id: `ev_${shipment.id}_9`,
    shipmentId: shipment.id,
    milestone: 'CARGO_AVAILABLE',
    title: 'Cargo Available for Final Drayage / Delivery',
    eventDate: addDays(new Date(shipment.revisedEta || shipment.estimatedArrival), 2),
    location: `${pod} Yard Gate`,
    description: isDelivered
      ? 'Container released from bonded storage for inland motor carrier pickup.'
      : 'Staging in delivery queue pending gate release authorization.',
    isConfirmed: isDelivered,
    category: isDelivered ? 'actual' : 'planned'
  });

  // 10. Delivered
  if (isDelivered) {
    events.push({
      id: `ev_${shipment.id}_10`,
      shipmentId: shipment.id,
      milestone: 'DELIVERED',
      title: 'Final Consignee Delivery Confirmed',
      eventDate: addDays(new Date(shipment.actualArrival || shipment.estimatedArrival), 3),
      location: 'Consignee Receiving Facility',
      description: 'Proof of Delivery (POD) signed electronically. Seal verified unbroken. Shipment closed.',
      isConfirmed: true,
      category: 'actual'
    });
  }

  return events;
}

// Pre-generate all milestone events for all seed shipments
export const SEED_MILESTONE_EVENTS: MilestoneEvent[] = SEED_SHIPMENTS.flatMap(generateMilestonesForShipment);

// Alternative carrier options dataset for comparison module
export const SEED_CARRIER_ALTERNATIVES: AlternativeCarrierOption[] = [
  // Route: DEHAM -> SGSIN
  {
    id: 'alt_1',
    polCode: 'DEHAM',
    podCode: 'SGSIN',
    carrierId: 'carr_4', // Hapag-Lloyd
    vesselName: 'Hamburg Express',
    voyageNumber: 'HE-2641E',
    plannedDeparture: D(3),
    estimatedArrival: D(25),
    transitDays: 22,
    scheduleAvailability: 'Available',
    historicalDelays: '0.4 avg days',
    onTimePerformance: 94.2,
    quotedFreightCost: 2450,
    isRecommended: true,
    recommendationReason: 'Recommended because this carrier has a direct matching schedule, the shortest transit duration (22 days), and the highest recorded on-time reliability (94.2%) among available options.'
  },
  {
    id: 'alt_2',
    polCode: 'DEHAM',
    podCode: 'SGSIN',
    carrierId: 'carr_1', // Maersk Line
    vesselName: 'Madrid Maersk',
    voyageNumber: 'MM-2604E',
    plannedDeparture: D(5),
    estimatedArrival: D(29),
    transitDays: 24,
    scheduleAvailability: 'Available',
    historicalDelays: '0.9 avg days',
    onTimePerformance: 88.5,
    quotedFreightCost: 2600,
    isRecommended: false
  },
  {
    id: 'alt_3',
    polCode: 'DEHAM',
    podCode: 'SGSIN',
    carrierId: 'carr_2', // MSC
    vesselName: 'MSC Isabella',
    voyageNumber: 'MI-1052E',
    plannedDeparture: D(7),
    estimatedArrival: D(33),
    transitDays: 26,
    scheduleAvailability: 'Limited Space',
    historicalDelays: '1.2 avg days',
    onTimePerformance: 85.0,
    quotedFreightCost: 2320,
    isRecommended: false
  },
  {
    id: 'alt_4',
    polCode: 'DEHAM',
    podCode: 'SGSIN',
    carrierId: 'carr_7', // COSCO
    vesselName: 'COSCO Pride',
    voyageNumber: 'CP-4402E',
    plannedDeparture: D(6),
    estimatedArrival: D(34),
    transitDays: 28,
    scheduleAvailability: 'Available',
    historicalDelays: 'Not available',
    onTimePerformance: null, // Transparent missing data
    quotedFreightCost: null, // Transparent missing data
    isRecommended: false
  },

  // Route: JPTYO -> USLAX
  {
    id: 'alt_5',
    polCode: 'JPTYO',
    podCode: 'USLAX',
    carrierId: 'carr_5', // ONE
    vesselName: 'ONE Commitment',
    voyageNumber: 'OC-096W',
    plannedDeparture: D(4),
    estimatedArrival: D(16),
    transitDays: 12,
    scheduleAvailability: 'Available',
    historicalDelays: '0.6 avg days',
    onTimePerformance: 91.8,
    quotedFreightCost: 1980,
    isRecommended: true,
    recommendationReason: 'Recommended due to the shortest trans-Pacific transit time (12 days) and strong schedule fidelity across Tokyo-Los Angeles direct service.'
  },
  {
    id: 'alt_6',
    polCode: 'JPTYO',
    podCode: 'USLAX',
    carrierId: 'carr_1', // Maersk
    vesselName: 'Merete Maersk',
    voyageNumber: 'MM-9912W',
    plannedDeparture: D(6),
    estimatedArrival: D(20),
    transitDays: 14,
    scheduleAvailability: 'Available',
    historicalDelays: '0.8 avg days',
    onTimePerformance: 89.0,
    quotedFreightCost: 2150,
    isRecommended: false
  },
  {
    id: 'alt_7',
    polCode: 'JPTYO',
    podCode: 'USLAX',
    carrierId: 'carr_6', // Evergreen
    vesselName: 'Ever Front',
    voyageNumber: 'EF-3301W',
    plannedDeparture: D(8),
    estimatedArrival: D(23),
    transitDays: 15,
    scheduleAvailability: 'Waitlist',
    historicalDelays: 'Not available',
    onTimePerformance: null,
    quotedFreightCost: 1850,
    isRecommended: false
  },

  // Route: GBLGP -> CNYAT
  {
    id: 'alt_8',
    polCode: 'GBLGP',
    podCode: 'CNYAT',
    carrierId: 'carr_1', // Maersk
    vesselName: 'Munich Maersk',
    voyageNumber: 'MM-3302S',
    plannedDeparture: D(5),
    estimatedArrival: D(35),
    transitDays: 30,
    scheduleAvailability: 'Available',
    historicalDelays: '0.7 avg days',
    onTimePerformance: 90.1,
    quotedFreightCost: 2280,
    isRecommended: true,
    recommendationReason: 'Recommended because Maersk operates a direct Europe-Asia pendulum string with guaranteed weekly terminal berthing at London Gateway and Yantian.'
  },
  {
    id: 'alt_9',
    polCode: 'GBLGP',
    podCode: 'CNYAT',
    carrierId: 'carr_3', // CMA CGM
    vesselName: 'CMA CGM Concorde',
    voyageNumber: 'CC-7712S',
    plannedDeparture: D(7),
    estimatedArrival: D(39),
    transitDays: 32,
    scheduleAvailability: 'Available',
    historicalDelays: '1.4 avg days',
    onTimePerformance: 82.5,
    quotedFreightCost: 2120,
    isRecommended: false
  },

  // Route: NLRTM -> USNYC
  {
    id: 'alt_10',
    polCode: 'NLRTM',
    podCode: 'USNYC',
    carrierId: 'carr_1', // Maersk
    vesselName: 'Maersk Mc-Kinney Moller',
    voyageNumber: 'MM-2621W',
    plannedDeparture: D(4),
    estimatedArrival: D(12),
    transitDays: 8,
    scheduleAvailability: 'Available',
    historicalDelays: '0.5 avg days',
    onTimePerformance: 93.0,
    quotedFreightCost: 2850,
    isRecommended: true,
    recommendationReason: 'Recommended because this carrier provides an express 8-day North Atlantic transit with certified reefer monitoring and high reliability.'
  },
  {
    id: 'alt_11',
    polCode: 'NLRTM',
    podCode: 'USNYC',
    carrierId: 'carr_4', // Hapag-Lloyd
    vesselName: 'Dusseldorf Express',
    voyageNumber: 'DE-104W',
    plannedDeparture: D(6),
    estimatedArrival: D(16),
    transitDays: 10,
    scheduleAvailability: 'Available',
    historicalDelays: '0.6 avg days',
    onTimePerformance: 91.0,
    quotedFreightCost: 2790,
    isRecommended: false
  },
  {
    id: 'alt_12',
    polCode: 'NLRTM',
    podCode: 'USNYC',
    carrierId: 'carr_2', // MSC
    vesselName: 'MSC Febe',
    voyageNumber: 'MF-4401W',
    plannedDeparture: D(8),
    estimatedArrival: D(19),
    transitDays: 11,
    scheduleAvailability: 'Limited Space',
    historicalDelays: 'Not available',
    onTimePerformance: null,
    quotedFreightCost: null,
    isRecommended: false
  },

  // Route: BEANR -> AEJEA
  {
    id: 'alt_13',
    polCode: 'BEANR',
    podCode: 'AEJEA',
    carrierId: 'carr_2', // MSC
    vesselName: 'MSC Isabella',
    voyageNumber: 'MI-1050E',
    plannedDeparture: D(3),
    estimatedArrival: D(18),
    transitDays: 15,
    scheduleAvailability: 'Available',
    historicalDelays: '0.9 avg days',
    onTimePerformance: 87.4,
    quotedFreightCost: 1950,
    isRecommended: true,
    recommendationReason: 'Recommended based on direct Antwerp to Jebel Ali calling schedule with specialized cold-chain capacity and verified transit duration.'
  },
  {
    id: 'alt_14',
    polCode: 'BEANR',
    podCode: 'AEJEA',
    carrierId: 'carr_3', // CMA CGM
    vesselName: 'CMA CGM Palais Royal',
    voyageNumber: 'PR-3314E',
    plannedDeparture: D(6),
    estimatedArrival: D(23),
    transitDays: 17,
    scheduleAvailability: 'Available',
    historicalDelays: '1.2 avg days',
    onTimePerformance: 84.1,
    quotedFreightCost: 2050,
    isRecommended: false
  },

  // Route: CNSHA -> ESBCN
  {
    id: 'alt_15',
    polCode: 'CNSHA',
    podCode: 'ESBCN',
    carrierId: 'carr_7', // COSCO
    vesselName: 'COSCO Shipping Universe',
    voyageNumber: 'CU-4404W',
    plannedDeparture: D(5),
    estimatedArrival: D(27),
    transitDays: 22,
    scheduleAvailability: 'Available',
    historicalDelays: '1.1 avg days',
    onTimePerformance: 86.8,
    quotedFreightCost: 2100,
    isRecommended: true,
    recommendationReason: 'Recommended because COSCO offers high-capacity solar container allocations and direct Mediterranean express service into Barcelona BEST terminal.'
  },
  {
    id: 'alt_16',
    polCode: 'CNSHA',
    podCode: 'ESBCN',
    carrierId: 'carr_6', // Evergreen
    vesselName: 'Ever Arm',
    voyageNumber: 'EA-1092W',
    plannedDeparture: D(7),
    estimatedArrival: D(31),
    transitDays: 24,
    scheduleAvailability: 'Available',
    historicalDelays: '1.3 avg days',
    onTimePerformance: 83.2,
    quotedFreightCost: 2180,
    isRecommended: false
  },

  // Route: CNYAT -> USLAX
  {
    id: 'alt_17',
    polCode: 'CNYAT',
    podCode: 'USLAX',
    carrierId: 'carr_6', // Evergreen
    vesselName: 'Ever Ace',
    voyageNumber: 'EA-7734E',
    plannedDeparture: D(4),
    estimatedArrival: D(15),
    transitDays: 11,
    scheduleAvailability: 'Available',
    historicalDelays: '0.7 avg days',
    onTimePerformance: 92.1,
    quotedFreightCost: 2250,
    isRecommended: true,
    recommendationReason: 'Recommended for the fastest Trans-Pacific crossing (11 days) and dedicated container discharge windows at Los Angeles Pier 400.'
  },
  {
    id: 'alt_18',
    polCode: 'CNYAT',
    podCode: 'USLAX',
    carrierId: 'carr_5', // ONE
    vesselName: 'ONE Triumph',
    voyageNumber: 'OT-4401E',
    plannedDeparture: D(6),
    estimatedArrival: D(18),
    transitDays: 12,
    scheduleAvailability: 'Limited Space',
    historicalDelays: '0.8 avg days',
    onTimePerformance: 89.5,
    quotedFreightCost: 2310,
    isRecommended: false
  },
  {
    id: 'alt_19',
    polCode: 'CNYAT',
    podCode: 'USLAX',
    carrierId: 'carr_7', // COSCO
    vesselName: 'COSCO Hope',
    voyageNumber: 'CH-9921E',
    plannedDeparture: D(9),
    estimatedArrival: D(23),
    transitDays: 14,
    scheduleAvailability: 'Available',
    historicalDelays: 'Not available',
    onTimePerformance: null,
    quotedFreightCost: 1990,
    isRecommended: false
  }
];

// Seed Notifications - accurately scoped to users & customers
export const SEED_NOTIFICATIONS: AppNotification[] = [
  // Customer 1: Nordex
  {
    id: 'notif_1',
    customerId: 'cust_1',
    shipmentId: 'ship_1',
    bookingNumber: 'CV-900001',
    title: 'Vessel Mid-Route Positioning Check',
    message: 'Hamburg Express (Voyage HE-2641E) confirmed on track passing Suez Southbound. Estimated arrival at Singapore remains unchanged.',
    type: 'status_change',
    timestamp: '2026-10-18T14:30:00Z',
    read: false
  },
  // Customer 2: Pacific Rim (Delayed!)
  {
    id: 'notif_2',
    customerId: 'cust_2',
    shipmentId: 'ship_2',
    bookingNumber: 'CV-900002',
    title: 'Schedule Revision Notice: Revised ETA',
    message: 'Typhoon Talim evasion route has added 3 days to passage. Revised estimated arrival at Los Angeles is now October 26, 2026.',
    type: 'delay_alert',
    timestamp: '2026-10-18T09:15:00Z',
    read: false
  },
  // Customer 3: Apex Tools
  {
    id: 'notif_3',
    customerId: 'cust_3',
    shipmentId: 'ship_3',
    bookingNumber: 'CV-900003',
    title: 'Vessel Departed from London Gateway',
    message: 'Madrid Maersk departed on schedule with 2x 20\' containers stowed under deck. Tracking active.',
    type: 'status_change',
    timestamp: '2026-10-17T18:00:00Z',
    read: true
  },
  // Customer 4: Horizon Medical
  {
    id: 'notif_4',
    customerId: 'cust_4',
    shipmentId: 'ship_4',
    bookingNumber: 'CV-900004',
    title: 'Cold-Chain Reefer Status Verified: -20°C',
    message: 'Automated telemetry from Maersk Mc-Kinney Moller confirms stable -20.2°C temperature throughout North Atlantic transit. Arrival in 2 days.',
    type: 'eta_revision',
    timestamp: '2026-10-18T16:45:00Z',
    read: false
  },
  // Customer 5: BioVenture Pharma
  {
    id: 'notif_5',
    customerId: 'cust_5',
    shipmentId: 'ship_5',
    bookingNumber: 'CV-900005',
    title: 'Booking Confirmed with MSC',
    message: 'Booking CV-900005 confirmed for Antwerp to Jebel Ali. Equipment release pickup scheduled at Deurganck Dock.',
    type: 'booking_confirmed',
    timestamp: '2026-10-16T11:20:00Z',
    read: true
  },
  // Customer 6: Atlas Solar (Delivered)
  {
    id: 'notif_6',
    customerId: 'cust_6',
    shipmentId: 'ship_6',
    bookingNumber: 'CV-900006',
    title: 'Shipment Successfully Delivered',
    message: '12 containers of photovoltaic modules delivered to consignee in Barcelona. Digital Proof of Delivery signed.',
    type: 'delivered',
    timestamp: '2026-10-18T10:00:00Z',
    read: true
  },
  // Customer 9: Silverstone (Delayed!)
  {
    id: 'notif_7',
    customerId: 'cust_9',
    shipmentId: 'ship_9',
    bookingNumber: 'CV-900009',
    title: 'Transit Delay Alert: Suez Convoy Queue',
    message: 'CMA CGM Antoine de Saint Exupery experiencing 5-day convoy queue backlog. Revised ETA at Busan updated to November 8, 2026.',
    type: 'delay_alert',
    timestamp: '2026-10-18T08:30:00Z',
    read: false
  },
  // Customer 11: Nova Consumer Goods
  {
    id: 'notif_8',
    customerId: 'cust_11',
    shipmentId: 'ship_11',
    bookingNumber: 'CV-900011',
    title: 'Vessel Arriving Soon at Los Angeles',
    message: 'Ever Ace is within 72 hours of pilot boarding at Port of Los Angeles. Customs pre-clearance documents accepted.',
    type: 'eta_revision',
    timestamp: '2026-10-18T20:10:00Z',
    read: false
  },
  // Operational Global Notifications (visible to Operations)
  {
    id: 'notif_ops_1',
    shipmentId: 'ship_13',
    bookingNumber: 'CV-900013',
    title: 'Operations Alert: HazMat Port Klang Delay',
    message: 'Shipment CV-900013 (EV Battery Packs) held for Port Klang hazardous transit re-certification. Added 5 days to schedule.',
    type: 'delay_alert',
    timestamp: '2026-10-18T15:20:00Z',
    read: false
  },
  {
    id: 'notif_ops_2',
    shipmentId: 'ship_14',
    bookingNumber: 'CV-900014',
    title: 'Operations Alert: Nhava Sheva Monsoon Backlog',
    message: 'GTI terminal berth queue at Nhava Sheva has delayed MSC Mina departure by 4 days. Consignees notified.',
    type: 'delay_alert',
    timestamp: '2026-10-18T12:00:00Z',
    read: false
  },
  {
    id: 'notif_ops_3',
    shipmentId: 'ship_16',
    bookingNumber: 'CV-900016',
    title: 'Upcoming Arrival: Berlin Express',
    message: 'Shipment CV-900016 arriving at Los Angeles Pier 400 within 24 hours. Terminal gate drayage appointment confirmed.',
    type: 'eta_revision',
    timestamp: '2026-10-18T19:00:00Z',
    read: true
  },
  {
    id: 'notif_ops_4',
    shipmentId: 'ship_19',
    bookingNumber: 'CV-900019',
    title: 'New Booking Created: Hamburg to Rotterdam',
    message: 'Vistula Maersk booking confirmed for 3x 20\' dry containers. Scheduled departure in 2 days.',
    type: 'booking_confirmed',
    timestamp: '2026-10-17T09:40:00Z',
    read: true
  }
];
