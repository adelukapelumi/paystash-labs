# PayStash Data Schema V1: The Offline Vault

## 1. Table: wallet_state
*Purpose: Strict separation of Online vs. Offline funds.*
- id: INTEGER PRIMARY KEY (Value is always 1)
- online_balance: DECIMAL NOT NULL (Last verified server balance)
- stash_balance: DECIMAL NOT NULL (Money locked for offline use)
- last_sync_at: DATETIME DEFAULT CURRENT_TIMESTAMP
- integrity_hash: TEXT NOT NULL (🛡️ Seal to prevent balance tampering)

## 2. Table: local_ledger
*Purpose: Fractional spending record for offline transactions.*
- tx_id: UUID PRIMARY KEY (Unique fingerprint)
- amount: DECIMAL NOT NULL
- type: TEXT CHECK(type IN ('DEBIT', 'CREDIT', 'STASH_IN'))
- signature: TEXT NOT NULL (🛡️ Cryptographic proof of transaction)
- timestamp: DATETIME DEFAULT CURRENT_TIMESTAMP
- status: TEXT DEFAULT 'PENDING'

## 3. Table: sync_queue
*Purpose: The "Smart Queue" waiting for network connectivity.*
- queue_id: INTEGER PRIMARY KEY AUTOINCREMENT
- payload: TEXT NOT NULL (Encrypted transaction blob)
- retry_count: INTEGER DEFAULT 0
- status: TEXT DEFAULT 'QUEUED' (QUEUED, SYNCING, FAILED)
- local_reference: UUID (Foreign key to local_ledger)

## 4. Table: user_profile
*Purpose: Identity and Security storage.*
- id: INTEGER PRIMARY KEY (Value is always 1)
- full_name: TEXT NOT NULL
- phone_number: TEXT NOT NULL
- hashed_pin: TEXT NOT NULL
- created_at: DATETIME DEFAULT CURRENT_TIMESTAMP
