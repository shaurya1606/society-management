import * as z from 'zod'

export const LoginFormSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
    twoFactorCode: z.string().optional().or(z.literal('')),
})

export const SignupFormSchema = z
    .object({
        firstName: z
            .string()
            .min(2, 'First name must be at least 2 characters long'),
        lastName: z
            .string()
            .min(2, 'Last name must be at least 2 characters long'),
        email: z.string().email('Invalid email address'),
        password: z
            .string()
            .min(6, 'Password must be at least 6 characters long'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    })

export const ResetPasswordFormSchema = z.object({
    email: z.string().email('Invalid email address'),
})

export const NewPasswordFormSchema = z
    .object({
        password: z
            .string()
            .min(6, 'Password must be at least 6 characters long'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
    })

export const settingsSchema = z
    .object({
        name: z
            .string()
            .min(2, 'Name must be at least 2 characters long')
            .optional(),
        email: z.string().email('Invalid email address').optional(),
        role: z
            .enum(['USER', 'ADMIN', 'EMPLOYEE', 'MANAGER', 'SUPER_ADMIN'])
            .optional(),
        isTwoFactorEnabled: z.boolean().optional(),
        password: z
            .string()
            .min(6, 'Password must be at least 6 characters long')
            .optional()
            .or(z.literal('')),
        newPassword: z
            .string()
            .min(6, 'New password must be at least 6 characters long')
            .optional()
            .or(z.literal('')),
    })
    .refine(
        (data) => {
            if (data.password && !data.newPassword) {
                return false
            }
            return true
        },
        {
            message:
                'New password is required when current password is provided',
            path: ['newPassword'],
        }
    )
    .refine(
        (data) => {
            if (data.newPassword && !data.password) {
                return false
            }
            return true
        },
        {
            message: 'Current password is required to set new password',
            path: ['password'],
        }
    )
