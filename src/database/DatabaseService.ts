/**
 * DatabaseService.ts
 *
 * Manages the SQLite database instance and initialization lifecycle.
 */

import { INITIAL_SQL } from './VaultSchema';
import { computeIntegrityHash } from './VaultDAO';

import { Platform } from 'react-native';

const DB_NAME = 'paystash_vault.db';

let dbInstance: any | null = null;

/**
 * Opens the database connection. Singleton pattern.
 */
export async function getDb(): Promise<any> {
  if (dbInstance) return dbInstance;

  if (Platform.OS === 'web') {
    console.log('🌐 Web Platform detected: Using memory database mock.');
    dbInstance = {
      getFirstAsync: async (query: string, params: any[] = []) => {
        if (query.includes('FROM wallet_state')) {
          return { online_balance: 5000, vault_balance: 0, integrity_hash: 'MOCK_HASH' };
        }
        if (query.includes('FROM user_profile')) {
          // Return null to trigger registration flow for testing
          return null; 
        }
        return null;
      },
      runAsync: async () => ({ lastInsertRowId: 1, changes: 1 }),
      execAsync: async () => {},
      getAllAsync: async () => [],
      withTransactionAsync: async (cb: () => Promise<void>) => await cb(),
    };
  } else {
    // Dynamically require expo-sqlite to avoid bundling issues on web
    try {
      const SQLite = require('expo-sqlite');
      dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
    } catch (e) {
      console.warn('Failed to load expo-sqlite, falling back to mock.');
    }
  }
  
  return dbInstance;
}

/**
 * Initializes the vault database structure and seeds initial data if needed.
 */
export async function initVault(): Promise<void> {
  const db = await getDb();

  // 🚨 TEMPORARY: Force Re-Initialization as requested by user
  // This handles the schema mismatch by ensuring tables are recreated with new columns.
  console.log('🧹 Forcing database schema reset...');
  await db.execAsync(`
    DROP TABLE IF EXISTS wallet_state;
    DROP TABLE IF EXISTS transactions;
    DROP TABLE IF EXISTS user_profile;
  `);

  // Execute the SQL blueprint from VaultSchema
  await db.execAsync(INITIAL_SQL);

  // ── Schema Migrations ─────────────────────────────────────────────────
  // These handle databases created before certain columns were added.
  // ALTER TABLE is idempotent here: if the column already exists, the
  // error is silently caught and we move on.

  // Migration 1: Add retry_count to transactions (Phase 4)
  try {
    await db.execAsync(
      `ALTER TABLE transactions ADD COLUMN retry_count INTEGER NOT NULL DEFAULT 0;`
    );
    console.log('🔧 Migration: Added retry_count column.');
  } catch {
    // Column already exists — safe to ignore
  }

  // Seed the wallet with test balances (₦5,000 online) if this is a first run.
  // We use the computed hash for (5000,0) to ensure immediate integrity validity.
  const initialHash = computeIntegrityHash(5000, 0);
  await db.runAsync(
    `INSERT INTO wallet_state (id, online_balance, vault_balance, integrity_hash)
     SELECT 1, 5000, 0, ?
     WHERE NOT EXISTS (SELECT 1 FROM wallet_state WHERE id = 1);`,
    [initialHash]
  );

  console.log('✅ PayStash Vault initialized via DatabaseService.');
}
