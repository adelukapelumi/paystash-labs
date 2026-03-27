import * as Crypto from 'expo-crypto';
type SQLiteDatabase = any;

export interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'STASH' | 'WITHDRAW' | 'TRANSFER';
  amount: number;
  timestamp: number;
  status: 'COMPLETED' | 'PENDING_SYNC' | 'PENDING_PAYMENT' | 'FAILED';
  retry_count: number;
  hash: string;
}

export async function recordTransaction(
  db: SQLiteDatabase,
  type: string,
  amount: number,
  status: string
): Promise<string> {
  const id = Crypto.randomUUID();
  const timestamp = Date.now();

  const payload = `${id}|${type}|${amount}|${timestamp}`;
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    payload
  );

  await db.runAsync(
    `INSERT INTO transactions (id, type, amount, timestamp, status, retry_count, hash)
     VALUES (?, ?, ?, ?, ?, 0, ?);`,
    [id, type, amount, timestamp, status, hash]
  );

  return id;
}

export async function getHistory(db: SQLiteDatabase): Promise<Transaction[]> {
  const all = await db.getAllAsync(
    'SELECT * FROM transactions ORDER BY timestamp DESC;'
  );
  return all;
}

export async function clearHistory(db: SQLiteDatabase): Promise<void> {
  await db.runAsync('DELETE FROM transactions;');
}
