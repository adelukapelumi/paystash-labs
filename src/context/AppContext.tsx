/**
 * AppContext.tsx
 * 
 * Central global state management for PayStash.
 * Manages user profile, vault balances, and authentication status.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initVault, getDb } from '../database/DatabaseService';
import { fetchBalances, Balances, getUserProfile, UserProfile } from '../database/VaultDAO';
import { handleRegister, handleLogin, logout as authLogout, getSession, resetVault as authResetVault } from '../engine/authActions';

// ─── Types ──────────────────────────────────────────────────────────────────

// ─── Types ──────────────────────────────────────────────────────────────────

// We use the UserProfile type from VaultDAO for database 
// persistence naming consistency.
export type { UserProfile } from '../database/VaultDAO';

interface AppContextType {
  user: UserProfile | null;
  balances: Balances;
  isAuthenticated: boolean;
  isRegistered: boolean;
  isLoading: boolean;
  isDbReady: boolean; // Flag to prevent external components from querying DB too early
  refreshBalances: () => Promise<void>;
  register: (name: string, phone: string, pin: string) => Promise<void>;
  login: (emailOrPin: string, password?: string) => Promise<boolean>;
  logout: () => void;
  resetVault: () => Promise<void>;
}

// ─── Context Definition ─────────────────────────────────────────────────────

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [balances, setBalances] = useState<Balances>({
    online_balance: 0,
    vault_balance: 0
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDbReady, setIsDbReady] = useState(false);

  // ── Helper: refresh balances from DB ──────────────────────────────
  const refreshBalances = useCallback(async () => {
    if (!isDbReady) return; // Prevent early calls
    try {
      const db = await getDb();
      const currentBalances = await fetchBalances(db);
      setBalances(currentBalances);
    } catch (error) {
      console.error('Failed to refresh balances:', error);
    }
  }, [isDbReady]);

  // ── Action: Register ──────────────────────────────────────────────
  const register = async (name: string, phone: string, pin: string) => {
    if (!isDbReady) {
      throw new Error('Database is not initialized. Please wait.');
    }
    try {
      await handleRegister(name, phone, pin);

      // Update local state
      const db = await getDb();
      const newUser = await getUserProfile(db); // Fetch back the profile we just created
      setUser(newUser);
      setIsRegistered(true);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  // ── Action: Login ────────────────────────────────────────────────
  const login = async (emailOrPin: string, password?: string): Promise<boolean> => {
    if (!isDbReady) return false;
    
    // Admin Bypass check
    if (emailOrPin === 'admin@app.com' && password === 'admin1234') {
        setUser({
            full_name: 'Admin User',
            email: 'admin@app.com',
            phone_number: '0000000000',
            hashed_pin: '0000',
            created_at: new Date().toISOString()
        });
        setIsRegistered(true);
        setIsAuthenticated(true);
        return true;
    }

    try {
      const success = await handleLogin(emailOrPin);
      if (success) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    await authLogout();
    setIsAuthenticated(false);
  };

  const resetVault = async () => {
    await authResetVault();
    setUser(null);
    setIsRegistered(false);
    setIsAuthenticated(false);
  };

  // ── Initialization Logic ──────────────────────────────────────────────
  useEffect(() => {
    const startup = async () => {
      try {
        await initVault();
        const db = await getDb();

        // Mark as ready so other logic can safely query the DB
        setIsDbReady(true);

        // Check for existing user
        const existingUser = await getUserProfile(db);
        if (existingUser) {
          setUser(existingUser);
          setIsRegistered(true);

          // Check for active session
          const hasSession = await getSession();
          if (hasSession) {
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('App bootstrap failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    startup();
  }, []);

  // Sync balances whenever DB becomes ready
  useEffect(() => {
    if (isDbReady) {
      refreshBalances();
    }
  }, [isDbReady, refreshBalances]);

  const value: AppContextType = {
    user,
    balances,
    isAuthenticated,
    isRegistered,
    isLoading,
    isDbReady,
    refreshBalances,
    register,
    login,
    logout,
    resetVault,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};


// ─── Consumer Hook ──────────────────────────────────────────────────────────

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
