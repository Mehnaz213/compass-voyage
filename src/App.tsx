/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LogisticsProvider, useLogistics } from './context/LogisticsContext';
import { DisclaimerBanner } from './components/common/DisclaimerBanner';
import { Navbar } from './components/common/Navbar';
import { LoginView } from './components/auth/LoginView';
import { OperationsDashboard } from './components/operations/OperationsDashboard';
import { ScheduleLookup } from './components/operations/ScheduleLookup';
import { CarrierComparison } from './components/operations/CarrierComparison';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { ShipmentJourneyModal } from './components/journey/ShipmentJourneyModal';
import { CompassAgentModal } from './components/agent/CompassAgentModal';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { NewBookingModal } from './components/operations/NewBookingModal';
import { AddUserModal } from './components/operations/AddUserModal';
import { ResetDataModal } from './components/common/ResetDataModal';
import { Shipment } from './types/logistics';

function MainApp() {
  const { currentUser, customerShipment, resetDemoData } = useLogistics();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<string>(
    currentUser.role === 'operations' ? 'overview' : 'my-shipment'
  );

  // Sync active tab whenever currentUser changes (e.g. on new login)
  React.useEffect(() => {
    setActiveTab(currentUser.role === 'operations' ? 'overview' : 'my-shipment');
  }, [currentUser]);

  // Authentication view toggle
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  // Active Journey modal
  const [journeyShipment, setJourneyShipment] = useState<Shipment | null>(null);

  // Modals & Drawers
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [agentOpen, setAgentOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [newBookingModalOpen, setNewBookingModalOpen] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);

  // Pre-fill state for New Booking from Carrier Comparison
  const [prefillBooking, setPrefillBooking] = useState<{
    carrierId?: string;
    pol?: string;
    pod?: string;
    vessel?: string;
    voyage?: string;
  }>({});

  const handleOpenJourney = (shipment: Shipment) => {
    setJourneyShipment(shipment);
  };

  const handleOpenNewBookingWithCarrier = (
    carrierId: string,
    pol: string,
    pod: string,
    vessel: string,
    voyage: string
  ) => {
    setPrefillBooking({ carrierId, pol, pod, vessel, voyage });
    setNewBookingModalOpen(true);
  };

  if (!isLoggedIn) {
    return <LoginView onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#0D2240] flex flex-col text-slate-100 font-sans antialiased selection:bg-[#B7F500] selection:text-[#0D2240]">
      
      {/* 1. Security & POC Notice Banner */}
      <DisclaimerBanner />

      {/* 2. Top Bar Navigation adhering to 3-zone contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNotifications={() => setNotificationsOpen(true)}
        onOpenAgent={() => setAgentOpen(true)}
        onOpenResetModal={() => setResetModalOpen(true)}
        onLogout={() => setIsLoggedIn(false)}
      />

      {/* 3. Main Dynamic Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {currentUser.role === 'operations' ? (
          <>
            {activeTab === 'overview' && (
              <OperationsDashboard
                onSelectShipmentJourney={handleOpenJourney}
                onNavigateTab={setActiveTab}
                onOpenNewBookingModal={() => {
                  setPrefillBooking({});
                  setNewBookingModalOpen(true);
                }}
                onOpenAddUserModal={() => setAddUserModalOpen(true)}
              />
            )}

            {activeTab === 'schedule-lookup' && (
              <ScheduleLookup onSelectShipmentJourney={handleOpenJourney} />
            )}

            {activeTab === 'carrier-comparison' && (
              <CarrierComparison
                onOpenNewBookingWithCarrier={handleOpenNewBookingWithCarrier}
              />
            )}
          </>
        ) : (
          /* Customer Portal: Strictly Scoped */
          <>
            {activeTab === 'my-shipment' && (
              <CustomerDashboard
                onSelectShipmentJourney={handleOpenJourney}
                onOpenAgent={() => setAgentOpen(true)}
              />
            )}

            {activeTab === 'my-milestones' && customerShipment && (
              <div className="space-y-4">
                <button
                  onClick={() => setActiveTab('my-shipment')}
                  className="text-xs font-semibold text-[#B7F500] hover:underline flex items-center gap-1"
                >
                  ← Back to Shipment Overview
                </button>
                <div className="bg-[#132B4F] rounded-2xl border border-slate-700/70 p-6 shadow-sm">
                  <CustomerDashboard
                    onSelectShipmentJourney={handleOpenJourney}
                    onOpenAgent={() => setAgentOpen(true)}
                  />
                </div>
              </div>
            )}
          </>
        )}

      </main>

      {/* 4. Global Modals & Drawers */}
      
      {/* Shipment Journey Timeline Modal */}
      {journeyShipment && (
        <ShipmentJourneyModal
          shipment={journeyShipment}
          onClose={() => setJourneyShipment(null)}
        />
      )}

      {/* Compass Agent Modal */}
      <CompassAgentModal
        isOpen={agentOpen}
        onClose={() => setAgentOpen(false)}
        onSelectShipment={handleOpenJourney}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onSelectShipment={handleOpenJourney}
      />

      {/* Operations New Booking Modal */}
      <NewBookingModal
        isOpen={newBookingModalOpen}
        onClose={() => setNewBookingModalOpen(false)}
        initialCarrierId={prefillBooking.carrierId}
        initialPol={prefillBooking.pol}
        initialPod={prefillBooking.pod}
        initialVessel={prefillBooking.vessel}
        initialVoyage={prefillBooking.voyage}
      />

      {/* Operations Add Customer User Modal */}
      <AddUserModal
        isOpen={addUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
      />

      {/* Reset Demo Data Modal */}
      <ResetDataModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirmReset={resetDemoData}
      />

      {/* Footer */}
      <footer className="bg-[#09172A] border-t border-slate-800 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Compass Logistics International. Compass Voyage™ Visibility System.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Primary Navy #0D2240</span>
            <span>·</span>
            <span>Neon Green #B7F500</span>
            <span>·</span>
            <button
              onClick={() => setResetModalOpen(true)}
              className="hover:text-rose-400 transition-colors"
            >
              Reset Demo Records
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <LogisticsProvider>
      <MainApp />
    </LogisticsProvider>
  );
}
