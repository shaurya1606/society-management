import { db } from '@/lib/dbconfig/db'
import { eq } from 'drizzle-orm'
import {
    SelectResetPasswordToken,
    SelectVerificationToken,
    resetPasswordTokensTable,
    twoFactorConfirmationTable,
    twoFactorTokensTable,
    verificationTokensTable,
} from '@/lib/dbconfig/schema'

export async function deleteResetPasswordTokenById(
    id: SelectResetPasswordToken['id']
) {
    await db
        .delete(resetPasswordTokensTable)
        .where(eq(resetPasswordTokensTable.id, id))
}

export async function deleteResetPasswordTokenByEmail(email: string) {
    await db
        .delete(resetPasswordTokensTable)
        .where(eq(resetPasswordTokensTable.email, email))
}

export async function deleteResetPasswordTokenByToken(token: string) {
    await db
        .delete(resetPasswordTokensTable)
        .where(eq(resetPasswordTokensTable.token, token))
}

export async function deleteVerificationTokenById(
    id: SelectVerificationToken['id']
) {
    await db
        .delete(verificationTokensTable)
        .where(eq(verificationTokensTable.id, id))
}

export async function deleteVerificationTokenByToken(token: string) {
    await db
        .delete(verificationTokensTable)
        .where(eq(verificationTokensTable.token, token))
}

export async function deleteVerificationTokenByEmail(email: string) {
    await db
        .delete(verificationTokensTable)
        .where(eq(verificationTokensTable.email, email))
}

export async function deleteTwoFactorTokenById(id: string) {
    await db.delete(twoFactorTokensTable).where(eq(twoFactorTokensTable.id, id))
}

export async function deleteTwoFactorConfirmationById(id: string) {
    await db
        .delete(twoFactorConfirmationTable)
        .where(eq(twoFactorConfirmationTable.id, id))
}
