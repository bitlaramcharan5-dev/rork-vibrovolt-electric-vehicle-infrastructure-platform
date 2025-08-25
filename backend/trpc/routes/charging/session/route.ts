import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const chargingSessionSchema = z.object({
  sessionId: z.string(),
});

const startSessionSchema = z.object({
  stationId: z.string(),
  connectorId: z.string(),
});

export const getChargingSessionProcedure = publicProcedure
  .input(chargingSessionSchema)
  .query(async ({ input }) => {
    // Mock real-time charging session data
    return {
      sessionId: input.sessionId,
      status: 'charging',
      battery: Math.floor(Math.random() * 40) + 45, // 45-85%
      power: Math.floor(Math.random() * 50) + 100, // 100-150 kW
      duration: `${Math.floor(Math.random() * 60)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      energyDelivered: Math.floor(Math.random() * 30) + 10, // 10-40 kWh
      cost: Math.floor(Math.random() * 500) + 200, // ₹200-700
      estimatedTimeToFull: Math.floor(Math.random() * 45) + 15, // 15-60 minutes
    };
  });

export const startChargingSessionProcedure = publicProcedure
  .input(startSessionSchema)
  .mutation(async ({ input }) => {
    // Mock session start
    return {
      success: true,
      sessionId: Date.now().toString(),
      stationId: input.stationId,
      connectorId: input.connectorId,
      startTime: new Date().toISOString(),
      status: 'initializing',
    };
  });

export { getChargingSessionProcedure as default };