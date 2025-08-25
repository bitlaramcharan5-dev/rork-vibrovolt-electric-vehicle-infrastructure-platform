import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(6),
});

export const registerProcedure = publicProcedure
  .input(registerSchema)
  .mutation(async ({ input }) => {
    // Mock registration - in real app, save to database
    const { name, email, phone, password } = input;
    
    // Simulate user creation
    return {
      success: true,
      user: {
        id: Date.now().toString(),
        name,
        email,
        phone,
      },
      token: 'mock-jwt-token',
    };
  });

export default registerProcedure;