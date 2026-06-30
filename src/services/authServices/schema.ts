import { z } from 'zod'

export const signupRequestSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(2, 'First name must be at least 2 characters long'),
    lastName: z
        .string()
        .trim()
        .min(2, 'Last name must be at least 2 characters long'),
    email: z.string().trim().toLowerCase().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export type SignupRequestDTO = z.infer<typeof signupRequestSchema>
