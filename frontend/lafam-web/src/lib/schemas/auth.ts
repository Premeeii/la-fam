import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Please enter valid email'),
    password: z.string().min(1, 'Please enter your password'),
});


export const registerSchema = z.object({
    email: z.string().email('Please enter valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    displayName: z.string().min(4, 'Name must be at least 4 characters long'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
