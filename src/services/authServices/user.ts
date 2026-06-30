import { SignupRequestBody } from '@/lib/types/types'
import { findUserByEmail } from '@/lib/queries/users/select'
import { createUser } from '@/lib/queries/users/insert'
import { UserAlreadyExistsError } from './error'
import {
    hashPassword,
    isUniqueViolationError,
    normalizeSignupPayload,
    toPublicUser,
} from './utils'
import { generateVerificationToken } from './token'
import { sendVerificationEmail } from './mail'

export const userServices = async (payload: SignupRequestBody) => {
    const normalizedPayload = normalizeSignupPayload(payload)
    const existingUser = await findUserByEmail(normalizedPayload.email)

    if (existingUser) {
        throw new UserAlreadyExistsError(normalizedPayload.email)
    }

    const hashedPassword = await hashPassword(normalizedPayload.password)

    let newUser

    const fullName = [normalizedPayload.firstName, normalizedPayload.lastName]
        .map((value) => value.trim())
        .filter(Boolean)
        .join(' ')
        .trim()

    try {
        newUser = await createUser({
            name: fullName.length ? fullName : normalizedPayload.email,
            email: normalizedPayload.email,
            password: hashedPassword,
        })
    } catch (error) {
        if (isUniqueViolationError(error)) {
            throw new UserAlreadyExistsError(normalizedPayload.email)
        }

        throw error
    }

    const verificationToken = await generateVerificationToken({
        email: newUser.email,
    })

    const emailResult = await sendVerificationEmail(
        newUser.email,
        verificationToken.token,
        newUser.name || undefined
    )

    if (!emailResult.success) {
        console.error('Failed to send verification email:', emailResult.error)
        // Still return success for user creation, but indicate email failed
        return {
            user: toPublicUser(newUser),
            message:
                'Account created successfully, but we could not send the verification email. Please request a new one.',
            emailSent: false,
        }
    }

    console.log('Verification token generated:', verificationToken)

    return {
        user: toPublicUser(newUser),
        message:
            'Verification email has been sent to your email address. Please check your inbox.',
        emailSent: true,
    }
}
