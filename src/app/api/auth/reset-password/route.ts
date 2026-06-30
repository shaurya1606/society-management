import { ResetPasswordFormSchema } from '@/lib/schema/authSchema'
import { NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/queries/users/select'
import { sendPasswordResetEmail } from '@/services/authServices/mail'
import { generateResetPasswordToken } from '@/services/authServices/token'

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const result = ResetPasswordFormSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                {
                    message: 'Invalid email address',
                    errors: result.error.issues,
                },
                { status: 400 }
            )
        }

        const { email } = result.data

        const existingUser = await findUserByEmail(email)

        if (!existingUser) {
            // For security, don't reveal if user exists or not
            return NextResponse.json(
                {
                    message: 'A password reset link has been sent.',
                    emailSent: true,
                },
                { status: 200 }
            )
        }

        const resetPasswordToken = await generateResetPasswordToken({ email })
        const emailResult = await sendPasswordResetEmail(
            resetPasswordToken.email,
            resetPasswordToken.token,
            existingUser.name || undefined
        )

        if (!emailResult.success) {
            console.error(
                'Failed to send password reset email:',
                emailResult.error
            )
            return NextResponse.json(
                {
                    message:
                        'Failed to send password reset email. Please try again later.',
                    emailSent: false,
                },
                { status: 500 }
            )
        }

        console.log('Password reset requested for:', email)

        return NextResponse.json(
            {
                message: 'A password reset link has been sent.',
                emailSent: true,
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
