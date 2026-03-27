/**
 * KorapayService.ts
 * 
 * Real Korapay Sandbox API integration.
 * Handles charge initialization via the Korapay Merchant API.
 * 
 * SECURITY: The SECRET_KEY is pulled from environment variables
 * via Expo's app.config.js extra field. It is NEVER hardcoded.
 */

import axios, { AxiosError } from 'axios';

// ─── Configuration ──────────────────────────────────────────────────────────

const BASE_URL = 'https://api.korapay.com/merchant/api/v1';

/**
 * Retrieves the Korapay Secret Key from environment config.
 * Expo automatically loads .env and exposes vars via process.env.
 */
function getSecretKey(): string {
  const key = process.env.KORAPAY_SECRET_KEY ?? '';

  if (!key) {
    console.warn('⚠️ KORAPAY_SECRET_KEY is not configured. API calls will fail.');
  }
  return key;
}

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ChargeInitRequest {
  amount: number;
  email: string;
  name: string;       // Customer full name (required by Korapay)
  reference: string;  // Our transaction UUID (idempotency key)
  userId: string;     // Internal User ID to map webhook payload
}

export interface ChargeInitResponse {
  status: boolean;
  message: string;
  data: {
    reference: string;
    checkout_url: string;
    [key: string]: unknown;
  };
}

export interface KorapayError {
  status: boolean;
  message: string;
  statusCode: number;
}

// ─── API Methods ────────────────────────────────────────────────────────────

/**
 * Initializes a charge via the Korapay Sandbox API.
 * 
 * Uses the transaction UUID as the `reference` field, which serves
 * as our Idempotency Key — Korapay will reject duplicate references,
 * ensuring at-most-once processing.
 * 
 * @param request - The charge initialization parameters.
 * @returns The Korapay response with checkout URL on success.
 * @throws KorapayError with status code on API failure.
 */
export async function initializeCharge(
  request: ChargeInitRequest
): Promise<ChargeInitResponse> {
  const secretKey = getSecretKey();

  try {
    const payload = {
      amount: Math.round(request.amount * 100), // Korapay expects amount in kobo
      redirect_url: 'https://paystash.app/callback',
      currency: 'NGN',
      reference: request.reference,
      notification_url: 'https://paystash.app/webhook',
      customer: {
        name: request.name,
        email: 'test-user@paystash.com', // Hardcoded test email
      },
      metadata: {
        userId: request.userId // Pass user ID to backend via webhook metadata
      }
    };

    console.log("Full Korapay Payload:", JSON.stringify(payload));

    const response = await axios.post<ChargeInitResponse>(
      `${BASE_URL}/charges/initialize`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000, // 15 second timeout
      }
    );

    console.log(`🏦 Korapay OK: ref=${request.reference.slice(0, 8)}… → ${response.data.data?.checkout_url ?? 'no url'}`);
    return response.data;

  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const statusCode = axiosError.response?.status ?? 0;
    const message = axiosError.response?.data?.message ?? axiosError.message ?? 'Unknown error';

    console.error(`🏦 Korapay FAIL [${statusCode}]: ${message}`);

    throw {
      status: false,
      message,
      statusCode,
    } as KorapayError;
  }
}
