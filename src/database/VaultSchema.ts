/**
 * VaultSchema.ts
 *
 * The SQL blueprint and initialization logic for PayStash's Offline Vault.
 * These CREATE TABLE statements are derived directly from /docs/SCHEMA_V1.md.
 * Any schema changes MUST be reflected in that document first.
 */

import { computeIntegrityHash } from './VaultDAO';

const SQLite: any = null; // Typing hack for web bundling

// ─── SQL Blueprint ──────────────────────────────────────────────────────────

export const INITIAL_SQL = `
  -- 1. wallet_state: Strict separation of Online vs. Offline funds.
  CREATE TABLE IF NOT EXISTS wallet_state (
    id              INTEGER  PRIMARY KEY CHECK (id = 1),
    online_balance  DECIMAL  NOT NULL,
    vault_balance   DECIMAL  NOT NULL,
    last_sync_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    integrity_hash  TEXT     NOT NULL
  );

  -- 2. local_ledger: Fractional spending record for offline transactions.
  CREATE TABLE IF NOT EXISTS local_ledger (
    tx_id      TEXT     PRIMARY KEY,
    amount     DECIMAL  NOT NULL,
    type       TEXT     NOT NULL CHECK (type IN ('DEBIT', 'CREDIT', 'STASH_IN')),
    signature  TEXT     NOT NULL,
    timestamp  DATETIME DEFAULT CURRENT_TIMESTAMP,
    status     TEXT     DEFAULT 'PENDING'
  );

  -- 3. sync_queue: The "Smart Queue" waiting for network connectivity.
  CREATE TABLE IF NOT EXISTS sync_queue (
    queue_id         INTEGER PRIMARY KEY AUTOINCREMENT,
    payload          TEXT    NOT NULL,
    retry_count      INTEGER DEFAULT 0,
    status           TEXT    DEFAULT 'QUEUED' CHECK (status IN ('QUEUED', 'SYNCING', 'FAILED')),
    local_reference  TEXT    REFERENCES local_ledger(tx_id)
  );

  -- 4. user_profile: Identity and Security storage.
  CREATE TABLE IF NOT EXISTS user_profile (
    id            INTEGER PRIMARY KEY CHECK (id = 1),
    full_name     TEXT    NOT NULL,
    phone_number  TEXT    NOT NULL,
    hashed_pin    TEXT    NOT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- 5. transactions: The Immutable Ledger.
  CREATE TABLE IF NOT EXISTS transactions (
    id          TEXT    PRIMARY KEY,
    type        TEXT    NOT NULL CHECK (type IN ('DEPOSIT', 'STASH', 'WITHDRAW', 'TRANSFER')),
    amount      REAL    NOT NULL,
    timestamp   INTEGER NOT NULL,
    status      TEXT    NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('COMPLETED', 'PENDING_SYNC', 'PENDING_PAYMENT', 'FAILED')),
    retry_count INTEGER NOT NULL DEFAULT 0,
    hash        TEXT    NOT NULL
  );
`;

// ─── Database Name ──────────────────────────────────────────────────────────

const DB_NAME = 'paystash_vault.db';

// ─── Initialization ─────────────────────────────────────────────────────────

/**
 * Opens (or creates) the PayStash vault database, executes all
 * CREATE TABLE statements, and seeds the initial wallet_state row
 * if the table is empty.
 *
 * The seed hash is computed from (0, 0) so that validateVault()
 * passes immediately on a fresh install.
 *
 * @returns {Promise<SQLite.SQLiteDatabase>} The open database handle for further operations.
 */
export async function initializeDatabase(): Promise<any> {
  const db = await SQLite.openDatabaseAsync(DB_NAME);

  // Create all three tables
  await db.execAsync(INITIAL_SQL);

  // Seed the wallet with zeroed balances if this is a first run
  const initialHash = computeIntegrityHash(0, 0);
  await db.runAsync(
    `INSERT INTO wallet_state (id, online_balance, stash_balance, integrity_hash)
     SELECT 1, 0, 0, ?
     WHERE NOT EXISTS (SELECT 1 FROM wallet_state WHERE id = 1);`,
    [initialHash]
  );

  console.log('✅ PayStash Vault initialized successfully.');
  return db;
}

// ─── Query Helpers ──────────────────────────────────────────────────────────

export interface WalletState {
  id: number;
  online_balance: number;
  stash_balance: number;
  last_sync_at: string;
  integrity_hash: string;
}

/**
 * Reads the single wallet_state row from the vault.
 *
 * @param {SQLite.SQLiteDatabase} db - The database connection.
 * @returns {Promise<WalletState | null>} The wallet state row or null if missing.
 */
export async function getWalletState(
  db: any
): Promise<WalletState | null> {
  const result = await db.getFirstAsync(
    'SELECT * FROM wallet_state WHERE id = 1;'
  );
  return result ?? null;
}
