import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const slotBookingSchema = z.object({
  stationId: z.string(),
  date: z.string(),
  timeSlot: z.string(),
  vehicleType: z.string(),
  duration: z.number(),
});

export const slotBookingProcedure = publicProcedure
  .input(slotBookingSchema)
  .mutation(async ({ input }) => {
    // Mock slot booking
    const { stationId, date, timeSlot, vehicleType, duration } = input;
    
    // Simulate availability check
    const isAvailable = Math.random() > 0.2; // 80% success rate
    
    if (!isAvailable) {
      throw new Error('Selected time slot is no longer available');
    }
    
    return {
      success: true,
      bookingId: Date.now().toString(),
      stationId,
      date,
      timeSlot,
      vehicleType,
      duration,
      estimatedCost: duration * 15, // ₹15 per hour
      status: 'confirmed',
    };
  });

export default slotBookingProcedure;