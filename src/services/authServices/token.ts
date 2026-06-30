import { v4 as uuidv4 } from 'uuid'
import {
    findResetPasswordTokenByEmail,
    findTwoFactorTokenByEmail,
    findVerificationTokenByEmail,
} from '@/lib/queries/token/select'
import {
    deleteResetPasswordTokenById,
    deleteTwoFactorTokenById,
    deleteVerificationTokenById,
} from '@/lib/queries/token/delete'
import {
    createResetPasswordToken,
    createTwoFactorToken,
    createVerificationToken,
} from '@/lib/queries/token/insert'
import {
    InsertTwoFactorToken,
    InsertVerificationToken,
} from '@/lib/dbconfig/schema'
import crypto from 'crypto'

export const generateResetPasswordToken = async ({
    email,
}: {
    email: string
}): Promise<InsertVerificationToken> => {
    const token = uuidv4()
    const expires = new Date(new Date().getTime() + 3600 * 1000)

    const existingToken = await findResetPasswordTokenByEmail(email)

    if (existingToken) {
        await deleteResetPasswordTokenById(existingToken.id)
    }

    const resetPasswordToken = await createResetPasswordToken({
        email,
        token,
        expires,
    })

    return resetPasswordToken
}

export const generateVerificationToken = async ({
    email,
}: {
    email: string
}): Promise<InsertVerificationToken> => {
    const token = uuidv4()

    const expires = new Date(new Date().getTime() + 3600 * 1000)

    const existingToken = await findVerificationTokenByEmail(email)

    if (existingToken) {
        await deleteVerificationTokenById(existingToken.id)
    }

    const verificationToken = await createVerificationToken({
        email,
        token,
        expires,
    })

    return verificationToken
}

export const generateTwoFactorToken = async (
    email: string
): Promise<InsertTwoFactorToken> => {
    const token = crypto.randomInt(100000, 999999).toString()
    const expires = new Date(new Date().getTime() + 10 * 60 * 1000) // 10 minutes expiration

    const existingToken = await findTwoFactorTokenByEmail(email)

    if (existingToken) {
        await deleteTwoFactorTokenById(existingToken.id)
    }

    const twoFactorToken = await createTwoFactorToken({
        email,
        token,
        expires,
    })

    if (!twoFactorToken) {
        throw new Error('Unable to create 2FA token')
    }

    return twoFactorToken
}
