import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const updateProfileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
});

export const updateProfileProcedure = publicProcedure
  .input(updateProfileSchema)
  .mutation(async ({ input }) => {
    // Mock profile update
    const { name, email, phone } = input;
    
    // Simulate database update
    return {
      success: true,
      user: {
        id: '1',
        name,
        email,
        phone,
        updatedAt: new Date().toISOString(),
      },
    };
  });

export default updateProfileProcedure;