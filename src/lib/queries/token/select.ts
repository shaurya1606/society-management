import { db } from '@/lib/dbconfig/db'
import {
    resetPasswordTokensTable,
    twoFactorConfirmationTable,
    twoFactorTokensTable,
    verificationTokensTable,
} from '@/lib/dbconfig/schema'
import { eq } from 'drizzle-orm'

export const findVerificationTokenByEmail = async (email: string) => {
    try {
        const verificationToken = await db
            .select()
            .from(verificationTokensTable)
            .where(eq(verificationTokensTable.email, email))
            .limit(1)
            .then((result) => result[0] || null)

        return verificationToken
    } catch (error) {
        console.error('Error finding verification token by email:', error)
        throw new Error('Could not find verification token')
    }
}

export const findVerificationTokenByToken = async (token: string) => {
    try {
        const verificationToken = await db
            .select()
            .from(verificationTokensTable)
            .where(eq(verificationTokensTable.token, token))
            .limit(1)
            .then((result) => result[0] || null)

        return verificationToken
    } catch (error) {
        console.error('Error finding verification token by email:', error)
        throw new Error('Could not find verification token')
    }
}

export const findResetPasswordTokenByToken = async (token: string) => {
    try {
        const resetPasswordToken = await db
            .select()
            .from(resetPasswordTokensTable)
            .where(eq(resetPasswordTokensTable.token, token))
            .limit(1)
            .then((result) => result[0] || null)

        return resetPasswordToken
    } catch (error) {
        console.error('Error finding reset password token by token:', error)
        throw new Error('Could not find reset password token')
    }
}

export const findResetPasswordTokenByEmail = async (email: string) => {
    try {
        const resetPasswordToken = await db
            .select()
            .from(resetPasswordTokensTable)
            .where(eq(resetPasswordTokensTable.email, email))
            .limit(1)
            .then((result) => result[0] || null)

        return resetPasswordToken
    } catch (error) {
        console.error('Error finding reset password token by email:', error)
        throw new Error('Could not find reset password token')
    }
}

export const findTwoFactorTokenByToken = async (token: string) => {
    try {
        const twoFactorToken = await db
            .select()
            .from(twoFactorTokensTable)
            .where(eq(twoFactorTokensTable.token, token))
            .limit(1)
            .then((result) => result[0] || null)

        return twoFactorToken
    } catch (error) {
        console.error('Error finding 2FA token by token:', error)
        throw new Error('Could not find 2FA token')
    }
}

export const findTwoFactorTokenByEmail = async (email: string) => {
    try {
        const twoFactorToken = await db
            .select()
            .from(twoFactorTokensTable)
            .where(eq(twoFactorTokensTable.email, email))
            .limit(1)
            .then((result) => result[0] || null)

        return twoFactorToken
    } catch (error) {
        console.error('Error finding 2FA token by email:', error)
        throw new Error('Could not find 2FA token')
    }
}

export const findTwoFactorTokenConfirmationByUserId = async (
    UserId: string
) => {
    try {
        const twoFactorTokenConfirmation = await db
            .select()
            .from(twoFactorConfirmationTable)
            .where(eq(twoFactorConfirmationTable.userId, UserId))
            .limit(1)
            .then((result) => result[0] || null)

        return twoFactorTokenConfirmation
    } catch (error) {
        console.error('Error finding 2FA token by ID:', error)
        throw new Error('Could not find 2FA token')
    }
}
