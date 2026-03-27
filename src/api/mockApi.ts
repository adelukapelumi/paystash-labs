/**
 * mockApi.ts
 * Simulates latency and validation of backend API responses.
 */

// Simple delay function
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const MockAPI = {
  identity: {
    verify: async (payload: { bvn: string; nin: string }) => {
      await delay(2000); // Simulate network request

      if (!payload.bvn || !payload.nin) {
        throw new Error('BVN and NIN are required.');
      }

      if (payload.bvn.length !== 11 || payload.nin.length !== 11) {
        throw new Error('Verification failed, check your details');
      }

      return {
        success: true,
        message: 'Identity verified successfully',
      };
    },
  },
  wallet: {
    topup: async (payload: { amount: number; card_number: string; expiry: string; cvv: string }) => {
      await delay(2000);

      if (!payload.amount || !payload.card_number || !payload.expiry || !payload.cvv) {
        throw new Error('Transaction failed, try again');
      }

      if (payload.amount <= 0) {
        throw new Error('Invalid amount');
      }

      return {
        success: true,
        message: `₦${payload.amount.toLocaleString()} added successfully`,
      };
    },
    withdraw: async (payload: { amount: number; account: string; bank: string }) => {
      await delay(2000);

      if (!payload.amount || !payload.account || !payload.bank) {
        throw new Error('Transfer failed, check details');
      }

      if (payload.account.length !== 10) {
        throw new Error('Transfer failed, check details');
      }

      return {
        success: true,
        message: `₦${payload.amount.toLocaleString()} sent successfully`,
      };
    },
  },
};
