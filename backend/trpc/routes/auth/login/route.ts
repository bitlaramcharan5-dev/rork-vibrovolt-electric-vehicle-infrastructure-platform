import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginProcedure = publicProcedure
  .input(loginSchema)
  .mutation(async ({ input }) => {
    // Mock authentication - in real app, verify against database
    const { email, password } = input;
    
    if (email === 'demo@vibrovolt.com' && password === 'demo123') {
      return {
        success: true,
        user: {
          id: '1',
          name: 'Demo User',
          email: 'demo@vibrovolt.com',
          phone: '+91 98765 43210',
        },
        token: 'mock-jwt-token',
      };
    }
    
    throw new Error('Invalid credentials');
  });

export default loginProcedure;