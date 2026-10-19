import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { localDb } from '../services/storage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  switchDemoUser: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetDemoData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const active = localDb.getActiveUser();
      setUser(active);
    } catch (e) {
      console.error('Failed to load active session:', e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, pass: string) => {
    try {
      const result = localDb.authenticate(email, pass);
      if (result.success && result.user) {
        setUser(result.user);
        return { success: true };
      }
      return { success: false, error: result.error || 'Authentication failed' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Login error' };
    }
  };

  const logout = async () => {
    localDb.setActiveUser(null);
    setUser(null);
  };

  const switchDemoUser = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const allUsers = localDb.getUsers();
    const target = allUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!target) {
      return { success: false, error: 'Demo account not found.' };
    }
    if (!target.is_active) {
      return { success: false, error: 'This demo account is deactivated.' };
    }
    localDb.setActiveUser(target);
    setUser(target);
    return { success: true };
  };

  const resetDemoData = () => {
    localDb.resetToCleanDemo();
    refreshUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,
        switchDemoUser,
        resetDemoData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
