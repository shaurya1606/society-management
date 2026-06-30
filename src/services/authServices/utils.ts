import bcrypt from 'bcryptjs'
import type { SelectUser } from '@/lib/dbconfig/schema'
import type { SignupRequestBody } from '@/lib/types/types'
import { signupRequestSchema } from './schema'

export const BCRYPT_SALT_ROUNDS = 10

export type PublicUser = Pick<
    SelectUser,
    'id' | 'name' | 'email' | 'emailVerified'
>

export type SignupParseResult =
    | { success: true; data: SignupRequestBody }
    | { success: false; errors: string[] }

export const normalizeSignupPayload = (
    payload: SignupRequestBody
): SignupRequestBody => ({
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    email: payload.email.trim().toLowerCase(),
    password: payload.password.trim(),
})

export const hashPassword = (password: string) =>
    bcrypt.hash(password, BCRYPT_SALT_ROUNDS)

export const toPublicUser = (user: SelectUser): PublicUser => ({
    id: user.id,
    name: user.name ?? '',
    email: user.email ?? '',
    emailVerified: user.emailVerified ?? null,
})

export const buildSignupSuccessPayload = (user: PublicUser) => ({
    message: 'User signed up successfully',
    user,
})

type PostgresError = {
    code?: string
}

export const parseSignupRequest = (payload: unknown): SignupParseResult => {
    const result = signupRequestSchema.safeParse(payload)

    if (!result.success) {
        const fieldErrors = Object.values(result.error.flatten().fieldErrors)
            .flat()
            .filter((message): message is string => Boolean(message))

        return {
            success: false,
            errors: fieldErrors.length
                ? fieldErrors
                : ['Invalid signup payload'],
        }
    }

    return {
        success: true,
        data: result.data,
    }
}

export const isUniqueViolationError = (error: unknown): boolean => {
    if (!error || typeof error !== 'object') {
        return false
    }

    const postgresError = error as PostgresError
    return postgresError.code === '23505'
}
