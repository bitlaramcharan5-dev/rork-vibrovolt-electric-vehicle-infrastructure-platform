import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const emergencyRequestSchema = z.object({
  type: z.enum(['sos', 'mobile_charger', 'towing']),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string(),
  }),
  description: z.string().optional(),
});

export const emergencyRequestProcedure = publicProcedure
  .input(emergencyRequestSchema)
  .mutation(async ({ input }) => {
    // Mock emergency request
    const { type, location, description } = input;
    
    return {
      success: true,
      requestId: Date.now().toString(),
      type,
      location,
      description,
      estimatedArrival: Math.floor(Math.random() * 30) + 15, // 15-45 minutes
      status: 'dispatched',
      contactNumber: '+91 98765 43210',
    };
  });

export default emergencyRequestProcedure;