import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const addFundsSchema = z.object({
  amount: z.number().min(100).max(10000),
  paymentMethod: z.string(),
});

export const getWalletProcedure = publicProcedure
  .query(async () => {
    // Mock wallet data
    return {
      balance: 2450,
      loyaltyPoints: 1250,
      transactions: [
        {
          id: '1',
          type: 'debit',
          amount: 678,
          description: 'Charging at Banjara Hills',
          date: '2024-12-15T14:30:00Z',
          status: 'completed',
        },
        {
          id: '2',
          type: 'credit',
          amount: 1000,
          description: 'Wallet top-up',
          date: '2024-12-14T10:15:00Z',
          status: 'completed',
        },
        {
          id: '3',
          type: 'debit',
          amount: 492,
          description: 'Charging at Charminar',
          date: '2024-12-14T16:45:00Z',
          status: 'completed',
        },
      ],
    };
  });

export const addFundsProcedure = publicProcedure
  .input(addFundsSchema)
  .mutation(async ({ input }) => {
    // Mock payment processing
    const { amount, paymentMethod } = input;
    
    // Simulate payment gateway
    const success = Math.random() > 0.1; // 90% success rate
    
    if (!success) {
      throw new Error('Payment failed. Please try again.');
    }
    
    return {
      success: true,
      transactionId: Date.now().toString(),
      amount,
      paymentMethod,
      newBalance: 2450 + amount,
    };
  });

export { getWalletProcedure as default };