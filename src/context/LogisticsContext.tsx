import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Port,
  Carrier,
  Customer,
  User,
  Shipment,
  MilestoneEvent,
  AlternativeCarrierOption,
  AppNotification,
  ShipmentStatus
} from '../types/logistics';
import {
  SEED_PORTS,
  SEED_CARRIERS,
  SEED_CUSTOMERS,
  SEED_USERS,
  SEED_SHIPMENTS,
  SEED_MILESTONE_EVENTS,
  SEED_CARRIER_ALTERNATIVES,
  SEED_NOTIFICATIONS
} from '../data/seedData';

interface LogisticsContextType {
  ports: Port[];
  carriers: Carrier[];
  customers: Customer[];
  users: User[];
  shipments: Shipment[];
  milestones: MilestoneEvent[];
  carrierAlternatives: AlternativeCarrierOption[];
  notifications: AppNotification[];
  currentUser: User;
  setCurrentUser: (user: User) => void;
  selectedCustomer: Customer | null;
  customerShipment: Shipment | null; // Strict 1:1 customer shipment
  
  // Methods
  searchSchedules: (polCode: string, podCode: string, carrierId: string, bookingNumber: string) => Shipment | null;
  getShipmentByBooking: (bookingNumber: string) => Shipment | undefined;
  getMilestonesForShipment: (shipmentId: string) => MilestoneEvent[];
  getCarrierById: (carrierId: string) => Carrier | undefined;
  getPortByCode: (code: string) => Port | undefined;
  getCustomerById: (customerId: string) => Customer | undefined;
  
  // Mutations
  updateShipmentStatus: (shipmentId: string, status: ShipmentStatus, delayReason?: string, revisedEta?: string) => void;
  updateShipmentEta: (shipmentId: string, newRevisedEta: string, delayReason: string, operationalRemarks?: string) => void;
  updateShipmentCarrier: (shipmentId: string, carrierId: string, vesselName: string, voyageNumber: string) => void;
  addMilestoneEvent: (shipmentId: string, newEvent: Omit<MilestoneEvent, 'id' | 'shipmentId'>) => void;
  createBooking: (newShipment: Omit<Shipment, 'id' | 'createdAt'>) => Shipment;
  addCustomerUser: (params: {
    name: string;
    email: string;
    companyName: string;
    jobTitle?: string;
    industry?: string;
    country?: string;
    shipmentId: string;
  }) => User;
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
  resetDemoData: () => void;

  // Dynamic Dashboard Stats
  dashboardStats: {
    totalShipments: number;
    inTransitCount: number;
    delayedCount: number;
    deliveredCount: number;
    upcomingArrivalsCount: number;
    upcomingDeparturesCount: number;
    bookingConfirmationsCount: number;
    totalCustomersCount: number;
  };
}

const STORAGE_KEY = 'COMPASS_VOYAGE_DATA_V2';

const LogisticsContext = createContext<LogisticsContextType | null>(null);

export const LogisticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try loading from localStorage, fallback to Seed
  const loadInitialData = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.shipments && parsed.customers) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using seed data:', e);
    }
    return {
      ports: SEED_PORTS,
      carriers: SEED_CARRIERS,
      customers: SEED_CUSTOMERS,
      users: SEED_USERS,
      shipments: SEED_SHIPMENTS,
      milestones: SEED_MILESTONE_EVENTS,
      carrierAlternatives: SEED_CARRIER_ALTERNATIVES,
      notifications: SEED_NOTIFICATIONS,
      currentUserId: 'user_ops_1' // Elena Rostova by default
    };
  };

  const [initialData] = useState(loadInitialData);

  const [ports] = useState<Port[]>(initialData.ports);
  const [carriers] = useState<Carrier[]>(initialData.carriers);
  const [customers, setCustomers] = useState<Customer[]>(initialData.customers);
  const [users, setUsers] = useState<User[]>(initialData.users);
  const [shipments, setShipments] = useState<Shipment[]>(initialData.shipments);
  const [milestones, setMilestones] = useState<MilestoneEvent[]>(initialData.milestones);
  const [carrierAlternatives] = useState<AlternativeCarrierOption[]>(initialData.carrierAlternatives);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialData.notifications);

  // Active user (starts with Operations Director Elena Rostova)
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const found = initialData.users.find((u: User) => u.id === initialData.currentUserId);
    return found || initialData.users[0];
  });

  // Save to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ports,
          carriers,
          customers,
          users,
          shipments,
          milestones,
          carrierAlternatives,
          notifications,
          currentUserId: currentUser.id
        })
      );
    } catch (e) {
      console.warn('Could not persist to localStorage:', e);
    }
  }, [customers, shipments, milestones, notifications, currentUser, ports, carriers, users, carrierAlternatives]);

  // Derived: Customer object if current user is customer
  const selectedCustomer = useMemo(() => {
    if (currentUser.role !== 'customer' || !currentUser.customerId) return null;
    return customers.find(c => c.id === currentUser.customerId) || null;
  }, [currentUser, customers]);

  // Derived: Strictly ONE assigned shipment for this customer!
  const customerShipment = useMemo(() => {
    if (!selectedCustomer) return null;
    // Find the shipment assigned in customer record or belonging to this customer
    const found = shipments.find(s => s.id === selectedCustomer.assignedShipmentId || s.customerId === selectedCustomer.id);
    return found || null;
  }, [selectedCustomer, shipments]);

  // Search exact shipment matching all 4 criteria
  const searchSchedules = (polCode: string, podCode: string, carrierId: string, bookingNumber: string): Shipment | null => {
    if (!polCode || !podCode || !carrierId || !bookingNumber) return null;
    const match = shipments.find(
      s => s.polCode === polCode &&
           s.podCode === podCode &&
           s.carrierId === carrierId &&
           s.bookingNumber.trim().toUpperCase() === bookingNumber.trim().toUpperCase()
    );
    return match || null;
  };

  const getShipmentByBooking = (bookingNumber: string) => {
    if (!bookingNumber) return undefined;
    return shipments.find(s => s.bookingNumber.trim().toUpperCase() === bookingNumber.trim().toUpperCase());
  };

  const getMilestonesForShipment = (shipmentId: string) => {
    return milestones
      .filter(m => m.shipmentId === shipmentId)
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  };

  const getCarrierById = (carrierId: string) => {
    return carriers.find(c => c.id === carrierId);
  };

  const getPortByCode = (code: string) => {
    return ports.find(p => p.code === code);
  };

  const getCustomerById = (customerId: string) => {
    return customers.find(c => c.id === customerId);
  };

  // Update Shipment Status (Operations only)
  const updateShipmentStatus = (shipmentId: string, status: ShipmentStatus, delayReason?: string, revisedEta?: string) => {
    setShipments(prev =>
      prev.map(s => {
        if (s.id !== shipmentId) return s;
        return {
          ...s,
          status,
          delayReason: delayReason !== undefined ? delayReason : s.delayReason,
          revisedEta: revisedEta !== undefined ? revisedEta : s.revisedEta,
          delayDurationDays: delayReason && revisedEta ? 4 : s.delayDurationDays
        };
      })
    );

    // Also create a notification
    const targetShipment = shipments.find(s => s.id === shipmentId);
    if (targetShipment) {
      const newNotif: AppNotification = {
        id: `notif_${Date.now()}`,
        customerId: targetShipment.customerId.startsWith('cust_') ? targetShipment.customerId : undefined,
        shipmentId,
        bookingNumber: targetShipment.bookingNumber,
        title: `Shipment Status Updated: ${status.replace('_', ' ')}`,
        message: delayReason 
          ? `Status updated to ${status}. Note: ${delayReason}. Revised ETA: ${revisedEta || 'Pending confirmation'}`
          : `Shipment status updated to ${status.replace('_', ' ')} by Operations.`,
        type: status === 'DELAYED' ? 'delay_alert' : (status === 'DELIVERED' ? 'delivered' : 'status_change'),
        timestamp: new Date().toISOString(),
        read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  // Update Revised ETA independently without modifying shipment status
  const updateShipmentEta = (
    shipmentId: string,
    newRevisedEta: string,
    delayReason: string,
    operationalRemarks?: string
  ) => {
    const targetShipment = shipments.find(s => s.id === shipmentId);
    if (!targetShipment) return;

    const previousEta = targetShipment.revisedEta || targetShipment.estimatedArrival;
    
    // Calculate delay duration days between newRevisedEta and original estimatedArrival
    const origDate = new Date(targetShipment.estimatedArrival).getTime();
    const newDate = new Date(newRevisedEta).getTime();
    const diffDays = Math.max(0, Math.ceil((newDate - origDate) / (1000 * 60 * 60 * 24)));

    // 1. Update target shipment preserving original estimatedArrival and existing status
    setShipments(prev =>
      prev.map(s => {
        if (s.id !== shipmentId) return s;
        return {
          ...s,
          revisedEta: newRevisedEta,
          delayReason: delayReason.trim(),
          operationalRemarks: operationalRemarks?.trim() || undefined,
          delayDurationDays: diffDays > 0 ? diffDays : s.delayDurationDays
        };
      })
    );

    // 2. Add milestone event to timeline
    const pod = getPortByCode(targetShipment.podCode);
    const podName = pod?.name || targetShipment.podCode;
    const nowIso = new Date().toISOString();
    const formattedTimestamp = nowIso.replace('T', ' ').slice(0, 16) + ' UTC';

    const etaMilestone: MilestoneEvent = {
      id: `ev_${shipmentId}_eta_${Date.now()}`,
      shipmentId,
      milestone: 'ARRIVAL_AT_DESTINATION',
      title: 'Schedule Revision: Revised ETA Updated',
      eventDate: newRevisedEta.split('T')[0],
      location: `${podName} Port Berth`,
      description: `Previous ETA: ${previousEta} → New Revised ETA: ${newRevisedEta}. Reason: ${delayReason}.${operationalRemarks?.trim() ? ` Operational Remarks: ${operationalRemarks.trim()}.` : ''} [Logged by ${currentUser.name} at ${formattedTimestamp}]`,
      isConfirmed: false,
      category: 'revised',
      originalDate: targetShipment.estimatedArrival
    };

    setMilestones(prev => [...prev, etaMilestone]);

    // 3. Generate shipment-specific notification
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      customerId: targetShipment.customerId.startsWith('cust_') ? targetShipment.customerId : undefined,
      shipmentId,
      bookingNumber: targetShipment.bookingNumber,
      title: `Revised ETA: ${targetShipment.bookingNumber}`,
      message: `Revised ETA set to ${newRevisedEta} (Previous: ${previousEta}). Reason: ${delayReason}.${operationalRemarks?.trim() ? ` Remarks: ${operationalRemarks.trim()}` : ''}`,
      type: 'delay_alert',
      timestamp: nowIso,
      read: false
    };

    setNotifications(prev => [newNotif, ...prev]);
  };

  // Update Carrier assignment on existing shipment
  const updateShipmentCarrier = (shipmentId: string, carrierId: string, vesselName: string, voyageNumber: string) => {
    setShipments(prev =>
      prev.map(s => {
        if (s.id !== shipmentId) return s;
        return {
          ...s,
          carrierId,
          vesselName,
          voyageNumber
        };
      })
    );

    const s = shipments.find(x => x.id === shipmentId);
    const c = carriers.find(x => x.id === carrierId);
    if (s && c) {
      const newNotif: AppNotification = {
        id: `notif_${Date.now()}`,
        customerId: s.customerId.startsWith('cust_') ? s.customerId : undefined,
        shipmentId,
        bookingNumber: s.bookingNumber,
        title: `Carrier Reassigned to ${c.name}`,
        message: `Vessel updated to ${vesselName} (Voyage: ${voyageNumber}). Route schedule adjusted.`,
        type: 'status_change',
        timestamp: new Date().toISOString(),
        read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  // Add custom milestone
  const addMilestoneEvent = (shipmentId: string, newEvent: Omit<MilestoneEvent, 'id' | 'shipmentId'>) => {
    const createdEvent: MilestoneEvent = {
      ...newEvent,
      id: `ev_${shipmentId}_${Date.now()}`,
      shipmentId
    };
    setMilestones(prev => [...prev, createdEvent]);
  };

  // Create booking
  const createBooking = (newShipment: Omit<Shipment, 'id' | 'createdAt'>): Shipment => {
    const id = `ship_${Date.now()}`;
    const fullShipment: Shipment = {
      ...newShipment,
      id,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setShipments(prev => [fullShipment, ...prev]);

    // If assigned to a customer, update customer's assignedShipmentId
    if (newShipment.customerId.startsWith('cust_')) {
      setCustomers(prev =>
        prev.map(c => (c.id === newShipment.customerId ? { ...c, assignedShipmentId: id } : c))
      );
    }

    // Add initial booking confirmation milestone
    const pol = getPortByCode(newShipment.polCode)?.name || newShipment.polCode;
    const initialMilestone: MilestoneEvent = {
      id: `ev_${id}_init`,
      shipmentId: id,
      milestone: 'BOOKING_CONFIRMED',
      title: 'Booking Confirmed & Allocation Reserved',
      eventDate: fullShipment.createdAt,
      location: `${pol} Operations Desk`,
      description: `New booking registered for ${fullShipment.containerCount}x ${fullShipment.containerType}. Assigned vessel ${fullShipment.vesselName}.`,
      isConfirmed: true,
      category: 'actual'
    };
    setMilestones(prev => [initialMilestone, ...prev]);

    // Notification
    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      customerId: newShipment.customerId.startsWith('cust_') ? newShipment.customerId : undefined,
      shipmentId: id,
      bookingNumber: fullShipment.bookingNumber,
      title: 'New Booking Created',
      message: `Booking ${fullShipment.bookingNumber} created from ${newShipment.polCode} to ${newShipment.podCode} with vessel ${fullShipment.vesselName}.`,
      type: 'booking_confirmed',
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [notif, ...prev]);

    return fullShipment;
  };

  // Add customer login account and assign to shipment
  const addCustomerUser = (params: {
    name: string;
    email: string;
    companyName: string;
    jobTitle?: string;
    industry?: string;
    country?: string;
    shipmentId: string;
  }): User => {
    const custId = `cust_${Date.now()}`;
    const userId = `user_cust_${Date.now()}`;

    const newCustomer: Customer = {
      id: custId,
      name: params.name,
      companyName: params.companyName,
      industry: params.industry || 'Global Trade & Logistics',
      country: params.country || 'International',
      contactEmail: params.email,
      contactPhone: '+1 (555) 019-2834',
      assignedShipmentId: params.shipmentId,
      accountTier: 'Enterprise'
    };

    const newUser: User = {
      id: userId,
      name: params.name,
      email: params.email,
      role: 'customer',
      customerId: custId,
      jobTitle: params.jobTitle || 'Logistics Coordinator',
      department: 'Supply Chain Operations'
    };

    setCustomers(prev => [...prev, newCustomer]);
    setUsers(prev => [...prev, newUser]);

    // Ensure the 1:1 customer assignment on the chosen shipment
    setShipments(prev =>
      prev.map(s => (s.id === params.shipmentId ? { ...s, customerId: custId } : s))
    );

    // Create notification
    const targetShipment = shipments.find(s => s.id === params.shipmentId);
    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      customerId: custId,
      shipmentId: params.shipmentId,
      bookingNumber: targetShipment ? targetShipment.bookingNumber : 'CV-NEW',
      title: 'Customer Login Account Created',
      message: `User ${params.name} (${params.companyName}) registered and assigned to booking ${targetShipment ? targetShipment.bookingNumber : params.shipmentId}.`,
      type: 'status_change',
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [notif, ...prev]);

    return newUser;
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => (n.id === notifId ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Reset demo data safely
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCustomers(SEED_CUSTOMERS);
    setUsers(SEED_USERS);
    setShipments(SEED_SHIPMENTS);
    setMilestones(SEED_MILESTONE_EVENTS);
    setNotifications(SEED_NOTIFICATIONS);
    setCurrentUser(SEED_USERS[0]);
  };

  // Dynamically compute live figures from the active dataset
  const dashboardStats = useMemo(() => {
    const today = new Date('2026-10-19T00:00:00Z');
    const in7Days = new Date(today);
    in7Days.setDate(in7Days.getDate() + 7);

    const totalShipments = shipments.length;
    const inTransitCount = shipments.filter(s => s.status === 'IN_TRANSIT').length;
    const delayedCount = shipments.filter(s => s.status === 'DELAYED' || (s.revisedEta && s.revisedEta > s.estimatedArrival && s.status !== 'DELIVERED')).length;
    const deliveredCount = shipments.filter(s => s.status === 'DELIVERED').length;
    const bookingConfirmationsCount = shipments.filter(s => s.status === 'BOOKING_CONFIRMED').length;

    const upcomingArrivalsCount = shipments.filter(s => {
      const arr = new Date(s.revisedEta || s.estimatedArrival);
      return arr >= today && arr <= in7Days && s.status !== 'DELIVERED';
    }).length;

    const upcomingDeparturesCount = shipments.filter(s => {
      const dep = new Date(s.estimatedDeparture);
      return dep >= today && dep <= in7Days && !s.actualDeparture;
    }).length;

    const totalCustomersCount = customers.length;

    return {
      totalShipments,
      inTransitCount,
      delayedCount,
      deliveredCount,
      upcomingArrivalsCount,
      upcomingDeparturesCount,
      bookingConfirmationsCount,
      totalCustomersCount
    };
  }, [shipments, customers]);

  return (
    <LogisticsContext.Provider
      value={{
        ports,
        carriers,
        customers,
        users,
        shipments,
        milestones,
        carrierAlternatives,
        notifications,
        currentUser,
        setCurrentUser,
        selectedCustomer,
        customerShipment,
        searchSchedules,
        getShipmentByBooking,
        getMilestonesForShipment,
        getCarrierById,
        getPortByCode,
        getCustomerById,
        updateShipmentStatus,
        updateShipmentEta,
        updateShipmentCarrier,
        addMilestoneEvent,
        createBooking,
        addCustomerUser,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData,
        dashboardStats
      }}
    >
      {children}
    </LogisticsContext.Provider>
  );
};

export const useLogistics = () => {
  const context = useContext(LogisticsContext);
  if (!context) {
    throw new Error('useLogistics must be used within a LogisticsProvider');
  }
  return context;
};
