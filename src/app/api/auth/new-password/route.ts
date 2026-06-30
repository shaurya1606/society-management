import { NextResponse } from 'next/server'
import { findResetPasswordTokenByToken } from '@/lib/queries/token/select'
import { deleteResetPasswordTokenById } from '@/lib/queries/token/delete'
import { updateUserPasswordByEmail } from '@/lib/queries/users/update'
import { hashPassword } from '@/services/authServices/utils'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { token, password } = body

        if (!token) {
            return NextResponse.json(
                { message: 'Token is required' },
                { status: 400 }
            )
        }

        if (!password || password.length < 6) {
            return NextResponse.json(
                {
                    message: 'Password must be at least 6 characters long',
                },
                { status: 400 }
            )
        }

        // Find the reset password token
        const resetPasswordToken = await findResetPasswordTokenByToken(token)

        if (!resetPasswordToken) {
            return NextResponse.json(
                {
                    message:
                        'Invalid or expired reset link. Please request a new password reset.',
                },
                { status: 400 }
            )
        }

        // Check if token has expired
        const hasExpired = new Date() > new Date(resetPasswordToken.expires)

        if (hasExpired) {
            // Delete expired token
            await deleteResetPasswordTokenById(resetPasswordToken.id)

            return NextResponse.json(
                {
                    message:
                        'Reset link has expired. Please request a new password reset.',
                },
                { status: 400 }
            )
        }

        // Hash the new password
        const hashedPassword = await hashPassword(password)

        // Update user's password
        await updateUserPasswordByEmail(
            resetPasswordToken.email,
            hashedPassword
        )

        // Delete the used token
        await deleteResetPasswordTokenById(resetPasswordToken.id)

        return NextResponse.json(
            {
                message:
                    'Password reset successfully! You can now login with your new password.',
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Password reset error:', error)
        return NextResponse.json(
            { message: 'Something went wrong. Please try again.' },
            { status: 500 }
        )
    }
}
