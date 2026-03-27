/**
 * authActions.ts
 *
 * "Headless" Authentication Logic.
 * Coordinates DB, Security, and Session Persistence.
 *
 * NOTE: expo-secure-store is native-only. On web we fall back to localStorage.
 */

import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { getDb } from '../database/DatabaseService';
import { registerUser, getUserProfile, UserProfile } from '../database/VaultDAO';
import { hashPIN, verifyPIN } from './SecurityService';

const SESSION_KEY = 'paystash_session_v1';

// ─── Platform-aware Session Storage ─────────────────────────────────────────

async function setSession(value: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(SESSION_KEY, value);
  } else {
    await SecureStore.setItemAsync(SESSION_KEY, value);
  }
}

async function clearSession(): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(SESSION_KEY);
  } else {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  }
}

async function readSession(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(SESSION_KEY);
  }
  return await SecureStore.getItemAsync(SESSION_KEY);
}

// ─── Auth Actions ─────────────────────────────────────────────────────────

/**
 * Registers a new user, hashes their PIN, and creates a session.
 */
export async function handleRegister(
  fullName: string,
  phone: string,
  pin: string
): Promise<void> {
  const db = await getDb();

  // 1. security: Hash the PIN with salt
  const hashedPin = await hashPIN(pin);

  // 2. database: Persist user profile
  const newUser: UserProfile = {
    full_name: fullName,
    phone_number: phone,
    hashed_pin: hashedPin,
  };
  await registerUser(db, newUser);

  // 3. session: Persist login state
  await setSession('active');
  console.log('✅ Registration complete. Session active.');
}

/**
 * Verifies login credentials and creates a session.
 */
export async function handleLogin(pin: string): Promise<boolean> {
  const db = await getDb();

  // 1. database: Fetch user
  const user = await getUserProfile(db);
  if (!user) {
    console.warn('Login failed: No user found.');
    return false;
  }

  // 2. security: Verify PIN
  const isValid = await verifyPIN(pin, user.hashed_pin);
  if (!isValid) {
    console.warn('Login failed: Invalid PIN.');
    return false;
  }

  // 3. session: Persist login state
  await setSession('active');
  console.log('✅ Login successful. Session active.');
  return true;
}

/**
 * Atomic logout: Clears session.
 */
export async function logout(): Promise<void> {
  await clearSession();
  console.log('🔒 Logout complete. Session cleared.');
}

/**
 * DEV ONLY: Resets the vault by deleting the user profile and clearing the session.
 * This allows re-registration with a fresh PIN.
 */
export async function resetVault(): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM user_profile WHERE id = 1;');
  await clearSession();
  console.log('🗑️ Vault reset complete. User profile deleted.');
}

/**
 * Checks if a valid session exists.
 */
export async function getSession(): Promise<boolean> {
  const session = await readSession();
  return session === 'active';
}

