type SQLiteDatabase = any;
import { getUserProfile } from '../database/VaultDAO';

/**
 * Backend API Configuration
 * Pointing to Permanent Cloud Deployment (Railway)
 */
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://paystash-server-production.up.railway.app/api/v1';
const API_KEY = process.env.PAYSTASH_API_KEY || 'default-secret-key-for-dev';

export interface SyncResult {
  synced: number;
  failed: number;
}

/**
 * syncWithBackend (Audit Reconcilliation)
 * 
 * Future: This will POST to ${BASE_URL}/sync
 * Current: Uploads transaction metadata to a mock Audit Server (httpstat.us)
 * to ensure consistency between local and cloud ledgers.
 */
export async function syncWithBackend(db: SQLiteDatabase): Promise<SyncResult> {
  let synced = 0;
  let failed = 0;

  // Find all transactions that need reconciliation
  const pendingTxs = await db.getAllAsync(
    "SELECT id, amount, timestamp, hash FROM transactions WHERE status = 'PENDING_SYNC';"
  );

  if (pendingTxs.length === 0) {
    return { synced, failed };
  }

  for (const tx of pendingTxs) {
    try {
      const metadata = {
        tx_id: tx.id,
        amount: tx.amount,
        timestamp: tx.timestamp,
        hash: tx.hash,
        sync_type: 'AUDIT_LOG_UPLOADING'
      };

      console.log(`📤 Sending Audit Metadata to ${BASE_URL} (MOCK):`, JSON.stringify(metadata));

      // Audit Server Reconciliation
      const response = await fetch(`${BASE_URL}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify(metadata)
      });

      if (response.status === 200) {
        // Successfully reconciled with cloud ledger
        await db.runAsync(
          "UPDATE transactions SET status = 'SYNCED' WHERE id = ?;",
          [tx.id]
        );
        console.log(`✅ Transaction ${tx.id.slice(0, 8)} Reconciled.`);
        synced++;
      } else {
        throw new Error(`Audit Server rejected with status: ${response.status}`);
      }
    } catch (error: any) {
      console.error(`Audit Sync Failed for ${tx.id.slice(0, 8)}:`, error);
      await db.runAsync(
        "UPDATE transactions SET retry_count = retry_count + 1 WHERE id = ?;",
        [tx.id]
      );
      failed++;
    }
  }

  return { synced, failed };
}

