import {
    InsertResetPasswordToken,
    InsertTwoFactorConfirmation,
    InsertTwoFactorToken,
    InsertVerificationToken,
    resetPasswordTokensTable,
    twoFactorConfirmationTable,
    twoFactorTokensTable,
    verificationTokensTable,
} from '@/lib/dbconfig/schema'
import { db } from '@/lib/dbconfig/db'

export async function createResetPasswordToken(
    data: Omit<InsertResetPasswordToken, 'id'>
): Promise<InsertResetPasswordToken> {
    const [createdToken] = await db
        .insert(resetPasswordTokensTable)
        .values(data)
        .returning()

    if (!createdToken) {
        throw new Error('Unable to create reset password token')
    }

    return createdToken
}

export async function createVerificationToken(
    data: Omit<InsertVerificationToken, 'id'>
): Promise<InsertVerificationToken> {
    const [createdToken] = await db
        .insert(verificationTokensTable)
        .values(data)
        .returning()

    if (!createdToken) {
        throw new Error('Unable to create verification token')
    }

    return createdToken
}

export async function createTwoFactorToken(
    data: Omit<InsertTwoFactorToken, 'id'>
): Promise<InsertTwoFactorToken> {
    const [createdToken] = await db
        .insert(twoFactorTokensTable)
        .values(data)
        .returning()

    if (!createdToken) {
        throw new Error('Unable to create 2FA token')
    }

    return createdToken
}

export async function createTwoFactorTokenConfirmation(
    data: Omit<InsertTwoFactorConfirmation, 'id'>
): Promise<InsertTwoFactorConfirmation> {
    const [createdToken] = await db
        .insert(twoFactorConfirmationTable)
        .values(data)
        .returning()

    if (!createdToken) {
        throw new Error('Unable to create 2FA token confirmation')
    }

    return createdToken
}
