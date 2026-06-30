import { NextResponse } from 'next/server'
import { signIn } from '@/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/route'
import { AuthError } from 'next-auth'
import {
    generateTwoFactorToken,
    generateVerificationToken,
} from '@/services/authServices/token'
import { findUserByEmail } from '@/lib/queries/users/select'
import {
    sendTwoFactorTokenEmail,
    sendVerificationEmail,
} from '@/services/authServices/mail'
import {
    findTwoFactorTokenByEmail,
    findTwoFactorTokenConfirmationByUserId,
} from '@/lib/queries/token/select'
import {
    deleteTwoFactorConfirmationById,
    deleteTwoFactorTokenById,
} from '@/lib/queries/token/delete'
import { createTwoFactorTokenConfirmation } from '@/lib/queries/token/insert'

export async function POST(request: Request) {
    const { email, password, twoFactorCode } = (await request.json()) as {
        email?: string
        password?: string
        twoFactorCode?: string
    }

    if (!email) {
        return NextResponse.json(
            { message: 'Email is required' },
            { status: 400 }
        )
    }

    if (!password) {
        return NextResponse.json(
            { message: 'Password is required' },
            { status: 400 }
        )
    }

    const normalizedEmail = email.trim().toLowerCase()

    const existingUser = await findUserByEmail(normalizedEmail)

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return NextResponse.json(
            { message: 'Invalid email or password' },
            { status: 401 }
        )
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken({
            email: existingUser.email,
        })

        const emailResult = await sendVerificationEmail(
            existingUser.email,
            verificationToken.token,
            existingUser.name || undefined
        )

        console.log('Sending verification email to:', existingUser.email)
        console.log('Verification token:', verificationToken.token)
        console.log('Email result:', emailResult)

        if (!emailResult.success) {
            console.error(
                'Failed to send verification email:',
                emailResult.error
            )
            return NextResponse.json(
                {
                    message:
                        'Email not verified. Failed to send verification email. Please try again later.',
                    emailSent: false,
                },
                { status: 403 }
            )
        }

        console.log('Resent verification token generated:', verificationToken)

        return NextResponse.json(
            {
                message:
                    'Email not verified. A new verification email has been sent to your inbox.',
                emailSent: true,
            },
            { status: 200 }
        )
    }
    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        try {
            if (twoFactorCode) {
                const sanitizedCode = twoFactorCode.trim()

                if (!/^\d{6}$/.test(sanitizedCode)) {
                    return NextResponse.json(
                        {
                            message:
                                'Invalid two-factor authentication code format.',
                        },
                        { status: 400 }
                    )
                }

                const twoFactorToken = await findTwoFactorTokenByEmail(
                    existingUser.email
                )
                if (!twoFactorToken || twoFactorToken.token !== sanitizedCode) {
                    return NextResponse.json(
                        { message: 'Invalid two-factor authentication code' },
                        { status: 401 }
                    )
                }

                const hasExpired = new Date(twoFactorToken.expires) < new Date()

                if (hasExpired) {
                    await deleteTwoFactorTokenById(twoFactorToken.id)
                    return NextResponse.json(
                        {
                            message:
                                'Two-factor authentication code has expired',
                        },
                        { status: 401 }
                    )
                }

                await deleteTwoFactorTokenById(twoFactorToken.id)

                const existingTwoFactorConfirmation =
                    await findTwoFactorTokenConfirmationByUserId(
                        existingUser.id
                    )
                if (existingTwoFactorConfirmation) {
                    await deleteTwoFactorConfirmationById(
                        existingTwoFactorConfirmation.id
                    )
                }

                await createTwoFactorTokenConfirmation({
                    userId: existingUser.id,
                    expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
                })
            } else {
                const twoFactorToken = await generateTwoFactorToken(
                    existingUser.email
                )

                const emailResult = await sendTwoFactorTokenEmail(
                    existingUser.email,
                    twoFactorToken.token,
                    existingUser.name || undefined
                )

                if (!emailResult.success) {
                    console.error(
                        'Failed to send 2FA code email:',
                        emailResult.error
                    )
                    return NextResponse.json(
                        {
                            message:
                                'Two-factor authentication is enabled but we could not send the verification code. Please try again later.',
                            twoFactorRequired: true,
                        },
                        { status: 500 }
                    )
                }

                return NextResponse.json(
                    {
                        message:
                            'Two-factor authentication is enabled. A verification code has been sent to your email.',
                        twoFactorRequired: true,
                    },
                    { status: 200 }
                )
            }
        } catch (error) {
            console.error('Two-factor authentication error:', error)
            return NextResponse.json(
                {
                    message:
                        'Unable to process two-factor authentication at this time. Please try again.',
                },
                { status: 500 }
            )
        }
    }

    // Here you would typically add logic to authenticate the user

    try {
        const result = await signIn('credentials', {
            email: normalizedEmail,
            password,
            redirect: false,
        })

        // signIn may return false/null when sign-in is not allowed (our callback returns false for 2FA/verification)
        if (result === null || result === false) {
            // treat this as sign-in blocked (could be 2FA requirement or unverified email)
            return NextResponse.json(
                {
                    message: 'Sign-in blocked (credentials rejected)',
                    twoFactorBlocked: true,
                },
                { status: 403 }
            )
        }

        // If NextAuth returns an object with an `error` property, surface it as 401
        if (
            result &&
            typeof result === 'object' &&
            'error' in result &&
            (result as { error?: string }).error
        ) {
            const authError = (result as { error?: string }).error

            return NextResponse.json(
                { message: authError || 'Invalid credentials' },
                { status: 401 }
            )
        }
    } catch (error: unknown) {
        // Normalize AuthError or any thrown error to a JSON response instead of letting it 500
        if (error instanceof AuthError) {
            if (error.type === 'CredentialsSignin') {
                return NextResponse.json(
                    { message: 'Invalid credentials' },
                    { status: 401 }
                )
            }
            return NextResponse.json(
                { message: 'Authentication error' },
                { status: 401 }
            )
        }

        // Fallback: return the error message with 500 so client can see what happened
        const message =
            error instanceof Error && error.message
                ? error.message
                : 'Authentication error'
        console.error('Sign-in error:', error)
        return NextResponse.json(
            { message },
            { status: 500 }
        )
    }
    return NextResponse.json(
        {
            message: 'User logged in successfully',
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        },
        { status: 200 }
    )
}
