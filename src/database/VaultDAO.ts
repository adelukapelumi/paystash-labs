/**
 * VaultDAO.ts — Data Access Object
 *
 * This is the ONLY file allowed to read from or write to the database.
 * All UI code must go through these functions.
 *
 * Dependency: Requires a database handle from VaultSchema.initializeDatabase().
 */

type SQLiteDatabase = any;
import { recordTransaction } from '../engine/LedgerService';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Balances {
  online_balance: number;
  vault_balance: number;
}

export interface VaultStatus {
  isValid: boolean;
  expected: string;
  actual: string;
}

// ─── Integrity Hashing (Cryptographer) ──────────────────────────────────────

/**
 * A vault-secret salt. In production this would live in secure storage
 * (e.g. Android Keystore / iOS Keychain). Hardcoded here for V1.
 */
const VAULT_SECRET = 'PAYSTASH_VAULT_KEY_V1';

/**
 * Computes a deterministic integrity hash from the two balances.
 *
 * Algorithm (V1):
 *   1. Build a canonical string:  "PAYSTASH_VAULT_KEY_V1|<online>|<stash>"
 *   2. Run a simple DJB2a hash (xor variant) over the bytes.
 *   3. Convert to an unsigned 32-bit hex string.
 *
 * This catches manual edits to the SQLite file.  A production app
 * would upgrade this to HMAC-SHA256 via expo-crypto.
 *
 * @param {number} onlineBalance - The current online balance.
 * @param {number} stashBalance - The current stash balance.
 * @returns {string} The computed 8-character hex hash.
 */
export function computeIntegrityHash(
  onlineBalance: number,
  vaultBalance: number
): string {
  // Enhanced Canonical Payload: delimiter prevents "10.01|5.00" vs "10.015|0.00" collisions
  const payload = `VAULT_V2|${onlineBalance.toFixed(2)}:::${vaultBalance.toFixed(2)}|${VAULT_SECRET}`;

  // DJB2a (xor variant)
  let hash = 5381;
  for (let i = 0; i < payload.length; i++) {
    hash = ((hash << 5) + hash) ^ payload.charCodeAt(i);
  }

  return (hash >>> 0).toString(16).toUpperCase().padStart(8, '0');
}

// ─── Read Operations ────────────────────────────────────────────────────────

/**
 * Returns the current Online and Stash balances.
 *
 * @param {SQLiteDatabase} db - The database connection.
 * @returns {Promise<Balances>} The current balances.
 * @throws {Error} If the wallet_state row is missing.
 */
export async function fetchBalances(db: SQLiteDatabase): Promise<Balances> {
  const row = await db.getFirstAsync(
    'SELECT online_balance, vault_balance FROM wallet_state WHERE id = 1;'
  );
  if (!row) {
    throw new Error('VAULT CORRUPTED: wallet_state row is missing.');
  }
  return row;
}

// ─── Write Operations ───────────────────────────────────────────────────────

/**
 * Atomically moves `amount` from online_balance → stash_balance.
 *
 * This runs inside a database TRANSACTION so either both columns
 * update or neither does.  It also recalculates the integrity_hash.
 *
 * @param {SQLiteDatabase} db - The database connection.
 * @param {number} amount - The amount to move to stash (must be > 0).
 * @returns {Promise<Balances>} The new balances after the transfer.
 * @throws {Error} If amount <= 0, or if online_balance is insufficient.
 */
export async function stashFunds(
  db: SQLiteDatabase,
  amount: number
): Promise<Balances> {
  if (amount <= 0) {
    throw new Error('Amount must be greater than zero.');
  }

  // 1. Read current balances
  const current = await fetchBalances(db);

  if (current.online_balance < amount) {
    throw new Error(
      `Insufficient online balance. Available: ₦${current.online_balance.toFixed(2)}, Requested: ₦${amount.toFixed(2)}`
    );
  }

  // 2. Calculate new values
  const newOnline = +(current.online_balance - amount).toFixed(2);
  const newVault = +(current.vault_balance + amount).toFixed(2);
  const newHash = computeIntegrityHash(newOnline, newVault);

  // 3. Atomic update: balance + ledger in a single transaction
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `UPDATE wallet_state
         SET online_balance = ?,
             vault_balance  = ?,
             integrity_hash = ?,
             last_sync_at   = CURRENT_TIMESTAMP
       WHERE id = 1;`,
      [newOnline, newVault, newHash]
    );

    // Write to the immutable ledger within the same atomic block
    // Status is PENDING_SYNC until the sync engine confirms with the server
    await recordTransaction(db, 'STASH', amount, 'PENDING_SYNC');
  });

  console.log(
    `💰 Stashed ₦${amount.toFixed(2)}  |  Online: ₦${newOnline}  →  Vault: ₦${newVault}  |  Hash: ${newHash}`
  );

  return { online_balance: newOnline, vault_balance: newVault };
}

/**
 * Atomically adds funds to the online_balance (Wallet Top Up)
 * @param db - The database connection
 * @param amount - The amount to add
 */
export async function addOnlineFunds(db: SQLiteDatabase, amount: number): Promise<Balances> {
  if (amount <= 0) throw new Error('Amount must be positive');
  const current = await fetchBalances(db);
  const newOnline = +(current.online_balance + amount).toFixed(2);
  const newHash = computeIntegrityHash(newOnline, current.vault_balance);

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `UPDATE wallet_state SET online_balance = ?, integrity_hash = ?, last_sync_at = CURRENT_TIMESTAMP WHERE id = 1;`,
      [newOnline, newHash]
    );
    await recordTransaction(db, 'TOP_UP', amount, 'PENDING_SYNC');
  });

  return { online_balance: newOnline, vault_balance: current.vault_balance };
}

/**
 * Atomically deducts funds from the online_balance (Withdraw/Transfer)
 * @param db - The database connection
 * @param amount - The amount to deduct
 */
export async function deductOnlineFunds(db: SQLiteDatabase, amount: number): Promise<Balances> {
  if (amount <= 0) throw new Error('Amount must be positive');
  const current = await fetchBalances(db);
  if (current.online_balance < amount) throw new Error('Insufficient wallet balance');
  
  const newOnline = +(current.online_balance - amount).toFixed(2);
  const newHash = computeIntegrityHash(newOnline, current.vault_balance);

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `UPDATE wallet_state SET online_balance = ?, integrity_hash = ?, last_sync_at = CURRENT_TIMESTAMP WHERE id = 1;`,
      [newOnline, newHash]
    );
    await recordTransaction(db, 'WITHDRAW', -amount, 'PENDING_SYNC');
  });

  return { online_balance: newOnline, vault_balance: current.vault_balance };
}

// ─── Integrity Validation ───────────────────────────────────────────────────

/**
 * Validates that the integrity_hash stored in the database matches
 * the hash re-computed from the current balances.
 *
 * If someone manually edits the .db file to inflate their balance,
 * the hash will NOT match and this function will report the tampering.
 *
 * @param {SQLiteDatabase} db - The database connection.
 * @returns {Promise<VaultStatus>} The validation status object.
 */
export async function validateVault(db: SQLiteDatabase): Promise<VaultStatus> {
  const row = await db.getFirstAsync(
    'SELECT online_balance, vault_balance, integrity_hash FROM wallet_state WHERE id = 1;'
  );

  if (!row) {
    return { isValid: false, expected: '—', actual: 'MISSING ROW' };
  }

  const expected = computeIntegrityHash(row.online_balance, row.vault_balance);
  const actual = row.integrity_hash;

  const isValid = expected === actual;

  if (!isValid) {
    console.warn(
      `🚨 VAULT INTEGRITY FAILURE!  Expected: ${expected}  |  Found: ${actual}`
    );
  } else {
    console.log(`🛡️ Vault integrity verified.  Hash: ${actual}`);
  }

  return { isValid, expected, actual };
}

// ─── User Profile Operations ───────────────────────────────────────────────

export interface UserProfile {
  full_name: string;
  phone_number: string;
  hashed_pin: string;
  email?: string;
  created_at?: string;
}

/**
 * Persists the user's registration data to the vault.
 * 
 * @param db - The database connection.
 * @param user - The user profile data (full name, phone, hashed PIN).
 */
export async function registerUser(
  db: SQLiteDatabase,
  user: UserProfile
): Promise<void> {
  await db.runAsync(
    `INSERT INTO user_profile (id, full_name, phone_number, hashed_pin)
     VALUES (1, ?, ?, ?);`,
    [user.full_name, user.phone_number, user.hashed_pin]
  );
  console.log(`👤 User registered: ${user.full_name}`);
}

/**
 * Fetches the registered user profile if it exists.
 * 
 * @param db - The database connection.
 * @returns {Promise<UserProfile | null>} The user profile or null.
 */
export async function getUserProfile(
  db: SQLiteDatabase
): Promise<UserProfile | null> {
  return await db.getFirstAsync(
    'SELECT full_name, phone_number, hashed_pin FROM user_profile WHERE id = 1;'
  );
}
/**
 * DEBUG ONLY: Force-injects a specific online balance.
 * Recalculates the integrity hash so validation passes.
 * 
 * @param db - The database connection.
 * @param amount - The new online balance to inject.
 */
export async function debug_injectOnlineBalance(
  db: SQLiteDatabase,
  amount: number
): Promise<void> {
  const current = await fetchBalances(db);
  const newOnline = amount;
  const newHash = computeIntegrityHash(newOnline, current.vault_balance);

  await db.runAsync(
    `UPDATE wallet_state
     SET online_balance = ?,
         integrity_hash = ?,
         last_sync_at   = CURRENT_TIMESTAMP
     WHERE id = 1;`,
    [newOnline, newHash]
  );
  console.log(`🛠️ DEBUG: Injected ₦${amount} online balance. New hash: ${newHash}`);
}
