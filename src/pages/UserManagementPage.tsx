import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Power,
  Ship,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { localDb } from '../services/storage';
import type { User } from '../types';

interface UserManagementPageProps {
  onSelectShipment: (shipmentId: string) => void;
}

export const UserManagementPage: React.FC<UserManagementPageProps> = ({ onSelectShipment }) => {
  const { user } = useAuth();
  const isAdmin = user?.permissions === 'admin';

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');

  // Create User Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createRole, setCreateRole] = useState<'customer' | 'operations'>('customer');
  const [createName, setCreateName] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createCompany, setCreateCompany] = useState('');
  const [createPhone, setCreatePhone] = useState('');
  const [createPerms, setCreatePerms] = useState<'standard' | 'full' | 'view_only' | 'admin'>('standard');
  const [createPassword, setCreatePassword] = useState('compassvoyage2024');
  const [createError, setCreateError] = useState<string | null>(null);

  // Customer Shipments Drawer
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [customerShipments, setCustomerShipments] = useState<any[]>([]);

  const loadUsers = () => {
    setLoading(true);
    try {
      const list = localDb.getUsers({
        role: roleFilter,
        active: activeFilter,
        search,
      });
      setUsers(list);
    } catch (e) {
      console.error('Failed to load users:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [roleFilter, activeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadUsers();
  };

  const handleToggleActive = (targetUser: User) => {
    if (targetUser.id === user?.id) {
      alert('You cannot deactivate your own active session.');
      return;
    }
    localDb.updateUser(targetUser.id, { is_active: !targetUser.is_active });
    loadUsers();
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    if (!createName || !createEmail || !createCompany) {
      setCreateError('Please fill in required fields.');
      return;
    }

    try {
      localDb.createUser({
        name: createName.trim(),
        email: createEmail.trim(),
        company: createCompany.trim(),
        role: createRole,
        permissions: createRole === 'operations' ? createPerms : 'standard',
        contact_number: createPhone.trim() || undefined,
        is_active: true,
      });

      setShowCreateModal(false);
      setCreateName('');
      setCreateEmail('');
      setCreateCompany('');
      setCreatePhone('');
      loadUsers();
    } catch (err: any) {
      setCreateError(err.message || 'Error creating user.');
    }
  };

  const handleViewCustomerShipments = (cust: User) => {
    setSelectedCustomer(cust);
    const { shipments } = localDb.getShipments({ customerId: cust.id, limit: 50 });
    setCustomerShipments(shipments);
  };

  return (
    <div className="space-y-6 relative">
      {/* Background radial glow */}
      <div className="absolute -top-10 left-1/3 w-96 h-96 bg-[#B7F500]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="pb-2 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-[#B7F500]" />
            <span>Customers & User Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage customer accounts, assign operational permissions, activate/deactivate access, and inspect customer bookings.
          </p>
        </div>
        <button
          onClick={() => {
            setCreateRole('customer');
            setShowCreateModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-[#B7F500] hover:bg-[#a3dc00] text-[#0D2240] text-xs font-extrabold flex items-center gap-1.5 transition shadow-lg shadow-[#B7F500]/10 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Customer Account</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-[#0D2240] border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl backdrop-blur-md">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-96">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or company..."
              className="w-full bg-[#081426] border border-slate-700 focus:border-[#B7F500] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none transition"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto text-xs">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#081426] border border-slate-700 text-slate-200 rounded-xl px-3 py-2 focus:border-[#B7F500] focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers</option>
            <option value="operations">Operations Staff</option>
          </select>
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="bg-[#081426] border border-slate-700 text-slate-200 rounded-xl px-3 py-2 focus:border-[#B7F500] focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="true">Active Accounts</option>
            <option value="false">Deactivated</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#0D2240] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#081426] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">User Details</th>
                <th className="py-3.5 px-4">Company Name</th>
                <th className="py-3.5 px-4">Role & Access</th>
                <th className="py-3.5 px-4">Contact Phone</th>
                <th className="py-3.5 px-4">Linked Shipments</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    Loading users database...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    No users found matching search criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isCurrentUser = u.id === user?.id;
                  return (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">{u.name}</div>
                        <div className="text-slate-400 font-mono text-[11px]">{u.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{u.company}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                            u.role === 'operations'
                              ? 'bg-blue-950 text-blue-300 border border-blue-600/30'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {u.role === 'operations' ? `Ops (${u.permissions})` : 'Customer'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-mono">
                        {u.contact_number || '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        {u.role === 'customer' ? (
                          <button
                            onClick={() => handleViewCustomerShipments(u)}
                            className="font-bold text-[#B7F500] hover:underline flex items-center gap-1"
                          >
                            <Ship className="w-3.5 h-3.5" />
                            <span>{u.shipment_count} Shipment(s)</span>
                          </button>
                        ) : (
                          <span className="text-slate-500 italic">Operations Staff</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            u.is_active
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/20'
                              : 'bg-rose-950/60 text-rose-300 border border-rose-500/20'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.is_active ? 'bg-emerald-400' : 'bg-rose-400'
                            }`}
                          />
                          {u.is_active ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {u.role === 'customer' && (
                            <button
                              onClick={() => handleViewCustomerShipments(u)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                              title="View Customer Shipments"
                            >
                              Shipments
                            </button>
                          )}
                          <button
                            disabled={isCurrentUser}
                            onClick={() => handleToggleActive(u)}
                            className={`p-1.5 rounded-lg text-xs font-bold transition ${
                              u.is_active
                                ? 'bg-rose-950/40 text-rose-400 hover:bg-rose-900/60'
                                : 'bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/60'
                            } disabled:opacity-30 disabled:cursor-not-allowed`}
                            title={
                              isCurrentUser
                                ? 'Cannot deactivate yourself'
                                : u.is_active
                                ? 'Deactivate Account'
                                : 'Activate Account'
                            }
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Shipments Drawer/Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#0D2240] border border-slate-700 rounded-2xl w-full max-w-3xl p-6 shadow-2xl text-slate-100 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Ship className="w-5 h-5 text-[#B7F500]" />
                  <span>Shipments for {selectedCustomer.company}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Contact: {selectedCustomer.name} ({selectedCustomer.email})
                </p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3">
              {customerShipments.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No shipments currently registered to this customer account.
                </div>
              ) : (
                customerShipments.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      onSelectShipment(s.id);
                      setSelectedCustomer(null);
                    }}
                    className="p-3.5 rounded-xl bg-[#081426] border border-slate-800 hover:border-[#B7F500]/40 cursor-pointer transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white group-hover:text-[#B7F500]">
                          {s.booking_id}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 font-semibold text-slate-300">
                          {s.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 mt-1">
                        {s.origin_code} → {s.destination_code} • {s.carrier} ({s.vessel})
                      </div>
                    </div>
                    <div className="text-xs font-bold text-[#B7F500] group-hover:underline">
                      Inspect Timeline →
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#0D2240] border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-white text-base">
                Create New {createRole === 'customer' ? 'Customer' : 'Operations'} User
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              {isAdmin && (
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Account Role
                  </label>
                  <select
                    value={createRole}
                    onChange={(e) => setCreateRole(e.target.value as any)}
                    className="w-full bg-[#081426] border border-slate-700 text-white rounded-xl px-3 py-2"
                  >
                    <option value="customer">Customer Consignee</option>
                    <option value="operations">Operations Staff</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Miller"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  className="w-full bg-[#081426] border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. logistics@customer.com"
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  className="w-full bg-[#081426] border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Company / Organization *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NorthStar Home Living Ltd."
                  value={createCompany}
                  onChange={(e) => setCreateCompany(e.target.value)}
                  className="w-full bg-[#081426] border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+1 (555) 012-3456"
                  value={createPhone}
                  onChange={(e) => setCreatePhone(e.target.value)}
                  className="w-full bg-[#081426] border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              {createRole === 'operations' && isAdmin && (
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Operations Permission Tier
                  </label>
                  <select
                    value={createPerms}
                    onChange={(e) => setCreatePerms(e.target.value as any)}
                    className="w-full bg-[#081426] border border-slate-700 text-white rounded-xl px-3 py-2"
                  >
                    <option value="full">Full Operations Access</option>
                    <option value="view_only">View-Only Access</option>
                    <option value="admin">Administrator (User Management)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Initial Password
                </label>
                <input
                  type="text"
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                  className="w-full bg-[#081426] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#B7F500] text-[#0D2240] font-bold hover:bg-[#a3dc00]"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
