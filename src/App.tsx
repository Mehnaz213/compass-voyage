import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar, type NavTab } from './components/Sidebar';
import { NotificationDrawer } from './components/NotificationDrawer';
import { CompassAgentModal } from './components/CompassAgentModal';
import { CreateBookingModal } from './components/CreateBookingModal';
import { LoginPage } from './pages/LoginPage';
import { OperationsDashboard } from './pages/OperationsDashboard';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { ShipmentsPage } from './pages/ShipmentsPage';
import { ShipmentDetailPage } from './pages/ShipmentDetailPage';
import { ScheduleLookupPage } from './pages/ScheduleLookupPage';
import { CustomerTrackingPage } from './pages/CustomerTrackingPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { PortsPage } from './pages/PortsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { localDb } from './services/storage';
import { CompassLogo } from './components/CompassLogo';
import {
  LayoutDashboard,
  Ship,
  CalendarDays,
  Search,
  Bell,
  Bot,
} from 'lucide-react';

const MainApp: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);

  // Modals
  const [agentOpen, setAgentOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [createBookingOpen, setCreateBookingOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Read unread count from localDb whenever user changes
  useEffect(() => {
    if (user) {
      try {
        const { unread_count } = localDb.getNotifications(user.id);
        setUnreadCount(unread_count);
      } catch (e) {}
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07111E] flex flex-col items-center justify-center text-white">
        <div className="mb-4">
          <CompassLogo size="lg" />
        </div>
        <h2 className="font-extrabold text-xl tracking-tight text-white">Compass Voyage</h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">Initializing Compass Logistics International...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const isOps = user.role === 'operations';

  const handleSelectShipment = (id: string) => {
    setSelectedShipmentId(id);
  };

  const handleBackToShipments = () => {
    setSelectedShipmentId(null);
  };

  const handleTabChange = (tab: NavTab) => {
    setSelectedShipmentId(null);
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-[#07111E] flex flex-col font-sans text-slate-100 selection:bg-[#B7F500] selection:text-[#0D2240]">
      {/* Top Header Navbar */}
      <Navbar
        onOpenAgent={() => setAgentOpen(true)}
        onOpenNotifications={() => setNotificationsOpen(true)}
        unreadNotificationsCount={unreadCount}
      />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Dark Navy Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={handleTabChange}
          onOpenAgent={() => setAgentOpen(true)}
          unreadCount={unreadCount}
        />

        {/* Dynamic Content Area with consistent dark navy theme matching Login page */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#081426] pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto">
            {selectedShipmentId ? (
              <ShipmentDetailPage
                shipmentId={selectedShipmentId}
                onBack={handleBackToShipments}
              />
            ) : activeTab === 'dashboard' ? (
              isOps ? (
                <OperationsDashboard
                  onSelectShipment={handleSelectShipment}
                  onNavigateToTab={handleTabChange}
                  onOpenCreateBooking={() => setCreateBookingOpen(true)}
                  onOpenCreateCustomer={() => handleTabChange('users')}
                />
              ) : (
                <CustomerDashboard
                  onSelectShipment={handleSelectShipment}
                  onNavigateToTab={handleTabChange}
                  onOpenAgent={() => setAgentOpen(true)}
                />
              )
            ) : activeTab === 'shipments' ? (
              <ShipmentsPage
                onSelectShipment={handleSelectShipment}
                onOpenCreateBooking={isOps ? () => setCreateBookingOpen(true) : undefined}
              />
            ) : activeTab === 'schedules' ? (
              <ScheduleLookupPage onSelectShipment={handleSelectShipment} />
            ) : activeTab === 'tracking' ? (
              <CustomerTrackingPage onSelectShipment={handleSelectShipment} />
            ) : activeTab === 'users' ? (
              <UserManagementPage onSelectShipment={handleSelectShipment} />
            ) : activeTab === 'ports' ? (
              <PortsPage />
            ) : activeTab === 'notifications' ? (
              <NotificationsPage
                onSelectShipment={handleSelectShipment}
                onUnreadChange={setUnreadCount}
              />
            ) : null}
          </div>
        </main>
      </div>

      {/* Mobile Responsive Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0D2240] border-t border-slate-800 flex items-center justify-around z-40 px-2 text-[10px]">
        <button
          onClick={() => handleTabChange('dashboard')}
          className={`flex flex-col items-center gap-1 p-1 ${
            activeTab === 'dashboard' && !selectedShipmentId ? 'text-[#B7F500]' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => handleTabChange('shipments')}
          className={`flex flex-col items-center gap-1 p-1 ${
            activeTab === 'shipments' && !selectedShipmentId ? 'text-[#B7F500]' : 'text-slate-400'
          }`}
        >
          <Ship className="w-4 h-4" />
          <span>Shipments</span>
        </button>
        {isOps ? (
          <button
            onClick={() => handleTabChange('schedules')}
            className={`flex flex-col items-center gap-1 p-1 ${
              activeTab === 'schedules' ? 'text-[#B7F500]' : 'text-slate-400'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Schedules</span>
          </button>
        ) : (
          <button
            onClick={() => handleTabChange('tracking')}
            className={`flex flex-col items-center gap-1 p-1 ${
              activeTab === 'tracking' ? 'text-[#B7F500]' : 'text-slate-400'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Track</span>
          </button>
        )}
        <button
          onClick={() => setAgentOpen(true)}
          className="flex flex-col items-center gap-1 p-1 text-[#B7F500]"
        >
          <Bot className="w-4 h-4" />
          <span>Agent</span>
        </button>
        <button
          onClick={() => handleTabChange('notifications')}
          className={`relative flex flex-col items-center gap-1 p-1 ${
            activeTab === 'notifications' ? 'text-[#B7F500]' : 'text-slate-400'
          }`}
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-rose-500" />
          )}
          <span>Alerts</span>
        </button>
      </nav>

      {/* Floating Compass Agent Modal */}
      <CompassAgentModal
        isOpen={agentOpen}
        onClose={() => setAgentOpen(false)}
        onSelectShipment={handleSelectShipment}
      />

      {/* Slide-over Notifications Drawer */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onSelectShipment={handleSelectShipment}
        onUnreadChange={setUnreadCount}
      />

      {/* Create Booking Modal for Operations */}
      <CreateBookingModal
        isOpen={createBookingOpen}
        onClose={() => setCreateBookingOpen(false)}
        onSuccess={(id) => {
          setSelectedShipmentId(id);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
