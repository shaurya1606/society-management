import { NextResponse } from 'next/server'
import { findVerificationTokenByToken } from '@/lib/queries/token/select'
import { deleteVerificationTokenById } from '@/lib/queries/token/delete'
import { updateUserEmailVerifiedByEmail } from '@/lib/queries/users/update'

export async function POST(request: Request) {
    try {
        const { token } = await request.json()

        console.log('Verification request received for token:', token)

        if (!token) {
            console.log('No token provided in request')
            return NextResponse.json(
                { message: 'Token is required' },
                { status: 400 }
            )
        }

        // Find the verification token
        const verificationToken = await findVerificationTokenByToken(token)

        if (!verificationToken) {
            console.log('Token not found in database:', token)
            return NextResponse.json(
                {
                    message:
                        'Invalid or expired verification link. Please request a new verification email.',
                },
                { status: 400 }
            )
        }

        console.log('Token found:', {
            id: verificationToken.id,
            email: verificationToken.email,
            expires: verificationToken.expires,
        })

        // Check if token has expired
        const hasExpired = new Date() > new Date(verificationToken.expires)

        if (hasExpired) {
            console.log('Token has expired:', {
                expires: verificationToken.expires,
                now: new Date(),
            })
            // Delete expired token
            await deleteVerificationTokenById(verificationToken.id)

            return NextResponse.json(
                {
                    message:
                        'Verification link has expired. Please login again to receive a new verification email.',
                },
                { status: 400 }
            )
        }

        // Update user's emailVerified field by email
        console.log('Updating emailVerified for user:', verificationToken.email)
        await updateUserEmailVerifiedByEmail(verificationToken.email)

        // Delete the used token
        console.log('Deleting used token:', verificationToken.id)
        await deleteVerificationTokenById(verificationToken.id)

        console.log(
            'Email verification successful for:',
            verificationToken.email
        )
        return NextResponse.json(
            { message: 'Email verified successfully! You can now login.' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Email verification error:', error)
        return NextResponse.json(
            { message: 'Something went wrong during verification.' },
            { status: 500 }
        )
    }
}
