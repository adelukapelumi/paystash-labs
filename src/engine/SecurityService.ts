/**
 * SecurityService.ts
 * 
 * Provides cryptographic utilities for PIN hashing and verification.
 * Uses SHA-256 with a salt to prevent Rainbow Table attacks.
 */

import * as Crypto from 'expo-crypto';

// Secret project salt — in a production environment, this would be 
// stored securely or generated uniquely per user.
const SECURITY_SALT = 'PAYSTASH_SECURE_SALT_V1';

/**
 * Hashes a user's PIN using SHA-256 with a project-specific salt.
 * 
 * @param pin - The raw PIN string to hash.
 * @returns A promise that resolves to the hex representation of the salted hash.
 */
export async function hashPIN(pin: string): Promise<string> {
  const saltedPin = `${pin}${SECURITY_SALT}`;

  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    saltedPin
  );

  return hash;
}

/**
 * Verifies if a raw PIN attempt matches a stored hash.
 * 
 * @param input - The raw PIN attempt from the user.
 * @param storedHash - The previously generated hash to compare against.
 * @returns A promise that resolves to true if they match, false otherwise.
 */
export async function verifyPIN(input: string, storedHash: string): Promise<boolean> {
  const inputHash = await hashPIN(input);
  return inputHash === storedHash;
}
