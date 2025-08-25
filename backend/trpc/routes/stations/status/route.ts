import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const stationStatusSchema = z.object({
  stationId: z.string(),
});

export const stationStatusProcedure = publicProcedure
  .input(stationStatusSchema)
  .query(async ({ input }) => {
    // Mock real-time station status
    return {
      stationId: input.stationId,
      available: Math.floor(Math.random() * 6) + 1,
      total: 6,
      realTimeUpdates: {
        lastUpdated: new Date().toISOString(),
        occupancy: Math.floor(Math.random() * 100),
        avgWaitTime: Math.floor(Math.random() * 30),
      },
    };
  });

export default stationStatusProcedure;