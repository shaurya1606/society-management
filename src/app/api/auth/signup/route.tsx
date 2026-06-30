import { NextResponse } from 'next/server'
import { UserAlreadyExistsError } from '@/services/authServices/error'
import { parseSignupRequest } from '@/services/authServices/utils'
import { userServices } from '@/services/authServices/user'

export async function POST(request: Request) {
    let payload: unknown

    try {
        payload = await request.json()
    } catch (error) {
        console.error('Signup payload parse error', error)
        return NextResponse.json(
            { message: 'Invalid JSON payload' },
            { status: 400 }
        )
    }

    const parsed = parseSignupRequest(payload)

    if (!parsed.success) {
        return NextResponse.json(
            { message: 'Invalid signup payload', errors: parsed.errors },
            { status: 400 }
        )
    }

    try {
        const result = await userServices(parsed.data)
        return NextResponse.json(
            {
                message: result.message,
                user: result.user,
                emailSent: result.emailSent,
            },
            {
                status: 201,
            }
        )
    } catch (error) {
        if (error instanceof UserAlreadyExistsError) {
            return NextResponse.json(
                { message: error.message },
                { status: 409 }
            )
        }

        console.error('Signup error', error)
        return NextResponse.json(
            { message: 'Something went wrong. Please try again.' },
            { status: 500 }
        )
    }
}
